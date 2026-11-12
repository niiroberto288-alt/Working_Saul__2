<script setup>
import { RouterLink } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { strings } from '@/assets/strings'

defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  width: { type: String, default: 'md' },
})

const widths = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}
</script>

<template>
  <div class="relative flex min-h-screen flex-col">
    <header class="shell flex items-center justify-between py-6">
      <RouterLink
        to="/"
        class="group flex items-center gap-3"
        aria-label="AttachTrack Rwanda, home"
      >
        <span
          class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-mono text-[0.7rem] tracking-[0.12em] text-on-primary transition-transform duration-300 group-hover:-rotate-3"
          aria-hidden="true"
        >
          AT
        </span>
        <span class="flex items-baseline gap-2">
          <span class="font-serif text-xl italic text-ink">{{ strings.brand.name }}</span>
          <span class="font-mono text-[0.55rem] uppercase tracking-[0.24em] text-accent">
            {{ strings.brand.region }}
          </span>
        </span>
      </RouterLink>
      <ThemeToggle />
    </header>

    <main id="main-content" class="shell flex flex-1 items-center justify-center py-10">
      <div :class="['w-full', widths[width] ?? widths.md]">
        <div class="card card-hairline p-6 sm:p-9">
          <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
          <h1 v-if="title" class="mt-4 font-serif text-3xl leading-tight text-ink sm:text-[2.1rem]">
            {{ title }}
          </h1>
          <p v-if="subtitle" class="mt-2 text-sm leading-relaxed text-ink-soft">{{ subtitle }}</p>

          <div class="mt-7">
            <slot />
          </div>
        </div>

        <div v-if="$slots.footer" class="mt-6 text-center">
          <slot name="footer" />
        </div>
      </div>
    </main>

    <footer class="shell py-6">
      <div
        class="flex flex-col items-center justify-between gap-2 border-t border-line pt-5 sm:flex-row"
      >
        <p class="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-ink-soft">
          {{ strings.brand.name }} {{ strings.brand.region }}
        </p>
        <RouterLink
          to="/privacy"
          class="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-accent"
        >
          {{ strings.privacy.linkLabel }}
        </RouterLink>
      </div>
    </footer>
  </div>
</template>
