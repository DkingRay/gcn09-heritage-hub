import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { CardSkeletons, EmptyState } from "@/components/site/Cards";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/lib/queries";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import pageHeroImage from "@/assets/hero-1.jpg.asset.json";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events | GCN 09 Set Alumni" },
      {
        name: "description",
        content:
          "Reunions, annual general meetings, networking, charity and community outreach events organised by the Government College Nasarawa 2009 Set Alumni.",
      },
      { property: "og:title", content: "Events | GCN 09 Set Alumni" },
      {
        property: "og:description",
        content: "Upcoming reunions, meetings and outreach events of the GCN 09 Set.",
      },
    ],
  }),
  component: Events,
});

function Events() {
  const { data, isLoading } = useEvents();
  const { user } = useSession();

  async function register(eventId: string) {
    if (!user) {
      toast.error("Please sign in as a member to register.");
      return;
    }
    const { error } = await supabase.from("event_registrations").insert({
      event_id: eventId,
      user_id: user.id,
      email: user.email ?? null,
    });
    if (error) {
      toast.error(
        error.code === "23505" ? "You are already registered for this event." : error.message,
      );
      return;
    }
    toast.success("You're registered. See you there!");
  }

  return (
    <SiteLayout>
      <PageHero
        image={pageHeroImage.url}
        imageAlt="GCN 09 Set alumni gathered at a reunion event"
        eyebrow="Events"
        title="Where the set meets, decides and gives back."
        body="Registration for members opens for each published event. Sign in to reserve your place."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <CardSkeletons count={3} />
          ) : data && data.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {data.map((event) => (
                <article
                  key={event.id}
                  className="overflow-hidden rounded-3xl border border-border bg-card shadow-card card-lift"
                >
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      loading="lazy"
                      className="aspect-[16/7] w-full object-cover"
                    />
                  ) : null}
                  <div className="p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="secondary">{event.category}</Badge>
                      <Badge
                        className={
                          event.registration_open
                            ? "bg-gold text-gold-foreground hover:bg-gold"
                            : "bg-muted text-muted-foreground hover:bg-muted"
                        }
                      >
                        {event.registration_open ? "Registration open" : "Registration closed"}
                      </Badge>
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold text-brand-deep">{event.title}</h2>
                    <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                      {event.event_date ? (
                        <span className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-brand" /> {event.event_date}
                        </span>
                      ) : null}
                      {event.event_time ? (
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-brand" /> {event.event_time}
                        </span>
                      ) : null}
                      {event.venue ? (
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-brand" /> {event.venue}
                        </span>
                      ) : null}
                    </div>
                    {event.description ? (
                      <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                        {event.description}
                      </p>
                    ) : null}
                    <div className="mt-7 flex flex-wrap gap-3">
                      <Button
                        className="rounded-full"
                        disabled={!event.registration_open}
                        onClick={() => register(event.id)}
                      >
                        Register for this event
                      </Button>
                      {!user ? (
                        <Button asChild variant="outline" className="rounded-full">
                          <Link to="/login">Member login</Link>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No events published yet"
              body="Once the executive committee publishes the calendar, events and registration will appear here."
            />
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
