export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string
          role: 'user' | 'driver' | 'admin' | 'company'
          avatar_url: string | null
          company_id: string | null
          status: 'pending' | 'approved' | 'rejected' | 'suspended'
          payment_due: string | null
          last_payment_date: string | null
          stripe_customer_id: string | null
          email_verified: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name: string
          role?: 'user' | 'driver' | 'admin' | 'company'
          avatar_url?: string | null
          company_id?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          payment_due?: string | null
          last_payment_date?: string | null
          stripe_customer_id?: string | null
          email_verified?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string
          role?: 'user' | 'driver' | 'admin' | 'company'
          avatar_url?: string | null
          company_id?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          payment_due?: string | null
          last_payment_date?: string | null
          stripe_customer_id?: string | null
          email_verified?: boolean
        }
      }
      companies: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          registration_number: string
          taxi_license: string
          fleet_size: number
          status: 'pending' | 'approved' | 'rejected' | 'suspended'
          stripe_subscription_id: string | null
          subscription_status: 'active' | 'past_due' | 'canceled' | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone: string
          registration_number: string
          taxi_license: string
          fleet_size: number
          status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          stripe_subscription_id?: string | null
          subscription_status?: 'active' | 'past_due' | 'canceled' | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string
          registration_number?: string
          taxi_license?: string
          fleet_size?: number
          status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          stripe_subscription_id?: string | null
          subscription_status?: 'active' | 'past_due' | 'canceled' | null
        }
      }
      drivers: {
        Row: {
          id: string
          created_at: string
          user_id: string
          company_id: string
          license_number: string
          license_expiry: string
          vehicle_id: string | null
          status: 'active' | 'inactive' | 'suspended'
          rating: number | null
          total_rides: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          company_id: string
          license_number: string
          license_expiry: string
          vehicle_id?: string | null
          status?: 'active' | 'inactive' | 'suspended'
          rating?: number | null
          total_rides?: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          company_id?: string
          license_number?: string
          license_expiry?: string
          vehicle_id?: string | null
          status?: 'active' | 'inactive' | 'suspended'
          rating?: number | null
          total_rides?: number
        }
      }
      vehicles: {
        Row: {
          id: string
          created_at: string
          company_id: string
          make: string
          model: string
          year: number
          color: string
          license_plate: string
          status: 'active' | 'maintenance' | 'retired'
          last_inspection: string
          next_inspection: string
        }
        Insert: {
          id?: string
          created_at?: string
          company_id: string
          make: string
          model: string
          year: number
          color: string
          license_plate: string
          status?: 'active' | 'maintenance' | 'retired'
          last_inspection: string
          next_inspection: string
        }
        Update: {
          id?: string
          created_at?: string
          company_id?: string
          make?: string
          model?: string
          year?: number
          color?: string
          license_plate?: string
          status?: 'active' | 'maintenance' | 'retired'
          last_inspection?: string
          next_inspection?: string
        }
      }
      rides: {
        Row: {
          id: string
          created_at: string
          user_id: string
          driver_id: string
          vehicle_id: string
          pickup_location: Json
          dropoff_location: Json
          status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'canceled'
          start_time: string | null
          end_time: string | null
          fare: number | null
          payment_status: 'pending' | 'paid' | 'failed'
          rating: number | null
          review: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          driver_id: string
          vehicle_id: string
          pickup_location: Json
          dropoff_location: Json
          status?: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'canceled'
          start_time?: string | null
          end_time?: string | null
          fare?: number | null
          payment_status?: 'pending' | 'paid' | 'failed'
          rating?: number | null
          review?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          driver_id?: string
          vehicle_id?: string
          pickup_location?: Json
          dropoff_location?: Json
          status?: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'canceled'
          start_time?: string | null
          end_time?: string | null
          fare?: number | null
          payment_status?: 'pending' | 'paid' | 'failed'
          rating?: number | null
          review?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
