export const OfferSchema = {
  name: 'Offer',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    brand: 'string',
    title: 'string',
    code: 'string?',
    category: 'string',
    expiryDate: 'date?',
    isExpired: 'bool',
    rawSMS: 'string',
    createdAt: 'date',
  },
};
