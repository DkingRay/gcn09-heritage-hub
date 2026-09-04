import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { EmptyState } from "@/components/site/Cards";
import { Skeleton } from "@/components/ui/skeleton";
import { useGallery } from "@/lib/queries";
import pageHeroImage from "@/assets/WhatsApp Image 2026-09-04 at 8.51.22 PM (3).jpeg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery | GCN 09 Set Alumni" },
      {
        name: "description",
        content:
          "Photographs from reunions, projects, outreach and events of the Government College Nasarawa 2009 Set Alumni.",
      },
      { property: "og:title", content: "Gallery | GCN 09 Set Alumni" },
      { property: "og:description", content: "Photographs from GCN 09 Set events and projects." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const { data, isLoading } = useGallery();

  return (
    <SiteLayout>
      <PageHero
        image={pageHeroImage}
        imageAlt="GCN 09 Set alumni posing outdoors"
        eyebrow="Gallery"
        title="Moments from the set."
        body="Photographs from reunions, outreach days, meetings and project deliveries."
      />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))}
            </div>
          ) : data && data.images.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.images.map((image) => (
                <figure key={image.id} className="overflow-hidden rounded-2xl border border-border">
                  <img
                    src={image.image_url}
                    alt={image.caption ?? "GCN 09 Set gallery photograph"}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {image.caption ? (
                    <figcaption className="bg-card px-4 py-3 text-xs text-muted-foreground">
                      {image.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No photographs uploaded yet"
              body="Albums and images uploaded by our administrators will appear here."
            />
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
