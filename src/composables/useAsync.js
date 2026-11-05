/**
 * useAsync - the single async wrapper used across the app (FURPS+ R1).
 *
 * Returns { data, error, loading, execute, reset }. Read operations retry twice
 * with exponential backoff; writes do not retry (R5 / R3).
 */
import { onScopeDispose, ref } from 'vue'
import { friendlyError, reportError } from '@/utils/errors'

const RETRY_BASE_MS = 400

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function useAsync(operation, options = {}) {
  const {
    retries = 2,
    retry = false,
    fallbackMessage = undefined,
    onSuccess = null,
    onError = null,
  } = options

  const data = ref(options.initialData ?? null)
  const error = ref('')
  const loading = ref(false)
  let attemptToken = 0
  let cancelled = false

  onScopeDispose(() => {
    cancelled = true
  })

  async function execute(...args) {
    const token = ++attemptToken
    loading.value = true
    error.value = ''

    const maxAttempts = retry ? Math.max(1, retries + 1) : 1

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const result = await operation(...args)

        if (cancelled || token !== attemptToken) {
          return result
        }

        data.value = result
        loading.value = false
        onSuccess?.(result)
        return result
      } catch (caught) {
        const isLastAttempt = attempt === maxAttempts

        if (isLastAttempt) {
          const friendly = friendlyError(caught, fallbackMessage)
          reportError('useAsync', caught)

          if (cancelled || token !== attemptToken) {
            return null
          }

          error.value = friendly
          loading.value = false
          onError?.(caught, friendly)
          return null
        }

        await wait(RETRY_BASE_MS * Math.pow(2, attempt - 1))
      }
    }

    loading.value = false
    return null
  }

  function reset() {
    attemptToken += 1
    data.value = options.initialData ?? null
    error.value = ''
    loading.value = false
  }

  return { data, error, loading, execute, reset }
}

export default useAsync
