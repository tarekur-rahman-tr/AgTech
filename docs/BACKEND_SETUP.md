# AgTech backend setup

This project uses Next.js, Payload CMS, and PostgreSQL (Neon). The existing frontend design remains in `src/app/(frontend)/AgTechApp.tsx`; Payload provides the authentication API and admin panel.

## 1. Required environment variables

Create or update `.env.local` in the project root (the same folder as `package.json`). Do not commit this file.

Create a separate **development branch** in Neon and use that branch's connection string locally. Keep the existing `production` branch for the deployed app. Payload's PostgreSQL adapter automatically pushes schema changes in development mode, so do not point local development at a production database.

Use the development branch connection string here:

```env
DATABASE_URL="YOUR_NEON_DEVELOPMENT_BRANCH_CONNECTION_STRING"
```

Generate a separate Payload secret in PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Copy the generated value into `.env.local`:

```env
PAYLOAD_SECRET="PASTE_THE_GENERATED_VALUE_HERE"
ADMIN_EMAIL="your-admin-email@example.com"
ADMIN_PASSWORD="choose-a-unique-password-at-least-12-characters-long"
```

Do not use your Neon password as the Payload secret. Do not paste either secret into chat or commit `.env.local`.

## 2. Install and initialize

From the project root in PowerShell:

```powershell
& "$env:APPDATA\npm\pnpm.cmd" install
& "$env:APPDATA\npm\pnpm.cmd" generate:types
```

Start the app once so Payload can initialize the development database schema:

```powershell
& "$env:APPDATA\npm\pnpm.cmd" dev
```

Open `http://localhost:3000`. After confirming the server starts, stop it with Ctrl+C.

## 3. Create the first administrator

The public website must never allow visitors to create administrator accounts. Create the first administrator from your local terminal instead:

```powershell
& "$env:APPDATA\npm\pnpm.cmd" admin:create
```

This script reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env.local`, checks whether the administrator already exists, and creates it only if it does not.

Then restart the app and open:

```text
http://localhost:3000/admin
```

Sign in with the administrator email and password you configured.

## 4. How account registration, roles, and Admin work

- During public registration, a person chooses **Farmer**, **Agronomist**, or **Business**. The selected role is saved as the account's actual role, and the user can sign in immediately without administrator approval.
- The server accepts only those three role values. Missing or invalid values safely default to Farmer.
- A signed-in user cannot change their own role or create another user through the public API. Only an administrator can change an existing user's role.
- Admin is a separate, private authentication collection. There is no Admin option on the public registration form, and the first Admin is created only from the trusted server terminal with `pnpm admin:create`.
- Admin is for platform operations: managing accounts, moderating content and media, and responding to reported or suspicious marketplace activity as those modules are implemented. Normal Farmers, Agronomists, and Businesses do not need Admin access.
- The frontend uses the role returned by the authenticated server session, not a role kept only in browser state.
- User passwords are handled by Payload authentication. The browser uses the Payload HTTP-only session cookie; the frontend does not store passwords or authentication tokens in localStorage.

The legacy `requestedRole` field is retained temporarily for existing database records, but new registrations use `role` directly.

The website's sign-in form currently uses email and password. The phone number is a contact field, not a login identifier.

## 5. Authentication endpoints

Payload exposes these same-origin endpoints for the `users` collection:

- `POST /api/users` — register a user.
- `POST /api/users/login` — sign in and establish the session cookie.
- `GET /api/users/me` — return the currently authenticated user.
- `POST /api/users/logout` — end the session.

The frontend calls these endpoints with `credentials: 'include'` so the browser sends and receives the HTTP-only cookie.

## 6. Database migrations for deployment

Development can synchronize the schema automatically. Before deploying to production, create and review a migration using the configured Payload CLI:

```powershell
& "$env:APPDATA\npm\pnpm.cmd" db:migrate:create
```

Commit the generated migration files to GitHub. On the production environment, set `DATABASE_URL` to the Neon **production branch** connection string and set a strong `PAYLOAD_SECRET`, then run:

```powershell
& "$env:APPDATA\npm\pnpm.cmd" db:migrate
```

Never use a production database without applying the committed migrations.

## 7. Not configured yet

The core email/password registration and login flow is connected. These optional services still need their own provider/configuration before they can be advertised as working:

- Email delivery for password-reset messages and verification.
- SMS/OTP sign-in.
- Two-factor authentication.
- Email delivery for account verification and password-reset messages.

AI diagnosis remains separate and uses `APP_GEMINI_API_KEY` and `APP_GEMINI_API_BASE_URL` when configured.
