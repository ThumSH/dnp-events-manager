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

    // Use a copy to avoid mutating state
    const rangeStart = new Date(start);
    const rangeEnd = new Date(end);
    
    // Set time to the beginning of the day for start date and end of the day for end date
    rangeStart.setHours(0, 0, 0, 0);
    rangeEnd.setHours(23, 59, 59, 999);
    
    if (rangeStart > rangeEnd) {
      Alert.alert("Invalid Date Range", "Start date cannot be after the end date.");
      return;
    }
   
    setLoading(true);
    setInvoices([]);

    try {
      const allInvoices = await getInvoices();
      
      const filteredInvoices = allInvoices.filter(invoice => {
        if (!invoice.createdAt) return false; // Filter by the actual creation date
        
        const invoiceCreationDate = new Date(invoice.createdAt); // Use createdAt for comparison
        // Compare timestamps directly
        return invoiceCreationDate >= rangeStart && invoiceCreationDate <= rangeEnd;
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

    // Use billDate for consistency
    const formattedDate = new Date(invoice.billDate).toLocaleDateString('en-GB');

    const subTotal = invoice.items.reduce((acc, item) => acc + (item.subTotal || 0), 0);
    const globalDiscountPercentage = invoice.discountPercentage || 0;
    const totalDiscount = subTotal * (globalDiscountPercentage / 100);
    const grandTotal = subTotal - totalDiscount;

const html = `
      <html>
        <body style="padding: 25px; font-family: Helvetica, sans-serif; font-size: 12px; color: #333;">
          
          <div style="text-align: center; margin-bottom: 10px;">
            <h1 style="color: #0e96b8ff; margin: 0; font-size: 16px;">DNP EVENT ORGANIZING</h1>
            <p style="margin: 2px; color: #666; font-size: 11px;">Rentals & Sales Invoice</p>
            <hr style="border: none; border-top: 1px solid #b0e0e6; margin-top: 5px; margin-bottom: 5px;" />
          </div>

          <div style="margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #eee;">
            <div style="font-size: 12px; line-height: 1.6;">
              <strong>Invoice No:</strong> #${invoice.invoiceNumber || 'N/A'}<br/>
              <strong>Customer:</strong> ${invoice.customerName || 'Valued Customer'}<br/>
              <strong>Date:</strong> ${formattedDate}
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 10px;">
            <thead>
                <tr style="background: #f3f3f3;">
                  <th style="padding: 5px; text-align: left; border: 1px solid #ddd; width: 30%;">Item</th>
                  <th style="padding: 5px; text-align: center; border: 1px solid #ddd;">Qty</th>
                  <th style="padding: 5px; text-align: right; border: 1px solid #ddd;">Price(RS)</th>
                  <th style="padding: 5px; text-align: right; border: 1px solid #ddd;">Amount(RS)</th>
                  <th style="padding: 5px; text-align: center; border: 1px solid #ddd;">Usage Days</th>
                  <th style="padding: 5px; text-align: right; border: 1px solid #ddd;">Total(RS)</th>
                </tr>
            </thead>
            <tbody>
                ${(invoice.items || []).map(item => `
                  <tr>
                    <td style="padding: 4px 5px; text-align: left; border: 1px solid #ddd;">
                      <span style="font-weight: 500;">${item.name}</span>
                      ${item.description ? `<span style="color: #666; font-style: italic; font-size: 10px;"> - ${item.description}</span>` : ''}
                    </td>
                    <td style="padding: 4px 5px; text-align: center; border: 1px solid #ddd;">${item.qty}</td>
                    <td style="padding: 4px 5px; text-align: right; border: 1px solid #ddd;">${Number(item.price).toFixed(2)}</td>
                    <td style="padding: 4px 5px; text-align: right; border: 1px solid #ddd;">${Number(item.price * item.qty).toFixed(2)}</td>
                    <td style="padding: 4px 5px; text-align: center; border: 1px solid #ddd;">${item.usageDays}</td>
                    <td style="padding: 4px 5px; text-align: right; border: 1px solid #ddd;">${Number(item.subTotal).toFixed(2)}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>

          <div style="width: 100%; margin-top: 10px;">
            <table align="right" style="width: auto; border-collapse: collapse; font-size: 12px;">
                
                <tr>
                    <td style="padding: 4px 10px 4px 0; text-align: right;">Total Amount:</td>
                    <td style="padding: 4px 5px; text-align: right; width: 120px;">Rs. ${Number(subTotal).toFixed(2)}</td>
                </tr>

                ${totalDiscount > 0 ? `
                <tr>
                    <td style="padding: 4px 10px 4px 0; text-align: right; color: #d9534f;">Less: Discount (${globalDiscountPercentage}%):</td>
                    <td style="padding: 4px 5px; text-align: right; width: 120px; color: #d9534f;">Rs. ${Number(totalDiscount).toFixed(2)}</td>
                </tr>` : ''}

                <tr style="background-color: #f0f0f0; border-top: 2px solid #333; border-bottom: 2px solid #333;">
                    <td style="padding: 6px 10px 6px 0; text-align: right; font-weight: bold; font-size: 12px;">NET TOTAL:</td>
                    <td style="padding: 6px 5px; text-align: right; font-weight: bold; font-size: 12px;">Rs. ${Number(grandTotal).toFixed(2)}</td>
                </tr>

            </table>
            <div style="clear: both;"></div>
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
    
    // Use billDate for display
    const displayDate = new Date(item.billDate).toLocaleDateString('en-GB');

    return (
      <Card style={styles.card}>
      <Card.Title
        title={`Invoice #${paddedInvoiceNumber} - ${item.customerName}`}
        subtitle={`Invoice Date: ${displayDate}`}
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
        <Button icon="calendar" mode="outlined" onPress={() => showDatePicker('start')} style={styles.dateButton} uppercase={false}>
          {/* FIX: Show date in DD/MM/YYYY */}
          Start: {startDate.toLocaleDateString('en-GB')}
        </Button>
        <Button icon="calendar" mode="outlined" onPress={() => showDatePicker('end')} style={styles.dateButton} uppercase={false}>
          {/* FIX: Show date in DD/MM/YYYY */}
          End: {endDate.toLocaleDateString('en-GB')}
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