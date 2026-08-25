import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | GCN 09 Set Alumni" },
      {
        name: "description",
        content: "Administrative dashboard for the GCN 09 Set Alumni platform.",
      },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <SiteLayout>
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-brand-deep">Admin Dashboard</h1>
          <p className="mt-4 text-muted-foreground">
            The administrative panel is under construction. Check back soon for member management,
            projects, events and site content controls.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
