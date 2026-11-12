<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from '@heroicons/vue/24/outline'
import AuthShell from '@/components/AuthShell.vue'
import FormField from '@/components/FormField.vue'
import { useAuth } from '@/composables/useAuth'
import { useForm } from '@/composables/useForm'
import { useToast } from '@/composables/useToast'
import { accepted, email, matches, maxLength, password, required } from '@/utils/validators'
import { friendlyError } from '@/utils/errors'
import { LIMITS, REGISTRABLE_ROLES, ROLES } from '@/config'
import { strings } from '@/assets/strings'

const router = useRouter()
const { signUp, roleHome } = useAuth()
const toast = useToast()

const form = ref(null)
const formError = ref('')
const confirmationPending = ref(false)

const roleChoices = REGISTRABLE_ROLES.map((role) => ({
  value: role,
  label: strings.roles[role],
}))

const schema = {
  fullName: [required('Full name'), maxLength(LIMITS.FULL_NAME, 'Full name')],
  email: [required('Email'), email()],
  password: [required('Password'), password()],
  confirmPassword: [required('Confirm password'), matches('password', 'The two passwords')],
  institution: [required('Institution'), maxLength(LIMITS.INSTITUTION, 'Institution')],
  company: [maxLength(LIMITS.COMPANY, 'Host organisation')],
  role: [required('Role')],
  consent: [accepted('Consent')],
}

const { values, errorFor, blur, clearError, handleSubmit, submitting } = useForm({
  initial: {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: '',
    company: '',
    department: '',
    phone: '',
    role: ROLES.STUDENT,
    consent: false,
  },
  schema,
  focusTarget: form,
})

const roleLabel = computed(() => strings.roles[values.role] ?? values.role)

function chooseRole(role) {
  values.role = role
  clearError('role')
}

async function onSubmit() {
  formError.value = ''

  await handleSubmit(async (payload) => {
    try {
      const result = await signUp({
        email: payload.email,
        password: payload.password,
        fullName: payload.fullName,
        role: payload.role,
        institution: payload.institution,
        company: payload.company,
        department: payload.department,
        phone: payload.phone,
      })

      if (result.needsConfirmation) {
        confirmationPending.value = true
        return
      }

      toast.success(strings.auth.welcomeBack.replace('{name}', payload.fullName))
      await router.replace(roleHome.value)
    } catch (error) {
      formError.value = friendlyError(error)
    }
  })
}
</script>

<template>
  <AuthShell
    :eyebrow="strings.auth.registerEyebrow"
    :title="strings.auth.registerTitle"
    :subtitle="strings.auth.registerSubtitle"
    width="lg"
  >
    <div
      v-if="confirmationPending"
      class="rounded-xl border border-ok/40 bg-ok/[0.06] p-5 text-center"
      role="status"
    >
      <CheckCircleIcon class="mx-auto h-8 w-8 text-ok" aria-hidden="true" />
      <p class="mt-3 font-serif text-xl text-ink">{{ strings.auth.checkInbox }}</p>
      <p class="mt-2 text-[0.85rem] leading-relaxed text-ink-soft">
        {{ strings.auth.checkInboxBody }}
      </p>
      <RouterLink to="/login" class="link-arrow mt-5 inline-flex">
        {{ strings.auth.signIn }}
        <ArrowRightIcon class="h-3.5 w-3.5" aria-hidden="true" />
      </RouterLink>
    </div>

    <template v-else>
      <div
        v-if="formError"
        class="mb-6 rounded-xl border border-danger/40 bg-danger/[0.06] px-4 py-3"
        role="alert"
      >
        <p class="text-[0.82rem] leading-relaxed text-ink">{{ formError }}</p>
      </div>

      <form ref="form" class="space-y-6" novalidate @submit.prevent="onSubmit">
        <div class="grid gap-6 sm:grid-cols-2">
          <FormField
            id="register-name"
            v-model="values.fullName"
            :label="strings.auth.fullName"
            :icon="UserIcon"
            :error="errorFor('fullName')"
            :placeholder="strings.auth.fullNamePlaceholder"
            autocomplete="name"
            :maxlength="LIMITS.FULL_NAME"
            @blur="blur('fullName')"
            @update:model-value="clearError('fullName')"
          />

          <FormField
            id="register-email"
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
        </div>

        <fieldset>
          <legend class="field-label mb-2">{{ strings.auth.chooseRole }}</legend>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="choice in roleChoices"
              :key="choice.value"
              type="button"
              :class="[
                'rounded-full border px-4 py-2 font-mono text-[0.64rem] uppercase tracking-[0.16em] transition-all duration-200',
                values.role === choice.value
                  ? 'border-primary bg-primary text-on-primary'
                  : 'border-line-strong text-ink-soft hover:border-primary hover:text-ink',
              ]"
              :aria-pressed="values.role === choice.value"
              @click="chooseRole(choice.value)"
            >
              {{ choice.label }}
            </button>
          </div>
          <p class="field-help mt-2">{{ strings.auth.roleHint }}</p>
          <p v-if="errorFor('role')" class="field-error">{{ errorFor('role') }}</p>
        </fieldset>

        <div class="grid gap-6 sm:grid-cols-2">
          <FormField
            id="register-password"
            v-model="values.password"
            :label="strings.auth.password"
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
            id="register-confirm"
            v-model="values.confirmPassword"
            :label="strings.auth.confirmPassword"
            type="password"
            :icon="LockClosedIcon"
            :error="errorFor('confirmPassword')"
            autocomplete="new-password"
            @blur="blur('confirmPassword')"
            @update:model-value="clearError('confirmPassword')"
          />
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          <FormField
            id="register-institution"
            v-model="values.institution"
            :label="strings.auth.institution"
            :icon="BuildingOffice2Icon"
            :error="errorFor('institution')"
            :placeholder="strings.auth.institutionPlaceholder"
            autocomplete="organization"
            :maxlength="LIMITS.INSTITUTION"
            @blur="blur('institution')"
            @update:model-value="clearError('institution')"
          />

          <FormField
            id="register-company"
            v-model="values.company"
            :label="`${strings.auth.company} (${strings.common.optional})`"
            :icon="BuildingOffice2Icon"
            :error="errorFor('company')"
            :placeholder="strings.auth.companyPlaceholder"
            autocomplete="organization"
            :maxlength="LIMITS.COMPANY"
            @blur="blur('company')"
            @update:model-value="clearError('company')"
          />
        </div>

        <label class="flex cursor-pointer items-start gap-3">
          <input
            v-model="values.consent"
            type="checkbox"
            class="mt-0.5 h-4 w-4 shrink-0 rounded border-line-strong accent-primary"
            :aria-invalid="Boolean(errorFor('consent'))"
            @change="clearError('consent')"
          />
          <span class="text-[0.8rem] leading-relaxed text-ink-soft">
            {{ strings.privacy.consentShort }}
            <RouterLink to="/privacy" class="underline decoration-line-strong hover:text-accent">
              {{ strings.privacy.linkLabel }}
            </RouterLink>
          </span>
        </label>
        <p v-if="errorFor('consent')" class="field-error">{{ errorFor('consent') }}</p>

        <button type="submit" class="btn btn-primary w-full" :disabled="submitting">
          {{ submitting ? strings.auth.registering : strings.auth.register }}
          <ArrowRightIcon v-if="!submitting" class="h-4 w-4" aria-hidden="true" />
        </button>

        <p class="text-center font-mono text-[0.56rem] uppercase tracking-[0.14em] text-ink-soft">
          {{ strings.auth.roleHint }}
        </p>
        <p class="sr-only">{{ roleLabel }}</p>
      </form>
    </template>

    <template #footer>
      <p class="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-soft">
        {{ strings.auth.haveAccount }}
        <RouterLink to="/login" class="ml-1 text-accent hover:text-ink">
          {{ strings.auth.signInLink }}
        </RouterLink>
      </p>
    </template>
  </AuthShell>
</template>
