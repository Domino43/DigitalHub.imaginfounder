/**
 * PayPal Create Order Endpoint
 * Creates a PayPal order from cart items
 * 
 * POST /api/paypal-create-order
 * Body: { items: [{ id, title, price_in_cents, quantity }] }
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
 * Create PayPal order
 */
async function createOrder(items, env) {
  const accessToken = await getPayPalAccessToken(env);

  // Calculate total
  const totalCents = items.reduce((sum, item) => sum + (item.price_in_cents * item.quantity), 0);
  const totalUSD = (totalCents / 100).toFixed(2);

  // Build PayPal order structure
  const orderData = {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: totalUSD,
        breakdown: {
          item_total: {
            currency_code: 'USD',
            value: totalUSD,
          },
        },
      },
      items: items.map(item => ({
        name: item.title,
        sku: item.id, // Store product ID in SKU for later retrieval
        quantity: item.quantity.toString(),
        unit_amount: {
          currency_code: 'USD',
          value: (item.price_in_cents / 100).toFixed(2),
        },
      })),
    }],
    application_context: {
      brand_name: 'DigitalHub',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: `${env.SITE_URL || 'https://digitalhub-storefront.pages.dev'}/success`,
      cancel_url: `${env.SITE_URL || 'https://digitalhub-storefront.pages.dev'}/checkout`,
    },
  };

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal order creation failed:', error);
    throw new Error('Failed to create PayPal order');
  }

  const order = await response.json();
  return order;
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
    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid items' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const order = await createOrder(items, env);

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
