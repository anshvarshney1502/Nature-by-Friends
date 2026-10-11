"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Soundscape } from "@/components/audio/Soundscape";

const links = [
  { href: "/", label: "Home", icon: "M3 11 12 3l9 8M5 9.5V20h5v-6h4v6h5V9.5" },
  { href: "/garden", label: "Garden", icon: "M12 21c-4-3-7-6-7-10a7 7 0 0 1 14 0c0 4-3 7-7 10Zm0-13v8m-3-5 3 2 3-2" },
  { href: "/missions", label: "Mission", icon: "M12 3a6 6 0 0 0-6 6c0 4 6 12 6 12s6-8 6-12a6 6 0 0 0-6-6Zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" },
  { href: "/listen", label: "Listen", icon: "M3 14v-2a9 9 0 0 1 18 0v2M3 14a2 2 0 0 1 2-2h1v7H5a2 2 0 0 1-2-2v-3Zm18 0a2 2 0 0 0-2-2h-1v7h1a2 2 0 0 0 2-2v-3Z" },
  { href: "/journal", label: "Journal", icon: "M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Zm0 13a3 3 0 0 1 3-3h11M9 8h6" },
  { href: "/stories", label: "Stories", icon: "M3 6c3-2 6-2 9 0v14c-3-2-6-2-9 0V6Zm9 0c3-2 6-2 9 0v14c-3-2-6-2-9 0" },
  { href: "/ecosystem", label: "Web", icon: "M6 6a2 2 0 1 0 0 .1M18 6a2 2 0 1 0 0 .1M12 18a2 2 0 1 0 0 .1M7.5 7.5 11 16.5M16.5 7.5 13 16.5M8 6h8" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 rounded-xl font-[family-name:var(--font-display)] text-xl font-semibold text-forest">
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="#cfe5b4" stroke="#2d2a22" strokeWidth="2" />
        <path d="M20 31 C 20 22, 12 18, 10 12 C 18 12, 22 18, 20 31 Z" fill="#4f8a2e" stroke="#2d2a22" strokeWidth="2" strokeLinejoin="round" />
        <path d="M20 31 C 20 24, 26 20, 30 16 C 30 24, 24 28, 20 31 Z" fill="#7cb35a" stroke="#2d2a22" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <span>Nature <span className="text-leaf">by Friends</span></span>
    </Link>
  );
}

export function Nav() {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));
  return (
    <>
      <header className="sticky top-0 z-30 border-b-2 border-leaf/15 bg-paper/90 backdrop-blur">
        <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5">
          <Logo />
          <ul className="ml-auto hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active(l.href) ? "page" : undefined}
                  className={`rounded-full px-4 py-2 font-[family-name:var(--font-display)] font-medium transition-colors ${active(l.href) ? "bg-leaf-soft text-forest" : "text-ink-soft hover:bg-butter-soft"}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Soundscape />
        </nav>
      </header>
      <nav aria-label="Main mobile" className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-leaf/20 bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <ul className="grid grid-cols-5">
          {links.filter((l) => l.href !== "/ecosystem" && l.href !== "/stories").map((l) => (
            <li key={l.href}>
              <Link href={l.href} aria-current={active(l.href) ? "page" : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-bold ${active(l.href) ? "text-moss" : "text-ink-soft"}`}>
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={l.icon} />
                </svg>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
