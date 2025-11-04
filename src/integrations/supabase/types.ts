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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          admin_role: Database["public"]["Enums"]["admin_role"]
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_role?: Database["public"]["Enums"]["admin_role"]
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_role?: Database["public"]["Enums"]["admin_role"]
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_request_items: {
        Row: {
          collection_request_id: string | null
          created_at: string | null
          e_waste_item_id: string | null
          id: string
        }
        Insert: {
          collection_request_id?: string | null
          created_at?: string | null
          e_waste_item_id?: string | null
          id?: string
        }
        Update: {
          collection_request_id?: string | null
          created_at?: string | null
          e_waste_item_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_request_items_collection_request_id_fkey"
            columns: ["collection_request_id"]
            isOneToOne: false
            referencedRelation: "collection_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_request_items_e_waste_item_id_fkey"
            columns: ["e_waste_item_id"]
            isOneToOne: false
            referencedRelation: "e_waste_items"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_requests: {
        Row: {
          address: string
          city: string
          created_at: string | null
          id: string
          notes: string | null
          postal_code: string
          scheduled_date: string | null
          state: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          id?: string
          notes?: string | null
          postal_code: string
          scheduled_date?: string | null
          state: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          postal_code?: string
          scheduled_date?: string | null
          state?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      dumping_reports: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          latitude: number | null
          location: string
          longitude: number | null
          recommendations: string | null
          severity: string
          status: string
          updated_at: string
          user_id: string | null
          waste_type: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          location: string
          longitude?: number | null
          recommendations?: string | null
          severity: string
          status?: string
          updated_at?: string
          user_id?: string | null
          waste_type: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          recommendations?: string | null
          severity?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          waste_type?: string
        }
        Relationships: []
      }
      e_waste_items: {
        Row: {
          category: string
          condition: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          status: string | null
          updated_at: string | null
          user_id: string | null
          weight: number | null
        }
        Insert: {
          category: string
          condition: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          weight?: number | null
        }
        Update: {
          category?: string
          condition?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      marketplace_listings: {
        Row: {
          condition: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          is_free: boolean
          location: string
          price: number
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          condition: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_free?: boolean
          location: string
          price?: number
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          condition?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_free?: boolean
          location?: string
          price?: number
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      password_reset_otps: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          otp: string
          used: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          otp: string
          used?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          otp?: string
          used?: boolean | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          payment_intent_id: string | null
          payment_method: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          payment_intent_id?: string | null
          payment_method?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          payment_intent_id?: string | null
          payment_method?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          eco_points: number | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          eco_points?: number | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          eco_points?: number | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      wallet_balances: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string
          id: string
          payment_intent_id: string | null
          payment_method: string | null
          status: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description: string
          id?: string
          payment_intent_id?: string | null
          payment_method?: string | null
          status?: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string
          id?: string
          payment_intent_id?: string | null
          payment_method?: string | null
          status?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_eco_points: {
        Args: { points: number; user_id: string }
        Returns: undefined
      }
      get_admin_analytics: {
        Args: never
        Returns: {
          description: string
          metric: string
          value: number
        }[]
      }
      get_admin_role: {
        Args: { user_id?: string }
        Returns: Database["public"]["Enums"]["admin_role"]
      }
      get_realtime_stats: { Args: never; Returns: Json }
      initialize_first_admin: { Args: { user_email: string }; Returns: boolean }
      is_admin: { Args: { user_id?: string }; Returns: boolean }
      verify_sufficient_balance: {
        Args: { amount: number; currency?: string; user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "moderator"
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
      admin_role: ["super_admin", "admin", "moderator"],
    },
  },
} as const
