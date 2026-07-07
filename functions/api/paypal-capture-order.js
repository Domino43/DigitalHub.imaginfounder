/**
 * PayPal Capture Order Endpoint
 * Captures payment after customer approves
 * 
 * POST /api/paypal-capture-order
 * Body: { orderID: "PayPal-Order-ID" }
 */

const PAYPAL_API_BASE = 'https://api-m.paypal.com'; // Production
// const PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com'; // Sandbox

/**
 * Get PayPal access token
 */
async function getPayPalAccessToken(env) {
  const auth = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET}`);
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Capture PayPal order
 */
async function captureOrder(orderID, env) {
  const accessToken = await getPayPalAccessToken(env);

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal capture failed:', error);
    throw new Error('Failed to capture PayPal order');
  }

  const capture = await response.json();
  return capture;
}

/**
 * Extract product IDs from captured order
 */
function extractProductIds(captureData) {
  const productIds = [];
  
  if (captureData.purchase_units) {
    for (const unit of captureData.purchase_units) {
      if (unit.items) {
        for (const item of unit.items) {
          if (item.sku) {
            productIds.push(item.sku);
          }
        }
      }
    }
  }
  
  return productIds;
}

/**
 * Main handler
 */
export async function onRequest(context) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    const { orderID } = await request.json();

    if (!orderID) {
      return new Response(JSON.stringify({ error: 'Missing orderID' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const captureData = await captureOrder(orderID, env);
    const productIds = extractProductIds(captureData);

    return new Response(JSON.stringify({
      ...captureData,
      productIds, // Add extracted product IDs for download token generation
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Capture error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
