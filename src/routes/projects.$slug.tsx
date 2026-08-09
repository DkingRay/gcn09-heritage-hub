import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, MapPin, Target, Users } from "lucide-react";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useProject } from "@/lib/queries";

export const Route = createFileRoute("/projects/$slug")({
  head: () => ({
    meta: [
      { title: "Project | GCN 09 Set Alumni" },
      {
        name: "description",
        content:
          "Project details, location, beneficiaries and outcomes from a Government College Nasarawa 2009 Set Alumni initiative.",
      },
      { property: "og:title", content: "Project | GCN 09 Set Alumni" },
      {
        property: "og:description",
        content: "Details, beneficiaries and outcomes of a GCN 09 Set initiative.",
      },
    ],
  }),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useProject(slug);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-4xl space-y-4 px-4 py-24">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </SiteLayout>
    );
  }

  if (!data) {
    return (
      <SiteLayout>
        <PageHero
          eyebrow="Projects"
          title="This project is not available"
          body="It may have been unpublished or the link is incorrect."
        />
        <div className="mx-auto max-w-3xl px-4 py-16">
          <Link to="/projects" className="text-sm font-semibold text-brand">
            ← Back to all projects
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero eyebrow={data.category} title={data.title} body={data.summary ?? undefined} />
      <article className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
          >
            <ArrowLeft className="h-4 w-4" /> All projects
          </Link>

          {data.image_url ? (
            <img
              src={data.image_url}
              alt={data.title}
              loading="lazy"
              className="mt-8 w-full rounded-[2rem] object-cover shadow-card"
            />
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <Badge className="bg-gold text-gold-foreground hover:bg-gold">{data.status}</Badge>
            {data.location ? (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-brand" /> {data.location}
              </span>
            ) : null}
            {data.project_date ? (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-brand" /> {data.project_date}
              </span>
            ) : null}
            {data.beneficiaries ? (
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-brand" /> {data.beneficiaries}
              </span>
            ) : null}
          </div>

          {data.description ? (
            <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-foreground/90">
              {data.description}
            </div>
          ) : null}

          {data.impact ? (
            <div className="mt-10 rounded-3xl border border-border bg-surface p-8">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand">
                <Target className="h-4 w-4" /> Impact
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground/90">{data.impact}</p>
            </div>
          ) : null}

          {data.gallery && data.gallery.length > 0 ? (
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {data.gallery.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt={`${data.title} gallery image`}
                  loading="lazy"
                  className="w-full rounded-2xl object-cover"
                />
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </SiteLayout>
  );
}
