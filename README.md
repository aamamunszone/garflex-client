<div align="center">

# 📦 GarFlex Client

### Modern Garments Manufacturing & Order Management Dashboard

🌐 [Live Site](https://garflex-client.web.app) | 🐛 [Report Bug](https://github.com/aamamunszone/garflex-client/issues) | ✨ [Request Feature](https://github.com/aamamunszone/garflex-client/issues)

</div>

---

## 📋 Table of Contents

- [🎯 About The Project](#-about-the-project)
- [✨ Core Features](#-core-features)
- [🛠 Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🔐 Dashboard Roles](#-dashboard-roles)
- [📂 Project Structure](#-project-structure)
- [🎨 UI/UX Highlights](#-uiux-highlights)
- [📸 Screenshots](#-screenshots)
- [👨‍💻 Developer](#-developer)

---

## 🎯 About The Project

**GarFlex Client** is a feature-rich React-based web application designed to streamline the garments manufacturing and order management process. It provides a seamless experience for buyers to place bulk orders, managers to oversee production, and admins to manage the entire ecosystem.

The application focuses on **speed**, **security**, and **user-centered design**, featuring real-time order tracking with location-based updates and secure payment gateways.

### Why GarFlex?

- 🎯 **Efficient Order Management** – Simplified bulk garment ordering process
- 📍 **Real-time Tracking** – Live location-based production and delivery updates
- 💳 **Secure Payments** – Integrated Stripe payment gateway
- 👥 **Multi-role System** – Specialized dashboards for different user types
- 📊 **Analytics Dashboard** – Comprehensive statistics and insights

---

## ✨ Core Features

### 🧩 User Experience

✅ **Dynamic Product Catalog** – Browse garments with advanced filtering and search  
✅ **Smart Order Placement** – Intuitive bulk order form with instant price calculation  
✅ **Stripe Payment** – Secure credit/debit card checkout process  
✅ **Real-time Tracking** – Live status updates with location-based tracking on map  
✅ **Multi-role Dashboard** – Tailored interfaces for Admin, Manager, and Buyer  
✅ **Order History** – Complete transaction and order history with filtering

### 🔐 Security & Logic

✅ **Firebase Auth** – Secure login with Email/Password and Google Social Auth  
✅ **Private Routes** – Protected dashboard access based on user roles and authentication  
✅ **Axios Interceptors** – Automated JWT token injection for secure API communication  
✅ **Form Validation** – Robust client-side validation using React Hook Form  
✅ **Role-based Access Control** – Granular permissions for different user types

### 📱 Additional Features

✅ **Responsive Design** – Fully optimized for mobile, tablet, and desktop  
✅ **Interactive Maps** – React Leaflet integration for location tracking  
✅ **Pagination** – Industry-standard pagination (15 items per page)  
✅ **Smooth Animations** – Framer Motion for elegant transitions  
✅ **Dark Mode** – Theme switching capability  
✅ **Toast Notifications** – Real-time user feedback

---

## 🛠 Tech Stack

### Frontend Core

- **React.js 18** – Component-based UI library
- **React Router v6** – Declarative routing for SPA navigation
- **TanStack Query (v5)** – Powerful data fetching and state management
- **Tailwind CSS & DaisyUI** – Modern utility-first CSS framework and components

### UI & Animation

- **Motion (Framer Motion)** – Smooth UI animations and transitions
- **React Leaflet** – Interactive maps for order tracking
- **Lucide React & React Icons** – Modern iconography
- **SweetAlert2** – Elegant pop-up notifications
- **React Hot Toast** – Lightweight toast notifications

### Tools & Integrations

- **Stripe SDK** – Secure online payment processing
- **Firebase** – Authentication and hosting
- **Axios** – HTTP client with interceptors
- **React Hook Form** – Efficient form management
- **Vite** – Lightning-fast build tool

---

## 🚀 Getting Started

### 🔧 Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

### 🪄 Installation

**1. Clone the repository**

```bash
git clone https://github.com/aamamunszone/garflex-client.git
cd garflex-client
```

**2. Install dependencies**

```bash
npm install
```

**3. Setup environment variables**

Create a `.env.local` file in the project root:

```env
# Firebase Configuration
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_auth_domain
VITE_projectId=your_project_id
VITE_storageBucket=your_storage_bucket
VITE_messagingSenderId=your_sender_id
VITE_appId=your_app_id

# Stripe
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key

# API
VITE_API_URL=https://garflex-server.vercel.app
```

**4. Run the application**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 📦 Build for Production

```bash
npm run build
```

### 🚀 Deploy to Firebase

```bash
npm run build
firebase deploy
```

---

## 🔐 Dashboard Roles

### 👤 Buyer

**Permissions:**

- Browse and search product catalog
- Place bulk garment orders
- View order history with filtering
- Track orders in real-time with map
- Make secure payments via Stripe
- Cancel pending orders
- View personal dashboard statistics

**Key Pages:**

- My Orders
- Track Order (with interactive map)
- Order History
- Profile Settings

---

### 💼 Manager

**Permissions:**

- View all orders in the system
- Approve or reject pending orders
- Update order tracking information
- Add production status updates with location
- View manager-specific statistics
- Manage order lifecycle (Cutting, Sewing, Finishing, QC, Packing, Shipping)

**Key Pages:**

- All Orders Management
- Order Tracking Updates
- Production Statistics
- Approval Queue

---

### 🛠 Admin

**Permissions:**

- Full access to all system features
- Manage all users (promote/demote roles)
- View global statistics and analytics
- Manage product catalog (CRUD operations)
- Delete any order
- Access comprehensive dashboard with charts
- System configuration and settings

**Key Pages:**

- Dashboard (with charts and analytics)
- User Management
- Product Management
- Order Management (full access)
- System Statistics

---

## 📂 Project Structure

```
garflex-client/
├── src/
│   ├── api/                    # Axios instances and API configurations
│   │   ├── axiosPublic.js     # Public API instance
│   │   └── axiosSecure.js     # Secure API with interceptors
│   ├── components/
│   │   ├── common/            # Reusable components
│   │   │   ├── Container/
│   │   │   ├── Loader/
│   │   │   └── Navbar/
│   │   ├── products/          # Product-related components
│   │   │   └── ProductCard/
│   │   └── dashboard/         # Dashboard components
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.jsx       # Authentication hook
│   │   ├── useAxios.jsx      # Public axios hook
│   │   └── useAxiosSecure.jsx # Secure axios hook
│   ├── layouts/
│   │   ├── MainLayout.jsx    # Public layout
│   │   └── DashboardLayout.jsx # Dashboard layout
│   ├── pages/
│   │   ├── Home/             # Landing page
│   │   ├── AllProducts/      # Product catalog
│   │   ├── Auth/             # Login/Register
│   │   └── Dashboard/        # Role-specific dashboards
│   │       ├── Admin/
│   │       ├── Manager/
│   │       └── Buyer/
│   ├── providers/
│   │   └── AuthProvider.jsx  # Auth context provider
│   ├── routes/
│   │   ├── Routes.jsx        # Main routing configuration
│   │   └── PrivateRoute.jsx  # Protected route wrapper
│   ├── firebase/
│   │   └── firebase.config.js # Firebase initialization
│   ├── assets/               # Images and global styles
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── products/             # Product images
├── index.html
├── tailwind.config.js        # Tailwind configuration
├── vite.config.js            # Vite configuration
├── .firebaserc               # Firebase project config
├── firebase.json             # Firebase hosting config
└── package.json
```

---

## 🎨 UI/UX Highlights

### Design Philosophy

- **Minimalist & Modern** – Clean interface with focus on functionality
- **Consistent Branding** – Cohesive color scheme and typography
- **Intuitive Navigation** – User-friendly routing and breadcrumbs
- **Accessible** – WCAG compliant with proper ARIA labels

### Technical Highlights

✅ **Responsive Design** – Fully optimized for Mobile, Tablet, and Desktop  
✅ **Skeleton Loaders** – Smooth loading states for premium feel  
✅ **Interactive Charts** – Visual representation of statistics (Admin)  
✅ **Toast Notifications** – Real-time feedback for every user action  
✅ **Smooth Animations** – Page transitions and micro-interactions  
✅ **Optimized Images** – Lazy loading and proper image optimization  
✅ **Error Boundaries** – Graceful error handling and fallbacks  
✅ **Progressive Enhancement** – Works without JavaScript where possible

### Component Library

- **Custom Container** – Consistent max-width wrapper
- **Reusable Cards** – Product cards, order cards, stat cards
- **Modal System** – Dynamic modals for order details and tracking
- **Form Components** – Validated input fields with error states
- **Table Components** – Sortable and filterable data tables
- **Badge System** – Status indicators for orders and payments

---

## 📸 Screenshots

### 🏠 Landing Page

- Hero section with call-to-action
- Product showcase with filtering
- Feature highlights
- Coverage area with interactive map

### 📦 Product Catalog

- Grid layout with product cards
- Category filtering
- Search functionality
- Pagination (15 items per page)

### 📊 Dashboards

#### Buyer Dashboard

- Order history table
- Real-time tracking with map
- Payment history
- Quick stats overview

#### Manager Dashboard

- Order approval queue
- Tracking update form
- Production statistics
- Status management

#### Admin Dashboard

- Comprehensive analytics
- User management table
- Product CRUD interface
- System-wide statistics

---

## 🔧 Configuration Files

### Tailwind Config (`tailwind.config.js`)

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
  },
};
```

### Firebase Config (`firebase.json`)

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 🚀 Performance Optimizations

- **Code Splitting** – Lazy loading of routes and components
- **React Query Caching** – Optimized data fetching with cache management
- **Image Optimization** – Compressed images and lazy loading
- **Bundle Size** – Tree-shaking and minification
- **Memoization** – useMemo and useCallback for expensive operations
- **Virtual Scrolling** – For large lists (planned feature)

---

## 🐛 Known Issues & Future Enhancements

### Planned Features

- [ ] Email notifications for order updates
- [ ] SMS alerts for delivery
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Bulk order import via CSV
- [ ] Invoice generation and download
- [ ] Live chat support

### Bug Reports

If you encounter any issues, please [create an issue](https://github.com/aamamunszone/garflex-client/issues) on GitHub.

---

## 👨‍💻 Developer

<div align="center">

**Abdullah Al Mamun**  
Full Stack Developer | MERN Stack Specialist

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/aamamunszone)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/aamamunszone)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](https://aamamuns.vercel.app)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:aamamunszone@gmail.com)

</div>

---

<div align="center">

### 📊 Project Stats

![React](https://img.shields.io/badge/React-18.3-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-purple?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-cyan?style=flat-square&logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-10.x-orange?style=flat-square&logo=firebase)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

Made with ❤️ and 📦 by **Abdullah Al Mamun**

⭐ **Star this repo if you like it!**

</div>
