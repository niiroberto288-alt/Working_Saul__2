<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  ArrowRightIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
} from '@heroicons/vue/24/outline'
import AuthShell from '@/components/AuthShell.vue'
import FormField from '@/components/FormField.vue'
import { useAuth } from '@/composables/useAuth'
import { useForm } from '@/composables/useForm'
import { useToast } from '@/composables/useToast'
import { email, required } from '@/utils/validators'
import { friendlyError } from '@/utils/errors'
import { APP_MODE } from '@/services/supabase'
import { strings } from '@/assets/strings'

const route = useRoute()
const router = useRouter()
const { signIn, roleHome, demoAccounts } = useAuth()
const toast = useToast()

const form = ref(null)
const formError = ref('')
const demoHints = ref([])

const notice = computed(() => {
  if (route.query.expired === '1') return strings.auth.sessionExpired
  if (route.query.denied === '1') return strings.auth.notAuthorised
  return ''
})

const schema = {
  email: [required('Email'), email()],
  password: [required('Password')],
}

const { values, errorFor, blur, clearError, handleSubmit, submitting } = useForm({
  initial: { email: '', password: '' },
  schema,
  focusTarget: form,
})

onMounted(async () => {
  if (APP_MODE === 'demo') {
    demoHints.value = await demoAccounts()
  }
})

function useDemoAccount(account) {
  values.email = account.email
  values.password = account.password
  clearError('email')
  clearError('password')
}

async function onSubmit() {
  formError.value = ''

  await handleSubmit(async (payload) => {
    try {
      await signIn(payload.email, payload.password)
      toast.success(strings.auth.welcomeBack.replace('{name}', payload.email))

      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
      const destination = redirect.startsWith('/') ? redirect : roleHome.value
      await router.replace(destination)
    } catch (error) {
      formError.value = friendlyError(error, strings.auth.invalidCredentials)
    }
  })
}
</script>

<template>
  <AuthShell
    :eyebrow="strings.auth.signInEyebrow"
    :title="strings.auth.signInTitle"
    :subtitle="strings.auth.signInSubtitle"
  >
    <div
      v-if="notice"
      class="mb-6 flex items-start gap-2.5 rounded-xl border border-warn/40 bg-warn/[0.08] px-4 py-3"
      role="status"
    >
      <ExclamationTriangleIcon class="mt-0.5 h-4 w-4 shrink-0 text-warn" aria-hidden="true" />
      <p class="text-[0.82rem] leading-relaxed text-ink">{{ notice }}</p>
    </div>

    <div
      v-if="formError"
      class="mb-6 flex items-start gap-2.5 rounded-xl border border-danger/40 bg-danger/[0.06] px-4 py-3"
      role="alert"
    >
      <ExclamationTriangleIcon class="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
      <p class="text-[0.82rem] leading-relaxed text-ink">{{ formError }}</p>
    </div>

    <form ref="form" class="space-y-6" novalidate @submit.prevent="onSubmit">
      <FormField
        id="login-email"
        v-model="values.email"
        :label="strings.auth.email"
        type="email"
        :icon="EnvelopeIcon"
        :error="errorFor('email')"
        :placeholder="strings.auth.emailPlaceholder"
        autocomplete="email"
        @blur="blur('email')"
        @update:model-value="clearError('email')"
      />

      <div>
        <FormField
          id="login-password"
          v-model="values.password"
          :label="strings.auth.password"
          type="password"
          :icon="LockClosedIcon"
          :error="errorFor('password')"
          :placeholder="strings.auth.passwordPlaceholder"
          autocomplete="current-password"
          @blur="blur('password')"
          @update:model-value="clearError('password')"
        />
        <div class="mt-2 text-right">
          <RouterLink
            to="/forgot-password"
            class="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
          >
            {{ strings.auth.forgot }}
          </RouterLink>
        </div>
      </div>

      <button type="submit" class="btn btn-primary w-full" :disabled="submitting">
        {{ submitting ? strings.auth.signingIn : strings.auth.signIn }}
        <ArrowRightIcon v-if="!submitting" class="h-4 w-4" aria-hidden="true" />
      </button>
    </form>

    <div v-if="demoHints.length" class="mt-7 rounded-xl border border-dashed border-line p-4">
      <p class="mono-label">{{ strings.auth.demoTitle }}</p>
      <p class="mt-1 text-[0.76rem] leading-relaxed text-ink-soft">{{ strings.auth.demoHint }}</p>
      <ul class="mt-3 space-y-1.5">
        <li v-for="account in demoHints" :key="account.email">
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-primary/5"
            @click="useDemoAccount(account)"
          >
            <span class="font-mono text-[0.62rem] tracking-[0.04em] text-ink">
              {{ account.email }}
            </span>
            <span class="font-mono text-[0.56rem] uppercase tracking-[0.14em] text-ink-soft">
              {{ strings.roles[account.role] ?? account.role }}
            </span>
          </button>
        </li>
      </ul>
      <p class="mt-2 font-mono text-[0.52rem] uppercase tracking-[0.14em] text-ink-soft">
        {{ strings.shell.demoHint }}
      </p>
    </div>

    <template #footer>
      <p class="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-soft">
        {{ strings.auth.noAccount }}
        <RouterLink to="/register" class="ml-1 text-accent hover:text-ink">
          {{ strings.auth.createAccount }}
        </RouterLink>
      </p>
    </template>
  </AuthShell>
</template>
