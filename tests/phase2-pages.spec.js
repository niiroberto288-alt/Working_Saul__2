import { beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import PrivacyView from '@/views/PrivacyView.vue'
import { initAuth } from '@/composables/useAuth'

const Stub = defineComponent({ name: 'Stub', render: () => h('div') })

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: Stub },
      { path: '/login', name: 'login', component: Stub },
      { path: '/register', name: 'register', component: Stub },
      { path: '/forgot-password', name: 'forgot-password', component: Stub },
      { path: '/privacy', name: 'privacy', component: Stub },
      { path: '/student/dashboard', name: 'student-dashboard', component: Stub },
      { path: '/:pathMatch(.*)*', name: 'not-found', component: Stub },
    ],
  })
}

async function mountView(component, path = '/') {
  const router = makeRouter()
  router.push(path)
  await router.isReady()
  const wrapper = mount(component, {
    global: { plugins: [router], directives: { reveal: {} } },
    attachTo: document.body,
  })
  await new Promise((resolve) => window.setTimeout(resolve, 0))
  return { wrapper, router }
}

beforeAll(async () => {
  await initAuth()
})

describe('home page', () => {
  it('renders the hero, the four rails and the review form', async () => {
    const { wrapper } = await mountView(HomeView)
    const text = wrapper.text()

    expect(text).toContain('Every hour recorded.')
    expect(text).toContain('Every skill witnessed.')
    expect(text).toContain('The four rails')
    expect(text).toContain('Plan')
    expect(text).toContain('Review')
    expect(text).toContain('The first review is free')
    expect(wrapper.find('#review form').exists()).toBe(true)

    wrapper.unmount()
  })

  it('never shows demo credentials on the public page', async () => {
    const { wrapper } = await mountView(HomeView)
    const text = wrapper.text()
    expect(text).not.toContain('student@example.com')
    expect(text).not.toContain('student1234')
    expect(text).not.toContain('admin@example.com')
    wrapper.unmount()
  })

  it('gives every image explicit dimensions for layout stability', async () => {
    const { wrapper } = await mountView(HomeView)
    const images = wrapper.findAll('img')
    expect(images.length).toBeGreaterThan(0)
    images.forEach((image) => {
      expect(image.attributes('width')).toBeTruthy()
      expect(image.attributes('height')).toBeTruthy()
      expect(image.attributes('alt')).toBeTruthy()
    })
    wrapper.unmount()
  })
})

describe('login page', () => {
  it('shows inline validation instead of relying on required', async () => {
    const { wrapper } = await mountView(LoginView, '/login')

    await wrapper.find('form').trigger('submit')
    await new Promise((resolve) => window.setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('Email is required.')
    expect(wrapper.text()).toContain('Password is required.')
    wrapper.unmount()
  })

  it('offers a working forgot-password link', async () => {
    const { wrapper } = await mountView(LoginView, '/login')
    const link = wrapper.findAll('a').find((anchor) => anchor.text() === 'Forgot?')
    expect(link).toBeTruthy()
    expect(link.attributes('href')).toBe('/forgot-password')
    wrapper.unmount()
  })

  it('signs in with the demo student and redirects to the student desk', async () => {
    const { wrapper, router } = await mountView(LoginView, '/login')

    await wrapper.find('#login-email').setValue('student@example.com')
    await wrapper.find('#login-password').setValue('student1234')
    await wrapper.find('form').trigger('submit')
    await new Promise((resolve) => window.setTimeout(resolve, 30))

    expect(router.currentRoute.value.path).toBe('/student/dashboard')
    wrapper.unmount()
  })
})

describe('register page', () => {
  it('offers only student and supervisor roles', async () => {
    const { wrapper } = await mountView(RegisterView, '/register')
    const buttons = wrapper.findAll('fieldset button')
    const labels = buttons.map((button) => button.text())

    expect(labels).toEqual(['Student', 'Supervisor'])
    expect(labels).not.toContain('Programme office')
    expect(labels).not.toContain('Admin')
    wrapper.unmount()
  })

  it('requires consent and a matching confirmation', async () => {
    const { wrapper } = await mountView(RegisterView, '/register')

    await wrapper.find('#register-password').setValue('strongpass1')
    await wrapper.find('#register-confirm').setValue('different')
    await wrapper.find('form').trigger('submit')
    await new Promise((resolve) => window.setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('The two passwords do not match.')
    expect(wrapper.text()).toContain('Consent is required to continue.')
    wrapper.unmount()
  })
})

describe('forgot password', () => {
  it('confirms in the same way without revealing whether the address exists', async () => {
    const { wrapper } = await mountView(ForgotPasswordView, '/forgot-password')

    await wrapper.find('#forgot-email').setValue('nobody@example.com')
    await wrapper.find('form').trigger('submit')
    await new Promise((resolve) => window.setTimeout(resolve, 500))

    expect(wrapper.text()).toContain('If that address has a logbook')
    wrapper.unmount()
  })
})

describe('privacy page', () => {
  it('explains retention and the institutional review disclaimer', async () => {
    const { wrapper } = await mountView(PrivacyView, '/privacy')
    const text = wrapper.text()

    expect(text).toContain('What we collect')
    expect(text).toContain('How long it is kept')
    expect(text).toContain('Before real use')
    expect(text).toContain('not a legal compliance claim')
    expect(text).not.toContain('GDPR compliant')
    wrapper.unmount()
  })
})
