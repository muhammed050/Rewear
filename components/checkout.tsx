"use client";
import { useEffect, useState } from "react";
import { WhopElements, Checkout, CheckoutElement } from "@whop/elements-react";
import { loadWhop } from "@whop/elements";
import { Notice, request } from "./ui";
const elements = loadWhop();
export function BillingCheckout({ plan }: { plan: "monthly" | "annual" }) {
  const [session, setSession] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    let cancelled = false;
    const raw = sessionStorage.getItem("rewear_attribution");
    let attribution: Record<string, string> = {};
    try {
      attribution = raw ? JSON.parse(raw) : {};
    } catch {}
    const { a, ...utm } = attribution;
    request<{ sessionId: string; email: string }>(
      "/api/billing/checkout",
      "POST",
      { plan, affiliate: a, attribution: utm },
    )
      .then((d) => {
        if (!cancelled) {
          setSession(d.sessionId);
          setEmail(d.email);
        }
      })
      .catch((e) => {
        if (!cancelled) setMessage(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [plan]);
  async function complete() {
    setMessage("Confirming your membership…");
    for (let n = 0; n < 8; n++) {
      await new Promise((r) => setTimeout(r, 2500));
      try {
        const data = await request<{ plus: boolean }>("/api/billing/status");
        if (data.plus) {
          setMessage("Your Rewear+ membership is active.");
          location.href = "/settings/billing";
          return;
        }
      } catch {}
    }
    setMessage(
      "Payment received by checkout. Membership confirmation is still pending. Check Billing in a moment.",
    );
  }
  return (
    <>
      <Notice message={message} />
      {message.includes("Sign in") && (
        <a className="button" href="/sign-in?next=/pricing">
          Sign in to continue
        </a>
      )}
      {session ? (
        <WhopElements
          elements={elements}
          onLoadError={() =>
            setMessage("Checkout couldn’t load. Please refresh and try again.")
          }
        >
          <Checkout checkoutConfiguration={session} onComplete={complete}>
            <CheckoutElement buyerEmail={email} />
          </Checkout>
        </WhopElements>
      ) : (
        !message && <p className="loading">Preparing your secure checkout…</p>
      )}
    </>
  );
}
