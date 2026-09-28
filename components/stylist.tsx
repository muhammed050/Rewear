"use client";
import { useState } from "react";
import Link from "next/link";
import { Sparkles, Check } from "lucide-react";
import { Notice, request } from "./ui";
type Result = {
  message: string;
  outfits: { title: string; item_ids: string[]; reason: string }[];
  missing: string[];
  items: { id: string; name: string; primary_color: string }[];
};
export function Stylist({ pack = false }: { pack?: boolean }) {
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const form = new FormData(e.currentTarget);
      const text = pack
        ? `Plan a trip to ${form.get("destination")} from ${form.get("start")} to ${form.get("end")}. Activities: ${form.get("activities")}. Dressiness: ${form.get("dressiness")}. Laundry: ${form.get("laundry") ? "available" : "not available"}. Weather context: ${form.get("weather")}.`
        : prompt;
      const d = await request<Result>("/api/stylist", "POST", {
        prompt: text,
        mode: pack ? "pack" : "stylist",
      });
      setResult(d);
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const ids = result
    ? [...new Set(result.outfits.flatMap((o) => o.item_ids))]
    : [];
  return (
    <>
      <span className="eyebrow">
        {pack
          ? "MORE OUTFITS. LESS SUITCASE."
          : "SOME FRESH EYES ON YOUR FAVORITES"}
      </span>
      <h1>
        {pack ? (
          <>
            Pack a little.
            <br />
            <em>Wear a lot.</em>
          </>
        ) : (
          <>
            A little <em>style direction.</em>
          </>
        )}
      </h1>
      <p className="page-intro">
        {pack
          ? "A trip capsule made from your actual wardrobe. Included with Rewear+."
          : "Tell us the occasion or the mood. Your stylist starts with what you own."}
      </p>
      <div className="two-cols">
        <form className="panel" onSubmit={submit}>
          {pack ? (
            <>
              <div className="form-grid">
                <label className="field full">
                  Where are you going?
                  <input
                    name="destination"
                    required
                    placeholder="Miami"
                    maxLength={100}
                  />
                </label>
                <label className="field">
                  Start date
                  <input name="start" type="date" required />
                </label>
                <label className="field">
                  End date
                  <input name="end" type="date" required />
                </label>
                <label className="field full">
                  Activities
                  <input
                    name="activities"
                    required
                    placeholder="Beach days, dinner, exploring"
                    maxLength={300}
                  />
                </label>
                <label className="field">
                  Dressiness
                  <select name="dressiness">
                    <option>Casual</option>
                    <option>Smart casual</option>
                    <option>Formal</option>
                    <option>Mixed</option>
                  </select>
                </label>
                <label className="field">
                  Weather you expect
                  <input
                    name="weather"
                    placeholder="Warm days, cool evenings"
                    maxLength={150}
                  />
                </label>
              </div>
              <label
                style={{ display: "block", marginBottom: 22, fontSize: 13 }}
              >
                <input type="checkbox" name="laundry" /> Laundry available
              </label>
            </>
          ) : (
            <>
              <label className="field">
                What are we dressing for?
                <textarea
                  required
                  minLength={3}
                  maxLength={1200}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Dinner with friends — relaxed, but a little dressed up."
                />
              </label>
              <div className="toolbar">
                {[
                  "A casual fall outfit",
                  "Dinner tonight",
                  "Something for work",
                ].map((p) => (
                  <button
                    className="chip"
                    type="button"
                    onClick={() => setPrompt(p)}
                    key={p}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}
          <button className={`button ${busy ? "loading" : ""}`} disabled={busy}>
            <Sparkles size={17} />
            {busy
              ? "Finding the possibilities…"
              : pack
                ? "Build my packing plan"
                : "Style my closet"}
          </button>
          <Notice message={message} />
          {message.includes("Sign in") && (
            <Link
              className="text-link"
              href={`/sign-in?next=/${pack ? "pack" : "stylist"}`}
            >
              Sign in →
            </Link>
          )}
          {message.includes("Rewear+") && (
            <Link className="text-link" href="/pricing">
              Explore Rewear+ →
            </Link>
          )}
        </form>
        <div>
          {result ? (
            <>
              <div className="panel">
                <p>{result.message}</p>
                {result.outfits.map((o, i) => (
                  <div style={{ marginTop: 25 }} key={i}>
                    <h3>{o.title}</h3>
                    <p style={{ fontSize: 12, margin: "8px 0" }}>{o.reason}</p>
                    {o.item_ids.map((id) => (
                      <div className="result-item" key={id}>
                        <Check size={15} />
                        {result.items.find((x) => x.id === id)?.name}
                        <span className="badge good">Owned</span>
                      </div>
                    ))}
                  </div>
                ))}
                {result.missing.length > 0 && (
                  <>
                    <h3 style={{ marginTop: 25 }}>
                      Missing / optional suggestions
                    </h3>
                    {result.missing.map((m) => (
                      <p key={m}>{m}</p>
                    ))}
                  </>
                )}
              </div>
              {pack && (
                <div className="panel" style={{ marginTop: 20 }}>
                  <h3>Your packing checklist</h3>
                  {ids.map((id) => (
                    <label className="result-item" key={id}>
                      <input
                        type="checkbox"
                        checked={checked.includes(id)}
                        onChange={() =>
                          setChecked(
                            checked.includes(id)
                              ? checked.filter((x) => x !== id)
                              : [...checked, id],
                          )
                        }
                      />
                      {result.items.find((x) => x.id === id)?.name}
                    </label>
                  ))}
                  <button
                    className="text-link"
                    onClick={() => {
                      const blob = new Blob(
                        [
                          ids
                            .map(
                              (id) =>
                                `${checked.includes(id) ? "[x]" : "[ ]"} ${result.items.find((x) => x.id === id)?.name}`,
                            )
                            .join("\n"),
                        ],
                        { type: "text/plain" },
                      );
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "rewear-packing-list.txt";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download checklist ↓
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state" style={{ marginTop: 0 }}>
              <Sparkles />
              <h2>
                Your closet.
                <br />
                New possibilities.
              </h2>
              <p>
                Add your favorite pieces first, then we’ll put them together in
                ways you might not have tried.
              </p>
              <Link href="/closet" className="text-link">
                Open my closet →
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
