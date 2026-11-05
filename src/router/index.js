/**
 * Router (FURPS+ 7, R2).
 *
 * Every view is a dynamic import so each route ships its own chunk (P1).
 * The guard waits for the Supabase session to finish loading before deciding,
 * and sends signed-out users to /login with a redirect back to where they were.
 */
import { createRouter, createWebHistory } from 'vue-router'
import { APP_MODE } from '@/services/supabase'
import { useAuth, whenAuthReady } from '@/composables/useAuth'

const routes = [
  {
    path: '/app-not-configured',
    name: 'app-not-configured',
    component: () => import('@/views/AppNotConfiguredView.vue'),
    meta: { public: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { public: true },
  },
]

// Phase 1 only: a dev gallery that exercises the design system. It is compiled
// out of production builds because import.meta.env.DEV is statically false.
if (import.meta.env.DEV) {
  routes.unshift(
    // Phase 1 preview convenience: the landing page arrives in Phase 2, so `/`
    // opens the component gallery until then. Delete this entry with Phase 2.
    { path: '/', redirect: { name: 'styleguide' } },
    {
      path: '/styleguide',
      name: 'styleguide',
      component: () => import('@/views/StyleGuideView.vue'),
      meta: { public: true },
    }
  )
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, top: 96, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  // The session must be known before any decision is made.
  await whenAuthReady()

  const { isAuthenticated, role, sessionExpired } = useAuth()

  if (APP_MODE === 'unconfigured') {
    return to.name === 'app-not-configured' ? true : { name: 'app-not-configured', replace: true }
  }

  const needsAuth = to.meta.requiresAuth === true
  const allowedRoles = Array.isArray(to.meta.roles) ? to.meta.roles : null

  if (needsAuth && !isAuthenticated.value) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
        ...(sessionExpired.value ? { expired: '1' } : {}),
      },
    }
  }

  if (allowedRoles && !allowedRoles.includes(role.value)) {
    // Signed in, but without the hat this page asks for.
    return { name: 'not-found' }
  }

  if (to.meta.guestOnly && isAuthenticated.value) {
    return { name: 'home' }
  }

  return true
})

export default router
export { routes }
