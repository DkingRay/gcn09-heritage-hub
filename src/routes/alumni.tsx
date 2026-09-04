import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CardSkeletons, EmptyState } from "@/components/site/Cards";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { useSpotlights } from "@/lib/queries";
import pageHeroImage from "@/assets/Alumni-hero.jpeg";

export const Route = createFileRoute("/alumni")({
  head: () => ({
    meta: [
      { title: "Alumni & Member Spotlight | GCN 09 Set Alumni" },
      {
        name: "description",
        content:
          "Meet members of the Government College Nasarawa 2009 Set making meaningful contributions in their professions and communities, and access the private member directory.",
      },
      { property: "og:title", content: "Alumni & Member Spotlight | GCN 09 Set" },
      {
        property: "og:description",
        content: "Member spotlights and the private searchable alumni directory of the GCN 09 Set.",
      },
    ],
  }),
  component: Alumni,
});

function Alumni() {
  const { data, isLoading } = useSpotlights();

  return (
    <SiteLayout>
      <PageHero
        image={pageHeroImage}
        imageAlt="GCN 09 Set alumni members together"
        eyebrow="Alumni"
        title="The set, in the people who make it."
        body="Our full member directory is private and available only to verified members. Publicly, we celebrate members who have chosen to be featured."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-full px-8 shadow-gold">
            <Link to="/membership/register">Join the directory</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-brand-foreground/40 bg-brand-foreground/10 px-8 text-brand-foreground hover:bg-brand-foreground/20 hover:text-brand-foreground"
          >
            <Link to="/login">Member login</Link>
          </Button>
        </div>
      </PageHero>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Member Spotlight"
            title="Recognising Service and Excellence"
            body="Members featured here have consented to being showcased publicly."
          />
          <div className="mt-14">
            {isLoading ? (
              <CardSkeletons count={3} />
            ) : data && data.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((member, i) => (
                  <Reveal key={member.id} delay={i * 80}>
                    <div className="h-full rounded-3xl border border-border bg-card p-8 shadow-card card-lift">
                      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-brand text-xl font-bold text-brand-foreground">
                        {member.first_name?.[0]}
                        {member.last_name?.[0]}
                      </div>
                      <h3 className="mt-5 text-lg font-semibold text-brand-deep">
                        {member.preferred_name || member.first_name} {member.last_name}
                      </h3>
                      <p className="mt-1 text-sm text-brand">
                        {[member.profession, member.organisation].filter(Boolean).join(" · ")}
                      </p>
                      {member.spotlight_bio ? (
                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                          {member.spotlight_bio}
                        </p>
                      ) : null}
                      {member.spotlight_achievement ? (
                        <p className="mt-4 text-sm font-medium text-brand-deep">
                          Achievement: {member.spotlight_achievement}
                        </p>
                      ) : null}
                      {member.spotlight_contribution ? (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Contribution: {member.spotlight_contribution}
                        </p>
                      ) : null}
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No spotlights published yet"
                body="Administrators feature members who have consented to public recognition."
              />
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
