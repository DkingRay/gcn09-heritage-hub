import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { FocusAreas, ImpactStats } from "@/components/site/Sections";
import { CardSkeletons, EmptyState, ProjectCard } from "@/components/site/Cards";
import { useProjects } from "@/lib/queries";
import educationImage from "@/assets/impact-education.jpg";
import communityImage from "@/assets/impact-community.jpg";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Our Impact | GCN 09 Set Alumni" },
      {
        name: "description",
        content:
          "How the Government College Nasarawa 2009 Set Alumni creates impact through education support, member welfare, community development and economic empowerment.",
      },
      { property: "og:title", content: "Our Impact | GCN 09 Set Alumni" },
      {
        property: "og:description",
        content:
          "Education support, member welfare, community development and empowerment delivered by the GCN 09 Set.",
      },
    ],
  }),
  component: Impact,
});

function Impact() {
  const projects = useProjects({ limit: 6 });

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our Impact"
        title="Impact measured in people, not slogans."
        body="Every initiative we run is documented with its location, beneficiaries and outcome so that members and partners can see exactly what their support achieves."
      />

      <ImpactStats />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <img
                src={educationImage}
                alt="Students receiving learning materials during a GCN 09 Set education initiative"
                width={1280}
                height={900}
                loading="lazy"
                className="w-full rounded-[2rem] object-cover shadow-card"
              />
            </Reveal>
            <SectionHeading
              eyebrow="Education"
              title="Learning is the shortest route out of disadvantage"
              body="We support students, schools and educational development — from learning materials and facility improvement to mentoring and scholarship support that keeps promising students in school."
            />
          </div>
          <div className="mt-20 grid items-center gap-12 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Community & Welfare"
              title="A dependable community of care"
              body="Our welfare framework supports members in moments that matter, while our outreach work reaches vulnerable and marginalised individuals in the communities we come from."
            />
            <Reveal delay={120}>
              <img
                src={communityImage}
                alt="Volunteers distributing relief materials during a community outreach"
                width={1280}
                height={900}
                loading="lazy"
                className="w-full rounded-[2rem] object-cover shadow-card"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <FocusAreas />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Recent Work" title="Projects Delivering This Impact" />
          <div className="mt-14">
            {projects.isLoading ? (
              <CardSkeletons />
            ) : projects.data && projects.data.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.data.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Impact records are being compiled"
                body="Verified projects and their outcomes will be published here by our administrators."
              />
            )}
          </div>
          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/support">Support a Focus Area</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <Link to="/volunteer">Volunteer Your Skills</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
