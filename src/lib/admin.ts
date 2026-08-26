import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];
export type AdminTable = keyof Tables;

export type MemberRow = Tables["members"]["Row"];
export type EventRow = Tables["events"]["Row"];
export type NewsRow = Tables["news_posts"]["Row"];
export type ProjectRow = Tables["projects"]["Row"];
export type AnnouncementRow = Tables["announcements"]["Row"];
export type StatRow = Tables["impact_stats"]["Row"];

/** Generic admin list query — RLS restricts these reads to admins. */
export function useAdminList<T extends AdminTable>(
  table: T,
  orderColumn = "created_at",
  ascending = false,
) {
  return useQuery({
    queryKey: ["admin", table, orderColumn, ascending],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order(orderColumn, { ascending, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as unknown as Tables[T]["Row"][];
    },
  });
}

function invalidate(qc: ReturnType<typeof useQueryClient>, table: AdminTable) {
  void qc.invalidateQueries({ queryKey: ["admin", table] });
  void qc.invalidateQueries({ queryKey: ["projects"] });
  void qc.invalidateQueries({ queryKey: ["events"] });
  void qc.invalidateQueries({ queryKey: ["news"] });
  void qc.invalidateQueries({ queryKey: ["impact-stats"] });
  void qc.invalidateQueries({ queryKey: ["spotlights"] });
}

export function useAdminUpdate<T extends AdminTable>(table: T, idColumn = "id") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const { error } = await supabase
        .from(table)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .update(values as any)
        .eq(idColumn as never, id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate(qc, table);
      toast.success("Saved.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useAdminInsert<T extends AdminTable>(table: T) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { error } = await supabase
        .from(table)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(values as any);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate(qc, table);
      toast.success("Created.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useAdminDelete<T extends AdminTable>(table: T, idColumn = "id") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq(idColumn as never, id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate(qc, table);
      toast.success("Deleted.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const count = async (table: AdminTable, filter?: { column: string; value: string }) => {
        let q = supabase.from(table).select("id", { count: "exact", head: true });
        if (filter) q = q.eq(filter.column, filter.value);
        const { count: c, error } = await q;
        if (error) throw error;
        return c ?? 0;
      };
      const [members, pending, active, events, news, projects, pledges, messages, volunteers] =
        await Promise.all([
          count("members"),
          count("members", { column: "status", value: "pending" }),
          count("members", { column: "status", value: "active" }),
          count("events"),
          count("news_posts"),
          count("projects"),
          count("support_pledges"),
          count("contact_messages"),
          count("volunteer_applications"),
        ]);
      return { members, pending, active, events, news, projects, pledges, messages, volunteers };
    },
  });
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
