import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { ORG } from "@/lib/site";
import pageHeroImage from "@/assets/WhatsApp Image 2026-09-04 at 8.51.23 PM.jpeg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | GCN 09 Set Alumni" },
      {
        name: "description",
        content:
          "Contact the Government College Nasarawa 2009 Set Alumni — send a message, partner with us or reach the executive committee.",
      },
      { property: "og:title", content: "Contact Us | GCN 09 Set Alumni" },
      { property: "og:description", content: "Reach the GCN 09 Set Alumni executive committee." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(10, "Please write a longer message").max(2000),
});

function Contact() {
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      subject: parsed.data.subject ?? null,
      message: parsed.data.message,
    });
    setSaving(false);
    if (error) {
      toast.error("We couldn't send your message. Please try again.");
      return;
    }
    toast.success("Message sent. We'll get back to you shortly.");
    e.currentTarget.reset();
  }

  return (
    <SiteLayout>
      <PageHero
        image={pageHeroImage}
        imageAlt="GCN 09 Set alumni class photograph"
        eyebrow="Contact"
        title="Let's talk."
        body="Whether you are a member, a partner or a well-wisher, we would be glad to hear from you."
      />
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          <div className="space-y-6">
            {[
              { icon: Mail, label: "Email", value: ORG.email },
              { icon: Phone, label: "Phone", value: ORG.phone },
              { icon: MapPin, label: "Address", value: ORG.address },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-3xl border border-border bg-card p-6 shadow-card"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-brand">
                  <item.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 break-words text-base font-medium text-brand-deep">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
            <div className="grid h-56 place-items-center rounded-3xl border border-dashed border-border bg-surface text-sm text-muted-foreground">
              Map location will be embedded here
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-[2rem] border border-border bg-card p-8 shadow-card"
          >
            <h2 className="text-2xl font-bold text-brand-deep">Send us a message</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required className="mt-2" />
              </div>
              <div className="sm:col-span-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required className="mt-2" />
              </div>
              <div className="sm:col-span-1">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" className="mt-2" />
              </div>
              <div className="sm:col-span-1">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" className="mt-2" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" rows={6} required className="mt-2" />
              </div>
            </div>
            <Button type="submit" size="lg" disabled={saving} className="mt-8 rounded-full px-8">
              {saving ? "Sending…" : "Send message"}
            </Button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
