<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { BuildingOffice2Icon } from '@heroicons/vue/24/outline'

defineProps({
  items: { type: Array, default: () => [] },
  label: { type: String, default: 'Institutions and host organisations' },
})

const root = ref(null)
const pausedByTab = ref(false)

// FURPS+ P4: pause the marquee while the tab is hidden.
function onVisibility() {
  pausedByTab.value = document.hidden
}

onMounted(() => {
  document.addEventListener('visibilitychange', onVisibility)
  onVisibility()
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <div
    ref="root"
    class="marquee group relative overflow-hidden border-y border-white/10 bg-primary py-5 text-on-primary dark:bg-sidebar"
    role="region"
    :aria-label="label"
  >
    <div
      class="marquee-track flex w-max animate-marquee items-center gap-10 group-hover:[animation-play-state:paused]"
      :class="{ '[animation-play-state:paused]': pausedByTab }"
      aria-hidden="true"
    >
      <span
        v-for="(item, index) in [...items, ...items]"
        :key="`${item}-${index}`"
        class="flex shrink-0 items-center gap-3"
      >
        <BuildingOffice2Icon class="h-4 w-4 opacity-50" />
        <span class="font-mono text-[0.66rem] uppercase tracking-[0.22em] opacity-80">
          {{ item }}
        </span>
        <span class="ml-4 h-1 w-1 rounded-full bg-gold/70" />
      </span>
    </div>

    <p class="sr-only">
      {{ items.join(', ') }}
    </p>

    <div
      class="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-primary to-transparent dark:from-sidebar"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-primary to-transparent dark:from-sidebar"
      aria-hidden="true"
    />
  </div>
</template>
