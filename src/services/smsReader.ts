import SmsAndroid from 'react-native-get-sms-android';

export interface SMSMessage {
  _id: string;
  address: string;
  body: string;
  date: number;
  read: number;
}

export async function readSmsFromDevice(
  days: number = 90,
): Promise<SMSMessage[]> {
  const filter = {
    box: 'inbox',
    minDate: Date.now() - days * 24 * 60 * 60 * 1000,
    maxCount: 1000, // Limit to prevent overload
  };

  return new Promise((resolve, reject) => {
    SmsAndroid.list(
      JSON.stringify(filter),
      (fail: any) => {
        console.error('Failed to read SMS:', fail);
        reject(fail);
      },
      (count: any, smsList: any) => {
        const messages: SMSMessage[] = JSON.parse(smsList);
        console.log(`Read ${count} SMS messages`);
        // console.log(JSON.stringify(messages, null, 3));
        resolve(messages);
      },
    );
  });
}

// // Check if SMS permission is granted
// export async function checkSMSPermission(): Promise<boolean> {
//   return new Promise(resolve => {
//     SmsAndroid.checkPermission(hasPermission => {
//       resolve(hasPermission);
//     });
//   });
// }

// Request SMS permission
// export async function requestSMSPermission(): Promise<boolean> {
//   return new Promise(resolve => {
//     SmsAndroid.requestPermission(hasPermission => {
//       resolve(hasPermission);
//     });
//   });
// }
