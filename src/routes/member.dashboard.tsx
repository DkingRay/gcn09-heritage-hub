import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, FileText, LogOut, MapPin, Settings, ShieldCheck, User } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSession, useMyMember, useIsAdmin, useSignedPhoto } from "@/hooks/useSession";
import { useEvents, useNews } from "@/lib/queries";
import { CREST_URL, ORG } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/member/dashboard")({
  head: () => ({
    meta: [
      { title: "Member Dashboard | GCN 09 Set Alumni" },
      {
        name: "description",
        content: "Your personal member area for the GCN 09 Set Alumni portal.",
      },
    ],
  }),
  component: MemberDashboard,
});

function MemberDashboard() {
  const navigate = useNavigate();
  const { user, loading: sessionLoading } = useSession();
  const { data: member, isLoading: memberLoading } = useMyMember(user?.id);
  const { data: isAdmin } = useIsAdmin(user?.id);
  const photoUrl = useSignedPhoto(member?.photo_url);
  const { data: events } = useEvents(5);
  const { data: news } = useNews(3);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (sessionLoading || memberLoading) {
    return (
      <SiteLayout>
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <div className="h-8 w-48 mx-auto animate-pulse rounded bg-muted" />
            <div className="mt-6 h-40 w-full animate-pulse rounded-3xl bg-muted" />
          </div>
        </section>
      </SiteLayout>
    );
  }

  if (!user) {
    return (
      <SiteLayout>
        <section className="py-24">
          <div className="mx-auto max-w-xl px-4 text-center">
            <img src={CREST_URL} alt="GCN crest" className="mx-auto w-20" />
            <h1 className="mt-6 text-2xl font-bold text-brand-deep">Sign in required</h1>
            <p className="mt-3 text-muted-foreground">
              Please sign in to access your member dashboard.
            </p>
            <Button asChild size="lg" className="mt-6 rounded-full">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="bg-gradient-brand py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white/20 bg-white/10">
              {photoUrl ? (
                <img src={photoUrl} alt={member?.first_name ?? ""} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gradient-brand">
                  <User className="h-12 w-12 text-white/60" />
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {member?.first_name} {member?.last_name}
              </h1>
              <p className="mt-1 text-sm text-white/70">
                {member?.membership_id} · {ORG.short}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <Badge variant={member?.status === "active" ? "default" : "secondary"}>
                  {member?.status === "active" ? "Active Member" : member?.status ?? "Pending"}
                </Badge>
                {isAdmin && (
                  <Badge className="bg-gold text-brand-deep">
                    <ShieldCheck className="mr-1 h-3 w-3" /> Admin
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Card */}
            <div className="lg:col-span-2 space-y-6">
              <Reveal>
                <Card className="rounded-3xl border-border shadow-card">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-brand-deep">My Profile</h2>
                      {isAdmin && (
                        <Button asChild size="sm" className="rounded-full">
                          <Link to="/admin">
                            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Admin Dashboard
                          </Link>
                        </Button>
                      )}
                    </div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <InfoRow label="Email" value={member?.email} />
                      <InfoRow label="Phone" value={member?.phone} />
                      <InfoRow label="WhatsApp" value={member?.whatsapp} />
                      <InfoRow label="City" value={member?.city} />
                      <InfoRow label="State" value={member?.state} />
                      <InfoRow label="Country" value={member?.country} />
                      <InfoRow label="House" value={member?.house} />
                      <InfoRow label="Profession" value={member?.profession} />
                      <InfoRow label="Organisation" value={member?.organisation} />
                      <InfoRow label="Job Title" value={member?.job_title} />
                    </div>
                  </CardContent>
                </Card>
              </Reveal>

              {/* Upcoming Events */}
              {events && events.length > 0 && (
                <Reveal>
                  <Card className="rounded-3xl border-border shadow-card">
                    <CardContent className="p-6 sm:p-8">
                      <h2 className="text-lg font-bold text-brand-deep">Upcoming Events</h2>
                      <div className="mt-4 space-y-3">
                        {events.map((ev) => (
                          <Link
                            key={ev.id}
                            to="/events"
                            className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background p-4 transition-colors hover:bg-accent"
                          >
                            <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                            <div className="min-w-0">
                              <p className="font-semibold text-brand-deep">{ev.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {ev.event_date ?? "Date TBC"} · {ev.venue ?? "Venue TBC"}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Links */}
              <Reveal>
                <Card className="rounded-3xl border-border shadow-card">
                  <CardContent className="p-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Quick Links
                    </h3>
                    <div className="mt-4 space-y-2">
                      <SidebarLink to="/events" icon={<CalendarDays className="h-4 w-4" />} label="Events" />
                      <SidebarLink to="/news" icon={<FileText className="h-4 w-4" />} label="News" />
                      <SidebarLink to="/projects" icon={<MapPin className="h-4 w-4" />} label="Projects" />
                      <SidebarLink to="/contact" icon={<Settings className="h-4 w-4" />} label="Contact" />
                    </div>
                  </CardContent>
                </Card>
              </Reveal>

              {/* Latest News */}
              {news && news.length > 0 && (
                <Reveal>
                  <Card className="rounded-3xl border-border shadow-card">
                    <CardContent className="p-6">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Latest News
                      </h3>
                      <div className="mt-4 space-y-3">
                        {news.map((post) => (
                          <Link
                            key={post.id}
                            to="/news/$slug"
                            params={{ slug: post.slug }}
                            className="block rounded-xl p-3 transition-colors hover:bg-accent"
                          >
                            <p className="text-sm font-semibold text-brand-deep">{post.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{post.published_at}</p>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              )}

              {/* Sign Out */}
              <Reveal>
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </Button>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}

function SidebarLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-brand"
    >
      <span className="text-muted-foreground">{icon}</span>
      {label}
    </Link>
  );
}
