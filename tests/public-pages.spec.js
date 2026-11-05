import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import NotFoundView from '@/views/NotFoundView.vue'
import AppNotConfiguredView from '@/views/AppNotConfiguredView.vue'
import { makeRouter } from './helpers'

async function mountWithRoute(component, path = '/') {
  const router = makeRouter()
  router.push(path)
  await router.isReady()
  return mount(component, { global: { plugins: [router] } })
}

describe('public pages', () => {
  it('renders the styled 404 page', async () => {
    const wrapper = await mountWithRoute(NotFoundView, '/missing-page')
    expect(wrapper.text()).toContain('Error 404')
    expect(wrapper.text()).toContain('Back to the beginning')
  })

  it('renders the app-not-configured page without demo accounts', async () => {
    const wrapper = await mountWithRoute(AppNotConfiguredView)
    const text = wrapper.text()
    expect(text).toContain('This logbook is not connected yet')
    expect(text).not.toContain('student@example.com')
    expect(text).not.toContain('admin@example.com')
  })
})
