import React from 'react';
import { Surface, Text } from 'react-native-paper';
import { styles } from '../styles';

export default function Header() {
  return (
    <Surface style={styles.headerSurface} elevation={4}>
      <Text variant="headlineSmall" style={styles.headerTitle}>
        Billing & Invoices
      </Text>
      <Text variant="bodyMedium" style={styles.headerSubtitle}>
        Create bills and generate PDF invoices
      </Text>
    </Surface>
  );
}