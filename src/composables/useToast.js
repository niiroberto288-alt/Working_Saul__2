/**
 * Toast notifications (FURPS+ U2). Module-level queue so any composable can
 * raise feedback without prop drilling; ToastContainer renders it.
 */
import { readonly, ref } from 'vue'
import { TOAST_DURATION_MS } from '@/config'

const toasts = ref([])
const timers = new Map()
let sequence = 0

function clearTimer(id) {
  const timer = timers.get(id)
  if (timer) {
    window.clearTimeout(timer)
    timers.delete(id)
  }
}

function dismiss(id) {
  clearTimer(id)
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

function push({ type = 'info', title = '', message = '', duration = TOAST_DURATION_MS } = {}) {
  sequence += 1
  const id = `toast-${sequence}`
  const toast = { id, type, title, message }

  toasts.value = [...toasts.value, toast]

  if (duration > 0) {
    timers.set(
      id,
      window.setTimeout(() => dismiss(id), duration)
    )
  }

  return id
}

export function useToast() {
  return {
    toasts: readonly(toasts),
    push,
    dismiss,
    clear() {
      timers.forEach((timer) => window.clearTimeout(timer))
      timers.clear()
      toasts.value = []
    },
    success(message, title = 'Done') {
      return push({ type: 'success', title, message })
    },
    error(message, title = 'Something went wrong') {
      return push({ type: 'error', title, message, duration: TOAST_DURATION_MS + 1500 })
    },
    info(message, title = '') {
      return push({ type: 'info', title, message })
    },
  }
}

export default useToast
