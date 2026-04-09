# 🚀 Neural-Auth: Hackathon-Level Authentication System

A visually stunning, production-ready authentication system with a dark-themed "Neural Core" aesthetic. Built for hackathons where UI excellence and backend reliability are paramount.

## 🌌 Features

- **Modern UI/UX**: Dark theme with mesh gradients, glassmorphism, and animated blobs.
- **Micro-interactions**: Interactive buttons with Framer Motion "squish & pop" effects.
- **Identity Recovery**: Full "Forgot Password" flow with multi-factor identity verification (Email + Mobile).
- **Secure Authentication**: JWT-based auth with bcrypt password hashing.
- **Typewriter Animation**: Character-by-character greeting on the protected dashboard.
- **MVC Architecture**: Scalable backend structure with separated Models, Controllers, and Routes.
- **Social Login UI**: Placeholder buttons for Google and GitHub with brand-accurate SVGs.

## 🧠 Tech Stack

### Frontend
- **React (Vite)**: Core framework.
- **Tailwind CSS v4**: Professional styling.
- **Framer Motion**: Advanced animations and haptics.
- **Lucide React**: Clean vector iconography.
- **React Hot Toast**: Beautiful, animated notifications.
- **Axios**: Smooth API communication.

### Backend
- **Node.js & Express**: Fast, scalable server environment.
- **MongoDB Atlas**: Cloud-native database.
- **Mongoose**: Elegant ODM for schema-driven data.
- **JSON Web Tokens (JWT)**: Secure stateless authentication.
- **Bcrypt**: Industrial-grade password hashing.

## 📂 Project Structure
```
├── frontend/             # Vite + React Client
│   ├── src/
│   │   ├── components/   # Reusable UI (Background, ProtectedRoute)
│   │   ├── pages/        # Login, Register, ForgotPassword, Quiz
│   │   └── index.css     # Theme & Animations
├── backend/              # Node.js + Express Server
│   ├── config/           # DB Connections
│   ├── controllers/      # Business Logic
│   ├── models/           # User Schemas
│   ├── routes/           # API Endpoints
│   ├── middlewares/      # Auth Protection
│   └── server.js         # Entry Point
```

## 🚀 Getting Started

### 1. Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file:
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

Built with ❤️ for Synora by Antigravity.
