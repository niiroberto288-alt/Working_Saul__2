<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { BellIcon, Bars3Icon, CheckIcon } from '@heroicons/vue/24/outline'
import Avatar from '@/components/Avatar.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useAuth } from '@/composables/useAuth'
import { strings } from '@/assets/strings'

const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  breadcrumb: { type: String, default: '' },
  notifications: { type: Array, default: () => [] },
  unreadCount: { type: Number, default: 0 },
})

const emit = defineEmits(['toggle-sidebar', 'mark-all-read', 'mark-read', 'open-profile'])

const { displayName, role } = useAuth()
const bellOpen = ref(false)
const bellWrapper = ref(null)

const roleLabel = computed(() => strings.roles.badge[role.value] ?? '')

const hasUnread = computed(() => props.unreadCount > 0)
const unreadLabel = computed(() =>
  hasUnread.value ? `${props.unreadCount} ${strings.shell.unread}` : strings.shell.noNotifications
)

function onDocumentClick(event) {
  if (!bellOpen.value) return
  if (bellWrapper.value && !bellWrapper.value.contains(event.target)) {
    bellOpen.value = false
  }
}

function onKeydown(event) {
  if (event.key === 'Escape') bellOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-line bg-page/70 backdrop-blur-xl supports-[backdrop-filter]:bg-page/55"
  >
    <div class="flex min-h-[76px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
      <button
        type="button"
        class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-line-strong lg:hidden"
        :aria-label="strings.shell.openMenu"
        @click="emit('toggle-sidebar')"
      >
        <Bars3Icon class="h-5 w-5" aria-hidden="true" />
      </button>

      <div class="min-w-0 flex-1">
        <p v-if="breadcrumb" class="mono-label truncate">{{ breadcrumb }}</p>
        <h1 class="truncate font-serif text-xl leading-tight text-ink sm:text-2xl">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="hidden truncate text-[0.8rem] text-ink-soft sm:block">
          {{ subtitle }}
        </p>
      </div>

      <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle />

        <div ref="bellWrapper" class="relative">
          <button
            type="button"
            class="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-line-strong"
            :aria-label="`${strings.shell.notifications}: ${unreadLabel}`"
            :aria-expanded="bellOpen"
            aria-controls="notification-panel"
            @click="bellOpen = !bellOpen"
          >
            <BellIcon class="h-5 w-5" aria-hidden="true" />
            <span
              v-if="hasUnread"
              class="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 font-mono text-[0.58rem] leading-none text-white"
              aria-hidden="true"
            >
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </button>

          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div
              v-if="bellOpen"
              id="notification-panel"
              class="card absolute right-0 top-[calc(100%+0.6rem)] w-[min(22rem,calc(100vw-2rem))] overflow-hidden p-0"
            >
              <div class="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
                <p class="mono-label">{{ strings.shell.notifications }}</p>
                <button
                  v-if="hasUnread"
                  type="button"
                  class="inline-flex items-center gap-1 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-accent hover:text-ink"
                  @click="emit('mark-all-read')"
                >
                  <CheckIcon class="h-3.5 w-3.5" aria-hidden="true" />
                  {{ strings.shell.markAllRead }}
                </button>
              </div>

              <ul v-if="notifications.length" class="max-h-80 divide-y divide-line overflow-y-auto">
                <li v-for="item in notifications" :key="item.id">
                  <button
                    type="button"
                    class="flex w-full items-start gap-2 px-4 py-3 text-left transition-colors hover:bg-primary/5"
                    @click="emit('mark-read', item.id)"
                  >
                    <span
                      class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      :class="item.read ? 'bg-transparent' : 'bg-accent'"
                      aria-hidden="true"
                    />
                    <span class="min-w-0">
                      <span class="block text-[0.82rem] leading-snug text-ink">{{
                        item.message
                      }}</span>
                      <span
                        class="mt-0.5 block font-mono text-[0.56rem] uppercase tracking-[0.14em] text-ink-soft"
                      >
                        {{ item.created_at }}
                      </span>
                    </span>
                  </button>
                </li>
              </ul>

              <div v-else class="px-4 py-8 text-center">
                <p class="font-serif text-lg text-ink">{{ strings.shell.noNotifications }}</p>
                <p class="mt-1 text-[0.8rem] text-ink-soft">
                  {{ strings.shell.noNotificationsBody }}
                </p>
              </div>
            </div>
          </Transition>
        </div>

        <button
          type="button"
          class="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-2 transition-colors hover:border-line-strong sm:pr-3"
          :aria-label="`${strings.shell.account}: ${displayName}`"
          @click="emit('open-profile')"
        >
          <Avatar :name="displayName" size="sm" />
          <span class="hidden text-left sm:block">
            <span
              class="block max-w-[9rem] truncate font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink"
            >
              {{ displayName || strings.common.profile }}
            </span>
            <span class="block font-mono text-[0.52rem] uppercase tracking-[0.16em] text-ink-soft">
              {{ roleLabel }}
            </span>
          </span>
        </button>
      </div>
    </div>
  </header>
</template>
