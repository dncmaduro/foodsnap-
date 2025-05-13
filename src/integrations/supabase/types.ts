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
      address: {
        Row: {
          address: string
          address_id: number
          district: string
          is_default: boolean
          label: string | null
          user_id: number
        }
        Insert: {
          address: string
          address_id?: number
          district: string
          is_default?: boolean
          label?: string | null
          user_id: number
        }
        Update: {
          address?: string
          address_id?: number
          district?: string
          is_default?: boolean
          label?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "address_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      admin: {
        Row: {
          admin_id: number
          user_id: number
        }
        Insert: {
          admin_id?: number
          user_id: number
        }
        Update: {
          admin_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "admin_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      menuitem: {
        Row: {
          active: boolean
          created_at: string | null
          description: string | null
          image_url: string | null
          menuitem_id: number
          name: string
          price: number
          restaurant_id: number
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          description?: string | null
          image_url?: string | null
          menuitem_id?: number
          name: string
          price: number
          restaurant_id: number
        }
        Update: {
          active?: boolean
          created_at?: string | null
          description?: string | null
          image_url?: string | null
          menuitem_id?: number
          name?: string
          price?: number
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "menuitem_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      order: {
        Row: {
          address_id: number
          delivered_at: string | null
          delivery_note: string | null
          order_at: string
          order_id: number
          restaurant_id: number
          shipper_id: number | null
          shipping_fee: number
          shipping_status: Database["public"]["Enums"]["shipping_status_enum"]
          subtotal: number
          total_price: number
          user_id: number
        }
        Insert: {
          address_id: number
          delivered_at?: string | null
          delivery_note?: string | null
          order_at?: string
          order_id?: number
          restaurant_id: number
          shipper_id?: number | null
          shipping_fee: number
          shipping_status?: Database["public"]["Enums"]["shipping_status_enum"]
          subtotal: number
          total_price: number
          user_id: number
        }
        Update: {
          address_id?: number
          delivered_at?: string | null
          delivery_note?: string | null
          order_at?: string
          order_id?: number
          restaurant_id?: number
          shipper_id?: number | null
          shipping_fee?: number
          shipping_status?: Database["public"]["Enums"]["shipping_status_enum"]
          subtotal?: number
          total_price?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "address"
            referencedColumns: ["address_id"]
          },
          {
            foreignKeyName: "order_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["restaurant_id"]
          },
          {
            foreignKeyName: "order_shipper_id_fkey"
            columns: ["shipper_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "order_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      order_item: {
        Row: {
          menuitem_id: number
          note: string | null
          order_id: number
          order_item_id: number
          price: number
          quantity: number
        }
        Insert: {
          menuitem_id: number
          note?: string | null
          order_id: number
          order_item_id?: number
          price: number
          quantity: number
        }
        Update: {
          menuitem_id?: number
          note?: string | null
          order_id?: number
          order_item_id?: number
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_item_menuitem_id_fkey"
            columns: ["menuitem_id"]
            isOneToOne: false
            referencedRelation: "menuitem"
            referencedColumns: ["menuitem_id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["order_id"]
          },
        ]
      }
      restaurant: {
        Row: {
          address: string
          close_time: string | null
          district: string
          id_card_back_url: string
          id_card_front_url: string
          image_url: string | null
          name: string
          open_time: string | null
          phone: string
          rating: number | null
          restaurant_id: number
          status: Database["public"]["Enums"]["restaurant_status"] | null
          user_id: number
        }
        Insert: {
          address: string
          close_time?: string | null
          district: string
          id_card_back_url: string
          id_card_front_url: string
          image_url?: string | null
          name: string
          open_time?: string | null
          phone: string
          rating?: number | null
          restaurant_id?: number
          status?: Database["public"]["Enums"]["restaurant_status"] | null
          user_id: number
        }
        Update: {
          address?: string
          close_time?: string | null
          district?: string
          id_card_back_url?: string
          id_card_front_url?: string
          image_url?: string | null
          name?: string
          open_time?: string | null
          phone?: string
          rating?: number | null
          restaurant_id?: number
          status?: Database["public"]["Enums"]["restaurant_status"] | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      review: {
        Row: {
          comment: string | null
          created_at: string
          order_id: number
          rating: number
          restaurant_id: number
          review_id: number
          user_id: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          order_id: number
          rating: number
          restaurant_id: number
          review_id?: number
          user_id: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          order_id?: number
          rating?: number
          restaurant_id?: number
          review_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "review_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "review_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["restaurant_id"]
          },
          {
            foreignKeyName: "review_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      role: {
        Row: {
          name: string
          role_id: number
        }
        Insert: {
          name: string
          role_id?: number
        }
        Update: {
          name?: string
          role_id?: number
        }
        Relationships: []
      }
      shipper_info: {
        Row: {
          created_at: string
          fullname: string
          license_back_image: string
          license_front_image: string
          phonenumber: string
          status: Database["public"]["Enums"]["shipper_status"]
          user_id: number
        }
        Insert: {
          created_at?: string
          fullname: string
          license_back_image: string
          license_front_image: string
          phonenumber: string
          status: Database["public"]["Enums"]["shipper_status"]
          user_id: number
        }
        Update: {
          created_at?: string
          fullname?: string
          license_back_image?: string
          license_front_image?: string
          phonenumber?: string
          status?: Database["public"]["Enums"]["shipper_status"]
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "shipper_info_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      shippingassignments: {
        Row: {
          assignment_id: number
          created_at: string | null
          delivery_time: string | null
          order_id: number
          pickup_time: string | null
          shipper_id: number | null
          status: Database["public"]["Enums"]["shipping_status_enum"]
        }
        Insert: {
          assignment_id?: number
          created_at?: string | null
          delivery_time?: string | null
          order_id: number
          pickup_time?: string | null
          shipper_id?: number | null
          status?: Database["public"]["Enums"]["shipping_status_enum"]
        }
        Update: {
          assignment_id?: number
          created_at?: string | null
          delivery_time?: string | null
          order_id?: number
          pickup_time?: string | null
          shipper_id?: number | null
          status?: Database["public"]["Enums"]["shipping_status_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "shippingassignments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "shippingassignments_shipper_id_fkey"
            columns: ["shipper_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user: {
        Row: {
          email: string
          fullname: string
          password: string
          phonenumber: string
          user_id: number
        }
        Insert: {
          email: string
          fullname: string
          password: string
          phonenumber: string
          user_id?: number
        }
        Update: {
          email?: string
          fullname?: string
          password?: string
          phonenumber?: string
          user_id?: number
        }
        Relationships: []
      }
      userrole: {
        Row: {
          role_id: number
          user_id: number
        }
        Insert: {
          role_id: number
          user_id: number
        }
        Update: {
          role_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "userrole_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "role"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "userrole_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      district_enum: "Cầu Giấy" | "Đống Đa" | "Ba Đình" | "Thanh Xuân"
      restaurant_status: "pending" | "approved" | "rejected"
      shipper_status: "pending" | "approved" | "rejected"
      shipping_status_enum:
        | "Pending"
        | "Assigned"
        | "In Transit"
        | "Delivered"
        | "Canceled"
      vehicle_enum: "xe máy" | "ô tô"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      district_enum: ["Cầu Giấy", "Đống Đa", "Ba Đình", "Thanh Xuân"],
      restaurant_status: ["pending", "approved", "rejected"],
      shipper_status: ["pending", "approved", "rejected"],
      shipping_status_enum: [
        "Pending",
        "Assigned",
        "In Transit",
        "Delivered",
        "Canceled",
      ],
      vehicle_enum: ["xe máy", "ô tô"],
    },
  },
} as const
