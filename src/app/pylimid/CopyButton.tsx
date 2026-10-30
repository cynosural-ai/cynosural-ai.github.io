"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

export default function CopyButton({ value, label = "Copy code" }: { value: string; label?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timeout = window.setTimeout(() => setStatus("idle"), 3000);
    return () => window.clearTimeout(timeout);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <span className="readme-copy-control">
      <button type="button" className="readme-copy" onClick={copy} aria-label={label}>
        {status === "copied" ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
        <span>{status === "copied" ? "Copied" : label}</span>
      </button>
      <span className={status === "error" ? "readme-copy-error" : "readme-sr-only"} role="status">
        {status === "copied" ? `${label} copied to clipboard.` : status === "error" ? "Select the code to copy it manually." : ""}
      </span>
    </span>
  );
}
