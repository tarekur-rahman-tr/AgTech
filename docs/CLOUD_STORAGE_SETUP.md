# AgTech file storage setup (Supabase Storage)

AgTech keeps structured application records in the existing Neon PostgreSQL database. Uploaded binary files (product photos, profile images, article images, and PDFs) will use Supabase Storage on its Free plan, subject to the published quota.

## Chosen architecture

- **Neon PostgreSQL:** remains the source of truth for users, roles, listings, articles, inquiries, consultations, and Payload media metadata.
- **Supabase Storage:** stores uploaded file bytes only. We are not moving the AgTech application database or authentication to Supabase.
- **Payload Media collection:** remains the application's upload/metadata layer and records the uploader relationship.

Supabase Storage supports the S3 protocol. Its Free plan currently includes 1 GB file storage and a 50 MB maximum file upload size. Free projects may be paused after one week of inactivity. Check the current pricing and usage limits before using it with real users. Staying within the free quota is necessary to keep storage costs at $0.

## Supabase setup required

1. Create/sign in to a Supabase account: https://supabase.com/dashboard
2. Create a project, for example `agtech-file-storage`.
3. Choose a region close to the existing Neon database (Singapore is a sensible first choice if available).
4. Open **Storage** and create a bucket named `agtech-media`.
5. Open **Storage → Configuration → S3** (or the S3 settings area), enable the S3 protocol if required, and generate an S3 access key and secret.
6. Save the project region, S3 endpoint, Access Key ID, and Secret Access Key privately. S3 secret keys are shown only once.

Do not send credentials in chat, commit them to GitHub, or add them to a `NEXT_PUBLIC_` variable. Use a server-side secret in `.env.local` and deployment settings only.

## Environment variables (names to be wired into the app)

The exact endpoint, region, bucket and credentials must come from the Supabase project dashboard:

```env
SUPABASE_STORAGE_BUCKET=agtech-media
SUPABASE_S3_ENDPOINT=
SUPABASE_S3_REGION=
SUPABASE_S3_ACCESS_KEY_ID=
SUPABASE_S3_SECRET_ACCESS_KEY=
```

## Application integration status

This document records the selected provider and setup steps; it does **not** mean the application is connected yet. The repository currently has a Payload Media collection and the Payload cloud-storage foundation package, but no Supabase adapter is configured.

Important compatibility note: this repository currently uses Payload `4.0.0-beta.11`. Before adding an adapter, verify that the chosen adapter supports this exact Payload version. The official Payload S3 adapter's documented API/version must not be assumed compatible with this beta. If no compatible official adapter exists, implement and test a small server-side Supabase Storage integration/custom Payload adapter rather than installing an incompatible package.

Keep local development uploads available until the remote adapter is implemented and credentials are configured. Do not change the existing Neon database connection.

## Verification checklist

- [ ] Create the Supabase project and `agtech-media` bucket on the Free plan.
- [ ] Confirm the S3 endpoint, region and server-only credentials in the dashboard.
- [ ] Verify Payload v4 beta compatibility before selecting an adapter.
- [ ] Configure remote storage for the `media` collection without exposing secret credentials.
- [ ] Keep Payload's media access controls enabled; do not make private uploads public by default.
- [ ] Upload a test image as a Farmer and confirm the Media record stores the uploader.
- [ ] Confirm the file remains available after restarting the app.
- [ ] Confirm another signed-in user cannot edit or delete the first user's media.
- [ ] Confirm an Admin can manage media.
- [ ] Test upload, read, delete and access-control behavior before production use.
