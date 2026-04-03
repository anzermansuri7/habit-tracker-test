# Life Planning Tool

A full-stack personal dashboard for habits, health, finance, pregnancy, and learning.

## What changed in this version

- Added **user hierarchy**: `admin` and `regular`.
- Added **first-login onboarding** collecting: name, phone, age, gender, weight, height, and selected services.
- Added **module opt-in routing** so users only see selected services.
- Added **Supabase-backed CRUD** in every module (no longer static/in-memory).
- Added **default habit seeding** button to quickly insert initial data.
- Added `supabase/seed.sql` for initial sample data.
- Updated schema policies to support admin visibility.

## Run the app

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Fill `.env` with your Supabase values.
4. In Supabase SQL editor, run:
   - `supabase/schema.sql`
   - then optionally `supabase/seed.sql` (replace `USER_ID_HERE`)
5. Start app:
   ```bash
   npm run dev
   ```

## Fix for `Could not find table 'public.habit_logs' in schema cache`

This is usually because schema migrations were not applied yet (or cache not refreshed). Do this in order:

1. Execute `supabase/schema.sql` in SQL editor.
2. Open **Project Settings → API** and click **Reload schema cache**.
3. Restart frontend dev server.

## Required environment variables

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
