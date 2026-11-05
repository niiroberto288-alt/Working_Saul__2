/**
 * Every user-facing string lives here (FURPS+ U7) so another language can be
 * added later by swapping this module. Keep keys stable; never inline copy in
 * components.
 */

export const strings = {
  brand: {
    name: 'AttachTrack',
    region: 'Rwanda',
    tagline: 'Internship logbook management',
    description: 'A digital attachment logbook for students, supervisors and the programme office.',
    badge: 'AT',
  },

  common: {
    appName: 'AttachTrack Rwanda',
    loading: 'Loading',
    loadingLong: 'Fetching the latest from the ledger',
    retry: 'Try again',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save changes',
    saving: 'Saving',
    close: 'Close',
    search: 'Search',
    clear: 'Clear',
    filter: 'Filter',
    all: 'All',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    page: 'Page',
    of: 'of',
    noResults: 'Nothing here yet',
    required: 'Required',
    optional: 'Optional',
    yes: 'Yes',
    no: 'No',
    remove: 'Remove',
    edit: 'Edit',
    add: 'Add',
    dismiss: 'Dismiss',
    signOut: 'Sign out',
    profile: 'Profile',
    skipToContent: 'Skip to main content',
    toggleTheme: 'Toggle colour theme',
    lightTheme: 'Light theme',
    darkTheme: 'Dark theme',
    offline: 'You are offline. Changes will sync when the connection returns.',
    online: 'Back online.',
    copy: 'Copy',
    exported: 'Download started',
  },

  roles: {
    student: 'Student',
    supervisor: 'Supervisor',
    admin: 'Programme office',
    studentLower: 'student',
    supervisorLower: 'supervisor',
    adminLower: 'programme office',
    badge: {
      student: 'Student',
      supervisor: 'Supervisor',
      admin: 'Admin',
    },
  },

  status: {
    Draft: { label: 'Draft', note: 'Not submitted yet' },
    Pending: { label: 'In review', note: 'Waiting for a supervisor' },
    Approved: { label: 'Approved', note: 'Locked and signed' },
    Rejected: { label: 'To revise', note: 'A comment explains why' },
  },

  shell: {
    navigation: 'Main navigation',
    openMenu: 'Open navigation',
    closeMenu: 'Close navigation',
    collapseSidebar: 'Collapse sidebar',
    expandSidebar: 'Expand sidebar',
    notifications: 'Notifications',
    unread: 'unread',
    markAllRead: 'Mark all as read',
    markRead: 'Mark as read',
    noNotifications: 'No notifications yet',
    noNotificationsBody: 'Submissions, reviews and sign-offs will appear here.',
    demoBadge: 'Demo mode',
    demoHint: 'Sample data in memory. Nothing leaves this browser.',
    account: 'Account',
    signedInAs: 'Signed in as',
  },

  auth: {
    signInEyebrow: 'Sign in to your logbook',
    signInTitle: 'Welcome back to the ledger.',
    signInSubtitle: 'Pick up where the week left off.',
    email: 'Email address',
    emailPlaceholder: 'name@university.ac.rw',
    password: 'Password',
    passwordPlaceholder: 'At least 8 characters',
    forgot: 'Forgot?',
    signIn: 'Sign in',
    signingIn: 'Signing in',
    noAccount: 'New here?',
    createAccount: 'Open a logbook',
    demoTitle: 'Demo accounts',
    demoHint: 'Sign in with any of these while the app runs without Supabase keys.',
    welcomeBack: 'Signed in as {name}.',
    signedOut: 'You have been signed out.',
    invalidCredentials: 'That email and password combination did not work.',
    sessionExpired: 'Your session expired. Sign in again to continue.',
    notAuthorised: 'Your account does not have access to that page.',
    useDemo: 'Use {email}',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
  },

  appShell: {
    footerNote: 'Built for Rwandan attachments, in the open.',
  },

  appNotConfigured: {
    eyebrow: 'Configuration',
    title: 'This logbook is not connected yet.',
    body: 'AttachTrack needs a Supabase project before it can store real entries. Add the project URL and anon key to the environment, then rebuild.',
    stepLabel: 'Step',
    steps: [
      'Create a Supabase project and run supabase/schema.sql.',
      'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the build environment.',
      'Redeploy. The demo accounts never ship to production.',
    ],
    docs: 'Setup notes live in the README.',
  },

  styleguide: {
    title: 'Design system',
    subtitle: 'Development gallery for the paper-and-ink components.',
    breadcrumb: 'Development only',
    typeEyebrow: 'Typography',
    statsEyebrow: 'Stat cards',
    statusEyebrow: 'Status and progress',
    buttonsEyebrow: 'Buttons and fields',
    peopleEyebrow: 'People and loading',
    statesEyebrow: 'Empty, dialog and stamp',
    accordionEyebrow: 'Accordion',
    modeNote: 'Data mode',
  },

  notFound: {
    eyebrow: 'Error 404',
    title: 'This page slipped out of the logbook.',
    body: 'The address may be mistyped, or the page has moved. Head back to the front desk and start again.',
    cta: 'Back to the beginning',
  },

  errors: {
    generic: 'Something went wrong. Please try again.',
    network: 'The connection dropped. Check your network and retry.',
    unauthorised: 'You do not have permission to do that.',
    notFound: 'That record could not be found.',
    conflict: 'That entry already exists for this date.',
    retryHint: 'The rest of the page still works.',
  },
}

/** Tiny template helper: t('auth.welcomeBack', { name: 'Aline' }). */
export function t(path, replacements = {}) {
  const value = path.split('.').reduce((accumulator, key) => accumulator?.[key], strings)
  if (typeof value !== 'string') return path
  return value.replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(replacements, key) ? String(replacements[key]) : match
  )
}

export default strings
