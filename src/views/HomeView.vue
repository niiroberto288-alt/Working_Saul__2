<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import AccordionItem from '@/components/AccordionItem.vue'
import TickerMarquee from '@/components/TickerMarquee.vue'
import SectionMeter from '@/components/SectionMeter.vue'
import SupervisorCard from '@/components/SupervisorCard.vue'
import ReviewForm from '@/components/ReviewForm.vue'
import Avatar from '@/components/Avatar.vue'
import StatusPill from '@/components/StatusPill.vue'
import { useCountUp } from '@/composables/useCountUp'
import {
  activityFeed,
  heroStats,
  partners,
  rails,
  reviewSteps,
  roleCards,
  supervisors,
} from '@/assets/content'
import { strings } from '@/assets/strings'

const heroImage = 'https://picsum.photos/seed/attachtrack-hero/720/1040'

const meterSections = [
  { id: 'logbook', label: 'The logbook' },
  { id: 'roles', label: 'Three desks' },
  { id: 'rails', label: 'The four rails' },
  { id: 'supervisors', label: 'Supervisors' },
  { id: 'activity', label: 'This week' },
  { id: 'review', label: 'First review' },
]

const heroSection = ref(null)
const heroPlaying = ref(false)
const counters = heroStats.map((stat) => ({
  ...stat,
  ...useCountUp({ decimals: 0 }),
}))

let observer = null

onMounted(() => {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true

  if (reduced || !heroSection.value) {
    counters.forEach((counter) => counter.play(counter.value))
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || heroPlaying.value) return
        heroPlaying.value = true
        counters.forEach((counter) => counter.play(counter.value))
        observer?.disconnect()
      })
    },
    { threshold: 0.25 }
  )

  observer.observe(heroSection.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div>
    <Navbar />

    <main id="main-content">
      <!-- ---------------------------------------------------------------- HERO -->
      <section id="logbook" class="relative overflow-hidden pb-16 pt-28 sm:pt-32">
        <div class="shell">
          <div class="grid items-start gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            <div>
              <p v-reveal class="eyebrow max-w-lg">
                {{ strings.home.eyebrow }}
              </p>

              <h1 v-reveal="1" class="display-1 mt-7">
                {{ strings.home.titleLead }}
                <span class="mt-1 block font-serif italic text-accent">
                  {{ strings.home.titleAccent }}
                </span>
              </h1>

              <p v-reveal="2" class="lede mt-7">{{ strings.home.heroBody }}</p>

              <div v-reveal="3" class="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                <RouterLink to="/login" class="btn btn-primary">
                  {{ strings.home.ctaPrimary }}
                  <ArrowRightIcon class="h-4 w-4" aria-hidden="true" />
                </RouterLink>
                <RouterLink to="/login" class="link-arrow group">
                  {{ strings.home.ctaSample }}
                  <span
                    class="font-mono text-[0.58rem] normal-case tracking-[0.08em] text-ink-soft"
                  >
                    / {{ strings.home.ctaSampleNote }}
                  </span>
                  <ArrowUpRightIcon class="h-3.5 w-3.5" aria-hidden="true" />
                </RouterLink>
              </div>

              <hr class="mt-12 border-0 border-t border-line" />

              <dl ref="heroSection" class="mt-8 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
                <div v-for="(counter, index) in counters" :key="counter.label" v-reveal="index">
                  <dt class="mono-label">{{ counter.label }}</dt>
                  <dd class="mt-1.5 flex items-baseline gap-1">
                    <span class="serif-number text-3xl text-ink sm:text-[2.1rem]">
                      {{ heroPlaying ? counter.displayed.value : '0' }}
                    </span>
                    <span v-if="counter.suffix" class="font-mono text-xs text-ink-soft">
                      {{ counter.suffix }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <!-- Hero photo card -->
            <div v-reveal="{ delay: 160 }" class="relative mx-auto w-full max-w-md lg:max-w-none">
              <div
                class="relative overflow-hidden rounded-[2rem] border border-line bg-card shadow-[var(--shadow-card)] animate-breathe"
              >
                <img
                  :src="heroImage"
                  :alt="`A student at a placement desk, ${strings.home.caption}`"
                  width="720"
                  height="1040"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  class="h-[22rem] w-full object-cover sm:h-[30rem] lg:h-[34rem]"
                />
                <div
                  class="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2a1c0e]/45 via-[#b87333]/10 to-transparent"
                  aria-hidden="true"
                />
                <p
                  class="absolute bottom-5 left-6 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-white/85"
                >
                  {{ strings.home.caption }}
                </p>
              </div>

              <div
                class="absolute -left-3 top-8 rounded-2xl border border-line bg-card-solid/95 px-4 py-3 shadow-[var(--shadow-lift)] backdrop-blur sm:-left-6"
              >
                <p
                  class="flex items-center gap-1.5 font-mono text-[0.55rem] uppercase tracking-[0.18em] text-accent"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
                  {{ strings.home.chipLedger }}
                </p>
                <p class="mt-1 max-w-[10rem] text-[0.78rem] leading-snug text-ink">
                  {{ strings.home.chipLedgerBody }}
                </p>
              </div>

              <div
                class="absolute -right-3 bottom-10 rounded-2xl border border-line bg-card-solid/95 px-4 py-3 shadow-[var(--shadow-lift)] backdrop-blur sm:-right-5"
              >
                <p class="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-accent">
                  {{ strings.home.chipMedian }}
                </p>
                <p class="mt-1 flex items-baseline gap-1">
                  <span class="serif-number text-2xl text-ink">
                    {{ strings.home.chipMedianBody }}
                  </span>
                </p>
              </div>

              <p
                class="mt-5 text-center font-mono text-[0.55rem] uppercase tracking-[0.18em] text-ink-soft"
              >
                {{ strings.home.breatheNote }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- --------------------------------------------------------------- ROLES -->
      <section id="roles" class="section pt-6">
        <div class="shell">
          <div class="max-w-2xl">
            <p v-reveal class="eyebrow">{{ strings.home.rolesEyebrow }}</p>
            <h2 v-reveal="1" class="display-2 mt-5">
              {{ strings.home.rolesTitle }}
            </h2>
          </div>

          <div class="mt-10 grid gap-4 md:grid-cols-3">
            <article
              v-for="(card, index) in roleCards"
              :key="card.key"
              v-reveal="index"
              class="card card-hairline card-hover flex flex-col p-6"
            >
              <p class="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-accent">
                {{ card.eyebrow }}
              </p>
              <h3 class="mt-3 font-serif text-2xl leading-tight text-ink">{{ card.title }}</h3>
              <p class="mt-3 flex-1 text-[0.88rem] leading-relaxed text-ink-soft">
                {{ card.body }}
              </p>
              <RouterLink to="/login" class="link-arrow mt-6 self-start">
                {{ card.cta }}
                <ArrowRightIcon class="h-3.5 w-3.5" aria-hidden="true" />
              </RouterLink>
            </article>
          </div>
        </div>
      </section>

      <!-- -------------------------------------------------------------- TICKER -->
      <TickerMarquee :items="partners" :label="strings.home.partnersLabel" />

      <!-- --------------------------------------------------------------- RAILS -->
      <section id="rails" class="section">
        <div class="shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p v-reveal class="eyebrow">{{ strings.home.railsEyebrow }}</p>
            <h2 v-reveal="1" class="display-2 mt-5">
              {{ strings.home.railsTitle }}
            </h2>
            <p v-reveal="2" class="lede mt-5">{{ strings.home.railsBody }}</p>

            <div v-reveal="3" class="card mt-8 border-l-2 border-l-gold p-5">
              <p class="mono-label">{{ strings.home.railsInsightLabel }}</p>
              <p class="mt-2 font-serif text-lg leading-snug text-ink">
                {{ strings.home.railsInsight }}
              </p>
            </div>
          </div>

          <div v-reveal="{ delay: 120 }" class="lg:pt-2">
            <AccordionItem
              v-for="(rail, index) in rails"
              :key="rail.id"
              :id="rail.id"
              :index="rail.index"
              :title="rail.title"
              :meta="rail.meta"
              :time="rail.time"
              :default-open="index === 0"
            >
              {{ rail.body }}
            </AccordionItem>
          </div>
        </div>
      </section>

      <!-- ---------------------------------------------------------- SUPERVISORS -->
      <section id="supervisors" class="section bg-page-2/60 dark:bg-page-2/30">
        <div class="shell">
          <div class="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div class="max-w-2xl">
              <p v-reveal class="eyebrow">{{ strings.home.supervisorsEyebrow }}</p>
              <h2 v-reveal="1" class="display-2 mt-5">
                {{ strings.home.supervisorsTitle }}
              </h2>
              <p v-reveal="2" class="lede mt-5">{{ strings.home.supervisorsBody }}</p>
            </div>
            <RouterLink v-reveal="3" to="/login" class="link-arrow self-start lg:self-end">
              {{ strings.home.seeLogbook }}
              <ArrowRightIcon class="h-3.5 w-3.5" aria-hidden="true" />
            </RouterLink>
          </div>

          <div class="mt-10 grid gap-5 md:grid-cols-3">
            <SupervisorCard
              v-for="(supervisor, index) in supervisors"
              :key="supervisor.id"
              v-reveal="index"
              :supervisor="supervisor"
            />
          </div>
        </div>
      </section>

      <!-- ----------------------------------------------------------- ACTIVITY -->
      <section id="activity" class="section">
        <div class="shell">
          <div class="max-w-2xl">
            <p v-reveal class="eyebrow">{{ strings.home.activityEyebrow }}</p>
            <h2 v-reveal="1" class="display-2 mt-5">
              {{ strings.home.activityTitle }}
            </h2>
            <p v-reveal="2" class="lede mt-5">{{ strings.home.activityBody }}</p>
          </div>

          <div class="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article
              v-for="(student, index) in activityFeed"
              :key="student.id"
              v-reveal="index"
              class="card card-hairline card-hover p-5"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <Avatar :name="student.name" size="sm" />
                  <div>
                    <p class="font-serif text-[1.05rem] leading-tight text-ink">
                      {{ student.name }}
                    </p>
                    <p class="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-ink-soft">
                      {{ strings.roles.student }}
                    </p>
                  </div>
                </div>
                <StatusPill :status="student.status" size="sm" />
              </div>

              <p class="mt-5 flex items-baseline gap-1.5">
                <span class="serif-number text-3xl text-ink">{{ student.hours }}</span>
                <span class="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink-soft">
                  h
                </span>
              </p>
              <p class="mt-1 text-[0.78rem] leading-snug text-ink-soft">{{ student.note }}</p>
            </article>
          </div>

          <div class="mt-8 grid gap-3 sm:grid-cols-3">
            <div
              v-for="item in [
                { icon: ClipboardDocumentListIcon, label: 'Entries kept', value: '3,214' },
                { icon: ClockIcon, label: 'Median review', value: '34 h' },
                { icon: UsersIcon, label: 'Supervisors active', value: '48' },
              ]"
              :key="item.label"
              v-reveal
              class="flex items-center gap-3 rounded-2xl border border-line px-4 py-3"
            >
              <span
                class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-accent"
                aria-hidden="true"
              >
                <component :is="item.icon" class="h-4 w-4" />
              </span>
              <span class="min-w-0">
                <span
                  class="block font-mono text-[0.55rem] uppercase tracking-[0.16em] text-ink-soft"
                >
                  {{ item.label }}
                </span>
                <span class="block font-serif text-lg leading-tight text-ink">{{
                  item.value
                }}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- -------------------------------------------------------------- REVIEW -->
      <section id="review" class="section border-t border-line bg-page-2/40 dark:bg-page-2/20">
        <div class="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p v-reveal class="eyebrow">{{ strings.home.reviewEyebrow }}</p>
            <h2 v-reveal="1" class="display-2 mt-5">{{ strings.home.reviewTitle }}</h2>
            <p v-reveal="2" class="lede mt-5">{{ strings.home.reviewBody }}</p>

            <ol class="mt-10 space-y-7">
              <li
                v-for="(step, index) in reviewSteps"
                :key="step.number"
                v-reveal="index"
                class="flex gap-4"
              >
                <span
                  class="font-mono text-[0.7rem] tracking-[0.18em] text-accent"
                  aria-hidden="true"
                >
                  {{ step.number }}
                </span>
                <div class="border-l border-line pl-4">
                  <h3 class="font-serif text-xl leading-tight text-ink">{{ step.title }}</h3>
                  <p class="mt-1.5 max-w-sm text-[0.86rem] leading-relaxed text-ink-soft">
                    {{ step.body }}
                  </p>
                </div>
              </li>
            </ol>

            <div v-reveal="3" class="mt-10 flex items-start gap-3">
              <CheckCircleIcon class="mt-0.5 h-5 w-5 shrink-0 text-ok" aria-hidden="true" />
              <p class="text-[0.82rem] leading-relaxed text-ink-soft">
                {{ strings.privacy.consentShort }}
              </p>
            </div>
          </div>

          <div v-reveal="{ delay: 120 }">
            <ReviewForm />
          </div>
        </div>
      </section>
    </main>

    <Footer />
    <SectionMeter :sections="meterSections" />
  </div>
</template>
