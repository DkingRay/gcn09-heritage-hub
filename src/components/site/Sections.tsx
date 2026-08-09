import * as Icons from "lucide-react";
import { CORE_VALUES, FOCUS_AREAS, DEFAULT_STATS } from "@/lib/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { StatCounter } from "./StatCounter";
import { useStats } from "@/lib/queries";

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Circle;
  return <Cmp className={className} />;
}

export function MissionVision() {
  const cards = [
    {
      eyebrow: "Our Mission",
      icon: "Target",
      body: "To build a united and purposeful alumni community that promotes the welfare and development of its members, supports education, empowers vulnerable communities and contributes meaningfully to social and economic development through service, collaboration and sustainable initiatives.",
      tone: "brand",
    },
    {
      eyebrow: "Our Vision",
      icon: "Telescope",
      body: "To become a strong, united and impactful alumni community recognised for transforming lives, supporting education and contributing to sustainable development within our communities and beyond.",
      tone: "navy",
    },
  ];

  return (
    <section className="bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {cards.map((card, i) => (
            <Reveal key={card.eyebrow} delay={i * 120}>
              <div
                className={`h-full rounded-[2rem] p-8 shadow-card sm:p-10 ${
                  card.tone === "brand"
                    ? "bg-gradient-brand text-brand-foreground"
                    : "bg-navy text-navy-foreground"
                }`}
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gold text-gold-foreground">
                  <Icon name={card.icon} className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-2xl font-bold sm:text-3xl">{card.eyebrow}</h3>
                <div className="mt-4 h-1 w-14 rounded-full bg-gradient-gold" />
                <p className="mt-6 text-base leading-relaxed opacity-90">{card.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CoreValues() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Core Values"
          title="What We Stand For"
          body="Seven commitments that shape how we serve one another and the communities around us."
          align="center"
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CORE_VALUES.map((value, i) => (
            <Reveal key={value.title} delay={i * 70}>
              <div className="h-full rounded-3xl border border-border bg-card p-7 shadow-card card-lift">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-brand">
                  <Icon name={value.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold uppercase tracking-[0.1em] text-brand-deep">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.subtitle}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FocusAreas() {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Focus Areas"
          title="Where We Direct Our Energy"
          body="Our work is organised around the areas where a united set can create durable, measurable change."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FOCUS_AREAS.map((area, i) => (
            <Reveal key={area.title} delay={i * 80}>
              <div className="group h-full rounded-3xl border border-border bg-card p-8 shadow-card card-lift">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-brand-foreground transition-transform duration-500 group-hover:scale-105">
                  <Icon name={area.icon} className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-brand-deep">{area.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{area.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ImpactStats() {
  const { data } = useStats();
  const stats = data && data.length > 0 ? data : DEFAULT_STATS;

  return (
    <section className="relative overflow-hidden bg-brand-deep py-20 sm:py-24">
      <div
        className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl float-slow"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Impact"
          title="Measured, Transparent, Growing"
          body="These figures are maintained by our administrators and updated as verified data becomes available."
          align="center"
          tone="dark"
        />
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, i) => (
            <Reveal key={`${stat.label}-${i}`} delay={i * 70}>
              <StatCounter
                value={Number(stat.value)}
                prefix={stat.prefix}
                suffix={stat.suffix}
                label={stat.label}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
