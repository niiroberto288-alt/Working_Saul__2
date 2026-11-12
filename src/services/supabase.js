/**
 * The single Supabase client module (FURPS+ C2).
 *
 * Nothing else in the app imports @supabase/supabase-js. Composables call this
 * module; components call composables.
 *
 * Modes:
 *  - live          keys present, real Auth + database
 *  - demo          no keys and (dev build or VITE_DEMO_MODE=true), in-memory data
 *  - unconfigured  no keys in a production build: show "App not configured"
 *
 * Demo mode is never reachable in a production build unless the deployer
 * explicitly sets VITE_DEMO_MODE=true (FURPS+ C4).
 */
import { createClient } from '@supabase/supabase-js'
import { CONFIG_ERROR } from '@/config'
import { logger } from '@/utils/logger'

const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const supabaseAnonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

/** Demo mode is opt-in in production and automatic in development. */
const demoRequested = import.meta.env.DEV === true || __DEMO_BUILD__

let client = null

if (hasSupabaseConfig) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      global: {
        headers: { 'x-application-name': 'attachtrack-rwanda' },
      },
    })
  } catch (error) {
    logger.error('Could not create the Supabase client', error)
    client = null
  }
}

/** Demo only when there is no usable client (FURPS+ C4). */
export const isDemoMode = !client && demoRequested

export const APP_MODE = client ? 'live' : isDemoMode ? 'demo' : 'unconfigured'

export const isAppConfigured = APP_MODE !== 'unconfigured'

/** Reason surfaced by the App-not-configured page. */
export const configIssue = APP_MODE === 'unconfigured' ? CONFIG_ERROR.MISSING_KEYS : null

/** Null in demo and unconfigured modes. Always check before using. */
export const supabase = client

export function requireSupabase() {
  if (!client) {
    throw new Error('Supabase client is not configured')
  }
  return client
}

export default supabase
