export function extractAmount(text: string): number | null {
  if (!text) return null;

  // Pattern: "INR 3,022.00" or "Rs 3,022.00" or "₹3,022.00"
  const pattern =
    /(?:INR|Rs\.?|₹)\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i;
  const match = text.match(pattern);

  if (match && match[1]) {
    // Remove commas and parse to number
    const amountStr = match[1].replace(/,/g, '');
    const amount = parseFloat(amountStr);
    return isNaN(amount) ? null : amount;
  }

  return null;
}

export function extractAccountNumber(text: string): string | null {
  if (!text) return null;

  // Pattern 1: "Ac XX929" or "Acct XX929" or "A/c X2861"
  const pattern1 = /(?:Ac(?:ct)?|A\/c)\s*([X\d]{4,})/i;
  const match1 = text.match(pattern1);

  if (match1 && match1[1]) {
    return match1[1];
  }

  // Pattern 2: Look for "XX" followed by digits (common masked format)
  const pattern2 = /\b(XX?\d{3,4})\b/i;
  const match2 = text.match(pattern2);

  if (match2 && match2[1]) {
    return match2[1];
  }

  return null;
}
