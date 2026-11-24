# AgTech Cloudinary setup

AgTech keeps structured application records in Neon PostgreSQL. Cloudinary is the selected media delivery service for product photos, profile images, and article images.

## Keep credentials private

Add these values to your local `.env.local` file and to your hosting provider's server-side environment settings:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Get the values from the Cloudinary Console: https://console.cloudinary.com/. Never paste the API Secret into chat, commit it to GitHub, or use a `NEXT_PUBLIC_` variable for it. The Cloud Name and API Key are identifiers; the API Secret must remain server-only.

## What is now in the repository

- Neon PostgreSQL remains unchanged and stores application records and Payload media metadata.
- Payload's existing `media` collection and its access rules remain in place.
- Payload exposes an authenticated server endpoint at `/api/cloudinary/signature`. It returns a short-lived upload signature only to signed-in AgTech users or admins. The API Secret is used only on the server and is never returned.
- The signed upload is scoped to the authenticated user's `agtech/users/{userId}` folder.

## Important integration status

The signature endpoint is the secure backend foundation for browser-to-Cloudinary uploads. The current Payload Media collection still uses its existing upload handling; its upload UI has not yet been switched to Cloudinary. Do not treat Cloudinary storage as fully connected until the frontend upload flow is wired to request a signature, upload the file to Cloudinary, and save the resulting asset metadata in Payload.

The community package `payload-storage-cloudinary` currently documents compatibility with Payload v3, while this repository uses Payload `4.0.0-beta.11`. Do not install it blindly or downgrade Payload just to use it. A compatible v4 adapter or a tested custom integration is required before replacing Payload's existing Media upload flow.

## Current media scope

Use Cloudinary first for image assets (farmer product photos, profile images, and article images). PDF/document storage needs a separate decision and quota check; do not assume Cloudinary's image workflow is a general-purpose document store.

## Verification checklist

- [ ] Add Cloudinary values to local `.env.local` (never commit that file).
- [ ] Restart the local development server after changing environment variables.
- [ ] Sign in to AgTech and verify the signature endpoint returns a signature.
- [ ] Verify unauthenticated requests are rejected.
- [ ] Wire the frontend media upload flow to Cloudinary and persist the returned URL/public ID in Payload.
- [ ] Test image upload, display, deletion, and per-user ownership before production.
