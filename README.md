# Pune Majha News (पुणे माझा न्यूज)

Official 24x7 bilingual/trilingual (`hi`, `mr`, `en`) digital news portal, E-Newspaper, Business Directory, Classifieds, Shorts, and Live TV platform for **Pune Majha News**.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database & Auth:** Firebase Firestore + Firebase Authentication (Admin SDK server-side)
- **Styling:** Tailwind CSS + shadcn/ui (Radix primitives)
- **Deployment:** Vercel (Root Directory: `frontend`)

## Getting Started

```bash
cd frontend
cp .env.example .env.local   # Fill in your Firebase credentials
npm install
npm run dev
```

## Project Structure

```
frontend/
├── app/              # Next.js App Router (pages + API routes)
│   ├── api/          # Backend API endpoints
│   └── page.js       # Main entry point
├── components/       # React components (UI + pages)
├── contexts/         # React context providers
├── hooks/            # Custom React hooks
├── lib/              # Shared utilities (auth, api, cache, etc.)
└── public/           # Static assets
```

## Environment Variables

See [`.env.example`](frontend/.env.example) for all required variables.
