import type { Access, CollectionConfig } from 'payload'

import { createFolderField, createTagField } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'

const canManageOwnMedia: Access = ({ req }) => {
  if (isAdmin({ req })) return true
  if (req.user?.collection !== 'users') return false
  return { uploadedBy: { equals: req.user.id } }
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    // Public pages may display uploaded assets. Signed-in users may upload
    // media for their own listings, questions, and articles.
    read: () => true,
    create: ({ req }) => req.user?.collection === 'users' || req.user?.collection === 'admins',
    update: canManageOwnMedia,
    delete: canManageOwnMedia,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, req }) => {
        if (!data || operation !== 'create' || req.user?.collection !== 'users') return data
        return { ...data, uploadedBy: req.user.id }
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      index: true,
      access: {
        update: isAdmin,
      },
      admin: {
        position: 'sidebar',
        description: 'Account that uploaded this file.',
      },
    },
    createFolderField({ relationTo: 'folders' }),
    createTagField({ relationTo: 'tags' }),
  ],
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
}
