/**
 * Database Type Definitions
 *
 * This file contains TypeScript type definitions for Supabase database tables.
 * Run `supabase gen types typescript --local` to regenerate these types after schema changes.
 */

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
          email: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          website: string | null
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          updated_at?: string
        }
      }
      cities: {
        Row: {
          id: string
          slug: string
          name: string
          name_en: string | null
          description: string | null
          image_url: string | null
          region: string | null
          population: number | null
          wifi_rating: number | null
          cafe_rating: number | null
          cost_rating: number | null
          safety_rating: number | null
          community_rating: number | null
          overall_rating: number | null
          tags: string[] | null
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          name_en?: string | null
          description?: string | null
          image_url?: string | null
          region?: string | null
          population?: number | null
          wifi_rating?: number | null
          cafe_rating?: number | null
          cost_rating?: number | null
          safety_rating?: number | null
          community_rating?: number | null
          overall_rating?: number | null
          tags?: string[] | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          name_en?: string | null
          description?: string | null
          image_url?: string | null
          region?: string | null
          population?: number | null
          wifi_rating?: number | null
          cafe_rating?: number | null
          cost_rating?: number | null
          safety_rating?: number | null
          community_rating?: number | null
          overall_rating?: number | null
          tags?: string[] | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          city_id: string | null
          title: string
          content: string
          category: string
          tags: string[] | null
          views: number
          likes_count: number
          comments_count: number
          is_pinned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          city_id?: string | null
          title: string
          content: string
          category?: string
          tags?: string[] | null
          views?: number
          likes_count?: number
          comments_count?: number
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          city_id?: string | null
          title?: string
          content?: string
          category?: string
          tags?: string[] | null
          views?: number
          likes_count?: number
          comments_count?: number
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          post_id: string
          parent_id: string | null
          content: string
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          parent_id?: string | null
          content: string
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          parent_id?: string | null
          content?: string
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      meetups: {
        Row: {
          id: string
          user_id: string
          city_id: string
          title: string
          description: string
          location: string | null
          meetup_date: string
          max_participants: number | null
          current_participants: number
          status: string
          image_url: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          city_id: string
          title: string
          description: string
          location?: string | null
          meetup_date: string
          max_participants?: number | null
          current_participants?: number
          status?: string
          image_url?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          city_id?: string
          title?: string
          description?: string
          location?: string | null
          meetup_date?: string
          max_participants?: number | null
          current_participants?: number
          status?: string
          image_url?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      meetup_participants: {
        Row: {
          id: string
          meetup_id: string
          user_id: string
          status: string
          joined_at: string
        }
        Insert: {
          id?: string
          meetup_id: string
          user_id: string
          status?: string
          joined_at?: string
        }
        Update: {
          id?: string
          meetup_id?: string
          user_id?: string
          status?: string
          joined_at?: string
        }
      }
      post_likes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
      }
      comment_likes: {
        Row: {
          id: string
          comment_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          comment_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          comment_id?: string
          user_id?: string
          created_at?: string
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

// Type helpers for Supabase queries
export type Tables = Database['public']['Tables']
export type Profiles = Tables['profiles']['Row']
export type ProfilesInsert = Tables['profiles']['Insert']
export type ProfilesUpdate = Tables['profiles']['Update']
export type Cities = Tables['cities']['Row']
export type CitiesInsert = Tables['cities']['Insert']
export type CitiesUpdate = Tables['cities']['Update']
export type Posts = Tables['posts']['Row']
export type PostsInsert = Tables['posts']['Insert']
export type PostsUpdate = Tables['posts']['Update']
export type Comments = Tables['comments']['Row']
export type CommentsInsert = Tables['comments']['Insert']
export type CommentsUpdate = Tables['comments']['Update']
export type Meetups = Tables['meetups']['Row']
export type MeetupsInsert = Tables['meetups']['Insert']
export type MeetupsUpdate = Tables['meetups']['Update']
export type MeetupParticipants = Tables['meetup_participants']['Row']
export type MeetupParticipantsInsert = Tables['meetup_participants']['Insert']
export type PostLikes = Tables['post_likes']['Row']
export type CommentLikes = Tables['comment_likes']['Row']

// Post with profile joined
export type PostWithProfile = Posts & {
  profiles: Profiles | null
  cities: Cities | null
}

// Comment with profile joined
export type CommentWithProfile = Comments & {
  profiles: Profiles | null
}

// Meetup with profile and city joined
export type MeetupWithDetails = Meetups & {
  profiles: Profiles | null
  cities: Cities | null
  is_participant?: boolean
  participant_count?: number
}
