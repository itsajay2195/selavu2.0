import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors, fontSizes, fontWeights} from '../../../theme';

const Footer = ({navigation}: any) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Permissions')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>No account needed • Free forever</Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    paddingBottom: 24,
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: fontSizes.large,
    fontWeight: fontWeights.semibold,
    color: colors.primary[600],
  },
  footerText: {
    textAlign: 'center',
    fontSize: fontSizes.small,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
