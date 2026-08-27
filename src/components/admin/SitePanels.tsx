import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminDelete, useAdminInsert, useAdminList, useAdminUpdate } from "@/lib/admin";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];
type AlbumRow = Tables["gallery_albums"]["Row"];
type ImageRow = Tables["gallery_images"]["Row"];
type ContentRow = Tables["site_content"]["Row"];
type RegistrationRow = Tables["event_registrations"]["Row"];
type EventRow = Tables["events"]["Row"];
type MemberRow = Tables["members"]["Row"];
type RoleRow = Tables["user_roles"]["Row"];

export function Panel({
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

/* ------------------------------------------------------------------ Gallery */

export function GalleryPanel() {
  const albums = useAdminList("gallery_albums", "created_at", false);
  const images = useAdminList("gallery_images", "created_at", false);
  const insertAlbum = useAdminInsert("gallery_albums");
  const removeAlbum = useAdminDelete("gallery_albums");
  const insertImage = useAdminInsert("gallery_images");
  const removeImage = useAdminDelete("gallery_images");

  const [album, setAlbum] = useState({ title: "", description: "", cover_url: "" });
  const [image, setImage] = useState({ album_id: "", image_url: "", caption: "" });

  const albumRows = (albums.data ?? []) as AlbumRow[];
  const imageRows = (images.data ?? []) as ImageRow[];

  return (
    <div className="space-y-6">
      <Panel title="Create an album" description="Albums group photographs on the Gallery page.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Album title</Label>
            <Input
              className="mt-2"
              value={album.title}
              onChange={(e) => setAlbum({ ...album, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Cover image URL</Label>
            <Input
              className="mt-2"
              placeholder="https://…"
              value={album.cover_url}
              onChange={(e) => setAlbum({ ...album, cover_url: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Textarea
              className="mt-2"
              rows={2}
              value={album.description}
              onChange={(e) => setAlbum({ ...album, description: e.target.value })}
            />
          </div>
        </div>
        <Button
          className="mt-5 rounded-full"
          disabled={!album.title.trim() || insertAlbum.isPending}
          onClick={() =>
            insertAlbum.mutate(
              {
                title: album.title.trim(),
                description: album.description || null,
                cover_url: album.cover_url || null,
              },
              { onSuccess: () => setAlbum({ title: "", description: "", cover_url: "" }) },
            )
          }
        >
          Create album
        </Button>
      </Panel>

      <Panel title="Add a photograph">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Album</Label>
            <Select
              value={image.album_id}
              onValueChange={(value) => setImage({ ...image, album_id: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select album" />
              </SelectTrigger>
              <SelectContent>
                {albumRows.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Image URL</Label>
            <Input
              className="mt-2"
              placeholder="https://…"
              value={image.image_url}
              onChange={(e) => setImage({ ...image, image_url: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Caption</Label>
            <Input
              className="mt-2"
              value={image.caption}
              onChange={(e) => setImage({ ...image, caption: e.target.value })}
            />
          </div>
        </div>
        <Button
          className="mt-5 rounded-full"
          disabled={!image.image_url.trim() || insertImage.isPending}
          onClick={() =>
            insertImage.mutate(
              {
                album_id: image.album_id || null,
                image_url: image.image_url.trim(),
                caption: image.caption || null,
              },
              { onSuccess: () => setImage({ album_id: image.album_id, image_url: "", caption: "" }) },
            )
          }
        >
          Add photograph
        </Button>
      </Panel>

      <Panel title="Albums & photographs">
        <div className="space-y-6">
          {albums.isLoading ? <Skeleton className="h-24 w-full" /> : null}
          {!albums.isLoading && albumRows.length === 0 ? <Empty label="No albums yet." /> : null}
          {albumRows.map((a) => {
            const photos = imageRows.filter((img) => img.album_id === a.id);
            return (
              <div key={a.id} className="space-y-3">
                <Row>
                  <div className="min-w-0">
                    <p className="font-semibold text-brand-deep">{a.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {photos.length} photograph{photos.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => removeAlbum.mutate(a.id)}
                  >
                    Delete album
                  </Button>
                </Row>
                {photos.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {photos.map((img) => (
                      <div
                        key={img.id}
                        className="overflow-hidden rounded-2xl border border-border/70 bg-background"
                      >
                        <img
                          src={img.image_url}
                          alt={img.caption ?? a.title}
                          loading="lazy"
                          className="h-32 w-full object-cover"
                        />
                        <div className="space-y-2 p-3">
                          <p className="truncate text-xs text-muted-foreground">
                            {img.caption ?? "No caption"}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 rounded-full px-3 text-xs"
                            onClick={() => removeImage.mutate(img.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------- Site content */

export function SiteContentPanel() {
  const { data, isLoading } = useAdminList("site_content", "label", true);
  const update = useAdminUpdate("site_content", "key");
  const insert = useAdminInsert("site_content");
  const remove = useAdminDelete("site_content", "key");

  const rows = (data ?? []) as ContentRow[];
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [next, setNext] = useState({ key: "", label: "", value: "" });

  return (
    <div className="space-y-6">
      <Panel
        title="Editable site text"
        description="Change headlines, contact details and page copy used across the website."
      >
        <div className="space-y-3">
          {isLoading ? <Skeleton className="h-24 w-full" /> : null}
          {!isLoading && rows.length === 0 ? <Empty label="No content entries yet." /> : null}
          {rows.map((row) => {
            const draft = drafts[row.key] ?? row.value ?? "";
            return (
              <div
                key={row.key}
                className="rounded-2xl border border-border/70 bg-background p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-brand-deep">{row.label}</p>
                    <p className="font-mono text-xs text-muted-foreground">{row.key}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => remove.mutate(row.key)}
                  >
                    Delete
                  </Button>
                </div>
                <Textarea
                  className="mt-3"
                  rows={draft.length > 90 ? 4 : 2}
                  value={draft}
                  onChange={(e) => setDrafts({ ...drafts, [row.key]: e.target.value })}
                />
                <Button
                  size="sm"
                  className="mt-3 rounded-full"
                  disabled={draft === (row.value ?? "")}
                  onClick={() => update.mutate({ id: row.key, values: { value: draft } })}
                >
                  Save
                </Button>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="Add a content entry">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Key</Label>
            <Input
              className="mt-2"
              placeholder="home_hero_title"
              value={next.key}
              onChange={(e) => setNext({ ...next, key: e.target.value })}
            />
          </div>
          <div>
            <Label>Label</Label>
            <Input
              className="mt-2"
              placeholder="Home hero title"
              value={next.label}
              onChange={(e) => setNext({ ...next, label: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Value</Label>
            <Textarea
              className="mt-2"
              rows={2}
              value={next.value}
              onChange={(e) => setNext({ ...next, value: e.target.value })}
            />
          </div>
        </div>
        <Button
          className="mt-5 rounded-full"
          disabled={!next.key.trim() || !next.label.trim() || insert.isPending}
          onClick={() =>
            insert.mutate(
              {
                key: next.key.trim(),
                label: next.label.trim(),
                value: next.value || null,
              },
              { onSuccess: () => setNext({ key: "", label: "", value: "" }) },
            )
          }
        >
          Add entry
        </Button>
      </Panel>
    </div>
  );
}

/* --------------------------------------------------------- Registrations */

export function RegistrationsPanel() {
  const registrations = useAdminList("event_registrations", "created_at", false);
  const events = useAdminList("events", "event_date", true);
  const update = useAdminUpdate("event_registrations");
  const remove = useAdminDelete("event_registrations");
  const [eventId, setEventId] = useState("all");

  const rows = (registrations.data ?? []) as RegistrationRow[];
  const eventRows = (events.data ?? []) as EventRow[];
  const titleFor = (id: string) => eventRows.find((e) => e.id === id)?.title ?? "Unknown event";

  const filtered = useMemo(
    () => (eventId === "all" ? rows : rows.filter((r) => r.event_id === eventId)),
    [rows, eventId],
  );

  return (
    <Panel
      title="Event registrations"
      description="See who registered for each gathering and mark attendance."
    >
      <Select value={eventId} onValueChange={setEventId}>
        <SelectTrigger className="sm:w-72">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All events</SelectItem>
          {eventRows.map((e) => (
            <SelectItem key={e.id} value={e.id}>
              {e.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="mt-5 space-y-3">
        {registrations.isLoading ? <Skeleton className="h-24 w-full" /> : null}
        {!registrations.isLoading && filtered.length === 0 ? (
          <Empty label="No registrations yet." />
        ) : null}
        {filtered.map((r) => (
          <Row key={r.id}>
            <div className="min-w-0">
              <p className="font-semibold text-brand-deep">{r.full_name ?? "Member"}</p>
              <p className="truncate text-sm text-muted-foreground">
                {titleFor(r.event_id)}
                {r.email ? ` · ${r.email}` : ""}
                {r.phone ? ` · ${r.phone}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                Attended
                <Switch
                  checked={r.attended}
                  onCheckedChange={(checked) =>
                    update.mutate({ id: r.id, values: { attended: checked } })
                  }
                />
              </label>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => remove.mutate(r.id)}
              >
                Remove
              </Button>
            </div>
          </Row>
        ))}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------- Roles */

export function RolesPanel() {
  const roles = useAdminList("user_roles", "created_at", false);
  const members = useAdminList("members", "created_at", false);
  const insert = useAdminInsert("user_roles");
  const remove = useAdminDelete("user_roles");
  const [userId, setUserId] = useState("");

  const roleRows = (roles.data ?? []) as RoleRow[];
  const memberRows = (members.data ?? []) as MemberRow[];
  const nameFor = (uid: string) => {
    const m = memberRows.find((x) => x.user_id === uid);
    return m ? `${m.first_name} ${m.last_name} · ${m.email}` : uid;
  };
  const admins = roleRows.filter((r) => r.role === "admin");
  const candidates = memberRows.filter((m) => !admins.some((a) => a.user_id === m.user_id));

  return (
    <div className="space-y-6">
      <Panel
        title="Administrators"
        description="Administrators can manage every part of this website. Grant access sparingly."
      >
        <div className="space-y-3">
          {roles.isLoading ? <Skeleton className="h-20 w-full" /> : null}
          {!roles.isLoading && admins.length === 0 ? <Empty label="No administrators." /> : null}
          {admins.map((r) => (
            <Row key={r.id}>
              <p className="min-w-0 truncate font-semibold text-brand-deep">
                {nameFor(r.user_id)}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => remove.mutate(r.id)}
              >
                Revoke admin
              </Button>
            </Row>
          ))}
        </div>
      </Panel>

      <Panel title="Grant administrator access">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Select value={userId} onValueChange={setUserId}>
            <SelectTrigger className="sm:w-96">
              <SelectValue placeholder="Select a member" />
            </SelectTrigger>
            <SelectContent>
              {candidates.map((m) => (
                <SelectItem key={m.id} value={m.user_id}>
                  {m.first_name} {m.last_name} · {m.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="rounded-full"
            disabled={!userId || insert.isPending}
            onClick={() =>
              insert.mutate(
                { user_id: userId, role: "admin" },
                { onSuccess: () => setUserId("") },
              )
            }
          >
            Grant admin
          </Button>
        </div>
      </Panel>
    </div>
  );
}
