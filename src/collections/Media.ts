import type { CollectionConfig } from 'payload'

import { createFolderField, createTagField } from 'payload'

const isPayloadAdmin = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === 'admins'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    // Public pages may display uploaded assets, but only administrators can
    // upload, replace, or delete files through the CMS API.
    read: () => true,
    create: isPayloadAdmin,
    update: isPayloadAdmin,
    delete: isPayloadAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    createFolderField({ relationTo: 'folders' }),
    createTagField({ relationTo: 'tags' }),
  ],
  upload: true,
}
