import Link from "next/link";
export const metadata = {
  title: "Offline",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <main id="main" className="prose">
      <h1>A little pause.</h1>
      <p>
        You’re offline. Your saved wardrobe is safe. Reconnect to keep
        rewearing.
      </p>
      <Link className="button" href="/home">
        Try again
      </Link>
    </main>
  );
}
