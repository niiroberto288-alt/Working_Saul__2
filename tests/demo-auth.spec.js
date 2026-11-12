import { beforeEach, describe, expect, it } from 'vitest'
import { initAuth, useAuth } from '@/composables/useAuth'
import { resetDemoState } from '@/services/demoData'
import { APP_MODE } from '@/services/supabase'
import { ROLES } from '@/config'

describe('demo mode', () => {
  beforeEach(async () => {
    resetDemoState()
    await initAuth()
  })

  it('detects demo mode when no Supabase keys are present', () => {
    expect(APP_MODE).toBe('demo')
  })

  it('signs in the demo student', async () => {
    const { signIn, role, displayName } = useAuth()
    const profile = await signIn('student@example.com', 'student1234')

    expect(profile.full_name).toBe('Aline Uwase')
    expect(role.value).toBe(ROLES.STUDENT)
    expect(displayName.value).toBe('Aline Uwase')
  })

  it('signs in the demo supervisor and admin', async () => {
    const { signIn, role } = useAuth()

    await signIn('supervisor@example.com', 'supervisor1234')
    expect(role.value).toBe(ROLES.SUPERVISOR)

    await signIn('admin@example.com', 'admin1234')
    expect(role.value).toBe(ROLES.ADMIN)
  })

  it('rejects a wrong password', async () => {
    const { signIn } = useAuth()
    await expect(signIn('student@example.com', 'wrong-password')).rejects.toThrow(
      'invalid_credentials'
    )
  })

  it('normalises the email before matching', async () => {
    const { signIn, role } = useAuth()
    await signIn('  STUDENT@Example.com ', 'student1234')
    expect(role.value).toBe(ROLES.STUDENT)
  })
})
