import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Lifecycle } from "@/components/lifecycle";
import { appUrl } from "@/lib/config";
export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Rewear — You already own the outfit.",
    template: "%s | Rewear",
  },
  description:
    "Turn saved looks into outfits you can actually wear. Recreate outfit inspiration with your own digital closet.",
  applicationName: "Rewear",
  openGraph: {
    type: "website",
    siteName: "Rewear",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg", apple: "/icons/apple.png" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Rewear" },
  manifest: "/manifest.webmanifest",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FCFBF8",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <Lifecycle />
      </body>
    </html>
  );
}
