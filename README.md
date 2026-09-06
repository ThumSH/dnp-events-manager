# 🍽️ DNP Events Manager

### Mobile Event, Catering & Rental Management System

DNP Events Manager is a mobile application developed for a real client in the catering and event-rental industry.

The application was designed to replace manual paperwork and simplify day-to-day operations such as:

- event handling
- rental inventory tracking
- client management
- order history
- invoice generation
- invoice sharing

The system helps centralize business information inside a mobile application that can be used directly during daily operations.

---

## 🎯 Business Problem

Event and catering businesses often manage rentals and customer orders using:

- handwritten records
- paper invoices
- WhatsApp messages
- manual inventory tracking
- repeated customer information
- disconnected order records

This creates problems such as:

- lost or duplicated information
- difficulty tracking rental items
- time-consuming invoice creation
- poor access to customer history
- inconsistent record keeping

DNP Events Manager was built to move these processes into a structured mobile workflow.

---

# 💡 Solution

The application provides a centralized mobile system for managing:

- events
- rental items
- customers
- previous orders
- invoices

Instead of relying on multiple manual processes, the client can manage operational information from one application.

---

# ✨ Key Features

## 📅 Event Management

The application allows event-related information to be recorded and managed digitally.

This helps organize customer bookings and rental requirements in a structured way.

---

## 📦 Inventory Management

Rental items can be tracked through the application.

Typical items include:

- chafing dishes
- tents / canopies
- cutlery
- furniture
- catering equipment
- event rental items

This helps reduce reliance on manual stock records.

---

## 👥 Client Management

Customer information can be stored for future use.

The system helps maintain:

- recurring client information
- previous order history
- customer-related records

This reduces repeated data entry for returning customers.

---

## 🧾 PDF Invoice Generation

The application can generate professional PDF invoices directly from mobile.

Invoices can be:

- generated from event/order data
- saved to device storage
- shared with customers
- shared through WhatsApp

This removes the need to manually prepare invoices outside the application.

---

## 📱 Offline / Local Storage Support

AsyncStorage is used to provide local data persistence for selected application functionality.

This improves usability when internet connectivity is limited or unavailable.

---

## 🔥 Firebase Integration

Firebase is used for backend services and data storage.

The application uses Firebase to support centralized business data while maintaining mobile-first access.

---

## 📤 File & Invoice Sharing

The application integrates Expo file and sharing functionality to allow generated documents to be saved and shared directly from the device.

---

## 📲 Android Storage Handling

The project includes handling for Android storage restrictions when saving generated PDF files.

This was required to support modern Android file-access rules and allow invoices to be saved successfully to user-accessible storage.

---

# 🏗️ Application Architecture

```text
┌────────────────────────────────────┐
│      React Native Mobile App       │
│                                    │
│ React Native + Expo                │
│ React Navigation                   │
│ React Native Paper                 │
└────────────────┬───────────────────┘
                 │
                 ▼
┌────────────────────────────────────┐
│        Application Services        │
│                                    │
│ Event Management                   │
│ Client Management                  │
│ Inventory                          │
│ Invoice Generation                 │
└───────────────┬────────────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
┌───────────────┐  ┌─────────────────┐
│   Firebase    │  │ AsyncStorage    │
│               │  │                 │
│ Cloud Data    │  │ Local Storage   │
└───────────────┘  └─────────────────┘
| Area             | Technology         |
| ---------------- | ------------------ |
| Mobile Framework | React Native       |
| Platform         | Expo               |
| Language         | JavaScript         |
| Navigation       | React Navigation   |
| Backend          | Firebase           |
| Local Storage    | AsyncStorage       |
| PDF Generation   | Expo Print         |
| File Handling    | Expo File System   |
| Sharing          | Expo Sharing       |
| UI               | React Native Paper |
| Build System     | Expo EAS           |


🛠️ Tech Stack

Area	Technology
Mobile Framework	React Native
Platform	Expo
Language	JavaScript
Navigation	React Navigation
Backend	Firebase
Local Storage	AsyncStorage
PDF Generation	Expo Print
File Handling	Expo File System
Sharing	Expo Sharing
UI	React Native Paper
Build System	Expo EAS

🔄 Example Business Workflow

Client Request
      ↓
Create / Select Client
      ↓
Create Event
      ↓
Select Rental Items
      ↓
Record Order Details
      ↓
Generate Invoice
      ↓
Save PDF
      ↓
Share with Client

📸 Screenshots

Add screenshots here:
1. Home / Dashboard
  <img width="720" height="1600" alt="image" src="https://github.com/user-attachments/assets/1344f15e-e428-4af6-b8ab-2a4c6cfcd2a0" />

2.Customer Management /Creation
  <img width="720" height="1600" alt="image" src="https://github.com/user-attachments/assets/4f484b5d-fa67-4a1e-912c-3228c32e0d56" />

3. Inventory
<img width="720" height="1600" alt="image" src="https://github.com/user-attachments/assets/358ac61f-33d9-4e2f-805e-5baebf543950" />

4. Invoice Preview
    <img width="720" height="1600" alt="image" src="https://github.com/user-attachments/assets/21ac9fe9-7b8d-43dc-ac1d-d181a71f5458" />

5.History Management.
  <img width="720" height="1600" alt="image" src="https://github.com/user-attachments/assets/a1948ccc-8dbd-4c12-bcf1-2a19778d9245" />

---

# 💼 Client Project

This application was developed for a real catering and event-rental client.

The main objective was to reduce manual operational work and provide a simpler digital workflow for managing customers, rental items, events, and invoices.

---

# 🧠 What This Project Demonstrates

This project demonstrates experience with:

- client requirement analysis
- mobile application development
- React Native
- Expo
- Firebase integration
- inventory workflows
- customer management
- PDF generation
- file-system handling
- Android storage permissions
- offline/local persistence
- real-world business software development

---

# 🚀 Build & Run

## Install dependencies

```bash
npm install

📦 Production Builds

The application uses Expo EAS for creating production builds.

This allows standalone Android builds to be generated for direct installation on client devices.

🚧 Project Status

Client Project

Core business functionality has been implemented for operational use.

Further improvements may be added based on evolving client requirements.

👨‍💻 Developer

Sithum Hemash

Full-Stack Developer & Software Engineering Undergraduate

GitHub:

https://github.com/ThumSH

Built to replace manual event and rental workflows with a practical mobile business system.




  
