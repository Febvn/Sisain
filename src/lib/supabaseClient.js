import { createClient } from '@supabase/supabase-js'

// Ganti URL dan KEY ini dari Dashboard Supabase Anda nanti
const supabaseUrl = 'https://your-project-url.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
