import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Reveal } from "./Reveal";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-brand">
      <div
        className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-gold/15 blur-3xl float-slow"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-brand-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {body ? (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-foreground/85 sm:text-lg">
              {body}
            </p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </Reveal>
      </div>
    </section>
  );
}
