# Wan Wan Bakery Website

SEO-friendly bakery catalogue website built with Next.js, with WhatsApp ordering, cart support, and Phase 2 ordering foundations.

## Products
- Pandan Chiffon Cake
- Pandan Gula Melaka Chiffon Cake
- Butter Cake
- Coffee Walnut Cake
- Burnt Cheesecake
- Fudge Brownies

## Contact
81571573

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

## Environment variables
Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SITE_URL` — canonical site URL for SEO
- `NEXT_PUBLIC_GA_ID` — optional Google Analytics 4 ID
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — optional Search Console verification code

## Deploy to Vercel
1. Create a GitHub repository and upload this project.
2. Go to Vercel and import the GitHub repository.
3. Add the environment variables above in Vercel project settings.
4. Deploy.
5. Connect your domain, for example `wanwanbakery.com`.
6. In Google Search Console, verify the site and submit `/sitemap.xml`.

## Images
Replace the placeholder files in `public/images/` with your real bakery photos:
- `logo.jpg`
- `banner.jpg`
- `pandan-chiffon-cake.jpg`
- `pandan-gula-melaka-chiffon-cake.jpg`
- `butter-cake.jpg`
- `coffee-walnut-cake.jpg`
- `burnt-cheesecake.jpg`
- `fudge-brownies.jpg`

## Features included
- SEO metadata, canonical URLs, Open Graph, and Twitter cards
- JSON-LD structured data for bakery, products, breadcrumbs, and FAQ
- Sitemap, robots.txt, manifest, favicon, and Open Graph image
- Mobile navigation, sticky contact bar, and responsive layout
- WhatsApp conversion tracking hooks for GA4
- Product cart with WhatsApp checkout message
- Structured enquiry form on the contact page
- About, FAQ, products index, and custom 404 page
- Health check API at `/api/health`

## Phase 2 ready ideas
- Payment gateway
- Admin dashboard
- Delivery/pickup slot management
- Order database and notifications
