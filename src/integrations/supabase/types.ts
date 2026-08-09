export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          attended: boolean
          created_at: string
          email: string | null
          event_id: string
          full_name: string | null
          id: string
          phone: string | null
          user_id: string
        }
        Insert: {
          attended?: boolean
          created_at?: string
          email?: string | null
          event_id: string
          full_name?: string | null
          id?: string
          phone?: string | null
          user_id: string
        }
        Update: {
          attended?: boolean
          created_at?: string
          email?: string | null
          event_id?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string
          created_at: string
          description: string | null
          event_date: string | null
          event_time: string | null
          id: string
          image_url: string | null
          is_published: boolean
          registration_open: boolean
          slug: string
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_time?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          registration_open?: boolean
          slug: string
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_time?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          registration_open?: boolean
          slug?: string
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      gallery_albums: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          title: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          album_id: string | null
          caption: string | null
          created_at: string
          id: string
          image_url: string
        }
        Insert: {
          album_id?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
        }
        Update: {
          album_id?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
        ]
      }
      impact_stats: {
        Row: {
          created_at: string
          id: string
          label: string
          prefix: string | null
          sort_order: number
          suffix: string | null
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          prefix?: string | null
          sort_order?: number
          suffix?: string | null
          updated_at?: string
          value?: number
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          prefix?: string | null
          sort_order?: number
          suffix?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      members: {
        Row: {
          address: string | null
          admin_notes: string | null
          business_name: string | null
          business_website: string | null
          city: string | null
          class_department: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          employment_type: string | null
          first_name: string
          gender: string | null
          graduation_year: string | null
          house: string | null
          id: string
          industry: string | null
          interests: string[]
          is_spotlight: boolean
          job_title: string | null
          last_name: string
          linkedin: string | null
          membership_id: string
          middle_name: string | null
          organisation: string | null
          other_interest: string | null
          phone: string | null
          photo_url: string | null
          preferred_name: string | null
          profession: string | null
          professional_location: string | null
          school_notes: string | null
          set_year: string
          show_email: boolean
          show_in_directory: boolean
          show_organisation: boolean
          show_phone: boolean
          skills: string[]
          spotlight_achievement: string | null
          spotlight_bio: string | null
          spotlight_contribution: string | null
          state: string | null
          status: Database["public"]["Enums"]["membership_status"]
          student_id: string | null
          updated_at: string
          user_id: string
          whatsapp: string | null
          year_joined: string | null
        }
        Insert: {
          address?: string | null
          admin_notes?: string | null
          business_name?: string | null
          business_website?: string | null
          city?: string | null
          class_department?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employment_type?: string | null
          first_name: string
          gender?: string | null
          graduation_year?: string | null
          house?: string | null
          id?: string
          industry?: string | null
          interests?: string[]
          is_spotlight?: boolean
          job_title?: string | null
          last_name: string
          linkedin?: string | null
          membership_id: string
          middle_name?: string | null
          organisation?: string | null
          other_interest?: string | null
          phone?: string | null
          photo_url?: string | null
          preferred_name?: string | null
          profession?: string | null
          professional_location?: string | null
          school_notes?: string | null
          set_year?: string
          show_email?: boolean
          show_in_directory?: boolean
          show_organisation?: boolean
          show_phone?: boolean
          skills?: string[]
          spotlight_achievement?: string | null
          spotlight_bio?: string | null
          spotlight_contribution?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["membership_status"]
          student_id?: string | null
          updated_at?: string
          user_id: string
          whatsapp?: string | null
          year_joined?: string | null
        }
        Update: {
          address?: string | null
          admin_notes?: string | null
          business_name?: string | null
          business_website?: string | null
          city?: string | null
          class_department?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employment_type?: string | null
          first_name?: string
          gender?: string | null
          graduation_year?: string | null
          house?: string | null
          id?: string
          industry?: string | null
          interests?: string[]
          is_spotlight?: boolean
          job_title?: string | null
          last_name?: string
          linkedin?: string | null
          membership_id?: string
          middle_name?: string | null
          organisation?: string | null
          other_interest?: string | null
          phone?: string | null
          photo_url?: string | null
          preferred_name?: string | null
          profession?: string | null
          professional_location?: string | null
          school_notes?: string | null
          set_year?: string
          show_email?: boolean
          show_in_directory?: boolean
          show_organisation?: boolean
          show_phone?: boolean
          skills?: string[]
          spotlight_achievement?: string | null
          spotlight_bio?: string | null
          spotlight_contribution?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["membership_status"]
          student_id?: string | null
          updated_at?: string
          user_id?: string
          whatsapp?: string | null
          year_joined?: string | null
        }
        Relationships: []
      }
      news_posts: {
        Row: {
          author: string | null
          category: string
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          beneficiaries: string | null
          category: string
          created_at: string
          description: string | null
          gallery: string[]
          id: string
          image_url: string | null
          impact: string | null
          is_featured: boolean
          is_published: boolean
          location: string | null
          project_date: string | null
          slug: string
          status: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          beneficiaries?: string | null
          category?: string
          created_at?: string
          description?: string | null
          gallery?: string[]
          id?: string
          image_url?: string | null
          impact?: string | null
          is_featured?: boolean
          is_published?: boolean
          location?: string | null
          project_date?: string | null
          slug: string
          status?: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          beneficiaries?: string | null
          category?: string
          created_at?: string
          description?: string | null
          gallery?: string[]
          id?: string
          image_url?: string | null
          impact?: string | null
          is_featured?: boolean
          is_published?: boolean
          location?: string | null
          project_date?: string | null
          slug?: string
          status?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          key: string
          label: string
          updated_at: string
          value: string | null
        }
        Insert: {
          key: string
          label: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          key?: string
          label?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      support_pledges: {
        Row: {
          amount: number | null
          cause: string
          created_at: string
          currency: string
          email: string | null
          id: string
          message: string | null
          name: string | null
          phone: string | null
          status: string
        }
        Insert: {
          amount?: number | null
          cause?: string
          created_at?: string
          currency?: string
          email?: string | null
          id?: string
          message?: string | null
          name?: string | null
          phone?: string | null
          status?: string
        }
        Update: {
          amount?: number | null
          cause?: string
          created_at?: string
          currency?: string
          email?: string | null
          id?: string
          message?: string | null
          name?: string | null
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      volunteer_applications: {
        Row: {
          availability: string | null
          created_at: string
          email: string
          id: string
          interest_area: string | null
          message: string | null
          name: string
          phone: string | null
          skills: string | null
        }
        Insert: {
          availability?: string | null
          created_at?: string
          email: string
          id?: string
          interest_area?: string | null
          message?: string | null
          name: string
          phone?: string | null
          skills?: string | null
        }
        Update: {
          availability?: string | null
          created_at?: string
          email?: string
          id?: string
          interest_area?: string | null
          message?: string | null
          name?: string
          phone?: string | null
          skills?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "member"
      membership_status: "pending" | "active" | "suspended" | "inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "member"],
      membership_status: ["pending", "active", "suspended", "inactive"],
    },
  },
} as const
