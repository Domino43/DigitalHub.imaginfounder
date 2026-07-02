// Secure Download Token Generator & Validator
// This module handles creating and verifying signed download tokens

// In production, this secret should be set as an environment variable
// in Cloudflare Pages dashboard: DOWNLOAD_SECRET
const DEFAULT_SECRET = "d1g1t4lhUb_s3cur3_d0wnl04d_k3y_2026";

function getSecret(env) {
  return env?.DOWNLOAD_SECRET || DEFAULT_SECRET;
}

// Simple HMAC implementation using Web Crypto API (available in Workers)
async function hmacSign(data, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function hmacVerify(data, signature, secret) {
  const expected = await hmacSign(data, secret);
  return expected === signature;
}

// Token format: base64(payload).signature
// Payload: { productId, orderId, exp (unix timestamp) }
export async function createDownloadToken(productId, orderId, env) {
  const secret = getSecret(env);
  const exp = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days
  const payload = { productId, orderId, exp };
  const payloadStr = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  const signature = await hmacSign(payloadStr, secret);
  return `${payloadStr}.${signature}`;
}

export async function verifyDownloadToken(token, env) {
  const secret = getSecret(env);
  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false, error: 'Invalid token format' };

  const [payloadStr, signature] = parts;
  const valid = await hmacVerify(payloadStr, signature, secret);
  if (!valid) return { valid: false, error: 'Invalid signature' };

  try {
    const payload = JSON.parse(atob(payloadStr.replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'Token expired' };
    }
    return { valid: true, payload };
  } catch (e) {
    return { valid: false, error: 'Invalid payload' };
  }
}