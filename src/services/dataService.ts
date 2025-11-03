import {getRealm} from '../realm/realmConfig';

export async function getThisMonthSpending(): Promise<number> {
  const realm = await getRealm();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const transactions = realm
    .objects('Transaction')
    .filtered('type = "debit" AND date >= $0', startOfMonth);

  return transactions.sum('amount');
}

export async function getRecentTransactions(limit: number = 10) {
  const realm = await getRealm();

  return realm.objects('Transaction').sorted('date', true).slice(0, limit);
}

export async function getTransactionsByCategory() {
  const realm = await getRealm();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const transactions = realm
    .objects('Transaction')
    .filtered('type = "debit" AND date >= $0', startOfMonth);

  // Group by category
  const grouped: Record<string, number> = {};
  transactions.forEach((t: any) => {
    if (!grouped[t.category]) {
      grouped[t.category] = 0;
    }
    grouped[t.category] += t.amount;
  });

  return grouped;
}
