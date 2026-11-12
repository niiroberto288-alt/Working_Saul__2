<script setup>
import { computed } from 'vue'
import {
  CheckCircleIcon,
  ClockIcon,
  PencilSquareIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'
import { strings } from '@/assets/strings'
import { LOG_STATUS } from '@/config'

const props = defineProps({
  status: { type: String, default: LOG_STATUS.PENDING },
  size: { type: String, default: 'md' },
})

// Status is never conveyed by colour alone: every pill carries an icon and text.
const config = computed(() => {
  const map = {
    [LOG_STATUS.DRAFT]: {
      label: strings.status.Draft.label,
      icon: PencilSquareIcon,
      classes: 'border-line-strong text-ink-soft bg-transparent',
    },
    [LOG_STATUS.PENDING]: {
      label: strings.status.Pending.label,
      icon: ClockIcon,
      classes: 'border-warn/40 text-warn bg-warn/10 animate-pulse-soft',
    },
    [LOG_STATUS.APPROVED]: {
      label: strings.status.Approved.label,
      icon: CheckCircleIcon,
      classes: 'border-ok/40 text-ok bg-ok/10',
    },
    [LOG_STATUS.REJECTED]: {
      label: strings.status.Rejected.label,
      icon: ArrowPathIcon,
      classes: 'border-danger/40 text-danger bg-danger/10',
    },
  }

  return (
    map[props.status] ?? {
      label: props.status,
      icon: ClockIcon,
      classes: 'border-line text-ink-soft bg-transparent',
    }
  )
})

const sizeClass = computed(() =>
  props.size === 'sm' ? 'gap-1 px-2 py-0.5 text-[0.58rem]' : 'gap-1.5 px-2.5 py-1 text-[0.62rem]'
)
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full border font-mono uppercase tracking-[0.14em] whitespace-nowrap',
      config.classes,
      sizeClass,
    ]"
  >
    <component :is="config.icon" class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    <span>{{ config.label }}</span>
  </span>
</template>
