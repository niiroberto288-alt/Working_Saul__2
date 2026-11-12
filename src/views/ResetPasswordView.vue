<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ArrowRightIcon, LockClosedIcon } from '@heroicons/vue/24/outline'
import AuthShell from '@/components/AuthShell.vue'
import FormField from '@/components/FormField.vue'
import { useAuth } from '@/composables/useAuth'
import { useForm } from '@/composables/useForm'
import { useToast } from '@/composables/useToast'
import { matches, password, required } from '@/utils/validators'
import { friendlyError } from '@/utils/errors'
import { APP_MODE } from '@/services/supabase'
import { strings } from '@/assets/strings'

const router = useRouter()
const { updatePassword, isAuthenticated } = useAuth()
const toast = useToast()

const form = ref(null)
const formError = ref('')

// A recovery link signs the user in through Supabase before this page renders.
const hasRecoverySession = computed(() => APP_MODE === 'demo' || isAuthenticated.value)

const schema = {
  password: [required('Password'), password()],
  confirmPassword: [required('Confirm password'), matches('password', 'The two passwords')],
}

const { values, errorFor, blur, clearError, handleSubmit, submitting } = useForm({
  initial: { password: '', confirmPassword: '' },
  schema,
  focusTarget: form,
})

async function onSubmit() {
  formError.value = ''

  await handleSubmit(async (payload) => {
    try {
      await updatePassword(payload.password)
      toast.success(strings.reset.success)
      await router.replace({ name: 'login' })
    } catch (error) {
      formError.value = friendlyError(error)
    }
  })
}
</script>

<template>
  <AuthShell
    :eyebrow="strings.reset.eyebrow"
    :title="hasRecoverySession ? strings.reset.title : strings.reset.noSessionTitle"
    :subtitle="hasRecoverySession ? strings.reset.subtitle : strings.reset.noSessionBody"
  >
    <div v-if="!hasRecoverySession" class="space-y-5">
      <RouterLink to="/forgot-password" class="btn btn-primary w-full">
        {{ strings.reset.requestNew }}
        <ArrowRightIcon class="h-4 w-4" aria-hidden="true" />
      </RouterLink>
      <RouterLink to="/login" class="link-arrow inline-flex">
        {{ strings.forgot.backToLogin }}
      </RouterLink>
    </div>

    <form v-else ref="form" class="space-y-6" novalidate @submit.prevent="onSubmit">
      <p v-if="formError" class="field-error" role="alert">{{ formError }}</p>

      <FormField
        id="reset-password"
        v-model="values.password"
        :label="strings.reset.newPassword"
        type="password"
        :icon="LockClosedIcon"
        :error="errorFor('password')"
        :placeholder="strings.auth.passwordPlaceholder"
        autocomplete="new-password"
        show-strength
        @blur="blur('password')"
        @update:model-value="clearError('password')"
      />

      <FormField
        id="reset-confirm"
        v-model="values.confirmPassword"
        :label="strings.auth.confirmPassword"
        type="password"
        :icon="LockClosedIcon"
        :error="errorFor('confirmPassword')"
        autocomplete="new-password"
        @blur="blur('confirmPassword')"
        @update:model-value="clearError('confirmPassword')"
      />

      <button type="submit" class="btn btn-primary w-full" :disabled="submitting">
        {{ submitting ? strings.reset.saving : strings.reset.cta }}
        <ArrowRightIcon v-if="!submitting" class="h-4 w-4" aria-hidden="true" />
      </button>

      <p
        v-if="APP_MODE === 'demo'"
        class="text-center font-mono text-[0.55rem] uppercase tracking-[0.14em] text-ink-soft"
      >
        {{ strings.reset.demoNote }}
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
