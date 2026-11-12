<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  sections: { type: Array, default: () => [] },
})

const activeIndex = ref(0)
const visible = ref(false)
let observer = null

function update(index) {
  if (index === activeIndex.value) return
  activeIndex.value = index
}

onMounted(() => {
  const elements = props.sections
    .map((section) => document.getElementById(section.id))
    .filter(Boolean)

  if (elements.length === 0) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const index = elements.indexOf(entry.target)
        if (index >= 0) update(index)
      })
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  )

  elements.forEach((element) => observer.observe(element))

  const first = elements[0]
  visible.value = true

  return first
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <aside
    v-if="visible && sections.length > 0"
    class="pointer-events-none fixed bottom-6 right-5 z-40 hidden lg:block"
    aria-hidden="true"
  >
    <Transition
      mode="out-in"
      enter-active-class="transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
      enter-from-class="opacity-0 translate-y-3"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        :key="activeIndex"
        class="flex items-center gap-3 rounded-full border border-line bg-card-solid/85 px-4 py-2 shadow-[var(--shadow-card)] backdrop-blur"
      >
        <span class="font-mono text-[0.6rem] tracking-[0.2em] text-accent">
          {{ String(activeIndex + 1).padStart(2, '0') }}
        </span>
        <span class="h-3 w-px bg-line-strong" />
        <span class="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ink-soft">
          {{ sections[activeIndex]?.label }}
        </span>
      </div>
    </Transition>
  </aside>
</template>
