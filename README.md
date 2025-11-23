# DNP Events - Event Management & Inventory System

An enterprise-grade mobile application developed for **DNP Events**, an event planning and rental company. This app streamlines the rental process for culinary equipment, canopies, and furniture, replacing manual paperwork with digital workflows.

## 📱 Key Features

* **Inventory Management:** Real-time tracking of rental items (Chafing dishes, Tents, Cutlery).
* **PDF Invoicing:** Auto-generates professional PDF invoices and saves them directly to user storage or shares via WhatsApp.
* **Client Management:** Maintains a database of recurring clients and their order history.
* **Cross-Platform:** Built to run seamlessly on Android (APK) and iOS.

## 🛠 Tech Stack

* **Framework:** React Native (Expo)
* **Language:** JavaScript / React
* **Backend:** Firebase (Firestore & Auth) / offline through ASYNC STORAGE
* **Tools:** Expo EAS (Build System), Expo Print (PDF Generation), Expo Sharing.

## 🚀 Highlights

* **Solved File System Restrictions:** Implemented Android Storage Access Framework (SAF) to securely save invoices to the "Downloads" folder, bypassing Android 11+ scoped storage restrictions.
* **Optimized Build:** Configured EAS to generate standalone APKs for direct client side-loading.

---
*Developed by Sithum Hemash*