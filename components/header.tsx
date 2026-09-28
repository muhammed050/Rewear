"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <Brand />
      <nav aria-label="Main navigation" className={open ? "nav open" : "nav"}>
        <Link onClick={() => setOpen(false)} href="/how-it-works">
          How it works
        </Link>
        <Link onClick={() => setOpen(false)} href="/examples">
          The lookbook
        </Link>
        <Link onClick={() => setOpen(false)} href="/pricing">
          Rewear+
        </Link>
      </nav>
      <div className="header-actions">
        <Link className="sign-in-link" href="/sign-in">
          Sign in
        </Link>
        <Link className="button small" href="/recreate">
          Recreate a look <ArrowUpRight size={16} />
        </Link>
        <button
          className="icon-button mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
