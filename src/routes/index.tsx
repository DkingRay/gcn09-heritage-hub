import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { CoreValues, FocusAreas, ImpactStats, MissionVision } from "@/components/site/Sections";
import { CardSkeletons, EmptyState, NewsCard, ProjectCard } from "@/components/site/Cards";
import { useEvents, useNews, useProjects } from "@/lib/queries";
import { CREST_URL, ORG } from "@/lib/site";
import heroImage from "@/assets/hero-alumni.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GCN 09 Set Alumni | Government College Nasarawa 2009 Set" },
      {
        name: "description",
        content:
          "Government College Nasarawa 2009 Set Alumni — connecting members, supporting education, promoting welfare and creating lasting impact through service and community development.",
      },
      { property: "og:title", content: "GCN 09 Set Alumni | United by Heritage. Driven by Impact." },
      {
        property: "og:description",
        content:
          "The alumni association of the 2009 Set of Government College Nasarawa — welfare, education, community development and service.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const projects = useProjects({ limit: 4 });
  const events = useEvents(3);
  const news = useNews(3);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="GCN 09 Set alumni gathered together on the school grounds"
          width={1920}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-32 top-16 h-96 w-96 rounded-full bg-gold/20 blur-3xl float-slow"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-brand/30 blur-3xl float-slow"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.5fr_1fr] lg:items-center lg:px-8 lg:py-32">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-foreground/25 bg-brand-foreground/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-foreground backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-gold" /> Unity · Service · Impact · Legacy
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-7 text-4xl font-bold leading-[1.08] text-brand-foreground sm:text-5xl lg:text-6xl">
                United by Heritage.
                <br />
                <span className="text-gold">Driven by Impact.</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-brand-foreground/90 sm:text-lg">
                We are the Government College Nasarawa 2009 Set Alumni — a community built on shared
                memories, enduring friendships and a commitment to creating meaningful impact
                through welfare, education, community development and service.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-13 rounded-full px-8 text-base shadow-gold">
                  <Link to="/membership/register">Join the Alumni Community</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-13 rounded-full border-brand-foreground/40 bg-brand-foreground/10 px-8 text-base text-brand-foreground backdrop-blur hover:bg-brand-foreground/20 hover:text-brand-foreground"
                >
                  <Link to="/impact">Explore Our Impact</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="hidden lg:block">
            <div className="relative mx-auto w-full max-w-sm rounded-[2.5rem] border border-brand-foreground/20 bg-brand-foreground/10 p-10 text-center backdrop-blur-md">
              <img
                src={CREST_URL}
                alt="Government College Nasarawa crest"
                width={260}
                height={260}
                className="mx-auto w-56 drop-shadow-2xl float-slow"
              />
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                Set of 2009
              </p>
              <p className="mt-2 text-sm text-brand-foreground/80">
                Wisdom · Knowledge · Prosperity
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <SectionHeading
            eyebrow="Who We Are"
            title="One Set. One Legacy. One Purpose."
            body="The GCN 09 Set is a community of former students of Government College Nasarawa united by a shared history, common values and a commitment to giving back."
          />
          <Reveal delay={120}>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Years after leaving school, the relationships and values developed during our
              formative years continue to connect us. Today, we are transforming those bonds into
              opportunities to support one another, strengthen education, empower communities and
              create a lasting legacy.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full px-7">
              <Link to="/about">
                Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <MissionVision />
      <CoreValues />
      <FocusAreas />
      <ImpactStats />

      {/* FEATURED PROJECTS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="gap-6 sm:flex sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Projects"
              title="Service Turned Into Action"
              body="A living record of the initiatives our members deliver across education, welfare and community development."
            />
            <Button asChild variant="outline" className="mt-8 shrink-0 rounded-full sm:mt-0">
              <Link to="/projects">View All Projects</Link>
            </Button>
          </div>
          <div className="mt-14">
            {projects.isLoading ? (
              <CardSkeletons />
            ) : projects.data && projects.data.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {projects.data.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Projects will appear here soon"
                body="Our administrators publish each initiative with its location, beneficiaries and outcomes as it is approved."
              />
            )}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Events"
            title="Upcoming Gatherings"
            body="Reunions, general meetings, outreach and networking moments that keep the set connected."
          />
          <div className="mt-14">
            {events.isLoading ? (
              <CardSkeletons />
            ) : events.data && events.data.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.data.map((event) => (
                  <div
                    key={event.slug}
                    className="rounded-3xl border border-border bg-card p-7 shadow-card card-lift"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                      {event.category}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-brand-deep">{event.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {[event.event_date, event.event_time, event.venue].filter(Boolean).join(" · ")}
                    </p>
                    <Button asChild variant="outline" className="mt-6 rounded-full">
                      <Link to="/events">Event details</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No events scheduled yet"
                body="Once the executive committee publishes the calendar, upcoming events and registration will appear here."
              />
            )}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="gap-6 sm:flex sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="News & Stories"
              title="From the Community"
              body="Announcements, member stories and updates from across the set."
            />
            <Button asChild variant="outline" className="mt-8 shrink-0 rounded-full sm:mt-0">
              <Link to="/news">All news</Link>
            </Button>
          </div>
          <div className="mt-14">
            {news.isLoading ? (
              <CardSkeletons />
            ) : news.data && news.data.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {news.data.map((post) => (
                  <NewsCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Stories are on the way"
                body="Articles published by our communications team will be listed here."
              />
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-brand py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
              {ORG.short}
            </p>
            <h2 className="mt-5 text-3xl font-bold leading-tight text-brand-foreground sm:text-4xl">
              We remember where we came from. We support where we are. We build for where we are
              going.
            </h2>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-8 shadow-gold">
                <Link to="/membership/register">Become a Member</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-brand-foreground/40 bg-brand-foreground/10 px-8 text-brand-foreground hover:bg-brand-foreground/20 hover:text-brand-foreground"
              >
                <Link to="/support">Support Our Work</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
