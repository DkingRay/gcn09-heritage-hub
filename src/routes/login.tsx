import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { CREST_URL, ORG } from "@/lib/site";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Member Login | GCN 09 Set Alumni" },
      {
        name: "description",
        content:
          "Sign in to the Government College Nasarawa 2009 Set Alumni member portal to access your membership card, directory, events and announcements.",
      },
      { property: "og:title", content: "Member Login | GCN 09 Set Alumni" },
      { property: "og:description", content: "Sign in to the GCN 09 Set member portal." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back.");
    navigate({ to: "/member/dashboard" });
  }

  async function resetPassword() {
    if (!email) {
      toast.error("Enter your email address first.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password reset link sent to your email.");
  }

  return (
    <SiteLayout>
      <section className="bg-gradient-surface py-16 sm:py-24">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-card">
            <div className="text-center">
              <img
                src={CREST_URL}
                alt="GCN 09 Set Alumni crest"
                width={80}
                height={80}
                className="mx-auto w-20"
              />
              <h1 className="mt-5 text-2xl font-bold text-brand-deep">Member Login</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {ORG.short} · {ORG.tagline}
              </p>
            </div>
            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox defaultChecked /> Remember me
                </label>
                <button
                  type="button"
                  onClick={resetPassword}
                  className="text-sm font-semibold text-brand hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Button type="submit" size="lg" disabled={busy} className="w-full rounded-full">
                {busy ? "Signing in…" : "Sign in"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Not yet a member?{" "}
              <Link to="/membership/register" className="font-semibold text-brand hover:underline">
                Become a member
              </Link>
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
