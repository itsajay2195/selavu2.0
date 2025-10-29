import {createMMKV} from 'react-native-mmkv';

const KEYS = {
  ONBOARDING_COMPLETED: 'onboarding_completed',
  SMS_PERMISSION_GRANTED: 'sms_permission_granted',
  BUDGET_SET: 'budget_set',
};

export const onboardStorage = createMMKV();
export const Storage = {
  // Onboarding
  setOnboardingCompleted() {
    onboardStorage.set(KEYS.ONBOARDING_COMPLETED, 'true');
  },

  isOnboardingCompleted() {
    const value = onboardStorage.getString(KEYS.ONBOARDING_COMPLETED);
    return value === 'true';
  },

  // SMS Permission
  setSMSPermissionGranted(granted: any) {
    onboardStorage.set(KEYS.SMS_PERMISSION_GRANTED, granted ? 'true' : 'false');
  },

  isSMSPermissionGranted() {
    const value = onboardStorage.getString(KEYS.SMS_PERMISSION_GRANTED);
    return value === 'true';
  },

  // Budget
  setBudget(amount: any) {
    onboardStorage.set(KEYS.BUDGET_SET, amount.toString());
  },

  getBudget() {
    const value = onboardStorage.getString(KEYS.BUDGET_SET);
    return value ? parseFloat(value) : null;
  },

  // Clear all data (for testing/reset)
  clearAll() {
    onboardStorage.clearAll();
  },
};
