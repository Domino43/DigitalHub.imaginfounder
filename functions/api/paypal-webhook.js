/**
 * PayPal Webhook Handler
 * Verifies and processes PayPal payment notifications
 * 
 * Webhook URL: https://digitalhub.imaginfounder.com/api/paypal-webhook
 * 
 * Required Environment Variables:
 * - PAYPAL_CLIENT_ID: Your PayPal Client ID
 * - PAYPAL_SECRET: Your PayPal Secret Key
 * - PAYPAL_WEBHOOK_ID: Your PayPal Webhook ID (from PayPal Dashboard)
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
 * Verify webhook signature
 */
async function verifyWebhookSignature(request, env) {
  const body = await request.text();
  const headers = Object.fromEntries(request.headers);

  const accessToken = await getPayPalAccessToken(env);

  const verificationRequest = {
    auth_algo: headers['paypal-auth-algo'],
    cert_url: headers['paypal-cert-url'],
    transmission_id: headers['paypal-transmission-id'],
    transmission_sig: headers['paypal-transmission-sig'],
    transmission_time: headers['paypal-transmission-time'],
    webhook_id: env.PAYPAL_WEBHOOK_ID,
    webhook_event: JSON.parse(body),
  };

  const response = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(verificationRequest),
  });

  const result = await response.json();
  return result.verification_status === 'SUCCESS';
}

/**
 * Process completed payment
 */
async function processPayment(event, env) {
  const orderId = event.resource.id;
  const purchase_units = event.resource.purchase_units || [];
  
  // Extract product IDs from purchase units
  const productIds = [];
  for (const unit of purchase_units) {
    if (unit.items) {
      for (const item of unit.items) {
        // Item SKU contains our product ID
        if (item.sku) {
          productIds.push(item.sku);
        }
      }
    }
  }

  // Log the order (you could save to KV, D1, or external DB here)
  console.log('Payment completed:', {
    orderId,
    productIds,
    amount: event.resource.purchase_units[0]?.amount,
    payer: event.resource.payer?.email_address,
    timestamp: event.create_time,
  });

  // In a real system, you'd save this to a database
  // For now, we'll rely on the order ID verification
  
  return {
    orderId,
    productIds,
    success: true,
  };
}

/**
 * Main webhook handler
 */
export async function onRequest(context) {
  const { request, env } = context;

  // Only accept POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Verify webhook signature
    const isValid = await verifyWebhookSignature(request, env);
    
    if (!isValid) {
      console.error('Invalid webhook signature');
      return new Response('Invalid signature', { status: 401 });
    }

    // Parse webhook event
    const body = await request.text();
    const event = JSON.parse(body);

    console.log('Webhook event:', event.event_type);

    // Process different event types
    switch (event.event_type) {
      case 'CHECKOUT.ORDER.COMPLETED':
      case 'PAYMENT.CAPTURE.COMPLETED':
        await processPayment(event, env);
        break;
      
      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.REFUNDED':
        console.log('Payment denied or refunded:', event.resource.id);
        break;
      
      default:
        console.log('Unhandled event type:', event.event_type);
    }

    return new Response('Webhook processed', { 
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
