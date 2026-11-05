/**
 * Count-up numbers (FURPS+ 5): 1500ms ease-out cubic, once, when scrolled in.
 */
import { onScopeDispose, ref } from 'vue'
import { COUNT_UP_DURATION_MS } from '@/config'

function easeOutCubic(progress) {
  return 1 - Math.pow(1 - progress, 3)
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true
  )
}

export function useCountUp({ duration = COUNT_UP_DURATION_MS, decimals = 0 } = {}) {
  const displayed = ref(0)
  const hasPlayed = ref(false)
  let frame = null

  function format(value) {
    return Number(value).toLocaleString('en-GB', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  function cancel() {
    if (frame !== null) {
      window.cancelAnimationFrame(frame)
      frame = null
    }
  }

  function play(targetValue) {
    const target = Number(targetValue)

    if (!Number.isFinite(target)) {
      displayed.value = targetValue
      hasPlayed.value = true
      return
    }

    if (prefersReducedMotion()) {
      displayed.value = format(target)
      hasPlayed.value = true
      return
    }

    cancel()
    hasPlayed.value = true

    const from = 0
    const startedAt = performance.now()

    const step = (now) => {
      const elapsed = now - startedAt
      const progress = Math.min(1, elapsed / duration)
      const value = from + (target - from) * easeOutCubic(progress)
      displayed.value = format(value)

      if (progress < 1) {
        frame = window.requestAnimationFrame(step)
      } else {
        displayed.value = format(target)
        frame = null
      }
    }

    frame = window.requestAnimationFrame(step)
  }

  onScopeDispose(cancel)

  return { displayed, hasPlayed, play, cancel }
}

export default useCountUp
