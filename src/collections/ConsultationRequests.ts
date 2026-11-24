import type { Access, CollectionConfig } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'

const canReadRequest: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection !== 'users') return false
  if (req.user.role === 'agronomist') {
    return {
      or: [
        { assignedAgronomist: { equals: req.user.id } },
        { status: { equals: 'open' } },
      ],
    }
  }
  return { farmer: { equals: req.user.id } }
}

const canUpdateRequest: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection !== 'users' || req.user.role !== 'agronomist') return false
  return {
    or: [
      { assignedAgronomist: { equals: req.user.id } },
      { status: { equals: 'open' } },
    ],
  }
}

export const ConsultationRequests: CollectionConfig = {
  slug: 'consultation-requests',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'farmer', 'assignedAgronomist', 'status', 'createdAt'],
    group: 'Agronomist Support',
  },
  access: {
    create: ({ req }) => req.user?.collection === 'users',
    read: canReadRequest,
    update: canUpdateRequest,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, req }) => {
        if (!data || operation !== 'create') return data
        if (req.user?.collection === 'users') {
          return {
            ...data,
            farmer: req.user.id,
            status: 'open',
          }
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'subject', type: 'text', required: true, maxLength: 160 },
    { name: 'question', type: 'textarea', required: true, maxLength: 5000 },
    { name: 'crop', type: 'text' },
    { name: 'location', type: 'text' },
    { name: 'attachment', type: 'upload', relationTo: 'media' },
    {
      name: 'farmer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'assignedAgronomist',
      type: 'relationship',
      relationTo: 'users',
      access: { update: isAdmin },
      admin: { position: 'sidebar' },
      filterOptions: { role: { equals: 'agronomist' } },
    },
    {
      name: 'answer',
      type: 'textarea',
      maxLength: 5000,
      access: { update: canUpdateRequest },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      access: { create: () => true, update: canUpdateRequest },
      options: [
        { label: 'Open', value: 'open' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Answered', value: 'answered' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
