<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  ArrowLeftOnRectangleIcon,
  ChevronDoubleRightIcon,
  BookOpenIcon,
  ChartBarIcon,
  ChevronDoubleLeftIcon,
  ClipboardDocumentListIcon,
  PresentationChartLineIcon,
  Squares2X2Icon,
  UserCircleIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { strings } from '@/assets/strings'
import { ROLES } from '@/config'

const props = defineProps({
  role: { type: String, default: ROLES.STUDENT },
  collapsed: { type: Boolean, default: false },
  mobileOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['update:collapsed', 'update:mobileOpen'])

const router = useRouter()
const route = useRoute()
const { displayName, initials, signOut } = useAuth()
const { error } = useToast()
const signingOut = ref(false)

const NAVIGATION = {
  [ROLES.STUDENT]: [
    { name: 'student-dashboard', label: 'Dashboard', icon: Squares2X2Icon },
    { name: 'student-logs', label: 'Activity logs', icon: ClipboardDocumentListIcon },
    { name: 'student-logbook', label: 'Logbook', icon: BookOpenIcon },
    { name: 'student-progress', label: 'Progress', icon: ChartBarIcon },
  ],
  [ROLES.SUPERVISOR]: [
    { name: 'supervisor-dashboard', label: 'Dashboard', icon: Squares2X2Icon },
    { name: 'supervisor-logs', label: 'Activity logs', icon: ClipboardDocumentListIcon },
    { name: 'supervisor-students', label: 'Students', icon: UsersIcon },
    { name: 'supervisor-logbooks', label: 'Logbooks', icon: BookOpenIcon },
  ],
  [ROLES.ADMIN]: [
    { name: 'admin-dashboard', label: 'Dashboard', icon: Squares2X2Icon },
    { name: 'admin-users', label: 'Users', icon: UsersIcon },
    { name: 'admin-reports', label: 'Reports', icon: PresentationChartLineIcon },
  ],
}

const roleLabel = computed(() => strings.roles.badge[props.role] ?? props.role)

// Only routes that exist in this build are rendered, so the shell stays honest
// while later phases are still being written.
const links = computed(() =>
  (NAVIGATION[props.role] ?? []).filter((item) => router.hasRoute(item.name))
)

const widthClass = computed(() => (props.collapsed ? 'lg:w-[86px]' : 'lg:w-[264px]'))

watch(
  () => route.fullPath,
  () => {
    if (props.mobileOpen) emit('update:mobileOpen', false)
  }
)

async function handleSignOut() {
  signingOut.value = true
  try {
    await signOut()
    await router.push({ name: 'login' })
  } catch (caught) {
    error(strings.errors.generic)
  } finally {
    signingOut.value = false
  }
}

function closeMobile() {
  emit('update:mobileOpen', false)
}
</script>

<template>
  <!-- Mobile drawer backdrop -->
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm lg:hidden"
      @click="closeMobile"
    />
  </Transition>

  <aside
    :class="[
      'fixed inset-y-0 left-0 z-[85] flex w-[272px] flex-col bg-sidebar text-sidebar-ink transition-[width,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
      widthClass,
      mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
    :aria-label="strings.shell.navigation"
  >
    <div class="flex items-center justify-between gap-2 px-5 pb-6 pt-6">
      <RouterLink
        to="/"
        class="flex min-w-0 items-center gap-3"
        :aria-label="`${strings.brand.name} ${strings.brand.region}`"
      >
        <span
          class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 font-mono text-[0.7rem] tracking-[0.12em] text-sidebar-ink"
          aria-hidden="true"
        >
          AT
        </span>
        <span v-if="!collapsed" class="min-w-0">
          <span class="block truncate font-serif text-lg italic text-sidebar-ink">
            {{ strings.brand.name }}
          </span>
          <span class="block font-mono text-[0.55rem] uppercase tracking-[0.22em] text-gold">
            {{ strings.brand.region }}
          </span>
        </span>
      </RouterLink>

      <button
        type="button"
        class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sidebar-ink transition-colors hover:border-white/40 lg:hidden"
        :aria-label="strings.shell.closeMenu"
        @click="closeMobile"
      >
        <XMarkIcon class="h-4 w-4" aria-hidden="true" />
      </button>
    </div>

    <div class="px-5">
      <div
        :class="[
          'rounded-2xl border border-white/12 bg-white/[0.06] p-3',
          collapsed ? 'flex justify-center' : '',
        ]"
      >
        <div class="flex items-center gap-3">
          <span
            class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/20 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-gold"
            aria-hidden="true"
          >
            {{ initials }}
          </span>
          <div v-if="!collapsed" class="min-w-0">
            <p class="truncate font-serif text-[0.98rem] leading-tight text-sidebar-ink">
              {{ displayName || 'Signed in' }}
            </p>
            <p class="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-sidebar-soft">
              {{ roleLabel }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <nav class="mt-6 flex-1 space-y-1 overflow-y-auto px-3" :aria-label="strings.shell.navigation">
      <RouterLink
        v-for="item in links"
        :key="item.name"
        :to="{ name: item.name }"
        class="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-sidebar-soft transition-colors duration-200 hover:bg-white/[0.07] hover:text-sidebar-ink"
        :class="{ '!text-sidebar-ink': route.name === item.name }"
        :aria-current="route.name === item.name ? 'page' : undefined"
        :title="collapsed ? item.label : undefined"
      >
        <span
          class="absolute inset-y-2 left-0 w-[2px] origin-top scale-y-0 rounded-full bg-gold transition-transform duration-300 group-hover:scale-y-100"
          :class="{ 'scale-y-100': route.name === item.name }"
          aria-hidden="true"
        />
        <component :is="item.icon" class="h-5 w-5 shrink-0" aria-hidden="true" />
        <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
      </RouterLink>

      <RouterLink
        v-if="router.hasRoute('profile')"
        :to="{ name: 'profile' }"
        class="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-sidebar-soft transition-colors duration-200 hover:bg-white/[0.07] hover:text-sidebar-ink"
        :class="{ '!text-sidebar-ink': route.name === 'profile' }"
        :aria-current="route.name === 'profile' ? 'page' : undefined"
        :title="collapsed ? strings.common.profile : undefined"
      >
        <span
          class="absolute inset-y-2 left-0 w-[2px] origin-top scale-y-0 rounded-full bg-gold transition-transform duration-300 group-hover:scale-y-100"
          :class="{ 'scale-y-100': route.name === 'profile' }"
          aria-hidden="true"
        />
        <UserCircleIcon class="h-5 w-5 shrink-0" aria-hidden="true" />
        <span v-if="!collapsed" class="truncate">{{ strings.common.profile }}</span>
      </RouterLink>
    </nav>

    <div class="space-y-2 border-t border-white/10 p-3">
      <div :class="collapsed ? 'flex justify-center' : 'flex items-center justify-between gap-2'">
        <button
          v-if="!collapsed"
          type="button"
          class="hidden items-center gap-2 rounded-full px-2 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-sidebar-soft transition-colors hover:text-sidebar-ink lg:inline-flex"
          :aria-label="strings.shell.collapseSidebar"
          @click="emit('update:collapsed', true)"
        >
          <ChevronDoubleLeftIcon class="h-4 w-4" aria-hidden="true" />
          {{ strings.shell.collapseSidebar }}
        </button>

        <button
          v-else
          type="button"
          class="hidden h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sidebar-soft transition-colors hover:text-sidebar-ink lg:inline-flex"
          :aria-label="strings.shell.expandSidebar"
          @click="emit('update:collapsed', false)"
        >
          <ChevronDoubleRightIcon class="h-4 w-4" aria-hidden="true" />
        </button>

        <ThemeToggle tone="light" />
      </div>

      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-sidebar-soft transition-colors hover:bg-white/[0.07] hover:text-sidebar-ink disabled:opacity-60"
        :disabled="signingOut"
        :title="collapsed ? strings.common.signOut : undefined"
        @click="handleSignOut"
      >
        <ArrowLeftOnRectangleIcon class="h-5 w-5 shrink-0" aria-hidden="true" />
        <span v-if="!collapsed">{{
          signingOut ? strings.common.loading : strings.common.signOut
        }}</span>
      </button>
    </div>
  </aside>
</template>
