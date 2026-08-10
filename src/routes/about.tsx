import { createFileRoute, Link } from "@tanstack/react-router";
import { FileCheck2, ScrollText, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { CoreValues, FocusAreas, MissionVision } from "@/components/site/Sections";
import { CREST_URL, ORG } from "@/lib/site";
import aboutHero from "@/assets/hero-4.jpg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | GCN 09 Set Alumni" },
      {
        name: "description",
        content:
          "Our story, mission, vision, values, objectives, leadership and governance — the alumni association of the Government College Nasarawa 2009 Set.",
      },
      { property: "og:title", content: "About GCN 09 Set Alumni" },
      {
        property: "og:description",
        content:
          "The story, mission, values, objectives and governance of the Government College Nasarawa 2009 Set Alumni.",
      },
    ],
  }),
  component: About,
});

const OBJECTIVES = [
  "Promote the welfare, wellbeing and development of every member of the set.",
  "Support education through scholarships, learning materials and school improvement.",
  "Deliver community development initiatives that improve quality of life.",
  "Create economic empowerment pathways through skills, enterprise and mentorship.",
  "Uphold transparent governance and accountable stewardship of all resources.",
  "Preserve the heritage, identity and legacy of Government College Nasarawa.",
];

function About() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="About Us"
        title="A set that grew up together, now building together."
        body="Government College Nasarawa 2009 Set Alumni is a formally incorporated alumni association governed by an elected executive and guided by a written constitution."
        image={aboutHero.url}
        imageAlt="GCN 09 Set alumni gathered together at a members' reunion"
      />

      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <SectionHeading
            eyebrow="Our Story"
            title="From classmates to a community of purpose"
            body="The GCN 09 Set is a community of former students of Government College Nasarawa united by a shared history, common values and a commitment to giving back."
          />
          <Reveal delay={120} className="space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Years after leaving school, the relationships and values developed during our
              formative years continue to connect us. What began as informal reunions and mutual
              support has matured into a structured association with clear objectives, elected
              leadership and documented governance.
            </p>
            <p>
              Today we are transforming those bonds into opportunities to support one another,
              strengthen education, empower communities and create a lasting legacy — for our set,
              for our old school and for the communities we come from.
            </p>
          </Reveal>
        </div>
      </section>

      <MissionVision />
      <CoreValues />

      <section className="bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Objectives" title="What We Have Set Out To Do" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {OBJECTIVES.map((objective, i) => (
              <Reveal key={objective} delay={i * 60}>
                <div className="flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-card">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-gold text-sm font-bold text-gold-foreground">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/90">{objective}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FocusAreas />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Leadership & Governance"
            title="Elected, Accountable, Transparent"
            body="Executive positions, committee membership and governing documents are maintained by the administrators of the association."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: Users2,
                title: "Executive Committee",
                body: "Officers elected by the general assembly to lead the association's day-to-day work. Profiles are published once confirmed.",
              },
              {
                icon: ScrollText,
                title: "Constitution",
                body: "Our governing document defines membership, elections, committees, finance and accountability rules.",
              },
              {
                icon: FileCheck2,
                title: "Legal Registration",
                body: `Incorporated under the relevant Nigerian corporate registration framework with Registration Number ${ORG.rcNumber}.`,
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <div className="h-full rounded-3xl border border-border bg-card p-8 shadow-card card-lift">
                  <div className="grid h-13 w-13 place-items-center rounded-2xl bg-accent p-3 text-brand">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-brand-deep">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-deep py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <SectionHeading
                eyebrow="Certificate of Incorporation"
                title="Formally registered and accountable"
                body={`The association is incorporated under the relevant Nigerian corporate registration framework, based on the certificate issued to us. Registration Number: ${ORG.rcNumber}.`}
                tone="dark"
              />
              <p className="mt-6 max-w-2xl text-sm text-brand-deep-foreground/70">
                For the privacy of our members, personal details contained in our registration
                documents are not published on this website. Verified members and partners may
                request certified documentation through the governance page.
              </p>
              <Button asChild className="mt-8 rounded-full px-7 shadow-gold">
                <Link to="/governance">View Governance & Documents</Link>
              </Button>
            </div>
            <Reveal delay={120}>
              <div className="rounded-[2rem] border border-brand-deep-foreground/20 bg-brand-foreground/5 p-8 text-center backdrop-blur">
                <img
                  src={CREST_URL}
                  alt="GCN 09 Set Alumni crest"
                  width={200}
                  height={200}
                  loading="lazy"
                  className="mx-auto w-44"
                />
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                  Registration Number
                </p>
                <p className="mt-2 text-3xl font-bold text-brand-deep-foreground">
                  {ORG.rcNumber}
                </p>
                <p className="mt-3 text-sm text-brand-deep-foreground/70">
                  Certificate of Incorporation on file
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
