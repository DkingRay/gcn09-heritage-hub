import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { SUPPORT_CAUSES } from "@/lib/site";
import pageHeroImage from "@/assets/Hero5.jpeg";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Give. Support. Transform. | GCN 09 Set Alumni" },
      {
        name: "description",
        content:
          "Support education, welfare, community development, empowerment and special projects of the Government College Nasarawa 2009 Set Alumni.",
      },
      { property: "og:title", content: "Give. Support. Transform. | GCN 09 Set Alumni" },
      {
        property: "og:description",
        content: "Support the education, welfare and community work of the GCN 09 Set.",
      },
    ],
  }),
  component: Support,
});

const schema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(30).optional(),
  amount: z.coerce.number().min(0).max(1000000000),
  message: z.string().trim().max(1000).optional(),
});

function Support() {
  const [cause, setCause] = useState<string>(SUPPORT_CAUSES[0]);
  const [amount, setAmount] = useState<string>("");
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
    const { error } = await supabase.from("support_pledges").insert({
      name: parsed.data.name ?? null,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      cause,
      amount: parsed.data.amount,
      message: parsed.data.message ?? null,
    });
    setSaving(false);
    if (error) {
      toast.error("We couldn't record your pledge. Please try again.");
      return;
    }
    toast.success("Thank you. Your pledge has been recorded and our team will be in touch.");
    form.reset();
    setAmount("");
  }

  return (
    <SiteLayout>
      <PageHero
        image={pageHeroImage}
        imageAlt="GCN 09 Set alumni celebrating together"
        eyebrow="Support"
        title="Give. Support. Transform."
        body="Your support funds education, welfare and community development delivered by members of the 2009 Set. Online card payment is being set up — pledges recorded here are followed up by our finance team."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Where your support goes"
              title="Choose a cause to stand behind"
              body="Every pledge is allocated to a named focus area and reported to members."
            />
            <ul className="mt-8 space-y-3">
              {SUPPORT_CAUSES.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => setCause(item)}
                    className={`w-full rounded-2xl border px-6 py-4 text-left text-base font-medium transition-colors ${
                      cause === item
                        ? "border-brand bg-accent text-brand-deep"
                        : "border-border bg-card text-foreground/85 hover:border-brand/50"
                    }`}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-[2rem] border border-border bg-card p-8 shadow-card"
          >
            <h2 className="text-2xl font-bold text-brand-deep">Make a pledge</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Supporting: <span className="font-semibold text-brand">{cause}</span>
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[5000, 10000, 25000, 50000, 100000].map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  size="sm"
                  variant={amount === String(preset) ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setAmount(String(preset))}
                >
                  ₦{preset.toLocaleString()}
                </Button>
              ))}
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min={0}
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required className="mt-2" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" className="mt-2" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="message">Message (optional)</Label>
                <Textarea id="message" name="message" rows={4} className="mt-2" />
              </div>
            </div>
            <Button type="submit" size="lg" disabled={saving} className="mt-8 rounded-full px-8">
              {saving ? "Recording…" : "Submit pledge"}
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              No payment is collected on this page. A secure payment gateway will be enabled for
              direct giving.
            </p>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
