<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import ToastContainer from '@/components/ToastContainer.vue'
import { useAuth } from '@/composables/useAuth'
import { isDemoMode } from '@/services/supabase'
import { strings } from '@/assets/strings'

const { initialising } = useAuth()
const demo = computed(() => isDemoMode)
</script>

<template>
  <a href="#main-content" class="skip-link">{{ strings.common.skipToContent }}</a>

  <div v-if="initialising" class="flex min-h-screen items-center justify-center px-6">
    <div class="flex flex-col items-center gap-4 text-center">
      <span
        class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary font-mono text-[0.72rem] tracking-[0.12em] text-on-primary"
        aria-hidden="true"
      >
        AT
      </span>
      <p class="mono-label">{{ strings.common.loading }}</p>
    </div>
  </div>

  <RouterView v-slot="{ Component, route }">
    <Transition
      mode="out-in"
      enter-active-class="transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0"
    >
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>

  <ToastContainer />

  <div
    v-if="demo"
    class="pointer-events-none fixed bottom-4 right-4 z-[60] hidden sm:block"
    aria-hidden="true"
  >
    <span
      class="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-accent/40 bg-card-solid/90 px-3 py-1.5 font-mono text-[0.56rem] uppercase tracking-[0.18em] text-accent shadow-[var(--shadow-card)] backdrop-blur"
      :title="strings.shell.demoHint"
    >
      <span class="h-1.5 w-1.5 rounded-full bg-accent" />
      {{ strings.shell.demoBadge }}
    </span>
  </div>
</template>
