import type { CollectionConfig } from 'payload'

/**
 * Public accounts can register, but they cannot grant themselves a privileged
 * role. New accounts are created as farmers; an administrator can approve
 * their requested role from the Payload admin panel.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
    useSessions: true,
  },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'role', 'requestedRole', 'createdAt'],
  },
  access: {
    create: () => true,
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

        // Force the farmer role only at public account creation.
        // Do not overwrite an administrator-approved role on later profile updates.
        if (operation === 'create') {
          return {
            ...data,
            role: 'farmer',
          }
        }

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
        create: ({ req }) => req.user?.collection === 'admins',
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
