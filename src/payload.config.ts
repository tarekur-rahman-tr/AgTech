import path from 'path'
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
        { widgetSlug: 'activity', width: 'full' as const },
        { widgetSlug: 'collections', width: 'full' as const },
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
  collections: [Admins, Users, Media, Folders, Tags],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: [{ code: 'en', label: 'English' }],
    fallback: true,
    defaultLocale: 'en',
  },
  plugins: [mcpPlugin({})],
}

// Keep the Figma Make wrapper when its environment is available. A normal
// local/production deployment uses Payload's standard config and does not
// require a Figma environment ID.
export default process.env.FIGMA_EID
  ? buildFigmaConfig({ ...payloadConfig, figma: {} })
  : buildConfig(payloadConfig)
