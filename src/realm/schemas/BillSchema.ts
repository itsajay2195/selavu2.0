export const BillSchema = {
  name: 'Bill',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    amount: 'double',
    dueDate: 'date',
    status: 'string', // 'pending', 'paid', 'overdue'
    category: 'string',
    reminderEnabled: 'bool',
    rawSMS: 'string',
    createdAt: 'date',
  },
};
