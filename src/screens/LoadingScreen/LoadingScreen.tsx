import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, fontSizes} from '../../theme';
import {readSmsFromDevice} from '../../services/smsReader';
import {processAllSMS} from '../../services/smsProcessor';

const LoadingScreen = ({navigation}: any) => {
  const [status, setStatus] = useState('Reading your SMS...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Read SMS
      setStatus('Reading your SMS...');
      const messages = await readSmsFromDevice(90);
      setProgress(30);

      // Process SMS
      setStatus(`Processing ${messages.length} messages...`);
      await processAllSMS(messages);
      setProgress(80);

      // Done
      setStatus('All set!');
      setProgress(100);

      // Navigate to dashboard
      setTimeout(() => {
        navigation.replace('DASHBOARD_SCREEN');
      }, 500);
    } catch (error) {
      console.error('Error loading data:', error);
      setStatus('Something went wrong. Retrying...');
      // Optionally retry or navigate anyway
      setTimeout(() => {
        navigation.replace('Dashboard');
      }, 2000);
    }
  };

  return (
    <LinearGradient
      colors={[colors.gradient.start, colors.gradient.end]}
      style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={colors.white} />
        <Text style={styles.status}>{status}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {width: `${progress}%`}]} />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  status: {
    fontSize: fontSizes.large,
    color: colors.white,
    marginTop: 24,
    marginBottom: 16,
  },
  progressBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.white,
  },
});

export default LoadingScreen;
