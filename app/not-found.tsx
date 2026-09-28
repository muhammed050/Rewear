import Link from "next/link";
import { Brand } from "@/components/brand";
export default function Page() {
  return (
    <main id="main" className="prose">
      <Brand />
      <h1 style={{ marginTop: 60 }}>
        This look
        <br />
        <em>isn’t here.</em>
      </h1>
      <p>The page may have moved, or its owner may have made it private.</p>
      <Link className="button" href="/">
        Back to Rewear →
      </Link>
    </main>
  );
}
