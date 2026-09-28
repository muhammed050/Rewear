import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
export const metadata = {
  title: "How to build a digital closet with ten pieces",
  description:
    "A practical guide to organizing a small digital wardrobe, photographing clothes, and recreating saved outfit inspiration.",
  alternates: { canonical: "/blog/build-a-digital-closet" },
};
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if ((await params).slug !== "build-a-digital-closet") notFound();
  return (
    <>
      <Header />
      <main id="main" className="prose">
        <span className="eyebrow">WARDROBE NOTES</span>
        <h1>Build a digital closet without making it a whole project.</h1>
        <p>
          A digital closet is useful when it helps you get dressed. It doesn’t
          need to become an inventory of every sock you own. Start with a small
          set of pieces you reach for often, then add more when you have a
          reason.
        </p>
        <h2>Choose ten pieces that work hard</h2>
        <p>
          Pull out two bottoms, three tops, two layers, two pairs of shoes, and
          one bag. These are starting numbers, not rules. If you wear dresses
          most days, use dresses. The point is to build a small picture of your
          actual routine rather than an idealized wardrobe.
        </p>
        <p>
          Choose pieces that fit comfortably today. A digital collection of
          clothes you cannot or do not want to wear creates more decisions
          instead of fewer.
        </p>
        <h2>Take useful photos, not perfect ones</h2>
        <p>
          Place each item against a plain background near a window. Keep the
          full garment in frame and avoid a strong shadow that changes its
          apparent color. A clean hanger photo or a flat lay is enough. You can
          add a clearer photo later.
        </p>
        <p>
          Photos of outfits can also help identify pieces, but overlapping
          layers may hide details. Review every suggested item, especially shoes
          and accessories. Similar-looking basics may be distinct garments,
          while the same jacket in different lighting can look like two
          different items.
        </p>
        <h2>Use names you will recognize</h2>
        <p>
          “Brown cropped jacket” is often more useful than a product code. Add
          the category, primary color, fit, and a couple of style tags. Keep
          labels consistent: using “cream” for one item and “off-white” for
          another is fine when you recognize both, but avoid a different
          invented shade name for every top.
        </p>
        <h2>Start with one saved outfit</h2>
        <p>
          Pick inspiration that suits your daily life. Notice the structure: a
          short jacket over a simple top, straight jeans, and a darker
          accessory. Those relationships may matter more than owning the exact
          brand or matching every shade.
        </p>
        <p>
          Upload the inspiration to Rewear and compare it with your small
          closet. A missing piece is information, not an instruction to buy. Try
          leaving it out, using a similar item, or saving the idea for a
          different season.
        </p>
        <h2>Save what you would actually wear</h2>
        <p>
          Once you like a combination, give it a useful title such as “Easy
          office Friday.” Add it to a collection you will remember. A few
          reliable combinations can be more valuable than dozens of looks you
          never revisit.
        </p>
        <p>
          After wearing a look, mark it in your history. You may notice which
          layers work across outfits or which pieces need a different pairing.
          Keep the process positive: the aim is to make your wardrobe easier to
          use.
        </p>
        <h2>Let the closet grow naturally</h2>
        <p>
          Add a piece when you wear it, wash it, or want to match it to a
          reference. This spreads the effort over ordinary life. There is no
          need to finish the entire wardrobe before getting value from the first
          ten entries.
        </p>
        <Link href="/closet" className="button">
          Build my first closet →
        </Link>
      </main>
      <Footer />
    </>
  );
}
