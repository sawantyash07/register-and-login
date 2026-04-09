# 🚀 Neural-Auth: Modern & Secure Authentication System

A visually stunning, production-ready authentication system with a modern glassmorphism aesthetic. Built for performance and user experience, featuring a streamlined "Neural Core" design.

## 🌌 Features

- **Modern & Simple UI**: Sleek dark theme with mesh gradients, glassmorphism, and interactive centered cards.
- **Fast Navigation**: Instant page transitions for a snappy user experience.
- **Streamlined Forms**: Standard, clear labels (Username, Contact, Email, Password) for ease of use.
- **Centralized Feedback**: All flash messages and notifications are displayed in the top-center of the screen.
- **Identity Recovery**: Secure "Forgot Password" flow with multi-factor verification (Email + Mobile).
- **Secure Authentication**: JWT-based auth with bcrypt password hashing and robust regex validation.
- **MVC Architecture**: Clean separation of concerns with Models, Controllers, and Routes.

## 🧠 Tech Stack

### Frontend
- **React (Vite)**: Core framework.
- **Tailwind CSS v4**: Modern utility-first styling.
- **Framer Motion**: Interactive hover effects and card entry animations.
- **Lucide React**: Clean, consistent iconography.
- **React Hot Toast**: Beautiful, centralized notifications.
- **Axios**: API communication.

### Backend
- **Node.js & Express**: Fast, scalable server environment.
- **MongoDB Atlas**: Cloud-native database integration.
- **Mongoose**: Elegant ODM for schema-driven data.
- **JSON Web Tokens (JWT)**: Secure stateless sessions.
- **Bcrypt**: Industrial-grade password hashing.

## 📂 Project Structure
```
├── frontend/             # Vite + React Client
│   ├── src/
│   │   ├── components/   # UI Background & ProtectedRoute
│   │   ├── pages/        # Login, Register, ForgotPassword, Quiz
│   │   └── index.css     # Unified Design System
├── backend/              # Node.js + Express Server
│   ├── config/           # Database Configuration
│   ├── controllers/      # Auth & User Logic
│   ├── models/           # Mongoose Schemas
│   ├── routes/           # REST API Endpoints
│   ├── middlewares/      # Protection layers
│   └── server.js         # Server Entry Point
```

## 🚀 Getting Started

### 1. Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file with your credentials:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. `npm run dev`

### 2. Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

---

Developed for high-performance authentication workflows.
Developed with ❤️.
