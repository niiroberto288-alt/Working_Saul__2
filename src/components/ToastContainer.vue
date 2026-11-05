<script setup>
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { useToast } from '@/composables/useToast'
import { strings } from '@/assets/strings'

const { toasts, dismiss } = useToast()

const icons = {
  success: CheckCircleIcon,
  error: ExclamationTriangleIcon,
  info: InformationCircleIcon,
}

function iconFor(type) {
  return icons[type] ?? InformationCircleIcon
}

function toneFor(type) {
  if (type === 'success') return 'border-ok/40 text-ok'
  if (type === 'error') return 'border-danger/40 text-danger'
  return 'border-line-strong text-accent'
}
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed inset-x-0 bottom-0 z-[95] flex flex-col items-start gap-3 p-4 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm sm:p-0"
      aria-live="polite"
      aria-atomic="false"
    >
      <TransitionGroup
        enter-active-class="transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        enter-from-class="opacity-0 -translate-x-6"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 -translate-x-6"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto flex w-full items-start gap-3 rounded-2xl border bg-card-solid px-4 py-3.5 shadow-[var(--shadow-lift)]',
            toneFor(toast.type),
          ]"
          :role="toast.type === 'error' ? 'alert' : 'status'"
        >
          <component :is="iconFor(toast.type)" class="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div class="min-w-0 flex-1">
            <p
              v-if="toast.title"
              class="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ink"
            >
              {{ toast.title }}
            </p>
            <p class="mt-0.5 text-sm leading-snug text-ink-soft">{{ toast.message }}</p>
          </div>
          <button
            type="button"
            class="rounded-full p-1 text-ink-soft transition-colors hover:text-ink"
            :aria-label="strings.common.dismiss"
            @click="dismiss(toast.id)"
          >
            <XMarkIcon class="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
