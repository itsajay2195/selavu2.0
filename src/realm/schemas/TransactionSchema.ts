export const TransactionSchema = {
  name: 'Transaction',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    amount: 'double',
    type: 'string', // 'debit' or 'credit'
    category: 'string',
    merchant: 'string',
    date: 'date',
    bank: 'string?',
    balance: 'double?',
    rawSMS: 'string',
    createdAt: 'date',
  },
};
