import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="bg-hero text-navy-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-foreground/70">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {children && <div className="mt-3 max-w-2xl text-navy-foreground/80">{children}</div>}
      </div>
    </section>
  );
}
