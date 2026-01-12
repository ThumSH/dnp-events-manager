import React from 'react';
import { Surface, Text, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from '../styles';

export default function SelectionArea({
  selectedCust,
  selectedEquip,
  billDate,
  showBillDatePicker,
  setCustModal,
  setEquipModal,
  setShowBillDatePicker,
  onBillDateChange
}) {
  return (
    <Surface style={styles.selectionSurface} elevation={2}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Select Customer & Items
      </Text>

      <Button 
        mode="outlined" 
        onPress={() => setCustModal(true)} 
        style={styles.selectionButton}
        contentStyle={styles.buttonContent}
        icon="account"
      >
        {selectedCust ? `Client: ${selectedCust.name}` : "Select Customer"}
      </Button>

      <Button 
        mode="outlined" 
        onPress={() => setEquipModal(true)} 
        style={styles.selectionButton}
        contentStyle={styles.buttonContent}
        icon="package-variant"
      >
        {selectedEquip ? `Item: ${selectedEquip.name}` : "Select Equipment"}
      </Button>

      <Button 
        icon="calendar" 
        mode="outlined" 
        onPress={() => setShowBillDatePicker(true)} 
        style={styles.selectionButton}
        contentStyle={styles.buttonContent}
      >
        Bill Date: {billDate.toLocaleDateString('en-GB')}
      </Button>
      {showBillDatePicker && (
        <DateTimePicker
          value={billDate}
          mode="date"
          display="default"
          onChange={onBillDateChange}
        />
      )}
    </Surface>
  );
}