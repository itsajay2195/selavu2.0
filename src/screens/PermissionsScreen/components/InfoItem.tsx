import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors, fontSizes} from '../../../theme';
import Icon from '../../../components/IconComponent';

const InfoItem = ({icon, text, color}: any) => {
  return (
    <View style={styles.infoItem}>
      <Icon
        library="Ionicons"
        name={icon}
        size={20}
        color={color}
        style={styles.infoItemIcon}
      />
      <Text style={styles.infoItemText}>{text}</Text>
    </View>
  );
};

export default InfoItem;

const styles = StyleSheet.create({
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoItemIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoItemText: {
    fontSize: fontSizes.base,
    color: colors.gray[700],
    flex: 1,
    lineHeight: 22,
  },
});
