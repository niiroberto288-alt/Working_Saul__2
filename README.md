# AttachTrack Rwanda

A digital internship (attachment) logbook for Rwandan students, supervisors and the
programme office. Paper-and-ink editorial design, two themes, real Supabase mode and a
fully working in-memory demo mode.

> **Status: Phase 2 of 7 complete.** Foundation and the public pages are done: landing
> page, sign in, registration, password reset, privacy notice and 404, plus the database
> schema in `supabase/schema.sql`. Student, supervisor and admin screens follow in Phases
> 3 to 5, cross-cutting features in Phase 6, and the FURPS+ quality pass in Phase 7.
> See [Phase status](#phase-status).

---

## Stack

| Concern     | Choice                                               |
| ----------- | ---------------------------------------------------- |
| Framework   | Vue 3 (`<script setup>`, JavaScript only)            |
| Build       | Vite 8                                               |
| Routing     | Vue Router 4 (dynamic imports per view)              |
| Styling     | Tailwind CSS v4 via `@tailwindcss/vite` + CSS tokens |
| Icons       | `@heroicons/vue/24/outline` only                     |
| Data        | `@supabase/supabase-js` (Auth, Postgres, Storage)    |
| Tests       | Vitest + `@vue/test-utils` + jsdom                   |
| Lint/format | ESLint 10 (flat config) + Prettier                   |

No JSX, no emoji, no chart or animation libraries, no UI kit. Charts are CSS and SVG.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173 - demo mode, no keys needed
```

Production build and checks:

```bash
npm run build      # dist/
npm run preview    # serve dist/
npm run lint       # eslint . --max-warnings 0
npm test           # vitest run
```

### Demo accounts (development only)

| Role       | Email                    | Password         |
| ---------- | ------------------------ | ---------------- |
| Student    | `student@example.com`    | `student1234`    |
| Supervisor | `supervisor@example.com` | `supervisor1234` |
| Admin      | `admin@example.com`      | `admin1234`      |

Demo mode is in-memory: reloading restores the sample data, and nothing is sent anywhere.
It is available when **either**

- `import.meta.env.DEV` is true (every `npm run dev`), or
- `VITE_DEMO_MODE=true` is set explicitly at build time.

A production build without Supabase keys shows the **App not configured** page and never
bundles or exposes demo accounts (FURPS+ C4). Demo session state, the theme preference and
unsent entry drafts are the only things written to `localStorage`.

---

## Troubleshooting

### `Cannot find native binding` when starting Vite on Windows

Vite 8 builds on rolldown, which ships a small native module per platform
(`@rolldown/binding-win32-x64-msvc` on Windows). npm has a long-standing bug
([npm/cli#4828](https://github.com/npm/cli/issues/4828)) where optional
dependencies are skipped, so the binary never lands in `node_modules`.
The lockfile already lists it with a valid integrity hash; nothing is wrong
with the repository.

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force
npm install
npm run dev
```

If it persists, check whether optional packages are being suppressed:

```powershell
npm config get omit     # must not contain "optional"
```

Other known causes: the project living in a OneDrive-synced folder, an
antivirus blocking `.node` extraction, or a brand-new Node release. Node 22 LTS
is the tested target (`engines: >=20.19.0`, Netlify builds with 22).

### `npm install` fails with `ENOENT ... package.json`

The default branch (`main`) contains only a placeholder README. Check out the
working branch first:

```bash
git checkout arena/771cd8aa-working-saul-2
```

### A production build shows "This logbook is not connected yet"

Correct behaviour. A production build without Supabase keys is intentionally
locked to that page so demo accounts can never reach production. Add
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, or use `npm run dev`, which
runs in demo mode.

---

## Environment

Copy `.env.example` to `.env`:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Never put a service-role key in this file, in the repo or in the frontend bundle. The anon
key is the only key the browser needs; Row Level Security does the rest.

| Situation                                    | Mode           | What you see                       |
| -------------------------------------------- | -------------- | ---------------------------------- |
| Both values present                          | `live`         | Supabase Auth + Postgres + Storage |
| Missing values, dev or `VITE_DEMO_MODE=true` | `demo`         | Sample data, demo badge            |
| Missing values, production build             | `unconfigured` | "App not configured" page          |

---

## Folder structure

```
src/
  assets/
    main.css          Tailwind import, theme tokens, grain, components, keyframes
    strings.js        Every user-facing string (single place for translation)
  components/         Shared components (stat cards, shell, dialogs, pills, ...)
  composables/        useAuth, useAsync, useTheme, useToast, useReveal,
                      useCountUp, useTypewriter
  router/index.js     Routes, role guard, scroll behaviour
  services/
    supabase.js       The only Supabase client module
    demoData.js       In-memory Rwandan sample data
  utils/
    validators.js     Shared validators and form helpers
    errors.js         Friendly error mapping
    logger.js         Silent in production; monitoring hook
  views/              Route components (loaded on demand)
  App.vue, main.js
public/
  _redirects          SPA fallback
  theme-boot.js       Applies the stored theme before first paint
tests/                Vitest suites
supabase/             schema.sql and seed.sql (Phase 5 / Phase 7)
```

---

## Routes

| Path                  | Purpose                                                                 | Access                          |
| --------------------- | ----------------------------------------------------------------------- | ------------------------------- |
| `/`                   | Landing page: hero, the four rails, supervisors, activity, first review | Public                          |
| `/login`              | Sign in (demo hints in demo mode)                                       | Guests                          |
| `/register`           | Open a logbook, student or supervisor only                              | Guests                          |
| `/forgot-password`    | Request a reset link; answers the same whether the address exists       | Guests                          |
| `/reset-password`     | Choose a new password from the recovery link                            | Public (needs recovery session) |
| `/privacy`            | Privacy notice                                                          | Public                          |
| `/styleguide`         | Design-system gallery                                                   | Development only                |
| `/app-not-configured` | Shown when a production build has no Supabase keys                      | Public                          |
| anything else         | Styled 404                                                              | Public                          |

A signed-in visitor who opens `/login` is sent to their own desk. A signed-out visitor who
opens a protected route is sent to `/login?redirect=...` and returned there afterwards.

---

## Design system in one paragraph

Warm linen and deep forest green in light mode; deep slate and teal in dark mode. Serif
headlines in Newsreader, body text in Inter, and tiny uppercase IBM Plex Mono labels with
generous tracking. Underline-only inputs, pill buttons, rounded cards, ruled-paper textures,
a fixed fractal-noise grain, and motion that only ever animates `transform` and `opacity`.
Every value lives as a CSS variable in `src/assets/main.css`, so both themes stay in step.

Visit `/styleguide` in development for the component gallery.

**Accessibility adjustment.** The brief's copper `#b87333`, amber `#d97706` and red `#dc2626`
stay as the decorative palette, but small text uses slightly deeper variants
(`--accent-text`, `--warn-text`, `--danger-text`) so every mono label, error message and
status pill passes WCAG 2.1 AA contrast in both themes. Same hues, one step darker.

---

## Phase status

| Phase | Scope                                                                          | Status       |
| ----- | ------------------------------------------------------------------------------ | ------------ |
| 1     | Foundation, config, design system, shared components, router, auth, data layer | **Complete** |
| 2     | Home, Login, Register, Forgot password, Reset password, Privacy, 404           | Next         |
| 3     | Student pages                                                                  | Pending      |
| 4     | Supervisor pages incl. Logbook Builder                                         | Pending      |
| 5     | Admin pages, Profile, `supabase/schema.sql`, README                            | Pending      |
| 6     | Notifications, exports, audit log, competencies, sign-off                      | Pending      |
| 7     | Tests, accessibility, performance, `seed.sql`, FURPS+ checklist                | Pending      |

---

## What Phase 1 contains

- **Configuration** - `src/config.js` holds roles, statuses, page sizes, upload limits,
  field types, storage keys and timeouts. Nothing is scattered through components.
- **Themes** - light and dark token sets, a toggle, and `public/theme-boot.js` so the correct
  theme is applied before the first paint.
- **Auth** - `useAuth` wraps Supabase Auth (`signInWithPassword`, `signUp`, `signOut`,
  `resetPasswordForEmail`, `updateUser`) and mirrors the same API in demo mode. Profiles come
  from the `profiles` table; role changes are never possible from the client.
- **Data layer** - `services/supabase.js` is the only module that imports the Supabase SDK.
  Composables choose live or demo; components never branch on mode.
- **Async plumbing** - `useAsync` returns `loading`, `error` and `data`, retries reads twice
  with backoff, maps errors to friendly copy and logs details through `utils/logger.js`.
- **Shared components** - `StatCard`, `Sidebar`, `TopNavbar`, `DashboardLayout`,
  `ThemeToggle`, `ConfirmationDialog`, `ToastContainer`, `Navbar`, `Footer`, `AccordionItem`,
  `StatusPill`, `ProgressBar`, `Avatar`, `EmptyState`, `SkeletonBlock`.
- **Router** - role metadata on every route, a guard that awaits the session, redirect-back
  after login, and a styled 404. All views are dynamic imports.
- **Tests** - 16 Vitest cases covering validators, demo login, the public pages and the
  application shell.

### Data access surface

| Composable / module                                                | Responsibility                                                   |
| ------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `useAuth`                                                          | Session, profile, sign in/up/out, password reset, profile update |
| `useAsync`                                                         | One async wrapper with loading, friendly error and retry         |
| `services/supabase.js`                                             | Creates and exports the single client; mode detection            |
| `services/demoData.js`                                             | In-memory dataset and demo accounts                              |
| `useToast`, `useTheme`, `useReveal`, `useCountUp`, `useTypewriter` | UI state and motion                                              |

Later phases add `useLogs`, `useTemplates`, `useNotifications`, `useCompetencies`,
`useAudit` and `useExports` on the same pattern.

---

## Security notes already in force

- The Supabase anon key is the only credential the client ever holds.
- Demo mode is gated on `import.meta.env.DEV` or an explicit `VITE_DEMO_MODE=true`.
- Production builds without keys never reach the app shell.
- Role and id are stripped from profile updates on the client; the database schema will
  enforce the same rule with a trigger in Phase 5.
- Seeded demo passwords exist only in `src/services/demoData.js`; Vite compiles that module
  out of production builds when `import.meta.env.DEV` is false and demo is not requested.

---

## Database

`supabase/schema.sql` creates the whole database. Run it once in the Supabase SQL editor
on a new project; it is ordered, commented and safe to re-run.

### What it creates

| Table                 | Holds                                                                      |
| --------------------- | -------------------------------------------------------------------------- |
| `profiles`            | Name, role, institution, company, department, phone. One row per auth user |
| `supervisor_students` | The caseload: which supervisor carries which student                       |
| `logbook_templates`   | Supervisor-built forms (`fields` as JSONB) with versions                   |
| `logbook_assignments` | Which student writes into which template                                   |
| `logs`                | Entries: date, hours, description, skills, answers, status                 |
| `evidence`            | Metadata for files in the private `evidence` bucket                        |
| `comments`            | Supervisor notes on an entry                                               |
| `notifications`       | Unread counts and messages, written by triggers                            |
| `log_revisions`       | The previous version of an entry, kept on every update                     |
| `audit_log`           | Append-only record of changes                                              |
| `competencies`        | The six reference competencies                                             |
| `competency_signoffs` | Outstanding, developing or witnessed, per student                          |
| `term_signoffs`       | Final term sign-off                                                        |
| `review_requests`     | The landing page's free-review form                                        |

### Rules the database enforces itself

| Rule                                                                 | Where                                          |
| -------------------------------------------------------------------- | ---------------------------------------------- |
| Approved entries are frozen                                          | `logs_guard_write()` trigger                   |
| Only Draft and Rejected entries are editable or deletable            | trigger + delete policy                        |
| A student cannot set a status other than Draft or Pending            | `logs_guard_write()`                           |
| A supervisor cannot rewrite a student's text, only the review fields | `logs_guard_write()`                           |
| A rejection must carry a comment                                     | `logs_rejection_needs_comment` check + trigger |
| Nobody can create an already-approved entry                          | `logs_guard_write()`                           |
| Hours are greater than 0 and at most 24                              | check constraint                               |
| An entry cannot be dated in the future                               | check constraint                               |
| Text fields have length limits                                       | check constraints                              |
| One entry per student, template and date                             | `logs_unique_entry_per_day`                    |
| A user cannot change their own role or id                            | `guard_profile_update()` trigger               |
| Registration can never create an admin                               | `handle_new_user()` clamps the role            |
| The audit log cannot be edited or deleted                            | no policies, `revoke`, plus a trigger          |
| A supervisor sees only their own caseload                            | `current_supervises()` in every policy         |
| Evidence files live in a per-user folder                             | storage policies in section 06                 |

### Policies at a glance

Every table has Row Level Security enabled. The full list, with a comment on each policy,
is in section 05 of `schema.sql`. In short:

- **Students** read and write their own logs, profile, notifications and assigned templates.
- **Supervisors** read the logs and profiles of students on their caseload, manage their own
  templates and assignments, and can only change the review fields of an entry.
- **Administrators** read everything and are the only ones who can change a role.
- **Anonymous visitors** can insert a `review_requests` row and read the competency list.
  Nothing else.

### Promoting the first administrator

```sql
update public.profiles
   set role = 'admin'
 where id = (select id from auth.users where email = 'office@university.ac.rw');
```

Sign in afterwards; the change is written to `audit_log` by trigger.

### Verifying isolation before real use

Run these once the project is seeded:

1. Sign in as student A and as student B in two browser profiles. Neither list shows the
   other's entries.
2. Sign in as a supervisor who does not supervise student C. C's entries return nothing.
3. As a student, call the API to update an approved entry. It must fail with
   `Approved entries are locked.`
4. As a student, try `update profiles set role = 'admin' where id = auth.uid();`. It must
   fail with `Only an administrator can change a role.`
5. As a supervisor, read a student outside the caseload. Zero rows.

### Recommended Auth settings

- Email confirmation **on**.
- Minimum password length **8**.
- Site URL: your Netlify address. Redirect allow list:
  `https://your-site/reset-password`, `https://your-site/login`,
  `http://localhost:5173/reset-password`.
- Leave Supabase's built-in rate limits on; do not fake rate limiting in the client.

---

## Deployment (Netlify)

`netlify.toml` already contains the build command, publish directory, SPA redirect, security
headers (CSP, `nosniff`, `Referrer-Policy`, `frame-ancestors none`, restrictive
`Permissions-Policy`) and long-lived caching for hashed assets.

1. Push the repository to GitHub.
2. In Netlify: **Add new site -> Import an existing project**, pick the repo.
3. Build command `npm run build`, publish directory `dist`.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Site settings -> Environment
   variables**, then deploy.
5. Replace `https://*.supabase.co` in the CSP with your project URL once it exists.

---

## Licence and data protection

The institution deploying this logbook must review it against applicable Rwandan data
protection law before real use. This project does not claim legal compliance. A privacy
notice page and a registration consent checkbox arrive in Phase 2; data retention and
deletion procedures are documented in Phase 7.
