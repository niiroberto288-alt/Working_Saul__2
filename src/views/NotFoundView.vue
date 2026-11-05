<script setup>
import { RouterLink } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { strings } from '@/assets/strings'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="shell flex items-center justify-between py-6">
      <RouterLink to="/" class="flex items-center gap-3" aria-label="AttachTrack Rwanda, home">
        <span
          class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-mono text-[0.7rem] tracking-[0.12em] text-on-primary"
          aria-hidden="true"
        >
          AT
        </span>
        <span class="font-serif text-xl italic text-ink">{{ strings.brand.name }}</span>
      </RouterLink>
      <ThemeToggle />
    </header>

    <main id="main-content" class="shell flex flex-1 items-center py-16">
      <div class="grid w-full items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p class="eyebrow">{{ strings.notFound.eyebrow }}</p>
          <h1 class="display-1 mt-6">
            This page slipped
            <span class="font-serif italic text-accent">out of the logbook.</span>
          </h1>
          <p class="lede mt-6">{{ strings.notFound.body }}</p>
          <div class="mt-9 flex flex-wrap items-center gap-4">
            <RouterLink to="/" class="btn btn-primary">
              {{ strings.notFound.cta }}
              <ArrowLeftIcon class="h-4 w-4" aria-hidden="true" />
            </RouterLink>
            <RouterLink to="/login" class="link-arrow">
              {{ strings.auth.signIn }}
              <span aria-hidden="true">&rarr;</span>
            </RouterLink>
          </div>
        </div>

        <div class="card card-hairline relative overflow-hidden p-8">
          <p class="mono-label">Marginalia</p>
          <p class="mt-4 font-serif text-2xl leading-snug text-ink">
            &ldquo;A logbook only works when the page numbers agree.&rdquo;
          </p>
          <p class="mt-4 text-sm leading-relaxed text-ink-soft">
            Check the address, or start again from the front desk. Nothing was lost.
          </p>
          <div class="ruled mt-6 h-24 rounded-xl border border-line/60" aria-hidden="true" />
          <p class="mt-4 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-accent">
            Error 404 &middot; {{ strings.brand.region }}
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
