/**
 * Reveal-on-scroll (FURPS+ 5 / P4).
 *
 * One shared IntersectionObserver at 15% threshold; elements are unobserved
 * once revealed so scrolling stays cheap. Siblings stagger by 70ms.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const REVEAL_THRESHOLD = 0.15
const STAGGER_MS = 70

let observer = null

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true
  )
}

function getObserver() {
  if (observer || typeof window === 'undefined') return observer
  if (typeof IntersectionObserver === 'undefined') return null

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const element = entry.target
        element.classList.add('is-revealed')
        // The gold mark scales in once the block is visible.
        element.querySelectorAll?.('.mark-underline').forEach((mark) => {
          mark.classList.add('is-revealed')
        })
        observer.unobserve(element)
      })
    },
    { threshold: REVEAL_THRESHOLD }
  )

  return observer
}

function delayFor(element, value) {
  if (typeof value === 'number') return value * STAGGER_MS
  if (typeof value === 'object' && value !== null) {
    if (typeof value.delay === 'number') return value.delay
    if (typeof value.index === 'number') return value.index * STAGGER_MS
  }
  const siblingIndex = Number(element.dataset.revealIndex ?? Number.NaN)
  return Number.isFinite(siblingIndex) ? siblingIndex * STAGGER_MS : 0
}

function revealNow(element) {
  element.classList.add('is-revealed')
  element.querySelectorAll?.('.mark-underline').forEach((mark) => mark.classList.add('is-revealed'))
}

/** v-reveal, v-reveal="3" or v-reveal="{ delay: 140 }". */
export const vReveal = {
  mounted(element, binding) {
    element.classList.add('reveal')

    if (prefersReducedMotion()) {
      revealNow(element)
      return
    }

    const delay = delayFor(element, binding.value)
    if (delay > 0) {
      element.style.setProperty('--reveal-delay', `${delay}ms`)
    }

    const instance = getObserver()
    if (instance) {
      instance.observe(element)
    } else {
      revealNow(element)
    }
  },
  unmounted(element) {
    observer?.unobserve(element)
  },
}

/**
 * Imperative variant for elements that need a template ref instead of a
 * directive (for example a component root).
 */
export function useReveal(options = {}) {
  const target = ref(null)
  let instance = null

  onMounted(() => {
    if (!target.value) return

    target.value.classList.add('reveal')

    if (prefersReducedMotion()) {
      revealNow(target.value)
      return
    }

    if (typeof options.delay === 'number' && options.delay > 0) {
      target.value.style.setProperty('--reveal-delay', `${options.delay}ms`)
    }

    instance = getObserver()
    instance?.observe(target.value)
  })

  onBeforeUnmount(() => {
    if (target.value) {
      instance?.unobserve(target.value)
    }
  })

  return { target }
}

export default useReveal
