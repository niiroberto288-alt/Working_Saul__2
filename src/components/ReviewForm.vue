<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  EnvelopeIcon,
  UserIcon,
} from '@heroicons/vue/24/outline'
import FormField from '@/components/FormField.vue'
import { useForm } from '@/composables/useForm'
import { useReviewRequests } from '@/composables/useReviewRequests'
import { useToast } from '@/composables/useToast'
import { accepted, email, maxLength, required } from '@/utils/validators'
import { friendlyError } from '@/utils/errors'
import { strings } from '@/assets/strings'
import { LIMITS } from '@/config'

const { submit } = useReviewRequests()
const toast = useToast()

const form = ref(null)
const stamped = ref(false)

const roleOptions = [
  { value: 'student', label: strings.roles.student },
  { value: 'supervisor', label: strings.roles.supervisor },
]

const schema = {
  fullName: [required('Full name'), maxLength(LIMITS.FULL_NAME, 'Full name')],
  email: [required('Email'), email()],
  role: [required('Role')],
  institution: [required('Institution'), maxLength(LIMITS.INSTITUTION, 'Institution')],
  consent: [accepted('Consent')],
}

const { values, errorFor, blur, clearError, handleSubmit, submitting } = useForm({
  initial: { fullName: '', email: '', role: 'student', institution: '', consent: false },
  schema,
  focusTarget: form,
})

async function onSubmit() {
  const result = await handleSubmit(async (payload) => {
    try {
      await submit(payload)
      stamped.value = true
      toast.success(strings.home.reviewSuccess, strings.home.reviewSuccessTitle)
      window.setTimeout(() => {
        stamped.value = false
      }, 2400)
      payload.fullName = ''
      payload.email = ''
      payload.institution = ''
    } catch (error) {
      toast.error(friendlyError(error))
    }
  })

  return result
}
</script>

<template>
  <div class="card card-hairline relative overflow-hidden p-6 sm:p-8">
    <div>
      <p class="eyebrow">{{ strings.home.reviewEyebrow }}</p>
      <h3 class="mt-3 font-serif text-2xl leading-tight text-ink">
        {{ strings.home.reviewTitle }}
      </h3>
      <p class="mt-2 text-[0.86rem] leading-relaxed text-ink-soft">
        {{ strings.home.reviewBody }}
      </p>
    </div>

    <form ref="form" class="mt-6 space-y-5" novalidate @submit.prevent="onSubmit">
      <FormField
        id="review-name"
        v-model="values.fullName"
        :label="strings.auth.fullName"
        :icon="UserIcon"
        :error="errorFor('fullName')"
        :placeholder="strings.home.namePlaceholder"
        autocomplete="name"
        :maxlength="LIMITS.FULL_NAME"
        @blur="blur('fullName')"
        @update:model-value="clearError('fullName')"
      />

      <FormField
        id="review-email"
        v-model="values.email"
        :label="strings.auth.email"
        type="email"
        :icon="EnvelopeIcon"
        :error="errorFor('email')"
        placeholder="name@university.ac.rw"
        autocomplete="email"
        @blur="blur('email')"
        @update:model-value="clearError('email')"
      />

      <FormField
        id="review-role"
        v-model="values.role"
        :label="strings.home.roleLabel"
        type="select"
        :icon="UserIcon"
        :error="errorFor('role')"
        :options="roleOptions"
        @blur="blur('role')"
      />

      <FormField
        id="review-institution"
        v-model="values.institution"
        :label="strings.auth.institution"
        :icon="BuildingOffice2Icon"
        :error="errorFor('institution')"
        :placeholder="strings.home.institutionPlaceholder"
        autocomplete="organization"
        :maxlength="LIMITS.INSTITUTION"
        @blur="blur('institution')"
        @update:model-value="clearError('institution')"
      />

      <label class="flex cursor-pointer items-start gap-3 pt-1">
        <input
          v-model="values.consent"
          type="checkbox"
          class="mt-0.5 h-4 w-4 shrink-0 rounded border-line-strong accent-primary"
        />
        <span class="text-[0.8rem] leading-relaxed text-ink-soft">
          {{ strings.privacy.consentShort }}
          <RouterLink to="/privacy" class="underline decoration-line-strong hover:text-accent">
            {{ strings.privacy.linkLabel }}
          </RouterLink>
        </span>
      </label>

      <button
        type="submit"
        class="btn btn-primary w-full"
        :disabled="submitting || !values.consent"
      >
        {{ submitting ? strings.common.loading : strings.home.reviewCta }}
        <ArrowRightIcon v-if="!submitting" class="h-4 w-4" aria-hidden="true" />
      </button>

      <p class="text-center font-mono text-[0.56rem] uppercase tracking-[0.14em] text-ink-soft">
        {{ strings.home.reviewNote }}
      </p>
    </form>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="stamped"
        class="absolute inset-0 flex items-center justify-center bg-card-solid/80 backdrop-blur-sm"
        role="status"
      >
        <span
          class="stamp inline-flex items-center gap-2 rounded-lg border-2 border-ok px-5 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ok"
        >
          <CheckCircleIcon class="h-4 w-4" aria-hidden="true" />
          {{ strings.home.reviewStamp }}
        </span>
      </div>
    </Transition>
  </div>
</template>
