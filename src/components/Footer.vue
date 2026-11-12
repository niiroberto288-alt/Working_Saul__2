<script setup>
import { ArrowUpRightIcon } from '@heroicons/vue/24/outline'
import { RouterLink } from 'vue-router'
import { strings } from '@/assets/strings'

const year = new Date().getFullYear()

const columns = [
  {
    title: 'The programme',
    links: [
      { label: 'The logbook', to: '/#logbook' },
      { label: 'The four rails', to: '/#rails' },
      { label: 'Supervisors', to: '/#supervisors' },
      { label: 'Free first review', to: '/#review' },
    ],
  },
  {
    title: 'Data and privacy',
    links: [
      { label: 'Privacy notice', to: '/privacy' },
      { label: 'Create an account', to: '/register' },
      { label: 'Sign in', to: '/login' },
    ],
  },
]
</script>

<template>
  <footer class="border-t border-line">
    <div class="shell py-14">
      <div class="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div class="flex items-center gap-3">
            <span
              class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-mono text-[0.7rem] tracking-[0.14em] text-on-primary"
              aria-hidden="true"
            >
              AT
            </span>
            <span class="font-serif text-xl italic text-ink">
              {{ strings.brand.name }}
              <span
                class="ml-1 font-mono text-[0.56rem] not-italic uppercase tracking-[0.22em] text-accent"
              >
                {{ strings.brand.region }}
              </span>
            </span>
          </div>
          <p class="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
            {{ strings.brand.description }}
          </p>
          <p class="mt-6 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink-soft">
            {{ strings.appShell.footerNote }} &copy; {{ year }}
          </p>
        </div>

        <div v-for="column in columns" :key="column.title">
          <p class="mono-label">{{ column.title }}</p>
          <ul class="mt-4 space-y-2.5">
            <li v-for="link in column.links" :key="link.to">
              <RouterLink
                :to="link.to"
                class="group inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-accent"
              >
                {{ link.label }}
                <ArrowUpRightIcon
                  class="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
