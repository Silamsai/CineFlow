# 🎬 CineFlow — Premium Movie Ticket Booking Platform

A full-stack, production-grade movie ticket booking application built with React, Node.js/Express, MongoDB, Clerk Authentication, and Razorpay payments.

---

## 🏗️ Project Structure

```
CineFlow/
├── frontend/   # React 18 + Vite + Tailwind CSS + Framer Motion
└── backend/    # Node.js + Express + MongoDB
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Clerk account → [clerk.com](https://clerk.com)
- Razorpay account → [razorpay.com](https://razorpay.com)
- Cloudinary account → [cloudinary.com](https://cloudinary.com)

---

### 1. Clone & Setup Frontend

```bash
cd frontend
npm install

# Copy and fill in your keys
cp .env.local.example .env.local
```

**`.env.local`**
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

```bash
npm run dev    # → http://localhost:5173
```

---

### 2. Setup Backend

```bash
cd backend
npm install

# Fill in your credentials
cp .env.example .env
```

**`.env`** — fill in:
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `CLERK_SECRET_KEY` | Clerk backend secret (`sk_test_...`) |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_USER` | Gmail address for notifications |
| `EMAIL_PASS` | Gmail app password |
| `FRONTEND_URL` | `http://localhost:5173` |

```bash
npm run dev    # → http://localhost:5000
```

---

## 🔐 Admin Access

The admin panel is accessible at **`http://localhost:5173/admin/login`**

| Field    | Value                   |
|----------|-------------------------|
| Email    | `admin@cineflow.com`    |
| Password | `Admin@123`             |

> **Note:** These are hardcoded credentials for local/demo use. Change them before deploying to production.

---

## 🔑 Clerk Setup

1. Create an app at [clerk.com](https://clerk.com)
2. Enable: **Email/Password, Google, GitHub, Apple, Phone OTP**
3. Copy `Publishable Key` → `VITE_CLERK_PUBLISHABLE_KEY` in frontend
4. Copy `Secret Key` → `CLERK_SECRET_KEY` in backend
5. To make a user **admin**: set `publicMetadata: { isAdmin: true }` in Clerk dashboard

---

## 💳 Razorpay Setup

1. Create account at [razorpay.com](https://razorpay.com)
2. Go to **Settings → API Keys** → Generate test keys
3. Add `Key ID` and `Secret` to both `.env.local` (frontend) and `.env` (backend)
4. For webhooks: set endpoint to `https://your-domain/api/payments/webhook`

---

## 📡 API Overview

| Category | Base Path |
|---|---|
| Movies | `/api/movies` |
| Theaters | `/api/theaters` |
| Shows | `/api/shows` |
| Bookings | `/api/bookings` |
| Payments | `/api/payments` |
| Users | `/api/users` |
| Admin Analytics | `/api/admin/analytics` |

Health check: `GET /health`

---

## 🎨 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS 3 |
| Animations | Framer Motion, GSAP |
| State | Zustand, TanStack Query |
| Auth | Clerk.com |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Real-time | Socket.io |
| Payment | Razorpay |
| Images | Cloudinary |
| Email | Nodemailer |
| Logging | Winston + Morgan |

---

## 📁 Key Frontend Directories

```
src/
├── components/
│   ├── Common/        # Navbar, Footer, LoadingSpinner
│   ├── Home/          # HeroSection, MovieCarousel, PromoBanner
│   ├── Movies/        # MovieCard, MovieGrid
│   └── Booking/       # SeatMap, BookingSummary
├── pages/
│   ├── Home.jsx
│   ├── Movies.jsx
│   ├── MovieDetail.jsx
│   ├── Booking.jsx
│   ├── Payment.jsx
│   ├── BookingConfirmation.jsx
│   ├── MyBookings.jsx
│   └── Admin/Dashboard.jsx
├── services/          # API layer (axios)
├── store/             # Zustand stores
└── utils/             # formatters, constants
```

---

## 🎭 Features

### User
- ✅ Clerk auth (Email, Google, GitHub, Apple, SMS OTP)
- ✅ Browse & search movies with filters
- ✅ Interactive seat map with VIP/Premium/Standard pricing
- ✅ Razorpay payment integration
- ✅ QR code e-tickets with confetti confirmation
- ✅ My Bookings with cancel support
- ✅ Watchlist & saved theaters

### Admin
- ✅ Analytics dashboard (revenue charts, KPIs)
- ✅ Movie CRUD with Cloudinary image upload
- ✅ Theater & screen management
- ✅ Booking & payment tracking
- ✅ User management (block/unblock)
- ✅ Refund processing

### Real-time
- ✅ Socket.io seat availability updates
- ✅ 5-minute seat hold with auto-release

---

## 🚢 Deployment

### Frontend → Vercel
```bash
cd cineflow-frontend
npm run build
# Deploy dist/ to Vercel — add all VITE_* env vars
```

### Backend → Railway / Render
```bash
# Set all env vars in Railway/Render dashboard
# Start command: node src/server.js
```

### Database → MongoDB Atlas
- Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
- Whitelist `0.0.0.0/0` for production (or specific IPs)
- Copy connection string → `MONGODB_URI`

---

## 📄 License

MIT © CineFlow 2026
