import type { CollectionConfig } from 'payload'

/**
 * Public users may register as Farmer, Agronomist, or Business.
 * Admin accounts live in a separate collection and can never be created here.
 * A user's role can only be changed later by an administrator.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
    useSessions: true,
  },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'role', 'createdAt'],
  },
  access: {
    create: ({ req }) => !req.user || req.user.collection === 'admins',
    read: ({ req }) => {
      if (req.user?.collection === 'admins') return true
      if (req.user?.collection !== 'users') return false
      return { id: { equals: req.user.id } }
    },
    update: ({ req }) => {
      if (req.user?.collection === 'admins') return true
      if (req.user?.collection !== 'users') return false
      return { id: { equals: req.user.id } }
    },
    delete: ({ req }) => req.user?.collection === 'admins',
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, req }) => {
        if (!data || req.user?.collection === 'admins') return data

        // Accept only the three public account types at registration.
        // Invalid or missing values safely fall back to Farmer.
        if (operation === 'create') {
          const allowedRoles = ['farmer', 'agronomist', 'business'] as const
          const selectedRole = String(data.role ?? 'farmer').toLowerCase()
          const role = allowedRoles.includes(selectedRole as (typeof allowedRoles)[number])
            ? selectedRole
            : 'farmer'

          return {
            ...data,
            role,
          }
        }

        // Role changes are blocked by field-level access on ordinary user updates.
        return data
      },
    ],
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      unique: true,
      admin: {
        description: 'Optional contact number, including country code (e.g. +8801XXXXXXXXX).',
      },
    },
    {
      name: 'requestedRole',
      type: 'select',
      required: true,
      defaultValue: 'farmer',
      options: [
        { label: 'Farmer', value: 'farmer' },
        { label: 'Agronomist', value: 'agronomist' },
        { label: 'Business', value: 'business' },
      ],
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'farmer',
      access: {
        create: ({ req }) => !req.user || req.user.collection === 'admins',
        update: ({ req }) => req.user?.collection === 'admins',
      },
      options: [
        { label: 'Farmer', value: 'farmer' },
        { label: 'Agronomist', value: 'agronomist' },
        { label: 'Business', value: 'business' },
      ],
    },
    {
      name: 'location',
      type: 'text',
    },
  ],
}
