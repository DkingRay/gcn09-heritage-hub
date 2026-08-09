import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CREST_URL, NAV_LINKS, ORG } from "@/lib/site";
import { useSession, useIsAdmin } from "@/hooks/useSession";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useRouterState({ select: (s) => s.location });
  const { user } = useSession();
  const { data: isAdmin } = useIsAdmin(user?.id);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={CREST_URL}
            alt="Government College Nasarawa crest"
            width={48}
            height={48}
            className="h-11 w-11 shrink-0 object-contain"
          />
          <span className="min-w-0">
            <span className="block truncate text-base font-bold leading-tight text-brand-deep">
              {ORG.short}
            </span>
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:block">
              Alumni Association
            </span>
          </span>
        </Link>

        <ul className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:text-brand ${
                    active ? "text-brand" : "text-foreground/80"
                  }`}
                >
                  {link.label}
                  {active ? (
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-gradient-gold" />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          {user ? (
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link to={isAdmin ? "/admin" : "/member/dashboard"}>
                {isAdmin ? "Admin" : "My Dashboard"}
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/login">
                <LogIn className="mr-1.5 h-4 w-4" /> Member Login
              </Link>
            </Button>
          )}
          <Button asChild size="sm" className="hidden shadow-gold sm:inline-flex">
            <Link to="/membership/register">Join GCN 09 Set</Link>
          </Button>
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border text-brand-deep lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-border bg-background px-4 pb-6 pt-3 lg:hidden">
          <ul className="grid gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-base font-medium text-foreground/90 hover:bg-secondary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-2">
            <Button asChild size="lg" onClick={() => setOpen(false)}>
              <Link to="/membership/register">Join GCN 09 Set</Link>
            </Button>
            <Button asChild variant="outline" size="lg" onClick={() => setOpen(false)}>
              <Link to={user ? (isAdmin ? "/admin" : "/member/dashboard") : "/login"}>
                {user ? "My Dashboard" : "Member Login"}
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
