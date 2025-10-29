import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '../../components/IconComponent';
import {colors, fontSizes, fontWeights} from '../../theme';
import Body from './components/Body';
import Footer from './components/Footer';

const WelcomeScreen = ({navigation}: any) => {
  return (
    <LinearGradient
      colors={[colors.gradient.start, colors.gradient.end]}
      style={styles.container}>
      <Body />
      <Footer />
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
