import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
export const metadata = {
  title: "The Rewear journal",
  description:
    "Practical ideas for a digital closet, outfit repetition, and making more of the clothes you own.",
  alternates: { canonical: "/blog" },
};
export default function Page() {
  return (
    <>
      <Header />
      <main id="main" className="prose">
        <span className="eyebrow">THE REWEAR JOURNAL</span>
        <h1 style={{ marginTop: 20 }}>
          A fresh look at
          <br />
          <em>what you own.</em>
        </h1>
        <article className="panel">
          <span className="eyebrow">WARDROBE NOTES · 5 MIN READ</span>
          <h2>Build a digital closet without making it a whole project</h2>
          <p>
            Start with ten useful pieces, take simple photos, and build your
            first repeatable outfits.
          </p>
          <Link href="/blog/build-a-digital-closet" className="text-link">
            Read the guide →
          </Link>
        </article>
      </main>
      <Footer />
    </>
  );
}
