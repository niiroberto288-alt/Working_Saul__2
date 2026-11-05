<script setup>
import { ShieldCheckIcon, SignalSlashIcon } from '@heroicons/vue/24/outline'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { strings } from '@/assets/strings'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="shell flex items-center justify-between py-6">
      <div class="flex items-center gap-3">
        <span
          class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-mono text-[0.7rem] tracking-[0.12em] text-on-primary"
          aria-hidden="true"
        >
          AT
        </span>
        <span class="font-serif text-xl italic text-ink">
          {{ strings.brand.name }}
          <span
            class="ml-1 font-mono text-[0.55rem] not-italic uppercase tracking-[0.22em] text-accent"
          >
            {{ strings.brand.region }}
          </span>
        </span>
      </div>
      <ThemeToggle />
    </header>

    <main id="main-content" class="shell flex flex-1 items-center py-14">
      <div class="mx-auto w-full max-w-2xl">
        <div class="card card-hairline p-7 sm:p-10">
          <span
            class="inline-flex h-12 w-12 items-center justify-center rounded-full border border-danger/35 text-danger"
            aria-hidden="true"
          >
            <SignalSlashIcon class="h-6 w-6" />
          </span>

          <p class="eyebrow mt-6">{{ strings.appNotConfigured.eyebrow }}</p>
          <h1 class="display-2 mt-4">{{ strings.appNotConfigured.title }}</h1>
          <p class="lede mt-5">{{ strings.appNotConfigured.body }}</p>

          <ol class="mt-8 space-y-4">
            <li
              v-for="(step, index) in strings.appNotConfigured.steps"
              :key="step"
              class="flex gap-4"
            >
              <span
                class="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line font-mono text-[0.6rem] text-accent"
                aria-hidden="true"
              >
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <span class="text-sm leading-relaxed text-ink-soft">{{ step }}</span>
            </li>
          </ol>

          <div
            class="mt-8 flex items-start gap-3 rounded-2xl border border-line bg-primary/[0.04] p-4"
          >
            <ShieldCheckIcon class="mt-0.5 h-5 w-5 shrink-0 text-ok" aria-hidden="true" />
            <p class="text-[0.82rem] leading-relaxed text-ink-soft">
              Demo accounts are never bundled into a production build. This page is what a real
              deploy shows until the Supabase keys are present.
            </p>
          </div>

          <p class="mt-6 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ink-soft">
            {{ strings.appNotConfigured.docs }}
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
