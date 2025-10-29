import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Icon from '../../../components/IconComponent';
import {colors, fontSizes, fontWeights} from '../../../theme';

const Body = () => {
  return (
    <View style={styles.content}>
      <View style={styles.iconContainer}>
        <Icon
          library={'Ionicons'}
          name="wallet-outline"
          size={64}
          color={colors.white}
        />
      </View>

      <Text style={styles.title}>Selavu</Text>
      <Text style={styles.subtitle}>செலவு</Text>
      <Text style={styles.tagline}>Track expenses, privately</Text>

      <View style={styles.featureBox}>
        <Icon
          library={'Ionicons'}
          name="shield-checkmark-outline"
          size={24}
          color={colors.white}
        />
        <View style={styles.featureText}>
          <Text style={styles.featureTitle}>100% Private</Text>
          <Text style={styles.featureDesc}>
            Your SMS never leaves your phone
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Body;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 48,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 32,
    color: colors.white,
    marginBottom: 16,
  },
  tagline: {
    fontSize: fontSizes.large,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 48,
  },
  featureBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  featureText: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: fontSizes.large,
    fontWeight: fontWeights.semibold,
    color: colors.white,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: fontSizes.small,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
