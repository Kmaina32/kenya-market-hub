export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      backup_logs: {
        Row: {
          backup_name: string
          backup_type: string
          created_at: string
          created_by: string | null
          error_message: string | null
          file_path: string | null
          file_size: number | null
          id: string
          metadata: Json | null
          status: string | null
          tables_count: number | null
        }
        Insert: {
          backup_name: string
          backup_type: string
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          status?: string | null
          tables_count?: number | null
        }
        Update: {
          backup_name?: string
          backup_type?: string
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          status?: string | null
          tables_count?: number | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          last_message: string | null
          last_message_at: string | null
          participant1_id: string
          participant2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          participant1_id: string
          participant2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          participant1_id?: string
          participant2_id?: string
        }
        Relationships: []
      }
      chat_message_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          message_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          message_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          edited_at: string | null
          id: string
          is_read: boolean | null
          message_type: string | null
          reply_to_message_id: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          edited_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          reply_to_message_id?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          edited_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          reply_to_message_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_reply_to_message_id_fkey"
            columns: ["reply_to_message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_usage: {
        Row: {
          coupon_id: string
          id: string
          order_id: string | null
          used_at: string
          user_id: string
        }
        Insert: {
          coupon_id: string
          id?: string
          order_id?: string | null
          used_at?: string
          user_id: string
        }
        Update: {
          coupon_id?: string
          id?: string
          order_id?: string | null
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          applicable_categories: string[] | null
          applicable_products: string[] | null
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          discount_type: string
          discount_value: number
          end_date: string
          id: string
          is_active: boolean | null
          maximum_discount_amount: number | null
          minimum_order_amount: number | null
          name: string
          start_date: string
          updated_at: string
          usage_count: number | null
          usage_limit: number | null
          user_usage_limit: number | null
        }
        Insert: {
          applicable_categories?: string[] | null
          applicable_products?: string[] | null
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type: string
          discount_value: number
          end_date: string
          id?: string
          is_active?: boolean | null
          maximum_discount_amount?: number | null
          minimum_order_amount?: number | null
          name: string
          start_date: string
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
          user_usage_limit?: number | null
        }
        Update: {
          applicable_categories?: string[] | null
          applicable_products?: string[] | null
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          end_date?: string
          id?: string
          is_active?: boolean | null
          maximum_discount_amount?: number | null
          minimum_order_amount?: number | null
          name?: string
          start_date?: string
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
          user_usage_limit?: number | null
        }
        Relationships: []
      }
      delivery_schedules: {
        Row: {
          created_at: string
          delivery_address: string
          id: string
          order_id: string
          phone_number: string
          scheduled_date: string
          special_instructions: string | null
          status: string | null
          time_slot: string
        }
        Insert: {
          created_at?: string
          delivery_address: string
          id?: string
          order_id: string
          phone_number: string
          scheduled_date: string
          special_instructions?: string | null
          status?: string | null
          time_slot: string
        }
        Update: {
          created_at?: string
          delivery_address?: string
          id?: string
          order_id?: string
          phone_number?: string
          scheduled_date?: string
          special_instructions?: string | null
          status?: string | null
          time_slot?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_schedules_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_applications: {
        Row: {
          admin_notes: string | null
          created_at: string
          documents: Json | null
          full_name: string
          id: string
          license_number: string
          license_plate: string
          phone: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string
          updated_at: string
          user_id: string
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          vehicle_year: number | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          documents?: Json | null
          full_name: string
          id?: string
          license_number: string
          license_plate: string
          phone: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          vehicle_year?: number | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          documents?: Json | null
          full_name?: string
          id?: string
          license_number?: string
          license_plate?: string
          phone?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id?: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
          vehicle_year?: number | null
        }
        Relationships: []
      }
      driver_locations: {
        Row: {
          accuracy: number | null
          driver_id: string
          heading: number | null
          id: string
          is_active: boolean | null
          location: unknown
          speed: number | null
          timestamp: string | null
        }
        Insert: {
          accuracy?: number | null
          driver_id: string
          heading?: number | null
          id?: string
          is_active?: boolean | null
          location: unknown
          speed?: number | null
          timestamp?: string | null
        }
        Update: {
          accuracy?: number | null
          driver_id?: string
          heading?: number | null
          id?: string
          is_active?: boolean | null
          location?: unknown
          speed?: number | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_locations_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_ride_requests: {
        Row: {
          created_at: string | null
          distance_km: number | null
          driver_id: string
          estimated_pickup_minutes: number | null
          expires_at: string
          id: string
          responded_at: string | null
          ride_id: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          distance_km?: number | null
          driver_id: string
          estimated_pickup_minutes?: number | null
          expires_at?: string
          id?: string
          responded_at?: string | null
          ride_id: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          distance_km?: number | null
          driver_id?: string
          estimated_pickup_minutes?: number | null
          expires_at?: string
          id?: string
          responded_at?: string | null
          ride_id?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_ride_requests_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_ride_requests_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_saved_routes: {
        Row: {
          created_at: string | null
          driver_id: string
          from_address: string
          id: string
          name: string
          to_address: string
        }
        Insert: {
          created_at?: string | null
          driver_id: string
          from_address: string
          id?: string
          name: string
          to_address: string
        }
        Update: {
          created_at?: string | null
          driver_id?: string
          from_address?: string
          id?: string
          name?: string
          to_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_saved_routes_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          availability_status: string | null
          created_at: string | null
          current_location: unknown | null
          documents: Json | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          last_location_update: string | null
          license_number: string
          license_plate: string
          phone_number: string
          rating: number | null
          status: Database["public"]["Enums"]["driver_status"] | null
          total_rides: number | null
          updated_at: string | null
          user_id: string
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          vehicle_year: number | null
        }
        Insert: {
          availability_status?: string | null
          created_at?: string | null
          current_location?: unknown | null
          documents?: Json | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_location_update?: string | null
          license_number: string
          license_plate: string
          phone_number: string
          rating?: number | null
          status?: Database["public"]["Enums"]["driver_status"] | null
          total_rides?: number | null
          updated_at?: string | null
          user_id: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          vehicle_year?: number | null
        }
        Update: {
          availability_status?: string | null
          created_at?: string | null
          current_location?: unknown | null
          documents?: Json | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_location_update?: string | null
          license_number?: string
          license_plate?: string
          phone_number?: string
          rating?: number | null
          status?: Database["public"]["Enums"]["driver_status"] | null
          total_rides?: number | null
          updated_at?: string | null
          user_id?: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
          vehicle_year?: number | null
        }
        Relationships: []
      }
      email_campaigns: {
        Row: {
          audience_segments: Json | null
          clicked_count: number | null
          content: string
          created_at: string
          created_by: string
          id: string
          name: string
          opened_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          subject: string
          target_audience: string | null
          template_type: string | null
          total_recipients: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audience_segments?: Json | null
          clicked_count?: number | null
          content: string
          created_at?: string
          created_by: string
          id?: string
          name: string
          opened_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          target_audience?: string | null
          template_type?: string | null
          total_recipients?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audience_segments?: Json | null
          clicked_count?: number | null
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          opened_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          target_audience?: string | null
          template_type?: string | null
          total_recipients?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_subscribers: {
        Row: {
          email: string
          id: string
          is_subscribed: boolean | null
          subscribed_at: string
          subscription_source: string | null
          tags: string[] | null
          unsubscribed_at: string | null
          user_id: string | null
        }
        Insert: {
          email: string
          id?: string
          is_subscribed?: boolean | null
          subscribed_at?: string
          subscription_source?: string | null
          tags?: string[] | null
          unsubscribed_at?: string | null
          user_id?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_subscribed?: boolean | null
          subscribed_at?: string
          subscription_source?: string | null
          tags?: string[] | null
          unsubscribed_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string
          relationship: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone: string
          relationship: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string
          relationship?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          current_attendees: number | null
          date: string
          description: string | null
          end_date: string | null
          event_type: string
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string
          max_attendees: number | null
          organizer_id: string | null
          price: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_attendees?: number | null
          date: string
          description?: string | null
          end_date?: string | null
          event_type: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location: string
          max_attendees?: number | null
          organizer_id?: string | null
          price?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_attendees?: number | null
          date?: string
          description?: string | null
          end_date?: string | null
          event_type?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string
          max_attendees?: number | null
          organizer_id?: string | null
          price?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      fare_calculations: {
        Row: {
          base_fare: number
          created_at: string | null
          id: string
          is_active: boolean | null
          minimum_fare: number
          per_km_rate: number
          per_minute_rate: number
          surge_multiplier: number | null
          updated_at: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Insert: {
          base_fare: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          minimum_fare: number
          per_km_rate: number
          per_minute_rate: number
          surge_multiplier?: number | null
          updated_at?: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Update: {
          base_fare?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          minimum_fare?: number
          per_km_rate?: number
          per_minute_rate?: number
          surge_multiplier?: number | null
          updated_at?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
        }
        Relationships: []
      }
      featured_products: {
        Row: {
          category: string
          created_at: string | null
          featured_until: string | null
          id: string
          is_active: boolean | null
          product_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          featured_until?: string | null
          id?: string
          is_active?: boolean | null
          product_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          featured_until?: string | null
          id?: string
          is_active?: boolean | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          member_count: number | null
          name: string
          post_count: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          member_count?: number | null
          name: string
          post_count?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          member_count?: number | null
          name?: string
          post_count?: number | null
        }
        Relationships: []
      }
      forum_post_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          like_count: number | null
          parent_comment_id: string | null
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          like_count?: number | null
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          like_count?: number | null
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "forum_post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_post_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reaction_type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          author_id: string
          category_id: string
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_locked: boolean | null
          is_pinned: boolean | null
          like_count: number | null
          reply_count: number | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          category_id: string
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_locked?: boolean | null
          is_pinned?: boolean | null
          like_count?: number | null
          reply_count?: number | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category_id?: string
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_locked?: boolean | null
          is_pinned?: boolean | null
          like_count?: number | null
          reply_count?: number | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      forums: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      insurance_plans: {
        Row: {
          coverage_amount: number | null
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          monthly_premium: number
          name: string
          plan_type: string
        }
        Insert: {
          coverage_amount?: number | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          monthly_premium: number
          name: string
          plan_type: string
        }
        Update: {
          coverage_amount?: number | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          monthly_premium?: number
          name?: string
          plan_type?: string
        }
        Relationships: []
      }
      insurance_policies: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          plan_id: string | null
          policy_number: string
          premium_paid: number | null
          start_date: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          plan_id?: string | null
          policy_number: string
          premium_paid?: number | null
          start_date: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          plan_id?: string | null
          policy_number?: string
          premium_paid?: number | null
          start_date?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_policies_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "insurance_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applicant_email: string
          applicant_name: string
          applicant_phone: string | null
          applied_at: string | null
          cover_letter: string | null
          experience: string | null
          id: string
          job_id: number | null
          resume_url: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          applicant_email: string
          applicant_name: string
          applicant_phone?: string | null
          applied_at?: string | null
          cover_letter?: string | null
          experience?: string | null
          id?: string
          job_id?: number | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          applicant_email?: string
          applicant_name?: string
          applicant_phone?: string | null
          applied_at?: string | null
          cover_letter?: string | null
          experience?: string | null
          id?: string
          job_id?: number | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          category: string
          company: string | null
          created_at: string | null
          description: string
          id: number
          job_type: string | null
          location: string | null
          posted_by: string | null
          salary: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          company?: string | null
          created_at?: string | null
          description: string
          id?: number
          job_type?: string | null
          location?: string | null
          posted_by?: string | null
          salary?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          company?: string | null
          created_at?: string | null
          description?: string
          id?: number
          job_type?: string | null
          location?: string | null
          posted_by?: string | null
          salary?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      medical_facilities: {
        Row: {
          address: string
          created_at: string
          email: string | null
          facility_type: Database["public"]["Enums"]["medical_facility_type"]
          id: string
          is_verified: boolean | null
          location_coordinates: unknown | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          email?: string | null
          facility_type: Database["public"]["Enums"]["medical_facility_type"]
          id?: string
          is_verified?: boolean | null
          location_coordinates?: unknown | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string | null
          facility_type?: Database["public"]["Enums"]["medical_facility_type"]
          id?: string
          is_verified?: boolean | null
          location_coordinates?: unknown | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      medical_provider_applications: {
        Row: {
          admin_notes: string | null
          documents: Json | null
          email: string
          full_name: string
          id: string
          license_number: string
          phone: string
          provider_type: Database["public"]["Enums"]["medical_provider_type"]
          reviewed_at: string | null
          reviewed_by: string | null
          specialization_id: string | null
          status: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          documents?: Json | null
          email: string
          full_name: string
          id?: string
          license_number: string
          phone: string
          provider_type: Database["public"]["Enums"]["medical_provider_type"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          specialization_id?: string | null
          status?: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          documents?: Json | null
          email?: string
          full_name?: string
          id?: string
          license_number?: string
          phone?: string
          provider_type?: Database["public"]["Enums"]["medical_provider_type"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          specialization_id?: string | null
          status?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_provider_applications_specialization_id_fkey"
            columns: ["specialization_id"]
            isOneToOne: false
            referencedRelation: "medical_specializations"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_providers: {
        Row: {
          created_at: string
          facility_id: string | null
          full_name: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          provider_type: Database["public"]["Enums"]["medical_provider_type"]
          rating: number | null
          specialization_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          facility_id?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          provider_type: Database["public"]["Enums"]["medical_provider_type"]
          rating?: number | null
          specialization_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          facility_id?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          provider_type?: Database["public"]["Enums"]["medical_provider_type"]
          rating?: number | null
          specialization_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_providers_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "medical_facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_providers_specialization_id_fkey"
            columns: ["specialization_id"]
            isOneToOne: false
            referencedRelation: "medical_specializations"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_specializations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      medications: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          pharmacy_id: string
          price: number
          requires_prescription: boolean | null
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          pharmacy_id: string
          price: number
          requires_prescription?: boolean | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          pharmacy_id?: string
          price?: number
          requires_prescription?: boolean | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medications_pharmacy_id_fkey"
            columns: ["pharmacy_id"]
            isOneToOne: false
            referencedRelation: "medical_facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          price: number
          restaurant_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          price: number
          restaurant_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          price?: number
          restaurant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          new_status: Database["public"]["Enums"]["order_status_type"]
          notes: string | null
          old_status: Database["public"]["Enums"]["order_status_type"] | null
          order_id: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_status: Database["public"]["Enums"]["order_status_type"]
          notes?: string | null
          old_status?: Database["public"]["Enums"]["order_status_type"] | null
          order_id: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_status?: Database["public"]["Enums"]["order_status_type"]
          notes?: string | null
          old_status?: Database["public"]["Enums"]["order_status_type"] | null
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          coupon_id: string | null
          created_at: string | null
          discount_amount: number | null
          id: string
          payment_method: string | null
          payment_status: string | null
          shipping_address: Json | null
          shipping_city: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          coupon_id?: string | null
          created_at?: string | null
          discount_amount?: number | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          shipping_city?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          coupon_id?: string | null
          created_at?: string | null
          discount_amount?: number | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          shipping_city?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category: string
          condition: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          location: string | null
          make: string | null
          model: string | null
          name: string
          original_price: number | null
          price: number
          rating: number | null
          reviews_count: number | null
          stock_quantity: number | null
          tags: string[] | null
          updated_at: string | null
          vendor: string | null
          vendor_id: string | null
          views_count: number | null
          year: number | null
        }
        Insert: {
          brand?: string | null
          category: string
          condition?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          location?: string | null
          make?: string | null
          model?: string | null
          name: string
          original_price?: number | null
          price: number
          rating?: number | null
          reviews_count?: number | null
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string | null
          vendor?: string | null
          vendor_id?: string | null
          views_count?: number | null
          year?: number | null
        }
        Update: {
          brand?: string | null
          category?: string
          condition?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          location?: string | null
          make?: string | null
          model?: string | null
          name?: string
          original_price?: number | null
          price?: number
          rating?: number | null
          reviews_count?: number | null
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string | null
          vendor?: string | null
          vendor_id?: string | null
          views_count?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          agent_id: string | null
          amenities: string[] | null
          area_sqm: number | null
          available_from: string | null
          bathrooms: number | null
          bedrooms: number | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          county: string | null
          created_at: string | null
          description: string | null
          features: string[] | null
          id: string
          images: Json | null
          is_featured: boolean | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          location_address: string
          location_coordinates: unknown | null
          owner_id: string
          price: number
          property_type: Database["public"]["Enums"]["property_type"]
          status: Database["public"]["Enums"]["property_status"] | null
          title: string
          updated_at: string | null
          views_count: number | null
          virtual_tour_url: string | null
        }
        Insert: {
          agent_id?: string | null
          amenities?: string[] | null
          area_sqm?: number | null
          available_from?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          county?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          location_address: string
          location_coordinates?: unknown | null
          owner_id: string
          price: number
          property_type: Database["public"]["Enums"]["property_type"]
          status?: Database["public"]["Enums"]["property_status"] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
          virtual_tour_url?: string | null
        }
        Update: {
          agent_id?: string | null
          amenities?: string[] | null
          area_sqm?: number | null
          available_from?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          county?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          location_address?: string
          location_coordinates?: unknown | null
          owner_id?: string
          price?: number
          property_type?: Database["public"]["Enums"]["property_type"]
          status?: Database["public"]["Enums"]["property_status"] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
          virtual_tour_url?: string | null
        }
        Relationships: []
      }
      property_inquiries: {
        Row: {
          created_at: string | null
          id: string
          inquirer_email: string
          inquirer_id: string | null
          inquirer_name: string
          inquirer_phone: string | null
          inquiry_type: string | null
          message: string
          preferred_contact_method: string | null
          property_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inquirer_email: string
          inquirer_id?: string | null
          inquirer_name: string
          inquirer_phone?: string | null
          inquiry_type?: string | null
          message: string
          preferred_contact_method?: string | null
          property_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inquirer_email?: string
          inquirer_id?: string | null
          inquirer_name?: string
          inquirer_phone?: string | null
          inquiry_type?: string | null
          message?: string
          preferred_contact_method?: string | null
          property_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_viewings: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          property_id: string
          status: string | null
          viewer_email: string
          viewer_id: string | null
          viewer_name: string
          viewer_phone: string | null
          viewing_date: string
          viewing_time: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          property_id: string
          status?: string | null
          viewer_email: string
          viewer_id?: string | null
          viewer_name: string
          viewer_phone?: string | null
          viewing_date: string
          viewing_time: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          property_id?: string
          status?: string | null
          viewer_email?: string
          viewer_id?: string | null
          viewer_name?: string
          viewer_phone?: string | null
          viewing_date?: string
          viewing_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_viewings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      real_estate_agents: {
        Row: {
          agency_name: string | null
          bio: string | null
          company: string | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          license_number: string | null
          phone: string
          profile_image_url: string | null
          rating: number | null
          social_media: Json | null
          specializations: string[] | null
          total_sales: number | null
          updated_at: string | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          agency_name?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          license_number?: string | null
          phone: string
          profile_image_url?: string | null
          rating?: number | null
          social_media?: Json | null
          specializations?: string[] | null
          total_sales?: number | null
          updated_at?: string | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          agency_name?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          license_number?: string | null
          phone?: string
          profile_image_url?: string | null
          rating?: number | null
          social_media?: Json | null
          specializations?: string[] | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      recently_viewed: {
        Row: {
          id: string
          product_id: string
          user_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recently_viewed_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string | null
          created_at: string | null
          cuisine_type: string
          delivery_fee: number | null
          delivery_time_minutes: number | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          minimum_order: number | null
          name: string
          phone: string | null
          rating: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          cuisine_type: string
          delivery_fee?: number | null
          delivery_time_minutes?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          minimum_order?: number | null
          name: string
          phone?: string | null
          rating?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          cuisine_type?: string
          delivery_fee?: number | null
          delivery_time_minutes?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          minimum_order?: number | null
          name?: string
          phone?: string | null
          rating?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_matching_requests: {
        Row: {
          created_at: string | null
          distance_km: number | null
          driver_id: string
          estimated_time_minutes: number | null
          expires_at: string
          id: string
          responded_at: string | null
          ride_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          distance_km?: number | null
          driver_id: string
          estimated_time_minutes?: number | null
          expires_at: string
          id?: string
          responded_at?: string | null
          ride_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          distance_km?: number | null
          driver_id?: string
          estimated_time_minutes?: number | null
          expires_at?: string
          id?: string
          responded_at?: string | null
          ride_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ride_matching_requests_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ride_matching_requests_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_requests: {
        Row: {
          created_at: string | null
          driver_id: string
          expires_at: string
          id: string
          ride_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          driver_id: string
          expires_at: string
          id?: string
          ride_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string
          expires_at?: string
          id?: string
          ride_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ride_requests_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ride_requests_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      rides: {
        Row: {
          accepted_at: string | null
          actual_fare: number | null
          cancellation_reason: string | null
          cancelled_at: string | null
          completed_at: string | null
          created_at: string | null
          destination_address: string
          destination_location: unknown
          distance_km: number | null
          driver_id: string | null
          duration_minutes: number | null
          estimated_fare: number | null
          id: string
          pickup_address: string
          pickup_location: unknown
          rating: number | null
          requested_at: string | null
          review: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["ride_status"] | null
          updated_at: string | null
          user_id: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Insert: {
          accepted_at?: string | null
          actual_fare?: number | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          destination_address: string
          destination_location: unknown
          distance_km?: number | null
          driver_id?: string | null
          duration_minutes?: number | null
          estimated_fare?: number | null
          id?: string
          pickup_address: string
          pickup_location: unknown
          rating?: number | null
          requested_at?: string | null
          review?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["ride_status"] | null
          updated_at?: string | null
          user_id: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Update: {
          accepted_at?: string | null
          actual_fare?: number | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          destination_address?: string
          destination_location?: unknown
          distance_km?: number | null
          driver_id?: string | null
          duration_minutes?: number | null
          estimated_fare?: number | null
          id?: string
          pickup_address?: string
          pickup_location?: unknown
          rating?: number | null
          requested_at?: string | null
          review?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["ride_status"] | null
          updated_at?: string | null
          user_id?: string
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
        }
        Relationships: [
          {
            foreignKeyName: "rides_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      safety_alerts: {
        Row: {
          created_at: string | null
          id: string
          location: Json | null
          message: string | null
          metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: Json | null
          message?: string | null
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: Json | null
          message?: string | null
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      safety_reports: {
        Row: {
          created_at: string | null
          description: string
          evidence: Json | null
          id: string
          location: Json | null
          report_type: string
          reported_user_id: string | null
          reporter_id: string
          resolved_at: string | null
          resolved_by: string | null
          ride_id: string | null
          severity: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          evidence?: Json | null
          id?: string
          location?: Json | null
          report_type: string
          reported_user_id?: string | null
          reporter_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          ride_id?: string | null
          severity?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          evidence?: Json | null
          id?: string
          location?: Json | null
          report_type?: string
          reported_user_id?: string | null
          reporter_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          ride_id?: string | null
          severity?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "safety_reports_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          error_message: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          success: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      service_bookings: {
        Row: {
          booking_address: string | null
          booking_date: string
          booking_time: string | null
          created_at: string | null
          customer_id: string | null
          description: string | null
          id: string
          notes: string | null
          payment_status: string | null
          provider_id: string | null
          service_category_id: string | null
          service_description: string | null
          service_type: string | null
          status: Database["public"]["Enums"]["service_booking_status"] | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          booking_address?: string | null
          booking_date: string
          booking_time?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          payment_status?: string | null
          provider_id?: string | null
          service_category_id?: string | null
          service_description?: string | null
          service_type?: string | null
          status?: Database["public"]["Enums"]["service_booking_status"] | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          booking_address?: string | null
          booking_date?: string
          booking_time?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          payment_status?: string | null
          provider_id?: string | null
          service_category_id?: string | null
          service_description?: string | null
          service_type?: string | null
          status?: Database["public"]["Enums"]["service_booking_status"] | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_bookings_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      service_provider_profiles: {
        Row: {
          business_name: string
          created_at: string
          description: string | null
          email: string | null
          hourly_rate_max: number
          hourly_rate_min: number
          id: string
          is_active: boolean | null
          location_address: string
          phone: string | null
          provider_type: string
          rating: number | null
          updated_at: string
          user_id: string | null
          verification_status: string | null
        }
        Insert: {
          business_name: string
          created_at?: string
          description?: string | null
          email?: string | null
          hourly_rate_max?: number
          hourly_rate_min?: number
          id?: string
          is_active?: boolean | null
          location_address: string
          phone?: string | null
          provider_type: string
          rating?: number | null
          updated_at?: string
          user_id?: string | null
          verification_status?: string | null
        }
        Update: {
          business_name?: string
          created_at?: string
          description?: string | null
          email?: string | null
          hourly_rate_max?: number
          hourly_rate_min?: number
          id?: string
          is_active?: boolean | null
          location_address?: string
          phone?: string | null
          provider_type?: string
          rating?: number | null
          updated_at?: string
          user_id?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      shared_rides: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          permission_level: string
          ride_id: string
          shared_by_user_id: string
          shared_with_user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          permission_level?: string
          ride_id: string
          shared_by_user_id: string
          shared_with_user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          permission_level?: string
          ride_id?: string
          shared_by_user_id?: string
          shared_with_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_rides_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sokko_chats: {
        Row: {
          created_at: string
          id: string
          provider_id: string | null
          service_type: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          provider_id?: string | null
          service_type?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          provider_id?: string | null
          service_type?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sokko_chats_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["user_id"]
          },
        ]
      }
      surge_pricing: {
        Row: {
          created_at: string | null
          days_of_week: number[] | null
          end_time: string | null
          id: string
          is_active: boolean | null
          location_bounds: Json
          location_name: string
          start_time: string | null
          surge_multiplier: number
          updated_at: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Insert: {
          created_at?: string | null
          days_of_week?: number[] | null
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          location_bounds: Json
          location_name: string
          start_time?: string | null
          surge_multiplier?: number
          updated_at?: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Update: {
          created_at?: string | null
          days_of_week?: number[] | null
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          location_bounds?: Json
          location_name?: string
          start_time?: string | null
          surge_multiplier?: number
          updated_at?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          order_id: string
          payment_data: Json | null
          payment_method: string
          status: string | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          order_id: string
          payment_data?: Json | null
          payment_method: string
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          order_id?: string
          payment_data?: Json | null
          payment_method?: string
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mentions: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          mentioned_user_id: string
          mentioning_user_id: string
          message_id: string | null
          post_id: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          mentioned_user_id: string
          mentioning_user_id: string
          message_id?: string | null
          post_id?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          mentioned_user_id?: string
          mentioning_user_id?: string
          message_id?: string | null
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_mentions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "forum_post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_mentions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_mentions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          is_active?: boolean | null
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: never
          is_active?: boolean | null
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vendor_applications: {
        Row: {
          admin_notes: string | null
          bank_details: Json | null
          business_address: string
          business_description: string
          business_email: string
          business_license: string | null
          business_name: string
          business_phone: string
          documents: Json | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          service_type: string | null
          status: string | null
          submitted_at: string
          tax_id: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          bank_details?: Json | null
          business_address: string
          business_description: string
          business_email: string
          business_license?: string | null
          business_name: string
          business_phone: string
          documents?: Json | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_type?: string | null
          status?: string | null
          submitted_at?: string
          tax_id?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          bank_details?: Json | null
          business_address?: string
          business_description?: string
          business_email?: string
          business_license?: string | null
          business_name?: string
          business_phone?: string
          documents?: Json | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_type?: string | null
          status?: string | null
          submitted_at?: string
          tax_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vendor_coupon_requests: {
        Row: {
          admin_notes: string | null
          coupon_type: string
          created_at: string
          discount_value: number
          generated_coupon_id: string | null
          id: string
          minimum_order_amount: number | null
          requested_by: string
          requested_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          usage_limit: number | null
          vendor_id: string
        }
        Insert: {
          admin_notes?: string | null
          coupon_type?: string
          created_at?: string
          discount_value: number
          generated_coupon_id?: string | null
          id?: string
          minimum_order_amount?: number | null
          requested_by: string
          requested_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          usage_limit?: number | null
          vendor_id: string
        }
        Update: {
          admin_notes?: string | null
          coupon_type?: string
          created_at?: string
          discount_value?: number
          generated_coupon_id?: string | null
          id?: string
          minimum_order_amount?: number | null
          requested_by?: string
          requested_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          usage_limit?: number | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_coupon_requests_generated_coupon_id_fkey"
            columns: ["generated_coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_coupon_requests_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          banner_url: string | null
          business_address: string | null
          business_description: string | null
          business_email: string | null
          business_license: string | null
          business_name: string
          business_phone: string | null
          commission_rate: number | null
          created_at: string
          id: string
          is_active: boolean | null
          logo_url: string | null
          social_media: Json | null
          updated_at: string
          user_id: string
          verification_status: string | null
          website_url: string | null
        }
        Insert: {
          banner_url?: string | null
          business_address?: string | null
          business_description?: string | null
          business_email?: string | null
          business_license?: string | null
          business_name: string
          business_phone?: string | null
          commission_rate?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          social_media?: Json | null
          updated_at?: string
          user_id: string
          verification_status?: string | null
          website_url?: string | null
        }
        Update: {
          banner_url?: string | null
          business_address?: string | null
          business_description?: string | null
          business_email?: string | null
          business_license?: string | null
          business_name?: string
          business_phone?: string | null
          commission_rate?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          social_media?: Json | null
          updated_at?: string
          user_id?: string
          verification_status?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_driver_application: {
        Args: { p_application_id: string }
        Returns: string
      }
      approve_medical_provider_application: {
        Args: { p_application_id: string }
        Returns: string
      }
      approve_vendor_application: {
        Args: Record<PropertyKey, never> | { application_id: string }
        Returns: string
      }
      calculate_coupon_discount: {
        Args: {
          p_coupon_code: string
          p_order_amount: number
          p_user_id: string
          p_product_categories?: string[]
        }
        Returns: Json
      }
      can_view_product: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_user_role: {
        Args: { check_role: string }
        Returns: boolean
      }
      create_admin_user: {
        Args: {
          admin_email: string
          admin_password: string
          admin_full_name: string
        }
        Returns: string
      }
      expire_old_ride_requests: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      find_nearby_drivers: {
        Args: {
          pickup_lat: number
          pickup_lng: number
          vehicle_type_param: Database["public"]["Enums"]["vehicle_type"]
          radius_km?: number
        }
        Returns: {
          driver_id: string
          distance_km: number
          estimated_pickup_minutes: number
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_driver_analytics: {
        Args: Record<PropertyKey, never> | { p_driver_id: string }
        Returns: Json
      }
      get_popular_routes: {
        Args: Record<PropertyKey, never> | { limit_count: number }
        Returns: {
          from_address: string
          to_address: string
          ride_count: number
          avg_fare: number
          avg_duration_minutes: number
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      increment_post_views: {
        Args: { post_id: string }
        Returns: undefined
      }
      increment_property_views: {
        Args: { property_id_param: string }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never> | { check_user_id?: string }
        Returns: boolean
      }
      is_admin_user: {
        Args: { check_user_id: string }
        Returns: boolean
      }
      is_user_admin: {
        Args: { check_email: string }
        Returns: boolean
      }
      list_backups: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          backup_name: string
          backup_type: string
          created_at: string
          created_by: string
          file_path: string
          tables_count: number
          status: string
          file_size_mb: number
        }[]
      }
      place_order_with_stock_update: {
        Args: {
          p_user_id: string
          p_total_amount: number
          p_shipping_address: string
          p_shipping_city: string
          p_contact_phone: string
          p_contact_email: string
          p_payment_method: string
          p_transaction_id: string
          p_payment_status: string
          p_cart_items: Json
        }
        Returns: string
      }
      reject_driver_application: {
        Args: { p_application_id: string; p_admin_notes?: string }
        Returns: undefined
      }
      reject_medical_provider_application: {
        Args: { p_application_id: string; p_admin_notes: string }
        Returns: undefined
      }
      reject_vendor_application: {
        Args:
          | Record<PropertyKey, never>
          | { application_id: string; rejection_notes?: string }
        Returns: boolean
      }
      update_product_rating: {
        Args: { product_id: number; rating: number }
        Returns: undefined
      }
      update_profile: {
        Args: {
          input_full_name?: string
          input_avatar_url?: string
          input_phone?: string
        }
        Returns: {
          address: string | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
      }
      upsert_profile: {
        Args: {
          p_user_id: string
          p_email: string
          p_full_name?: string
          p_avatar_url?: string
        }
        Returns: {
          address: string | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }[]
      }
      upsert_recently_viewed: {
        Args: { p_user_id: string; p_product_id: string }
        Returns: undefined
      }
    }
    Enums: {
      driver_status: "offline" | "available" | "busy"
      listing_type: "sale" | "rent"
      medical_facility_type:
        | "hospital"
        | "clinic"
        | "pharmacy"
        | "laboratory"
        | "Hospital"
        | "Clinic"
        | "Pharmacy"
        | "Laboratory"
      medical_provider_type:
        | "doctor"
        | "nurse"
        | "pharmacist"
        | "lab_technician"
        | "ambulance_driver"
        | "dentist"
        | "physiotherapist"
      order_status_type:
        | "pending"
        | "confirmed"
        | "processing"
        | "packed"
        | "shipped"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
        | "refunded"
      property_status: "available" | "sold" | "rented" | "pending"
      property_type: "house" | "apartment" | "land" | "commercial" | "office"
      ride_status:
        | "requested"
        | "accepted"
        | "in_progress"
        | "completed"
        | "cancelled"
      service_booking_status:
        | "pending"
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "rejected"
        | "confirmed"
      user_role:
        | "admin"
        | "customer"
        | "vendor"
        | "driver"
        | "property_owner"
        | "rider"
        | "service_provider"
      vehicle_type: "taxi" | "motorbike" | "delivery"
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
      driver_status: ["offline", "available", "busy"],
      listing_type: ["sale", "rent"],
      medical_facility_type: [
        "hospital",
        "clinic",
        "pharmacy",
        "laboratory",
        "Hospital",
        "Clinic",
        "Pharmacy",
        "Laboratory",
      ],
      medical_provider_type: [
        "doctor",
        "nurse",
        "pharmacist",
        "lab_technician",
        "ambulance_driver",
        "dentist",
        "physiotherapist",
      ],
      order_status_type: [
        "pending",
        "confirmed",
        "processing",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "refunded",
      ],
      property_status: ["available", "sold", "rented", "pending"],
      property_type: ["house", "apartment", "land", "commercial", "office"],
      ride_status: [
        "requested",
        "accepted",
        "in_progress",
        "completed",
        "cancelled",
      ],
      service_booking_status: [
        "pending",
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
        "rejected",
        "confirmed",
      ],
      user_role: [
        "admin",
        "customer",
        "vendor",
        "driver",
        "property_owner",
        "rider",
        "service_provider",
      ],
      vehicle_type: ["taxi", "motorbike", "delivery"],
    },
  },
} as const
