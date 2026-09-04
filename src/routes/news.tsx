import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { CardSkeletons, EmptyState, NewsCard } from "@/components/site/Cards";
import { Button } from "@/components/ui/button";
import { useNews } from "@/lib/queries";
import { NEWS_CATEGORIES } from "@/lib/site";
import pageHeroImage from "@/assets/page-news.jpeg";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Stories | GCN 09 Set Alumni" },
      {
        name: "description",
        content:
          "Alumni news, announcements, member stories, education updates and opportunities from the Government College Nasarawa 2009 Set Alumni.",
      },
      { property: "og:title", content: "News & Stories | GCN 09 Set Alumni" },
      {
        property: "og:description",
        content: "Announcements, member stories and updates from the GCN 09 Set community.",
      },
    ],
  }),
  component: News,
});

function News() {
  const { data, isLoading } = useNews();
  const [category, setCategory] = useState("All");
  const filtered = useMemo(
    () => (data ?? []).filter((p) => category === "All" || p.category === category),
    [data, category],
  );

  return (
    <SiteLayout>
      <PageHero
        image={pageHeroImage}
        imageAlt="GCN 09 Set alumni class photograph"
        eyebrow="News & Stories"
        title="What the set is doing, in our own words."
        body="Announcements, project reports, member stories and opportunities published by our communications team."
      />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {["All", ...NEWS_CATEGORIES].map((item) => (
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
          <div className="mt-12">
            {isLoading ? (
              <CardSkeletons count={6} />
            ) : filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((post) => (
                  <NewsCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No articles published yet"
                body="Stories and announcements will appear here as they are published."
              />
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
