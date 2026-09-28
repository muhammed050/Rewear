"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Check } from "lucide-react";
import { Modal } from "./ui";
const BillingCheckout = dynamic(
  () => import("./checkout").then((m) => m.BillingCheckout),
  { ssr: false },
);
export function Pricing({
  monthly,
  annual,
}: {
  monthly: number;
  annual: number;
}) {
  const [period, setPeriod] = useState<"monthly" | "annual">("annual");
  const [checkout, setCheckout] = useState(false);
  const close = useCallback(() => setCheckout(false), []);
  return (
    <>
      <div
        className="toolbar"
        style={{ justifyContent: "center", marginBottom: 35 }}
      >
        <button
          className={`chip ${period === "monthly" ? "active" : ""}`}
          onClick={() => setPeriod("monthly")}
        >
          Monthly
        </button>
        <button
          className={`chip ${period === "annual" ? "active" : ""}`}
          onClick={() => setPeriod("annual")}
        >
          Yearly · save {Math.round((1 - annual / (monthly * 12)) * 100)}%
        </button>
      </div>
      <div className="pricing-grid">
        <article className="price-card">
          <span className="eyebrow">A GOOD PLACE TO START</span>
          <h2>Rewear</h2>
          <div className="price">
            $0 <small>/ forever</small>
          </div>
          <p>Your wardrobe, with a fresh perspective.</p>
          <ul className="check-list">
            {[
              "40 closet pieces",
              "5 outfit recreations per month",
              "5 stylist questions per month",
              "Saved outfits and collections",
              "Private wardrobe and share cards",
            ].map((t) => (
              <li key={t}>
                <Check />
                {t}
              </li>
            ))}
          </ul>
          <Link className="button secondary" href="/recreate">
            Start rewearing
          </Link>
        </article>
        <article className="price-card plus">
          <span className="eyebrow">MORE POSSIBILITIES, SAME CLOSET</span>
          <h2>Rewear+</h2>
          <div className="price">
            $
            {period === "annual"
              ? (annual / 12).toFixed(2)
              : monthly.toFixed(2)}{" "}
            <small>/ month</small>
          </div>
          <p>
            {period === "annual"
              ? `$${annual.toFixed(2)} billed yearly`
              : `$${monthly.toFixed(2)} billed monthly`}{" "}
            · Cancel renewal anytime
          </p>
          <ul className="check-list">
            {[
              "Room for 10,000 wardrobe pieces",
              "200 recreations per month",
              "100 stylist questions per month",
              "Bulk wardrobe import from photos",
              "Trip packing and wardrobe insights",
            ].map((t) => (
              <li key={t}>
                <Check />
                {t}
              </li>
            ))}
          </ul>
          <button className="button" onClick={() => setCheckout(true)}>
            Make room for more ✨
          </button>
        </article>
      </div>
      <p style={{ textAlign: "center", fontSize: 12, marginTop: 25 }}>
        Secure checkout by Whop. The final amount and any applicable taxes are
        shown before payment.
      </p>
      {checkout && (
        <Modal title="Your next chapter: Rewear+" onClose={close}>
          <BillingCheckout plan={period} />
        </Modal>
      )}
    </>
  );
}
