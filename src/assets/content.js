/**
 * Editorial content for the public landing page.
 *
 * Kept apart from strings.js (which holds interface copy) because this is
 * marketing material a programme office may rewrite wholesale. Nothing here is
 * demo data: no account, password or record from services/demoData.js is
 * imported, so the landing page stays clean in a production bundle.
 */

export const heroStats = [
  { value: 12480, suffix: 'h', label: 'Hours in the ledger' },
  { value: 3214, suffix: '', label: 'Entries kept' },
  { value: 87, suffix: '', label: 'Awaiting review' },
  { value: 14, suffix: '', label: 'Institutions' },
]

export const roleCards = [
  {
    key: 'students',
    eyebrow: 'For students',
    title: 'Write the week while it is still warm.',
    body: 'Log the hours, attach the artefact, and keep a record your supervisor can actually sign.',
    cta: 'Enter desk',
  },
  {
    key: 'supervisors',
    eyebrow: 'For supervisors',
    title: 'Read a queue, not a pile of paper.',
    body: 'Approve, reject with a reason, or sign off a competency without chasing anyone for a form.',
    cta: 'Enter desk',
  },
  {
    key: 'institutions',
    eyebrow: 'For institutions',
    title: 'See the placement, not just the grade.',
    body: 'Reports across companies, hours witnessed and competencies still outstanding, exportable in one click.',
    cta: 'Enter desk',
  },
]

export const partners = [
  'University of Rwanda',
  'INES-Ruhengeri',
  'AUCA',
  'Kepler',
  'MTN Rwanda',
  'BK Tech',
  'Irembo',
  'Zipline',
  'Equity Bank Rwanda',
  'RwandAir',
  'BPR Bank',
]

export const rails = [
  {
    id: 'plan',
    index: 'I',
    title: 'Plan',
    meta: 'Placement charter',
    time: '45 min',
    body: 'Agree the hours, the supervisor, the evidence and the review rhythm before week one. The charter becomes the shape of the logbook, so nobody argues about the target in week nine.',
  },
  {
    id: 'log',
    index: 'II',
    title: 'Log',
    meta: 'Hours and artefacts',
    time: '10 min / entry',
    body: 'One entry per week with the hours, the work and the artefact attached. Drafts autosave, so a dropped connection never costs you the paragraph you were writing.',
  },
  {
    id: 'reflect',
    index: 'III',
    title: 'Reflect',
    meta: 'The weekly entry',
    time: '15 min / week',
    body: 'Name the skill you practised and the thing you would do differently. This is the part that turns a timesheet into something a supervisor can witness.',
  },
  {
    id: 'review',
    index: 'IV',
    title: 'Review',
    meta: 'Sign-off and stamps',
    time: '5 min / entry',
    body: 'Approve, or reject with a reason the student can act on. Approved entries lock, competencies get signed, and the term closes with a stamp rather than a scramble.',
  },
]

export const supervisors = [
  {
    id: 'claudine',
    name: 'Dr. Claudine Uwera',
    role: 'Senior lecturer, Business and Economics',
    faculty: 'University of Rwanda - CBE',
    specialty: 'Reads placements at Zipline, Equity Bank and BPR.',
    quote:
      'I supervise because a logbook is the only place where a student tells me what they actually did, not what the report says they did.',
    caseload: 12,
    capacity: 16,
    photo: 'https://picsum.photos/seed/attachtrack-claudine/560/680',
  },
  {
    id: 'jeanbaptiste',
    name: 'Jean Baptiste Nsengimana',
    role: 'Head of applied sciences',
    faculty: 'INES-Ruhengeri',
    specialty: 'Reads placements at Irembo and RwandAir.',
    quote:
      'The artefact matters more than the timesheet. If a student cannot show me the thing they built, the hours are a rumour.',
    caseload: 9,
    capacity: 14,
    photo: 'https://picsum.photos/seed/attachtrack-jeanbaptiste/560/680',
  },
  {
    id: 'ange',
    name: 'Ange Mbabazi',
    role: 'Computing tutor and placement lead',
    faculty: 'Kepler',
    specialty: 'Reads placements at BK Tech and Irembo.',
    quote:
      'A rejection with a real reason is a teaching moment. A rejection with no comment is just a closed door.',
    caseload: 7,
    capacity: 12,
    photo: 'https://picsum.photos/seed/attachtrack-ange/560/680',
  },
]

// First name plus initial: the public page never shows a full student name.
export const activityFeed = [
  {
    id: 'aline',
    name: 'Aline U.',
    initials: 'AU',
    hours: 126,
    note: 'Hours approved across four weeks',
    status: 'Approved',
  },
  {
    id: 'eric',
    name: 'Eric N.',
    initials: 'EN',
    hours: 98,
    note: 'Two entries waiting on a signature',
    status: 'Pending',
  },
  {
    id: 'grace',
    name: 'Grace U.',
    initials: 'GU',
    hours: 74,
    note: 'One reflection returned for revision',
    status: 'Rejected',
  },
  {
    id: 'kevin',
    name: 'Kevin H.',
    initials: 'KH',
    hours: 112,
    note: 'Evidence attached to every entry',
    status: 'Approved',
  },
]

export const reviewSteps = [
  {
    number: '01',
    title: 'Open a logbook',
    body: 'Tell us the institution, the company and the term. It takes a minute and needs no card.',
  },
  {
    number: '02',
    title: 'Send the first week',
    body: 'A supervisor reads the entry and leaves one honest note. The first review is free.',
  },
  {
    number: '03',
    title: 'Keep the rhythm',
    body: 'If it fits, the term continues at the institutional rate. If it does not, keep the note.',
  },
]

export const footerLinks = {
  programme: [
    { label: 'The logbook', to: '/#logbook' },
    { label: 'The four rails', to: '/#rails' },
    { label: 'Supervisors', to: '/#supervisors' },
    { label: 'Free first review', to: '/#review' },
  ],
  trust: [
    { label: 'Privacy notice', to: '/privacy' },
    { label: 'Create an account', to: '/register' },
    { label: 'Sign in', to: '/login' },
  ],
}

/**
 * Privacy notice sections. Written to be read by a student, not a lawyer.
 * The institution must review this before real use (FURPS+ C5).
 */
export const privacySections = [
  {
    id: 'what-we-collect',
    title: 'What we collect',
    body: 'Only what an attachment record needs. There is no analytics script, no advertising pixel and no third-party tracker on this site.',
    items: [
      'Your name, email address and institution, so a supervisor knows whose logbook they are reading.',
      'Your host organisation, department and an optional phone number.',
      'Logbook entries: dates, hours, what you did, what you learned, skills, and any evidence you attach.',
      'Supervisor comments, approvals, rejections and competency sign-offs.',
      'A technical record of when a record was created or changed, so approvals can be trusted.',
    ],
  },
  {
    id: 'why',
    title: 'Why we keep it',
    body: 'To run the attachment: to show a supervisor the week, to let the programme office report on placements, and to produce a signed record at the end of term. Nothing is used for advertising or sold.',
  },
  {
    id: 'who-can-see',
    title: 'Who can read it',
    body: 'Access is enforced in the database, not just in the interface.',
    items: [
      'You can read and edit your own entries, and only while they are drafts or returned for revision.',
      'Your supervisor can read the entries of students assigned to them, and can approve, reject or comment.',
      'The programme office (administrators) can read records across the programme and export reports.',
      'Nobody else can read your logbook. Students cannot see each other, and a supervisor cannot see a student who is not on their caseload.',
    ],
  },
  {
    id: 'local-device',
    title: 'What stays on your device',
    body: 'The browser stores three things, all of them small: your theme preference, an unsent draft of the entry you are writing (keyed to your account, cleared after a successful submit), and, in the demo version only, which sample account is signed in. No authentication token is stored outside the Supabase client, and no personal data is kept in local storage.',
  },
  {
    id: 'evidence',
    title: 'Files you attach',
    body: 'Evidence goes into a private bucket. Each file sits in a folder named after your account, and only you and your supervisor can view it. Links to files expire after ten minutes; there are no public URLs. Files must be PDF, PNG or JPG and no larger than 5 MB.',
  },
  {
    id: 'retention',
    title: 'How long it is kept',
    body: 'Entries and sign-offs stay for as long as the institution needs them for academic records, then the programme office deletes them. A deleted account takes its entries, comments and evidence with it. Audit rows keep the fact that a change happened, without keeping the content of a deleted entry.',
  },
  {
    id: 'your-rights',
    title: 'What you can ask for',
    body: 'Ask the programme office for a copy of your record, a correction, or deletion. Most of it you can already do yourself: every student can export their logbook to CSV or print it as a PDF from the Progress page.',
  },
  {
    id: 'security',
    title: 'How it is protected',
    body: 'Passwords are handled by Supabase Auth and are never stored by this application. Database row-level security limits every query to records the signed-in user is allowed to see. The production build ships with a strict content security policy.',
  },
]

export default {
  heroStats,
  roleCards,
  partners,
  rails,
  supervisors,
  activityFeed,
  reviewSteps,
  footerLinks,
  privacySections,
}
