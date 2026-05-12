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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bids: {
        Row: {
          amount: number
          created_at: string
          eta_hours: number | null
          id: string
          notes: string | null
          provider_id: string
          request_service_id: string
          status: Database["public"]["Enums"]["bid_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          eta_hours?: number | null
          id?: string
          notes?: string | null
          provider_id: string
          request_service_id: string
          status?: Database["public"]["Enums"]["bid_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          eta_hours?: number | null
          id?: string
          notes?: string | null
          provider_id?: string
          request_service_id?: string
          status?: Database["public"]["Enums"]["bid_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_request_service_id_fkey"
            columns: ["request_service_id"]
            isOneToOne: false
            referencedRelation: "request_services"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          created_at: string
          customer_id: string
          description: string | null
          id: string
          request_id: string | null
          resolution: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          description?: string | null
          id?: string
          request_id?: string | null
          resolution?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          description?: string | null
          id?: string
          request_id?: string | null
          resolution?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          read_at: string | null
          recipient_id: string
          request_id: string
          sender_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id: string
          request_id: string
          sender_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string
          request_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      provider_services: {
        Row: {
          base_price: number | null
          id: string
          provider_id: string
          service_id: string
        }
        Insert: {
          base_price?: number | null
          id?: string
          provider_id: string
          service_id: string
        }
        Update: {
          base_price?: number | null
          id?: string
          provider_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          business_name: string
          created_at: string
          description: string | null
          id: string
          jobs_completed: number
          phone: string | null
          rating: number
          review_count: number
          service_area: string | null
          status: Database["public"]["Enums"]["provider_status"]
          updated_at: string
          wallet_balance: number
        }
        Insert: {
          business_name: string
          created_at?: string
          description?: string | null
          id: string
          jobs_completed?: number
          phone?: string | null
          rating?: number
          review_count?: number
          service_area?: string | null
          status?: Database["public"]["Enums"]["provider_status"]
          updated_at?: string
          wallet_balance?: number
        }
        Update: {
          business_name?: string
          created_at?: string
          description?: string | null
          id?: string
          jobs_completed?: number
          phone?: string | null
          rating?: number
          review_count?: number
          service_area?: string | null
          status?: Database["public"]["Enums"]["provider_status"]
          updated_at?: string
          wallet_balance?: number
        }
        Relationships: []
      }
      request_services: {
        Row: {
          awarded_bid_id: string | null
          created_at: string
          id: string
          job_status: Database["public"]["Enums"]["job_status"] | null
          request_id: string
          service_id: string
        }
        Insert: {
          awarded_bid_id?: string | null
          created_at?: string
          id?: string
          job_status?: Database["public"]["Enums"]["job_status"] | null
          request_id: string
          service_id: string
        }
        Update: {
          awarded_bid_id?: string | null
          created_at?: string
          id?: string
          job_status?: Database["public"]["Enums"]["job_status"] | null
          request_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_services_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          location: string
          notes: string | null
          preferred_date: string | null
          preferred_time: string | null
          property_size: string | null
          rooms: number | null
          status: Database["public"]["Enums"]["request_status"]
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          location: string
          notes?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          property_size?: string | null
          rooms?: number | null
          status?: Database["public"]["Enums"]["request_status"]
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          location?: string
          notes?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          property_size?: string | null
          rooms?: number | null
          status?: Database["public"]["Enums"]["request_status"]
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          customer_id: string
          id: string
          professionalism: number
          provider_id: string
          quality: number
          request_service_id: string
          timeliness: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_id: string
          id?: string
          professionalism: number
          provider_id: string
          quality: number
          request_service_id: string
          timeliness: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          professionalism?: number
          provider_id?: string
          quality?: number
          request_service_id?: string
          timeliness?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_request_service_id_fkey"
            columns: ["request_service_id"]
            isOneToOne: false
            referencedRelation: "request_services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
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
      app_role: "customer" | "provider" | "admin"
      bid_status: "pending" | "accepted" | "rejected" | "withdrawn"
      job_status:
        | "confirmed"
        | "on_the_way"
        | "started"
        | "completed"
        | "cancelled"
      provider_status: "pending" | "approved" | "rejected" | "suspended"
      request_status:
        | "open"
        | "awarded"
        | "in_progress"
        | "completed"
        | "cancelled"
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
      app_role: ["customer", "provider", "admin"],
      bid_status: ["pending", "accepted", "rejected", "withdrawn"],
      job_status: [
        "confirmed",
        "on_the_way",
        "started",
        "completed",
        "cancelled",
      ],
      provider_status: ["pending", "approved", "rejected", "suspended"],
      request_status: [
        "open",
        "awarded",
        "in_progress",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
