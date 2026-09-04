import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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
import { useIsAdmin, useSession } from "@/hooks/useSession";
import {
  slugify,
  useAdminDelete,
  useAdminInsert,
  useAdminList,
  useAdminOverview,
  useAdminUpdate,
  type AnnouncementRow,
  type EventRow,
  type MemberRow,
  type NewsRow,
  type ProjectRow,
  type StatRow,
} from "@/lib/admin";
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

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
      <h2 className="text-lg font-bold text-brand-deep">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
      {children}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <p className="text-sm text-muted-foreground">{label}</p>;
}

function AdminDashboard() {
  const { user, loading } = useSession();
  const { data: isAdmin, isLoading: checking } = useIsAdmin(user?.id);

  if (loading || (user && checking)) {
    return (
      <SiteLayout>
        <section className="py-24">
          <div className="mx-auto max-w-3xl space-y-4 px-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-40 w-full" />
          </div>
        </section>
      </SiteLayout>
    );
  }

  if (!user || !isAdmin) {
    return (
      <SiteLayout>
        <PageHero
          eyebrow="Restricted"
          title="Administrator access only"
          body="This control centre is reserved for the GCN 09 Set executive and site administrators."
          image={heroImage}
          imageAlt="GCN 09 Set alumni gathering"
        />
        <section className="py-16">
          <div className="mx-auto max-w-xl px-4 text-center">
            <p className="text-muted-foreground">
              {user
                ? "Your account does not have administrator privileges. Contact the President or Secretary if you believe this is an error."
                : "Please sign in with an administrator account to continue."}
            </p>
            <Button asChild size="lg" className="mt-6 rounded-full">
              <Link to={user ? "/member/dashboard" : "/admin-login"}>
                {user ? "Go to my dashboard" : "Sign in"}
              </Link>
            </Button>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Control centre"
        title="Admin Dashboard"
        body="Approve members, publish events and news, track projects, and manage the association inbox."
        image={heroImage}
        imageAlt="GCN 09 Set alumni gathering"
      />
      <section className="bg-gradient-surface py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Overview />
          <Tabs defaultValue="members" className="mt-10">
            <TabsList className="flex h-auto flex-wrap justify-start gap-1">
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="stats">Impact stats</TabsTrigger>
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
            </TabsList>
            <TabsContent value="members" className="mt-6">
              <MembersPanel />
            </TabsContent>
            <TabsContent value="events" className="mt-6">
              <EventsPanel />
            </TabsContent>
            <TabsContent value="news" className="mt-6">
              <NewsPanel />
            </TabsContent>
            <TabsContent value="projects" className="mt-6">
              <ProjectsPanel />
            </TabsContent>
            <TabsContent value="announcements" className="mt-6">
              <AnnouncementsPanel />
            </TabsContent>
            <TabsContent value="stats" className="mt-6">
              <StatsPanel />
            </TabsContent>
            <TabsContent value="inbox" className="mt-6">
              <InboxPanel />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </SiteLayout>
  );
}

function Overview() {
  const { data } = useAdminOverview();
  const cards = [
    { label: "Total members", value: data?.members },
    { label: "Pending approval", value: data?.pending },
    { label: "Active members", value: data?.active },
    { label: "Events", value: data?.events },
    { label: "News posts", value: data?.news },
    { label: "Projects", value: data?.projects },
    { label: "Pledges", value: data?.pledges },
    { label: "Messages", value: data?.messages },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {card.label}
          </p>
          <p className="mt-2 text-3xl font-bold text-brand-deep">
            {card.value === undefined ? "—" : card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function MembersPanel() {
  const { data, isLoading } = useAdminList("members", "created_at", false);
  const update = useAdminUpdate("members");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const members = (data ?? []) as MemberRow[];
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return members.filter((m) => {
      if (status !== "all" && m.status !== status) return false;
      if (!term) return true;
      return [m.first_name, m.last_name, m.email, m.membership_id, m.profession]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term));
    });
  }, [members, search, status]);

  return (
    <Panel
      title="Membership register"
      description="Approve applications, suspend accounts and choose alumni spotlights."
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search name, email or membership ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {MEMBER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-5 space-y-3">
        {isLoading ? <Skeleton className="h-24 w-full" /> : null}
        {!isLoading && filtered.length === 0 ? <Empty label="No members found." /> : null}
        {filtered.map((m) => (
          <Row key={m.id}>
            <div className="min-w-0">
              <p className="font-semibold text-brand-deep">
                {m.first_name} {m.last_name}{" "}
                <span className="font-mono text-xs text-muted-foreground">{m.membership_id}</span>
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {m.email}
                {m.phone ? ` · ${m.phone}` : ""}
                {m.profession ? ` · ${m.profession}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                Spotlight
                <Switch
                  checked={m.is_spotlight}
                  onCheckedChange={(checked) =>
                    update.mutate({ id: m.id, values: { is_spotlight: checked } })
                  }
                />
              </label>
              <Select
                value={m.status}
                onValueChange={(value) => update.mutate({ id: m.id, values: { status: value } })}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEMBER_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Row>
        ))}
      </div>
    </Panel>
  );
}

function EventsPanel() {
  const { data, isLoading } = useAdminList("events", "event_date", true);
  const insert = useAdminInsert("events");
  const update = useAdminUpdate("events");
  const remove = useAdminDelete("events");
  const [form, setForm] = useState({
    title: "",
    category: "Alumni Reunion",
    event_date: "",
    event_time: "",
    venue: "",
    description: "",
  });
  const events = (data ?? []) as EventRow[];

  return (
    <div className="space-y-6">
      <Panel title="Create an event" description="Published events appear on the Events page.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Title</Label>
            <Input
              className="mt-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Category</Label>
            <Input
              className="mt-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div>
            <Label>Venue</Label>
            <Input
              className="mt-2"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
            />
          </div>
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              className="mt-2"
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
            />
          </div>
          <div>
            <Label>Time</Label>
            <Input
              className="mt-2"
              placeholder="10:00 AM"
              value={form.event_time}
              onChange={(e) => setForm({ ...form, event_time: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Textarea
              className="mt-2"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>
        <Button
          className="mt-5 rounded-full"
          disabled={!form.title.trim() || insert.isPending}
          onClick={() =>
            insert.mutate(
              {
                title: form.title.trim(),
                slug: slugify(form.title),
                category: form.category || "Alumni Reunion",
                event_date: form.event_date || null,
                event_time: form.event_time || null,
                venue: form.venue || null,
                description: form.description || null,
              },
              {
                onSuccess: () =>
                  setForm({
                    title: "",
                    category: "Alumni Reunion",
                    event_date: "",
                    event_time: "",
                    venue: "",
                    description: "",
                  }),
              },
            )
          }
        >
          Publish event
        </Button>
      </Panel>

      <Panel title="All events">
        <div className="space-y-3">
          {isLoading ? <Skeleton className="h-24 w-full" /> : null}
          {!isLoading && events.length === 0 ? <Empty label="No events yet." /> : null}
          {events.map((ev) => (
            <Row key={ev.id}>
              <div className="min-w-0">
                <p className="font-semibold text-brand-deep">{ev.title}</p>
                <p className="text-sm text-muted-foreground">
                  {ev.event_date ?? "Date TBC"} · {ev.venue ?? "Venue TBC"} · {ev.category}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  Published
                  <Switch
                    checked={ev.is_published}
                    onCheckedChange={(checked) =>
                      update.mutate({ id: ev.id, values: { is_published: checked } })
                    }
                  />
                </label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  Registration
                  <Switch
                    checked={ev.registration_open}
                    onCheckedChange={(checked) =>
                      update.mutate({ id: ev.id, values: { registration_open: checked } })
                    }
                  />
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => remove.mutate(ev.id)}
                >
                  Delete
                </Button>
              </div>
            </Row>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function NewsPanel() {
  const { data, isLoading } = useAdminList("news_posts", "published_at", false);
  const insert = useAdminInsert("news_posts");
  const update = useAdminUpdate("news_posts");
  const remove = useAdminDelete("news_posts");
  const [form, setForm] = useState({
    title: "",
    category: "Alumni News",
    author: "",
    excerpt: "",
    content: "",
  });
  const posts = (data ?? []) as NewsRow[];

  return (
    <div className="space-y-6">
      <Panel title="Write a news post">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Headline</Label>
            <Input
              className="mt-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Category</Label>
            <Input
              className="mt-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div>
            <Label>Author</Label>
            <Input
              className="mt-2"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Excerpt</Label>
            <Textarea
              className="mt-2"
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Full story</Label>
            <Textarea
              className="mt-2"
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </div>
        </div>
        <Button
          className="mt-5 rounded-full"
          disabled={!form.title.trim() || insert.isPending}
          onClick={() =>
            insert.mutate(
              {
                title: form.title.trim(),
                slug: slugify(form.title),
                category: form.category || "Alumni News",
                author: form.author || null,
                excerpt: form.excerpt || null,
                content: form.content || null,
                published_at: new Date().toISOString().slice(0, 10),
              },
              {
                onSuccess: () =>
                  setForm({
                    title: "",
                    category: "Alumni News",
                    author: "",
                    excerpt: "",
                    content: "",
                  }),
              },
            )
          }
        >
          Publish post
        </Button>
      </Panel>

      <Panel title="All posts">
        <div className="space-y-3">
          {isLoading ? <Skeleton className="h-24 w-full" /> : null}
          {!isLoading && posts.length === 0 ? <Empty label="No posts yet." /> : null}
          {posts.map((post) => (
            <Row key={post.id}>
              <div className="min-w-0">
                <p className="font-semibold text-brand-deep">{post.title}</p>
                <p className="text-sm text-muted-foreground">
                  {post.published_at ?? "Unscheduled"} · {post.category}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  Published
                  <Switch
                    checked={post.is_published}
                    onCheckedChange={(checked) =>
                      update.mutate({ id: post.id, values: { is_published: checked } })
                    }
                  />
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => remove.mutate(post.id)}
                >
                  Delete
                </Button>
              </div>
            </Row>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ProjectsPanel() {
  const { data, isLoading } = useAdminList("projects", "project_date", false);
  const insert = useAdminInsert("projects");
  const update = useAdminUpdate("projects");
  const remove = useAdminDelete("projects");
  const [form, setForm] = useState({
    title: "",
    category: "Education",
    status: "Upcoming",
    location: "",
    summary: "",
  });
  const projects = (data ?? []) as ProjectRow[];

  return (
    <div className="space-y-6">
      <Panel title="Add a project">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Title</Label>
            <Input
              className="mt-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Category</Label>
            <Input
              className="mt-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Upcoming", "Ongoing", "Completed"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label>Location</Label>
            <Input
              className="mt-2"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Summary</Label>
            <Textarea
              className="mt-2"
              rows={3}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </div>
        </div>
        <Button
          className="mt-5 rounded-full"
          disabled={!form.title.trim() || insert.isPending}
          onClick={() =>
            insert.mutate(
              {
                title: form.title.trim(),
                slug: slugify(form.title),
                category: form.category || "Education",
                status: form.status,
                location: form.location || null,
                summary: form.summary || null,
              },
              {
                onSuccess: () =>
                  setForm({
                    title: "",
                    category: "Education",
                    status: "Upcoming",
                    location: "",
                    summary: "",
                  }),
              },
            )
          }
        >
          Save project
        </Button>
      </Panel>

      <Panel title="All projects">
        <div className="space-y-3">
          {isLoading ? <Skeleton className="h-24 w-full" /> : null}
          {!isLoading && projects.length === 0 ? <Empty label="No projects yet." /> : null}
          {projects.map((p) => (
            <Row key={p.id}>
              <div className="min-w-0">
                <p className="font-semibold text-brand-deep">{p.title}</p>
                <p className="text-sm text-muted-foreground">
                  {p.category} · {p.location ?? "Location TBC"}{" "}
                  <Badge variant="secondary" className="ml-1">
                    {p.status}
                  </Badge>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  Featured
                  <Switch
                    checked={p.is_featured}
                    onCheckedChange={(checked) =>
                      update.mutate({ id: p.id, values: { is_featured: checked } })
                    }
                  />
                </label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  Published
                  <Switch
                    checked={p.is_published}
                    onCheckedChange={(checked) =>
                      update.mutate({ id: p.id, values: { is_published: checked } })
                    }
                  />
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => remove.mutate(p.id)}
                >
                  Delete
                </Button>
              </div>
            </Row>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function AnnouncementsPanel() {
  const { data, isLoading } = useAdminList("announcements", "created_at", false);
  const insert = useAdminInsert("announcements");
  const update = useAdminUpdate("announcements");
  const remove = useAdminDelete("announcements");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const items = (data ?? []) as AnnouncementRow[];

  return (
    <div className="space-y-6">
      <Panel
        title="Post an announcement"
        description="Announcements are visible to signed-in members."
      >
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input className="mt-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Message</Label>
            <Textarea
              className="mt-2"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </div>
        <Button
          className="mt-5 rounded-full"
          disabled={!title.trim() || insert.isPending}
          onClick={() =>
            insert.mutate(
              { title: title.trim(), body: body || null },
              {
                onSuccess: () => {
                  setTitle("");
                  setBody("");
                },
              },
            )
          }
        >
          Send announcement
        </Button>
      </Panel>

      <Panel title="Announcement history">
        <div className="space-y-3">
          {isLoading ? <Skeleton className="h-20 w-full" /> : null}
          {!isLoading && items.length === 0 ? <Empty label="No announcements yet." /> : null}
          {items.map((a) => (
            <Row key={a.id}>
              <div className="min-w-0">
                <p className="font-semibold text-brand-deep">{a.title}</p>
                <p className="text-sm text-muted-foreground">{a.body}</p>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  Published
                  <Switch
                    checked={a.is_published}
                    onCheckedChange={(checked) =>
                      update.mutate({ id: a.id, values: { is_published: checked } })
                    }
                  />
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => remove.mutate(a.id)}
                >
                  Delete
                </Button>
              </div>
            </Row>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function StatsPanel() {
  const { data, isLoading } = useAdminList("impact_stats", "sort_order", true);
  const update = useAdminUpdate("impact_stats");
  const stats = (data ?? []) as StatRow[];

  return (
    <Panel title="Impact counters" description="These numbers power the homepage impact section.">
      <div className="space-y-3">
        {isLoading ? <Skeleton className="h-20 w-full" /> : null}
        {!isLoading && stats.length === 0 ? <Empty label="No stats configured." /> : null}
        {stats.map((s) => (
          <Row key={s.id}>
            <p className="font-semibold text-brand-deep">{s.label}</p>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                defaultValue={String(s.value)}
                className="w-32"
                onBlur={(e) => {
                  const next = Number(e.target.value);
                  if (!Number.isNaN(next) && next !== Number(s.value)) {
                    update.mutate({ id: s.id, values: { value: next } });
                  }
                }}
              />
              <span className="text-sm text-muted-foreground">{s.suffix ?? ""}</span>
            </div>
          </Row>
        ))}
      </div>
    </Panel>
  );
}

function InboxPanel() {
  const messages = useAdminList("contact_messages", "created_at", false);
  const pledges = useAdminList("support_pledges", "created_at", false);
  const volunteers = useAdminList("volunteer_applications", "created_at", false);

  return (
    <div className="space-y-6">
      <Panel title="Contact messages">
        <div className="space-y-3">
          {(messages.data ?? []).length === 0 ? <Empty label="Inbox is empty." /> : null}
          {(messages.data ?? []).map((m) => (
            <div key={m.id} className="rounded-2xl border border-border/70 bg-background p-4">
              <p className="font-semibold text-brand-deep">
                {m.subject ?? "No subject"}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  {new Date(m.created_at).toLocaleDateString()}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                {m.name} · {m.email}
                {m.phone ? ` · ${m.phone}` : ""}
              </p>
              <p className="mt-2 text-sm">{m.message}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Support pledges">
        <div className="space-y-3">
          {(pledges.data ?? []).length === 0 ? <Empty label="No pledges yet." /> : null}
          {(pledges.data ?? []).map((p) => (
            <Row key={p.id}>
              <div>
                <p className="font-semibold text-brand-deep">{p.name ?? "Anonymous"}</p>
                <p className="text-sm text-muted-foreground">
                  {p.cause} · {p.email ?? "no email"}
                  {p.phone ? ` · ${p.phone}` : ""}
                </p>
              </div>
              <Badge variant="secondary">
                {p.currency} {p.amount ?? "—"} · {p.status}
              </Badge>
            </Row>
          ))}
        </div>
      </Panel>

      <Panel title="Volunteer applications">
        <div className="space-y-3">
          {(volunteers.data ?? []).length === 0 ? <Empty label="No applications yet." /> : null}
          {(volunteers.data ?? []).map((v) => (
            <div key={v.id} className="rounded-2xl border border-border/70 bg-background p-4">
              <p className="font-semibold text-brand-deep">{v.name}</p>
              <p className="text-sm text-muted-foreground">
                {v.email}
                {v.phone ? ` · ${v.phone}` : ""} · {v.interest_area ?? "Any area"}
              </p>
              {v.skills ? <p className="mt-2 text-sm">Skills: {v.skills}</p> : null}
              {v.availability ? (
                <p className="text-sm text-muted-foreground">Availability: {v.availability}</p>
              ) : null}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
