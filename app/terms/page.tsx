import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
export const metadata = {
  title: "Terms of use",
  alternates: { canonical: "/terms" },
};
export default function Page() {
  return (
    <>
      <Header />
      <main id="main" className="prose">
        <h1>A few ground rules.</h1>
        <p>Last updated September 28, 2026.</p>
        <h2>Using Rewear</h2>
        <p>
          Rewear helps you organize your wardrobe and explore outfit ideas. Use
          it only with content you have permission to upload. You are
          responsible for your account and the content you choose to share. Do
          not upload unlawful content, abuse other people, or attempt to bypass
          access or usage limits.
        </p>
        <h2>AI suggestions</h2>
        <p>
          Garment recognition and match scores are estimates and may be wrong.
          Suggestions do not guarantee fit, comfort, suitability, or identical
          appearance. Review results before relying on them.
        </p>
        <h2>Memberships</h2>
        <p>
          Free and Rewear+ limits are shown on the pricing page. Whop provides
          checkout and recurring billing. Review the final price, tax, renewal
          period, and applicable cancellation or refund terms at checkout.
          Rewear+ activates after server-side membership verification.
        </p>
        <h2>Cancellation</h2>
        <p>
          You can manage renewal through Whop. Cancelling renewal retains access
          until the verified end of the paid period. Expiration changes feature
          access and does not automatically delete your wardrobe. Resolve or
          cancel recurring billing before deleting your account.
        </p>
        <h2>Shared results</h2>
        <p>
          A public result link can be opened by anyone who has it. You may
          revoke it from your privacy settings. Rewear may remove abusive shared
          content or suspend accounts that misuse the service.
        </p>
        <h2>Availability</h2>
        <p>
          Features depend on connected services and may be interrupted. We may
          update the application or its limits; changes to billing are subject
          to the terms presented when you subscribe. Nothing here limits rights
          that cannot be excluded under applicable law.
        </p>
      </main>
      <Footer />
    </>
  );
}
