import {v4 as uuidv4} from 'uuid';
import {getRealm} from '../realm/realmConfig';
import {classifyText, ensureOnnxReady, _aiDebug} from '../onnx/onnxManager';
import {extractAccountNumber, extractAmount} from '../utils/smsutils';

const CONF = 0.6;

export async function processAllSmsAI(
  messages: {
    _id?: any;
    body: string;
    address: string;
    date: number;
    date_sent: number;
  }[],
) {
  await ensureOnnxReady();
  _aiDebug();
  const pool = 4;
  let idx = 0;
  const data: any[] = [];

  async function worker() {
    while (idx < messages.length) {
      const i = idx++;
      const sms = messages[i];
      try {
        const ai = await classifyText(sms.body);
        const category = ai.categoryProb >= CONF ? ai.category : 'unknown';
        const intent = ai.intentProb >= CONF ? ai.intent : 'other';
        const isTransaction = intent === 'debit' || intent === 'credit';
        const amount = isTransaction ? extractAmount(sms.body) : 0;
        const accountNumber = isTransaction
          ? extractAccountNumber(sms.body)
          : '';

        data.push({
          category,
          intent,
          p: ai.categoryProb.toFixed(2),
          q: ai.intentProb.toFixed(2),
          isTransaction,
          amount: amount,
          sender: sms.address,
          date_sent: sms.date_sent,
          body: sms.body,
          accountNumber,
        });
      } catch (e) {
        console.warn('AI fail', e);
      }
    }
  }

  // ⭐ Wait for all workers to complete
  await Promise.all(Array.from({length: pool}, () => worker()));

  // ⭐ Now filter and log AFTER all processing is done
  const filteredData = data?.filter(
    (item: any) => item?.intent === 'debit' || item?.intent === 'credit',
  );

  console.log('Total messages processed:', data.length);
  console.log('Total transactions:', filteredData.length);
  console.log('Transactions:', JSON.stringify(filteredData, null, 3));

  // ⭐ Return the filtered data
  return {
    transactions: filteredData,
    others: data?.filter(
      (item: any) => item?.intent !== 'debit' || item?.intent !== 'credit',
    ),
  };
}
async function saveTransaction(data: any, rawSMS: string, timestamp: number) {
  const realm = await getRealm();

  try {
    realm.write(() => {
      realm.create('Transaction', {
        _id: uuidv4(),
        amount: data.amount,
        type: data.type,
        category: data.category,
        merchant: data.merchant,
        date: new Date(timestamp),
        bank: data.bank,
        balance: data.balance,
        rawSMS: rawSMS,
        createdAt: new Date(),
      });
    });
    console.log(`Saved transaction: ${data.merchant} - ₹${data.amount}`);
  } catch (error) {
    console.error('Error saving transaction:', error);
  }
}
