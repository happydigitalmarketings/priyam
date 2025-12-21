# Next.js E‑Commerce (Scaffold)

This scaffold contains backend API routes, Mongoose models, lib helpers, admin pages (Tailwind), frontend pages (products, product detail, cart, checkout), and a seed script.

## Quick start (local)
1. Download and extract the project ZIP.
2. Create a `.env.local` file with at least the following:

MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=rzp_test_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # (LOCAL DEV ONLY! Do NOT use in production)

Optionally for images:
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

3. Install dependencies:
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p

4. Seed sample data: `npm run seed`
5. Start dev server: `npm run dev`
6. Visit http://localhost:3000 and http://localhost:3000/admin/login

> **Warning:**
> Do NOT set `NEXT_PUBLIC_SITE_URL` to `http://localhost:3000` in production or in Vercel environment variables. This will cause build errors (ECONNREFUSED) because Vercel cannot connect to localhost during build. For production, use your real domain or remove this variable entirely if not needed.
> 
> Never fetch data from `localhost` or your own API via HTTP in `getStaticProps`/`getStaticPaths` for production builds. Use direct database access instead.

## Branding and per-deployment configuration

This project supports **multi-tenant branding** (logo, site name, primary colors) that can be configured per customer/store in a SaaS model.

### How it works
- Branding data is stored in MongoDB (`models/Brand.js`) with a unique `slug` and optional `domain`.
- Client-side: `pages/_app.js` detects the tenant from the hostname (`window.location.hostname`) and fetches `/api/branding?domain=...`, then injects CSS variables (`--primary-color`, `--primary-color-dark`).
- Each store/tenant can have its own logo, site name, and color scheme.
- Fallback: if no DB record is found or DB is unavailable, the app falls back to `branding.json` or environment variables.

### Admin UI
- **List & create stores**: `/admin/stores` (requires admin login)
- **Edit branding for a store**: `/admin/branding?slug=<store-slug>` (requires admin login)
- Admins can upload a logo (via Cloudinary) and set colors; changes are persisted to MongoDB.

### Setting up a new customer/store
1. Log in to admin at `/admin/login`.
2. Go to `/admin/stores`.
3. Create a new store by entering:
   - **slug** (unique identifier, e.g., `client-a`)
   - **domain** (optional, e.g., `client-a.example.com`)
   - **siteName** (e.g., `Client A Sarees`)
4. Click "Edit" to customize colors and upload a logo.
5. To deploy: point the customer's domain to your Vercel/server URL.

### Environment variables (fallback)
If MongoDB is not configured or for per-project deployments:
- `SITE_NAME` or `NEXT_PUBLIC_SITE_NAME` — site title.
- `PRIMARY_COLOR` or `NEXT_PUBLIC_PRIMARY_COLOR` — main brand color (hex, e.g., `#8B4513`).
- `PRIMARY_COLOR_DARK` or `NEXT_PUBLIC_PRIMARY_COLOR_DARK` — darker shade.
- `BRAND_LOGO` or `NEXT_PUBLIC_BRAND_LOGO` — public URL to logo.

### Migration: Import existing branding.json
If you have an existing `branding.json`, import it to MongoDB:
```bash
node scripts/migrate-branding.js --slug=default
```
This will create a Brand document with slug `default` from the current `branding.json`.

### Deployment options

#### Option 1: Single SaaS deployment (recommended)
- Deploy once to Vercel.
- All customers access the same app via different domains (e.g., `client-a.example.com`, `client-b.example.com`).
- Each customer's branding is stored in the same MongoDB.
- Lower cost, easier to maintain, single code update applies to all.

#### Option 2: Per-customer isolated projects
- Create a separate Vercel project per customer.
- Set `SITE_NAME`, `PRIMARY_COLOR`, etc., as environment variables in each project.
- Each project has its own `.env` but shares the same codebase.
- Higher cost per project, but complete isolation.

## Docker (self-host)
Build:
  docker build -t next-ecommerce .
Run:
  docker run -e MONGODB_URI="your_mongo_uri" -e JWT_SECRET="secret" -p 3000:3000 next-ecommerce

## Push to GitHub (manual steps)
1. git init
2. git add .
3. git commit -m "Initial scaffold"
4. Create a repo on GitHub and add remote:
   git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
5. git push -u origin main

Note: I cannot push to your GitHub for you. If you want, I can provide a shell script `push-to-github.sh` that runs the above commands; you'll need to run it locally with correct remote URL and SSH access.

Build:
  docker build -t next-ecommerce .
Run:
  docker run -e MONGODB_URI="your_mongo_uri" -e JWT_SECRET="secret" -p 3000:3000 next-ecommerce

## Push to GitHub (manual steps)
1. git init
2. git add .
3. git commit -m "Initial scaffold"
4. Create a repo on GitHub and add remote:
   git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
5. git push -u origin main

Note: I cannot push to your GitHub for you. If you want, I can provide a shell script `push-to-github.sh` that runs the above commands; you'll need to run it locally with correct remote URL and SSH access.
