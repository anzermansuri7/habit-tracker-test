# Life Planning Tool

A full-stack personal life management dashboard built with **React + Vite + Tailwind + Supabase**.

## Features

- Authentication (email/password via Supabase)
- Unified dashboard with cards + chart
- Habit tracker with learning/namaz/workout/diet logging
- Diet & fitness tracker (meals, workouts, weight logs)
- Finance tracker (expenses, debt, EMI)
- Pregnancy tracker (weekly logs, medication/reminders)
- Learning & career tracker (skills + learning hours)
- Realtime-ready Supabase schema + RLS

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS, Recharts
- Backend: Supabase (PostgreSQL, Auth, Realtime)

## Project Structure

```txt
.
├── src/
│   ├── components/
│   ├── hooks/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── styles/
│   └── types/
├── supabase/
│   ├── schema.sql
│   └── seed.sql
├── .env.example
└── README.md
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
   Fill:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. Create Supabase schema:
   - Open Supabase SQL editor.
   - Run `supabase/schema.sql`.
   - (Optional) run `supabase/seed.sql` after replacing `<USER_ID>`.

4. Start app:
   ```bash
   npm run dev
   ```

## Notes

- All module tables are protected with RLS.
- The app is designed with reusable card/table components and route-based modules.
- You can extend to PWA + notifications with service worker and scheduled Supabase edge functions.
