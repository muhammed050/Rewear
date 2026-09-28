import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Pricing } from "@/components/pricing";
import { configured, db } from "@/lib/supabase";
export const metadata = {
  title: "Rewear+ plans and pricing",
  description:
    "Start your digital closet free. Upgrade to Rewear+ for more outfit recreations, bulk imports, personal styling and trip packing.",
  alternates: { canonical: "/pricing" },
};
export default async function Page() {
  let pricing = { monthly: 7.99, annual: 49.99 };
  if (configured()) {
    try {
      const { data } = await (
        await db()
      )
        .from("app_settings")
        .select("value")
        .eq("key", "pricing")
        .single();
      if (data?.value) pricing = data.value;
    } catch {}
  }
  return (
    <>
      <Header />
      <main id="main" className="wrap section">
        <div className="page-title">
          <span className="eyebrow">LESS BUYING. MORE POSSIBILITIES.</span>
          <h1>
            Your closet has more
            <br />
            <em>to give.</em>
          </h1>
          <p>
            Start free. Find your favorites all over again.
            <br />
            Choose Rewear+ when you’re ready for a little more.
          </p>
        </div>
        <Pricing {...pricing} />
      </main>
      <Footer />
    </>
  );
}
