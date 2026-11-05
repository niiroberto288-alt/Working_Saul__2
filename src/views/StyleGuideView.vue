<script setup>
/**
 * Development-only gallery. Not part of the shipped product: the route is
 * registered behind import.meta.env.DEV and rolled up out of production builds.
 */
import { ref } from 'vue'
import {
  BookOpenIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'
import DashboardLayout from '@/components/DashboardLayout.vue'
import StatCard from '@/components/StatCard.vue'
import StatusPill from '@/components/StatusPill.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import SkeletonBlock from '@/components/SkeletonBlock.vue'
import EmptyState from '@/components/EmptyState.vue'
import AccordionItem from '@/components/AccordionItem.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import Avatar from '@/components/Avatar.vue'
import { useToast } from '@/composables/useToast'
import { useAuth } from '@/composables/useAuth'
import { strings } from '@/assets/strings'
import { ROLES } from '@/config'

const { success, error, info } = useToast()
const { mode } = useAuth()

const dialogOpen = ref(false)
const stamped = ref(false)
const fieldDemo = ref('')

function handleDeleteDemo() {
  dialogOpen.value = false
  success('Entry deleted.')
}

function showStamp() {
  stamped.value = false
  window.requestAnimationFrame(() => {
    stamped.value = true
    window.setTimeout(() => {
      stamped.value = false
    }, 1600)
  })
}
</script>

<template>
  <DashboardLayout
    :role="ROLES.STUDENT"
    :title="strings.styleguide.title"
    :subtitle="strings.styleguide.subtitle"
    :breadcrumb="strings.styleguide.breadcrumb"
  >
    <div class="space-y-8">
      <section class="card p-6">
        <p class="eyebrow">{{ strings.styleguide.typeEyebrow }}</p>
        <div class="mt-5 space-y-4">
          <p class="display-1">Every hour recorded.</p>
          <p class="display-2">A placement held by four quiet habits.</p>
          <p class="display-3">The people who read the logbook.</p>
          <p class="lede">
            Body copy sits on Inter at a comfortable measure. Labels use IBM Plex Mono, uppercase,
            with generous tracking. Headings use Newsreader, and the key phrase is italic in the
            accent colour.
          </p>
          <p class="mono-label">Mono label / eyebrow / chip text</p>
        </div>
      </section>

      <section>
        <p class="eyebrow">{{ strings.styleguide.statsEyebrow }}</p>
        <div class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total entries"
            :value="32"
            subtitle="Four weeks of placement"
            :icon="ClipboardDocumentListIcon"
          />
          <StatCard
            title="Approved"
            :value="18"
            subtitle="Signed by a supervisor"
            color="green"
            :icon="CheckCircleIcon"
          />
          <StatCard
            title="Pending"
            :value="9"
            subtitle="Waiting in the queue"
            color="yellow"
            :icon="ClockIcon"
          />
          <StatCard
            title="Total hours"
            :value="248.5"
            suffix="h"
            :decimals="1"
            subtitle="Across the term"
            color="purple"
            :icon="UsersIcon"
          />
        </div>
      </section>

      <div class="grid gap-6 lg:grid-cols-2">
        <section class="card p-6">
          <p class="eyebrow">{{ strings.styleguide.statusEyebrow }}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <StatusPill status="Draft" />
            <StatusPill status="Pending" />
            <StatusPill status="Approved" />
            <StatusPill status="Rejected" />
          </div>

          <div class="mt-7 space-y-5">
            <ProgressBar label="Required hours" :value="62" />
            <ProgressBar label="Entries approved" :value="34" tone="gold" />
            <ProgressBar label="Evidence attached" :value="88" tone="green" size="sm" />
          </div>
        </section>

        <section class="card p-6">
          <p class="eyebrow">{{ strings.styleguide.buttonsEyebrow }}</p>
          <div class="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="btn btn-primary"
              @click="success('The entry was approved.')"
            >
              Primary action
              <BookOpenIcon class="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" class="btn btn-outline" @click="info('Saved as a draft.')">
              Secondary
            </button>
            <button type="button" class="btn btn-danger" @click="error('That did not work.')">
              Destructive
            </button>
            <button type="button" class="link-arrow">
              Text link
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>

          <div class="mt-7 grid gap-5 sm:grid-cols-2">
            <label class="field">
              <span class="field-label">Institution</span>
              <input
                v-model="fieldDemo"
                class="field-input"
                type="text"
                placeholder="University of Rwanda"
                data-field="institution"
              />
              <span class="field-help">A single line under the field, never a box.</span>
            </label>
            <label class="field">
              <span class="field-label">Role</span>
              <select class="field-select">
                <option>Student</option>
                <option>Supervisor</option>
              </select>
              <span class="field-error">Example inline error in mono.</span>
            </label>
          </div>
        </section>

        <section class="card p-6">
          <p class="eyebrow">{{ strings.styleguide.peopleEyebrow }}</p>
          <div class="mt-4 flex flex-wrap items-center gap-4">
            <Avatar name="Aline Uwase" size="sm" />
            <Avatar name="Dr. Claudine Uwera" />
            <Avatar name="Nadia Uwimana" size="lg" tone="gold" />
          </div>
          <div class="mt-6 space-y-3">
            <SkeletonBlock width="70%" height="0.9rem" />
            <SkeletonBlock width="45%" height="0.9rem" />
            <SkeletonBlock width="90%" height="2.6rem" rounded="1rem" />
          </div>
        </section>

        <section class="card p-6">
          <p class="eyebrow">{{ strings.styleguide.statesEyebrow }}</p>
          <div class="mt-4 space-y-4">
            <EmptyState
              title="No entries yet"
              body="Start with the week you are in. One honest paragraph is enough."
              compact
            />
            <div class="flex flex-wrap gap-3">
              <button type="button" class="btn btn-outline" @click="dialogOpen = true">
                Open dialog
              </button>
              <button type="button" class="btn btn-primary" @click="showStamp">Show stamp</button>
            </div>
            <div v-if="stamped" class="flex justify-center py-4">
              <span
                class="stamp inline-flex items-center gap-2 rounded-lg border-2 border-ok px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ok"
              >
                <CheckCircleIcon class="h-4 w-4" aria-hidden="true" />
                Approved
              </span>
            </div>
          </div>
        </section>
      </div>

      <section class="card p-6">
        <p class="eyebrow">{{ strings.styleguide.accordionEyebrow }}</p>
        <div class="mt-2">
          <AccordionItem
            id="demo-plan"
            index="I"
            title="Plan"
            meta="Placement charter"
            time="45 min"
          >
            <p>
              Agree the hours, the supervisor, the evidence and the review rhythm before week one.
            </p>
          </AccordionItem>
          <AccordionItem
            id="demo-log"
            index="II"
            title="Log"
            meta="Hours and artefacts"
            time="10 min / entry"
            default-open
          >
            <p>
              One entry per week, with the artefact attached. Drafts autosave, so a dropped
              connection never loses typing.
            </p>
          </AccordionItem>
          <AccordionItem id="demo-reflect" index="III" title="Reflect" meta="The weekly raves">
            <p>Name the skill you practised and the thing you would do differently.</p>
          </AccordionItem>
        </div>
      </section>

      <p class="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ink-soft">
        {{ strings.styleguide.modeNote }} {{ mode }}
      </p>
    </div>

    <ConfirmationDialog
      v-model:open="dialogOpen"
      title="Delete this entry?"
      body="The entry and its revisions are removed. This cannot be undone."
      confirm-label="Delete entry"
      @confirm="handleDeleteDemo"
    />
  </DashboardLayout>
</template>
