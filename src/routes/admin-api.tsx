import { createServerFn } from "@tanstack/react-start";
import { isAdminLoggedIn } from "@/lib/admin-auth";

async function getAdminClient() {
  const { supabaseAdmin } = await import(
    "@/integrations/supabase/client.server"
  );
  return supabaseAdmin;
}

function requireAdmin() {
  if (typeof window !== "undefined" && !isAdminLoggedIn()) {
    throw new Error("Unauthorized");
  }
}

export const adminList = createServerFn({ method: "GET" })
  .validator((data: { table: string; order?: string; ascending?: boolean }) => data)
  .handler(async ({ data }) => {
    requireAdmin();
    const supabase = await getAdminClient();
    const { table, order = "created_at", ascending = false } = data;
    const { data: rows, error } = await supabase
      .from(table as never)
      .select("*")
      .order(order, { ascending, nullsFirst: false });
    if (error) throw error;
    return rows ?? [];
  });

export const adminOverview = createServerFn({ method: "GET" }).handler(
  async () => {
    requireAdmin();
    const supabase = await getAdminClient();
    const count = async (table: string, filter?: { column: string; value: string }) => {
      let q = supabase.from(table as never).select("id", { count: "exact", head: true });
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
);

export const adminInsert = createServerFn({ method: "POST" })
  .validator((data: { table: string; values: Record<string, unknown> }) => data)
  .handler(async ({ data }) => {
    requireAdmin();
    const supabase = await getAdminClient();
    const { error } = await supabase
      .from(data.table as never)
      .insert(data.values as never);
    if (error) throw error;
  });

export const adminUpdate = createServerFn({ method: "POST" })
  .validator(
    (data: { table: string; id: string; values: Record<string, unknown> }) => data,
  )
  .handler(async ({ data }) => {
    requireAdmin();
    const supabase = await getAdminClient();
    const { error } = await supabase
      .from(data.table as never)
      .update(data.values as never)
      .eq("id", data.id);
    if (error) throw error;
  });

export const adminDelete = createServerFn({ method: "POST" })
  .validator((data: { table: string; id: string }) => data)
  .handler(async ({ data }) => {
    requireAdmin();
    const supabase = await getAdminClient();
    const { error } = await supabase
      .from(data.table as never)
      .delete()
      .eq("id", data.id);
    if (error) throw error;
  });
