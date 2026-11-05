<script setup>
import { DocumentTextIcon } from '@heroicons/vue/24/outline'

defineProps({
  icon: { type: [Object, Function], default: () => DocumentTextIcon },
  title: { type: String, default: 'Nothing here yet' },
  body: { type: String, default: '' },
  compact: { type: Boolean, default: false },
})
</script>

<template>
  <div
    :class="[
      'flex flex-col items-start gap-3 rounded-card border border-dashed border-line-strong text-left',
      compact ? 'px-5 py-6' : 'px-7 py-10',
    ]"
    role="status"
  >
    <span
      class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-accent"
    >
      <component :is="icon" class="h-5 w-5" aria-hidden="true" />
    </span>
    <div class="space-y-1">
      <p class="font-serif text-xl text-ink">{{ title }}</p>
      <p v-if="body" class="max-w-prose text-sm leading-relaxed text-ink-soft">{{ body }}</p>
    </div>
    <div v-if="$slots.default" class="pt-1">
      <slot />
    </div>
  </div>
</template>
