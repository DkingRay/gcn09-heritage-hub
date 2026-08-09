import { createFileRoute } from "@tanstack/react-router";
import { FileText, Gavel, ScrollText, ShieldCheck, Users2 } from "lucide-react";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { CREST_URL, ORG } from "@/lib/site";

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
  component: Governance;
});

function Governance() {
  return <div />;
}
