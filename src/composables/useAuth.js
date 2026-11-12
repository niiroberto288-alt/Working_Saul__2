/**
 * Authentication and the signed-in profile (FURPS+ F1, F2, R2, C4).
 *
 * Live mode talks to Supabase Auth; demo mode resolves the three sample accounts
 * from services/demoData.js. Both branches return the same shapes so the rest of
 * the app never branches on mode.
 */
import { computed, ref } from 'vue'
import { LIMITS, REGISTRABLE_ROLES, ROLES, STORAGE_KEYS } from '@/config'
import { APP_MODE, supabase } from '@/services/supabase'
import { logger } from '@/utils/logger'

/**
 * Demo data is imported lazily and only when demo mode is permitted. In a
 * production build without VITE_DEMO_MODE=true the branch below is statically
 * dead, so Rollup drops the module and the demo passwords never ship (C4).
 */
const DEMO_ALLOWED = import.meta.env.DEV === true || __DEMO_BUILD__

// Folded away in production builds: `false || false` makes the ternary constant,
// so the dynamic import and the whole demo dataset are dropped from dist/.
const loadDemoData = DEMO_ALLOWED ? () => import('@/services/demoData') : null

let demoModulePromise = null

function demoModule() {
  if (!loadDemoData) {
    return Promise.reject(new Error('demo_unavailable'))
  }
  if (!demoModulePromise) {
    demoModulePromise = loadDemoData()
  }
  return demoModulePromise
}

const PROFILE_COLUMNS = 'id, full_name, role, institution, company, department, phone, created_at'

const currentUser = ref(null)
const currentProfile = ref(null)
const initialising = ref(true)
const sessionExpired = ref(false)

let readyPromise = null

/* --------------------------------------------------------------------------
   Demo session storage (localStorage is allowed for this in FURPS+ R5)
   -------------------------------------------------------------------------- */

function readDemoSession() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.DEMO_SESSION)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    return null
  }
}

function writeDemoSession(userId) {
  try {
    window.localStorage.setItem(STORAGE_KEYS.DEMO_SESSION, JSON.stringify({ userId }))
  } catch (error) {
    /* Non-fatal: the session simply does not survive a reload. */
  }
}

function clearDemoSession() {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.DEMO_SESSION)
  } catch (error) {
    /* Non-fatal. */
  }
}

/* --------------------------------------------------------------------------
   Profile loading
   -------------------------------------------------------------------------- */

async function demoProfileById(userId) {
  const { getDemoState } = await demoModule()
  return getDemoState().profiles.find((profile) => profile.id === userId) ?? null
}

async function loadProfile(userId) {
  if (!userId) return null

  if (APP_MODE === 'demo') {
    return await demoProfileById(userId)
  }

  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    logger.error('Could not load the profile', error)
    return null
  }

  return data ?? null
}

function setSession(user) {
  currentUser.value = user ? { id: user.id, email: user.email ?? null } : null
}

/* --------------------------------------------------------------------------
   Auth state
   -------------------------------------------------------------------------- */

function handleSignedOut() {
  if (currentUser.value) {
    sessionExpired.value = true
  }
  setSession(null)
  currentProfile.value = null
}

function handleAuthEvent(event, session) {
  if (event === 'SIGNED_OUT') {
    handleSignedOut()
    return
  }

  if (!session?.user) return

  if (event === 'PASSWORD_RECOVERY') {
    // The reset page calls updateUser; keep the session so it can.
    setSession(session.user)
    return
  }

  setSession(session.user)
  sessionExpired.value = false

  loadProfile(session.user.id)
    .then((profile) => {
      currentProfile.value = profile
    })
    .catch((error) => logger.error('Profile refresh failed', error))
}

async function bootstrap() {
  if (APP_MODE === 'unconfigured') {
    initialising.value = false
    return null
  }

  if (APP_MODE === 'demo') {
    const stored = readDemoSession()
    if (stored?.userId) {
      const profile = await demoProfileById(stored.userId)
      if (profile) {
        setSession({ id: profile.id, email: profile.email })
        currentProfile.value = profile
      } else {
        clearDemoSession()
      }
    }
    initialising.value = false
    return currentProfile.value
  }

  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      logger.error('Could not read the Supabase session', error)
    } else if (data?.session?.user) {
      setSession(data.session.user)
      currentProfile.value = await loadProfile(data.session.user.id)
    }
  } catch (error) {
    logger.error('Session bootstrap failed', error)
  }

  // Kept for the lifetime of the app; there is nothing to tear down.
  supabase.auth.onAuthStateChange((event, session) => {
    // Supabase asks that the callback stays synchronous; defer the work.
    window.setTimeout(() => handleAuthEvent(event, session), 0)
  })

  initialising.value = false
  return currentProfile.value
}

/** Call once, before mounting the app. Safe to call repeatedly. */
export function initAuth() {
  if (!readyPromise) {
    readyPromise = bootstrap()
  }
  return readyPromise
}

/** The router guard awaits this before deciding (FURPS+ R2). */
export function whenAuthReady() {
  return readyPromise ?? Promise.resolve(null)
}

/* --------------------------------------------------------------------------
   Actions
   -------------------------------------------------------------------------- */

function assertRegistrableRole(role) {
  if (!REGISTRABLE_ROLES.includes(role)) {
    throw new Error('Role not allowed at registration')
  }
}

async function signIn(email, password) {
  const cleanEmail = String(email).trim().toLowerCase()

  if (APP_MODE === 'demo') {
    const { demoLogins } = await demoModule()
    const match = demoLogins.find(
      (account) =>
        account.email.toLowerCase() === cleanEmail && account.password === String(password)
    )

    if (!match) {
      throw new Error('invalid_credentials')
    }

    const profile = await demoProfileById(match.userId)
    if (!profile) {
      throw new Error('invalid_credentials')
    }

    setSession({ id: profile.id, email: profile.email })
    currentProfile.value = profile
    sessionExpired.value = false
    writeDemoSession(profile.id)
    return profile
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: String(password),
  })

  if (error) throw error

  setSession(data.user)
  currentProfile.value = await loadProfile(data.user.id)
  sessionExpired.value = false

  if (!currentProfile.value) {
    throw new Error('profile_missing')
  }

  return currentProfile.value
}

async function signUp(payload) {
  const {
    email,
    password,
    fullName,
    role,
    institution = '',
    company = '',
    department = '',
    phone = '',
  } = payload

  assertRegistrableRole(role)

  const cleanEmail = String(email).trim().toLowerCase()

  if (APP_MODE === 'demo') {
    const { getDemoState, demoId } = await demoModule()
    const state = getDemoState()
    if (state.profiles.some((profile) => profile.email?.toLowerCase() === cleanEmail)) {
      throw new Error('already_registered')
    }

    const profile = {
      id: demoId('u'),
      full_name: String(fullName).trim().slice(0, LIMITS.FULL_NAME),
      email: cleanEmail,
      role,
      institution: String(institution).trim().slice(0, LIMITS.INSTITUTION),
      company: String(company).trim().slice(0, LIMITS.COMPANY),
      department: String(department).trim().slice(0, LIMITS.DEPARTMENT),
      phone: String(phone).trim().slice(0, LIMITS.PHONE),
      created_at: new Date().toISOString(),
    }

    state.profiles.unshift(profile)
    setSession({ id: profile.id, email: profile.email })
    currentProfile.value = profile
    writeDemoSession(profile.id)

    return { profile, needsConfirmation: false }
  }

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password: String(password),
    options: {
      emailRedirectTo: `${window.location.origin}/login`,
      data: {
        full_name: String(fullName).trim().slice(0, LIMITS.FULL_NAME),
        role,
        institution: String(institution).trim().slice(0, LIMITS.INSTITUTION),
        company: String(company).trim().slice(0, LIMITS.COMPANY),
        department: String(department).trim().slice(0, LIMITS.DEPARTMENT),
        phone: String(phone).trim().slice(0, LIMITS.PHONE),
      },
    },
  })

  if (error) throw error

  if (!data.session) {
    return { profile: null, needsConfirmation: true }
  }

  setSession(data.user)
  currentProfile.value = await loadProfile(data.user.id)

  return { profile: currentProfile.value, needsConfirmation: false }
}

async function signOut() {
  if (APP_MODE === 'demo') {
    clearDemoSession()
    setSession(null)
    currentProfile.value = null
    return
  }

  const { error } = await supabase.auth.signOut()
  if (error) logger.error('Sign out failed', error)
  setSession(null)
  currentProfile.value = null
}

/**
 * Always resolves, whether or not the address exists (FURPS+ F2): the caller
 * shows the same confirmation message either way.
 */
async function requestPasswordReset(email) {
  const cleanEmail = String(email).trim().toLowerCase()

  if (APP_MODE === 'demo') {
    await new Promise((resolve) => window.setTimeout(resolve, 350))
    return
  }

  const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  // Do not leak whether the address exists; log for operators only.
  if (error) {
    logger.warn('Password reset request returned an error', error)
  }
}

async function updatePassword(newPassword) {
  if (APP_MODE === 'demo') {
    await new Promise((resolve) => window.setTimeout(resolve, 350))
    return
  }

  const { error } = await supabase.auth.updateUser({ password: String(newPassword) })
  if (error) throw error
}

async function updateProfile(patch) {
  if (!currentUser.value?.id) throw new Error('not_authenticated')

  const allowed = {
    full_name: String(patch.full_name ?? '')
      .trim()
      .slice(0, LIMITS.FULL_NAME),
    institution: String(patch.institution ?? '')
      .trim()
      .slice(0, LIMITS.INSTITUTION),
    company: String(patch.company ?? '')
      .trim()
      .slice(0, LIMITS.COMPANY),
    department: String(patch.department ?? '')
      .trim()
      .slice(0, LIMITS.DEPARTMENT),
    phone: String(patch.phone ?? '')
      .trim()
      .slice(0, LIMITS.PHONE),
  }

  if (APP_MODE === 'demo') {
    const { getDemoState } = await demoModule()
    const state = getDemoState()
    const index = state.profiles.findIndex((profile) => profile.id === currentUser.value.id)
    if (index === -1) throw new Error('profile_missing')
    const updated = { ...state.profiles[index], ...allowed }
    state.profiles[index] = updated
    currentProfile.value = updated
    return updated
  }

  // Role and id are deliberately absent: the database trigger refuses them too.
  const { data, error } = await supabase
    .from('profiles')
    .update(allowed)
    .eq('id', currentUser.value.id)
    .select(PROFILE_COLUMNS)
    .single()

  if (error) throw error

  currentProfile.value = data
  return data
}

/** Demo sign-in hints for the login page. Empty outside demo mode. */
async function demoAccounts() {
  if (APP_MODE !== 'demo') return []

  try {
    const { demoLogins, getDemoState } = await demoModule()
    const profiles = getDemoState().profiles
    return demoLogins.map((account) => ({
      email: account.email,
      password: account.password,
      role: profiles.find((profile) => profile.id === account.userId)?.role ?? null,
    }))
  } catch (error) {
    logger.warn('Demo accounts unavailable', error)
    return []
  }
}

/* --------------------------------------------------------------------------
   Public surface
   -------------------------------------------------------------------------- */

const role = computed(() => currentProfile.value?.role ?? null)
const isAuthenticated = computed(() => Boolean(currentUser.value?.id))
const isStudent = computed(() => role.value === ROLES.STUDENT)
const isSupervisor = computed(() => role.value === ROLES.SUPERVISOR)
const isAdmin = computed(() => role.value === ROLES.ADMIN)
const displayName = computed(() => currentProfile.value?.full_name ?? '')
const firstName = computed(() => displayName.value.split(' ')[0] ?? '')
const initials = computed(() => {
  const parts = displayName.value.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'AT'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
})

/** Home route for the signed-in role; used after login and by the guard. */
const roleHome = computed(() => {
  if (role.value === ROLES.STUDENT) return '/student/dashboard'
  if (role.value === ROLES.SUPERVISOR) return '/supervisor/dashboard'
  if (role.value === ROLES.ADMIN) return '/admin/dashboard'
  return '/login'
})

export function useAuth() {
  return {
    mode: APP_MODE,
    currentUser,
    currentProfile,
    initialising,
    sessionExpired,
    role,
    isAuthenticated,
    isStudent,
    isSupervisor,
    isAdmin,
    displayName,
    firstName,
    initials,
    roleHome,
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    updatePassword,
    updateProfile,
    demoAccounts,
    loadProfile,
  }
}

export default useAuth
