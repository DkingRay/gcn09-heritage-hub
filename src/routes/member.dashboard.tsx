import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/member/dashboard")({
  head: () => ({
    meta: [
      { title: "Member Dashboard | GCN 09 Set Alumni" },
      {
        name: "description",
        content: "Member dashboard for the GCN 09 Set Alumni portal.",
      },
    ],
  }),
  component: MemberDashboard,
});

function MemberDashboard() {
  return (
    <SiteLayout>
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-brand-deep">Member Dashboard</h1>
          <p className="mt-4 text-muted-foreground">
            Your personal member area is under construction. Check back soon for your digital
            membership card, events and announcements.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
