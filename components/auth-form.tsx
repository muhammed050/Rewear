"use client";
import { useState } from "react";
import { browserDb } from "@/lib/browser";
import { Notice } from "./ui";
export function AuthForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function signIn(provider?: "google") {
    setBusy(true);
    setMessage("");
    try {
      const db = browserDb();
      const next =
        new URLSearchParams(location.search).get("next") || "/onboarding";
      const redirect = `${location.origin}/auth/callback?next=${encodeURIComponent(next.startsWith("/") && !next.startsWith("//") ? next : "/onboarding")}`;
      if (provider) {
        const { error } = await db.auth.signInWithOAuth({
          provider,
          options: { redirectTo: redirect },
        });
        if (error) throw error;
      } else {
        const { error } = await db.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: redirect },
        });
        if (error) throw error;
        setMessage(
          "Check your inbox for your secure sign-in link. Keep this browser open.",
        );
      }
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : "Unable to sign in. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-form">
      <span className="eyebrow">WELCOME TO YOUR NEW FAVORITE CLOSET</span>
      <h1 style={{ marginTop: 20 }}>
        Save your look.
        <br />
        <em>Find your style.</em>
      </h1>
      <p>
        Your favorite pieces. All the possibilities.
        <br />
        Sign in or create your free account.
      </p>
      <button
        className="button secondary"
        disabled={busy}
        onClick={() => signIn("google")}
      >
        Continue with Google
      </button>
      <div className="divider">or use your email</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signIn();
        }}
      >
        <label className="field">
          Email address
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <button className="button" disabled={busy}>
          {busy ? "One moment…" : "Email me a sign-in link"}
        </button>
      </form>
      <Notice message={message} />
      <p style={{ fontSize: 11 }}>
        By continuing, you agree to our{" "}
        <a className="text-link" href="/terms">
          Terms
        </a>{" "}
        and{" "}
        <a className="text-link" href="/privacy">
          Privacy Policy
        </a>
        . We’ll keep you signed in on this device.
      </p>
    </div>
  );
}
