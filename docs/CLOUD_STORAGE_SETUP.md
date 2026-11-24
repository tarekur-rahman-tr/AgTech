# AgTech file storage setup (Cloudflare R2)

AgTech keeps structured records in Neon PostgreSQL. Uploaded binary files (product photos, profile images, article images, and PDFs) should live in persistent object storage rather than the application server's local filesystem.

## Chosen architecture

- **Neon PostgreSQL:** users, roles, listings, article records, inquiries, consultation requests, and media metadata.
- **Cloudflare R2:** uploaded file bytes.
- **Payload Media collection:** remains the upload API and records the file metadata and uploader relationship.

Cloudflare R2 is selected because it provides an S3-compatible API and Payload has an official S3 storage adapter. The app is a normal Node.js/Next.js application, so use the S3-compatible adapter rather than the Cloudflare Workers-only R2 binding.

## Cloudflare setup required

1. Create or sign in to a Cloudflare account.
2. Open **R2 Object Storage** and create a bucket named `agtech-media` (or another unique bucket name).
3. In R2, create an S3 API token with access limited to this bucket. Keep the Access Key ID and Secret Access Key private.
4. Note the account's S3 endpoint, in the form `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`.
5. Do not enable public bucket access just to make uploads work. AgTech should serve files through Payload so its collection access rules remain in effect.

## Environment variables (local and deployment)

After creating the bucket and token, add these values to the local `.env.local` and the deployment platform's server-side environment settings. Never commit actual credentials:

```env
R2_BUCKET=agtech-media
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_REGION=auto
```

Do not paste access keys into GitHub, source files, or chat.

## Application integration status

The repository currently has a Payload `Media` upload collection and the Payload cloud-storage foundation package, but it does not yet have an S3/R2 adapter configured. The adapter dependency and Payload top-level storage configuration must be added together, with a matching lockfile update and a local typecheck/build.

Do not enable cloud storage until the bucket and credentials exist. Keep local development storage available when the R2 variables are absent; once configured, route Media uploads to R2 and disable local storage for that collection.

## Verification checklist

- [ ] Install a Payload v4-compatible `@payloadcms/storage-s3` version matching the repository's Payload beta line.
- [ ] Configure the adapter under Payload's top-level `storage` setting for the `media` collection, using the R2 endpoint, `region: 'auto'`, and the bucket credentials.
- [ ] Keep Payload's access-control proxy enabled; do not bypass collection read access for private media.
- [ ] Upload a test image as a Farmer and confirm the Media record stores the uploader.
- [ ] Confirm the file remains available after restarting the app.
- [ ] Confirm another signed-in user cannot edit or delete the first user's media.
- [ ] Confirm an Admin can manage media.
- [ ] Test production deployment with the same server-side environment variables before enabling real user uploads.
