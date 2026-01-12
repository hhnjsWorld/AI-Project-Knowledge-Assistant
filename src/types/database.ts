/**
 * DATA CONTRACT RULE
 * 
 * 1. This file reflects the EXACT structure of the Supabase Database (Rows).
 * 2. UI Components SHOULD NOT import types directly from here if possible.
 * 3. Future Phase 2/3 Requirement: Use DTOs (Data Transfer Objects) to map
 *    DB Row -> UI Model to prevent backend changes from breaking the frontend.
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
      projects: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          last_updated: string
          member_count: number
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          last_updated?: string
          member_count?: number
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          last_updated?: string
          member_count?: number
          user_id?: string
        }
      }
      documents: {
        Row: {
          id: string
          created_at: string
          name: string
          status: string
          source: string
          upload_date: string
          project_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          status: string
          source: string
          upload_date?: string
          project_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          status?: string
          source?: string
          upload_date?: string
          project_id?: string | null
          user_id?: string
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
