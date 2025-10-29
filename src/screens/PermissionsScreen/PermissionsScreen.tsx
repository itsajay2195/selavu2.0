import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../../theme';
import InfoItem from './components/InfoItem';

const PermissionsScreen = ({navigation}: any) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const requestSMSPermission = async () => {
    if (Platform.OS !== 'android') {
      Alert.alert(
        'iOS Not Supported',
        'SMS reading is only available on Android devices.',
      );
      return;
    }

    setIsRequesting(true);

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'SMS Permission Required',
          message:
            'Selavu needs to read your SMS to automatically track expenses from bank messages.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Allow',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('SMS permission granted');
        // Navigate to loading/scanning screen
        navigation.navigate('Dashboard');
      } else {
        console.log('SMS permission denied');
        Alert.alert(
          'Permission Denied',
          'Selavu needs SMS permission to work. You can enable it later in Settings.',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Try Again', onPress: () => requestSMSPermission()},
          ],
        );
      }
    } catch (err) {
      console.warn(err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="shield-checkmark" size={48} color={colors.primary[500]} />
        </View>
        <Text style={styles.title}>SMS Permission</Text>
        <Text style={styles.subtitle}>
          We need to read your SMS to auto-track expenses
        </Text>
      </View>

      {/* What We Do Section */}
      <View style={styles.section}>
        <View style={styles.infoBox}>
          <View style={styles.infoHeader}>
            <Icon name="checkmark-circle" size={28} color="#15803d" />
            <Text style={styles.infoTitle}>What we do</Text>
          </View>
          <View style={styles.infoList}>
            <InfoItem
              icon="receipt-outline"
              text="Read bank transaction SMS"
              color="#15803d"
            />
            <InfoItem
              icon="notifications-outline"
              text="Parse bill reminders"
              color="#15803d"
            />
            <InfoItem
              icon="pricetag-outline"
              text="Organize offers automatically"
              color="#15803d"
            />
            <InfoItem
              icon="lock-closed-outline"
              text="Store everything on your device only"
              color="#15803d"
            />
          </View>
        </View>
      </View>

      {/* What We Don't Do Section */}
      <View style={styles.section}>
        <View style={[styles.infoBox, styles.dontBox]}>
          <View style={styles.infoHeader}>
            <Icon name="close-circle" size={28} color="#dc2626" />
            <Text style={styles.infoTitle}>What we DON'T do</Text>
          </View>
          <View style={styles.infoList}>
            <InfoItem
              icon="cloud-upload-outline"
              text="Never upload SMS to servers"
              color="#dc2626"
            />
            <InfoItem
              icon="chatbubble-outline"
              text="Never read personal messages"
              color="#dc2626"
            />
            <InfoItem
              icon="share-social-outline"
              text="Never share with third parties"
              color="#dc2626"
            />
            <InfoItem
              icon="analytics-outline"
              text="No tracking, no analytics"
              color="#dc2626"
            />
          </View>
        </View>
      </View>

      {/* Privacy Promise */}
      <View style={styles.promiseBox}>
        <Icon name="lock-closed" size={20} color={colors.primary[500]} />
        <Text style={styles.promiseText}>
          Your data stays on YOUR phone. Always.
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.primaryButton,
            isRequesting && styles.buttonDisabled,
          ]}
          onPress={requestSMSPermission}
          disabled={isRequesting}>
          <Text style={styles.primaryButtonText}>
            {isRequesting ? 'Requesting...' : 'Grant Permission'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            Alert.alert(
              'Privacy First',
              'Selavu is 100% offline. We never upload your SMS to any server. All processing happens on your device using Realm local database.\n\nYour financial data never leaves your phone.',
              [{text: 'Got it', style: 'default'}],
            )
          }>
          <Text style={styles.secondaryButtonText}>
            Learn more about privacy
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Helper Component for Info Items

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#eff6ff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: fontSizes.h1,
    fontWeight: fontWeights.bold,
    color: colors.gray[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: fontSizes.base,
    color: colors.gray[600],
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#f0fdf4',
    borderWidth: 2,
    borderColor: '#bbf7d0',
    borderRadius: borderRadius.md,
    padding: spacing.base,
  },
  dontBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: fontSizes.large,
    fontWeight: fontWeights.semibold,
    color: colors.gray[900],
    marginLeft: 12,
  },
  infoList: {
    gap: 12,
  },

  promiseBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: borderRadius.base,
    padding: spacing.base,
    marginBottom: 32,
  },
  promiseText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    color: colors.primary[600],
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    gap: 12,
  },
  button: {
    borderRadius: borderRadius.base,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary[500],
  },
  primaryButtonText: {
    fontSize: fontSizes.large,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  secondaryButton: {
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: fontSizes.base,
    color: colors.gray[600],
    textAlign: 'center',
  },
});

export default PermissionsScreen;
