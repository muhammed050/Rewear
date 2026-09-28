import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
export const metadata = {
  title: "The Rewear lookbook",
  description:
    "A little outfit inspiration for your own wardrobe. Explore how everyday pieces can become a fresh look.",
  alternates: { canonical: "/examples" },
};
export default function Page() {
  return (
    <>
      <Header />
      <main id="main" className="wrap section">
        <div className="page-title">
          <span className="eyebrow">THE REWEAR EDIT</span>
          <h1>
            Save the feeling.
            <br />
            <em>Wear your version.</em>
          </h1>
          <p>
            Illustrative, AI-created outfit inspiration. Your own matches depend
            on your wardrobe.
          </p>
        </div>
        <Image
          src="/images/editorial.webp"
          width={1600}
          height={1067}
          alt="A brown-jacket street-style outfit and the five pieces used to build it"
          style={{ width: "100%", height: "auto", borderRadius: 12 }}
        />
        <div className="actions" style={{ justifyContent: "center" }}>
          <Link href="/recreate" className="button">
            Bring your own inspiration →
          </Link>
          <Link href="/closet" className="text-link">
            Build my closet
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
