import { MapPin } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import type { Executive } from "@/lib/executives";

const TITLES = new Set([
  "hon.",
  "hon",
  "mr.",
  "mrs.",
  "ms.",
 "dr.",
  "chief",
  "engr.",
  "prof.",
  "alhaji",
  "mallam",
  "sir",
  "rev.",
]);

function initials(name: string): string {
  const parts = name
    .split(/\s+/)
    .filter((part) => part && !TITLES.has(part.replace(/[.,]/g, "").toLowerCase()));

  if (parts.length === 0) return "?";

  const first = parts[0]!.charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1]!.charAt(0) : "";
  return (first + last).toUpperCase();
}

export function Executives({
  executives,
  eyebrow = "Executive Committee",
  title = "Meet the Executive Committee",
  body = "Elected officers serving the 2009 Set Alumni.",
}: {
  executives: Executive[];
  eyebrow?: string;
  title?: string;
  body?: string;
}) {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          body={body}
          align="center"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {executives.map((exec, i) => (
            <Reveal key={exec.name} delay={i * 70}>
              <div className="group h-full overflow-hidden rounded-3xl border border-border bg-card shadow-card card-lift text-center">
                <div className="relative aspect-square overflow-hidden bg-accent">
                  {exec.image ? (
                    <img
                      src={exec.image}
                      alt={exec.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-brand">
                      <span className="text-4xl font-bold text-brand-foreground/90">
                        {initials(exec.name)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-brand-deep">{exec.name}</h3>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-brand">
                    {exec.role}
                  </p>
                  <p className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-gold" />
                    {exec.state}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
