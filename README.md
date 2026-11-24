# AgTech – Smart Farming System

A Next.js + React application for the AgTech Smart Farming System. The main user-facing experience includes Home, Dashboard, Knowledge, AI Diagnosis, Experts, Marketplace, Weather, Profile, and Sign in screens. These screens are connected through the in-app navigation in `src/app/(frontend)/AgTechApp.tsx`.

## Requirements

- Node.js 24.22.3 or newer (the project package configuration requires this)
- pnpm 9 or newer
- VS Code (recommended)

## Run locally in VS Code

1. Extract this ZIP file.
2. Open the extracted `AgTech` folder in VS Code (the folder containing `package.json`).
3. Open **Terminal → New Terminal**.
4. Install dependencies:

   ```bash
   pnpm install
   ```

5. Configure `.env.local` by following [Backend setup](docs/BACKEND_SETUP.md).
6. Start the development server:

   ```bash
   pnpm dev
   ```

7. Open <http://localhost:3000> in your browser.

Stop the server with `Ctrl + C` in the terminal.

## Other commands

```bash
pnpm typecheck       # Check TypeScript types
pnpm build           # Create a production build
pnpm start           # Run the production build locally
pnpm generate:types  # Regenerate Payload TypeScript types
pnpm admin:create    # Create the first Payload administrator
```

Run `pnpm build` before `pnpm start`.

## Backend setup

The app now uses Payload CMS with Neon PostgreSQL for user authentication and admin management. Follow [docs/BACKEND_SETUP.md](docs/BACKEND_SETUP.md) for environment variables, first-admin setup, account roles, and production migrations.

Public registration supports Farmer, Agronomist, and Business accounts directly. Admin is a separate private account used for platform management and moderation.

## AI plant disease diagnosis (optional)

The website interface can run without an AI key. To enable live AI diagnosis:

1. Copy `.env.example` to `.env.local`.
2. Add your Gemini API key to `APP_GEMINI_API_KEY`.
3. Keep `APP_GEMINI_API_BASE_URL` as `https://generativelanguage.googleapis.com` unless you use a compatible custom endpoint.
4. Restart the development server.

**Security:** Keep `.env.local` private. It is ignored by Git. Never commit API keys or expose them in browser-side code.

Without these settings, the diagnosis endpoint returns a helpful “not configured” response; the rest of the website remains usable. The `.env.example` file is safe to commit; `.env.local` is intentionally ignored by Git.

## Project map

- `src/app/(frontend)/AgTechApp.tsx` – main application and all user-facing screens/interactions.
- `src/app/(frontend)/styles.css` – shared styling and responsive layouts.
- `src/app/(frontend)/page.tsx` – connects the app to the Next.js home route.
- `src/app/(frontend)/layout.tsx` – global HTML layout, metadata and stylesheet connection.
- `src/app/(frontend)/api/diagnose/route.ts` – server-side AI diagnosis endpoint.
- `src/app/(payload)/` and `src/collections/` – Payload CMS administration and API integration.
- `public/` – favicon and local image assets.

## Notes

- The original ZIP contained Git LFS pointer text instead of the three referenced image binaries. Local SVG fallback artwork has been added so those image paths resolve when running the project. Replace these SVGs with the original exported image assets whenever you have them.
- The main website screens use client-side page state; they are not separate URL routes. Use the website navigation to move between them.
- AI diagnosis requires the optional Gemini credentials above. Authentication and CMS administration use Payload/PostgreSQL; Marketplace, Knowledge, Weather, Experts, and dashboard business data still contain demo/sample content and need their own backend collections and APIs.
- Payload CMS uses the PostgreSQL connection configured by `DATABASE_URL`. Follow the backend setup guide before using `/admin` or registration.
