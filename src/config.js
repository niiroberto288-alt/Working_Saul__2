/**
 * Application constants.
 *
 * Everything tunable lives here rather than being scattered through components
 * (FURPS+ S3): page sizes, upload limits, role names, storage keys, timeouts.
 */

export const APP_NAME = 'AttachTrack'
export const APP_REGION = 'Rwanda'
export const APP_TAGLINE = 'Internship logbook management'

/** The three roles in the system. Admin is assigned manually in the database. */
export const ROLES = Object.freeze({
  STUDENT: 'student',
  SUPERVISOR: 'supervisor',
  ADMIN: 'admin',
})

export const ROLE_LIST = Object.freeze([ROLES.STUDENT, ROLES.SUPERVISOR, ROLES.ADMIN])

/** Roles a visitor may pick at registration. Admin is never selectable. */
export const REGISTRABLE_ROLES = Object.freeze([ROLES.STUDENT, ROLES.SUPERVISOR])

/** Log entry lifecycle. Draft and Rejected are editable; Approved is locked. */
export const LOG_STATUS = Object.freeze({
  DRAFT: 'Draft',
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
})

export const LOG_STATUS_LIST = Object.freeze([
  LOG_STATUS.DRAFT,
  LOG_STATUS.PENDING,
  LOG_STATUS.APPROVED,
  LOG_STATUS.REJECTED,
])

export const LOG_STATUS_VALUES = Object.freeze([...LOG_STATUS_LIST])

/** Only these two statuses may be edited or deleted by a student. */
export const EDITABLE_STATUSES = Object.freeze([LOG_STATUS.DRAFT, LOG_STATUS.REJECTED])

/** Template lifecycle for supervisor-built logbooks. */
export const TEMPLATE_STATUS = Object.freeze({
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
})

export const TEMPLATE_FREQUENCY = Object.freeze({
  DAILY: 'daily',
  WEEKLY: 'weekly',
})

/** Dynamic field types available in the logbook builder. */
export const FIELD_TYPES = Object.freeze([
  { value: 'short_text', label: 'Short text' },
  { value: 'long_text', label: 'Long text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'checkbox_list', label: 'Checkbox list' },
  { value: 'rating', label: 'Rating 1 to 5' },
  { value: 'evidence', label: 'Evidence upload' },
])

export const FIELD_TYPE_VALUES = Object.freeze(FIELD_TYPES.map((type) => type.value))

/** Competency sign-off states. */
export const COMPETENCY_STATUS = Object.freeze({
  OUTSTANDING: 'outstanding',
  DEVELOPING: 'developing',
  WITNESSED: 'witnessed',
})

/** Pagination - server side, never fetch every row (FURPS+ P2). */
export const PAGE_SIZE = 10
export const PAGE_SIZE_LARGE = 20
export const SEARCH_DEBOUNCE_MS = 300

/** Evidence upload rules (FURPS+ F5). */
export const EVIDENCE_BUCKET = 'evidence'
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
export const ALLOWED_EVIDENCE_TYPES = Object.freeze(['application/pdf', 'image/png', 'image/jpeg'])
export const ALLOWED_EVIDENCE_EXTENSIONS = Object.freeze(['.pdf', '.png', '.jpg', '.jpeg'])
export const SIGNED_URL_TTL_SECONDS = 60 * 10

/** Notification polling fallback when Realtime is unavailable (FURPS+ F6). */
export const NOTIFICATION_POLL_MS = 60_000

/** Length limits mirrored by the database check constraints. */
export const LIMITS = Object.freeze({
  FULL_NAME: 120,
  INSTITUTION: 160,
  COMPANY: 160,
  DEPARTMENT: 120,
  PHONE: 32,
  COMMENT: 2000,
  ACTIVITY: 4000,
  SKILLS_NOTE: 1000,
  TEMPLATE_TITLE: 140,
  TEMPLATE_DESCRIPTION: 1000,
  FIELD_LABEL: 140,
  FIELD_HELP: 240,
  OPTION: 120,
  NOTIFICATION: 400,
})

/** Storage keys. localStorage holds only theme, demo session and entry drafts. */
export const STORAGE_KEYS = Object.freeze({
  THEME: 'attachtrack.theme',
  DEMO_SESSION: 'attachtrack.demo-session',
  DRAFT_PREFIX: 'attachtrack.draft.',
  HINT_PREFIX: 'attachtrack.hint.',
})

export const TOAST_DURATION_MS = 4500
export const SKELETON_MIN_MS = 400
export const COUNT_UP_DURATION_MS = 1500
export const TYPEWRITER_SPEED_MS = 20

/** Why the app cannot run: shown by the "App not configured" page. */
export const CONFIG_ERROR = Object.freeze({
  MISSING_KEYS: 'missing-keys',
  DEMO_DISABLED: 'demo-disabled',
})
