import type { Access, CollectionConfig } from 'payload'

const isPayloadAdmin: Access = ({ req }) => req.user?.collection === 'admins'

export const Tags: CollectionConfig = {
  slug: 'tags',
  access: {
    create: isPayloadAdmin,
    read: isPayloadAdmin,
    update: isPayloadAdmin,
    delete: isPayloadAdmin,
  },
  admin: {
    useAsTitle: 'name',
  },
  tags: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
