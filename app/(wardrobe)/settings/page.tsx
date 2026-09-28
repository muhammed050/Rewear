"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { request, Notice } from "@/components/ui";
import { browserDb } from "@/lib/browser";
export default function Page() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");
  const [shares, setShares] = useState<
    { id: string; public_token: string; is_active: boolean }[]
  >([]);
  const [confirmation, setConfirmation] = useState("");
  useEffect(() => {
    request<{ profile: { display_name: string; bio: string } }>("/api/profile")
      .then((d) => {
        setName(d.profile.display_name);
        setBio(d.profile.bio || "");
      })
      .catch((e) => setMessage(e.message));
    request<{ shares: typeof shares }>("/api/shares")
      .then((d) => setShares(d.shares))
      .catch(() => {});
  }, []);
  return (
    <>
      <h1>
        Make it <em>yours.</em>
      </h1>
      <p className="page-intro">
        Your profile, your privacy, your preferences.
      </p>
      <Notice message={message} />
      <div className="settings-list">
        <form
          className="panel"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await request("/api/profile", "PATCH", {
                display_name: name,
                bio,
              });
              setMessage("Profile saved.");
            } catch (e) {
              setMessage((e as Error).message);
            }
          }}
        >
          <h2>Your profile</h2>
          <label className="field">
            Display name
            <input
              value={name}
              maxLength={80}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="field">
            A little about you
            <textarea
              value={bio}
              maxLength={400}
              onChange={(e) => setBio(e.target.value)}
            />
          </label>
          <button className="button">Save profile</button>{" "}
          <Link href="/onboarding" className="text-link">
            Style preferences →
          </Link>
        </form>
        <div className="panel">
          <h2>Membership</h2>
          <p>Your plan, billing details, and renewal settings.</p>
          <Link href="/settings/billing" className="text-link">
            Manage Rewear+ →
          </Link>
        </div>
        <div className="panel">
          <h2>Privacy & sharing</h2>
          <p>
            Your closet is private. Only links you create can be viewed by other
            people.
          </p>
          {shares.length ? (
            shares.map((s) => (
              <div className="result-item" key={s.id}>
                <a href={`/r/${s.public_token}`} className="text-link">
                  Public result
                </a>
                <span>{s.is_active ? "Active" : "Revoked"}</span>
                {s.is_active && (
                  <button
                    className="chip"
                    onClick={async () => {
                      try {
                        await request("/api/shares", "DELETE", { id: s.id });
                        setShares(
                          shares.map((x) =>
                            x.id === s.id ? { ...x, is_active: false } : x,
                          ),
                        );
                      } catch (e) {
                        setMessage((e as Error).message);
                      }
                    }}
                  >
                    Revoke link
                  </button>
                )}
              </div>
            ))
          ) : (
            <p style={{ marginTop: 15 }}>No public links yet.</p>
          )}
          <a
            href="/api/account"
            className="button secondary"
            style={{ marginTop: 20 }}
          >
            Download my data
          </a>
        </div>
        <div className="panel">
          <h2>On your home screen</h2>
          <p>
            On iPhone, open Rewear in Safari, tap Share, then Add to Home
            Screen. On Android, use your browser’s Install app option.
          </p>
        </div>
        <div className="panel">
          <h2>Your account</h2>
          <button
            className="button secondary"
            onClick={async () => {
              try {
                await browserDb().auth.signOut();
                location.href = "/";
              } catch (e) {
                setMessage((e as Error).message);
              }
            }}
          >
            Sign out on this device
          </button>
          <details style={{ marginTop: 25 }}>
            <summary>Delete my account</summary>
            <p style={{ margin: "18px 0" }}>
              This permanently deletes your closet, saved outfits, and share
              links. Download your data first. Cancel membership renewal before
              deleting.
            </p>
            <label className="field">
              Type DELETE to confirm
              <input
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
              />
            </label>
            <button
              disabled={confirmation !== "DELETE"}
              className="button"
              onClick={async () => {
                try {
                  await request("/api/account", "DELETE", {
                    confirm: confirmation,
                  });
                  location.href = "/";
                } catch (e) {
                  setMessage((e as Error).message);
                }
              }}
            >
              Permanently delete account
            </button>
          </details>
        </div>
      </div>
    </>
  );
}
