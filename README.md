# AgTech – Smart Farming System

A Next.js + React application for the AgTech Smart Farming System. The main user-facing experience includes Home, Dashboard, Knowledge, AI Diagnosis, Experts, Marketplace, Weather, Profile, and Sign in screens. These screens are connected through the in-app navigation in `src/app/(frontend)/AgTechApp.tsx`.

## Requirements

- Node.js 24.22.3 or newer (the project package configuration requires this)
- npm 10 or newer
- VS Code (recommended)

## Run locally in VS Code

1. Extract this ZIP file.
2. Open the extracted `AgTech` folder in VS Code (the folder containing `package.json`).
3. Open **Terminal → New Terminal**.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open <http://localhost:3000> in your browser.

Stop the server with `Ctrl + C` in the terminal.

## Other commands

```bash
npm run typecheck   # Check TypeScript types
npm run build       # Create a production build
npm run start       # Run the production build locally
```

Run `npm run build` before `npm run start`.

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
- AI diagnosis requires the optional Gemini credentials above. Other demo interactions may display sample/demo content until a real backend is connected.
- The Payload admin/CMS routes are included in the source. They are separate from the main AgTech frontend and may need additional database and deployment configuration before the CMS can be used in production.
