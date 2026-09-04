import { useEffect, useState } from "react";
import hero1 from "@/assets/Hero1.jpeg";
import hero2 from "@/assets/Hero2.jpeg";
import hero3 from "@/assets/Hero3.jpeg";
import hero4 from "@/assets/Hero4.jpeg";
import hero5 from "@/assets/Hero5.jpeg";
import hero6 from "@/assets/hero-1.jpg";

const SLIDES = [
  { url: hero1, alt: "GCN 09 Set alumni gathered together at a members' reunion" },
  { url: hero2, alt: "Alumni celebrating together at an outdoor set gathering" },
  { url: hero3, alt: "Members of the 2009 Set together at a school-day photograph" },
  { url: hero4, alt: "Students of Government College Nasarawa in school uniform" },
  { url: hero5, alt: "Alumni relaxing together during a set outing" },
  { url: hero6, alt: "Archive photograph of the 2009 Set on the school grounds" },
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
