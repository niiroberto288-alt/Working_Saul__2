<script setup>
import { computed, ref } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { passwordStrength } from '@/utils/validators'
import { strings } from '@/assets/strings'

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  icon: { type: [Object, Function], default: null },
  error: { type: String, default: '' },
  help: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  autocomplete: { type: String, default: 'off' },
  maxlength: { type: Number, default: undefined },
  options: { type: Array, default: () => [] },
  showStrength: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'blur'])

const revealed = ref(false)

const isPassword = computed(() => props.type === 'password')
const isSelect = computed(() => props.type === 'select')
const inputType = computed(() => {
  if (!isPassword.value) return props.type
  return revealed.value ? 'text' : 'password'
})

const strength = computed(() =>
  props.showStrength ? passwordStrength(String(props.modelValue ?? '')) : null
)

const strengthBars = computed(() => {
  const score = strength.value?.score ?? 0
  return [1, 2, 3, 4].map((step) => step <= score)
})

const strengthTone = computed(() => {
  const score = strength.value?.score ?? 0
  if (score >= 4) return 'bg-ok'
  if (score === 3) return 'bg-gold'
  if (score === 2) return 'bg-warn'
  return 'bg-danger'
})

function onInput(event) {
  emit('update:modelValue', event.target.value)
}

function onBlur(event) {
  emit('blur', event)
}
</script>

<template>
  <div class="field" :data-field="id">
    <label :for="id" class="field-label">
      {{ label }}
    </label>

    <div class="relative">
      <component
        :is="icon"
        v-if="icon"
        class="pointer-events-none absolute left-0 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-soft"
        aria-hidden="true"
      />

      <select
        v-if="isSelect"
        :id="id"
        class="field-select"
        :class="icon ? 'pl-7' : ''"
        :value="modelValue"
        :disabled="disabled"
        :aria-invalid="Boolean(error)"
        :aria-describedby="error ? `${id}-error` : help ? `${id}-help` : undefined"
        @change="onInput"
        @blur="onBlur"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <input
        v-else
        :id="id"
        class="field-input"
        :class="[icon ? 'pl-7' : '', isPassword ? 'pr-10' : '']"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :maxlength="maxlength"
        :disabled="disabled"
        :aria-invalid="Boolean(error)"
        :aria-describedby="error ? `${id}-error` : help ? `${id}-help` : undefined"
        @input="onInput"
        @blur="onBlur"
      />

      <button
        v-if="isPassword"
        type="button"
        class="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-soft transition-colors hover:text-ink"
        :aria-label="revealed ? strings.auth.hidePassword : strings.auth.showPassword"
        :aria-pressed="revealed"
        tabindex="0"
        @click="revealed = !revealed"
      >
        <EyeSlashIcon v-if="revealed" class="h-[18px] w-[18px]" aria-hidden="true" />
        <EyeIcon v-else class="h-[18px] w-[18px]" aria-hidden="true" />
      </button>
    </div>

    <div v-if="showStrength && modelValue" class="mt-1.5">
      <div class="flex items-center gap-1.5" aria-hidden="true">
        <span
          v-for="(filled, index) in strengthBars"
          :key="index"
          class="h-1 w-8 rounded-full transition-colors duration-300"
          :class="filled ? strengthTone : 'bg-ink/12'"
        />
      </div>
      <p class="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink-soft">
        {{ strength.label }} &middot; {{ strength.hint }}
      </p>
    </div>

    <p v-if="error" :id="`${id}-error`" class="field-error" role="alert">
      {{ error }}
    </p>
    <p v-else-if="help" :id="`${id}-help`" class="field-help">{{ help }}</p>
  </div>
</template>
