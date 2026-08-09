import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { CONTRIBUTION_OPTIONS, CREST_URL, EMPLOYMENT_TYPES, ORG } from "@/lib/site";

export const Route = createFileRoute("/membership/register")({
  head: () => ({
    meta: [
      { title: "Become a Member | GCN 09 Set Alumni" },
      {
        name: "description",
        content:
          "Join the GCN 09 Set Alumni community and remain connected to the people, memories and purpose that unite us. Register for membership in six guided steps.",
      },
      { property: "og:title", content: "Become a Member | GCN 09 Set Alumni" },
      {
        property: "og:description",
        content: "Register for membership of the Government College Nasarawa 2009 Set Alumni.",
      },
    ],
  }),
  component: RegisterPage,
});

type FormState = Record<string, string> & { interests?: never };

const STEPS = [
  "Personal Information",
  "GCN Information",
  "Professional Information",
  "Emergency / Welfare",
  "Alumni Engagement",
  "Account Creation",
];

const accountSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email address").max(255),
    password: z.string().min(8, "Password must be at least 8 characters").max(72),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "Passwords do not match" });

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-12"
      />
    </div>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({ set_year: "2009", country: "Nigeria" } as FormState);
  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState("");
  const [employment, setEmployment] = useState<string>(EMPLOYMENT_TYPES[0]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeData, setAgreeData] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [membershipId, setMembershipId] = useState<string | null>(null);

  const set = (key: string) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }) as FormState);

  function next() {
    if (step === 0 && (!form.first_name || !form.last_name)) {
      toast.error("First and last name are required.");
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }

  async function submit() {
    const parsed = accountSchema.safeParse({
      email: form.account_email ?? "",
      password: form.password ?? "",
      confirm: form.confirm_password ?? "",
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your account details");
      return;
    }
    if (!agreeTerms || !agreeData) {
      toast.error("Please accept the terms and the data consent to continue.");
      return;
    }

    setBusy(true);
    const { data: signUp, error: signUpError } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (signUpError || !signUp.user) {
      setBusy(false);
      toast.error(signUpError?.message ?? "We couldn't create your account.");
      return;
    }

    let photoPath: string | null = null;
    if (photoFile && signUp.session) {
      const ext = photoFile.name.split(".").pop() ?? "jpg";
      const path = `${signUp.user.id}/profile.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("member-photos")
        .upload(path, photoFile, { upsert: true });
      if (!uploadError) photoPath = path;
    }

    const payload = {
      user_id: signUp.user.id,
      membership_id: "",
      first_name: form.first_name ?? "",
      middle_name: form.middle_name ?? null,
      last_name: form.last_name ?? "",
      preferred_name: form.preferred_name ?? null,
      gender: form.gender ?? null,
      date_of_birth: form.date_of_birth || null,
      photo_url: photoPath,
      phone: form.phone ?? null,
      whatsapp: form.whatsapp ?? null,
      email: parsed.data.email,
      address: form.address ?? null,
      city: form.city ?? null,
      state: form.state ?? null,
      country: form.country ?? null,
      set_year: "2009",
      house: form.house ?? null,
      class_department: form.class_department ?? null,
      year_joined: form.year_joined ?? null,
      graduation_year: form.graduation_year ?? null,
      student_id: form.student_id ?? null,
      school_notes: form.school_notes ?? null,
      employment_type: employment,
      profession: form.profession ?? null,
      job_title: form.job_title ?? null,
      organisation: form.organisation ?? null,
      industry: form.industry ?? null,
      business_name: form.business_name ?? null,
      business_website: form.business_website ?? null,
      linkedin: form.linkedin ?? null,
      professional_location: form.professional_location ?? null,
      emergency_contact_name: form.emergency_contact_name ?? null,
      emergency_contact_relationship: form.emergency_contact_relationship ?? null,
      emergency_contact_phone: form.emergency_contact_phone ?? null,
      interests,
      skills: skills
        ? skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      other_interest: form.other_interest ?? null,
    };

    const { data: member, error: memberError } = await supabase
      .from("members")
      .insert(payload)
      .select("membership_id")
      .maybeSingle();

    setBusy(false);
    if (memberError) {
      toast.error(
        "Your account was created, but we couldn't save your membership details. Please sign in and complete your profile.",
      );
      return;
    }
    setMembershipId(member?.membership_id ?? null);
    toast.success("Registration submitted successfully.");
  }

  if (membershipId) {
    return (
      <SiteLayout>
        <section className="bg-gradient-surface py-20 sm:py-28">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <img
              src={CREST_URL}
              alt="GCN 09 Set Alumni crest"
              width={110}
              height={110}
              className="mx-auto w-28"
            />
            <h1 className="mt-7 text-3xl font-bold text-brand-deep sm:text-4xl">
              Welcome to GCN 09 Set!
            </h1>
            <p className="mt-4 text-base text-muted-foreground">
              Your registration has been successfully submitted. Welcome to the community.
            </p>
            <div className="mt-9 rounded-[2rem] border border-border bg-card p-8 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Your Membership ID
              </p>
              <p className="mt-3 text-3xl font-bold text-brand">{membershipId}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Your membership status is <strong>Pending</strong> until an administrator reviews and
                approves your application. Please check your email to confirm your address.
              </p>
            </div>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/login">Go to member login</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                <Link to="/">Back to homepage</Link>
              </Button>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="bg-gradient-brand py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <img
            src={CREST_URL}
            alt="GCN 09 Set Alumni crest"
            width={90}
            height={90}
            className="mx-auto w-20"
          />
          <h1 className="mt-6 text-3xl font-bold text-brand-foreground sm:text-4xl">
            Become a Member
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-brand-foreground/85">
            Join the {ORG.short} Alumni community and remain connected to the people, memories and
            purpose that unite us.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-brand-deep">
              Step {step + 1} of {STEPS.length}
            </p>
            <p className="text-sm text-muted-foreground">{STEPS[step]}</p>
          </div>
          <Progress value={((step + 1) / STEPS.length) * 100} className="mt-3 h-2" />

          <Reveal key={step} className="mt-9 rounded-[2rem] border border-border bg-card p-6 shadow-card sm:p-9">
            {step === 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="first_name" label="First Name" required value={form.first_name ?? ""} onChange={set("first_name")} />
                <Field id="middle_name" label="Middle Name" value={form.middle_name ?? ""} onChange={set("middle_name")} />
                <Field id="last_name" label="Last Name" required value={form.last_name ?? ""} onChange={set("last_name")} />
                <Field id="preferred_name" label="Preferred Name" value={form.preferred_name ?? ""} onChange={set("preferred_name")} />
                <Field id="gender" label="Gender" value={form.gender ?? ""} onChange={set("gender")} />
                <Field id="date_of_birth" label="Date of Birth" type="date" value={form.date_of_birth ?? ""} onChange={set("date_of_birth")} />
                <div className="sm:col-span-2">
                  <Label htmlFor="photo">Profile Photo</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="mt-2 h-12 pt-2.5"
                    onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                  />
                </div>
                <Field id="phone" label="Phone Number" value={form.phone ?? ""} onChange={set("phone")} />
                <Field id="whatsapp" label="WhatsApp Number" value={form.whatsapp ?? ""} onChange={set("whatsapp")} />
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Residential Address</Label>
                  <Textarea id="address" rows={3} value={form.address ?? ""} onChange={(e) => set("address")(e.target.value)} className="mt-2" />
                </div>
                <Field id="city" label="City" value={form.city ?? ""} onChange={set("city")} />
                <Field id="state" label="State" value={form.state ?? ""} onChange={set("state")} />
                <Field id="country" label="Country" value={form.country ?? ""} onChange={set("country")} />
              </div>
            ) : null}

            {step === 1 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="set_year">Set</Label>
                  <Input id="set_year" value="2009" readOnly className="mt-2 h-12 bg-muted" />
                </div>
                <Field id="house" label="House / Boarding House" value={form.house ?? ""} onChange={set("house")} />
                <Field id="class_department" label="Class / Department" value={form.class_department ?? ""} onChange={set("class_department")} />
                <Field id="year_joined" label="Year Joined GCN" value={form.year_joined ?? ""} onChange={set("year_joined")} />
                <Field id="graduation_year" label="Year Graduated" value={form.graduation_year ?? ""} onChange={set("graduation_year")} />
                <Field id="student_id" label="Student ID (optional)" value={form.student_id ?? ""} onChange={set("student_id")} />
                <div className="sm:col-span-2">
                  <Label htmlFor="school_notes">Other information about your school years</Label>
                  <Textarea id="school_notes" rows={4} value={form.school_notes ?? ""} onChange={(e) => set("school_notes")(e.target.value)} className="mt-2" />
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label>Employment status</Label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {EMPLOYMENT_TYPES.map((type) => (
                      <Button
                        key={type}
                        type="button"
                        size="sm"
                        variant={employment === type ? "default" : "outline"}
                        className="rounded-full"
                        onClick={() => setEmployment(type)}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
                <Field id="profession" label="Current Profession" value={form.profession ?? ""} onChange={set("profession")} />
                <Field id="job_title" label="Job Title" value={form.job_title ?? ""} onChange={set("job_title")} />
                <Field id="organisation" label="Organisation / Company" value={form.organisation ?? ""} onChange={set("organisation")} />
                <Field id="industry" label="Industry" value={form.industry ?? ""} onChange={set("industry")} />
                <Field id="business_name" label="Business Name" value={form.business_name ?? ""} onChange={set("business_name")} />
                <Field id="business_website" label="Business Website" value={form.business_website ?? ""} onChange={set("business_website")} />
                <Field id="linkedin" label="LinkedIn Profile" value={form.linkedin ?? ""} onChange={set("linkedin")} />
                <Field id="professional_location" label="Professional Location" value={form.professional_location ?? ""} onChange={set("professional_location")} />
              </div>
            ) : null}

            {step === 3 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <p className="text-sm text-muted-foreground sm:col-span-2">
                  This information is optional and is used only for welfare purposes.
                </p>
                <Field id="emergency_contact_name" label="Emergency Contact Name" value={form.emergency_contact_name ?? ""} onChange={set("emergency_contact_name")} />
                <Field id="emergency_contact_relationship" label="Relationship" value={form.emergency_contact_relationship ?? ""} onChange={set("emergency_contact_relationship")} />
                <Field id="emergency_contact_phone" label="Emergency Contact Phone" value={form.emergency_contact_phone ?? ""} onChange={set("emergency_contact_phone")} />
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-6">
                <div>
                  <Label>How would you like to contribute to GCN 09 Set?</Label>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {CONTRIBUTION_OPTIONS.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm"
                      >
                        <Checkbox
                          checked={interests.includes(option)}
                          onCheckedChange={(checked) =>
                            setInterests((prev) =>
                              checked ? [...prev, option] : prev.filter((i) => i !== option),
                            )
                          }
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="skills">Areas of expertise / skills (comma separated)</Label>
                  <Textarea id="skills" rows={3} value={skills} onChange={(e) => setSkills(e.target.value)} className="mt-2" />
                </div>
                <Field id="other_interest" label="Other" value={form.other_interest ?? ""} onChange={set("other_interest")} />
              </div>
            ) : null}

            {step === 5 ? (
              <div className="space-y-5">
                <Field id="account_email" label="Email" type="email" required value={form.account_email ?? ""} onChange={set("account_email")} />
                <Field id="password" label="Password" type="password" required value={form.password ?? ""} onChange={set("password")} />
                <Field id="confirm_password" label="Confirm Password" type="password" required value={form.confirm_password ?? ""} onChange={set("confirm_password")} />
                <label className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Checkbox
                    checked={agreeTerms}
                    onCheckedChange={(c) => setAgreeTerms(c === true)}
                    className="mt-0.5"
                  />
                  I agree to the GCN 09 Set Terms of Use and Privacy Policy.
                </label>
                <label className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Checkbox
                    checked={agreeData}
                    onCheckedChange={(c) => setAgreeData(c === true)}
                    className="mt-0.5"
                  />
                  I consent to my information being used for legitimate alumni association
                  activities.
                </label>
              </div>
            ) : null}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="rounded-full"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button type="button" size="lg" className="rounded-full px-8" onClick={next}>
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  size="lg"
                  className="rounded-full px-8 shadow-gold"
                  disabled={busy}
                  onClick={submit}
                >
                  {busy ? "Submitting…" : "Complete Registration"}
                </Button>
              )}
            </div>
          </Reveal>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <button
              type="button"
              onClick={() => navigate({ to: "/login" })}
              className="font-semibold text-brand hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
