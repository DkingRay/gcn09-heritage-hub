import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLogin } from "@/lib/admin-auth";
import { CREST_URL, ORG } from "@/lib/site";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [
      { title: "Admin Login | GCN 09 Set Alumni" },
      {
        name: "description",
        content: "Administrator sign-in for the GCN 09 Set Alumni control centre.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await new Promise((r) => setTimeout(r, 500));
    const ok = adminLogin(email, password);
    setBusy(false);
    if (!ok) {
      toast.error("Invalid administrator credentials.");
      return;
    }
    toast.success("Welcome, administrator.");
    navigate({ to: "/admin" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-deep">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
          <div className="text-center">
            <img
              src={CREST_URL}
              alt="GCN 09 Set Alumni crest"
              width={72}
              height={72}
              className="mx-auto w-18"
            />
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              <ShieldCheck className="h-3.5 w-3.5" /> Control Centre
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white">Admin Login</h1>
            <p className="mt-2 text-sm text-white/60">
              Restricted to {ORG.short} executives and site administrators.
            </p>
          </div>
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="admin-email" className="text-white/80">
                Email address
              </Label>
              <Input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 border-white/15 bg-white/10 text-white placeholder:text-white/40"
              />
            </div>
            <div>
              <Label htmlFor="admin-password" className="text-white/80">
                Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 border-white/15 bg-white/10 text-white placeholder:text-white/40"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={busy}
              className="w-full rounded-full bg-gold font-semibold text-brand-deep hover:bg-gold/90"
            >
              {busy ? "Verifying…" : "Sign in to dashboard"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-white/50">
            Not an admin?{" "}
            <Link to="/login" className="font-semibold text-gold hover:underline">
              Go to member login
            </Link>
          </p>
        </div>
        <p className="mt-8 text-center">
          <Link to="/" className="text-sm text-white/50 hover:text-white/80">
            ← Back to {ORG.short} home
          </Link>
        </p>
      </div>
    </div>
  );
}
