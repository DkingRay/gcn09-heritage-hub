import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { CONTRIBUTION_OPTIONS } from "@/lib/site";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer | GCN 09 Set Alumni" },
      {
        name: "description",
        content:
          "Volunteer your skills, time, knowledge and networks to the Government College Nasarawa 2009 Set Alumni.",
      },
      { property: "og:title", content: "Volunteer | GCN 09 Set Alumni" },
      { property: "og:description", content: "Your time can make a difference in the GCN 09 Set." },
    ],
  }),
  component: Volunteer,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(30).optional(),
  skills: z.string().trim().max(500).optional(),
  availability: z.string().trim().max(200).optional(),
  message: z.string().trim().max(1500).optional(),
});

function Volunteer() {
  const [interest, setInterest] = useState<string>(CONTRIBUTION_OPTIONS[0]);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const parsed = schema.safeParse(Object.fromEntries(new FormData(form)));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("volunteer_applications").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      interest_area: interest,
      skills: parsed.data.skills ?? null,
      availability: parsed.data.availability ?? null,
      message: parsed.data.message ?? null,
    });
    setSaving(false);
    if (error) {
      toast.error("We couldn't submit your application. Please try again.");
      return;
    }
    toast.success("Thank you for volunteering. Our team will reach out.");
    form.reset();
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Volunteer"
        title="Your Time Can Make a Difference"
        body="Impact is not created by money alone. We welcome members who are willing to contribute their skills, knowledge, time, networks and experience to the growth of the GCN 09 Set."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={onSubmit}
            className="rounded-[2rem] border border-border bg-card p-8 shadow-card"
          >
            <h2 className="text-2xl font-bold text-brand-deep">Volunteer application</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required className="mt-2" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required className="mt-2" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="availability">Availability</Label>
                <Input
                  id="availability"
                  name="availability"
                  placeholder="e.g. weekends, evenings"
                  className="mt-2"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Area of interest</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CONTRIBUTION_OPTIONS.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      size="sm"
                      variant={interest === option ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => setInterest(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="skills">Skills</Label>
                <Textarea id="skills" name="skills" rows={3} className="mt-2" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" rows={4} className="mt-2" />
              </div>
            </div>
            <Button type="submit" size="lg" disabled={saving} className="mt-8 rounded-full px-8">
              {saving ? "Submitting…" : "Submit application"}
            </Button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
