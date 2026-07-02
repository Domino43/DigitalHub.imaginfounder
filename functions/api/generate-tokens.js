// API endpoint to generate download tokens after successful payment
// Called by the SuccessPage to create secure download links

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { orderId, productIds } = body;

  if (!orderId || !productIds || !Array.isArray(productIds)) {
    return new Response(JSON.stringify({ error: 'Missing orderId or productIds' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Import token creator
  const { createDownloadToken } = await import('./download-token.js');

  // Generate a token for each product
  const tokens = await Promise.all(
    productIds.map(async (productId) => {
      const token = await createDownloadToken(productId, orderId, env);
      return { productId, token };
    })
  );

  return new Response(JSON.stringify({ tokens }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}