import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { styles } from '../styles';

export default function ActionButtons({ onSave, onClear, loading }) {
  return (
    <View style={styles.mainActionButtons}>
      <Button
        mode="contained"
        icon="receipt"
        buttonColor="#00C853"
        onPress={onSave}
        style={styles.generateButton}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        loading={loading}
        disabled={loading}
      >
        Save & Generate Invoice
      </Button>
      <Button
        mode="outlined"
        icon="delete-sweep"
        onPress={onClear}
        style={styles.clearButton}
        contentStyle={styles.buttonContent}
        textColor="#ff4444"
      >
        Clear Bill
      </Button>
    </View>
  );
}