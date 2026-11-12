/**
 * Demo dataset (sections 3 and 11).
 *
 * Purely in memory: reloading the page restores the sample data. Used only when
 * the app runs without Supabase keys in development (FURPS+ C4). Real mode must
 * never read this file's data - the data layer switches at the composable edge.
 */
import { COMPETENCY_STATUS, LOG_STATUS, ROLES, TEMPLATE_FREQUENCY, TEMPLATE_STATUS } from '@/config'

const DAY_MS = 24 * 60 * 60 * 1000

/** ISO date (yyyy-mm-dd) for `days` before now. Keeps the demo looking current. */
export function isoDaysAgo(days) {
  const date = new Date(Date.now() - days * DAY_MS)
  return date.toISOString().slice(0, 10)
}

/** ISO timestamp (yyyy-mm-ddThh:mm:ssZ) for `days`/`hours` before now. */
export function isoStampDaysAgo(days, hours = 0) {
  return new Date(Date.now() - days * DAY_MS - hours * 60 * 60 * 1000).toISOString()
}

/* --------------------------------------------------------------------------
   People
   -------------------------------------------------------------------------- */

const students = [
  {
    id: 'u-aline',
    full_name: 'Aline Uwase',
    email: 'student@example.com',
    role: ROLES.STUDENT,
    institution: 'University of Rwanda - CBE',
    company: 'Zipline',
    department: 'Software Engineering',
    phone: '+250 788 000 101',
    joined: 34,
  },
  {
    id: 'u-eric',
    full_name: 'Eric Niyonkuru',
    email: 'eric.niyonkuru@example.com',
    role: ROLES.STUDENT,
    institution: 'INES-Ruhengeri',
    company: 'Irembo',
    department: 'Information Technology',
    phone: '',
    joined: 33,
  },
  {
    id: 'u-kevin',
    full_name: 'Kevin Habimana',
    email: 'kevin.habimana@example.com',
    role: ROLES.STUDENT,
    institution: 'Kepler',
    company: 'BK Tech',
    department: 'Computer Science',
    phone: '',
    joined: 30,
  },
  {
    id: 'u-grace',
    full_name: 'Grace Umuhoza',
    email: 'grace.umuhoza@example.com',
    role: ROLES.STUDENT,
    institution: 'University of Rwanda - CBE',
    company: 'Equity Bank Rwanda',
    department: 'Finance',
    phone: '+250 788 000 104',
    joined: 29,
  },
  {
    id: 'u-divine',
    full_name: 'Divine Ingabire',
    email: 'divine.ingabire@example.com',
    role: ROLES.STUDENT,
    institution: 'AUCA',
    company: 'MTN Rwanda',
    department: 'Business Information Technology',
    phone: '',
    joined: 27,
  },
  {
    id: 'u-emmanuel',
    full_name: 'Emmanuel Ndayisaba',
    email: 'emmanuel.ndayisaba@example.com',
    role: ROLES.STUDENT,
    institution: 'University of Rwanda - CST',
    company: 'Irembo',
    department: 'Software Engineering',
    phone: '',
    joined: 26,
  },
  {
    id: 'u-joselyne',
    full_name: 'Joselyne Umutoni',
    email: 'joselyne.umutoni@example.com',
    role: ROLES.STUDENT,
    institution: 'AUCA',
    company: 'BPR Bank',
    department: 'Accounting',
    phone: '',
    joined: 21,
  },
  {
    id: 'u-patrick',
    full_name: 'Patrick Rutayisire',
    email: 'patrick.rutayisire@example.com',
    role: ROLES.STUDENT,
    institution: 'INES-Ruhengeri',
    company: 'RwandAir',
    department: 'Logistics and Supply Chain',
    phone: '',
    joined: 19,
  },
]

const supervisors = [
  {
    id: 'u-claudine',
    full_name: 'Dr. Claudine Uwera',
    email: 'supervisor@example.com',
    role: ROLES.SUPERVISOR,
    institution: 'University of Rwanda - CBE',
    company: 'University of Rwanda',
    department: 'Business and Economics',
    phone: '+250 788 000 201',
    joined: 60,
  },
  {
    id: 'u-jeanbaptiste',
    full_name: 'Jean Baptiste Nsengimana',
    email: 'jb.nsengimana@example.com',
    role: ROLES.SUPERVISOR,
    institution: 'INES-Ruhengeri',
    company: 'INES-Ruhengeri',
    department: 'Applied Sciences',
    phone: '',
    joined: 58,
  },
  {
    id: 'u-ange',
    full_name: 'Ange Mbabazi',
    email: 'ange.mbabazi@example.com',
    role: ROLES.SUPERVISOR,
    institution: 'Kepler',
    company: 'Kepler',
    department: 'Computing',
    phone: '',
    joined: 52,
  },
  {
    id: 'u-samuel',
    full_name: 'Samuel Byiringiro',
    email: 'samuel.byiringiro@example.com',
    role: ROLES.SUPERVISOR,
    institution: 'AUCA',
    company: 'AUCA',
    department: 'Information Systems',
    phone: '',
    joined: 44,
  },
  {
    id: 'u-esther',
    full_name: 'Esther Tuyisenge',
    email: 'esther.tuyisenge@example.com',
    role: ROLES.SUPERVISOR,
    institution: 'MTN Rwanda',
    company: 'MTN Rwanda',
    department: 'Enterprise Technology',
    phone: '',
    joined: 39,
  },
  {
    id: 'u-olive',
    full_name: 'Olive Mukamana',
    email: 'olive.mukamana@example.com',
    role: ROLES.SUPERVISOR,
    institution: 'Irembo',
    company: 'Irembo',
    department: 'Engineering',
    phone: '',
    joined: 31,
  },
]

const admin = {
  id: 'u-admin',
  full_name: 'Nadia Uwimana',
  email: 'admin@example.com',
  role: ROLES.ADMIN,
  institution: 'University of Rwanda',
  company: 'Programme Office',
  department: 'Placement and Attachment Office',
  phone: '+250 788 000 300',
  joined: 220,
}

export const demoProfiles = [
  ...students.map((person) => ({
    ...person,
    created_at: isoStampDaysAgo(person.joined),
  })),
  ...supervisors.map((person) => ({
    ...person,
    created_at: isoStampDaysAgo(person.joined),
  })),
  { ...admin, created_at: isoStampDaysAgo(admin.joined) },
]

/** Demo sign-in accounts. Passwords exist only in this file, never in the build output. */
export const demoLogins = [
  { email: 'student@example.com', password: 'student1234', userId: 'u-aline' },
  { email: 'supervisor@example.com', password: 'supervisor1234', userId: 'u-claudine' },
  { email: 'admin@example.com', password: 'admin1234', userId: 'u-admin' },
]

/** Which supervisor carries which student. */
export const demoSupervisorStudents = [
  { id: 'ss-1', supervisor_id: 'u-claudine', student_id: 'u-aline' },
  { id: 'ss-2', supervisor_id: 'u-claudine', student_id: 'u-grace' },
  { id: 'ss-3', supervisor_id: 'u-claudine', student_id: 'u-joselyne' },
  { id: 'ss-4', supervisor_id: 'u-jeanbaptiste', student_id: 'u-eric' },
  { id: 'ss-5', supervisor_id: 'u-jeanbaptiste', student_id: 'u-patrick' },
  { id: 'ss-6', supervisor_id: 'u-ange', student_id: 'u-kevin' },
  { id: 'ss-7', supervisor_id: 'u-samuel', student_id: 'u-emmanuel' },
  { id: 'ss-8', supervisor_id: 'u-esther', student_id: 'u-divine' },
]

/* --------------------------------------------------------------------------
   Logbook templates
   -------------------------------------------------------------------------- */

const SKILL_OPTIONS = [
  'Requirements gathering',
  'Data analysis',
  'Writing and documentation',
  'Client communication',
  'Quality checks',
  'Reporting',
  'Teamwork',
  'Problem solving',
]

export const demoTemplates = [
  {
    id: 'tpl-standup',
    supervisor_id: 'u-claudine',
    title: 'Weekly delivery and reflection log',
    description:
      'One entry per week covering the stand-up summary, what was shipped, what blocked the work and the evidence of delivery.',
    frequency: TEMPLATE_FREQUENCY.WEEKLY,
    start_date: isoDaysAgo(28),
    end_date: isoDaysAgo(-56),
    required_hours: 160,
    version: 2,
    status: TEMPLATE_STATUS.PUBLISHED,
    created_at: isoStampDaysAgo(30),
    fields: [
      {
        key: 'entry_date',
        type: 'date',
        label: 'Week ending',
        help: 'The Friday of the week you are recording.',
        required: true,
        options: [],
      },
      {
        key: 'hours_worked',
        type: 'number',
        label: 'Hours worked this week',
        help: 'Total hours, decimals allowed (7.5).',
        required: true,
        options: [],
      },
      {
        key: 'standup',
        type: 'long_text',
        label: 'Stand-up summary',
        help: 'What the team agreed on and what you picked up.',
        required: true,
        options: [],
      },
      {
        key: 'shipped',
        type: 'long_text',
        label: 'What shipped',
        help: 'Describe the work that reached a reviewer or a user.',
        required: true,
        options: [],
      },
      {
        key: 'blockers',
        type: 'short_text',
        label: 'Blockers',
        help: 'Leave empty if the week was clear.',
        required: false,
        options: [],
      },
      {
        key: 'review_confidence',
        type: 'rating',
        label: 'Confidence after review',
        help: 'One is shaky, five is solid.',
        required: true,
        options: [],
      },
      {
        key: 'evidence',
        type: 'evidence',
        label: 'Evidence',
        help: 'A pull request export, a screenshot or a signed note. PDF, PNG or JPG.',
        required: false,
        options: [],
      },
    ],
  },
  {
    id: 'tpl-artefact',
    supervisor_id: 'u-jeanbaptiste',
    title: 'Artefact and skills log',
    description:
      'For placements where the deliverable matters more than the timesheet: an artefact, the skills it exercised and a short reflection.',
    frequency: TEMPLATE_FREQUENCY.WEEKLY,
    start_date: isoDaysAgo(24),
    end_date: isoDaysAgo(-60),
    required_hours: 140,
    version: 1,
    status: TEMPLATE_STATUS.PUBLISHED,
    created_at: isoStampDaysAgo(26),
    fields: [
      {
        key: 'entry_date',
        type: 'date',
        label: 'Entry date',
        help: '',
        required: true,
        options: [],
      },
      {
        key: 'hours_worked',
        type: 'number',
        label: 'Hours worked',
        help: 'Hours spent on the artefact this week.',
        required: true,
        options: [],
      },
      {
        key: 'artefact',
        type: 'short_text',
        label: 'Artefact',
        help: 'Name the thing you produced.',
        required: true,
        options: [],
      },
      {
        key: 'reflection',
        type: 'long_text',
        label: 'Reflection',
        help: 'What would you do differently next time?',
        required: true,
        options: [],
      },
      {
        key: 'skills',
        type: 'checkbox_list',
        label: 'Skills practised',
        help: 'Tick everything that applies.',
        required: false,
        options: SKILL_OPTIONS,
      },
    ],
  },
  {
    id: 'tpl-draft-reporting',
    supervisor_id: 'u-claudine',
    title: 'Monthly reporting log',
    description: 'A monthly summary for placements that report to a line manager.',
    frequency: TEMPLATE_FREQUENCY.WEEKLY,
    start_date: isoDaysAgo(10),
    end_date: isoDaysAgo(-70),
    required_hours: 120,
    version: 1,
    status: TEMPLATE_STATUS.DRAFT,
    created_at: isoStampDaysAgo(9),
    fields: [
      {
        key: 'entry_date',
        type: 'date',
        label: 'Reporting period end',
        help: '',
        required: true,
        options: [],
      },
      {
        key: 'hours_worked',
        type: 'number',
        label: 'Hours in the period',
        help: '',
        required: true,
        options: [],
      },
      {
        key: 'summary',
        type: 'long_text',
        label: 'Summary',
        help: '',
        required: true,
        options: [],
      },
    ],
  },
]

/**
 * The default form used whenever a student has no published template assigned
 * (section 8, Student logbook).
 */
export const DEFAULT_TEMPLATE = Object.freeze({
  id: 'tpl-default',
  supervisor_id: null,
  title: 'Standard attachment logbook',
  description: 'The default weekly entry: date, hours, activity, learning and skills.',
  frequency: TEMPLATE_FREQUENCY.WEEKLY,
  version: 1,
  status: TEMPLATE_STATUS.PUBLISHED,
  fields: [
    {
      key: 'entry_date',
      type: 'date',
      label: 'Entry date',
      help: '',
      required: true,
      options: [],
    },
    {
      key: 'hours_worked',
      type: 'number',
      label: 'Hours worked',
      help: 'Decimals are fine, for example 7.5.',
      required: true,
      options: [],
    },
    {
      key: 'activity',
      type: 'long_text',
      label: 'What I did',
      help: 'Be specific enough that a supervisor can picture the day.',
      required: true,
      options: [],
    },
    {
      key: 'learned',
      type: 'long_text',
      label: 'What I learned',
      help: 'One paragraph is enough.',
      required: true,
      options: [],
    },
    {
      key: 'skills',
      type: 'checkbox_list',
      label: 'Skills practised',
      help: 'Tick everything that applies.',
      required: false,
      options: SKILL_OPTIONS,
    },
  ],
})

export const demoAssignments = [
  {
    id: 'as-1',
    template_id: 'tpl-standup',
    student_id: 'u-aline',
    supervisor_id: 'u-claudine',
    status: 'active',
    assigned_at: isoStampDaysAgo(28),
  },
  {
    id: 'as-2',
    template_id: 'tpl-artefact',
    student_id: 'u-eric',
    supervisor_id: 'u-jeanbaptiste',
    status: 'active',
    assigned_at: isoStampDaysAgo(24),
  },
]

/* --------------------------------------------------------------------------
   Entries
   -------------------------------------------------------------------------- */

const logSeed = [
  // Aline - University of Rwanda CBE at Zipline. The demo student.
  {
    id: 'log-aline-01',
    student_id: 'u-aline',
    template_id: 'tpl-standup',
    days: 27,
    hours: 8,
    status: LOG_STATUS.APPROVED,
    activity:
      'Onboarding with the operations team. Shadowed the dispatch desk and learned how a delivery window is built.',
    skills: ['Teamwork', 'Problem solving'],
    review: 'Clear account of the day. Good questions asked at the desk.',
    reviewedDays: 26,
  },
  {
    id: 'log-aline-02',
    student_id: 'u-aline',
    template_id: 'tpl-standup',
    days: 20,
    hours: 7.5,
    status: LOG_STATUS.APPROVED,
    activity:
      'Built the first version of the weekly delivery report in Google Sheets, then automated the totals with a small script.',
    skills: ['Data analysis', 'Reporting'],
    review: 'The automated totals saved the team an hour. Noted.',
    reviewedDays: 19,
  },
  {
    id: 'log-aline-03',
    student_id: 'u-aline',
    template_id: 'tpl-standup',
    days: 14,
    hours: 9,
    status: LOG_STATUS.REJECTED,
    activity: 'Worked on the dashboard.',
    skills: ['Data analysis'],
    review:
      'Too thin to sign: which dashboard, which questions, and what did you change? Rewrite with the chart names and the decision it supported.',
    reviewedDays: 13,
  },
  {
    id: 'log-aline-04',
    student_id: 'u-aline',
    template_id: 'tpl-standup',
    days: 13,
    hours: 8.5,
    status: LOG_STATUS.APPROVED,
    activity:
      'Rewrote the delivery dashboard notes with the chart names, the source tables and the questions each chart answers for the Kigali hub.',
    skills: ['Writing and documentation', 'Data analysis'],
    review: 'Much better. This is the level of detail the logbook needs.',
    reviewedDays: 12,
  },
  {
    id: 'log-aline-05',
    student_id: 'u-aline',
    template_id: 'tpl-standup',
    days: 8,
    hours: 7,
    status: LOG_STATUS.APPROVED,
    activity:
      'Ran the Friday quality checks on the inbound stock sheet, found two mismatches and traced both to a duplicated intake row.',
    skills: ['Quality checks', 'Problem solving'],
    review: 'Good catch on the duplicate row. I have shared it with the intake lead.',
    reviewedDays: 7,
  },
  {
    id: 'log-aline-06',
    student_id: 'u-aline',
    template_id: 'tpl-standup',
    days: 6,
    hours: 8,
    status: LOG_STATUS.PENDING,
    activity:
      'Documented the weekly stock reconciliation steps so that the next intern can repeat them without asking for help.',
    skills: ['Writing and documentation', 'Teamwork'],
  },
  {
    id: 'log-aline-07',
    student_id: 'u-aline',
    template_id: 'tpl-standup',
    days: 4,
    hours: 6.5,
    status: LOG_STATUS.PENDING,
    activity:
      'Sat with the finance officer to understand how dispatch costs are reconciled at month end, then drafted a one-page explainer.',
    skills: ['Client communication', 'Reporting'],
  },
  {
    id: 'log-aline-08',
    student_id: 'u-aline',
    template_id: 'tpl-standup',
    days: 2,
    hours: 7.5,
    status: LOG_STATUS.REJECTED,
    activity:
      'Attended the weekly review, took notes on the three open issues and updated the shared tracker afterwards.',
    skills: ['Teamwork', 'Reporting'],
    review:
      'You attended, but what did you decide or produce? Add the three issues and the owner you agreed for each.',
    reviewedDays: 1,
  },
  {
    id: 'log-aline-09',
    student_id: 'u-aline',
    template_id: 'tpl-standup',
    days: 1,
    hours: 5,
    status: LOG_STATUS.DRAFT,
    activity: 'Preparing the week five summary and the evidence pack for the supervisor visit.',
    skills: [],
  },

  // Eric - INES at Irembo.
  {
    id: 'log-eric-01',
    student_id: 'u-eric',
    template_id: 'tpl-artefact',
    days: 22,
    hours: 8,
    status: LOG_STATUS.APPROVED,
    activity:
      'Shipped the address-autocomplete fix on the citizen portal and wrote the regression note for the QA team.',
    skills: ['Problem solving', 'Writing and documentation'],
    review: 'The regression note is exactly what QA asked for. Approved.',
    reviewedDays: 21,
  },
  {
    id: 'log-eric-02',
    student_id: 'u-eric',
    template_id: 'tpl-artefact',
    days: 15,
    hours: 9,
    status: LOG_STATUS.APPROVED,
    activity:
      'Paired with a backend engineer to trace slow certificate requests, then wrote the query that exposed the missing index.',
    skills: ['Data analysis', 'Teamwork'],
    review: 'Strong week. The index suggestion reached the platform team.',
    reviewedDays: 14,
  },
  {
    id: 'log-eric-03',
    student_id: 'u-eric',
    template_id: 'tpl-artefact',
    days: 7,
    hours: 7,
    status: LOG_STATUS.PENDING,
    activity:
      'Redesigned the certificate status page so that a citizen can tell whether a request is waiting on them or on the office.',
    skills: ['Client communication', 'Problem solving'],
  },
  {
    id: 'log-eric-04',
    student_id: 'u-eric',
    template_id: 'tpl-artefact',
    days: 3,
    hours: 6,
    status: LOG_STATUS.PENDING,
    activity:
      'Usability testing with four citizens at the Kigali service centre; wrote up the findings and two follow-up tickets.',
    skills: ['Client communication', 'Reporting'],
  },

  // Kevin - Kepler at BK Tech.
  {
    id: 'log-kevin-01',
    student_id: 'u-kevin',
    template_id: null,
    days: 21,
    hours: 8,
    status: LOG_STATUS.APPROVED,
    activity: 'Set up the sandbox environment and documented the access steps for the team.',
    skills: ['Writing and documentation'],
    review: 'Useful onboarding document. Shared with the other interns.',
    reviewedDays: 20,
  },
  {
    id: 'log-kevin-02',
    student_id: 'u-kevin',
    template_id: null,
    days: 12,
    hours: 7.5,
    status: LOG_STATUS.APPROVED,
    activity:
      'Reviewed three pull requests for the internal wallet service and logged the defects found.',
    skills: ['Quality checks', 'Problem solving'],
    review: 'Good defect write-ups. Keep quoting the line numbers.',
    reviewedDays: 11,
  },
  {
    id: 'log-kevin-03',
    student_id: 'u-kevin',
    template_id: null,
    days: 5,
    hours: 8,
    status: LOG_STATUS.PENDING,
    activity: 'Automated the nightly reconciliation report and scheduled it at 02:00 CAT.',
    skills: ['Reporting', 'Problem solving'],
  },

  // Grace - UR CBE at Equity Bank Rwanda.
  {
    id: 'log-grace-01',
    student_id: 'u-grace',
    template_id: null,
    days: 24,
    hours: 8,
    status: LOG_STATUS.APPROVED,
    activity: 'Learned the loan file checklist and audited ten files against it.',
    skills: ['Quality checks', 'Data analysis'],
    review: 'Two files were missing signatures. Good audit.',
    reviewedDays: 23,
  },
  {
    id: 'log-grace-02',
    student_id: 'u-grace',
    template_id: null,
    days: 17,
    hours: 8,
    status: LOG_STATUS.APPROVED,
    activity: 'Prepared the weekly branch summary for the credit committee.',
    skills: ['Reporting', 'Writing and documentation'],
    review: 'Clear and on time.',
    reviewedDays: 16,
  },
  {
    id: 'log-grace-03',
    student_id: 'u-grace',
    template_id: null,
    days: 9,
    hours: 6,
    status: LOG_STATUS.REJECTED,
    activity: 'Helped at the front desk.',
    skills: [],
    review:
      'Describe what you handled: which customer requests, which forms, what you learned about the process.',
    reviewedDays: 8,
  },
  {
    id: 'log-grace-04',
    student_id: 'u-grace',
    template_id: null,
    days: 2,
    hours: 7,
    status: LOG_STATUS.PENDING,
    activity:
      'Reconciled mobile money transactions for the branch and flagged the four exceptions to the operations officer.',
    skills: ['Quality checks', 'Reporting'],
  },

  // Divine - AUCA at MTN Rwanda.
  {
    id: 'log-divine-01',
    student_id: 'u-divine',
    template_id: null,
    days: 20,
    hours: 8,
    status: LOG_STATUS.APPROVED,
    activity:
      'Mapped the onboarding journey for the SME data bundle and listed the drop-off points.',
    skills: ['Data analysis', 'Client communication'],
    review: 'The journey map is being used in the Monday product meeting.',
    reviewedDays: 19,
  },
  {
    id: 'log-divine-02',
    student_id: 'u-divine',
    template_id: null,
    days: 10,
    hours: 7,
    status: LOG_STATUS.PENDING,
    activity: 'Drafted three SMS reminders and tested them with the call centre script.',
    skills: ['Writing and documentation', 'Client communication'],
  },

  // Emmanuel - UR CST at Irembo.
  {
    id: 'log-emmanuel-01',
    student_id: 'u-emmanuel',
    template_id: null,
    days: 18,
    hours: 9,
    status: LOG_STATUS.APPROVED,
    activity: 'Built the internal tool that converts support tickets into daily stand-up notes.',
    skills: ['Problem solving', 'Reporting'],
    review: 'Neat tool. Add a short README so the next intern can maintain it.',
    reviewedDays: 17,
  },
  {
    id: 'log-emmanuel-02',
    student_id: 'u-emmanuel',
    template_id: null,
    days: 6,
    hours: 8,
    status: LOG_STATUS.PENDING,
    activity:
      'Wrote the README for the ticket tool and moved the configuration into environment variables.',
    skills: ['Writing and documentation'],
  },

  // Joselyne - AUCA at BPR Bank.
  {
    id: 'log-joselyne-01',
    student_id: 'u-joselyne',
    template_id: null,
    days: 16,
    hours: 7,
    status: LOG_STATUS.APPROVED,
    activity: 'Posted the weekly petty cash journal and learned how the branch closes the ledger.',
    skills: ['Data analysis', 'Reporting'],
    review: 'Accurate journal. Keep attaching the stamped voucher.',
    reviewedDays: 15,
  },
  {
    id: 'log-joselyne-02',
    student_id: 'u-joselyne',
    template_id: null,
    days: 4,
    hours: 6,
    status: LOG_STATUS.PENDING,
    activity: 'Prepared the reconciliation pack for the month-end review at the branch.',
    skills: ['Quality checks'],
  },

  // Patrick - INES at RwandAir.
  {
    id: 'log-patrick-01',
    student_id: 'u-patrick',
    template_id: null,
    days: 15,
    hours: 8,
    status: LOG_STATUS.APPROVED,
    activity: 'Tracked the spare-parts delivery from Mombasa and updated the arrival sheet.',
    skills: ['Reporting', 'Problem solving'],
    review: 'Clear tracking. Note the delay reason next time.',
    reviewedDays: 14,
  },
  {
    id: 'log-patrick-02',
    student_id: 'u-patrick',
    template_id: null,
    days: 3,
    hours: 7,
    status: LOG_STATUS.PENDING,
    activity: 'Audited the ground-handling invoices against the signed service sheets.',
    skills: ['Quality checks', 'Data analysis'],
  },
]

export const demoLogs = logSeed.map((entry) => ({
  id: entry.id,
  student_id: entry.student_id,
  template_id: entry.template_id,
  template_version: entry.template_id === 'tpl-standup' ? 2 : 1,
  entry_date: isoDaysAgo(entry.days),
  hours_worked: entry.hours,
  activity_description: entry.activity,
  skills: entry.skills ?? [],
  answers: {},
  status: entry.status,
  supervisor_comment: entry.review ?? null,
  reviewed_at: entry.reviewedDays ? isoStampDaysAgo(entry.reviewedDays) : null,
  created_at: isoStampDaysAgo(entry.days),
  updated_at: isoStampDaysAgo(entry.review ? (entry.reviewedDays ?? entry.days) : entry.days),
}))

/* --------------------------------------------------------------------------
   Comments, notifications, competencies
   -------------------------------------------------------------------------- */

export const demoComments = [
  {
    id: 'cm-1',
    log_id: 'log-aline-03',
    author_id: 'u-claudine',
    body: 'Rewrite with the chart names and the decision the dashboard supported.',
    created_at: isoStampDaysAgo(13),
  },
  {
    id: 'cm-2',
    log_id: 'log-aline-08',
    author_id: 'u-claudine',
    body: 'Add the three open issues and the owner agreed for each.',
    created_at: isoStampDaysAgo(1),
  },
  {
    id: 'cm-3',
    log_id: 'log-eric-03',
    author_id: 'u-jeanbaptiste',
    body: 'Bring the two citizen quotes into the reflection, they are the strongest part.',
    created_at: isoStampDaysAgo(2),
  },
  {
    id: 'cm-4',
    log_id: 'log-grace-04',
    author_id: 'u-claudine',
    body: 'Which four exceptions? Add the transaction references.',
    created_at: isoStampDaysAgo(1),
  },
]

export const demoNotifications = [
  {
    id: 'nt-1',
    user_id: 'u-claudine',
    message: 'Aline Uwase submitted two entries for review.',
    read: false,
    created_at: isoStampDaysAgo(0, 3),
    link: '/supervisor/logs',
  },
  {
    id: 'nt-2',
    user_id: 'u-claudine',
    message: 'Grace Umuhoza resubmitted her reconciliation entry.',
    read: false,
    created_at: isoStampDaysAgo(0, 6),
    link: '/supervisor/logs',
  },
  {
    id: 'nt-3',
    user_id: 'u-claudine',
    message: 'You assigned the weekly delivery log to Aline Uwase.',
    read: true,
    created_at: isoStampDaysAgo(2),
    link: '/supervisor/logbooks',
  },
  {
    id: 'nt-4',
    user_id: 'u-aline',
    message: 'Dr. Claudine Uwera approved your week four entry.',
    read: false,
    created_at: isoStampDaysAgo(1, 2),
    link: '/student/logs',
  },
  {
    id: 'nt-5',
    user_id: 'u-aline',
    message: 'Your week five entry needs a revision before it can be signed.',
    read: false,
    created_at: isoStampDaysAgo(1, 4),
    link: '/student/logs',
  },
  {
    id: 'nt-6',
    user_id: 'u-aline',
    message: 'A new logbook was assigned to you: Weekly delivery and reflection log.',
    read: true,
    created_at: isoStampDaysAgo(28),
    link: '/student/logbook',
  },
  {
    id: 'nt-7',
    user_id: 'u-admin',
    message: 'Six attachments are awaiting a first review across the programme.',
    read: false,
    created_at: isoStampDaysAgo(0, 1),
    link: '/admin/reports',
  },
]

export const demoCompetencies = [
  {
    id: 'cp-1',
    code: 'C01',
    title: 'Professional conduct and punctuality',
    description: 'Arrives prepared, keeps agreed hours and communicates absences early.',
  },
  {
    id: 'cp-2',
    code: 'C02',
    title: 'Technical quality of work',
    description: 'Produces work that meets the standard of the host organisation.',
  },
  {
    id: 'cp-3',
    code: 'C03',
    title: 'Written communication',
    description: 'Writes notes, reports and reflections that another person can act on.',
  },
  {
    id: 'cp-4',
    code: 'C04',
    title: 'Collaboration',
    description: 'Works with the team, asks for help and offers it.',
  },
  {
    id: 'cp-5',
    code: 'C05',
    title: 'Reflection and learning',
    description: 'Can name what was learned and what to do differently next time.',
  },
  {
    id: 'cp-6',
    code: 'C06',
    title: 'Evidence and record keeping',
    description: 'Keeps artefacts, hours and approvals traceable.',
  },
]

export const demoCompetencySignoffs = [
  {
    id: 'cs-1',
    student_id: 'u-aline',
    competency_id: 'cp-1',
    status: COMPETENCY_STATUS.WITNESSED,
    supervisor_id: 'u-claudine',
    signed_at: isoStampDaysAgo(13),
    note: 'Consistently early, and messages the desk when the bus is late.',
  },
  {
    id: 'cs-2',
    student_id: 'u-aline',
    competency_id: 'cp-2',
    status: COMPETENCY_STATUS.DEVELOPING,
    supervisor_id: 'u-claudine',
    signed_at: isoStampDaysAgo(13),
    note: 'Strong on reporting, still building confidence with reconciliation.',
  },
  {
    id: 'cs-3',
    student_id: 'u-aline',
    competency_id: 'cp-3',
    status: COMPETENCY_STATUS.WITNESSED,
    supervisor_id: 'u-claudine',
    signed_at: isoStampDaysAgo(7),
    note: 'The rewrites are clear enough for the finance officer to use.',
  },
  {
    id: 'cs-4',
    student_id: 'u-aline',
    competency_id: 'cp-4',
    status: COMPETENCY_STATUS.DEVELOPING,
    supervisor_id: 'u-claudine',
    signed_at: isoStampDaysAgo(7),
    note: 'Works well at the dispatch desk; ask more questions in the review.',
  },
  {
    id: 'cs-5',
    student_id: 'u-aline',
    competency_id: 'cp-6',
    status: COMPETENCY_STATUS.OUTSTANDING,
    supervisor_id: null,
    signed_at: null,
    note: null,
  },
]

export const demoTermSignoffs = [
  {
    id: 'ts-1',
    student_id: 'u-eric',
    supervisor_id: 'u-jeanbaptiste',
    term_label: 'Attachment term 2, 2026',
    signed_at: isoStampDaysAgo(5),
    final_hours: 152,
  },
]

/* --------------------------------------------------------------------------
   Store
   -------------------------------------------------------------------------- */

function buildInitialState() {
  return {
    profiles: demoProfiles.map((profile) => ({ ...profile })),
    supervisorStudents: demoSupervisorStudents.map((row) => ({ ...row })),
    templates: demoTemplates.map((template) => ({ ...template, fields: [...template.fields] })),
    assignments: demoAssignments.map((row) => ({ ...row })),
    logs: demoLogs.map((log) => ({ ...log })),
    comments: demoComments.map((row) => ({ ...row })),
    notifications: demoNotifications.map((row) => ({ ...row })),
    competencies: demoCompetencies.map((row) => ({ ...row })),
    competencySignoffs: demoCompetencySignoffs.map((row) => ({ ...row })),
    termSignoffs: demoTermSignoffs.map((row) => ({ ...row })),
    logRevisions: [],
    auditLog: [],
  }
}

let state = buildInitialState()

export function getDemoState() {
  return state
}

export function resetDemoState() {
  state = buildInitialState()
  return state
}

let sequence = 1000

/** Stable-ish id generator for records created while demoing. */
export function demoId(prefix = 'id') {
  sequence += 1
  return `${prefix}-${sequence}`
}

export default {
  demoProfiles,
  demoLogins,
  demoTemplates,
  demoAssignments,
  demoLogs,
  demoComments,
  demoNotifications,
  demoCompetencies,
  demoCompetencySignoffs,
  demoTermSignoffs,
  DEFAULT_TEMPLATE,
  getDemoState,
  resetDemoState,
  demoId,
}
