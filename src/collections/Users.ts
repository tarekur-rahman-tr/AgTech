import { APIError, type CollectionConfig } from 'payload'

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
    defaultColumns: ['fullName', 'email', 'role', 'status', 'createdAt'],
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
    beforeLogin: [
      ({ user }) => {
        // Public accounts can use AgTech immediately. Only suspended accounts are blocked.
        const status = (user as { status?: string }).status
        if (status === 'suspended') {
          throw new APIError('This AgTech account has been suspended. Contact the administrator.', 403)
        }
        return user
      },
    ],
    beforeValidate: [
      ({ data, operation, req }) => {
        if (!data || req.user?.collection === 'admins') return data

        // Accept only the three public account types at registration.
        // Invalid or missing values safely fall back to Farmer.
        if (operation === 'create') {
          const allowedRoles = ['farmer', 'agronomist', 'business'] as const
          const selectedRole = String(data.role ?? 'farmer').toLowerCase()
          const role = allowedRoles.find((allowedRole) => allowedRole === selectedRole) ?? 'farmer'

          return {
            ...data,
            role,
            // Public signup is open: no administrator approval is required.
            status: 'approved',
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
      admin: {
        hidden: true,
        description: 'Legacy field retained for existing records. New registrations use role directly.',
      },
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
      admin: {
        description: 'Selected during registration. Only administrators can change this account role.',
      },
      options: [
        { label: 'Farmer', value: 'farmer' },
        { label: 'Agronomist', value: 'agronomist' },
        { label: 'Business', value: 'business' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'approved',
      access: {
        create: ({ req }) => req.user?.collection === 'admins',
        update: ({ req }) => req.user?.collection === 'admins',
      },
      admin: {
        description: 'Public accounts are approved automatically. Admins may suspend accounts here.',
        position: 'sidebar',
      },
      options: [
        { label: 'Approved', value: 'approved' },
        { label: 'Suspended', value: 'suspended' },
      ],
    },
    {
      name: 'location',
      type: 'text',
    },
    // Private, short-lived password recovery state. These fields are only
    // read/written by the server-side recovery route.
    {
      name: 'resetOtpHash',
      type: 'text',
      admin: { hidden: true },
      access: { create: () => false, read: () => false, update: () => false },
    },
    {
      name: 'resetOtpExpiresAt',
      type: 'date',
      admin: { hidden: true },
      access: { create: () => false, read: () => false, update: () => false },
    },
    {
      name: 'resetOtpLastSentAt',
      type: 'date',
      admin: { hidden: true },
      access: { create: () => false, read: () => false, update: () => false },
    },
    {
      name: 'resetOtpPayloadToken',
      type: 'text',
      admin: { hidden: true },
      access: { create: () => false, read: () => false, update: () => false },
    },
    {
      name: 'resetOtpAttempts',
      type: 'number',
      admin: { hidden: true },
      access: { create: () => false, read: () => false, update: () => false },
    },
  ],
}
