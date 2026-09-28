"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Notice, request } from "@/components/ui";
export default function Page() {
  const [data, setData] = useState<{
    plus: boolean;
    subscriptions: {
      plan_key: string;
      status: string;
      current_period_end: string;
      cancel_at_period_end: boolean;
    }[];
  } | null>(null);
  const [message, setMessage] = useState("");
  const load = useCallback(
    () =>
      request<NonNullable<typeof data>>("/api/billing/status")
        .then(setData)
        .catch((e) => setMessage(e.message)),
    [],
  );
  useEffect(() => {
    load();
  }, [load]);
  return (
    <>
      <h1>
        A little more
        <br />
        <em>Rewear.</em>
      </h1>
      <p className="page-intro">Your membership, without the mystery.</p>
      <Notice message={message} />
      <div className="panel">
        <h2 style={{ fontSize: 37 }}>
          {data?.plus ? "Rewear+ Active ✨" : "Your free wardrobe"}
        </h2>
        {data?.subscriptions.map((s, i) => (
          <div key={i} className="result-item">
            <div>
              <strong>Rewear+ {s.plan_key}</strong>
              <small>{s.status}</small>
              {s.current_period_end && (
                <p>
                  {s.cancel_at_period_end
                    ? "Your access continues until"
                    : "Current period ends"}{" "}
                  {new Date(s.current_period_end).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
        <div className="actions">
          {!data?.plus && (
            <Link href="/pricing" className="button">
              Explore Rewear+
            </Link>
          )}
          <a
            href="https://whop.com/orders/"
            target="_blank"
            rel="noopener noreferrer"
            className="button secondary"
          >
            Manage membership ↗
          </a>
          <button
            className="text-link"
            onClick={async () => {
              try {
                const d = await request<{ message: string }>(
                  "/api/billing/sync",
                  "POST",
                  {},
                );
                setMessage(d.message);
                await load();
              } catch (e) {
                setMessage((e as Error).message);
              }
            }}
          >
            Sync membership
          </button>
        </div>
        <p style={{ marginTop: 25, fontSize: 12 }}>
          Cancelling renewal keeps your access until the verified end of your
          paid period. Your closet and saved looks are never deleted when your
          plan changes.
        </p>
      </div>
    </>
  );
}
