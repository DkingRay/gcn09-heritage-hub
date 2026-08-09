import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsCard } from "@/components/site/Cards";
import { useNews, useNewsPost } from "@/lib/queries";

export const Route = createFileRoute("/news/$slug")({
  head: () => ({
    meta: [
      { title: "Story | GCN 09 Set Alumni" },
      {
        name: "description",
        content: "A news story from the Government College Nasarawa 2009 Set Alumni community.",
      },
      { property: "og:title", content: "Story | GCN 09 Set Alumni" },
      { property: "og:description", content: "News and stories from the GCN 09 Set community." },
    ],
  }),
  component: NewsDetail,
});

function NewsDetail() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useNewsPost(slug);
  const related = useNews(4);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-24">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-64 w-full" />
        </div>
      </SiteLayout>
    );
  }

  if (!data) {
    return (
      <SiteLayout>
        <PageHero eyebrow="News" title="This story is not available" />
        <div className="mx-auto max-w-3xl px-4 py-16">
          <Link to="/news" className="text-sm font-semibold text-brand">
            ← Back to news
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <SiteLayout>
      <PageHero eyebrow={data.category} title={data.title} body={data.excerpt ?? undefined} />
      <article className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link to="/news" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
            <ArrowLeft className="h-4 w-4" /> All news
          </Link>
          <p className="mt-6 text-sm text-muted-foreground">
            {[data.author, data.published_at].filter(Boolean).join(" · ")}
          </p>
          {data.image_url ? (
            <img
              src={data.image_url}
              alt={data.title}
              loading="lazy"
              className="mt-6 w-full rounded-[2rem] object-cover shadow-card"
            />
          ) : null}
          <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-foreground/90">
            {data.content}
          </div>
          <div className="mt-10 flex flex-wrap gap-3 text-sm">
            <a
              className="rounded-full border border-border px-4 py-2 font-medium text-brand"
              href={`https://wa.me/?text=${encodeURIComponent(`${data.title} ${shareUrl}`)}`}
              target="_blank"
              rel="noreferrer"
            >
              Share on WhatsApp
            </a>
            <a
              className="rounded-full border border-border px-4 py-2 font-medium text-brand"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
            >
              Share on X
            </a>
          </div>
        </div>

        {related.data && related.data.filter((p) => p.slug !== slug).length > 0 ? (
          <div className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-brand-deep">Related stories</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.data
                .filter((p) => p.slug !== slug)
                .slice(0, 3)
                .map((post) => (
                  <NewsCard key={post.slug} post={post} />
                ))}
            </div>
          </div>
        ) : null}
      </article>
    </SiteLayout>
  );
}
