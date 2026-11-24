import type { Access, CollectionConfig } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'

const canManageOwnListing: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection !== 'users') return false
  return { seller: { equals: req.user.id } }
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
        return {
          or: [
            { status: { equals: 'active' } },
            { seller: { equals: req.user.id } },
          ],
        }
      }
      return { status: { equals: 'active' } }
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
            status: 'pending',
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
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      access: {
        create: isAdmin,
        update: isAdmin,
      },
      options: [
        { label: 'Pending review', value: 'pending' },
        { label: 'Active', value: 'active' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Sold', value: 'sold' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
