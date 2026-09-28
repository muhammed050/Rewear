# Rewear

**You already own the outfit.** A Next.js / Supabase fashion workspace with private wardrobe photos, outfit parsing, weighted closet matching, saved looks, collections, wear history, revocable public results, an AI stylist, trip packing, and server-verified Whop billing.

## Run

```sh
npm ci
cp .env.example .env.local
npm run dev
npm run build
npm test
```

Read [SETUP.md](SETUP.md) before enabling external services. Marketing pages render without credentials; connected features return an explicit unavailable state. There are no simulated AI responses or client-side premium unlocks.

## What is included

- Editorial cream/cherry interface, original generated fashion photography, SVG wordmark and icon, mobile bottom navigation.
- Next.js metadata, canonicals, sitemap, robots, Open Graph, marketing guides, a journal article, PWA manifest and navigation-only offline fallback. Private data is never cached by the service worker.
- Google and email-link Supabase authentication, persistent SSR cookies and fast style onboarding.
- Server-validated wardrobe CRUD, photo sanitization, private storage and temporary URLs.
- First anonymous analysis, wardrobe analysis, reviewed bulk import, weighted matching, alternative candidate versions, save/share/download, collections and wear history.
- AI stylist grounded in validated wardrobe IDs and Plus packing checklists.
- Whop Elements checkout, signed server attribution claims, verified webhooks, persistent quotas, subscription sync, revocation/refund holds and transactional idempotency.
- Server-protected admin console, account suspension, temporary grants, public link revocation, pricing display settings, audit records and raw operational event views.
- SQL migration with RLS; executable PostgreSQL-compatible tests for isolation, privileged writes, quotas and duplicate/stale billing events.

## Important delivery boundaries

This repository is an implementation, not evidence of a launched live service. Supabase migrations, OAuth, AI calls, Whop checkout/webhooks and Vercel deployment require project credentials and live validation. PGlite tests exercise PostgreSQL behavior with a small auth/storage harness; they do not prove a configured Supabase project or Storage gateway works.

The following parts of the broader specification are not complete production subsystems: true garment segmentation/background removal, embedding matching, a durable AI task queue/cache, premium social collage themes, calendar scheduling beyond wear history, rich retention/revenue funnel dashboards, email notifications, and referral conversion attribution. Virtual try-on, shopping affiliates and social voting remain disabled future flags. No claim of priority AI processing is made.

Bulk import identifies garments and asks for confirmation; it does not manufacture cut-out photos. Public cards intentionally share garment categories/colors and ownership summaries, not original private images. Only one original editorial scene is supplied in several web-optimized crops; demo fixtures are explicitly labeled and never injected into a real wardrobe automatically.

## Architecture

`app/api` validates session, ownership, origin and input. `lib/ai.ts` accepts an OpenAI-compatible vision provider configured on the server. `lib/matching.ts` implements transparent category/color/fit/pattern/tag/season scoring. `lib/whop.ts` uses the installed official SDK pinned by the lockfile and API date `2026-09-23`.

Secrets belong in environment settings, never source or client props. The service-role key is imported only from server-only modules. Public shares expose a deliberately narrow snapshot. Checkout callbacks show confirmation status only; the database grants access after signed provider verification.
