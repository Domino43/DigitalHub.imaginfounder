# DigitalHub Storefront

React + Vite + Tailwind CSS digital products storefront.

## Deploy on Cloudflare Pages

### Build Settings (enter these in Cloudflare dashboard):
- **Framework preset:** None (or Vite if available)
- **Build command:** `cd apps/web && npm install && npm run build`
- **Build output directory:** `dist/apps/web`
- **Environment variables:** `NODE_VERSION = 20`

### That's it! Cloudflare Pages will:
1. Clone your repo
2. Run the build command
3. Serve the static files from `dist/apps/web`
4. Auto-redeploy on every push to `Web-server` branch

## Local Development
```bash
cd apps/web
npm install
npm run dev
```
