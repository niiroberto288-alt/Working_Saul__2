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
    fullName: 'Full name',
    fullNamePlaceholder: 'Your full name',
    institution: 'Institution',
    institutionPlaceholder: 'University of Rwanda - CBE',
    company: 'Host organisation',
    companyPlaceholder: 'Zipline',
    department: 'Department',
    departmentPlaceholder: 'Software engineering',
    phone: 'Phone (optional)',
    phonePlaceholder: '+250 7.. ... ...',
    confirmPassword: 'Confirm password',
    chooseRole: 'I am joining as',
    registerEyebrow: 'Open a logbook',
    registerTitle: 'Start the record this week.',
    registerSubtitle:
      'Students and supervisors can open a logbook. The programme office assigns administrators.',
    register: 'Create my logbook',
    registering: 'Opening the logbook',
    haveAccount: 'Already have a logbook?',
    signInLink: 'Sign in',
    checkInbox: 'Check your inbox',
    checkInboxBody: 'We sent a confirmation link. Open it to finish opening your logbook.',
    acceptTerms: 'I have read and accept the privacy notice.',
    consentRequired: 'Accept the privacy notice to continue.',
    roleHint: 'Administrators are added by the programme office, never at registration.',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
  },

  forgot: {
    eyebrow: 'Password reset',
    title: 'We will send you a link.',
    subtitle:
      'Enter the address on your logbook and we will send a reset link. For privacy, the page answers the same way whether or not the address exists.',
    cta: 'Send the reset link',
    sending: 'Sending the link',
    sent: 'If that address has a logbook, a reset link is on its way. It stays valid for one hour.',
    backToLogin: 'Back to sign in',
    emailRequired: 'Enter the email on your logbook first.',
    demoNote: 'Demo mode: no email is sent. Use any address to see the confirmation.',
  },

  reset: {
    eyebrow: 'Choose a new password',
    title: 'Set a password you will remember.',
    subtitle: 'Eight characters at least. A short phrase is stronger than a clever word.',
    newPassword: 'New password',
    cta: 'Save the new password',
    saving: 'Saving the password',
    success: 'Password updated. Sign in with the new one.',
    noSessionTitle: 'That link has expired.',
    noSessionBody:
      'Reset links can only be used once, and they expire after an hour. Request a fresh one and the rest takes a minute.',
    requestNew: 'Request a new link',
    demoNote:
      'Demo mode: the password is not stored. Every demo account keeps its sample password.',
  },

  privacy: {
    eyebrow: 'Privacy notice',
    title: 'What the logbook keeps, and who can read it.',
    linkLabel: 'Privacy notice',
    updated: 'Last updated',
    consentShort:
      'I have read the privacy notice and agree to my record being kept as described there.',
    intro:
      'AttachTrack exists so that an attachment can be recorded and signed. This page explains, in plain language, what is collected, why, who can see it, how long it is kept and what you can ask us to do with it.',
    disclaimerTitle: 'Before real use',
    disclaimerBody:
      "This notice describes how the software works; it is not a legal compliance claim. The institution running AttachTrack must review it against applicable data protection law, including Rwanda's Law on the protection of personal data, and adapt it to its own policies before using the system with real students.",
    contactTitle: 'Who to contact',
    contactBody:
      'Write to the programme office that issued your logbook. They operate this installation and hold the record; the software author does not receive your entries.',
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

  home: {
    eyebrow: 'Internship logbook management / Students, supervisors, institutions',
    titleLead: 'Every hour recorded.',
    titleAccent: 'Every skill witnessed.',
    heroBody:
      'AttachTrack replaces the paper attachment book with a calm, searchable ledger: hours, artefacts, supervisor reviews and sign-offs, kept in one place from the first week to the final stamp.',
    ctaPrimary: 'Open a logbook',
    ctaSample: 'Open the sample logbook',
    ctaSampleNote: 'Aline, week 5',
    caption: 'Monday / Week five',
    chipLedger: 'Live ledger',
    chipLedgerBody: '5 entries awaiting a supervisor',
    chipMedian: 'Median review',
    chipMedianBody: '34 h',
    breatheNote: 'The page breathes at four seconds',
    rolesEyebrow: 'Three desks, one ledger',
    rolesTitle: 'Built around the people who keep a placement honest.',
    partnersLabel: 'Institutions and host organisations',
    railsEyebrow: 'The method',
    railsTitle: 'A placement is held up by four quiet habits.',
    railsBody:
      'Most attachment books fail in the same place: nobody agrees what counts as evidence until the end. The four rails fix the rhythm in week one.',
    railsInsightLabel: 'Field note',
    railsInsight:
      'Placements that log weekly are signed off 21 days earlier than those that log at the end of term.',
    supervisorsEyebrow: 'The readers',
    supervisorsTitle: 'The people who read the logbook.',
    supervisorsBody:
      'Supervisors see a queue, not a pile. Every entry arrives with hours, the artefact and the student reflection attached.',
    whyISupervise: 'Why I supervise',
    hoverToRead: 'Hover to read the note.',
    caseload: 'Caseload',
    students: 'students',
    activityEyebrow: 'This week in the ledger',
    activityTitle: 'Ledgers moving, without anyone being chased.',
    activityBody:
      'A live sample from the programme office: hours accumulating, entries moving through review, nothing sitting in an inbox.',
    hoursApproved: 'hours recorded',
    reviewEyebrow: 'The first review is free',
    reviewTitle: 'Send one week. Get one honest note.',
    reviewBody:
      'Three steps, no card, no commitment. If the rhythm fits, the term continues at the institutional rate.',
    namePlaceholder: 'Your full name',
    institutionPlaceholder: 'University of Rwanda',
    roleLabel: 'I am a',
    reviewCta: 'Request the first review',
    reviewNote: 'One review per address. We never sell or share it.',
    reviewStamp: 'Request received',
    reviewSuccessTitle: 'Request received',
    reviewSuccess:
      'The programme office has your request. A supervisor will read the first entry within two working days.',
    seeLogbook: 'See a full logbook',
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
