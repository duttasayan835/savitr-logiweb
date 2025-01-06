export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          created_at: string | null
          id: string
          last_login: string | null
          name: string
          role: Database["public"]["Enums"]["admin_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_login?: string | null
          name: string
          role?: Database["public"]["Enums"]["admin_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_login?: string | null
          name?: string
          role?: Database["public"]["Enums"]["admin_role"]
          user_id?: string
        }
        Relationships: []
      }
      consignments: {
        Row: {
          address: string
          consignment_no: string
          created_at: string | null
          expected_delivery_date: string
          id: string
          phone_no: string
          recipient_name: string
          status: string
        }
        Insert: {
          address: string
          consignment_no: string
          created_at?: string | null
          expected_delivery_date: string
          id?: string
          phone_no: string
          recipient_name: string
          status?: string
        }
        Update: {
          address?: string
          consignment_no?: string
          created_at?: string | null
          expected_delivery_date?: string
          id?: string
          phone_no?: string
          recipient_name?: string
          status?: string
        }
        Relationships: []
      }
      delivery_charges: {
        Row: {
          amount: number
          created_at: string | null
          delivery_slot_id: string | null
          id: string
          reason: string | null
          status: string | null
        }
        Insert: {
          amount?: number
          created_at?: string | null
          delivery_slot_id?: string | null
          id?: string
          reason?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          delivery_slot_id?: string | null
          id?: string
          reason?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_charges_delivery_slot_id_fkey"
            columns: ["delivery_slot_id"]
            isOneToOne: false
            referencedRelation: "delivery_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_preferences: {
        Row: {
          created_at: string | null
          id: string
          preferred_time_slot:
            | Database["public"]["Enums"]["delivery_time_slot"]
            | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          preferred_time_slot?:
            | Database["public"]["Enums"]["delivery_time_slot"]
            | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          preferred_time_slot?:
            | Database["public"]["Enums"]["delivery_time_slot"]
            | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      delivery_routes: {
        Row: {
          completed_deliveries: number
          created_at: string | null
          deliveries: number
          id: string
          postman_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          completed_deliveries?: number
          created_at?: string | null
          deliveries?: number
          id?: string
          postman_id: string
          status: string
          updated_at?: string | null
        }
        Update: {
          completed_deliveries?: number
          created_at?: string | null
          deliveries?: number
          id?: string
          postman_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      delivery_slots: {
        Row: {
          consignment_no: string
          created_at: string | null
          custom_time: string | null
          expected_delivery_date: string
          expected_time_slot: string
          id: string
          selected_date: string | null
          selected_time_slot: string | null
          status: string
          time_aligned: boolean
          type_of_consignment: string
          user_id: string | null
        }
        Insert: {
          consignment_no: string
          created_at?: string | null
          custom_time?: string | null
          expected_delivery_date: string
          expected_time_slot: string
          id?: string
          selected_date?: string | null
          selected_time_slot?: string | null
          status?: string
          time_aligned: boolean
          type_of_consignment: string
          user_id?: string | null
        }
        Update: {
          consignment_no?: string
          created_at?: string | null
          custom_time?: string | null
          expected_delivery_date?: string
          expected_time_slot?: string
          id?: string
          selected_date?: string | null
          selected_time_slot?: string | null
          status?: string
          time_aligned?: boolean
          type_of_consignment?: string
          user_id?: string | null
        }
        Relationships: []
      }
      parcels: {
        Row: {
          consignment_no: string
          created_at: string | null
          expected_delivery_date: string
          expected_delivery_time: string
          id: string
          parcel_type: string
          preferred_delivery_time: string | null
          recipient_email: string
          recipient_name: string
          recipient_phone: string
          status: string
          updated_at: string | null
        }
        Insert: {
          consignment_no: string
          created_at?: string | null
          expected_delivery_date: string
          expected_delivery_time: string
          id?: string
          parcel_type: string
          preferred_delivery_time?: string | null
          recipient_email: string
          recipient_name: string
          recipient_phone: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          consignment_no?: string
          created_at?: string | null
          expected_delivery_date?: string
          expected_delivery_time?: string
          id?: string
          parcel_type?: string
          preferred_delivery_time?: string | null
          recipient_email?: string
          recipient_name?: string
          recipient_phone?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      schema_migrations: {
        Row: {
          created_at: string | null
          version: string
        }
        Insert: {
          created_at?: string | null
          version: string
        }
        Update: {
          created_at?: string | null
          version?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_delivery_charges: {
        Args: {
          selected_time_slot: Database["public"]["Enums"]["delivery_time_slot"]
        }
        Returns: number
      }
    }
    Enums: {
      admin_role: "admin" | "super_admin"
      delivery_time_slot:
        | "morning_early"
        | "morning"
        | "afternoon"
        | "evening"
        | "evening_late"
      user_type: "admin" | "recipient"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
