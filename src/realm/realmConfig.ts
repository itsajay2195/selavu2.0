import Realm from 'realm';
import {schemas} from './schemas/index'; // or './index'

const realmConfig = {
  schema: schemas, // Now it's an array ✅
  schemaVersion: 1,
};

let realmInstance: Realm | null = null;

export async function getRealm(): Promise<Realm> {
  if (!realmInstance) {
    realmInstance = await Realm.open(realmConfig);
  }
  return realmInstance;
}

export function closeRealm(): void {
  if (realmInstance && !realmInstance.isClosed) {
    realmInstance.close();
    realmInstance = null;
  }
}
