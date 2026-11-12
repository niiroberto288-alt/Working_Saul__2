/**
 * Shared validators (FURPS+ U1).
 *
 * A validator is a function `(value, values) => string | null`. Compose them
 * into a schema and run it on blur and on submit. Never rely on the HTML
 * `required` attribute alone - it is a hint, not a rule.
 */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const PASSWORD_MIN_LENGTH = 8

function isEmpty(value) {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  return false
}

/** Required field. `label` is used in the message shown under the field. */
export function required(label = 'This field') {
  return (value) => (isEmpty(value) ? `${label} is required.` : null)
}

export function minLength(length, label = 'This field') {
  return (value) => {
    if (isEmpty(value)) return null
    return String(value).trim().length < length
      ? `${label} must be at least ${length} characters.`
      : null
  }
}

export function maxLength(length, label = 'This field') {
  return (value) => {
    if (isEmpty(value)) return null
    return String(value).trim().length > length
      ? `${label} must be ${length} characters or fewer.`
      : null
  }
}

export function email() {
  return (value) => {
    if (isEmpty(value)) return null
    return EMAIL_PATTERN.test(String(value).trim())
      ? null
      : 'Enter a valid email address, for example name@university.ac.rw.'
  }
}

export function matches(fieldName, label, valuesGetter) {
  return (value, values) => {
    const other = valuesGetter ? valuesGetter(values) : values?.[fieldName]
    return value === other ? null : `${label} do not match.`
  }
}

/**
 * Password strength information for the hint under the field.
 * @param {string} value
 * @returns {{ score: number, label: string, hint: string }}
 */
export function passwordStrength(value = '') {
  const text = String(value)
  let score = 0
  if (text.length >= PASSWORD_MIN_LENGTH) score += 1
  if (text.length >= 12) score += 1
  if (/[a-z]/.test(text) && /[A-Z]/.test(text)) score += 1
  if (/\d/.test(text)) score += 1
  if (/[^A-Za-z0-9]/.test(text)) score += 1

  const bounded = Math.max(0, Math.min(4, score))

  if (text.length === 0) {
    return { score: 0, label: '', hint: `At least ${PASSWORD_MIN_LENGTH} characters.` }
  }

  if (text.length < PASSWORD_MIN_LENGTH) {
    return {
      score: 1,
      label: 'Too short',
      hint: `Add ${PASSWORD_MIN_LENGTH - text.length} more character${
        PASSWORD_MIN_LENGTH - text.length === 1 ? '' : 's'
      }.`,
    }
  }

  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong']
  const hints = [
    `At least ${PASSWORD_MIN_LENGTH} characters.`,
    'Add a number or symbol to make it harder to guess.',
    'Mix upper and lower case, or make it longer.',
    'A longer passphrase would make this stronger.',
    'Strong passphrase. Keep it somewhere safe.',
  ]

  return { score: bounded, label: labels[bounded], hint: hints[bounded] }
}

export function password() {
  return (value) => {
    if (isEmpty(value)) return null
    return String(value).length < PASSWORD_MIN_LENGTH
      ? `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`
      : null
  }
}

/** Whole or decimal hours, greater than 0 and at most 24. */
export function hoursWorked() {
  return (value) => {
    if (isEmpty(value)) return null
    const number = Number(value)
    if (!Number.isFinite(number)) return 'Enter hours as a number, for example 7.5.'
    if (number <= 0) return 'Hours must be greater than zero.'
    if (number > 24) return 'A single entry cannot exceed 24 hours.'
    return null
  }
}

/** ISO date (yyyy-mm-dd) that is not in the future. */
export function notFutureDate(label = 'Date') {
  return (value) => {
    if (isEmpty(value)) return null
    const parsed = new Date(`${value}T00:00:00`)
    if (Number.isNaN(parsed.getTime())) return `${label} must be a valid date.`
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    return parsed.getTime() > today.getTime() ? `${label} cannot be in the future.` : null
  }
}

/** Date range where `start` must not be after `end`. */
export function dateOrder(startKey, label = 'End date') {
  return (value, values) => {
    if (!value || !values?.[startKey]) return null
    return new Date(value) < new Date(values[startKey])
      ? `${label} must be on or after the start date.`
      : null
  }
}

export function accepted(label = 'Consent') {
  return (value) => (value === true ? null : `${label} is required to continue.`)
}

export function oneOf(allowedValues, label = 'Value') {
  return (value) => {
    if (isEmpty(value)) return null
    return allowedValues.includes(value) ? null : `${label} is not a valid choice.`
  }
}

export function fileWithinLimits({ maxBytes, allowedTypes, allowedExtensions }) {
  return (file) => {
    if (!file) return null
    const name = String(file.name ?? '').toLowerCase()
    const type = String(file.type ?? '').toLowerCase()
    const extensionAllowed = allowedExtensions?.some((extension) => name.endsWith(extension))
    const typeAllowed = allowedTypes?.includes(type)

    if (!extensionAllowed && !typeAllowed) {
      return 'Attach a PDF, PNG or JPG file.'
    }
    if (typeof file.size === 'number' && file.size > maxBytes) {
      return `Files must be 5 MB or smaller. This one is ${(file.size / (1024 * 1024)).toFixed(1)} MB.`
    }
    return null
  }
}

/**
 * Run a schema of validators.
 * @param {Record<string, unknown>} values
 * @param {Record<string, Array<Function>>} schema
 * @returns {{ valid: boolean, errors: Record<string, string>, firstInvalid: string|null }}
 */
export function validateFields(values, schema) {
  const errors = {}
  let firstInvalid = null

  for (const [field, rules] of Object.entries(schema)) {
    for (const rule of rules) {
      const message = rule(values?.[field], values)
      if (message) {
        errors[field] = message
        if (!firstInvalid) firstInvalid = field
        break
      }
    }
  }

  return { valid: Object.keys(errors).length === 0, errors, firstInvalid }
}

/**
 * Move focus to the first invalid field and scroll it into view (U1).
 * Accepts either a form element reference or any container element.
 */
export function focusFirstInvalid(container, fieldName) {
  if (!container || !fieldName) return

  const scope = container.$el ?? container
  const target =
    scope.querySelector?.(`[data-field="${fieldName}"]`) ??
    scope.querySelector?.(`[name="${fieldName}"]`)

  if (!target) return

  target.focus({ preventScroll: true })
  target.scrollIntoView?.({ block: 'center', behavior: 'smooth' })
}

export default {
  EMAIL_PATTERN,
  PASSWORD_MIN_LENGTH,
  required,
  minLength,
  maxLength,
  email,
  matches,
  password,
  passwordStrength,
  hoursWorked,
  notFutureDate,
  dateOrder,
  accepted,
  oneOf,
  fileWithinLimits,
  validateFields,
  focusFirstInvalid,
}
