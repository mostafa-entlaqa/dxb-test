import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: ReturnType<typeof createClient> | null = null
let initializationAttempts = 0
const maxAttempts = 3

function initializeSupabase() {
  if (supabaseUrl && supabaseAnonKey) {
    try {
      supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
        },
      })
      console.log('Supabase client initialized successfully')
    } catch (error) {
      console.error('Error initializing Supabase client:', error)
      supabase = null
    }
  } else {
    console.error('Missing Supabase environment variables')
  }
}

export function getSupabase() {
  if (!supabase && initializationAttempts < maxAttempts) {
    initializeSupabase()
    initializationAttempts++
  }
  return supabase
}

