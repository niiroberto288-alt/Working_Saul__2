<script setup>
import { computed } from 'vue'
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import { useTheme } from '@/composables/useTheme'
import { strings } from '@/assets/strings'

const props = defineProps({
  tone: { type: String, default: 'default' },
})

const { isDark, toggleTheme } = useTheme()

const buttonClass = computed(() =>
  props.tone === 'light'
    ? 'border-white/25 text-[var(--sidebar-ink)] hover:border-white/50'
    : 'border-line text-ink hover:border-line-strong'
)

const label = computed(() => (isDark.value ? strings.common.lightTheme : strings.common.darkTheme))
</script>

<template>
  <button
    type="button"
    :class="[
      'inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300',
      buttonClass,
    ]"
    :aria-label="label"
    :title="label"
    :aria-pressed="isDark"
    @click="toggleTheme"
  >
    <Transition
      mode="out-in"
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 rotate-45 scale-75"
      enter-to-class="opacity-100 rotate-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 rotate-0 scale-100"
      leave-to-class="opacity-0 -rotate-45 scale-75"
    >
      <SunIcon v-if="isDark" key="sun" class="h-5 w-5" aria-hidden="true" />
      <MoonIcon v-else key="moon" class="h-5 w-5" aria-hidden="true" />
    </Transition>
  </button>
</template>
