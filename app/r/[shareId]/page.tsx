import { notFound } from "next/navigation";
import Link from "next/link";
import { Shirt, Check } from "lucide-react";
import { Brand } from "@/components/brand";
import { publicResult } from "@/lib/shares";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const r = await publicResult(shareId);
  return {
    title: r
      ? `I already owned ${r.items.filter((i) => i.owned).length} of ${r.items.length} pieces`
      : "This look is private",
    robots: { index: false, follow: false },
    openGraph: { images: [`/r/${shareId}/opengraph-image`] },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const r = await publicResult((await params).shareId);
  if (!r) notFound();
  return (
    <main id="main" className="prose">
      <Brand />
      <span className="eyebrow" style={{ marginTop: 50 }}>
        A SAVED LOOK. A REAL WARDROBE.
      </span>
      <h1 style={{ marginTop: 20 }}>
        I already owned
        <br />
        <em>
          {r.items.filter((i) => i.owned).length} of {r.items.length} pieces.
        </em>
      </h1>
      <div className="panel">
        <span className="metric">{r.score}% match</span>
        <p>Style similarity estimate</p>
        {r.items.map((i, n) => (
          <div className="result-item" key={n}>
            <Shirt size={22} />
            <div>
              {i.color} {i.category}
            </div>
            <span className={`badge ${i.owned ? "good" : ""}`}>
              {i.owned ? "Already owned" : "Missing"}
            </span>
          </div>
        ))}
      </div>
      <h2>Your closet might surprise you, too.</h2>
      <Link href="/recreate" className="button">
        Recreate your saved look ✨
      </Link>
      <p style={{ fontSize: 12 }}>
        Shared voluntarily. Private photos and wardrobe details stay private.
      </p>
    </main>
  );
}
