<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { strings } from '@/assets/strings'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Are you sure?' },
  body: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Confirm' },
  cancelLabel: { type: String, default: 'Cancel' },
  tone: { type: String, default: 'danger' },
  busy: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'cancel', 'update:open'])

const panel = ref(null)
let previouslyFocused = null

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

function close() {
  emit('update:open', false)
  emit('cancel')
}

function confirm() {
  if (props.busy) return
  emit('confirm')
}

function onKeydown(event) {
  if (!props.open) return

  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return
  }

  if (event.key !== 'Tab' || !panel.value) return

  const focusable = Array.from(panel.value.querySelectorAll(FOCUSABLE)).filter(
    (element) => element.offsetParent !== null
  )

  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      previouslyFocused = document.activeElement
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', onKeydown)
      await nextTick()
      const focusable = panel.value?.querySelector(FOCUSABLE)
      focusable?.focus()
    } else {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeydown)
      previouslyFocused?.focus?.()
      previouslyFocused = null
    }
  }
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-4 backdrop-blur-sm sm:items-center"
        @click.self="close"
      >
        <div
          ref="panel"
          class="card w-full max-w-md p-6 sm:p-7"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          <div class="flex items-start gap-3">
            <span
              :class="[
                'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border',
                tone === 'danger' ? 'border-danger/40 text-danger' : 'border-accent/40 text-accent',
              ]"
            >
              <ExclamationTriangleIcon class="h-5 w-5" aria-hidden="true" />
            </span>
            <div class="min-w-0 flex-1">
              <h2 id="confirm-dialog-title" class="font-serif text-2xl leading-tight text-ink">
                {{ title }}
              </h2>
              <p v-if="body" class="mt-2 text-sm leading-relaxed text-ink-soft">{{ body }}</p>
            </div>
            <button
              type="button"
              class="rounded-full p-1.5 text-ink-soft transition-colors hover:text-ink"
              :aria-label="strings.common.close"
              @click="close"
            >
              <XMarkIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" class="btn btn-outline" @click="close">
              {{ cancelLabel }}
            </button>
            <button
              type="button"
              :class="['btn', tone === 'danger' ? 'btn-danger' : 'btn-primary']"
              :disabled="busy"
              @click="confirm"
            >
              {{ busy ? strings.common.loading : confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
