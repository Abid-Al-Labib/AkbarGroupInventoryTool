export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          enabled: boolean
          id: number
          name: string
        }
        Insert: {
          enabled: boolean
          id?: number
          name: string
        }
        Update: {
          enabled?: boolean
          id?: number
          name?: string
        }
        Relationships: []
      }
      damaged_parts: {
        Row: {
          factory_id: number
          id: number
          part_id: number
          qty: number
        }
        Insert: {
          factory_id: number
          id?: number
          part_id: number
          qty: number
        }
        Update: {
          factory_id?: number
          id?: number
          part_id?: number
          qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "damaged_parts_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "damaged_parts_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "fullname_machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "damaged_parts_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      factories: {
        Row: {
          abbreviation: string
          id: number
          name: string
        }
        Insert: {
          abbreviation: string
          id?: number
          name: string
        }
        Update: {
          abbreviation?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      factory_sections: {
        Row: {
          factory_id: number
          id: number
          name: string
        }
        Insert: {
          factory_id: number
          id?: number
          name: string
        }
        Update: {
          factory_id?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "factory_sections_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factory_sections_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "fullname_machines"
            referencedColumns: ["id"]
          },
        ]
      }
      machine_parts: {
        Row: {
          id: number
          machine_id: number
          part_id: number
          qty: number
          req_qty: number | null
        }
        Insert: {
          id?: number
          machine_id: number
          part_id: number
          qty: number
          req_qty?: number | null
        }
        Update: {
          id?: number
          machine_id?: number
          part_id?: number
          qty?: number
          req_qty?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "machine_parts_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "fullname_machines"
            referencedColumns: ["machineid"]
          },
          {
            foreignKeyName: "machine_parts_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machine_parts_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
        ]
      }
      machines: {
        Row: {
          factory_section_id: number
          id: number
          is_running: boolean
          name: string
        }
        Insert: {
          factory_section_id: number
          id?: number
          is_running: boolean
          name: string
        }
        Update: {
          factory_section_id?: number
          id?: number
          is_running?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "machines_factory_section_id_fkey"
            columns: ["factory_section_id"]
            isOneToOne: false
            referencedRelation: "factory_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machines_factory_section_id_fkey"
            columns: ["factory_section_id"]
            isOneToOne: false
            referencedRelation: "fullname_machines"
            referencedColumns: ["factorysectionid"]
          },
        ]
      }
      order_parts: {
        Row: {
          approved_budget: boolean
          approved_office_order: boolean
          approved_pending_order: boolean
          approved_storage_withdrawal: boolean
          brand: string | null
          id: number
          in_storage: boolean
          is_sample_received_by_office: boolean
          is_sample_sent_to_office: boolean
          mrr_number: string | null
          note: string | null
          office_note: string | null
          order_id: number
          part_id: number
          part_purchased_date: string | null
          part_received_by_factory_date: string | null
          part_sent_by_office_date: string | null
          qty: number
          qty_taken_from_storage: number
          unit_cost: number | null
          vendor: string | null
        }
        Insert: {
          approved_budget?: boolean
          approved_office_order?: boolean
          approved_pending_order?: boolean
          approved_storage_withdrawal?: boolean
          brand?: string | null
          id?: number
          in_storage?: boolean
          is_sample_received_by_office?: boolean
          is_sample_sent_to_office?: boolean
          mrr_number?: string | null
          note?: string | null
          office_note?: string | null
          order_id: number
          part_id: number
          part_purchased_date?: string | null
          part_received_by_factory_date?: string | null
          part_sent_by_office_date?: string | null
          qty: number
          qty_taken_from_storage?: number
          unit_cost?: number | null
          vendor?: string | null
        }
        Update: {
          approved_budget?: boolean
          approved_office_order?: boolean
          approved_pending_order?: boolean
          approved_storage_withdrawal?: boolean
          brand?: string | null
          id?: number
          in_storage?: boolean
          is_sample_received_by_office?: boolean
          is_sample_sent_to_office?: boolean
          mrr_number?: string | null
          note?: string | null
          office_note?: string | null
          order_id?: number
          part_id?: number
          part_purchased_date?: string | null
          part_received_by_factory_date?: string | null
          part_sent_by_office_date?: string | null
          qty?: number
          qty_taken_from_storage?: number
          unit_cost?: number | null
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_parts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          created_by_user_id: number
          current_status_id: number
          department_id: number
          factory_id: number
          factory_section_id: number | null
          id: number
          machine_id: number | null
          order_note: string | null
          order_type: string | null
          req_num: string | null
        }
        Insert: {
          created_at?: string
          created_by_user_id: number
          current_status_id: number
          department_id: number
          factory_id: number
          factory_section_id?: number | null
          id?: number
          machine_id?: number | null
          order_note?: string | null
          order_type?: string | null
          req_num?: string | null
        }
        Update: {
          created_at?: string
          created_by_user_id?: number
          current_status_id?: number
          department_id?: number
          factory_id?: number
          factory_section_id?: number | null
          id?: number
          machine_id?: number | null
          order_note?: string | null
          order_type?: string | null
          req_num?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_current_status_id_fkey"
            columns: ["current_status_id"]
            isOneToOne: false
            referencedRelation: "statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "fullname_machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_factory_section_id_fkey"
            columns: ["factory_section_id"]
            isOneToOne: false
            referencedRelation: "factory_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_factory_section_id_fkey"
            columns: ["factory_section_id"]
            isOneToOne: false
            referencedRelation: "fullname_machines"
            referencedColumns: ["factorysectionid"]
          },
          {
            foreignKeyName: "orders_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "fullname_machines"
            referencedColumns: ["machineid"]
          },
          {
            foreignKeyName: "orders_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      parts: {
        Row: {
          created_at: string
          description: string
          id: number
          name: string
          unit: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          name: string
          unit: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          name?: string
          unit?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          email: string
          id: number
          name: string
          password: string
          permission: string
          position: string
          user_id: string
        }
        Insert: {
          email: string
          id?: number
          name: string
          password: string
          permission: string
          position: string
          user_id?: string
        }
        Update: {
          email?: string
          id?: number
          name?: string
          password?: string
          permission?: string
          position?: string
          user_id?: string
        }
        Relationships: []
      }
      status_tracker: {
        Row: {
          action_at: string
          action_by_user_id: number
          id: number
          order_id: number
          status_id: number
        }
        Insert: {
          action_at?: string
          action_by_user_id: number
          id?: number
          order_id: number
          status_id: number
        }
        Update: {
          action_at?: string
          action_by_user_id?: number
          id?: number
          order_id?: number
          status_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "status_tracker_action_by_user_id_fkey"
            columns: ["action_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "status_tracker_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "status_tracker_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      statuses: {
        Row: {
          comment: string
          id: number
          name: string
        }
        Insert: {
          comment: string
          id?: number
          name: string
        }
        Update: {
          comment?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      storage_parts: {
        Row: {
          factory_id: number
          id: number
          part_id: number
          qty: number
        }
        Insert: {
          factory_id: number
          id?: number
          part_id: number
          qty: number
        }
        Update: {
          factory_id?: number
          id?: number
          part_id?: number
          qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "storage_parts_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storage_parts_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "fullname_machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storage_parts_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      fullname_machines: {
        Row: {
          abrev: string | null
          factorysectionid: number | null
          fullnamemachine: string | null
          id: number | null
          isrunning: boolean | null
          machineid: number | null
          name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
