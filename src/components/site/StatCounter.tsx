import { useEffect, useRef, useState } from "react";

export function StatCounter({
  value,
  prefix = "",
  suffix = "",
  label,
}: {
  value: number;
  prefix?: string | null;
  suffix?: string | null;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        const duration = 1200;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(value * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-bold text-gold sm:text-5xl">
        {prefix ?? ""}
        {display.toLocaleString()}
        {suffix ?? ""}
      </p>
      <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-brand-deep-foreground/75">
        {label}
      </p>
    </div>
  );
}
