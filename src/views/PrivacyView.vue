<script setup>
import { RouterLink } from 'vue-router'
import { ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { privacySections } from '@/assets/content'
import { strings } from '@/assets/strings'

const updated = '22 October 2026'
</script>

<template>
  <div>
    <Navbar :show-progress="false" />

    <main id="main-content" class="pt-28">
      <section class="shell pb-10 pt-8">
        <RouterLink to="/" class="link-arrow">
          <ArrowLeftIcon class="h-3.5 w-3.5" aria-hidden="true" />
          {{ strings.brand.name }}
        </RouterLink>

        <p class="eyebrow mt-8">{{ strings.privacy.eyebrow }}</p>
        <h1 class="display-1 mt-5 max-w-3xl">{{ strings.privacy.title }}</h1>
        <p class="lede mt-6">{{ strings.privacy.intro }}</p>

        <p class="mt-6 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink-soft">
          {{ strings.privacy.updated }} &middot; {{ updated }}
        </p>
      </section>

      <div class="shell grid gap-12 pb-16 lg:grid-cols-[220px_1fr] lg:gap-16">
        <nav class="hidden lg:block" aria-label="Privacy sections">
          <div class="sticky top-28 space-y-2 border-l border-line pl-4">
            <a
              v-for="section in privacySections"
              :key="section.id"
              :href="`#${section.id}`"
              class="block font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.14em] text-ink-soft transition-colors hover:text-accent"
            >
              {{ section.title }}
            </a>
          </div>
        </nav>

        <div class="max-w-3xl space-y-10">
          <section
            v-for="section in privacySections"
            :id="section.id"
            :key="section.id"
            class="scroll-mt-28"
          >
            <h2 class="font-serif text-2xl leading-tight text-ink sm:text-[1.7rem]">
              {{ section.title }}
            </h2>
            <p class="mt-3 text-[0.92rem] leading-relaxed text-ink-soft">{{ section.body }}</p>
            <ul v-if="section.items" class="mt-4 space-y-2.5">
              <li
                v-for="item in section.items"
                :key="item"
                class="flex gap-3 text-[0.9rem] leading-relaxed text-ink-soft"
              >
                <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </section>

          <section class="card border-l-2 border-l-gold p-6">
            <div class="flex items-start gap-3">
              <ShieldCheckIcon class="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <h2 class="font-serif text-xl leading-tight text-ink">
                  {{ strings.privacy.disclaimerTitle }}
                </h2>
                <p class="mt-2 text-[0.88rem] leading-relaxed text-ink-soft">
                  {{ strings.privacy.disclaimerBody }}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 class="font-serif text-2xl leading-tight text-ink">
              {{ strings.privacy.contactTitle }}
            </h2>
            <p class="mt-3 text-[0.92rem] leading-relaxed text-ink-soft">
              {{ strings.privacy.contactBody }}
            </p>
            <RouterLink to="/register" class="link-arrow mt-6 inline-flex">
              {{ strings.auth.createAccount }}
              <span aria-hidden="true">&rarr;</span>
            </RouterLink>
          </section>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>
