import { describe, expect, it } from 'vitest'
import {
  email,
  hoursWorked,
  notFutureDate,
  password,
  passwordStrength,
  required,
  validateFields,
} from '@/utils/validators'

describe('validators', () => {
  it('requires a value and trims whitespace', () => {
    expect(required('Email')('   ')).toBe('Email is required.')
    expect(required('Email')('a@b.rw')).toBeNull()
  })

  it('checks email shape', () => {
    expect(email()('not-an-email')).toMatch(/valid email/)
    expect(email()('aline@university.ac.rw')).toBeNull()
    expect(email()('')).toBeNull()
  })

  it('enforces the eight character minimum', () => {
    expect(password()('short')).toMatch(/at least 8/)
    expect(password()('longenough')).toBeNull()
  })

  it('scores password strength', () => {
    expect(passwordStrength('').label).toBe('')
    expect(passwordStrength('short').score).toBe(1)
    expect(passwordStrength('Str0ng-passphrase!').label).toBe('Strong')
  })

  it('rejects zero, negative and over-24 hours', () => {
    expect(hoursWorked()('0')).toMatch(/greater than zero/)
    expect(hoursWorked()('25')).toMatch(/cannot exceed 24/)
    expect(hoursWorked()('7.5')).toBeNull()
  })

  it('rejects a future entry date', () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
    expect(notFutureDate('Entry date')(tomorrow)).toMatch(/future/)
  })

  it('returns the first invalid field', () => {
    const result = validateFields(
      { email: '', password: 'a' },
      { email: [required('Email'), email()], password: [required('Password'), password()] }
    )
    expect(result.valid).toBe(false)
    expect(result.firstInvalid).toBe('email')
    expect(result.errors.email).toBe('Email is required.')
  })
})
