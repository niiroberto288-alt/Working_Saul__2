# AttachTrack Rwanda

A digital internship (attachment) logbook for Rwandan students, supervisors and the
programme office. Paper-and-ink editorial design, two themes, real Supabase mode and a
fully working in-memory demo mode.

> **Status: Phase 1 of 7 complete.** Foundation, configuration, design system, shared
> components, routing, authentication and the data layer are in place. The pages arrive in
> Phases 2 to 5, cross-cutting features in Phase 6, and the FURPS+ quality pass in Phase 7.
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
