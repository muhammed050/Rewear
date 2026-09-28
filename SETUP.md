# Rewear deployment and service setup

## 1. Supabase

Create a dedicated Supabase project. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or the public publishable key), and server-only `SUPABASE_SERVICE_ROLE_KEY` in development and the corresponding Vercel environment.

Apply `supabase/migrations/001_rewear.sql` through a migration workflow. The migration creates application tables, RLS, auth profile provisioning, private buckets, and privileged RPCs. Do not run it against an unrelated existing application. Configure separate preview and production databases.

Enable email magic links and Google in Supabase Auth. Set Site URL to the final domain. Add `https://YOUR_DOMAIN/auth/callback` and the relevant preview/local callback URLs to the redirect allowlist. Configure the Google OAuth client’s redirect URL to the callback shown by Supabase. Configure production email delivery in Supabase; the app does not ship SMTP credentials.

Assign the first administrator through a trusted SQL migration/admin operation:

```sql
insert into public.user_roles(user_id,role) values ('YOUR_AUTH_USER_UUID','admin');
```

Never put admin authority in user-editable metadata. Visit `/admin` after signing in as that user.

## 2. AI

Set `AI_API_KEY`, `AI_BASE_URL` (an OpenAI-compatible HTTPS endpoint), and `AI_VISION_MODEL`. The model must support image input and JSON object output. The server resizes and strips image metadata before inference. Test inaccurate/unsupported images as well as normal fashion photos.

Anonymous access is one analysis per guest cookie with an additional persisted IP-hour quota. Cookie limits alone are not a strong identity boundary; protect `/api/analyze` with Vercel Firewall/bot controls before opening anonymous access at scale. Authenticated quotas are atomic database reservations. Failed calls release the monthly reservation.

4 MB input upload limit stays below Vercel’s request-body ceiling. Image decoding rejects unrecognized file formats and excessive pixel counts.

## 3. Whop

Create Rewear+ monthly and annual plans in your Whop account: initially USD 7.99/month and USD 49.99/year. Set `WHOP_API_KEY`, `WHOP_WEBHOOK_SECRET`, `WHOP_MONTHLY_PLAN_ID`, and `WHOP_ANNUAL_PLAN_ID`. Create plans with a finite recurring period; access fails closed without a verified period end.

Use API version date `2026-09-23` for the webhook endpoint `/api/webhooks/whop`. Enable:

- `membership.activated`, `membership.deactivated`, `membership.cancel_at_period_end_changed`, `membership.trial_ending_soon`
- `payment.succeeded`, `payment.failed`, `payment.canceled`, `payment.requires_action`
- `refund.created`, `refund.updated`, `dispute.created`, `dispute.updated`

Grant only the permissions needed to create checkout configurations and read memberships/payments/refunds/disputes for this account. Verify the exact scope names in the Whop dashboard. The app uses `WhopClient` and `unwrapWebhook` from current installed packages; old `webhooks.unwrap` examples do not apply.

The signing secret is passed unchanged to the official verifier. The app also signs user/plan/nonce metadata, because Elements permits client options to override metadata. Never remove the claim verification. Checkout success in the browser does not grant access.

Refund and dispute events re-fetch current provider resources, put a persistent hold on access, and re-sync the membership. Refund holds are conservative, including partial refunds; decide your commercial partial-refund policy before launch. No user content is deleted on cancellation. Manual sync can discover initial missed purchases from the latest ten user checkout sessions, bounded to 500 provider results per plan.

Admin pricing changes affect display only. Update the matching Whop plans first. Whop is the source of the actual checkout amount. Apple Pay/Google Pay may require payment-method domain verification; express checkout is not separately enabled by this app.

Test successful payment, duplicate event, delayed older event, cancellation with active paid period, expired period, failed renewal, refund, dispute, and a forged signature in a Whop test environment before selling.

## 4. Vercel

Import `muhammed050/Rewear`, framework Next.js, root directory `/`. Node 22 or 24 is supported. Build command `npm run build`. Set all environment names from `.env.example` for the intended environment.

Set `NEXT_PUBLIC_APP_URL` to the real canonical HTTPS origin before building. It controls canonical URLs, sitemap, callbacks, checkout returns, public share URLs and mutation-origin validation. Do not leave localhost in production. Redeploy after changing public env values.

Preview and production require their own correct origin and credentials. Marketing pages can build without external secrets, but the application remains unavailable until configured. No unrelated existing domain is assumed or repurposed.

## 5. Search and launch checks

- Verify `/sitemap.xml`, `/robots.txt`, icons, manifest and Open Graph on the final domain.
- Submit the sitemap in Google Search Console after verifying domain ownership.
- Auth/private/share routes are noindex and excluded from sitemap.
- Test owner A / owner B / anonymous for every private resource and actual Storage signed URLs.
- Verify Google and email-link callbacks, remembered login, and analysis preservation after auth.
- Configure operator identity and a privacy/support contact appropriate to the actual business before public launch; the included privacy/terms pages describe technical behavior and need operator details.

## 6. Tests and fixtures

`npm test` runs pure matching/access tests plus a PGlite migration/RLS test. The test harness replaces pgcrypto only inside the test with UUID-based random bytes and stubs Supabase auth/storage schemas. Production uses actual pgcrypto and Supabase.

`npm run test:e2e` uses Playwright against a running local app. Live provider tests require credentials and are not represented as passing by those local tests. `scripts/seed-demo.ts` loads explicitly marked demo wardrobe data into a designated existing demo user when `DEMO_USER_ID` is provided. Never run it for a real user.
