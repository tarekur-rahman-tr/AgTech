import type { Access, CollectionConfig, Where } from 'payload'

const isAdmin = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === 'admins'

const canManageOwnListing: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection !== 'users') return false
  const where: Where = { seller: { equals: req.user.id } }
  return where
}

export const MarketplaceListings: CollectionConfig = {
  slug: 'marketplace-listings',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'price', 'location', 'status', 'createdAt'],
    group: 'Marketplace',
  },
  access: {
    create: ({ req }) => req.user?.collection === 'users' || req.user?.collection === 'admins',
    read: ({ req }) => {
      if (req.user?.collection === 'admins') return true
      if (req.user?.collection === 'users') {
        const conditions: Where[] = [
          { status: { equals: 'active' } },
          { seller: { equals: req.user.id } },
        ]
        return { or: conditions }
      }
      const where: Where = { status: { equals: 'active' } }
      return where
    },
    update: canManageOwnListing,
    delete: canManageOwnListing,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, req }) => {
        if (!data || operation !== 'create') return data
        if (req.user?.collection === 'users') {
          return {
            ...data,
            seller: req.user.id,
            status: 'active',
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      maxLength: 3000,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Crops and produce', value: 'produce' },
        { label: 'Seeds', value: 'seeds' },
        { label: 'Fertilizer and inputs', value: 'inputs' },
        { label: 'Farm equipment', value: 'equipment' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: { description: 'Price in Bangladeshi Taka (BDT).' },
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'unit',
      type: 'select',
      required: true,
      options: [
        { label: 'Kilogram', value: 'kg' },
        { label: 'Metric ton', value: 'ton' },
        { label: 'Piece', value: 'piece' },
        { label: 'Bag', value: 'bag' },
        { label: 'Litre', value: 'litre' },
      ],
    },
    {
      name: 'location',
      type: 'text',
      required: true,
    },
    {
      name: 'contactPhone',
      type: 'text',
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 5,
    },
    {
      name: 'seller',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      access: { update: isAdmin },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      access: {
        create: () => true,
        update: isAdmin,
      },
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Sold', value: 'sold' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
