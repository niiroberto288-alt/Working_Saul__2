<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useCountUp } from '@/composables/useCountUp'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], default: 0 },
  subtitle: { type: String, default: '' },
  color: { type: String, default: 'primary' },
  icon: { type: [Object, Function], default: null },
  suffix: { type: String, default: '' },
  decimals: { type: Number, default: 0 },
})

const root = ref(null)
const hasStarted = ref(false)
const { displayed, play } = useCountUp({ decimals: props.decimals })
let observer = null

const numeric = computed(() => {
  const parsed = Number(props.value)
  return Number.isFinite(parsed) ? parsed : null
})

const shown = computed(() =>
  numeric.value === null ? String(props.value) : String(displayed.value)
)

const accent = computed(() => {
  const palette = {
    primary: {
      chip: 'border-primary/25 text-primary dark:border-primary-2/30 dark:text-primary-2',
      bar: 'bg-primary dark:bg-primary-2',
    },
    green: { chip: 'border-ok/30 text-ok', bar: 'bg-ok' },
    yellow: { chip: 'border-gold/40 text-gold', bar: 'bg-gold' },
    purple: {
      chip: 'border-accent/35 text-accent',
      bar: 'bg-accent',
    },
    red: { chip: 'border-danger/35 text-danger', bar: 'bg-danger' },
  }
  return palette[props.color] ?? palette.primary
})

onMounted(() => {
  if (!root.value) return

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true

  if (reducedMotion || numeric.value === null) {
    hasStarted.value = true
    if (numeric.value !== null) play(numeric.value)
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        hasStarted.value = true
        play(numeric.value)
        observer?.unobserve(entry.target)
      })
    },
    { threshold: 0.35 }
  )

  observer.observe(root.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <article ref="root" class="card card-hairline card-hover group overflow-hidden p-5 sm:p-6">
    <span :class="['absolute inset-x-0 top-0 h-[2px] opacity-70', accent.bar]" aria-hidden="true" />

    <div class="flex items-start justify-between gap-3">
      <p class="mono-label">{{ title }}</p>
      <span
        v-if="icon"
        :class="[
          'inline-flex h-9 w-9 items-center justify-center rounded-full border transition-transform duration-300 group-hover:-translate-y-0.5',
          accent.chip,
        ]"
        aria-hidden="true"
      >
        <component :is="icon" class="h-4 w-4" />
      </span>
    </div>

    <p class="mt-4 flex items-baseline gap-1">
      <span class="serif-number text-4xl leading-none text-ink sm:text-[2.6rem]">{{ shown }}</span>
      <span v-if="suffix" class="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">
        {{ suffix }}
      </span>
    </p>

    <p v-if="subtitle" class="mt-2 text-[0.82rem] leading-snug text-ink-soft">{{ subtitle }}</p>
  </article>
</template>
