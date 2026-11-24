import type { Access, CollectionConfig } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'

export const WeatherAlerts: CollectionConfig = {
  slug: 'weather-alerts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'district', 'severity', 'status', 'startsAt', 'endsAt'],
    group: 'Weather Intelligence',
  },
  access: {
    create: isAdmin,
    read: ({ req }) =>
      req.user?.collection === 'admins' ? true : { status: { equals: 'active' } },
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'title', type: 'text', required: true, maxLength: 160 },
    { name: 'message', type: 'textarea', required: true, maxLength: 3000 },
    { name: 'district', type: 'text', required: true, index: true },
    {
      name: 'severity',
      type: 'select',
      required: true,
      options: [
        { label: 'Information', value: 'info' },
        { label: 'Advisory', value: 'advisory' },
        { label: 'Warning', value: 'warning' },
        { label: 'Emergency', value: 'emergency' },
      ],
    },
    { name: 'startsAt', type: 'date', required: true },
    { name: 'endsAt', type: 'date', required: true },
    { name: 'farmAdvice', type: 'textarea', required: true, maxLength: 3000 },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Expired', value: 'expired' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
