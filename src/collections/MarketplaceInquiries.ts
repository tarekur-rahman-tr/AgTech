import { APIError, type Access, type CollectionConfig, type Where } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'

const canReadInquiry: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection !== 'users') return false
  const conditions: Where[] = [
    { buyer: { equals: req.user.id } },
    { seller: { equals: req.user.id } },
  ]
  return { or: conditions }
}

const canUpdateInquiry: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection !== 'users') return false
  return { seller: { equals: req.user.id } }
}

export const MarketplaceInquiries: CollectionConfig = {
  slug: 'marketplace-inquiries',
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['listing', 'buyer', 'seller', 'status', 'createdAt'],
    group: 'Marketplace',
  },
  access: {
    create: ({ req }) => req.user?.collection === 'users',
    read: canReadInquiry,
    update: canUpdateInquiry,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (!data || operation !== 'create' || req.user?.collection !== 'users') return data
        if (!data.listing) throw new APIError('Choose a marketplace listing.', 400)

        const listing = await req.payload.findByID({
          collection: 'marketplace-listings',
          id: data.listing as number | string,
          depth: 0,
          overrideAccess: true,
        })

        if (listing.status !== 'active') {
          throw new APIError('This listing is no longer available.', 400)
        }

        const seller =
          typeof listing.seller === 'object' && listing.seller
            ? listing.seller.id
            : listing.seller

        if (String(seller) === String(req.user.id)) {
          throw new APIError('You cannot send an inquiry about your own listing.', 400)
        }

        return {
          ...data,
          buyer: req.user.id,
          seller,
          status: 'new',
        }
      },
    ],
  },
  fields: [
    {
      name: 'listing',
      type: 'relationship',
      relationTo: 'marketplace-listings',
      required: true,
      access: { update: ({ req }) => req.user?.collection === 'admins' },
    },
    {
      name: 'buyer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      access: { update: ({ req }) => req.user?.collection === 'admins' },
    },
    {
      name: 'seller',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      access: { update: ({ req }) => req.user?.collection === 'admins' },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 3000,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      access: {
        create: () => true,
        update: ({ req }) => req.user?.collection === 'admins' || req.user?.collection === 'users',
      },
      options: [
        { label: 'New', value: 'new' },
        { label: 'Responded', value: 'responded' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
