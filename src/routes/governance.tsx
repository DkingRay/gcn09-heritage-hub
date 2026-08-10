import { createFileRoute } from "@tanstack/react-router";
import { FileText, Gavel, ScrollText, ShieldCheck, Users2 } from "lucide-react";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { CREST_URL, ORG } from "@/lib/site";
import pageHeroImage from "@/assets/hero-3.jpg.asset.json";

export const Route = createFileRoute("/governance")({
  head: () => ({
    meta: [
      { title: "Governance | GCN 09 Set Alumni" },
      {
        name: "description",
        content:
          "Leadership, executive committee, committees, governing documents, transparency and legal registration of the Government College Nasarawa 2009 Set Alumni.",
      },
      { property: "og:title", content: "Governance | GCN 09 Set Alumni" },
      {
        property: "og:description",
        content: "How the GCN 09 Set Alumni is led, governed and held accountable.",
      },
    ],
  }),
  component: Governance,
});

const SECTIONS = [
  {
    icon: Users2,
    title: "Leadership",
    body: "The association is led by officers elected by the general assembly of the 2009 Set. Names and portfolios are published by our administrators once each tenure is confirmed.",
  },
  {
    icon: Gavel,
    title: "Executive Committee",
    body: "The Executive Committee is responsible for strategy, approvals, finance oversight and the delivery of approved projects and events.",
  },
  {
    icon: ScrollText,
    title: "Committees",
    body: "Standing committees cover welfare, education, projects, finance, media and membership. Members are appointed from volunteers within the set.",
  },
  {
    icon: FileText,
    title: "Constitution & Governing Documents",
    body: "Our constitution defines membership, elections, meetings, committees, finance and discipline. Documents are made available to members on request.",
  },
  {
    icon: ShieldCheck,
    title: "Transparency & Accountability",
    body: "Contributions and expenditure are reported to members at general meetings. Project records include beneficiaries and outcomes.",
  },
];

function Governance() {
  return (
    <SiteLayout>
      <PageHero
        image={pageHeroImage.url}
        imageAlt="GCN 09 Set alumni leadership and members"
        eyebrow="Governance"
        title="Structure, stewardship and accountability."
        body="We are a formally incorporated association with elected leadership, written rules and documented reporting to members."
      />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="How We Are Governed" title="Our Governance Framework" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((section, i) => (
              <Reveal key={section.title} delay={i * 80}>
                <div className="h-full rounded-3xl border border-border bg-card p-8 shadow-card card-lift">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-brand">
                    <section.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-brand-deep">{section.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {section.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-deep py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Legal Registration"
              title="Certificate of Incorporation"
              body={`The association is incorporated under the relevant Nigerian corporate registration framework. Registration Number: ${ORG.rcNumber}.`}
              tone="dark"
            />
            <p className="mt-6 max-w-2xl text-sm text-brand-deep-foreground/70">
              A copy of the certificate is held on file by the executive committee. Personal details
              contained in registration documents are deliberately not published here. Verified
              members and prospective partners may request certified documentation by contacting the
              secretariat.
            </p>
          </div>
          <Reveal delay={120}>
            <div className="rounded-[2rem] border border-brand-deep-foreground/20 bg-brand-foreground/5 p-8 text-center backdrop-blur">
              <img
                src={CREST_URL}
                alt="GCN 09 Set Alumni crest"
                width={180}
                height={180}
                loading="lazy"
                className="mx-auto w-40"
              />
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                Registration Number
              </p>
              <p className="mt-2 text-3xl font-bold text-brand-deep-foreground">{ORG.rcNumber}</p>
              <p className="mt-4 text-sm text-brand-deep-foreground/70">
                Certificate of Incorporation · document viewer available to members
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
