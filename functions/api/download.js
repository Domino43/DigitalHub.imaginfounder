// Product ID to filename mapping
const PRODUCT_FILES = {
  "mock-hello-fall-planner-collection": "hello-fall-planner-collection.pdf",
  "mock-everyday-essentials-planner-pack": "everyday-essentials-planner-pack.pdf",
  "mock-student-study-planner-pack": "student-study-planner-pack.pdf",
  "mock-cozy-kitchen-routine-planner": "cozy-kitchen-routine-planner.pdf",
  "mock-start-here-kit": "start-here-kit.pdf",
  "mock-artdisplay-gallery-app": "artdisplay-gallery-app.zip",
  "mock-auraui-design-system": "auraui-social-media-calendar.pdf",
  "mock-codeswift-markdown-editor": "codeswift-writing-studio.pdf",
  "mock-streetwear-tshirt-vector-pack": "streetwear-tshirt-vector-pack.zip",
  "mock-warm-tone-stock-photos": "warm-tone-wall-art-set.pdf",
  "mock-eliza-website-template": "website-template.zip",
  "mock-premium-aesthetic-daily-planner": "premium-aesthetic-daily-planner.pdf",
  "mock-digital-stickers-collection": "digital-stickers-bundle.zip",
  "mock-magical-forest-adventures": "magical-forest-adventures-book.pdf",
  "mock-anxiety-sleep-reset-planner": "anxiety-sleep-reset-planner.pdf",
  "mock-wellness-gratitude-journal": "mindful-morning-reset-journal.pdf",
  "mock-adhd-budget-planner": "adhd-budget-habit-planner.pdf",
  "mock-handwritten-font-bundle": "audrey-script-font-bundle.pdf",
  "mock-wellness-website-template": "bloom-wellness-website-template.pdf",
  "mock-dragon-childrens-book": "dragon-and-lilys-adventure.pdf",
  "mock-tshirt-design-bundle": "trendy-tshirt-graphics.zip",
  "mock-flux-flow-ui-kit": "flux-flow-ui-kit.pdf",
  "mock-productivity-os-notion": "productivity-os-notion-template.pdf",
  "mock-premium-stock-photos": "premium-stock-photo-collection.pdf"
};

// Content types for different file extensions
const CONTENT_TYPES = {
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  ".fig": "application/octet-stream",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function getContentType(filename) {
  const ext = filename.substring(filename.lastIndexOf('.'));
  return CONTENT_TYPES[ext] || 'application/octet-stream';
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const productId = url.searchParams.get('product');

  if (!token || !productId) {
    return new Response(JSON.stringify({ error: 'Missing token or product parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Verify the token
  const { verifyDownloadToken } = await import('./download-token.js');
  const verification = await verifyDownloadToken(token, env);

  if (!verification.valid) {
    return new Response(JSON.stringify({ error: verification.error }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Check that the token matches the requested product
  if (verification.payload.productId !== productId) {
    return new Response(JSON.stringify({ error: 'Token does not match product' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Get the filename for this product
  const filename = PRODUCT_FILES[productId];
  if (!filename) {
    return new Response(JSON.stringify({ error: 'Product not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Fetch the file from the GitHub private repo
  const githubToken = env?.GITHUB_TOKEN;
  const repoUrl = env?.GITHUB_REPO_URL || 'https://github.com/Domino43/DigitalHub.imaginfounder';

  // Extract owner/repo from URL
  const repoMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/?#]+?)(?:\.git)?\/?$/);
  if (!repoMatch) {
    return new Response(JSON.stringify({ error: 'Invalid repo configuration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const owner = repoMatch[1];
  const repo = repoMatch[2];
  const branch = 'Web-server';
  const filePath = `apps/web/downloads/${filename}`;

  const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;

  try {
    const githubResp = await fetch(githubApiUrl, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'DigitalHub-Storefront'
      }
    });

    if (!githubResp.ok) {
      return new Response(JSON.stringify({ 
        error: 'File not found in repository',
        details: `GitHub API returned ${githubResp.status}`
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const fileBuffer = await githubResp.arrayBuffer();
    const contentType = getContentType(filename);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch file', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle OPTIONS for CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
