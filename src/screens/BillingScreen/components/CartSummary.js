// CartSummary.js
import React from 'react';
import { View, FlatList } from 'react-native';
import { Button, Card, Text, IconButton, Divider, Surface } from 'react-native-paper';
import { styles } from '../styles';
import ActionButtons from './ActionButtons';

export default function CartSummary({ 
  cart, 
  globalDiscount,
  handleOpenEditor, 
  setCart, 
  loading, 
  saveAndGeneratePDF, 
  clearBill,
  handleSaveForLater,
  openDiscountModal,
  ListHeaderComponent,
}) {
  const subTotal = cart.reduce((acc, item) => acc + (item.subTotal || 0), 0);
  const totalDiscount = subTotal * (parseFloat(globalDiscount || '0') / 100);
  const grandTotal = subTotal - totalDiscount;

  const renderItem = ({ item, index }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartItemContent}>
        <View style={styles.itemMainInfo}>
          <View style={styles.itemTextContainer}>
            <Text variant="bodyLarge" style={styles.itemName}>
              {item.name}
            </Text>
            {item.description ? (
              <Text variant="bodyMedium" style={styles.itemDescription}>
                {item.description}
              </Text>
            ) : null}
            <Text variant="bodyMedium" style={styles.itemSubtitle}>
              {item.qty} × Rs. {Number(item.price).toFixed(2)} × {item.usageDays} days
            </Text>
          </View>
        </View>
        <View style={styles.itemActions}>
          <View style={styles.totalContainer}>
            <Text variant="titleMedium" style={styles.itemTotal}>
              Rs. {Number(item.total).toFixed(2)}
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <IconButton 
              icon="pencil" 
              size={18} 
              iconColor="#2196F3" 
              onPress={() => handleOpenEditor(item, index)} 
              style={styles.editButton} 
            />
            <IconButton 
              icon="delete" 
              size={18} 
              iconColor="#ff4444" 
              onPress={() => setCart(cart.filter((_, idx) => idx !== index))} 
              style={styles.deleteButton} 
            />
          </View>
        </View>
      </View>
      {index < cart.length - 1 && <Divider style={styles.itemSeparator} />}
    </View>
  );

  return (
    <FlatList
      data={[]}
      renderItem={null}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={cart.length > 0 ? (
        <View style={styles.footerContainer}>
          <Surface style={styles.cartSurface} elevation={3}>
            <View style={styles.cartHeader}>
              <Text variant="titleLarge" style={styles.cartTitle}>
                Bill Summary
              </Text>
              <Surface style={styles.cartBadge} elevation={2}>
                <Text variant="labelSmall" style={styles.cartBadgeText}>
                  {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </Text>
              </Surface>
            </View>
            <Divider style={styles.cartDivider} />
            
            <View style={styles.cartItemsContainer}>
              {cart.map((item, index) => (
                <View key={`summary-item-${item.id}-${index}`}>
                  {renderItem({ item, index })}
                </View>
              ))}
            </View>

            <Surface style={styles.grandTotalSurface} elevation={2}>
              <View style={styles.totalRow}>
                <Text variant="titleMedium" style={styles.totalLabel}>
                  Net Total:
                </Text>
                <Text variant="headlineSmall" style={styles.grandTotal}>
                  Rs. {grandTotal.toFixed(2)}
                </Text>
              </View>
              <View style={styles.subtotalRow}>
                <Text variant="bodySmall" style={styles.subtotalText}>
                  Subtotal: Rs. {subTotal.toFixed(2)}
                </Text>
                {totalDiscount > 0 && (
                  <Text variant="bodySmall" style={[styles.subtotalText, { color: '#d9534f' }]}>
                    Discount ({globalDiscount}%): -Rs. {totalDiscount.toFixed(2)}
                  </Text>
                )}
              </View>
            </Surface>
          </Surface>
          
          <Button 
            icon="sale" 
            mode="outlined" 
            onPress={openDiscountModal} 
            style={styles.discountButton}
          >
            Add or Edit Discount
          </Button>
          
          <Button 
            icon="content-save-cog-outline" 
            mode="outlined" 
            onPress={handleSaveForLater} 
            style={styles.discountButton}
            disabled={loading}
          >
            Save for Later
          </Button>
          
          <ActionButtons
            onSave={saveAndGeneratePDF}
            onClear={clearBill}
            loading={loading}
          />
        </View>
      ) : null}
      contentContainerStyle={styles.listContent}
    />
  );
}