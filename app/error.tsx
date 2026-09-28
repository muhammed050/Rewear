"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="prose">
      <h1>
        A little wardrobe
        <br />
        <em>malfunction.</em>
      </h1>
      <p>We couldn’t load this page. Your next look can wait a moment.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
