"use client";
import { track } from "@/lib/analytics";
import { useEffect } from "react";
export function Lifecycle() {
  useEffect(() => {
    if (location.pathname === "/") track("landing_view");
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    const params = new URLSearchParams(location.search);
    const data: Record<string, string> = {};
    for (const key of [
      "a",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ]) {
      const value = params.get(key);
      if (value) data[key] = value.slice(0, 200);
    }
    if (Object.keys(data).length)
      sessionStorage.setItem("rewear_attribution", JSON.stringify(data));
  }, []);
  return null;
}
