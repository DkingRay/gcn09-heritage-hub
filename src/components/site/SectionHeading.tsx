import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  const centered = align === "center";
  return (
    <Reveal className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p
          className={`text-xs font-semibold uppercase tracking-[0.22em] ${
            tone === "dark" ? "text-gold" : "text-brand"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem] ${
          tone === "dark" ? "text-brand-deep-foreground" : "text-brand-deep"
        }`}
      >
        {title}
      </h2>
      {body ? (
        <p
          className={`mt-5 text-base leading-relaxed sm:text-lg ${
            tone === "dark" ? "text-brand-deep-foreground/80" : "text-muted-foreground"
          }`}
        >
          {body}
        </p>
      ) : null}
      <div
        className={`mt-6 h-1 w-16 rounded-full bg-gradient-gold ${centered ? "mx-auto" : ""}`}
      />
    </Reveal>
  );
}
