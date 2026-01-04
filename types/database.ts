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
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          role: 'founder' | 'investor' | 'talent' | 'enterprise' | 'community'
          company: string | null
          title: string | null
          city: string | null
          linkedin_url: string | null
          twitter_url: string | null
          website_url: string | null
          is_verified: boolean
          is_premium: boolean
          interests: string[]
          looking_for: string[]
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: 'founder' | 'investor' | 'talent' | 'enterprise' | 'community'
          company?: string | null
          title?: string | null
          city?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          website_url?: string | null
          is_verified?: boolean
          is_premium?: boolean
          interests?: string[]
          looking_for?: string[]
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      startups: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          founder_id: string
          name: string
          tagline: string | null
          description: string | null
          logo_url: string | null
          website_url: string | null
          stage: 'idea' | 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'growth'
          sector: string | null
          city: string | null
          team_size: number | null
          funding_raised: number | null
          is_raising: boolean
          raise_amount: number | null
          pitch_deck_url: string | null
          is_featured: boolean
        }
        Insert: Omit<Database['public']['Tables']['startups']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['startups']['Insert']>
      }
      events: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          description: string | null
          content: string | null
          cover_image_url: string | null
          event_date: string
          event_time: string | null
          location: string | null
          city: string | null
          is_virtual: boolean
          virtual_link: string | null
          capacity: number | null
          is_featured: boolean
          is_published: boolean
          organizer_id: string | null
          tags: string[]
        }
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['events']['Insert']>
      }
      event_rsvps: {
        Row: {
          id: string
          created_at: string
          event_id: string
          user_id: string
          status: 'registered' | 'waitlist' | 'attended' | 'cancelled'
          notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['event_rsvps']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['event_rsvps']['Insert']>
      }
      introductions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          requester_id: string
          target_id: string
          connector_id: string | null
          status: 'pending' | 'accepted' | 'declined' | 'completed'
          message: string | null
          outcome: string | null
        }
        Insert: Omit<Database['public']['Tables']['introductions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['introductions']['Insert']>
      }
      blog_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          published_at: string | null
          author_id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          cover_image_url: string | null
          is_published: boolean
          is_featured: boolean
          tags: string[]
          reading_time: number | null
        }
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>
      }
      deals: {
        Row: {
          id: string
          created_at: string
          startup_id: string
          investor_id: string
          amount: number | null
          stage: string | null
          announced_at: string | null
          is_via_network: boolean
          notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['deals']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['deals']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'founder' | 'investor' | 'talent' | 'enterprise' | 'community'
      startup_stage: 'idea' | 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'growth'
      intro_status: 'pending' | 'accepted' | 'declined' | 'completed'
      rsvp_status: 'registered' | 'waitlist' | 'attended' | 'cancelled'
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Startup = Database['public']['Tables']['startups']['Row']
export type Event = Database['public']['Tables']['events']['Row']
export type EventRSVP = Database['public']['Tables']['event_rsvps']['Row']
export type Introduction = Database['public']['Tables']['introductions']['Row']
export type BlogPost = Database['public']['Tables']['blog_posts']['Row']
export type Deal = Database['public']['Tables']['deals']['Row']
