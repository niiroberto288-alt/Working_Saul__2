import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import router from '@/router'
import { initAuth, useAuth } from '@/composables/useAuth'
import { resetDemoState } from '@/services/demoData'

const Stub = defineComponent({ name: 'GuardStub', render: () => h('div') })

beforeAll(async () => {
  await initAuth()

  // Protected routes land in Phase 3 to 5; these stand in for the guard tests.
  router.addRoute({
    path: '/student/dashboard',
    name: 'test-student-dashboard',
    component: Stub,
    meta: { requiresAuth: true, roles: ['student'] },
  })
  router.addRoute({
    path: '/supervisor/dashboard',
    name: 'test-supervisor-dashboard',
    component: Stub,
    meta: { requiresAuth: true, roles: ['supervisor'] },
  })
})

beforeEach(async () => {
  resetDemoState()
  await useAuth().signOut()
})

describe('router guard', () => {
  it('sends a signed-out visitor to login with a redirect back', async () => {
    await router.push('/student/dashboard').catch(() => {})
    const current = router.currentRoute.value

    expect(current.name).toBe('login')
    expect(current.query.redirect).toBe('/student/dashboard')
  })

  it('keeps a signed-in student out of the supervisor desk', async () => {
    await useAuth().signIn('student@example.com', 'student1234')
    await router.push('/supervisor/dashboard').catch(() => {})

    expect(router.currentRoute.value.name).toBe('not-found')
  })

  it('lets a student reach their own desk', async () => {
    await useAuth().signIn('student@example.com', 'student1234')
    await router.push('/student/dashboard').catch(() => {})

    expect(router.currentRoute.value.name).toBe('test-student-dashboard')
  })

  it('moves a signed-in user away from the login page', async () => {
    await useAuth().signIn('student@example.com', 'student1234')
    await router.push('/login').catch(() => {})

    expect(router.currentRoute.value.name).toBe('test-student-dashboard')
  })

  it('serves the public landing and privacy pages without a session', async () => {
    await router.push('/privacy').catch(() => {})
    expect(router.currentRoute.value.name).toBe('privacy')

    await router.push('/').catch(() => {})
    expect(router.currentRoute.value.name).toBe('home')
  })
})
