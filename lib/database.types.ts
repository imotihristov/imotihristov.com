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
      properties: {
        Row: {
          id: number
          title: string
          description: string
          location: string
          city: string
          neighborhood: string | null
          price: number
          currency: string
          price_per_sqm: number | null
          image: string
          images: string[] | null
          beds: number | null
          baths: number | null
          rooms: number | null
          floor: string | null
          area: number
          type: 'sale' | 'rent'
          category: string
          construction_type: string | null
          is_new: boolean
          is_top: boolean
          is_recommended: boolean
          status: 'active' | 'archived'
          date: string
          features: string[]
          broker_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          location: string
          city: string
          neighborhood?: string | null
          price: number
          currency?: string
          price_per_sqm?: number | null
          image: string
          images?: string[] | null
          beds?: number | null
          baths?: number | null
          rooms?: number | null
          floor?: string | null
          area: number
          type: 'sale' | 'rent'
          category: string
          construction_type?: string | null
          is_new?: boolean
          is_top?: boolean
          is_recommended?: boolean
          status?: 'active' | 'archived'
          date?: string
          features?: string[]
          broker_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          location?: string
          city?: string
          neighborhood?: string | null
          price?: number
          currency?: string
          price_per_sqm?: number | null
          image?: string
          images?: string[] | null
          beds?: number | null
          baths?: number | null
          rooms?: number | null
          floor?: string | null
          area?: number
          type?: 'sale' | 'rent'
          category?: string
          construction_type?: string | null
          is_new?: boolean
          is_top?: boolean
          is_recommended?: boolean
          status?: 'active' | 'archived'
          date?: string
          features?: string[]
          broker_id?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      brokers: {
        Row: {
          id: number
          name: string
          role: string
          phone: string
          email: string
          image: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          role: string
          phone: string
          email: string
          image: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          role?: string
          phone?: string
          email?: string
          image?: string
          created_at?: string
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: number
          name: string
          phone: string
          email: string
          subject: string
          message: string
          gdpr_consent: boolean
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          phone: string
          email: string
          subject?: string
          message: string
          gdpr_consent?: boolean
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          phone?: string
          email?: string
          subject?: string
          message?: string
          gdpr_consent?: boolean
          is_read?: boolean
          created_at?: string
        }
      }
      site_settings: {
        Row: {
          id: number
          key: string
          value: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          key: string
          value: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          key?: string
          value?: Json
          created_at?: string
          updated_at?: string
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
