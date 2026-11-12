<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  value: { type: Number, default: 0 },
  label: { type: String, default: '' },
  tone: { type: String, default: 'primary' },
  showValue: { type: Boolean, default: true },
  size: { type: String, default: 'md' },
})

const track = ref(null)
const animated = ref(0)
let observer = null

const clamped = computed(() => Math.max(0, Math.min(100, Number(props.value) || 0)))

const fillClass = computed(() => {
  const tones = {
    primary: 'bg-primary dark:bg-primary-2',
    green: 'bg-ok',
    gold: 'bg-gold',
    copper: 'bg-accent',
    danger: 'bg-danger',
    warn: 'bg-warn',
  }
  return tones[props.tone] ?? tones.primary
})

const heightClass = computed(() => (props.size === 'sm' ? 'h-1.5' : 'h-2'))

onMounted(() => {
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true

  if (reducedMotion || !track.value) {
    animated.value = clamped.value
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        window.requestAnimationFrame(() => {
          animated.value = clamped.value
        })
        observer?.unobserve(entry.target)
      })
    },
    { threshold: 0.2 }
  )

  observer.observe(track.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="w-full">
    <div v-if="label || showValue" class="mb-1.5 flex items-baseline justify-between gap-3">
      <span v-if="label" class="mono-label">{{ label }}</span>
      <span v-if="showValue" class="font-mono text-[0.7rem] text-ink-soft">
        {{ Math.round(clamped) }}%
      </span>
    </div>
    <div
      ref="track"
      :class="['w-full overflow-hidden rounded-full bg-ink/10 dark:bg-ink/10', heightClass]"
      role="progressbar"
      :aria-valuenow="Math.round(clamped)"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="label || undefined"
    >
      <div
        :class="[
          'h-full w-full origin-left rounded-full transition-transform duration-[800ms] ease-out',
          fillClass,
        ]"
        :style="{ transform: `scaleX(${animated / 100})` }"
      />
    </div>
  </div>
</template>
