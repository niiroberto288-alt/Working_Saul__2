import { beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import router from '@/router'
import { initAuth } from '@/composables/useAuth'

describe('application shell', () => {
  beforeAll(async () => {
    await initAuth()
  })

  it('mounts the design-system gallery with the full shell', async () => {
    await router.push('/styleguide')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [router] },
      attachTo: document.body,
    })

    await new Promise((resolve) => window.setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('Design system')
    expect(wrapper.text()).toContain('Total entries')
    expect(wrapper.find('a.skip-link').exists()).toBe(true)
    expect(wrapper.find('#main-content').exists()).toBe(true)

    wrapper.unmount()
  })

  it('redirects an unconfigured production build is not applicable in dev', () => {
    // Guard behaviour is covered again in Phase 7 with mocked modes.
    expect(router.getRoutes().some((route) => route.name === 'app-not-configured')).toBe(true)
  })
})
