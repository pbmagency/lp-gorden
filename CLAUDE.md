# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TOEFL Online — a landing page for a TOEFL preparation service. The frontend is a React + TypeScript single-page application styled with Tailwind CSS v4. The backend is a Laravel (PHP) API.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| Backend | Laravel 11+ (PHP) |
| HTTP client | Axios or Fetch |

## Project Structure (expected)

```
toefl-online/
├── frontend/          # React + TypeScript + Vite app
│   ├── src/
│   │   ├── components/   # UI components (feature folders)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities, helpers
│   │   └── styles/       # Global CSS, Tailwind tokens
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── backend/           # Laravel API
    ├── app/
    ├── routes/api.php
    └── ...
```

## Common Commands

### Frontend

```bash
cd frontend
npm install          # install dependencies
npm run dev          # start Vite dev server (usually :5173)
npm run build        # production build
npm run preview      # preview production build locally
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

### Backend (Laravel)

```bash
cd backend
composer install           # install PHP dependencies
cp .env.example .env
php artisan key:generate
php artisan migrate        # run database migrations
php artisan serve          # start dev server (usually :8000)
php artisan test           # run PHPUnit test suite
php artisan test --filter=TestName   # run single test
```

## Tailwind CSS v4 Notes

Tailwind v4 uses a CSS-first configuration — **no `tailwind.config.js`**. Design tokens are defined in a CSS file using `@theme`:

```css
/* src/styles/tokens.css */
@import "tailwindcss";

@theme {
  --color-brand: oklch(60% 0.2 250);
  --font-sans: "Inter", sans-serif;
}
```

Utility classes are generated from these custom properties automatically.

## Architecture Notes

- The frontend is a static SPA served separately from Laravel. During development, Vite proxies API calls to the Laravel dev server.
- API routes live in `backend/routes/api.php` and are prefixed with `/api`.
- Contact form submissions (if any) are handled by a Laravel endpoint — validate server-side, never trust frontend-only validation.
- All environment-specific values (API base URL, etc.) go in `.env` / `.env.local` files — never hardcoded.

## Key Conventions

- Component files: `PascalCase.tsx` (e.g., `HeroSection.tsx`)
- Hooks: `useX.ts` (e.g., `useScrollProgress.ts`)
- CSS custom properties over hardcoded values — no magic numbers in stylesheets
- Animate only compositor-friendly properties (`transform`, `opacity`) — never `width`, `height`, `top`, `left`
- Semantic HTML elements (`<header>`, `<main>`, `<section>`, `<footer>`) before generic `<div>` wrappers
