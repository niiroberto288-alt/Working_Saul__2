import { beforeEach } from 'vitest'

// jsdom does not implement these browser APIs; the components rely on them.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() {
      return false
    },
  })
}

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback
  }

  observe(target) {
    this.callback([{ isIntersecting: true, target }], this)
  }

  unobserve() {}
  disconnect() {}
}

globalThis.IntersectionObserver = MockIntersectionObserver

if (!globalThis.requestAnimationFrame) {
  globalThis.requestAnimationFrame = (callback) =>
    window.setTimeout(() => callback(performance.now()), 0)
  globalThis.cancelAnimationFrame = (id) => window.clearTimeout(id)
}

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.classList.remove('dark')
})
