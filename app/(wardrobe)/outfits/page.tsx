"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Heart, Check, Trash2, Shirt } from "lucide-react";
import { Notice, Empty, request } from "@/components/ui";
type Outfit = {
  id: string;
  title: string;
  favorite: boolean;
  source_recreation_id: string;
  recreations: {
    match_score: number;
    analysis_json: {
      matches: { source: { name: string }; match: { name: string } | null }[];
    };
  } | null;
  wear_history: { worn_on: string }[];
};
type Collection = {
  id: string;
  name: string;
  collection_outfits: { outfit_id: string }[];
};
export default function Page() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const load = useCallback(async () => {
    try {
      const [o, c] = await Promise.all([
        request<{ outfits: Outfit[] }>("/api/outfits"),
        request<{ collections: Collection[] }>("/api/collections"),
      ]);
      setOutfits(o.outfits);
      setCollections(c.collections);
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  async function action(id: string, action: string, favorite?: boolean) {
    try {
      if (action === "delete") {
        if (!confirm("Delete this saved outfit?")) return;
        await request("/api/outfits", "DELETE", { id });
      } else await request("/api/outfits", "PATCH", { id, action, favorite });
      await load();
      setMessage(action === "wear" ? "Added to your wear history." : "Saved.");
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  const visible = outfits.filter(
    (o) =>
      filter === "all" ||
      (filter === "favorites" && o.favorite) ||
      (filter === "worn" && o.wear_history.length) ||
      collections
        .find((c) => c.id === filter)
        ?.collection_outfits.some((x) => x.outfit_id === o.id),
  );
  return (
    <>
      <span className="eyebrow">THE ONES WORTH REPEATING</span>
      <h1>
        Your saved <em>looks.</em>
      </h1>
      <p className="page-intro">Good outfits deserve another day out.</p>
      <div className="toolbar">
        {[
          ["all", "All looks"],
          ["favorites", "Favorites"],
          ["worn", "Worn"],
          ...collections.map((c) => [c.id, c.name]),
        ].map(([id, label]) => (
          <button
            key={id}
            className={`chip ${filter === id ? "active" : ""}`}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <form
        className="toolbar"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await request("/api/collections", "POST", { name });
            setName("");
            await load();
          } catch (e) {
            setMessage((e as Error).message);
          }
        }}
      >
        <input
          className="search-input"
          placeholder="New collection: Date night, Work…"
          aria-label="New collection name"
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="chip">Create collection</button>
      </form>
      <Notice message={message} />
      {loading ? (
        <div className="skeleton" />
      ) : visible.length ? (
        <div className="two-cols">
          {visible.map((o) => (
            <article className="panel" key={o.id}>
              <div className="row">
                <h3>{o.title}</h3>
                <span className="badge">
                  {o.recreations?.match_score || 0}% match
                </span>
              </div>
              {o.recreations?.analysis_json.matches.map((m, i) => (
                <div className="result-item" key={i}>
                  <Shirt size={18} />
                  <div>{m.match?.name || m.source.name}</div>
                  <span className="badge">{m.match ? "Owned" : "Missing"}</span>
                </div>
              ))}
              <div className="toolbar">
                <button className="chip" onClick={() => action(o.id, "wear")}>
                  <Check size={14} style={{ display: "inline" }} /> Wore it
                  today
                </button>
                <button
                  className="icon-button"
                  aria-label="Favorite outfit"
                  onClick={() => action(o.id, "favorite", !o.favorite)}
                >
                  <Heart size={19} fill={o.favorite ? "#8f243e" : "none"} />
                </button>
                <button
                  className="icon-button"
                  aria-label="Delete outfit"
                  onClick={() => action(o.id, "delete")}
                >
                  <Trash2 size={18} />
                </button>
              </div>
              {o.wear_history.length > 0 && (
                <p style={{ fontSize: 12 }}>
                  Worn {o.wear_history.length} times · Latest{" "}
                  {o.wear_history
                    .map((h) => h.worn_on)
                    .sort()
                    .at(-1)}
                </p>
              )}
              {collections.length > 0 && (
                <select
                  className="chip"
                  aria-label="Add to collection"
                  defaultValue=""
                  onChange={async (e) => {
                    if (!e.target.value) return;
                    try {
                      await request("/api/collections", "PATCH", {
                        collectionId: e.target.value,
                        outfitId: o.id,
                      });
                      await load();
                      setMessage("Added to collection.");
                    } catch (err) {
                      setMessage((err as Error).message);
                    }
                  }}
                >
                  <option value="">Add to collection…</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title="Nothing saved yet."
          description="Drop an outfit you love and we’ll help recreate it from your closet."
          href="/recreate"
          label="Recreate a look"
        />
      )}
      <Link href="/recreate" className="text-link" style={{ marginTop: 30 }}>
        Find your next rewear →
      </Link>
    </>
  );
}
