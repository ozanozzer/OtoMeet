// src/components/home/FilterBar.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import colors from '../../constants/colors';

// Component artık dışarıdan 'activeTab' ve 'onTabChange' proplarını alıyor
const FilterBar = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={activeTab} // Hangi butonun aktif olacağını belirler
        onValueChange={onTabChange} // Bir butona basıldığında hangi fonksiyonun çalışacağını belirler
        buttons={[
          {
            value: 'following', // Bu, HomeScreen'deki state ile eşleşmeli
            label: 'Takip Edilenler',
            style: styles.button,
            checkedColor: colors.accent, // Seçiliykenki renk
          },
          {
            value: 'explore', // Bu, HomeScreen'deki state ile eşleşmeli
            label: 'Keşfet',
            style: styles.button,
            checkedColor: colors.accent,
          },
        ]}
        style={styles.buttonsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  buttonsContainer: {
    // Genel konteynerin stilleri
  },
  button: {
    // Her bir butonun stili
    borderColor: colors.border,
  }
});

export default FilterBar;