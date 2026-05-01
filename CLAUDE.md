# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

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
