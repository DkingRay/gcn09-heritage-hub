import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { ORG } from "@/lib/site";
import pageHeroImage from "@/assets/About-hero.jpeg";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | GCN 09 Set Alumni" },
      {
        name: "description",
        content:
          "How the Government College Nasarawa 2009 Set Alumni collects, uses, protects and shares member information.",
      },
      { property: "og:title", content: "Privacy Policy | GCN 09 Set Alumni" },
      { property: "og:description", content: "How we handle and protect member information." },
    ],
  }),
  component: Privacy,
});

const SECTIONS = [
  {
    title: "Information we collect",
    body: "We collect the personal, school, professional and emergency information you provide during membership registration, together with any updates you make to your profile.",
  },
  {
    title: "How we use your information",
    body: "Your information is used only for legitimate alumni association activities: membership administration, welfare support, events, communication, projects and reporting to members.",
  },
  {
    title: "Directory visibility and your control",
    body: "You control what appears in the member directory. Phone numbers and email addresses are private by default and are only shown if you switch them on in your dashboard settings.",
  },
  {
    title: "Data protection",
    body: "Member records are held in a secured database with access rules that restrict each member to their own record. Only authorised administrators can review membership applications.",
  },
  {
    title: "Sharing",
    body: "We do not sell member data. Information is not shared with third parties except where required for a service you have requested or by law.",
  },
  {
    title: "Your rights",
    body: `You may request access to, correction of, or deletion of your member record at any time by contacting ${ORG.email}.`,
  },
];

function Privacy() {
  return (
    <SiteLayout>
      <PageHero
        image={pageHeroImage}
        imageAlt="GCN 09 Set alumni posing outdoors"
        eyebrow="Legal"
        title="Privacy Policy"
        body="We treat member information as a responsibility, not an asset."
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
