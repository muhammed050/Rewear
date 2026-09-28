"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Shirt, Trash2, Pencil, Upload } from "lucide-react";
import { categories } from "@/lib/config";
import { ClosetItem, Garment, garment, Analysis } from "@/lib/schemas";
import { Modal, Notice, Empty, request } from "@/components/ui";
export default function Closet() {
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [favorites, setFavorites] = useState(false);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<ClosetItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [drafts, setDrafts] = useState<Garment[]>([]);
  const [limit, setLimit] = useState(40);
  const load = useCallback(async () => {
    try {
      const d = await request<{
        items: ClosetItem[];
        limits: { closet: number };
      }>("/api/closet");
      setItems(d.items);
      setLimit(d.limits.closet);
      setMessage("");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const close = useCallback(() => {
    setModal(false);
    setEdit(null);
  }, []);
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const form = new FormData(e.currentTarget);
      const parsed = garment.safeParse({
        ...Object.fromEntries(form),
        season: String(form.get("season") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        style_tags: String(form.get("style_tags") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        ai_confidence: 0,
      });
      if (!parsed.success) {
        const invalidCategory = parsed.error.issues.some(issue => issue.path[0] === "category");
        setMessage(invalidCategory
          ? "Please choose a clothing category from the list and try again."
          : "Please check the item details and try again.");
        return;
      }
      const item = parsed.data;
      if (edit) await request("/api/closet", "PATCH", { id: edit.id, item });
      else {
        const data = new FormData();
        data.set("item", JSON.stringify(item));
        const image = form.get("image");
        if (image instanceof File) data.set("image", image);
        await request("/api/closet", "POST", data);
      }
      close();
      await load();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function action(item: ClosetItem, del = false) {
    if (del && !confirm(`Delete ${item.name}? This cannot be undone.`)) return;
    try {
      await request("/api/closet", del ? "DELETE" : "PATCH", {
        id: item.id,
        favorite: !item.favorite,
      });
      await load();
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  async function bulk(files: FileList | null) {
    if (!files) return;
    setBusy(true);
    setMessage("Reading your photos…");
    const results: Garment[] = [];
    try {
      for (const file of Array.from(files).slice(0, 5)) {
        const form = new FormData();
        form.set("image", file);
        form.set("mode", "import");
        const d = await request<{ analysis: Analysis }>(
          "/api/analyze",
          "POST",
          form,
        );
        for (const item of d.analysis.items)
          if (
            ![...items, ...results].some(
              (i) =>
                i.category === item.category &&
                i.primary_color === item.primary_color &&
                i.subcategory === item.subcategory,
            )
          )
            results.push(item);
      }
      setDrafts(results);
      setMessage(
        `${results.length} possible items found. Review each one before adding it.`,
      );
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function confirmDraft(i: number) {
    try {
      const data = new FormData();
      data.set("item", JSON.stringify(drafts[i]));
      await request("/api/closet", "POST", data);
      setDrafts(drafts.filter((_, idx) => idx !== i));
      await load();
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  const filtered = items.filter(
    (i) =>
      (category === "all" || i.category === category) &&
      (!favorites || i.favorite) &&
      `${i.name} ${i.primary_color} ${i.brand} ${i.style_tags.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="row wrap-row">
        <div>
          <span className="eyebrow">A LITTLE REDISCOVERY STARTS HERE</span>
          <h1>
            Your <em>closet.</em>
          </h1>
        </div>
        <button className="button" onClick={() => setModal(true)}>
          <Plus size={17} /> Add a piece
        </button>
      </div>
      <p className="page-intro">
        {items.length} pieces ·{" "}
        {limit === 40
          ? `${Math.max(0, limit - items.length)} spaces left on Free`
          : "Rewear+ wardrobe"}
        <br />
        The best place to find your next outfit.
      </p>
      <div className="toolbar">
        <input
          className="search-input"
          aria-label="Search your closet"
          placeholder="Search pieces, colors, or brands…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          aria-label="Filter category"
          className="chip"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button
          className={`chip ${favorites ? "active" : ""}`}
          onClick={() => setFavorites(!favorites)}
        >
          ♡ Favorites
        </button>
        <label className="chip" style={{ cursor: "pointer" }}>
          Import photos · Plus
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => bulk(e.target.files)}
            disabled={busy}
            style={{ display: "none" }}
          />
        </label>
      </div>
      <Notice message={message} />
      {message.includes("Sign in") && (
        <Link className="button" href="/sign-in?next=/closet">
          Save your closet — sign in
        </Link>
      )}
      {drafts.length > 0 && (
        <div className="panel">
          <h3>Review your import</h3>
          <p>
            Attributes are estimates. Similar pieces are combined; check for
            duplicates.
          </p>
          {drafts.map((d, i) => (
            <div className="result-item" key={i}>
              <input
                aria-label="Imported item name"
                className="search-input"
                value={d.name}
                onChange={(e) =>
                  setDrafts(
                    drafts.map((x, j) =>
                      i === j ? { ...x, name: e.target.value } : x,
                    ),
                  )
                }
              />
              <span>
                {d.primary_color} {d.category}
              </span>
              <button className="chip" onClick={() => confirmDraft(i)}>
                Add
              </button>
              <button
                className="icon-button"
                aria-label="Remove imported item"
                onClick={() => setDrafts(drafts.filter((_, j) => i !== j))}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      {loading ? (
        <div className="closet-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton" />
          ))}
        </div>
      ) : filtered.length ? (
        <div className="closet-grid">
          {filtered.map((item) => (
            <article className="item-card" key={item.id}>
              <div className="item-photo">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    unoptimized
                    sizes="200px"
                  />
                ) : (
                  <Shirt />
                )}
              </div>
              <div className="item-info">
                <h3>{item.name}</h3>
                <p>
                  {item.primary_color} · {item.category}
                </p>
                <div className="item-controls">
                  <button
                    className="icon-button"
                    aria-label={`${item.favorite ? "Unfavorite" : "Favorite"} ${item.name}`}
                    onClick={() => action(item)}
                  >
                    <Heart
                      size={16}
                      fill={item.favorite ? "#8f243e" : "none"}
                    />
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`Edit ${item.name}`}
                    onClick={() => {
                      setEdit(item);
                      setModal(true);
                    }}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`Delete ${item.name}`}
                    onClick={() => action(item, true)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title={
            items.length ? "No pieces found." : "Your wardrobe, but smarter."
          }
          description={
            items.length
              ? "Try another search or category."
              : "Add a few pieces and start discovering outfits you already own."
          }
        />
      )}
      <div className="actions">
        <Link href="/recreate" className="text-link">
          Find a look for these pieces →
        </Link>
      </div>
      {modal && (
        <Modal
          title={
            edit ? "A little wardrobe edit" : "Meet your next favorite piece"
          }
          onClose={close}
        >
          <form onSubmit={save}>
            <div className="form-grid">
              <label className="field full">
                Name
                <input
                  name="name"
                  required
                  maxLength={100}
                  defaultValue={edit?.name}
                  placeholder="My vintage suede jacket"
                />
              </label>
              <label className="field">
                Category
                <select name="category" defaultValue={edit?.category || "tops"}>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                Color
                <input
                  name="primary_color"
                  required
                  defaultValue={edit?.primary_color}
                  placeholder="Brown"
                />
              </label>
              <label className="field">
                Brand (optional)
                <input name="brand" defaultValue={edit?.brand} />
              </label>
              <label className="field">
                Fit
                <select name="fit" defaultValue={edit?.fit || "regular"}>
                  {["regular", "fitted", "oversized", "relaxed"].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                Subcategory
                <input name="subcategory" defaultValue={edit?.subcategory} />
              </label>
              <label className="field">
                Pattern
                <input name="pattern" defaultValue={edit?.pattern || "solid"} />
              </label>
              <label className="field">
                Seasons (comma separated)
                <input name="season" defaultValue={edit?.season.join(", ")} />
              </label>
              <label className="field">
                Style tags
                <input
                  name="style_tags"
                  defaultValue={edit?.style_tags.join(", ")}
                />
              </label>
              {!edit && (
                <label className="field full">
                  Photo · JPG, PNG or WebP, up to 4 MB
                  <input
                    type="file"
                    name="image"
                    accept="image/jpeg,image/png,image/webp"
                  />
                </label>
              )}
            </div>
            <button disabled={busy} className="button">
              {busy ? "Saving…" : edit ? "Save changes" : "Add to my closet"}
            </button>
            <Notice message={message} />
          </form>
        </Modal>
      )}
    </>
  );
}
