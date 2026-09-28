"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Sparkles,
  Shirt,
  Heart,
  Settings,
  ArrowUpRight,
  MessageCircle,
  Briefcase,
  User,
} from "lucide-react";
import { Brand } from "./brand";
const nav = [
  ["/home", "Home", Home],
  ["/recreate", "Recreate", Sparkles],
  ["/closet", "My closet", Shirt],
  ["/outfits", "Saved outfits", Heart],
  ["/stylist", "My stylist", MessageCircle],
  ["/pack", "Pack for me", Briefcase],
  ["/settings", "Settings", Settings],
] as const;
export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <nav aria-label="Your wardrobe">
          {nav.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              className={path.startsWith(href) ? "active" : ""}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <p>A little more closet magic.</p>
          <Link href="/pricing" className="button small">
            Meet Rewear+ <ArrowUpRight size={16} />
          </Link>
        </div>
      </aside>
      <main id="main" className="workspace">
        <div className="workspace-header">
          <Link href="/">← Rewear</Link>
          <Link href="/settings/billing">
            Your membership{" "}
            <ArrowUpRight size={12} style={{ display: "inline" }} />
          </Link>
        </div>
        {children}
      </main>
      <nav className="app-bottom-nav" aria-label="Mobile wardrobe navigation">
        {[
          nav[0],
          nav[1],
          nav[2],
          nav[3],
          ["/settings", "Profile", User] as const,
        ].map(([href, label, Icon]) => (
          <Link
            className={path.startsWith(href) ? "active" : ""}
            key={href}
            href={href}
          >
            <Icon size={19} />
            {label.replace("My ", "")}
          </Link>
        ))}
      </nav>
    </div>
  );
}
