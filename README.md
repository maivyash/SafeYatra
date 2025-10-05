# 🛡️ SafeYatra – MERN Stack Authentication Application

![Node.js](https://img.shields.io/badge/Node.js-v18+-green?logo=node.js)
![React](https://img.shields.io/badge/React-v18-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?logo=mongodb)
![License: ISC](https://img.shields.io/badge/License-ISC-yellow)
![Express.js](https://img.shields.io/badge/Express.js-Backend-lightgrey?logo=express)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange?logo=jsonwebtokens)

A full-stack web application built with **MongoDB**, **Express.js**, **React.js**, and **Node.js** featuring **user authentication**, **registration**, and a **protected dashboard**.

---

## 🚀 Features

- 🔐 **User Authentication** – Login and registration with JWT tokens  
- 🧭 **Protected Routes** – Secure dashboard accessible only to authenticated users  
- 🎨 **Modern UI** – Beautiful, responsive design with gradient backgrounds  
- ✅ **Form Validation** – Client-side and server-side validation  
- ⚠️ **Error Handling** – Comprehensive error handling and user feedback  
- 🌐 **API Structure** – RESTful API with placeholder endpoints for future development  



## 📁 Project Structure

```text
SIH/
├── backend/                      # Express.js backend
│   ├── models/                   # MongoDB models
│   │   └── User.js               # User schema with password hashing
│   ├── routes/                   # API routes
│   │   ├── auth.js               # Authentication routes (login/register)
│   │   ├── users.js              # User management routes
│   │   └── data.js               # Data management routes (placeholder)
│   ├── middleware/               # Custom middleware
│   │   └── auth.js               # JWT authentication middleware
│   ├── server.js                 # Main server file
│   └── package.json              # Backend dependencies
│
├── frontend/                     # React.js frontend
│   ├── public/                   # Static files
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── Login.js          # Login form component
│   │   │   ├── Register.js       # Registration form component
│   │   │   ├── Dashboard.js      # Protected dashboard
│   │   │   └── Navbar.js         # Navigation component
│   │   ├── contexts/             # React contexts
│   │   │   └── AuthContext.js    # Authentication state management
│   │   ├── services/             # API services
│   │   │   └── api.js            # Axios configuration & API calls
│   │   ├── App.js                # Main App component
│   │   ├── App.css               # App styles
│   │   ├── index.js              # React entry point
│   │   └── index.css             # Global styles
│   └── package.json              # Frontend dependencies
│
└── README.md                     # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm or yarn

---

### ⚙️ Backend Setup

```bash
cd backend
npm install



