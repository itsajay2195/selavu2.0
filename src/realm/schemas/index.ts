import {BillSchema} from './BillSchema';
import {OfferSchema} from './OfferSchema';
import {TransactionSchema} from './TransactionSchema';

// Export as array for Realm config
export const schemas = [TransactionSchema, BillSchema, OfferSchema];

// Optional: Export individual schemas too
export {TransactionSchema, BillSchema, OfferSchema};
