"use client";
import { track } from "@/lib/analytics";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  Sparkles,
  ArrowRight,
  Share2,
  Download,
  Heart,
  Shirt,
} from "lucide-react";
import { Analysis, ClosetItem, analysisSchema } from "@/lib/schemas";
import { matchCloset } from "@/lib/matching";
import { Notice, request } from "@/components/ui";
export default function Recreate() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [closet, setCloset] = useState<ClosetItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [drag, setDrag] = useState(false);
  const [savedId, setSavedId] = useState("");
  const [version, setVersion] = useState(0);
  const [share, setShare] = useState("");
  useEffect(() => {
    const raw = sessionStorage.getItem("rewear_analysis");
    if (raw) {
      try {
        setAnalysis(analysisSchema.parse(JSON.parse(raw)));
      } catch {
        sessionStorage.removeItem("rewear_analysis");
      }
    }
    request<{ items: ClosetItem[] }>("/api/closet")
      .then((d) => setCloset(d.items))
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const matches = analysis ? matchCloset(analysis.items, closet, version) : [];
  const score = matches.length
    ? Math.round(
        matches.reduce((s, m) => s + (m.match?.score || 0), 0) / matches.length,
      )
    : 0;
  async function analyze() {
    if (!file) return;
    track("analysis_started");
    setBusy(true);
    setMessage("");
    setSavedId("");
    setShare("");
    try {
      const form = new FormData();
      form.set("image", file);
      const d = await request<{ analysis: Analysis }>(
        "/api/analyze",
        "POST",
        form,
      );
      track("analysis_completed");
      setAnalysis(d.analysis);
      sessionStorage.setItem("rewear_analysis", JSON.stringify(d.analysis));
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function persist() {
    const r = await request<{ id: string }>("/api/recreations", "POST", {
      analysis,
      version,
    });
    setSavedId(r.id);
    return r.id;
  }
  async function save() {
    setBusy(true);
    try {
      const id = savedId || (await persist());
      await request("/api/outfits", "POST", {
        recreationId: id,
        title: analysis?.aesthetic.join(" · ") || "My Rewear",
      });
      track("recreation_saved");
      setMessage("Your outfit is saved. Find it in Saved outfits.");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function shareResult() {
    setBusy(true);
    try {
      const id = savedId || (await persist());
      const d = await request<{ url: string }>("/api/shares", "POST", {
        recreationId: id,
      });
      track("recreation_shared");
      setShare(d.url);
      if (navigator.share) {
        try {
          await navigator.share({
            title: "My Rewear",
            text: "I recreated a saved look with clothes I already own.",
            url: d.url,
          });
        } catch {}
      } else {
        await navigator.clipboard.writeText(d.url);
        setMessage(
          "Your share link is copied. You can revoke it in Privacy settings.",
        );
      }
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function download() {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const c = canvas.getContext("2d")!;
    c.fillStyle = "#fcfbf8";
    c.fillRect(0, 0, 1080, 1920);
    c.fillStyle = "#8f243e";
    c.font = "56px Georgia";
    c.fillText("rewear.", 80, 140);
    c.fillStyle = "#171614";
    c.font = "78px Georgia";
    c.fillText("My closet.", 80, 300);
    c.fillText("A whole new look.", 80, 400);
    c.font = "130px Georgia";
    c.fillStyle = "#8f243e";
    c.fillText(`${score}% match`, 80, 620);
    c.font = "34px Arial";
    c.fillStyle = "#171614";
    c.fillText(
      `${matches.filter((m) => m.match).length} of ${matches.length} pieces already owned`,
      80,
      710,
    );
    matches.slice(0, 10).forEach((m, i) => {
      c.fillStyle = i % 2 ? "#f2eee7" : "#f3e7e8";
      c.fillRect(65, 810 + i * 83, 950, 70);
      c.fillStyle = "#171614";
      c.font = "26px Arial";
      c.fillText(
        `${m.source.primary_color} ${m.source.category} — ${m.match ? "in my closet" : "still missing"}`,
        90,
        855 + i * 83,
      );
    });
    c.font = "28px Georgia";
    c.fillStyle = "#8f243e";
    c.fillText("You already own the outfit.", 80, 1810);
    c.font = "19px Arial";
    c.fillText("Style similarity estimate · rewear", 80, 1860);
    const a = document.createElement("a");
    a.download = "my-rewear.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  }
  return (
    <>
      <span className="eyebrow">FROM SAVED TO STYLED</span>
      <h1>
        Let’s <em>rewear it.</em>
      </h1>
      <p className="page-intro">
        That look you can’t stop thinking about? Drop it here.
        <br />
        We’ll find the possibilities in your closet.
      </p>
      <div className="two-cols">
        <div>
          <label
            className={`upload-box ${drag ? "dragging" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              const f = e.dataTransfer.files[0];
              if (f) setFile(f);
            }}
          >
            {preview ? (
              <div className="preview-upload">
                <Image
                  src={preview}
                  alt="Your outfit inspiration"
                  fill
                  unoptimized
                />
              </div>
            ) : (
              <>
                <Upload />
                <h2>Drop your inspiration.</h2>
                <p>
                  A screenshot, an outfit photo, a little spark.
                  <br />
                  JPG, PNG or WebP · up to 4 MB
                </p>
                <span className="button secondary">Choose a photo</span>
              </>
            )}
            <input
              aria-label="Upload outfit inspiration"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                if (e.target.files?.[0]) setFile(e.target.files[0]);
              }}
            />
          </label>
          <div className="actions">
            <button
              disabled={!file || busy}
              className={`button ${busy ? "loading" : ""}`}
              onClick={analyze}
            >
              <Sparkles size={17} />
              {busy ? "Working on your look…" : "Recreate this look"}
            </button>
          </div>
          <p style={{ fontSize: 11, marginTop: 16 }}>
            First analysis before sign-up. Photos are analyzed for clothing
            only.
          </p>
          <Notice message={message} />
          {message.includes("Sign in") && (
            <Link href="/sign-in?next=/recreate" className="button">
              Save your look — sign in
            </Link>
          )}
        </div>
        <div>
          {analysis ? (
            <div className="panel">
              <span className="eyebrow">YOUR REWEAR</span>
              <h2 style={{ fontSize: 42, margin: "16px 0" }}>
                {closet.length ? `${score}% match` : "Meet the look."}
              </h2>
              <p>
                {closet.length
                  ? `${matches.filter((m) => m.match).length} of ${matches.length} pieces already owned.`
                  : "Add a few pieces to your closet to see what you already own."}
              </p>
              <p style={{ fontSize: 11, marginTop: 10 }}>
                A style similarity estimate, based on category, color, fit,
                pattern, season, and tags.
              </p>
              <div className="toolbar">
                {analysis.aesthetic.map((s) => (
                  <span className="chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>
              {matches.map((m, i) => (
                <div className="result-item" key={i}>
                  <Shirt size={20} />
                  <div>
                    <strong>{m.source.name}</strong>
                    <small>
                      {m.source.primary_color} · {m.source.category}
                    </small>
                    {m.match && <small>→ {m.match.item.name}</small>}
                  </div>
                  <span className={`badge ${m.match ? "good" : ""}`}>
                    {m.match ? "Owned" : "Missing"}
                  </span>
                </div>
              ))}
              <div className="actions">
                <button className="button" disabled={busy} onClick={save}>
                  <Heart size={16} />
                  Save outfit
                </button>
                <button
                  className="icon-button"
                  disabled={busy}
                  aria-label="Share result"
                  onClick={shareResult}
                >
                  <Share2 size={21} />
                </button>
                <button
                  className="icon-button"
                  aria-label="Download share card"
                  onClick={download}
                >
                  <Download size={21} />
                </button>
              </div>
              {share && (
                <a href={share} className="text-link">
                  Open public result ↗
                </a>
              )}
              <div className="actions">
                <button
                  className="text-link"
                  onClick={() => {
                    setVersion(version + 1);
                    setSavedId("");
                  }}
                >
                  Try another version ↻
                </button>
                <Link href="/closet" className="text-link">
                  Add to my closet →
                </Link>
              </div>
            </div>
          ) : (
            <div className="panel" style={{ background: "#f2eee7" }}>
              <span className="eyebrow">A LITTLE INSPIRATION</span>
              <div
                style={{ position: "relative", height: 310, margin: "20px 0" }}
              >
                <Image
                  src="/images/editorial.webp"
                  alt="Illustrative outfit inspiration and matching pieces"
                  fill
                  sizes="50vw"
                  style={{ objectFit: "cover", borderRadius: 8 }}
                />
              </div>
              <h2 style={{ fontSize: 32 }}>
                Less “nothing to wear.”
                <br />
                <em>More “I have an idea.”</em>
              </h2>
              <p style={{ fontSize: 12, marginTop: 16 }}>
                Start with what you love. Rewear breaks it down, piece by piece.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
