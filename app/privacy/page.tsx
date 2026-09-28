import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
export const metadata = {
  title: "Privacy policy",
  alternates: { canonical: "/privacy" },
};
export default function Page() {
  return (
    <>
      <Header />
      <main id="main" className="prose">
        <h1>
          Your closet.
          <br />
          <em>Your privacy.</em>
        </h1>
        <p>Last updated September 28, 2026.</p>
        <h2>What Rewear stores</h2>
        <p>
          Rewear stores your account profile, wardrobe entries, uploaded
          clothing photos, outfit analyses, saved looks, collections, wear
          history, and membership records to provide the features you use.
          Authentication and application data are handled through Supabase.
        </p>
        <h2>Photos and AI processing</h2>
        <p>
          When you request an analysis, a compressed image is sent to the
          configured AI service to identify clothing. The analysis is about
          garments, not identifying people. Avoid uploading images you do not
          have permission to use or images containing sensitive personal
          information. Image metadata is removed during server-side processing
          where supported.
        </p>
        <h2>Private by default</h2>
        <p>
          Wardrobe photos are stored in private storage. Rewear uses temporary
          signed links to display them. Public results contain selected garment
          categories, colors, and match information, not your email, full
          wardrobe, or original private photos. Anyone with an active public
          link can see that result; revoke it in Settings.
        </p>
        <h2>Payments</h2>
        <p>
          Whop handles payment details and membership billing. Rewear stores the
          membership identifiers and verified access status it needs to provide
          your plan. Card details are entered into Whop’s embedded payment
          interface.
        </p>
        <h2>Cookies and usage</h2>
        <p>
          Essential cookies keep you signed in and limit anonymous analysis
          abuse. Acquisition parameters supplied in a link may be retained for
          attribution. Product events and AI usage may be recorded to measure
          service operation. Rewear does not require advertising cookies for its
          core wardrobe features.
        </p>
        <h2>Your controls</h2>
        <p>
          Use Settings to download your account data, revoke share links, or
          delete your account. You can delete closet pieces individually.
          Account deletion removes owned application records and private photos.
          Payment providers may retain billing records under their own policies.
        </p>
        <h2>Retention and security</h2>
        <p>
          Account data remains while your account is active unless you delete
          it. Service providers may retain backups for a limited period. Access
          controls reduce unauthorized access, but no online service can
          guarantee absolute security.
        </p>
      </main>
      <Footer />
    </>
  );
}
