// styles.js
import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  
  // Header Section
  headerSurface: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#00C853',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemMeta: {
    color: '#0e96b8ff',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#00C853',
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 22,
  },
  headerSubtitle: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
  loader: {
    marginVertical: 20,
  },
  
  // Selection Surface
  selectionSurface: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#37474f',
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 18,
  },
  selectionButton: {
    marginBottom: 12,
    borderRadius: 12,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
  },
  
  // Item Editor Surface
  itemEditorSurface: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#00C853',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  editorTitle: {
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 18,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  descriptionInput: {
    backgroundColor: 'white',
    marginBottom: 16,
    minHeight: 80,
  },
  addButton: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Cart Surface
  cartSurface: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#00C853',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Cart Header
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  cartTitle: {
    fontWeight: 'bold',
    color: '#1a237e',
    fontSize: 20,
  },
  cartBadge: {
    backgroundColor: '#00C853',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cartBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cartDivider: {
    marginHorizontal: 20,
    backgroundColor: '#e0e0e0',
    height: 1,
    marginBottom: 8,
  },
  
  // Cart Items Container
  cartItemsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  
  // Cart Item Styles
  cartItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  cartItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemMainInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 4,
    fontSize: 16,
    lineHeight: 20,
  },
  itemDescription: {
    color: '#666',
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 4,
    lineHeight: 16,
  },
  itemSubtitle: {
    color: '#666',
    fontSize: 13,
    lineHeight: 16,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 120,
  },
  totalContainer: {
    alignItems: 'flex-end',
    marginRight: 8,
    minWidth: 80,
  },
  itemTotal: {
    fontWeight: 'bold',
    color: '#00C853',
    fontSize: 14,
    textAlign: 'right',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    margin: 0,
    backgroundColor: '#e3f2fd',
    width: 36,
    height: 36,
    borderRadius: 8,
    marginLeft: 4,
  },
  deleteButton: {
    margin: 0,
    backgroundColor: '#ffebee',
    width: 36,
    height: 36,
    marginLeft: 4,
    borderRadius: 8,
  },
  itemSeparator: {
    marginVertical: 8,
    marginHorizontal: 0,
    backgroundColor: '#f5f5f5',
    height: 1,
  },
  
  // Grand Total Surface
  grandTotalSurface: {
    backgroundColor: '#1a237e',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  grandTotal: {
    color: '#00C853',
    fontWeight: 'bold',
    fontSize: 20,
  },
  subtotalRow: {
    alignItems: 'flex-end',
  },
  subtotalText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 2,
  },
  
  // Footer Container for Cart Summary
  footerContainer: {
    marginHorizontal: 10,
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 40,
  },
  
  // Discount Button
  discountButton: {
    marginTop: 16,
    marginBottom: 12,
  },
  
  // Main Action Buttons
  mainActionButtons: {
    gap: 12,
  },
  generateButton: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  clearButton: {
    borderRadius: 12,
    borderColor: '#ff4444',
    backgroundColor: '#fff',
  },
  
  // Empty State
  emptyState: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  emptyStateText: {
    color: '#78909c',
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 16,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  modalHeader: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontWeight: 'bold',
    color: '#00C853',
    textAlign: 'center',
    fontSize: 20,
  },
  searchInput: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  listItem: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  listItemTitle: {
    fontWeight: 'bold',
    color: '#37474f',
    marginBottom: 4,
    fontSize: 16,
  },
  listItemSubtitle: {
    color: '#666',
    fontSize: 12,
  },
  modalCloseButton: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  modalInput: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  modalActions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  modalSaveButton: {
    flex: 1,
    borderRadius: 12,
  },
  
  // Common Button Styles
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});