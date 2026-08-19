"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { locales, localeLabels } from "@/lib/i18n/config";
import { useLocale, switchLocalePath } from "@/contexts/LocaleContext";

export default function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { locale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const textColor = dark ? "rgba(255,255,255,0.85)" : "#0D0D0D";
  const borderColor = dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.12)";
  const bg = dark ? "rgba(255,255,255,0.08)" : "#F7F7F7";

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Choisir la langue / Choose language"
        style={{
          display: "flex", alignItems: "center", gap: 6, background: bg, border: `0.5px solid ${borderColor}`,
          borderRadius: 8, padding: "6px 10px", fontSize: 12.5, fontWeight: 700, color: textColor, cursor: "pointer",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20z" />
        </svg>
        {locale.toUpperCase()}
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0, width: 170, background: "#fff",
            border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: 12, boxShadow: "0 12px 36px rgba(0,0,0,0.16)",
            overflow: "hidden", zIndex: 2000,
          }}
        >
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setOpen(false);
                router.push(switchLocalePath(pathname, l));
              }}
              style={{
                display: "block", width: "100%", textAlign: "left", padding: "10px 14px", fontSize: 13, fontWeight: l === locale ? 700 : 500,
                color: "#0D0D0D", background: l === locale ? "#FFFBE0" : "transparent", border: "none", cursor: "pointer",
              }}
            >
              {localeLabels[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
