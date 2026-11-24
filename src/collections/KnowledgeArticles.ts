import type { Access, CollectionConfig, Where } from 'payload'

const isAdmin = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === 'admins'

const canManageArticles: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection !== 'users') return false
  const where: Where = { author: { equals: req.user.id } }
  return where
}

export const KnowledgeArticles: CollectionConfig = {
  slug: 'knowledge-articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', 'status', 'updatedAt'],
    group: 'Knowledge Hub',
  },
  access: {
    create: ({ req }) => req.user?.collection === 'admins' || req.user?.collection === 'users',
    read: ({ req }) => {
      if (req.user?.collection === 'admins') return true
      const where: Where = { status: { equals: 'published' } }
      return where
    },
    update: canManageArticles,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, req }) => {
        if (!data || operation !== 'create') return data
        if (req.user?.collection === 'users') {
          return { ...data, author: req.user.id, status: 'published' }
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true, maxLength: 160 },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'excerpt', type: 'textarea', required: true, maxLength: 500 },
    { name: 'content', type: 'textarea', required: true, maxLength: 12000 },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Crop health', value: 'crop-health' },
        { label: 'Soil and nutrition', value: 'soil' },
        { label: 'Pest management', value: 'pests' },
        { label: 'Cultivation guide', value: 'cultivation' },
        { label: 'Technology', value: 'technology' },
        { label: 'Market advice', value: 'market' },
      ],
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      access: { update: ({ req }) => req.user?.collection === 'admins' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      access: {
        create: () => true,
        update: isAdmin,
      },
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
