import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, ArrowRight, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accent text-brand">
        <Inbox className="h-6 w-6" />
      </div>
      <p className="mt-5 text-lg font-semibold text-brand-deep">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

export function CardSkeletons({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-3xl border border-border bg-card">
          <Skeleton className="h-48 w-full" />
          <div className="space-y-3 p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

type ProjectRow = {
  slug: string;
  title: string;
  category: string;
  location: string | null;
  summary: string | null;
  status: string;
  project_date: string | null;
  image_url: string | null;
};

export function ProjectCard({ project }: { project: ProjectRow }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card card-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-accent">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-brand text-xs font-semibold uppercase tracking-[0.2em] text-brand-foreground/70">
            {project.category}
          </div>
        )}
        <Badge className="absolute left-4 top-4 bg-gold text-gold-foreground hover:bg-gold">
          {project.status}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
          {project.category}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-brand-deep">{project.title}</h3>
        {project.summary ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {project.summary}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          {project.location ? (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-brand" /> {project.location}
            </span>
          ) : null}
          {project.project_date ? (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-brand" /> {project.project_date}
            </span>
          ) : null}
        </div>
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-deep"
        >
          View project <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

type NewsRow = {
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  author: string | null;
  published_at: string | null;
  image_url: string | null;
};

export function NewsCard({ post }: { post: NewsRow }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card card-lift">
      <div className="aspect-[16/9] overflow-hidden bg-accent">
        {post.image_url ? (
          <img
            src={post.image_url}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-brand text-xs font-semibold uppercase tracking-[0.2em] text-brand-foreground/70">
            {post.category}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
          {post.category}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-brand-deep">{post.title}</h3>
        {post.excerpt ? (
          <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        ) : null}
        <p className="mt-4 text-xs text-muted-foreground">
          {[post.author, post.published_at].filter(Boolean).join(" · ")}
        </p>
        <Link
          to="/news/$slug"
          params={{ slug: post.slug }}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-deep"
        >
          Read story <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
