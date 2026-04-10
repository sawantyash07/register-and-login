# Synora Neural Systems - Authentication & Authorization

A high-performance, full-stack authentication system built with **React**, **Node.js**, **Express**, and **MongoDB**. This project features a modern, interactive UI with "Neural Core" aesthetics, robust security protocols, and comprehensive session management.

## 🚀 Features

- **🛡️ Secure Auth**: Password hashing with `bcrypt` and session management via `JWT`.
- **🎭 Multi-tier Roles**: Integrated Role-Based Access Control (RBAC) (User/Admin).
- **🌈 Interactive Strength Meter**: Multi-color, animated password entropy analyzer.
- **🚨 Centralized Alerts**: Custom glassmorphism-styled centered flash messages.
- **🔄 Identity Recovery**: Fully functional forgot-password flow with identity verification.
- **🌐 Dashboard Navigation**: Protected routes and automatic session-state detection.
- **💎 Premium UI**: Built with Framer Motion, Lucide Icons, and Glassmorphism design principles.

## 🛠️ Project Structure

```bash
├── backend/            # Express.js Server & MongoDB Models
└── frontend/           # Vite + React + TailwindCSS SPA
```

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- NPM or Yarn

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```
4. Start the server (using nodemon):
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The application will be accessible at `http://localhost:5173`.

## 📡 API Endpoints

- **POST** `/api/auth/register`: Initialize new identity.
- **POST** `/api/auth/login`: Authorize session & receive token.
- **POST** `/api/auth/reset-password`: Update credentials via email/mobile verification.
- **GET** `/api/auth/me`: Retrieve current authorized user data.

## 🔒 Security Implementation
- All sensitive passwords are salted and hashed before persistence.
- JWT tokens are automatically injected into requests via Axios interceptors.
- Server-side middleware protects sensitive routes and validates user roles.

---
Built by [Yash Sawant](https://github.com/sawantyash07)
