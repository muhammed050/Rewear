import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { marketing } from "@/lib/marketing";
export function generateStaticParams() {
  return Object.keys(marketing).map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = marketing[slug];
  return page
    ? {
        title: page.title,
        description: page.description,
        alternates: { canonical: `/${slug}` },
      }
    : { title: "Not found" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = marketing[slug];
  if (!p) notFound();
  return (
    <>
      <Header />
      <main id="main">
        <section className="wrap section">
          <div className="page-title">
            <span className="eyebrow">{p.eyebrow}</span>
            <h1>{p.heading}</h1>
            <p>{p.description}</p>
          </div>
          <div className="split">
            <div
              style={{
                position: "relative",
                minHeight: 650,
                borderRadius: 9,
                overflow: "hidden",
              }}
            >
              <Image
                src={`/images/${p.image}.webp`}
                alt="Illustrative Rewear wardrobe inspiration"
                fill
                sizes="(max-width:800px) 90vw, 45vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div>
              {p.sections.map(([h, body]) => (
                <section key={h} style={{ marginBottom: 30 }}>
                  <h2
                    style={{
                      fontSize: 29,
                      letterSpacing: "-.035em",
                      marginBottom: 15,
                    }}
                  >
                    {h}
                  </h2>
                  <p style={{ fontSize: 14, lineHeight: 1.9 }}>{body}</p>
                </section>
              ))}
              <Link href="/recreate" className="button">
                Recreate my look ✨
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
