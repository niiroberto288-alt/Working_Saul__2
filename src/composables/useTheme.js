/**
 * Theme switching (FURPS+ R5: localStorage may hold the theme preference).
 *
 * The initial class is applied by public/theme-boot.js before first paint; this
 * composable keeps reactive state in sync with that class and writes changes.
 */
import { computed, ref } from 'vue'
import { STORAGE_KEYS } from '@/config'

const theme = ref('light')
let initialised = false

function readStoredTheme() {
  try {
    return window.localStorage.getItem(STORAGE_KEYS.THEME)
  } catch (error) {
    return null
  }
}

function persist(nextTheme) {
  try {
    window.localStorage.setItem(STORAGE_KEYS.THEME, nextTheme)
  } catch (error) {
    /* Private mode: the toggle still works for this session. */
  }
}

function applyTheme(nextTheme) {
  if (typeof document === 'undefined') return

  document.documentElement.classList.toggle('dark', nextTheme === 'dark')

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', nextTheme === 'dark' ? '#0a1628' : '#eae6de')
  }
}

/** Called while bootstrapping so the ref matches the class set before paint. */
export function initTheme() {
  if (initialised) return theme.value

  // Light is the default; only an explicit stored choice moves us to dark.
  theme.value = readStoredTheme() === 'dark' ? 'dark' : 'light'

  applyTheme(theme.value)
  initialised = true
  return theme.value
}

export function useTheme() {
  if (!initialised) {
    initTheme()
  }

  const isDark = computed(() => theme.value === 'dark')

  function setTheme(nextTheme) {
    theme.value = nextTheme === 'dark' ? 'dark' : 'light'
    applyTheme(theme.value)
    persist(theme.value)
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return { theme, isDark, setTheme, toggleTheme }
}

export default useTheme
