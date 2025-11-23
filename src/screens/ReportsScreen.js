import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Platform, Alert } from 'react-native';
import { Button, Card, Text, ActivityIndicator, Divider, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getInvoices, deleteInvoice } from '../config/storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import * as FileSystem from 'expo-file-system/legacy';

export default function ReportsScreen() {

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState({ show: false, type: 'start' });

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || (showPicker.type === 'start' ? startDate : endDate);
    setShowPicker({ show: Platform.OS === 'ios', type: showPicker.type });

    let newStartDate = startDate;
    let newEndDate = endDate;


    if (showPicker.type === 'start') {
      setStartDate(currentDate);
      newStartDate = currentDate;
    } else {
      setEndDate(currentDate);
      newEndDate = currentDate;
    }

    if (newStartDate > newEndDate) {
      Alert.alert("Invalid Date Range","Start date cannot be after the end date") ;
      return;
    }
    if(Platform.OS === 'android'){
      fetchInvoices(newStartDate, newEndDate);
    }
  };

  const showDatePicker = (type) => {
    setShowPicker({ show: true, type });
  };

   const fetchInvoices = async (start, end) => {


    const startOfDay = new Date(start);
    startOfDay.setHours(0, 0, 0, 0); 


    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59, 999); 


    if (startOfDay > endOfDay) {
      Alert.alert("Invalid Date Range", "Start date cannot be after the end date.");
      return;
    }
   
    setLoading(true);
    setInvoices([]);

    try {
      const allInvoices = await getInvoices();
      
      const filteredInvoices = allInvoices.filter(invoice => {
        if (!invoice.createdAt) return false;
        

        const invoiceDate = new Date(invoice.createdAt);
        

        const iTime = invoiceDate.setHours(0,0,0,0);
        const sTime = new Date(startOfDay).setHours(0,0,0,0);
        const eTime = new Date(endOfDay).setHours(0,0,0,0);

        return iTime >= sTime && iTime <= eTime;
      });

      // Sort by date descending
      filteredInvoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setInvoices(filteredInvoices);


      if (filteredInvoices.length === 0) {
        Alert.alert("No Results", "No invoices found for the selected date range.");
      }

    } catch (error) {
      console.error("Error fetching invoices: ", error);
      Alert.alert("Error", "Could not fetch reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateAndSharePdfForInvoice = async (invoice) => {
    if (!invoice) return;

    const html = `
      <html>
        <body style="padding: 40px; font-family: Helvetica, sans-serif;">
                    <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #0e96b8ff; margin:0;">DNP EVENT ORGANIZING</h1>
            <p style="margin:5px; color: #666;">Rentals & Sales Invoice</p>
          </div>
          <div style="margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 20px;">
            <strong>Invoice No:</strong> #${invoice.invoiceNumber || 'N/A'}<br/>
            <strong>Customer:</strong> ${invoice.customerName || 'Valued Customer'}<br/>
            <strong>Date Created:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #f3f3f3;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: left;">Date</th>
              <th style="padding: 10px;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
              <th style="padding: 10px; text-align: right;">Amount</th>
            </tr>
            ${(invoice.items || []).map(item => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.date}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.qty}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Rs. ${Number(item.price).toFixed(2)}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Rs. ${Number(item.total).toFixed(2)}</td>
              </tr>
            `).join('')}
          </table>
          <div style="text-align: right; margin-top: 30px;">
            <h2 style="display: inline-block; padding-bottom: 4px; border-bottom: 3px double #333;">Total: Rs. ${Number(invoice.total).toFixed(2)}</h2>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      

      let finalUri = uri;
      try {
        const cleanName = (invoice.customerName || 'Customer').replace(/[^a-zA-Z0-9]/g, '_');
        const invNum = invoice.invoiceNumber || 'NA'; 
        const paddedInvoiceNumber = String(invNum).padStart(3, '0');
        const fileName = `INV${paddedInvoiceNumber}-${cleanName}`;
        const newUri = FileSystem.documentDirectory + `${fileName}.pdf`;

        await FileSystem.moveAsync({
          from: uri,
          to: newUri
        });
        finalUri = newUri;
      } catch (renameError) {
        console.log("Renaming failed in Reports:", renameError);
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(finalUri, {
          dialogTitle: `Share Invoice #${invoice.invoiceNumber}`,
          mimeType: 'application/pdf',
          UTI: 'com.adobe.pdf'
        });
      } else {
        Alert.alert('Error', 'No sharing options available on this device.');
      }
    } catch (error) {
      console.error("PDF Generation Error:", error);
      Alert.alert('Error', 'Could not generate PDF. Please try again.');
    }
  };

  const renderInvoice = ({ item }) => {

    const paddedInvoiceNumber = item.invoiceNumber ? String(item.invoiceNumber).padStart(3, '0') : 'N/A';

    return (
      <Card style={styles.card}>
      <Card.Title
        title={`Invoice #${paddedInvoiceNumber} - ${item.customerName}`}
        subtitle={`Date: ${new Date(item.createdAt).toLocaleDateString()}`}
        right={(props) => <Text {...props} style={styles.total}>Rs. {Number(item.total).toFixed(2)}</Text>}
      />
      <Card.Content>
        <Divider style={{ marginVertical: 8 }}/>
        {item.items.map((equip, index) => (
          <Text key={index} style={styles.itemText}>- {equip.name} (Qty: {equip.qty})</Text>
        ))}
      </Card.Content>
      <Card.Actions>
        <Button 
          icon="download" 
          onPress={() => generateAndSharePdfForInvoice(item)}
        >
          Download Bill
        </Button>
        <Button
          icon="delete"
          textColor="red"
          onPress={() => handleDeleteInvoice(item.id,item.customerName)}
        >
        Delete Bill
        </Button>
      </Card.Actions>
    </Card>
    );
  };

  const handleDeleteInvoice = (invoiceId, customerName) => {
    Alert.alert(
      'Delete Invoice',
      `Are you sure you want to delete the invoice for ${customerName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style:"destructive",
          onPress: async () => {
            try {
              await deleteInvoice(invoiceId);
              Alert.alert('Success', 'Invoice deleted successfully.');
              fetchInvoices(startDate,endDate);
            } catch (error) {
              console.error("Error deleting invoice: ", error);
              Alert.alert('Error', 'Could not delete invoice. Please try again.');
            }
          },
        },
      ],
    );

  };

  return (
    <View style={styles.container}>
      <View style={styles.datePickerContainer}>
        <Button icon="calendar" mode="outlined" onPress={() => showDatePicker('start')} style={styles.dateButton}>
          Start: {startDate.toLocaleDateString()}
        </Button>
        <Button icon="calendar" mode="outlined" onPress={() => showDatePicker('end')} style={styles.dateButton}>
          End: {endDate.toLocaleDateString()}
        </Button>
      </View>

      <Button mode="contained" onPress={() => fetchInvoices(startDate, endDate)} style={styles.fetchButton} loading={loading} disabled={loading}>
        Fetch Reports
      </Button>

      {showPicker.show && (
        <DateTimePicker
          value={showPicker.type === 'start' ? startDate : endDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <FlatList
        data={invoices}
        renderItem={renderInvoice}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={() => !loading && <Text style={styles.emptyText}>Select a date range and fetch reports.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f5f5f5' },
  datePickerContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  dateButton: { flex: 1, marginHorizontal: 5 },
  fetchButton: { marginBottom: 20 },
  card: { marginVertical: 8, backgroundColor: 'white' },
  total: { marginRight: 16, fontSize: 16, fontWeight: 'bold' },
  itemText: { color: '#666' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888' }
});