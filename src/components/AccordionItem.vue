<script setup>
import { computed, ref } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  id: { type: String, required: true },
  index: { type: String, default: '' },
  title: { type: String, required: true },
  meta: { type: String, default: '' },
  time: { type: String, default: '' },
  defaultOpen: { type: Boolean, default: false },
})

const open = ref(props.defaultOpen)
const panelId = computed(() => `accordion-panel-${props.id}`)
const buttonId = computed(() => `accordion-button-${props.id}`)

function toggle() {
  open.value = !open.value
}
</script>

<template>
  <div class="border-b border-line">
    <h3>
      <button
        :id="buttonId"
        type="button"
        class="flex w-full items-center gap-4 py-5 text-left transition-colors duration-200 hover:text-accent"
        :aria-expanded="open"
        :aria-controls="panelId"
        @click="toggle"
      >
        <span class="font-mono text-[0.68rem] tracking-[0.2em] text-accent">
          {{ index }}
        </span>
        <span class="flex-1">
          <span class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span class="font-serif text-xl text-ink sm:text-2xl">{{ title }}</span>
            <span
              v-if="meta"
              class="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-soft"
            >
              {{ meta }}
            </span>
          </span>
        </span>
        <span
          v-if="time"
          class="hidden shrink-0 rounded-full border border-line px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-soft sm:inline-block"
        >
          {{ time }}
        </span>
        <span
          class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-transform duration-300"
          :class="open ? 'rotate-45' : 'rotate-0'"
          aria-hidden="true"
        >
          <PlusIcon class="h-4 w-4" />
        </span>
      </button>
    </h3>

    <div
      :id="panelId"
      class="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      role="region"
      :aria-labelledby="buttonId"
    >
      <div class="overflow-hidden">
        <div class="pb-6 pl-8 pr-2 text-sm leading-relaxed text-ink-soft sm:pl-10">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
