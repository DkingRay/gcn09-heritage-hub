import { useEffect, useState } from "react";
import hero1 from "@/assets/hero-4.jpg.asset.json";
import hero2 from "@/assets/hero-5.jpg.asset.json";
import hero3 from "@/assets/hero-2.jpg.asset.json";
import hero4 from "@/assets/hero-1.jpg.asset.json";
import hero5 from "@/assets/hero-3.jpg.asset.json";
import hero6 from "@/assets/hero-6.jpg.asset.json";

const SLIDES = [
  { url: hero1.url, alt: "GCN 09 Set alumni gathered together at a members' reunion" },
  { url: hero2.url, alt: "Alumni celebrating together at an outdoor set gathering" },
  { url: hero3.url, alt: "Members of the 2009 Set together at a school-day photograph" },
  { url: hero4.url, alt: "Students of Government College Nasarawa in school uniform" },
  { url: hero5.url, alt: "Alumni relaxing together during a set outing" },
  { url: hero6.url, alt: "Archive photograph of the 2009 Set on the school grounds" },
];

const INTERVAL = 6500;

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden={false}>
      {SLIDES.map((slide, i) => (
        <img
          key={slide.url}
          src={slide.url}
          alt={i === 0 ? slide.alt : ""}
          {...(i === 0 ? {} : { "aria-hidden": true })}
          loading={i === 0 ? "eager" : "lazy"}
          data-active={i === index}
          className="hero-slide absolute inset-0 h-full w-full object-cover object-center"
        />
      ))}
    </div>
  );
}
