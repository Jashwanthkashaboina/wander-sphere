# WanderSphere 🌍

A full-stack travel accommodation booking platform inspired by Airbnb, built using the Node.js, Express.js, EJS, MongoDB. Users can explore properties, create listings, book stays, make secure payments, and manage their bookings through a personalized profile dashboard.

## ✨ Features

### 🔐 Authentication & Authorization

* User Registration & Login
* Google OAuth 2.0 Authentication
* Session-based Authentication using Passport.js
* Protected Routes & Authorization Middleware

### 🏠 Listing Management

* Create, Edit, Delete Listings
* Upload Property Images
* View Listing Details
* Owner-Based Access Control

### ⭐ Reviews & Ratings

* Add Reviews & Ratings
* Delete Own Reviews
* Review Validation using Joi

### 📅 Booking System

* Date-based Booking
* Automatic Price Calculation
* Cancel Bookings
* Booking Status Tracking

### 💳 Payment Integration

* Razorpay Payment Gateway Integration
* Secure Order Creation
* Payment Signature Verification (HMAC SHA256)
* Booking Confirmation after Successful Payment

### 📄 Invoice & Notifications

* Automatic PDF Invoice Generation
* Email Confirmation Workflow
* Booking Reference Generation

### 👤 User Profile

* View Personal Information
* Track Booking History
* Manage Existing Bookings

---

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* Bootstrap 5
* JavaScript
* EJS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* Passport.js
* Passport Local
* Google OAuth 2.0

### Payments

* Razorpay

### Additional Tools

* Nodemailer
* PDFKit
* Joi
* Cloudinary
* Multer
* Connect-Flash

---

## 📂 Project Structure

```bash
WanderSphere
│
├── controllers/
├── models/
├── public/
├── routes/
├── utils/
├── views/
├── .gitignore
├── app.js
├── cloudConfig.js
├── middleware.js
├── package_lock.json
├── package.json
└── schema.js
```

---

## 🔒 Security Features

* Password Hashing using Passport-Local-Mongoose
* Route Protection Middleware
* Input Validation using Joi
* Payment Signature Verification
* Session Management with MongoDB Store

---
