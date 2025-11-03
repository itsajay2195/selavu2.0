// src/utils/parsers/transactionParser.ts

import {categorizeTransaction} from '../categorizer';
import {SMS_TYPES} from '../smsClassifier';

const BANK_PATTERNS = {
  ICICI: {
    // Handles: "ICICI Bank Acct XX929 debited for Rs 15.00"
    debit:
      /(?:ICICI Bank|ICICI).*?(?:debited|withdrawn).*?Rs\.?\s*([\d,]+\.?\d*)/i,
    credit: /(?:ICICI Bank|ICICI).*?credited.*?Rs\.?\s*([\d,]+\.?\d*)/i,
    merchant: /(?:to|at|;)\s*(.+?)(?:\s+credited|\.|\s+UPI)/i,
  },

  HDFC: {
    debit: /Rs\.?\s*([\d,]+\.?\d*).*?debited.*?HDFC/i,
    credit: /Rs\.?\s*([\d,]+\.?\d*).*?credited.*?HDFC/i,
    merchant: /(?:to|at)\s+(.+?)\./i,
  },

  SBI: {
    debit: /Rs\.?\s*([\d,]+\.?\d*).*?debited.*?SBI/i,
    credit: /Rs\.?\s*([\d,]+\.?\d*).*?credited.*?SBI/i,
    merchant: /(?:to|at)\s+(.+?)\./i,
  },

  YESBANK: {
    debit: /INR\s*([\d,]+\.?\d*).*?debited.*?YES BANK/i,
    credit: /INR\s*([\d,]+\.?\d*).*?credited.*?YES BANK/i,
    merchant: /(?:ACH|NEFT|IMPS|UPI).*?-(.+?)(?:\s+MUT|$)/i,
  },

  // Generic pattern (fallback)
  GENERIC: {
    debit:
      /(?:debited|spent|paid|withdrawn).*?(?:Rs\.?|INR|₹)\s*([\d,]+\.?\d*)/i,
    credit:
      /(?:credited|received|deposited).*?(?:Rs\.?|INR|₹)\s*([\d,]+\.?\d*)/i,
    merchant: /(?:to|from|at)\s+(.+?)(?:\.|UPI|credited|debited|$)/i,
  },
};

export function parseTransaction(body: string, smsType: SMS_TYPES): any | null {
  const isCredit = smsType === SMS_TYPES.TRANSACTION_CREDIT;

  // Try each bank pattern
  for (const [bank, patterns] of Object.entries(BANK_PATTERNS)) {
    const pattern = isCredit ? patterns.credit : patterns.debit;
    const match = body.match(pattern);

    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));

      // Extract merchant name
      let merchant = 'Unknown';
      const merchantMatch = body.match(patterns.merchant);
      if (merchantMatch) {
        merchant = merchantMatch[1]
          .trim()
          .replace(/credited/gi, '')
          .replace(/debited/gi, '')
          .trim();
      }

      // If still unknown, try to extract from common patterns
      if (merchant === 'Unknown' || merchant.length < 2) {
        if (isCredit) {
          // For credits, look for "from X"
          const fromMatch = body.match(/from\s+(.+?)(?:\.|UPI|$)/i);
          if (fromMatch) merchant = fromMatch[1].trim();
        } else {
          // For debits, look for merchant after semicolon or "to"
          const toMatch = body.match(/;\s*(.+?)\s+credited/i);
          if (toMatch) merchant = toMatch[1].trim();
        }
      }

      return {
        amount,
        merchant: cleanMerchantName(merchant),
        date: new Date(),
        type: isCredit ? 'credit' : 'debit',
        category: categorizeTransaction(merchant, body),
        bank,
      };
    }
  }

  return null;
}

// Clean up merchant names
function cleanMerchantName(name: string): string {
  return name
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .replace(/credited/gi, '') // Remove 'credited'
    .replace(/debited/gi, '') // Remove 'debited'
    .replace(/UPI:.*/i, '') // Remove UPI ref
    .replace(/Call.*/i, '') // Remove phone numbers
    .replace(/SMS.*/i, '') // Remove SMS instructions
    .trim()
    .slice(0, 50); // Max 50 chars
}
