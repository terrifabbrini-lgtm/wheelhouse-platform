# WheelHouse Carolina — full-stack MVP

A real, working peer-to-peer equipment rental platform, backed by a real
Postgres database — built to be deployed live (e.g. on Render) so you can
put it in front of real people and see if they'll sign up.

## The business model, built into the product

Owners keep 100% of their listed price. WheelHouse's only revenue is a
processing fee paid by the renter on top of that price.

- Homepage hero leads with it (a $100/day comparison vs. typical platforms)
- The listing page shows one all-in price plus a short trust line —
  "Includes a small WheelHouse fee — your host keeps 100% of their rate"
  — deliberately *not* an itemized owner/fee breakdown, to avoid making
  the fee feel like a tax and to avoid handing renters the exact math
  they'd need to pitch the owner on cutting WheelHouse out next time
- `/how-it-works` is the one place that *does* show the literal math,
  since that page's whole purpose is explaining the model
- `src/lib/pricing.js` is the single source of truth for the fee rate

## Run it locally

You need a Postgres database to run this — there's no file-based
fallback. Easiest local options: install Postgres yourself, or just skip
local running entirely and develop against your Render database (see
below) using its external connection string in `.env.local`.

```
npm install
echo "DATABASE_URL=postgres://..." > .env.local
npm run dev      # http://localhost:3000
```

The database tables are created automatically on first request — no
migration step needed.

## Deploying to Render (free, no credit card)

1. Push this code to a GitHub repo (web upload is fine — see the
   project chat for the no-terminal walkthrough).
2. On [render.com](https://render.com), create a **Postgres** database
   (free tier — note it expires after 30 days; Render emails you before
   that happens, and you can either recreate a free one or upgrade for
   ~$7/month if the project's gaining traction by then).
3. Create a **Web Service**, connect it to your GitHub repo. Render
   auto-detects Next.js — defaults are fine (`npm install` / `npm start`,
   after `npm run build`).
4. In the web service's **Environment** tab, add `DATABASE_URL` —
   Render can reference it directly from the Postgres service you
   created, so it stays in sync automatically.
5. Optional, for real owner-notification emails: add `RESEND_API_KEY`
   (free account at resend.com) and `RESEND_FROM_EMAIL`. Without these,
   the app still works fine — it just logs what *would* have been sent.
6. Deploy. First request after 15 minutes of inactivity takes ~30-60
   seconds to wake back up (free-tier cold start) — normal, not a bug.

## What's actually functional

- **Real accounts** — sign up / log in, hashed password (PBKDF2),
  HTTP-only session cookie. One account does both roles (list gear,
  rent gear), like Airbnb.
- **Real listings** — any signed-in user can list equipment in one of
  five categories, with a price per day and a location.
- **Real browsing** — category pills + location search, server-rendered.
- **Real requests** — a renter requests dates; the owner sees it on
  `/dashboard`, can accept/decline; status updates immediately for both
  sides. You can't request your own listing, and only the listing's
  owner can respond to a request on it — enforced server-side.
- **Phone number (optional)** at sign-up — shown to the other party
  only when relevant (the renter's, if given, to the owner on an
  incoming request; the owner's to the renter once a request is
  accepted), so people can coordinate pickup.
- **Owner email notification** on a new request, via Resend — degrades
  gracefully to a console log if `RESEND_API_KEY` isn't set yet.
- **Real persistence** — Postgres, survives restarts and redeploys.

## What's intentionally stubbed for an MVP

- **No payments.** The fee is calculated and *displayed* everywhere,
  but no money actually moves. Renter and owner coordinate the handoff
  directly once a request is accepted.
- **No photo uploads.** Listings are text-only.
- **No SMS.** Email-only notifications for now — texting needs a paid
  service (e.g. Twilio) with its own setup; ask if you want that added.

## Architecture notes for whoever takes this further

- **Next.js App Router**, plain JS, Tailwind v4 (CSS-first config in
  `src/app/globals.css` — brand tokens under `@theme`).
- **Data layer:** `src/lib/db.js`, real Postgres via `pg`
  (node-postgres). Every exported function is async; tables are
  created via `CREATE TABLE IF NOT EXISTS` on first use, no separate
  migration tool. The homepage is marked `export const dynamic =
  'force-dynamic'` specifically so it never tries to hit the database
  during the build step, before a database might even be attached.
- **Auth:** intentionally minimal — PBKDF2 password hashing, opaque
  session tokens, HTTP-only cookie. Add rate limiting, email
  verification, and password reset before a real launch.
- **Notifications:** `src/lib/notify.js` calls Resend's HTTP API
  directly (no SDK dependency). Swap in Twilio similarly if/when SMS
  is worth the added cost and setup.

## Routes

- `/` — homepage, leads with the 0%-commission pitch
- `/how-it-works` — fee breakdown with a worked example
- `/signup`, `/login` — auth
- `/browse` — filterable listing grid (`?category=`, `?location=`)
- `/listing/[id]` — detail + request-to-rent
- `/list-equipment` — create a listing (requires login)
- `/dashboard` — your listings, incoming requests (accept/decline), and
  your own outgoing requests
