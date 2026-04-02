import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Supabase Client - Used for direct-to-cloud file uploads 
 * Ensure 'materi' bucket is created and set to Public in Supabase Dashboard.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
