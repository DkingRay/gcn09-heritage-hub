import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { isAdminLoggedIn } from "@/lib/admin-auth";
import { slugify } from "@/lib/admin";
import {
  adminList,
  adminOverview,
  adminInsert,
  adminUpdate,
  adminDelete,
} from "@/routes/admin-api";
import AdminLayout, { type AdminSection } from "@/components/admin/AdminLayout";
import {
  Users,
  CalendarDays,
  Newspaper,
  FolderKanban,
  Megaphone,
  BarChart3,
  Mail,
  TrendingUp,
  Clock,
  CheckCircle,
  HeartHandshake,
} from "lucide-react";

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
      <Label className="text-zinc-400 text-xs font-medium">{label}</Label>
      <Input
        className="mt-1.5 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
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
  const [active, setActive] = useState<AdminSection>("overview");

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

  const refreshOverview = () => {
    adminOverview().then(setOverview).catch(console.error);
  };

  useEffect(() => {
    if (!authorized) return;
    refreshOverview();
  }, [authorized]);

  if (authorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <p className="text-zinc-400">Loading admin…</p>
      </div>
    );
  }

  return (
    <AdminLayout
      active={active}
      onNavigate={setActive}
      pendingCount={overview?.pending}
    >
      {active === "overview" && (
        <OverviewSection overview={overview} onNavigate={setActive} />
      )}
      {active === "members" && <MembersSection />}
      {active === "events" && <EventsSection />}
      {active === "news" && <NewsSection />}
      {active === "projects" && <ProjectsSection />}
      {active === "announcements" && <AnnouncementsSection />}
      {active === "stats" && <StatsSection />}
      {active === "contact" && <ContactSection />}
    </AdminLayout>
  );
}

function OverviewSection({
  overview,
  onNavigate,
}: {
  overview: any;
  onNavigate: (s: AdminSection) => void;
}) {
  const cards = [
    { label: "Total Members", value: overview?.members ?? "…", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Pending", value: overview?.pending ?? "…", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Active", value: overview?.active ?? "…", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Events", value: overview?.events ?? "…", icon: CalendarDays, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "News", value: overview?.news ?? "…", icon: Newspaper, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { label: "Projects", value: overview?.projects ?? "…", icon: FolderKanban, color: "text-orange-400", bg: "bg-orange-500/10" },
    { label: "Pledges", value: overview?.pledges ?? "…", icon: HeartHandshake, color: "text-pink-400", bg: "bg-pink-500/10" },
    { label: "Messages", value: overview?.messages ?? "…", icon: Mail, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-1">Welcome back, administrator.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{card.label}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
                </div>
                <div className={`rounded-xl p-3 ${card.bg}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-emerald-500/50 transition-colors" onClick={() => onNavigate("members")}>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-xl bg-amber-500/10 p-3"><Clock className="h-6 w-6 text-amber-400" /></div>
            <div>
              <p className="text-sm font-semibold text-white">Pending Approvals</p>
              <p className="text-2xl font-bold text-amber-400">{overview?.pending ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-emerald-500/50 transition-colors" onClick={() => onNavigate("contact")}>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-xl bg-indigo-500/10 p-3"><Mail className="h-6 w-6 text-indigo-400" /></div>
            <div>
              <p className="text-sm font-semibold text-white">Unread Messages</p>
              <p className="text-2xl font-bold text-indigo-400">{overview?.messages ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-emerald-500/50 transition-colors" onClick={() => onNavigate("events")}>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-xl bg-purple-500/10 p-3"><TrendingUp className="h-6 w-6 text-purple-400" /></div>
            <div>
              <p className="text-sm font-semibold text-white">Total Events</p>
              <p className="text-2xl font-bold text-purple-400">{overview?.events ?? 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MembersSection() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
      (statusFilter === "all" || r.status === statusFilter) &&
      (!q ||
        [r.first_name, r.last_name, r.email, r.membership_id, r.phone]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase())),
  );

  if (loading) return <Skeleton className="h-40 w-full bg-zinc-800" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Members</h1>
          <p className="text-sm text-zinc-400 mt-1">{rows.length} total members</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search members…"
            className="w-56 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="all">All</SelectItem>
              {MEMBER_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={load} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
            Refresh
          </Button>
        </div>
      </div>
      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
              <TableHead className="text-zinc-400">Name</TableHead>
              <TableHead className="text-zinc-400">ID</TableHead>
              <TableHead className="text-zinc-400">Email</TableHead>
              <TableHead className="text-zinc-400">Phone</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-800/30">
                <TableCell className="font-medium text-white">
                  {r.first_name} {r.last_name}
                </TableCell>
                <TableCell className="text-zinc-400 font-mono text-xs">{r.membership_id}</TableCell>
                <TableCell className="text-zinc-400">{r.email}</TableCell>
                <TableCell className="text-zinc-400">{r.phone ?? "—"}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      r.status === "active"
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                        : r.status === "pending"
                        ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
                        : "bg-red-500/15 text-red-400 border-red-500/20"
                    }
                    variant="outline"
                  >
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => setEdit(r)} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
                      Edit
                    </Button>
                    {r.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          adminUpdate({
                            data: { table: "members", id: r.id, values: { status: "active" } },
                          }).then(load);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                  No members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      {edit && (
        <EditDialog
          title={`${edit.first_name} ${edit.last_name}`}
          onClose={() => setEdit(null)}
          onSave={(v) => {
            adminUpdate({ data: { table: "members", id: edit.id, values: v } }).then(() => {
              setEdit(null);
              load();
            });
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

function EventsSection() {
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

  if (loading) return <Skeleton className="h-40 w-full bg-zinc-800" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Events</h1>
          <p className="text-sm text-zinc-400 mt-1">{rows.length} events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Refresh</Button>
          <Button size="sm" onClick={() => setCreate(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white">New Event</Button>
        </div>
      </div>
      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
              <TableHead className="text-zinc-400">Title</TableHead>
              <TableHead className="text-zinc-400">Category</TableHead>
              <TableHead className="text-zinc-400">Date</TableHead>
              <TableHead className="text-zinc-400">Published</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-800/30">
                <TableCell className="font-medium text-white">{r.title}</TableCell>
                <TableCell className="text-zinc-400">{r.category}</TableCell>
                <TableCell className="text-zinc-400">{r.event_date ?? "—"}</TableCell>
                <TableCell>{r.is_published ? <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20" variant="outline">Published</Badge> : <Badge className="bg-zinc-500/15 text-zinc-400 border-zinc-500/20" variant="outline">Draft</Badge>}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => setEdit(r)} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => { if (!confirm("Delete?")) return; adminDelete({ data: { table: "events", id: r.id } }).then(load); }}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-zinc-500">No events yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      {(create || edit) && (
        <EventDialog open onClose={() => { setCreate(false); setEdit(null); }} initial={edit ?? undefined} onSave={(v) => {
          const p = edit ? adminUpdate({ data: { table: "events", id: edit.id, values: v } }) : adminInsert({ data: { table: "events", values: v } });
          p.then(() => { setCreate(false); setEdit(null); load(); });
        }} />
      )}
    </div>
  );
}

function EventDialog({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial?: any; onSave: (v: Record<string, unknown>) => void }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white">{initial ? "Edit Event" : "New Event"}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><InlineEdit label="Title" value={title} onChange={(v) => { setTitle(v); if (!initial) setSlug(slugify(v)); }} /></div>
          <InlineEdit label="Slug" value={slug} onChange={setSlug} />
          <div>
            <Label className="text-zinc-400 text-xs font-medium">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {["Alumni Reunion", "Fundraiser", "Career Fair", "Community Service", "General Meeting", "Other"].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <InlineEdit label="Event Date" value={event_date} onChange={setEventDate} type="date" />
          <InlineEdit label="Event Time" value={event_time} onChange={setEventTime} placeholder="e.g. 10:00 AM" />
          <InlineEdit label="Venue" value={venue} onChange={setVenue} />
          <div className="sm:col-span-2"><InlineEdit label="Description" value={description} onChange={setDescription} /></div>
          <div className="sm:col-span-2"><InlineEdit label="Image URL" value={image_url} onChange={setImageUrl} /></div>
          <div className="sm:col-span-2 flex items-center gap-3"><Switch checked={is_published} onCheckedChange={setIsPublished} /><Label className="text-zinc-300">Published</Label></div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Cancel</Button>
          <Button onClick={() => onSave({ title, slug, category, event_date, event_time, venue, description, image_url, is_published })} className="bg-emerald-600 hover:bg-emerald-500 text-white">{initial ? "Save" : "Create"}</Button>
        </div>
      </div>
    </div>
  );
}

function NewsSection() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState<any | null>(null);

  const load = () => {
    setLoading(true);
    adminList({ data: { table: "news_posts", order: "created_at", ascending: false } })
      .then(setRows).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) return <Skeleton className="h-40 w-full bg-zinc-800" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">News</h1>
          <p className="text-sm text-zinc-400 mt-1">{rows.length} posts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Refresh</Button>
          <Button size="sm" onClick={() => setCreate(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white">New Post</Button>
        </div>
      </div>
      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
              <TableHead className="text-zinc-400">Title</TableHead>
              <TableHead className="text-zinc-400">Category</TableHead>
              <TableHead className="text-zinc-400">Published</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-800/30">
                <TableCell className="font-medium text-white">{r.title}</TableCell>
                <TableCell className="text-zinc-400">{r.category}</TableCell>
                <TableCell>{r.is_published ? <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20" variant="outline">Published</Badge> : <Badge className="bg-zinc-500/15 text-zinc-400 border-zinc-500/20" variant="outline">Draft</Badge>}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => setEdit(r)} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => { if (!confirm("Delete?")) return; adminDelete({ data: { table: "news_posts", id: r.id } }).then(load); }}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-zinc-500">No posts yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      {(create || edit) && (
        <NewsDialog open onClose={() => { setCreate(false); setEdit(null); }} initial={edit ?? undefined} onSave={(v) => {
          const p = edit ? adminUpdate({ data: { table: "news_posts", id: edit.id, values: v } }) : adminInsert({ data: { table: "news_posts", values: v } });
          p.then(() => { setCreate(false); setEdit(null); load(); });
        }} />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white">{initial ? "Edit Post" : "New Post"}</h3>
        <div className="mt-4 grid gap-4">
          <InlineEdit label="Title" value={title} onChange={(v) => { setTitle(v); if (!initial) setSlug(slugify(v)); }} />
          <InlineEdit label="Slug" value={slug} onChange={setSlug} />
          <InlineEdit label="Category" value={category} onChange={setCategory} />
          <InlineEdit label="Author" value={author} onChange={setAuthor} />
          <InlineEdit label="Excerpt" value={excerpt} onChange={setExcerpt} />
          <div><Label className="text-zinc-400 text-xs font-medium">Content</Label><Textarea className="mt-1.5 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" value={content} onChange={(e) => setContent(e.target.value)} rows={6} /></div>
          <InlineEdit label="Image URL" value={image_url} onChange={setImageUrl} />
          <div className="flex items-center gap-3"><Switch checked={is_published} onCheckedChange={setIsPublished} /><Label className="text-zinc-300">Published</Label></div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Cancel</Button>
          <Button onClick={() => onSave({ title, slug, category, author, excerpt, content, image_url, is_published })} className="bg-emerald-600 hover:bg-emerald-500 text-white">{initial ? "Save" : "Create"}</Button>
        </div>
      </div>
    </div>
  );
}

function ProjectsSection() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState<any | null>(null);

  const load = () => {
    setLoading(true);
    adminList({ data: { table: "projects", order: "created_at", ascending: false } })
      .then(setRows).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) return <Skeleton className="h-40 w-full bg-zinc-800" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-zinc-400 mt-1">{rows.length} projects</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Refresh</Button>
          <Button size="sm" onClick={() => setCreate(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white">New Project</Button>
        </div>
      </div>
      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
              <TableHead className="text-zinc-400">Title</TableHead>
              <TableHead className="text-zinc-400">Category</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Published</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-800/30">
                <TableCell className="font-medium text-white">{r.title}</TableCell>
                <TableCell className="text-zinc-400">{r.category}</TableCell>
                <TableCell><Badge className="bg-zinc-500/15 text-zinc-300 border-zinc-500/20" variant="outline">{r.status}</Badge></TableCell>
                <TableCell>{r.is_published ? <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20" variant="outline">Published</Badge> : <Badge className="bg-zinc-500/15 text-zinc-400 border-zinc-500/20" variant="outline">Draft</Badge>}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => setEdit(r)} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => { if (!confirm("Delete?")) return; adminDelete({ data: { table: "projects", id: r.id } }).then(load); }}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-zinc-500">No projects yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white">{initial ? "Edit Project" : "New Project"}</h3>
        <div className="mt-4 grid gap-4">
          <InlineEdit label="Title" value={title} onChange={(v) => { setTitle(v); if (!initial) setSlug(slugify(v)); }} />
          <InlineEdit label="Slug" value={slug} onChange={setSlug} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-400 text-xs font-medium">Category</Label>
              <Select value={category} onValueChange={setCategory}><SelectTrigger className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">{["Education", "Health", "Infrastructure", "Economic Empowerment", "Community Development", "Other"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-zinc-400 text-xs font-medium">Status</Label>
              <Select value={status} onValueChange={setStatus}><SelectTrigger className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">{["Upcoming", "In Progress", "Completed"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
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
            <div className="flex items-center gap-3"><Switch checked={is_published} onCheckedChange={setIsPublished} /><Label className="text-zinc-300">Published</Label></div>
            <div className="flex items-center gap-3"><Switch checked={is_featured} onCheckedChange={setIsFeatured} /><Label className="text-zinc-300">Featured</Label></div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Cancel</Button>
          <Button onClick={() => onSave({ title, slug, category, status, location, summary, description, beneficiaries, impact, image_url, is_published, is_featured })} className="bg-emerald-600 hover:bg-emerald-500 text-white">{initial ? "Save" : "Create"}</Button>
        </div>
      </div>
    </div>
  );
}

function AnnouncementsSection() {
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

  if (loading) return <Skeleton className="h-40 w-full bg-zinc-800" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Announcements</h1>
          <p className="text-sm text-zinc-400 mt-1">{rows.length} announcements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Refresh</Button>
          <Button size="sm" onClick={() => setCreate(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white">New Announcement</Button>
        </div>
      </div>
      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
              <TableHead className="text-zinc-400">Title</TableHead>
              <TableHead className="text-zinc-400">Published</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-800/30">
                <TableCell className="font-medium text-white">{r.title}</TableCell>
                <TableCell>{r.is_published ? <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20" variant="outline">Published</Badge> : <Badge className="bg-zinc-500/15 text-zinc-400 border-zinc-500/20" variant="outline">Draft</Badge>}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => setEdit(r)} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => { if (!confirm("Delete?")) return; adminDelete({ data: { table: "announcements", id: r.id } }).then(load); }}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={3} className="text-center py-8 text-zinc-500">No announcements yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white">{initial ? "Edit" : "New"} Announcement</h3>
        <div className="mt-4 grid gap-4">
          <InlineEdit label="Title" value={title} onChange={setTitle} />
          <div><Label className="text-zinc-400 text-xs font-medium">Body</Label><Textarea className="mt-1.5 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" value={body} onChange={(e) => setBody(e.target.value)} rows={5} /></div>
          <div className="flex items-center gap-3"><Switch checked={is_published} onCheckedChange={setIsPublished} /><Label className="text-zinc-300">Published</Label></div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Cancel</Button>
          <Button onClick={() => onSave({ title, body, is_published })} className="bg-emerald-600 hover:bg-emerald-500 text-white">{initial ? "Save" : "Create"}</Button>
        </div>
      </div>
    </div>
  );
}

function StatsSection() {
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

  if (loading) return <Skeleton className="h-40 w-full bg-zinc-800" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Impact Stats</h1>
          <p className="text-sm text-zinc-400 mt-1">{rows.length} stats</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Refresh</Button>
          <Button size="sm" onClick={() => setCreate(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white">New Stat</Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <Card key={r.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
            <CardContent className="p-5">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{r.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{r.prefix ?? ""}{r.value}{r.suffix ?? ""}</p>
              <div className="mt-3 flex gap-1">
                <Button size="sm" variant="outline" onClick={() => setEdit(r)} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => { if (!confirm("Delete?")) return; adminDelete({ data: { table: "impact_stats", id: r.id } }).then(load); }}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white">{initial ? "Edit" : "New"} Stat</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><InlineEdit label="Label" value={label} onChange={setLabel} /></div>
          <InlineEdit label="Value" value={value} onChange={setValue} type="number" />
          <InlineEdit label="Sort Order" value={sort_order} onChange={setSortOrder} type="number" />
          <InlineEdit label="Prefix" value={prefix} onChange={setPrefix} placeholder="e.g. ₦" />
          <InlineEdit label="Suffix" value={suffix} onChange={setSuffix} placeholder="e.g. +, M+" />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Cancel</Button>
          <Button onClick={() => onSave({ label, value: Number(value), prefix, suffix, sort_order: Number(sort_order) })} className="bg-emerald-600 hover:bg-emerald-500 text-white">{initial ? "Save" : "Create"}</Button>
        </div>
      </div>
    </div>
  );
}

function ContactSection() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminList({ data: { table: "contact_messages", order: "created_at", ascending: false } })
      .then(setRows).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) return <Skeleton className="h-40 w-full bg-zinc-800" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <p className="text-sm text-zinc-400 mt-1">{rows.length} messages</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Refresh</Button>
      </div>
      {rows.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-12 text-center">
            <Mail className="mx-auto h-10 w-10 text-zinc-700" />
            <p className="mt-3 text-zinc-500">No messages yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                <TableHead className="text-zinc-400">From</TableHead>
                <TableHead className="text-zinc-400">Subject</TableHead>
                <TableHead className="text-zinc-400">Date</TableHead>
                <TableHead className="text-zinc-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-800/30">
                  <TableCell>
                    <p className="font-medium text-white">{r.name}</p>
                    <p className="text-xs text-zinc-500">{r.email}</p>
                  </TableCell>
                  <TableCell className="text-zinc-300">{r.subject ?? "No subject"}</TableCell>
                  <TableCell className="text-zinc-500 text-sm">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" onClick={() => alert(`From: ${r.name}\nEmail: ${r.email}\n\n${r.message}`)} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">View</Button>
                      <Button size="sm" variant="destructive" onClick={() => { if (!confirm("Delete?")) return; adminDelete({ data: { table: "contact_messages", id: r.id } }).then(load); }}>Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white">Edit {title}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
              <Label className="text-zinc-400 text-xs font-medium">{f.label}</Label>
              {f.type === "switch" ? (
                <div className="mt-2">
                  <Switch checked={!!draft[f.key]} onCheckedChange={(c) => setDraft({ ...draft, [f.key]: c })} />
                </div>
              ) : f.type === "select" ? (
                <Select value={String(draft[f.key] ?? "")} onValueChange={(v) => setDraft({ ...draft, [f.key]: v })}>
                  <SelectTrigger className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {f.options?.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : f.type === "textarea" ? (
                <Textarea className="mt-1.5 bg-zinc-800 border-zinc-700 text-white" value={String(draft[f.key] ?? "")} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} rows={4} />
              ) : (
                <Input className="mt-1.5 bg-zinc-800 border-zinc-700 text-white" value={String(draft[f.key] ?? "")} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Cancel</Button>
          <Button onClick={() => onSave(draft)} className="bg-emerald-600 hover:bg-emerald-500 text-white">Save</Button>
        </div>
      </div>
    </div>
  );
}
