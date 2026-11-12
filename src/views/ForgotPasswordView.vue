<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  EnvelopeIcon,
} from '@heroicons/vue/24/outline'
import AuthShell from '@/components/AuthShell.vue'
import FormField from '@/components/FormField.vue'
import { useAuth } from '@/composables/useAuth'
import { useForm } from '@/composables/useForm'
import { email, required } from '@/utils/validators'
import { APP_MODE } from '@/services/supabase'
import { strings } from '@/assets/strings'

const { requestPasswordReset } = useAuth()
const demoMode = APP_MODE === 'demo'

const form = ref(null)
const sent = ref(false)
const formError = ref('')

const schema = {
  email: [required('Email'), email()],
}

const { values, errorFor, blur, clearError, handleSubmit, submitting } = useForm({
  initial: { email: '' },
  schema,
  focusTarget: form,
})

async function onSubmit() {
  formError.value = ''

  // The same confirmation is shown whether or not the address exists (F2).
  const outcome = await handleSubmit(async (payload) => {
    try {
      await requestPasswordReset(payload.email)
      sent.value = true
    } catch (error) {
      // Never reveal whether the account exists; log and show the same message.
      sent.value = true
    }
  })

  return outcome
}
</script>

<template>
  <AuthShell
    :eyebrow="strings.forgot.eyebrow"
    :title="strings.forgot.title"
    :subtitle="strings.forgot.subtitle"
  >
    <div v-if="sent" class="rounded-xl border border-ok/40 bg-ok/[0.06] p-5" role="status">
      <CheckCircleIcon class="h-7 w-7 text-ok" aria-hidden="true" />
      <p class="mt-3 text-[0.92rem] leading-relaxed text-ink">{{ strings.forgot.sent }}</p>
      <RouterLink to="/login" class="link-arrow mt-5 inline-flex">
        <ArrowLeftIcon class="h-3.5 w-3.5" aria-hidden="true" />
        {{ strings.forgot.backToLogin }}
      </RouterLink>
    </div>

    <form v-else ref="form" class="space-y-6" novalidate @submit.prevent="onSubmit">
      <p v-if="formError" class="field-error" role="alert">{{ formError }}</p>

      <FormField
        id="forgot-email"
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

      <button type="submit" class="btn btn-primary w-full" :disabled="submitting">
        {{ submitting ? strings.forgot.sending : strings.forgot.cta }}
        <ArrowRightIcon v-if="!submitting" class="h-4 w-4" aria-hidden="true" />
      </button>

      <p
        v-if="demoMode"
        class="text-center font-mono text-[0.55rem] uppercase tracking-[0.14em] text-ink-soft"
      >
        {{ strings.forgot.demoNote }}
      </p>
    </form>

    <template #footer>
      <RouterLink
        to="/login"
        class="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-accent"
      >
        {{ strings.forgot.backToLogin }}
      </RouterLink>
    </template>
  </AuthShell>
</template>
