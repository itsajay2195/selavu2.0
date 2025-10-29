import React from 'react';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '../../components/IconComponent';
import {colors} from '../../theme';
import Body from './components/Body';
import Footer from './components/Footer';
import {Storage} from '../../utils/storage';

const WelcomeScreen = ({navigation}: any) => {
  const skipOnboarding = Storage.isOnboardingCompleted();
  console.log('showPermissionsScreen>>', skipOnboarding);
  return (
    <LinearGradient
      colors={[colors.gradient.start, colors.gradient.end]}
      style={styles.container}>
      <Body />
      <Footer navigation={navigation} skipOnboarding={skipOnboarding} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});

export default WelcomeScreen;
