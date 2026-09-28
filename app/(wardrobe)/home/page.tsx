"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { request, Notice } from "@/components/ui";
import { ClosetItem } from "@/lib/schemas";
export default function Page() {
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    Promise.all([
      request<{ items: ClosetItem[] }>("/api/closet"),
      request<{ profile: { display_name: string } }>("/api/profile"),
    ])
      .then(([c, p]) => {
        setItems(c.items);
        setName(p.profile.display_name);
      })
      .catch((e) => setMessage(e.message));
  }, []);
  return (
    <>
      <span className="eyebrow">
        {name
          ? `A FRESH LOOK, ${name.toUpperCase()}`
          : "A FRESH LOOK AT YOUR FAVORITES"}
      </span>
      <h1>
        What are we
        <br />
        <em>wearing today?</em>
      </h1>
      <p className="page-intro">
        Your next great outfit might be one you already own.
      </p>
      <div className="two-cols">
        <div className="panel" style={{ background: "#f3e4e8" }}>
          <Sparkles color="#8f243e" />
          <h2 style={{ fontSize: 39, margin: "25px 0" }}>
            A saved look.
            <br />
            Your own version.
          </h2>
          <p>Drop the inspiration and let’s find it in your closet.</p>
          <Link className="button" style={{ marginTop: 25 }} href="/recreate">
            Recreate a saved look <ArrowUpRight size={17} />
          </Link>
        </div>
        <div
          style={{
            position: "relative",
            minHeight: 310,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <Image
            src="/images/editorial.webp"
            alt="Everyday outfit and wardrobe pieces"
            fill
            sizes="50vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
      <Notice message={message} />
      {message.includes("Sign in") && (
        <Link href="/sign-in" className="button">
          Sign in to your wardrobe
        </Link>
      )}
      <div className="row" style={{ margin: "40px 0 20px" }}>
        <h2 style={{ fontSize: 35 }}>Recently added</h2>
        <Link className="text-link" href="/closet">
          Your closet →
        </Link>
      </div>
      {items.length ? (
        <div className="closet-grid">
          {items.slice(0, 4).map((i) => (
            <Link href="/closet" className="item-card" key={i.id}>
              <div className="item-photo">
                {i.image_url ? (
                  <Image src={i.image_url} alt={i.name} fill unoptimized />
                ) : (
                  <span>{i.category}</span>
                )}
              </div>
              <div className="item-info">
                <h3>{i.name}</h3>
                <p>{i.primary_color}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>
          Your favorites will live here.{" "}
          <Link className="text-link" href="/closet">
            Add your first piece →
          </Link>
        </p>
      )}
    </>
  );
}
