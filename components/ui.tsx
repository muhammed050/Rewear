"use client";
import { useEffect, useRef } from "react";
import { X, Shirt } from "lucide-react";
import Link from "next/link";
export async function request<T = Record<string, unknown>>(
  url: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  const r = await fetch(url, {
    method,
    headers:
      body instanceof FormData
        ? undefined
        : body
          ? { "Content-Type": "application/json" }
          : undefined,
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Please try again.");
  return data;
}
export function Notice({ message }: { message: string }) {
  return message ? (
    <div className="status" role="status">
      {message}
    </div>
  ) : null;
}
export function Empty({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="empty-state">
      <Shirt />
      <h2>{title}</h2>
      <p>{description}</p>
      {href && (
        <Link className="button" href={href}>
          {label}
        </Link>
      )}
    </div>
  );
}
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement;
    ref.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const nodes = ref.current?.querySelectorAll<HTMLElement>(
          "button,input,select,textarea,a[href]",
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = overflow;
      prev?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="modal"
      >
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-button" aria-label="Close" onClick={onClose}>
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
