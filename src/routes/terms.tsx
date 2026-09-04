import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import pageHeroImage from "@/assets/WhatsApp Image 2026-09-04 at 8.51.22 PM (3).jpeg";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use | GCN 09 Set Alumni" },
      {
        name: "description",
        content:
          "The terms that govern membership and use of the Government College Nasarawa 2009 Set Alumni website and member platform.",
      },
      { property: "og:title", content: "Terms of Use | GCN 09 Set Alumni" },
      { property: "og:description", content: "Terms governing membership and use of the platform." },
    ],
  }),
  component: Terms,
});

const SECTIONS = [
  {
    title: "Membership eligibility",
    body: "Membership is open to former students of Government College Nasarawa who belong to the 2009 Set. Applications are reviewed by administrators before activation.",
  },
  {
    title: "Accurate information",
    body: "You agree to provide accurate information during registration and to keep your profile up to date.",
  },
  {
    title: "Acceptable use",
    body: "The member directory and member-only areas may be used only for legitimate alumni purposes. Harvesting member data, marketing spam and harassment are prohibited.",
  },
  {
    title: "Contributions",
    body: "Contributions and pledges are voluntary and are applied to the focus area indicated, subject to oversight by the executive committee.",
  },
  {
    title: "Suspension",
    body: "The association may suspend or withdraw access where these terms or the constitution are breached.",
  },
  {
    title: "Changes",
    body: "These terms may be updated from time to time. Continued use of the platform indicates acceptance of the current terms.",
  },
];

function Terms() {
  return (
    <SiteLayout>
      <PageHero
        image={pageHeroImage}
        imageAlt="GCN 09 Set alumni posing outdoors"
        eyebrow="Legal"
        title="Terms of Use"
        body="The basis on which members join and use this platform."
      />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6 lg:px-8">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-semibold text-brand-deep">{section.title}</h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
