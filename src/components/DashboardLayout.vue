<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import TopNavbar from '@/components/TopNavbar.vue'
import { useAuth } from '@/composables/useAuth'
import { ROLES } from '@/config'

defineProps({
  role: { type: String, default: ROLES.STUDENT },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  breadcrumb: { type: String, default: '' },
})

const emit = defineEmits(['open-profile'])

const router = useRouter()
const { displayName } = useAuth()

const collapsed = ref(false)
const mobileOpen = ref(false)

const contentOffset = computed(() => (collapsed.value ? 'lg:pl-[86px]' : 'lg:pl-[264px]'))

function openMobileSidebar() {
  // A collapsed desktop rail must not collapse the phone drawer.
  collapsed.value = false
  mobileOpen.value = true
}

function openProfile() {
  emit('open-profile')
  if (router.hasRoute('profile')) {
    router.push({ name: 'profile' })
  }
}
</script>

<template>
  <div class="min-h-screen">
    <Sidebar
      :role="role"
      :collapsed="collapsed"
      :mobile-open="mobileOpen"
      @update:collapsed="collapsed = $event"
      @update:mobile-open="mobileOpen = $event"
    />

    <div :class="['flex min-h-screen flex-col transition-[padding] duration-300', contentOffset]">
      <TopNavbar
        :title="title"
        :subtitle="subtitle"
        :breadcrumb="breadcrumb"
        @toggle-sidebar="openMobileSidebar"
        @open-profile="openProfile"
      />

      <main id="main-content" class="flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8" tabindex="-1">
        <div class="mx-auto w-full max-w-[1180px]">
          <slot />
        </div>
      </main>

      <footer class="border-t border-line px-4 py-5 sm:px-6 lg:px-8">
        <div
          class="mx-auto flex w-full max-w-[1180px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink-soft">
            AttachTrack Rwanda &middot; {{ displayName || 'Signed in' }}
          </p>
          <p class="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink-soft">
            Internship logbook management
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>
