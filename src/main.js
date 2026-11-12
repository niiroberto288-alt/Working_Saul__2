import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { vReveal } from '@/composables/useReveal'
import { initTheme } from '@/composables/useTheme'
import { initAuth } from '@/composables/useAuth'
import { logger } from '@/utils/logger'
import '@/assets/main.css'

// Theme first (no flash), then the session, then paint. The router guard also
// awaits the same promise, so a deep link waits for the session too.
initTheme()

initAuth()
  .catch((error) => logger.error('Auth bootstrap failed', error))
  .finally(() => {
    const app = createApp(App)
    app.directive('reveal', vReveal)
    app.use(router)
    app.mount('#app')
  })
