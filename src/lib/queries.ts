import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProjects(opts?: { featured?: boolean; limit?: number }) {
  return useQuery({
    queryKey: ["projects", opts],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("project_date", { ascending: false, nullsFirst: false });
      if (opts?.featured) query = query.eq("is_featured", true);
      if (opts?.limit) query = query.limit(opts.limit);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useEvents(limit?: number) {
  return useQuery({
    queryKey: ["events", limit],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .order("event_date", { ascending: true, nullsFirst: false });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useNews(limit?: number) {
  return useQuery({
    queryKey: ["news", limit],
    queryFn: async () => {
      let query = supabase
        .from("news_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false, nullsFirst: false });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useNewsPost(slug: string) {
  return useQuery({
    queryKey: ["news-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useStats() {
  return useQuery({
    queryKey: ["impact-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("impact_stats")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useSpotlights() {
  return useQuery({
    queryKey: ["spotlights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select(
          "id, first_name, last_name, preferred_name, photo_url, profession, organisation, city, state, country, spotlight_bio, spotlight_achievement, spotlight_contribution",
        )
        .eq("is_spotlight", true)
        .eq("status", "active");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useGallery() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const [albums, images] = await Promise.all([
        supabase.from("gallery_albums").select("*").order("created_at", { ascending: false }),
        supabase.from("gallery_images").select("*").order("created_at", { ascending: false }),
      ]);
      if (albums.error) throw albums.error;
      if (images.error) throw images.error;
      return { albums: albums.data ?? [], images: images.data ?? [] };
    },
  });
}
