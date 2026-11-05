/**
 * Typewriter quote (FURPS+ 5): 20ms per character, hover on pointer devices,
 * tap on touch devices. Respects prefers-reduced-motion.
 */
import { onScopeDispose, ref } from 'vue'
import { TYPEWRITER_SPEED_MS } from '@/config'

export function useTypewriter(text, { speed = TYPEWRITER_SPEED_MS } = {}) {
  const output = ref('')
  const isTyping = ref(false)
  let timer = null

  function stop() {
    if (timer !== null) {
      window.clearTimeout(timer)
      timer = null
    }
    isTyping.value = false
  }

  function reset() {
    stop()
    output.value = ''
  }

  function play() {
    if (isTyping.value || output.value === text) return

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true

    if (reducedMotion) {
      output.value = text
      return
    }

    stop()
    isTyping.value = true
    output.value = ''

    let index = 0

    const tick = () => {
      index += 1
      output.value = text.slice(0, index)

      if (index < text.length) {
        timer = window.setTimeout(tick, speed)
      } else {
        timer = null
        isTyping.value = false
      }
    }

    timer = window.setTimeout(tick, speed)
  }

  onScopeDispose(stop)

  return { output, isTyping, play, reset }
}

export default useTypewriter
