# Hustle Hard

Local community marketplace for KwaMhlanga Crossroads, Mpumalanga. Buy, sell, hire and connect — plus a hidden "Dark Node" layer for off-grid cash listings. Sellers are contacted directly on WhatsApp, no chat backend needed.

## 1. Run it locally

```bash
npm install
cp .env.example .env
```

Open `.env` and fill in your Supabase project values (see step 2 below), then:

```bash
npm run dev
```

Visit the local URL it prints (usually `http://localhost:5173`).

## 2. Set up the database (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor > New query**, paste and run `supabase/schema.sql` first, then run each file in `supabase/migrations/` **in order** (001 through 005). Together they add:
   - `001` — `area` tagging + 14-day auto-expiry
   - `002` — "mark as sold", featured listings, an `owner_token` per listing
   - `003` — view counters + the `increment_listing_views` RPC
   - `004` — a write-only `reports` table for flagged listings
   - `005` — the public `listing-images` Storage bucket, for photo uploads
3. Go to **Project Settings > API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`
4. Paste both into your `.env` file.

That's it — no backend server required for the marketplace itself. The React app talks to Supabase directly.

## 3. Set up AI-assisted listing drafting (optional)

The "Let AI draft it for you" button in the Sell form turns a seller's rough notes into a clean title/description/category. It calls a Supabase **Edge Function** rather than the Anthropic API directly, so your API key never reaches the browser.

```bash
supabase functions deploy generate-listing
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

If you skip this step, the button just shows a friendly error and sellers fill in the form manually — nothing else breaks.

## 4. Add your hero image

Drop a photo of the KwaMhlanga Crossroads intersection at:

```
public/assets/kwamhlanga-crossroads.jpg
```

If the file is missing, the hero still renders fine with just the dark gradient background.

## 5. Deploy the frontend on GitHub Pages

1. Push this project to a GitHub repo named `hustle-hard` (or update `base` in `vite.config.js` to match whatever you name it).
2. In your repo: **Settings > Pages > Build and deployment > Source** → select **GitHub Actions**.
3. In your repo: **Settings > Secrets and variables > Actions**, add two repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Push to `main`. The included workflow (`.github/workflows/deploy.yml`) builds the app and publishes it automatically. Your site will be live at:

```
https://<your-github-username>.github.io/hustle-hard/
```

Prefer Vercel or Netlify instead? Just import the repo there, set the same two environment variables in their dashboard, and set the build command to `npm run build` with output directory `dist`. Remove/ignore `base: '/hustle-hard/'` in `vite.config.js` in that case (set it back to `'/'`).

## 6. How the WhatsApp contact button works

Every listing has a `seller_whatsapp` number saved in international format (e.g. `27720708648` for a South African `072 070 8648`). The "Contact Hustler" button builds a link like:

```
https://wa.me/27720708648?text=Hi%2C%20I%20found%20your%20listing...
```

Tapping it opens WhatsApp (app or web) with the message pre-filled — no login, chat database, or messaging API needed. The "Make an offer" button works the same way but with a custom price in the message. The "Start Selling" form automatically converts a locally-typed number (starting with `0`) into this format for you.

## 7. The Dark Node toggle

The "Access Dark Node" button in the navbar switches the whole UI into a high-contrast terminal theme and shows a separate set of listings (`is_dark_market = true` in the database) — useful for off-grid/cash-only barter posts kept visually and structurally separate from the public marketplace.

It ships with a bit of theatre: a code-rain canvas background, CRT scanlines, a short "establishing off-grid session" boot animation, a randomly-generated session codename (e.g. `GHOST-4471`), and a live "N on node" presence counter powered by Supabase Realtime.

**None of that is real anonymity or encryption** — it's a cosmetic + filtering layer only. Anything posted still lives in the same public Supabase table, contact still happens over a real WhatsApp number, and the same categories (Electronics, Fashion, Services, etc.) apply. Treat it as a themed section for cash/barter deals, not a hidden or untraceable marketplace.

## 8. Feature overview

| Feature | Where | Notes |
|---|---|---|
| Photo uploads | `ImageUploader.jsx` → Supabase Storage | Needs migration `005` |
| Listing detail page + share | `ListingDetail.jsx` (`/listing/:id`) | Deep-linkable, shows view count |
| Saved listings | `FavoriteButton.jsx`, `useFavorites.js` | Pure localStorage, no login |
| Make an offer | `OfferModal.jsx` | Custom WhatsApp message with your price |
| Area filter | `AreaFilter.jsx` | Crossroads, Siyabuswa, Vlaklaagte, etc. |
| Featured listings | `is_featured` column | Toggle manually in Supabase table editor for now |
| Auto-expiry | `expires_at` column | 14 days from posting; add a scheduled cleanup later if you want expired rows auto-hidden |
| Report a listing | `ReportModal.jsx` → `reports` table | Write-only from the app; review in the Supabase dashboard |
| AI-assisted drafting | `SellModal.jsx` + `generate-listing` Edge Function | Optional, see step 3 |
| Live presence counter | `usePresence.js` (Supabase Realtime) | Shown in Dark Node header |
| PWA / installable | `public/sw.js`, `manifest.json` | Caches the app shell for offline load |

## Project structure

```
src/
  components/
    Navbar.jsx, Hero.jsx, Categories.jsx, Home.jsx
    ListingsGrid.jsx, ListingCard.jsx, ListingDetail.jsx
    SellModal.jsx, ImageUploader.jsx
    FavoriteButton.jsx, OfferModal.jsx, ReportModal.jsx
    AreaFilter.jsx, DarkNodeFX.jsx, Footer.jsx
  context/
    ThemeContext.jsx        White Market vs Dark Node state + codename/boot flag
    FavoritesContext.jsx    Saved listings (localStorage)
  hooks/
    useListings.js          Filtered list query
    useListing.js            Single listing + view counter
    useFavorites.js
    usePresence.js            Realtime "N on node" count
  lib/
    supabase.js              Client
    whatsapp.js              wa.me link builders
    storage.js               Image upload helper
    ai.js                    Calls the generate-listing Edge Function
  routes/
    router.jsx
supabase/
  schema.sql                 Run once, first
  migrations/                Run 001 → 005, in order
  functions/generate-listing/index.ts   Optional AI drafting backend
.github/workflows/
  deploy.yml                 Auto-builds and publishes to GitHub Pages on push to main
public/
  sw.js                      Service worker for offline app-shell caching
```

## Tech stack

- React 18 + Vite + React Router
- Tailwind CSS
- Supabase (Postgres + Storage + Realtime + Edge Functions, free tier)
- lucide-react icons
- Claude (via Supabase Edge Function) for optional AI-assisted listing drafting
