import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { CardSkeletons, EmptyState, ProjectCard } from "@/components/site/Cards";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/lib/queries";
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/site";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects | GCN 09 Set Alumni" },
      {
        name: "description",
        content:
          "Education, welfare, community development, empowerment and social responsibility projects delivered by the Government College Nasarawa 2009 Set Alumni.",
      },
      { property: "og:title", content: "Projects | GCN 09 Set Alumni" },
      {
        property: "og:description",
        content: "Explore the initiatives delivered by the GCN 09 Set across Nigeria.",
      },
    ],
  }),
  component: Projects,
});

function Projects() {
  const { data, isLoading } = useProjects();
  const [category, setCategory] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");

  const filtered = useMemo(() => {
    return (data ?? []).filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (status === "All" || p.status === status),
    );
  }, [data, category, status]);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Projects"
        title="Every project carries a name, a place and a result."
        body="Filter by focus area or status to see what the set is planning, delivering and has completed."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {["All", ...PROJECT_CATEGORIES].map((item) => (
              <Button
                key={item}
                size="sm"
                variant={category === item ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setCategory(item)}
              >
                {item}
              </Button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["All", ...PROJECT_STATUSES].map((item) => (
              <Button
                key={item}
                size="sm"
                variant={status === item ? "secondary" : "ghost"}
                className="rounded-full"
                onClick={() => setStatus(item)}
              >
                {item}
              </Button>
            ))}
          </div>

          <div className="mt-12">
            {isLoading ? (
              <CardSkeletons count={6} />
            ) : filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No projects to show yet"
                body="Projects are published by our administrators with full details, images and impact records."
              />
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
