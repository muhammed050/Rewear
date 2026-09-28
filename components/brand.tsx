import Link from "next/link";
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Rewear home">
      <svg viewBox="0 0 38 38" aria-hidden="true">
        <path
          d="M9 15a12 12 0 0 1 21-4M30 4v7h-7M29 23a12 12 0 0 1-21 4M8 34v-7h7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <path
          d="M18 15c0-3 4-3 4 0 0 2-3 2-3 4l9 5H10l9-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        rewear<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
