# CLAUDE.md

## Project: Mood Journal

A mobile-first PWA for daily mood tracking with AI companion replies.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase (auth + PostgreSQL) · Groq API (primary AI) with Gemini Flash fallback

### Routes
| Path | Purpose |
|------|---------|
| `/today` | Daily journal entry — main feature |
| `/calendar` | Month heatmap + mood stats |
| `/archive` | Full entry list with search/filter |
| `/insights` | Analytics |
| `/settings` | Theme, AI tone, language, reminders |
| `/login` | Email/password sign-in + sign-up |
| `/auth/callback` | Supabase auth callback |
| `/auth/forgot-password`, `/auth/reset-password` | Password recovery |

### Key Features
- 5 moods: Rad / Good / Meh / Down / Awful
- AI reply with 3 tones: Friend, Reflective, Quiet
- AI chain: Groq → Gemini Flash → rule-based fallback (zero-cost)
- 3 themes: Cream (light), Dusk (dark), Notebook (textured)
- EN / ZH language toggle (localStorage key: `beans_language`)
- Streak tracking (checks up to 60 days back)

### Important Files
```
app/(app)/          — Protected routes (auth-gated)
app/api/entries/    — GET/POST journal entries
app/api/ai-reply/   — AI response endpoint
components/ui/      — TabBar, Header, MoodStrip, Bubble
components/providers/ — ThemeProvider, UserProvider, LanguageProvider
lib/ai.ts           — Groq/Gemini/fallback logic
lib/moods.ts        — Mood types + rule-based fallbacks
lib/themes.ts       — Theme definitions
lib/i18n/           — EN/ZH translation strings
lib/supabase-*.ts   — Server + browser Supabase clients
proxy.ts            — Vercel auth proxy (do NOT create middleware.ts alongside this)
```

### Database (Supabase)
Table `entries`: `user_id`, `date` (YYYY-MM-DD), `mood` (rad/good/meh/down/awful), `messages` (JSON), `updated_at`. Upsert on `(user_id, date)`.

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
GROQ_API_KEY          # optional, free tier 14,400 req/day
GEMINI_API_KEY        # optional fallback, free tier 1M tokens/day
```

### Architecture Notes
- Preferences (theme, language, AI tone) stored in `localStorage`
- Mobile-first: full-screen on mobile, 480px card on desktop
- `proxy.ts` handles auth redirect on Vercel — never create `middleware.ts` (breaks the build)

### Auth Flow

**Normal sign-in / sign-up** — handled entirely on `/login`. Supabase JS sets a session cookie; protected routes under `app/(app)/` check auth server-side.

**OAuth / magic-link callback** — Supabase redirects to `/auth/callback` with a `?code=` param. The Route Handler (`app/auth/callback/route.ts`) calls `exchangeCodeForSession(code)` server-side, upserts a `preferences` row on first login, then redirects to `/today`.

**Password reset flow (3 steps):**

1. **Request** (`/auth/forgot-password`) — calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: origin + '/auth/reset-password' })`. Supabase emails a one-time link pointing to its own verify endpoint.

2. **Email link click** — the link hits Supabase's server (`/auth/v1/verify?token=...&type=recovery&redirect_to=...`). Supabase validates the token there, then redirects the browser to the app's `redirectTo` URL with a `?code=` query param (PKCE flow).

3. **Reset page** (`/auth/reset-password`) — a `'use client'` page. On mount it reads `?code=` from `window.location.search` and calls `supabase.auth.exchangeCodeForSession(code)` **client-side**. This is intentional: the PKCE code verifier is stored in the browser's `localStorage`, so the exchange must happen in the browser. Once exchanged, the user has a temporary session and `supabase.auth.updateUser({ password })` sets the new password.

**Root page catch-all** (`app/page.tsx`) — if the reset email was sent with `redirectTo` pointing at the root (e.g. from the Supabase dashboard), the browser lands on `/` with `?code=`. The root page detects this and immediately redirects to `/auth/reset-password?code=...` so the normal reset flow takes over. Without this, the code would be silently dropped.

**Why the exchange must be client-side (not a Route Handler):** PKCE stores the verifier in `localStorage`. A server Route Handler cannot access `localStorage`, so calling `exchangeCodeForSession` there throws "PKCE code verifier not found in storage". Always handle password-recovery code exchange in a `'use client'` component.
