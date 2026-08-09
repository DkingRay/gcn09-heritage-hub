import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { CREST_URL, ORG } from "@/lib/site";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Home", to: "/" },
      { label: "About", to: "/about" },
      { label: "Projects", to: "/projects" },
      { label: "Events", to: "/events" },
      { label: "News", to: "/news" },
      { label: "Gallery", to: "/gallery" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Join Us", to: "/membership/register" },
      { label: "Volunteer", to: "/volunteer" },
      { label: "Donate", to: "/support" },
      { label: "Partner With Us", to: "/contact" },
    ],
  },
  {
    title: "Members",
    links: [
      { label: "Member Login", to: "/login" },
      { label: "Member Directory", to: "/alumni" },
      { label: "Member Dashboard", to: "/member/dashboard" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Use", to: "/terms" },
      { label: "Governance", to: "/governance" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-brand-deep text-brand-deep-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <div className="flex items-center gap-4">
              <img
                src={CREST_URL}
                alt="GCN 09 Set Alumni crest"
                width={64}
                height={64}
                loading="lazy"
                className="h-16 w-16 object-contain"
              />
              <div className="min-w-0">
                <p className="text-lg font-bold">{ORG.short}</p>
                <p className="text-sm text-brand-deep-foreground/75">{ORG.name}</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-base font-medium text-gold">{ORG.tagline}</p>
            <ul className="mt-6 space-y-3 text-sm text-brand-deep-foreground/80">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {ORG.address}
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {ORG.email}
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {ORG.phone}
              </li>
            </ul>
            <div className="mt-6 flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social media link"
                  className="grid h-10 w-10 place-items-center rounded-full border border-brand-deep-foreground/25 text-brand-deep-foreground/85 transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-brand-deep-foreground/80 transition-colors hover:text-gold"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-brand-deep-foreground/15 pt-6 text-sm text-brand-deep-foreground/70 sm:flex sm:items-center sm:justify-between">
          <p>© 2026 {ORG.name}. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0">RC {ORG.rcNumber} · Incorporated in Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
