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
2. Go to **SQL Editor > New query**, paste the contents of `supabase/schema.sql`, and run it. This creates the `listings` table with public read/insert access.
3. Go to **Project Settings > API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`
4. Paste both into your `.env` file.

That's it — no backend server required. The React app talks to Supabase directly.

## 3. Add your hero image

Drop a photo of the KwaMhlanga Crossroads intersection at:

```
public/assets/kwamhlanga-crossroads.jpg
```

(The phone mockup you shared is a good reference for the crop/angle.) If the file is missing, the hero still renders fine with just the dark gradient background.

## 4. Deploy the frontend on GitHub Pages

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

## 5. How the WhatsApp contact button works

Every listing has a `seller_whatsapp` number saved in international format (e.g. `27720708648` for a South African `072 070 8648`). The "Contact Hustler" button builds a link like:

```
https://wa.me/27720708648?text=Hi%2C%20I%20found%20your%20listing...
```

Tapping it opens WhatsApp (app or web) with the message pre-filled — no login, chat database, or messaging API needed. The "Start Selling" form automatically converts a locally-typed number (starting with `0`) into this format for you.

## 6. The Dark Node toggle

The "Access Dark Node" button in the navbar switches the whole UI into a high-contrast terminal theme and shows a separate set of listings (`is_dark_market = true` in the database) — useful for off-grid/cash-only barter posts kept visually and structurally separate from the public marketplace. It's a cosmetic + filtering layer only, not an encrypted or anonymous mode — anything posted still lives in the same public Supabase table.

## Project structure

```
src/
  components/     UI components (Navbar, Hero, Categories, ListingCard, SellModal, Footer)
  context/        ThemeContext — White Market vs Dark Node state
  hooks/          useListings — fetches/filters listings from Supabase
  lib/            supabase.js (client), whatsapp.js (wa.me link builder)
supabase/
  schema.sql      Run once in the Supabase SQL editor
.github/workflows/
  deploy.yml      Auto-builds and publishes to GitHub Pages on push to main
```

## Tech stack

- React 18 + Vite
- Tailwind CSS
- Supabase (Postgres + auto-generated API, free tier)
- lucide-react icons
