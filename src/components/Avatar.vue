<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, default: '' },
  size: { type: String, default: 'md' },
  tone: { type: String, default: 'primary' },
})

const initials = computed(() => {
  const parts = props.name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'AT'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
})

const sizeClass = computed(() => {
  const sizes = {
    xs: 'h-8 w-8 text-[0.6rem]',
    sm: 'h-10 w-10 text-[0.7rem]',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-lg',
    xl: 'h-24 w-24 text-2xl',
  }
  return sizes[props.size] ?? sizes.md
})

const toneClass = computed(() =>
  props.tone === 'gold'
    ? 'bg-gold/15 text-gold border-gold/30'
    : 'bg-primary/10 text-primary border-primary/20 dark:bg-primary-2/15 dark:text-primary-2 dark:border-primary-2/30'
)
</script>

<template>
  <span
    :class="[
      'inline-flex shrink-0 items-center justify-center rounded-full border font-mono uppercase tracking-[0.12em]',
      sizeClass,
      toneClass,
    ]"
    aria-hidden="true"
  >
    {{ initials }}
  </span>
</template>
