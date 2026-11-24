import path from 'path'
import { createHash } from 'node:crypto'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildFigmaConfig } from '@payloadcms/figma'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { en as adminLanguage } from '@payloadcms/translations/languages/en'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { Admins } from './collections/Admins'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Folders } from './collections/Folders'
import { Tags } from './collections/Tags'
import { MarketplaceListings } from './collections/MarketplaceListings'
import { MarketplaceInquiries } from './collections/MarketplaceInquiries'
import { KnowledgeArticles } from './collections/KnowledgeArticles'
import { ConsultationRequests } from './collections/ConsultationRequests'
import { WeatherAlerts } from './collections/WeatherAlerts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseURL = process.env.DATABASE_URL
if (!databaseURL) {
  throw new Error('DATABASE_URL is missing. Add your Neon PostgreSQL connection string to .env.local.')
}

if (process.env.NODE_ENV === 'production' && !process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET is required in production. Set a long, random secret in your deployment environment.')
}

const payloadConfig = {
  secret: process.env.PAYLOAD_SECRET || 'agtech-local-development-secret-change-before-production',
  db: postgresAdapter({
    pool: {
      connectionString: databaseURL,
    },
  }),
  admin: {
    user: Admins.slug,
    constrainWidth: true,
    dashboard: {
      widgets: [],
      defaultLayout: [
        { widgetSlug: 'activity' as const, width: 'full' as const },
        { widgetSlug: 'collections' as const, width: 'full' as const },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    fallbackLanguage: 'en' as const,
    supportedLanguages: { en: adminLanguage },
  },
  collections: [Admins, Users, Media, Folders, Tags, MarketplaceListings, MarketplaceInquiries, KnowledgeArticles, ConsultationRequests, WeatherAlerts],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: [{ code: 'en', label: 'English' }],
    fallback: true,
    defaultLocale: 'en',
  },
  endpoints: [
    {
      path: '/cloudinary/signature',
      method: 'post',
      handler: async (req) => {
        const user = req.user as (typeof req.user & { collection?: string }) | null | undefined
        if (!user || !['users', 'admins'].includes(user.collection || '')) {
          return Response.json({ error: 'Authentication required.' }, { status: 401 })
        }

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME
        const apiKey = process.env.CLOUDINARY_API_KEY
        const apiSecret = process.env.CLOUDINARY_API_SECRET
        if (!cloudName || !apiKey || !apiSecret) {
          return Response.json({ error: 'Cloudinary is not configured on the server.' }, { status: 503 })
        }

        const timestamp = Math.floor(Date.now() / 1000)
        const folder = `agtech/users/${String(user.id)}`
        const signedParams = { folder, timestamp }
        const signatureBase = Object.entries(signedParams)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, value]) => `${key}=${value}`)
          .join('&')
        const signature = createHash('sha1')
          .update(`${signatureBase}${apiSecret}`)
          .digest('hex')

        return Response.json({ cloudName, apiKey, timestamp, folder, signature })
      },
    },
  ],
  plugins: [mcpPlugin({})],
}

// Keep the Figma Make wrapper when its environment is available. A normal
// local/production deployment uses Payload's standard config and does not
// require a Figma environment ID.
export default process.env.FIGMA_EID
  ? buildFigmaConfig({ ...payloadConfig, figma: {} })
  : buildConfig(payloadConfig)
