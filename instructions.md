# Kafchazka — Café Shift Planner

A web app for planning and tracking shifts at a café. Built with React + Vite, persisted in Supabase, deployed on Vercel.

---

## What it does

- Monthly calendar view showing who is working each day
- Each day can have a full shift or a **split shift** (two people covering different hours)
- Weekday and weekend shifts have separate default start/end times
- Staff members each get a unique colour that appears on the calendar
- **Hours summary** in the Staff tab — total hours per person for the currently viewed month
- **Two access levels**: guests can browse the calendar and click shifts to see details; only logged-in users can add, edit or delete shifts and manage staff

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Database + Auth | Supabase (Postgres + Row Level Security) |
| Hosting | Vercel |
| Styling | Inline styles + injected CSS (`styles.js`), Google Fonts (Lora + Playfair Display) |

---

## File structure

```
kafchazka/
├── index.html                  # Vite entry point
├── vite.config.js              # Vite + React plugin config
├── .env                        # Supabase credentials (never commit this)
└── src/
    ├── main.jsx                # React root, mounts App, initialises Vercel analytics
    ├── App.jsx                 # Root component — all state, auth, data loading
    ├── constants.js            # Static data: day names, month names, default hours, staff colours
    ├── utils.js                # Pure helpers: calendar grid, date key, weekend check, hours calc, staff colour lookup
    ├── storage.js              # All Supabase read/write functions
    ├── supabase.js             # Supabase client singleton (reads from .env)
    ├── styles.js               # Global CSS string + reusable inline style objects
    └── components/
        ├── CalendarView.jsx    # Monthly grid, navigation, shift badges, staff legend
        ├── StaffView.jsx       # Add/remove staff, hours-per-month summary
        └── ShiftModal.jsx      # Day detail popup — readonly for guests, editable for editors
```

### Responsibility of each file

**`App.jsx`** is the single source of truth. It holds all state (`session`, `staff`, `shifts`, `modal`, `form`, `view`, `year`, `month`) and passes everything down as props. No child component fetches data or writes to Supabase directly — they call callbacks provided by `App`.

**`constants.js`** holds values that never change at runtime: the list of days, months, default shift times, and the palette of staff colours. If you want to change default shift hours or add colours, this is the only file to touch.

**`utils.js`** contains pure functions with no side effects. `getMonthGrid` builds the 7-column calendar array. `dateKey` produces `YYYY-MM-DD` strings used as shift object keys. `calcMonthlyHours` sums hours per staff member from the shifts object. `getStaffColor` is shared by `CalendarView` and `ShiftModal`.

**`storage.js`** is the only file that talks to Supabase. It maps between the flat database row shape (`p1_staff`, `p1_start` etc.) and the nested app shape (`p1: { staff, start, end }`). If you ever swap the database, only this file needs to change.

**`supabase.js`** creates the shared client once. It reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from environment variables.

**`styles.js`** exports a CSS string (`globalCss`) injected via a `<style>` tag in `App.jsx`, plus two inline style objects (`appShell`, `header`). Base styles come first in the string; the `@media (max-width: 480px)` mobile overrides come last.

---

## Database schema

```sql
create table staff (
  id         uuid default gen_random_uuid() primary key,
  name       text not null unique,
  color      text not null,
  created_at timestamptz default now()
);

create table shifts (
  id       uuid default gen_random_uuid() primary key,
  date     text not null unique,  -- YYYY-MM-DD
  split    boolean not null default false,
  p1_staff text,
  p1_start text,
  p1_end   text,
  p2_staff text,  -- null when split = false
  p2_start text,
  p2_end   text
);
```

### Row Level Security

```sql
-- Anyone can read (guests see the calendar)
create policy "Anyone can read staff"  on staff  for select using (true);
create policy "Anyone can read shifts" on shifts for select using (true);

-- Only logged-in users can write
create policy "Authenticated users can do everything on staff"
  on staff for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can do everything on shifts"
  on shifts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

---

## Auth

Supabase email + password auth. Users are created manually by the admin in the Supabase dashboard (Authentication → Users → Add user). There is no self-registration.

- **Guests** (not logged in): can view the calendar, navigate months, and click any assigned shift to see its details in a readonly modal.
- **Editors** (logged in): full access — add/edit/delete shifts, manage staff, view hours summary. A Sign in button in the header opens a dropdown login form.

Passwords are set directly in the Supabase dashboard or via SQL:
```sql
update auth.users
set encrypted_password = crypt('new-password', gen_salt('bf'))
where email = 'user@example.com';
```

---

## Environment variables

Two variables are required, set in `.env` locally and in Vercel dashboard for deployment:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

The `VITE_` prefix is required by Vite to expose variables to frontend code.

---

## Running locally

```bash
npm install
npm run dev        # starts at http://localhost:5173
```

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

---

## Deployment

The app is deployed on Vercel connected to the GitHub repo. Every push to `main` triggers a redeploy automatically. The `dist/` folder is a fully static build — no server required.

Remember to set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel → Settings → Environment Variables, and update the Supabase Site URL (Authentication → URL Configuration) to your Vercel deployment URL.

---

## Data shapes

Shifts are stored in app state as a flat object keyed by date:

```js
{
  "2025-04-07": {
    split: false,
    p1: { staff: "Anna", start: "08:00", end: "17:00" },
    p2: { staff: null,   start: null,    end: null    }
  },
  "2025-04-12": {
    split: true,
    p1: { staff: "Anna", start: "08:00", end: "12:30" },
    p2: { staff: "Tom",  start: "12:30", end: "17:00" }
  }
}
```

Staff is an array of objects returned directly from Supabase:

```js
[
  { id: "uuid...", name: "Anna", color: "#b85c20", created_at: "..." },
  { id: "uuid...", name: "Tom",  color: "#2e8c5a", created_at: "..." }
]
```

---

## Key decisions and gotchas

- **Filenames are case-sensitive on Vercel (Linux)**. `supabase.js` and `Supabase.js` are different files. Always use lowercase.
- **`VITE_` prefix is required** for environment variables to be accessible in frontend code.
- **Vercel Speed Insights** uses the `/react` import path (`injectSpeedInsights()`), not the Next.js `/next` variant.
- **The `staff` table needs a `created_at` column** for ordering. If you recreate the table, include it.
- **Staff colours in the database are not updated automatically** when you change `STAFF_COLORS` in `constants.js`. Existing staff keep their stored colour. Update them manually in Supabase → Table Editor or via SQL.
- **All state lives in `App.jsx`**. Child components are stateless except for local UI state (e.g. the new staff name input in `StaffView`).