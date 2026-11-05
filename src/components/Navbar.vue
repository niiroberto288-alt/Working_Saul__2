<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRightIcon, ArrowUpRightIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { strings } from '@/assets/strings'

defineProps({
  showProgress: { type: Boolean, default: true },
})

const links = [
  { label: 'The logbook', href: '#logbook' },
  { label: 'Supervisors', href: '#supervisors' },
  { label: 'Institutions', href: '#institutions' },
  { label: 'Free review', href: '#review' },
]

const menuOpen = ref(false)
const scrolled = ref(false)
const progress = ref(0)
let ticking = false

const progressStyle = computed(() => ({ transform: `scaleX(${progress.value})` }))

function readScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const height = document.documentElement.scrollHeight - window.innerHeight
  progress.value = height > 0 ? Math.min(1, Math.max(0, scrollTop / height)) : 0
  scrolled.value = scrollTop > 12
  ticking = false
}

function onScroll() {
  if (ticking) return
  ticking = true
  window.requestAnimationFrame(readScroll)
}

onMounted(() => {
  readScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50">
    <div
      class="h-[2px] origin-left bg-accent transition-transform duration-150 ease-out"
      :class="showProgress ? 'opacity-100' : 'opacity-0'"
      :style="progressStyle"
      aria-hidden="true"
    />

    <div
      class="border-b transition-all duration-300"
      :class="
        scrolled
          ? 'border-line bg-page/85 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.45)] backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      "
    >
      <div class="shell flex h-[74px] items-center justify-between gap-4">
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

        <nav class="hidden items-center gap-7 lg:flex" aria-label="Sections">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            class="group inline-flex items-center gap-1 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-ink"
          >
            {{ link.label }}
            <ArrowUpRightIcon
              class="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-60"
              aria-hidden="true"
            />
          </a>
        </nav>

        <div class="flex items-center gap-2">
          <ThemeToggle />
          <RouterLink to="/login" class="btn btn-primary hidden sm:inline-flex">
            Open a logbook
            <ArrowRightIcon class="h-4 w-4" aria-hidden="true" />
          </RouterLink>
          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink lg:hidden"
            :aria-label="menuOpen ? strings.shell.closeMenu : strings.shell.openMenu"
            :aria-expanded="menuOpen"
            aria-controls="marketing-menu"
            @click="menuOpen = !menuOpen"
          >
            <XMarkIcon v-if="menuOpen" class="h-5 w-5" aria-hidden="true" />
            <Bars3Icon v-else class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]"
      enter-from-class="opacity-0 -translate-y-3"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-3"
    >
      <div
        v-if="menuOpen"
        id="marketing-menu"
        class="border-b border-line bg-page/95 backdrop-blur-xl lg:hidden"
      >
        <nav class="shell flex flex-col gap-1 py-4" aria-label="Sections">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            class="rounded-xl px-2 py-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-soft hover:bg-primary/5 hover:text-ink"
            @click="menuOpen = false"
          >
            {{ link.label }}
          </a>
          <RouterLink to="/login" class="btn btn-primary mt-3" @click="menuOpen = false">
            Open a logbook
            <ArrowRightIcon class="h-4 w-4" aria-hidden="true" />
          </RouterLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>
