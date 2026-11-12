/**
 * Free-first-review requests from the landing page.
 *
 * Live mode inserts into `review_requests` (insert-only for anonymous visitors,
 * readable by admins - see supabase/schema.sql). Demo mode keeps them in memory.
 */
import { APP_MODE, supabase } from '@/services/supabase'
import { LIMITS } from '@/config'

const demoRequests = []

function clean(value, limit) {
  return String(value ?? '')
    .trim()
    .slice(0, limit)
}

export function useReviewRequests() {
  async function submit(payload) {
    const record = {
      full_name: clean(payload.fullName, LIMITS.FULL_NAME),
      email: clean(payload.email, 160).toLowerCase(),
      role: payload.role === 'supervisor' ? 'supervisor' : 'student',
      institution: clean(payload.institution, LIMITS.INSTITUTION),
      note: clean(payload.note, 600),
      created_at: new Date().toISOString(),
    }

    if (APP_MODE === 'demo') {
      await new Promise((resolve) => window.setTimeout(resolve, 600))
      demoRequests.push(record)
      return record
    }

    const { error } = await supabase.from('review_requests').insert(record)
    if (error) throw error
    return record
  }

  return { submit }
}

export default useReviewRequests
