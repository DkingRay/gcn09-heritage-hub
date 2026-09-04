import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { isAdminLoggedIn, adminLogout } from "@/lib/admin-auth";
import { slugify } from "@/lib/admin";
import {
  adminList,
  adminOverview,
  adminInsert,
  adminUpdate,
  adminDelete,
} from "@/routes/admin-api";
import { CREST_URL, ORG } from "@/lib/site";
import heroImage from "@/assets/page-news.jpeg";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | GCN 09 Set Alumni" },
      {
        name: "description",
        content:
          "Administrative control centre for GCN 09 Set Alumni — manage members, events, news, projects, announcements and site content.",
      },
      { property: "og:title", content: "Admin Dashboard | GCN 09 Set Alumni" },
      {
        property: "og:description",
        content: "Manage members, events, news, projects and announcements.",
      },
    ],
  }),
  component: AdminDashboard,
});

const MEMBER_STATUSES = ["pending", "active", "suspended", "inactive"] as const;

// Reusable inline edit form
function InlineEdit({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <Label className="text-muted-foreground">{label}</Label>
      <Input
        className="mt-1"
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate({ to: "/admin-login" });
      return;
    }
    setAuthorized(true);
  }, [navigate]);

  const [overview, setOverview] = useState<{
    members: number;
    pending: number;
    active: number;
    events: number;
    news: number;
    projects: number;
    pledges: number;
    messages: number;
    volunteers: number;
  } | null>(null);

  useEffect(() => {
    if (!authorized) return;
    adminOverview().then(setOverview).catch(console.error);
  }, [authorized]);

  if (authorized === null) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground">Loading admin…</p>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero title="Admin Dashboard" subtitle="" image={heroImage} />
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-foreground">Control Centre</h2>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              adminLogout();
              navigate({ to: "/admin-login" });
            }}
          >
            Sign out
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Total Members", value: overview?.members ?? "…" },
            { label: "Pending Members", value: overview?.pending ?? "…" },
            { label: "Active Members", value: overview?.active ?? "…" },
            { label: "Events", value: overview?.events ?? "…" },
            { label: "News Posts", value: overview?.news ?? "…" },
            { label: "Projects", value: overview?.projects ?? "…" },
            { label: "Pledges", value: overview?.pledges ?? "…" },
            { label: "Messages", value: overview?.messages ?? "…" },
            { label: "Volunteers", value: overview?.volunteers ?? "…" },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {card.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-foreground">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="members" className="mt-10">
          <TabsList className="flex w-full flex-wrap gap-1 bg-muted p-1">
            {(
              [
                "members",
                "events",
                "news",
                "projects",
                "announcements",
                "stats",
                "contact",
              ] as const
            ).map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="flex-1 min-w-[80px] capitalize"
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="members">
            <MembersTable />
          </TabsContent>
          <TabsContent value="events">
            <EventsTable />
          </TabsContent>
          <TabsContent value="news">
            <NewsTable />
          </TabsContent>
          <TabsContent value="projects">
            <ProjectsTable />
          </TabsContent>
          <TabsContent value="announcements">
            <AnnouncementsTable />
          </TabsContent>
          <TabsContent value="stats">
            <StatsTable />
          </TabsContent>
          <TabsContent value="contact">
            <ContactTable />
          </TabsContent>
        </Tabs>
      </section>
    </SiteLayout>
  );
}

function MembersTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<any | null>(null);

  const load = () => {
    setLoading(true);
    adminList({ data: { table: "members", order: "created_at", ascending: false } })
      .then(setRows)
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = rows.filter(
    (r) =>
      !q ||
      [r.first_name, r.last_name, r.email, r.membership_id, r.phone]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q.toLowerCase()),
  );

  if (loading) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-bold text-foreground">Members</h3>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search…"
            className="w-56"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Button variant="secondary" onClick={load}>
            Refresh
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">
                  {r.first_name} {r.last_name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{r.membership_id}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                <td className="px-4 py-3">
                  <Badge
                    className={
                      r.status === "active"
                        ? "bg-green-100 text-green-700"
                        : r.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {r.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => setEdit(r)}>
                      Edit
                    </Button>
                    {r.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          adminUpdate({
                            data: {
                              table: "members",
                              id: r.id,
                              values: { status: "active" },
                            },
                          }).then(load);
                        }}
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {edit && (
        <EditDialog
          title={`${edit.first_name} ${edit.last_name}`}
          onClose={() => setEdit(null)}
          onSave={(v) => {
            adminUpdate({ data: { table: "members", id: edit.id, values: v } }).then(
              () => {
                setEdit(null);
                load();
              },
            );
          }}
          fields={[
            { label: "First Name", key: "first_name", value: edit.first_name },
            { label: "Last Name", key: "last_name", value: edit.last_name },
            { label: "Email", key: "email", value: edit.email },
            { label: "Phone", key: "phone", value: edit.phone },
            { label: "City", key: "city", value: edit.city },
            { label: "Country", key: "country", value: edit.country },
            { label: "Status", key: "status", value: edit.status, type: "select", options: MEMBER_STATUSES },
            { label: "Spotlight", key: "is_spotlight", value: edit.is_spotlight, type: "switch" },
            { label: "Show in Directory", key: "show_in_directory", value: edit.show_in_directory, type: "switch" },
            { label: "Admin Notes", key: "admin_notes", value: edit.admin_notes, type: "textarea" },
          ]}
        />
      )}
    </div>
  );
}

function EventsTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState<any | null>(null);

  const load = () => {
    setLoading(true);
    adminList({ data: { table: "events", order: "event_date", ascending: false } })
      .then(setRows)
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">Events</h3>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={load}>
            Refresh
          </Button>
          <Button onClick={() => setCreate(true)}>New event</Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{r.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.event_date}</td>
                <td className="px-4 py-3">{r.is_published ? "✅" : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => setEdit(r)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (!confirm("Delete this event?")) return;
                        adminDelete({ data: { table: "events", id: r.id } }).then(load);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(create || edit) && (
        <EventDialog
          open={true}
          onClose={() => { setCreate(false); setEdit(null); }}
          initial={edit ?? undefined}
          onSave={(v) => {
            const p = edit
              ? adminUpdate({ data: { table: "events", id: edit.id, values: v } })
              : adminInsert({ data: { table: "events", values: v } });
            p.then(() => { setCreate(false); setEdit(null); load(); });
          }}
        />
      )}
    </div>
  );
}

function EventDialog({
  open,
  onClose,
  initial,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initial?: any;
  onSave: (v: Record<string, unknown>) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Alumni Reunion");
  const [event_date, setEventDate] = useState(initial?.event_date ?? "");
  const [event_time, setEventTime] = useState(initial?.event_time ?? "");
  const [venue, setVenue] = useState(initial?.venue ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image_url, setImageUrl] = useState(initial?.image_url ?? "");
  const [is_published, setIsPublished] = useState(initial?.is_published ?? false);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card p-6 shadow-xl border border-border">
        <h3 className="text-lg font-bold text-foreground">{initial ? "Edit event" : "New event"}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <InlineEdit label="Title" value={title} onChange={(v) => { setTitle(v); if (!initial) setSlug(slugify(v)); }} />
          </div>
          <InlineEdit label="Slug" value={slug} onChange={setSlug} />
          <div>
            <Label className="text-muted-foreground">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Alumni Reunion", "Fundraiser", "Career Fair", "Community Service", "General Meeting", "Other"].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <InlineEdit label="Event Date" value={event_date} onChange={setEventDate} type="date" />
          <InlineEdit label="Event Time" value={event_time} onChange={setEventTime} placeholder="e.g. 10:00 AM" />
          <InlineEdit label="Venue" value={venue} onChange={setVenue} />
          <div className="sm:col-span-2">
            <InlineEdit label="Description" value={description} onChange={setDescription} />
          </div>
          <div className="sm:col-span-2">
            <InlineEdit label="Image URL" value={image_url} onChange={setImageUrl} />
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <Switch checked={is_published} onCheckedChange={setIsPublished} />
            <Label>Published</Label>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave({ title, slug, category, event_date, event_time, venue, description, image_url, is_published })}>
            {initial ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function NewsTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState<any | null>(null);

  const load = () => {
    setLoading(true);
    adminList({ data: { table: "news_posts", order: "created_at", ascending: false } })
      .then(setRows)
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">News</h3>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={load}>Refresh</Button>
          <Button onClick={() => setCreate(true)}>New post</Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{r.title}</td>
                <td className="px-4 py-3">{r.is_published ? "✅" : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => setEdit(r)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => {
                      if (!confirm("Delete?")) return;
                      adminDelete({ data: { table: "news_posts", id: r.id } }).then(load);
                    }}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(create || edit) && (
        <NewsDialog
          open onClose={() => { setCreate(false); setEdit(null); }}
          initial={edit ?? undefined}
          onSave={(v) => {
            const p = edit
              ? adminUpdate({ data: { table: "news_posts", id: edit.id, values: v } })
              : adminInsert({ data: { table: "news_posts", values: v } });
            p.then(() => { setCreate(false); setEdit(null); load(); });
          }}
        />
      )}
    </div>
  );
}

function NewsDialog({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial?: any; onSave: (v: Record<string, unknown>) => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Alumni News");
  const [author, setAuthor] = useState(initial?.author ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [image_url, setImageUrl] = useState(initial?.image_url ?? "");
  const [is_published, setIsPublished] = useState(initial?.is_published ?? false);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card p-6 shadow-xl border border-border">
        <h3 className="text-lg font-bold text-foreground">{initial ? "Edit post" : "New post"}</h3>
        <div className="mt-4 grid gap-4">
          <InlineEdit label="Title" value={title} onChange={(v) => { setTitle(v); if (!initial) setSlug(slugify(v)); }} />
          <InlineEdit label="Slug" value={slug} onChange={setSlug} />
          <InlineEdit label="Category" value={category} onChange={setCategory} />
          <InlineEdit label="Author" value={author} onChange={setAuthor} />
          <InlineEdit label="Excerpt" value={excerpt} onChange={setExcerpt} />
          <div>
            <Label className="text-muted-foreground">Content</Label>
            <Textarea className="mt-1" value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
          </div>
          <InlineEdit label="Image URL" value={image_url} onChange={setImageUrl} />
          <div className="flex items-center gap-3"><Switch checked={is_published} onCheckedChange={setIsPublished} /><Label>Published</Label></div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave({ title, slug, category, author, excerpt, content, image_url, is_published })}>{initial ? "Save" : "Create"}</Button>
        </div>
      </div>
    </div>
  );
}

function ProjectsTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState<any | null>(null);

  const load = () => {
    setLoading(true);
    adminList({ data: { table: "projects", order: "created_at", ascending: false } })
      .then(setRows)
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">Projects</h3>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={load}>Refresh</Button>
          <Button onClick={() => setCreate(true)}>New project</Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{r.title}</td>
                <td className="px-4 py-3">{r.is_published ? "✅" : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => setEdit(r)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => {
                      if (!confirm("Delete?")) return;
                      adminDelete({ data: { table: "projects", id: r.id } }).then(load);
                    }}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(create || edit) && (
        <ProjectDialog open onClose={() => { setCreate(false); setEdit(null); }} initial={edit ?? undefined} onSave={(v) => {
          const p = edit ? adminUpdate({ data: { table: "projects", id: edit.id, values: v } }) : adminInsert({ data: { table: "projects", values: v } });
          p.then(() => { setCreate(false); setEdit(null); load(); });
        }} />
      )}
    </div>
  );
}

function ProjectDialog({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial?: any; onSave: (v: Record<string, unknown>) => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Education");
  const [status, setStatus] = useState(initial?.status ?? "Upcoming");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [beneficiaries, setBeneficiaries] = useState(initial?.beneficiaries ?? "");
  const [impact, setImpact] = useState(initial?.impact ?? "");
  const [image_url, setImageUrl] = useState(initial?.image_url ?? "");
  const [is_published, setIsPublished] = useState(initial?.is_published ?? false);
  const [is_featured, setIsFeatured] = useState(initial?.is_featured ?? false);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card p-6 shadow-xl border border-border">
        <h3 className="text-lg font-bold text-foreground">{initial ? "Edit project" : "New project"}</h3>
        <div className="mt-4 grid gap-4">
          <InlineEdit label="Title" value={title} onChange={(v) => { setTitle(v); if (!initial) setSlug(slugify(v)); }} />
          <InlineEdit label="Slug" value={slug} onChange={setSlug} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Category</Label>
              <Select value={category} onValueChange={setCategory}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{["Education", "Health", "Infrastructure", "Economic Empowerment", "Community Development", "Other"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <Select value={status} onValueChange={setStatus}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{["Upcoming", "In Progress", "Completed"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <InlineEdit label="Location" value={location} onChange={setLocation} />
          <InlineEdit label="Summary" value={summary} onChange={setSummary} />
          <InlineEdit label="Description" value={description} onChange={setDescription} />
          <InlineEdit label="Beneficiaries" value={beneficiaries} onChange={setBeneficiaries} />
          <InlineEdit label="Impact" value={impact} onChange={setImpact} />
          <InlineEdit label="Image URL" value={image_url} onChange={setImageUrl} />
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3"><Switch checked={is_published} onCheckedChange={setIsPublished} /><Label>Published</Label></div>
            <div className="flex items-center gap-3"><Switch checked={is_featured} onCheckedChange={setIsFeatured} /><Label>Featured</Label></div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave({ title, slug, category, status, location, summary, description, beneficiaries, impact, image_url, is_published, is_featured })}>{initial ? "Save" : "Create"}</Button>
        </div>
      </div>
    </div>
  );
}

function AnnouncementsTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState<any | null>(null);

  const load = () => {
    setLoading(true);
    adminList({ data: { table: "announcements", order: "created_at", ascending: false } })
      .then(setRows).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">Announcements</h3>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={load}>Refresh</Button>
          <Button onClick={() => setCreate(true)}>New announcement</Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Published</th><th className="px-4 py-3">Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{r.title}</td>
                <td className="px-4 py-3">{r.is_published ? "✅" : "—"}</td>
                <td className="px-4 py-3 flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => setEdit(r)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => { if (!confirm("Delete?")) return; adminDelete({ data: { table: "announcements", id: r.id } }).then(load); }}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(create || edit) && (
        <AnnouncementDialog open onClose={() => { setCreate(false); setEdit(null); }} initial={edit ?? undefined} onSave={(v) => {
          const p = edit ? adminUpdate({ data: { table: "announcements", id: edit.id, values: v } }) : adminInsert({ data: { table: "announcements", values: v } });
          p.then(() => { setCreate(false); setEdit(null); load(); });
        }} />
      )}
    </div>
  );
}

function AnnouncementDialog({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial?: any; onSave: (v: Record<string, unknown>) => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [is_published, setIsPublished] = useState(initial?.is_published ?? false);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl border border-border">
        <h3 className="text-lg font-bold text-foreground">{initial ? "Edit" : "New"} announcement</h3>
        <div className="mt-4 grid gap-4">
          <InlineEdit label="Title" value={title} onChange={setTitle} />
          <div><Label className="text-muted-foreground">Body</Label><Textarea className="mt-1" value={body} onChange={(e) => setBody(e.target.value)} rows={5} /></div>
          <div className="flex items-center gap-3"><Switch checked={is_published} onCheckedChange={setIsPublished} /><Label>Published</Label></div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave({ title, body, is_published })}>{initial ? "Save" : "Create"}</Button>
        </div>
      </div>
    </div>
  );
}

function StatsTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState<any | null>(null);

  const load = () => {
    setLoading(true);
    adminList({ data: { table: "impact_stats", order: "sort_order" } })
      .then(setRows).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">Impact Stats</h3>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={load}>Refresh</Button>
          <Button onClick={() => setCreate(true)}>New stat</Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr><th className="px-4 py-3">Label</th><th className="px-4 py-3">Value</th><th className="px-4 py-3">Prefix</th><th className="px-4 py-3">Suffix</th><th className="px-4 py-3">Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{r.label}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.value}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.prefix ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.suffix ?? "—"}</td>
                <td className="px-4 py-3 flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => setEdit(r)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => { if (!confirm("Delete?")) return; adminDelete({ data: { table: "impact_stats", id: r.id } }).then(load); }}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(create || edit) && (
        <StatDialog open onClose={() => { setCreate(false); setEdit(null); }} initial={edit ?? undefined} onSave={(v) => {
          const p = edit ? adminUpdate({ data: { table: "impact_stats", id: edit.id, values: v } }) : adminInsert({ data: { table: "impact_stats", values: v } });
          p.then(() => { setCreate(false); setEdit(null); load(); });
        }} />
      )}
    </div>
  );
}

function StatDialog({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial?: any; onSave: (v: Record<string, unknown>) => void }) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [value, setValue] = useState(initial?.value?.toString() ?? "0");
  const [prefix, setPrefix] = useState(initial?.prefix ?? "");
  const [suffix, setSuffix] = useState(initial?.suffix ?? "");
  const [sort_order, setSortOrder] = useState(initial?.sort_order?.toString() ?? "0");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl border border-border">
        <h3 className="text-lg font-bold text-foreground">{initial ? "Edit" : "New"} stat</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><InlineEdit label="Label" value={label} onChange={setLabel} /></div>
          <InlineEdit label="Value" value={value} onChange={setValue} type="number" />
          <InlineEdit label="Sort Order" value={sort_order} onChange={setSortOrder} type="number" />
          <InlineEdit label="Prefix" value={prefix} onChange={setPrefix} placeholder="e.g. ₦" />
          <InlineEdit label="Suffix" value={suffix} onChange={setSuffix} placeholder="e.g. +, M+" />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave({ label, value: Number(value), prefix, suffix, sort_order: Number(sort_order) })}>{initial ? "Save" : "Create"}</Button>
        </div>
      </div>
    </div>
  );
}

function ContactTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminList({ data: { table: "contact_messages", order: "created_at", ascending: false } })
      .then(setRows).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">Contact Messages</h3>
        <Button variant="secondary" onClick={load}>Refresh</Button>
      </div>
      {rows.length === 0 ? (
        <p className="text-muted-foreground">No messages yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="px-4 py-3">From</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-4 py-3">{r.name} ({r.email})</td>
                  <td className="px-4 py-3 font-medium text-foreground">{r.subject ?? "No subject"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => alert(`From: ${r.name}\nEmail: ${r.email}\n\n${r.message}`)}>View</Button>
                    <Button size="sm" variant="destructive" onClick={() => { if (!confirm("Delete?")) return; adminDelete({ data: { table: "contact_messages", id: r.id } }).then(load); }}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EditDialog({
  title,
  onClose,
  onSave,
  fields,
}: {
  title: string;
  onClose: () => void;
  onSave: (v: Record<string, unknown>) => void;
  fields: {
    label: string;
    key: string;
    value: unknown;
    type?: "text" | "select" | "switch" | "textarea";
    options?: readonly string[];
  }[];
}) {
  const [draft, setDraft] = useState(() => {
    const d: Record<string, unknown> = {};
    fields.forEach((f) => (d[f.key] = f.value));
    return d;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card p-6 shadow-xl border border-border">
        <h3 className="text-lg font-bold text-foreground">Edit {title}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
              <Label className="text-muted-foreground">{f.label}</Label>
              {f.type === "switch" ? (
                <div className="mt-2">
                  <Switch
                    checked={!!draft[f.key]}
                    onCheckedChange={(c) => setDraft({ ...draft, [f.key]: c })}
                  />
                </div>
              ) : f.type === "select" ? (
                <Select
                  value={String(draft[f.key] ?? "")}
                  onValueChange={(v) => setDraft({ ...draft, [f.key]: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {f.options?.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : f.type === "textarea" ? (
                <Textarea
                  className="mt-1"
                  value={String(draft[f.key] ?? "")}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                  rows={4}
                />
              ) : (
                <Input
                  className="mt-1"
                  value={String(draft[f.key] ?? "")}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(draft)}>Save</Button>
        </div>
      </div>
    </div>
  );
}
