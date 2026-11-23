import { getPayload } from 'payload'
import config from '../payload.config'

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
const password = process.env.ADMIN_PASSWORD

if (!email || !password) {
  throw new Error(
    'Set ADMIN_EMAIL and ADMIN_PASSWORD in your local environment before running pnpm admin:create.',
  )
}

if (password.length < 12) {
  throw new Error('Use an administrator password with at least 12 characters.')
}

const payload = await getPayload({ config })

const existingAdmin = await payload.find({
  collection: 'admins',
  where: {
    email: {
      equals: email,
    },
  },
  limit: 1,
  overrideAccess: true,
})

if (existingAdmin.docs.length > 0) {
  payload.logger.info(`An administrator account already exists for ${email}. No changes made.`)
} else {
  await payload.create({
    collection: 'admins',
    data: {
      email,
      password,
    },
    overrideAccess: true,
  })

  payload.logger.info(`Administrator account created for ${email}.`)
}
