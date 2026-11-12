/**
 * Friendly error messages (FURPS+ R1).
 *
 * Postgres and Supabase errors are for developers. Users see one of the
 * messages declared in strings.js; the raw error goes to logger.
 */
import { strings } from '@/assets/strings'
import { logger } from '@/utils/logger'

const NETWORK_CODES = [
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EAI_AGAIN',
  'NETWORK_ERROR',
  'Failed to fetch',
]

const UNIQUE_VIOLATION = '23505'
const FOREIGN_KEY_VIOLATION = '23503'
const CHECK_VIOLATION = '23514'
const INSUFFICIENT_PRIVILEGE = '42501'
const RLS_VIOLATION = 'PGRST301'

/**
 * @param {unknown} error
 * @param {string} [fallback]
 * @returns {string} a message safe to show in the interface
 */
export function friendlyError(error, fallback = strings.errors.generic) {
  if (!error) return fallback

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return strings.errors.network
  }

  const message = String(error.message ?? '')
  const code = String(error.code ?? '')
  const status = Number(error.status ?? 0)
  const lower = message.toLowerCase()

  if (NETWORK_CODES.some((token) => lower.includes(token.toLowerCase()))) {
    return strings.errors.network
  }

  if (code === UNIQUE_VIOLATION) return strings.errors.conflict
  if (status === 401 || code === RLS_VIOLATION) return strings.errors.unauthorised
  if (status === 403 || code === INSUFFICIENT_PRIVILEGE) return strings.errors.unauthorised
  if (status === 404) return strings.errors.notFound
  if (code === CHECK_VIOLATION || code === FOREIGN_KEY_VIOLATION) {
    return 'That is not allowed by the logbook rules.'
  }
  if (lower.includes('invalid login credentials')) {
    return 'That email and password combination did not work.'
  }
  if (lower.includes('already registered') || lower.includes('already exists')) {
    return 'An account with that email already exists.'
  }

  return fallback
}

/** Log details in development only; never render them. */
export function reportError(context, error) {
  logger.error(context, error)
}

export default { friendlyError, reportError }
