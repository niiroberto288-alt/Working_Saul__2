/**
 * Form state shared by the auth pages (FURPS+ U1).
 *
 * Validation runs on blur and on submit, errors are returned per field, and the
 * caller focuses the first invalid field. HTML `required` is never the only
 * guard.
 */
import { computed, reactive, ref } from 'vue'
import { focusFirstInvalid, validateFields } from '@/utils/validators'

export function useForm({ initial = {}, schema = {}, focusTarget = null } = {}) {
  const values = reactive({ ...initial })
  const errors = ref({})
  const touched = ref({})
  const submitting = ref(false)
  const touchedAny = computed(() => Object.keys(touched.value).length > 0)

  function errorFor(field) {
    return errors.value[field] ?? ''
  }

  function validateField(field) {
    const rules = schema[field]
    if (!rules) return true

    const result = validateFields(values, { [field]: rules })
    if (result.errors[field]) {
      errors.value = { ...errors.value, [field]: result.errors[field] }
      return false
    }

    const next = { ...errors.value }
    delete next[field]
    errors.value = next
    return true
  }

  function validateAll() {
    const result = validateFields(values, schema)
    errors.value = result.errors
    return result
  }

  /** Mark a field as touched and validate it (call on blur). */
  function blur(field) {
    touched.value = { ...touched.value, [field]: true }
    validateField(field)
  }

  /** Wipe the error for a field as soon as the user edits it again. */
  function clearError(field) {
    if (!errors.value[field]) return
    const next = { ...errors.value }
    delete next[field]
    errors.value = next
  }

  function focusFirst(field) {
    const target = focusTarget?.value ?? focusTarget
    focusFirstInvalid(target, field)
  }

  /**
   * Validate, then run the handler. Returns the handler's value, or null when
   * validation blocked. `submitting` is always reset.
   */
  async function handleSubmit(handler) {
    const result = validateAll()
    Object.keys(values).forEach((key) => {
      touched.value = { ...touched.value, [key]: true }
    })

    if (!result.valid) {
      focusFirst(result.firstInvalid)
      return null
    }

    submitting.value = true
    try {
      return await handler(values)
    } finally {
      submitting.value = false
    }
  }

  function reset(nextValues = null) {
    Object.keys(values).forEach((key) => {
      values[key] = nextValues?.[key] ?? initial[key] ?? ''
    })
    errors.value = {}
    touched.value = {}
  }

  return {
    values,
    errors,
    touched,
    touchedAny,
    submitting,
    errorFor,
    blur,
    clearError,
    validateField,
    validateAll,
    handleSubmit,
    focusFirst,
    reset,
  }
}

export default useForm
