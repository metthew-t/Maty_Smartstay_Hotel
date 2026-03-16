<h1 align="center">
  🏨 SmartStay Hotel Management System
</h1>

<p align="center">
  <b>A full-stack, AI-powered hotel management platform built for the modern hospitality industry.</b><br/>
  Manage rooms, bookings, guests, payments, services, and food orders — all in one place.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Django-5.x-092E20?style=for-the-badge&logo=django&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/PostgreSQL-SQLite-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-Channels-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_AI-StayMate-4285F4?style=for-the-badge&logo=google&logoColor=white" />
</p>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Module Overview](#-module-overview)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup (Django)](#backend-setup-django)
  - [Frontend Setup (Next.js)](#frontend-setup-nextjs)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [User Roles](#-user-roles)
- [Payment System](#-payment-system)
- [AI Chatbot — StayMate](#-ai-chatbot--staymate)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 About the Project

**SmartStay** is a comprehensive **Hotel Management System** designed to digitize and streamline every aspect of a hotel's operations. From the moment a guest browses available rooms to the moment they check out and receive an invoice, SmartStay handles it all.

The system features:
- A powerful **Django REST Framework** backend with JWT authentication
- A sleek **Next.js / React** frontend with separate portals for **Guests**, **Staff**, and **Admins**
- **AI-powered customer support** via the integrated Google Gemini chatbot (StayMate AI)
- **Online payment processing** via **Chapa** (supporting Ethiopian payment methods like TeleBirr, CBE, Awash Bank, and card payments)
- Real-time capabilities via **Django Channels** (WebSocket support)
- Automatic **PDF invoice generation**

---

## ✨ Key Features

### 🛏️ Room Management
- Define **Room Categories** with base prices and amenities
- Create individual rooms with:
  - Floor, capacity, area (m²)
  - Status tracking: `Available`, `Occupied`, `Maintenance`, `Reserved`
  - View type: Ocean View, Garden View, City View, Pool View
  - Quality tier: Standard, Premium, Luxury, VIP Suite
  - Individual amenity flags (WiFi, TV, Minibar, Safe, Balcony, Nightwear, Toiletries, etc.)
  - Bed type, bathroom type, and special features
- Attach **images and videos** to any room

### 📅 Booking System
- Guests can browse rooms and make **reservations** with check-in/check-out dates
- Full booking lifecycle: `Pending → Confirmed → Checked In → Checked Out → Cancelled`
- Support for **special requests** and multi-guest bookings
- Automated **total price calculation**

### 💳 Payment Processing
- Supports multiple payment methods:
  - Credit Card, Debit Card, Bank Transfer
  - **CBE, Awash Bank, TeleBirr** (Ethiopian payment methods)
  - Cash
- **Chapa Payment Gateway** integration for online transactions
- Automatic **Invoice** creation upon payment completion
- **PDF invoice download** for each payment
- Webhook support for real-time payment status updates

### 🤖 StayMate AI Chatbot
- Powered by **Google Gemini** (Generative AI)
- Maintains conversation history per user session
- Hotel-specific context: rooms, services, dining, policies
- Responds in **multiple languages**: English, Amharic, Oromo, Spanish, French, Arabic, Urdu, Chinese
- Falls back to an informative offline mode if the API key is not configured

### 🍽️ Food & Room Service Ordering
- Full **digital menu** with categories: Breakfast, Lunch, Dinner, Dessert, Beverages, Snacks
- Rich **dietary information** per item: Vegetarian, Vegan, Gluten-Free, Dairy-Free, Nut-Free
- Detailed **nutritional data**: calories, protein %, carbs %, fat %, fiber %
- Order status tracking: `Pending → Preparing → Ready → Delivered → Cancelled`
- Orders linked to guest's active booking and room number

### 🛎️ Hotel Services
- Guests can request services: **Housekeeping, Room Service, Maintenance, Concierge, Spa**
- Each request tied to the guest's current booking
- Status tracking: `Pending → In Progress → Completed → Cancelled`

### 🔔 Notification System
- Automated notifications for:
  - Booking confirmations and updates
  - Service request status changes
  - Payment receipts
  - System announcements
- Unread/read tracking per user

### 👤 User Account System
- Custom user model with **three roles**: `Admin`, `Staff`, `Guest`
- Guest-specific profile fields: date of birth, nationality, passport number, preferences
- Profile picture upload support
- JWT-based secure authentication (Access Token: 60 min | Refresh Token: 1 day)

### 📊 Analytics Dashboard
- Admin dashboard with analytics views for bookings, revenue, and occupancy
- Management commands for scheduled data processing

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend Framework** | Django 5.x, Django REST Framework |
| **API Authentication** | JWT via `djangorestframework-simplejwt` |
| **Frontend Framework** | Next.js 16, React 19 |
| **Real-time** | Django Channels, Redis |
| **Database** | SQLite (dev), PostgreSQL (prod via `dj-database-url`) |
| **AI / Chatbot** | Google Gemini API (`google-generativeai`) |
| **Payments** | Chapa Payment Gateway |
| **PDF Generation** | ReportLab |
| **Static Files (Prod)** | WhiteNoise |
| **Task Scheduling** | APScheduler |
| **Deployment** | Render (via `render.yaml`), Gunicorn |
| **Media Storage** | `django-storages` |
| **API Docs** | drf-yasg (Swagger / ReDoc) |
| **Image Processing** | Pillow |

---

## 🏗️ Project Architecture

```
smartstay/                    ← Django project root
│
├── smartstay/                ← Core Django configuration
│   ├── settings.py           ← App settings, JWT, CORS, DB, Channels
│   ├── urls.py               ← Root URL configuration
│   ├── asgi.py               ← ASGI (WebSocket) entry point
│   └── wsgi.py               ← WSGI (HTTP) entry point
│
├── accounts/                 ← Custom User model & authentication
├── booking/                  ← Rooms, Room Categories, Bookings
├── services/                 ← Hotel services & food/menu ordering
├── payments/                 ← Payments, invoices & Chapa integration
├── chatbot/                  ← StayMate AI (Gemini-powered assistant)
├── analytics/                ← Admin analytics & dashboard data
├── notifications/            ← In-app notification system
├── api/                      ← Shared API utilities & permissions
│
├── frontend/                 ← Next.js frontend application
│   └── app/
│       ├── page.js           ← Landing / login page
│       ├── register/         ← Guest registration
│       ├── guest/            ← Guest portal (booking, food, chat, payments...)
│       │   ├── booking/      ← Browse & book rooms
│       │   ├── bookings/     ← View my bookings
│       │   ├── food/         ← Browse & order from the menu
│       │   ├── orders/       ← My food order history
│       │   ├── services/     ← Request hotel services
│       │   ├── payments/     ← Payment history & checkout
│       │   ├── chat/         ← StayMate AI chatbot
│       │   ├── notifications/ ← In-app notifications
│       │   └── profile/      ← Manage profile
│       ├── staff/            ← Staff portal
│       └── admin/            ← Admin portal (rooms, users, bookings, settings)
│
├── media/                    ← User-uploaded files (profile pics, room images)
├── requirements.txt          ← Python dependencies
├── render.yaml               ← Render.com deployment config
└── manage.py                 ← Django management entry point
```

---

## 📦 Module Overview

### `accounts` — User Management
Extends Django's `AbstractUser` with hotel-specific fields.

| Field | Purpose |
|---|---|
| `role` | `ADMIN`, `STAFF`, or `GUEST` |
| `phone` | Guest/staff contact |
| `address` | Physical address |
| `profile_picture` | Uploaded profile image |
| `date_of_birth` | Guest profile |
| `nationality` | Guest profile |
| `passport_number` | Guest document info |
| `preferences` | JSON field for guest preferences |

---

### `booking` — Room & Reservation Management

**Models:**
- **`RoomCategory`** — Defines room types with base pricing and amenities list
- **`Room`** — Individual room with full attribute set (floor, status, view, quality, amenities)
- **`RoomMedia`** — Images/videos associated with each room
- **`Booking`** — Guest reservations with full lifecycle management

**Booking Statuses:** `PENDING → CONFIRMED → CHECKED_IN → CHECKED_OUT → CANCELLED`

---

### `services` — Hotel Services & Food Ordering

**Service Types:**
`HOUSEKEEPING`, `ROOM_SERVICE`, `MAINTENANCE`, `CONCIERGE`, `SPA`

**Food System:**
- **`MenuItem`** — Menu item with price, category, dietary flags, and nutritional data
- **`FoodOrder`** — A guest's food order linked to a room/booking
- **`OrderItem`** — Individual item within an order with quantity and notes

---

### `payments` — Payments & Invoicing

**Payment Methods:** Credit Card, Debit Card, Bank Transfer, CBE, Awash Bank, TeleBirr, Cash

**Core Flow:**
1. Guest initiates payment → `PENDING` record created
2. Chapa gateway processes payment → `COMPLETED`
3. Invoice automatically generated with a unique invoice number (`INV-XXXXXXXX`)
4. Guest can download a PDF invoice at any time

---

### `chatbot` — StayMate AI Assistant

- **`ChatSession`** — A conversation session per user
- **`ChatMessage`** — Individual message-response pairs saved for context

The AI uses the last **5 messages** as context to maintain a coherent conversation.

---

### `notifications` — In-App Alerts

**Notification Types:** `BOOKING`, `SERVICE`, `PAYMENT`, `SYSTEM`

Each notification has a read/unread state and is automatically sorted by most recent.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Python** 3.10+
- **Node.js** 18+ and **npm**
- **Redis** (for Django Channels / WebSocket support)
- **Git**

---

### Backend Setup (Django)

**1. Clone the repository**
```bash
git clone https://github.com/your-username/smartstay.git
cd smartstay
```

**2. Create and activate a virtual environment**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate
```

**3. Install Python dependencies**
```bash
pip install -r requirements.txt
```

**4. Set up environment variables**

Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables) section below).

**5. Run database migrations**
```bash
python manage.py migrate
```

**6. (Optional) Seed sample data**
```bash
# Seed rooms
python seed_rooms_expanded.py

# Seed guest accounts for testing
python create_test_guest.py

# Seed staff accounts
python create_test_staff.py

# Seed food/restaurant data
python seed_pasta.py
```

**7. Create a superuser (Admin)**
```bash
python manage.py createsuperuser
```

**8. Start the Django development server**
```bash
python manage.py runserver
```

The backend API will be available at: **`http://127.0.0.1:8000/`**

---

### Frontend Setup (Next.js)

**1. Navigate to the frontend directory**
```bash
cd frontend
```

**2. Install Node dependencies**
```bash
npm install
```

**3. Start the development server**
```bash
npm run dev
```

The frontend will be available at: **`http://localhost:3000`**

> ⚠️ The frontend expects the Django backend to be running on port `8000`. Ensure both servers are running simultaneously.

---

## 🔐 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Django Core
SECRET_KEY=your-django-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (leave empty to use SQLite, or provide PostgreSQL URL)
DATABASE_URL=

# CORS (for production)
CORS_ALLOWED_ORIGINS=http://localhost:3000

# AI Chatbot
GEMINI_API_KEY=your-google-gemini-api-key-here

# Payment Gateway (Chapa)
CHAPA_SECRET_KEY=your-chapa-secret-key-here

# Email (SMTP)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=SmartStay Hotel <noreply@smartstay.com>
```

> **Note:** If `GEMINI_API_KEY` is not set, the chatbot will run in **offline mode** with a fallback response.
> If `CHAPA_SECRET_KEY` is not set, payments will run in **mock mode** — useful for development and testing.

---

## 📡 API Overview

The backend exposes a RESTful API under the `/api/` prefix. Authentication uses **JWT Bearer Tokens**.

### Authentication
| Endpoint | Method | Description |
|---|---|---|
| `/api/accounts/register/` | `POST` | Register a new guest account |
| `/api/accounts/login/` | `POST` | Login and receive JWT tokens |
| `/api/accounts/token/refresh/` | `POST` | Refresh access token |
| `/api/accounts/profile/` | `GET/PUT` | View or update user profile |

### Rooms & Bookings
| Endpoint | Method | Description |
|---|---|---|
| `/api/booking/rooms/` | `GET` | List all available rooms |
| `/api/booking/rooms/<id>/` | `GET` | Get room details |
| `/api/booking/bookings/` | `GET/POST` | List or create bookings |
| `/api/booking/bookings/<id>/` | `GET/PATCH/DELETE` | Manage a specific booking |

### Services & Food
| Endpoint | Method | Description |
|---|---|---|
| `/api/services/` | `GET` | List available hotel services |
| `/api/services/requests/` | `GET/POST` | View or create service requests |
| `/api/services/menu/` | `GET` | Browse the restaurant menu |
| `/api/services/food-orders/` | `GET/POST` | View or place food orders |

### Payments
| Endpoint | Method | Description |
|---|---|---|
| `/api/payments/pay/` | `POST` | Create a direct payment record |
| `/api/payments/my-payments/` | `GET` | View payment history |
| `/api/payments/invoices/` | `GET` | View invoices |
| `/api/payments/invoices/<id>/pdf/` | `GET` | Download invoice as PDF |
| `/api/payments/chapa/initialize/` | `POST` | Initialize Chapa online payment |
| `/api/payments/chapa-webhook/` | `POST` | Chapa payment webhook |

### Chatbot
| Endpoint | Method | Description |
|---|---|---|
| `/api/chatbot/chat/` | `POST` | Send a message to StayMate AI |
| `/api/chatbot/history/` | `GET` | Retrieve chat history |

### Notifications
| Endpoint | Method | Description |
|---|---|---|
| `/api/notifications/` | `GET` | List all notifications |
| `/api/notifications/<id>/read/` | `PATCH` | Mark a notification as read |

> 📄 **Interactive API Docs** available at `http://127.0.0.1:8000/swagger/` (Swagger UI) and `/redoc/` (ReDoc).

---

## 👥 User Roles

SmartStay has a **role-based access control** system with three user types:

| Role | Access Level | Portal |
|---|---|---|
| 🔴 **Admin** | Full system access — manage rooms, users, all bookings, settings | `/admin/` portal in frontend + Django admin panel |
| 🟡 **Staff** | Operational access — view and manage bookings, service requests, food orders | `/staff/` portal |
| 🟢 **Guest** | Self-service access — browse rooms, make bookings, order food, chat with AI, manage payments | `/guest/` portal |

---

## 💰 Payment System

SmartStay integrates with **[Chapa](https://chapa.co/)**, a leading Ethiopian fintech payment gateway.

### Supported Methods
| Method | Type |
|---|---|
| Credit Card | International |
| Debit Card | International |
| Bank Transfer | Bank |
| **CBE** | Commercial Bank of Ethiopia |
| **Awash Bank** | Ethiopian Bank |
| **TeleBirr** | Ethio Telecom Mobile Money |
| Cash | On-site |

### Payment Flow

```
Guest → Selects Payment Method
       ↓
   [CHAPA_SECRET_KEY set?]
   ├── YES → Redirects to real Chapa checkout portal
   │         ↓
   │   Chapa webhook confirms payment → Invoice auto-generated
   └── NO  → Mock mode (dev/test) → Simulated checkout → Payment marked COMPLETED
                                                         ↓
                                                   Invoice auto-generated
                                                         ↓
                                                   PDF available for download
```

---

## 🤖 AI Chatbot — StayMate

**StayMate** is SmartStay's built-in AI concierge, powered by **Google Gemini**.

### What StayMate Knows
- Room types, pricing, and amenities
- Check-in / check-out policies (2:00 PM / 12:00 PM)
- Available hotel services (Spa, Laundry, Airport Shuttle...)
- Dining options (Breakfast, Lunch, Dinner, featured dishes)
- General hotel information

### Key Capabilities
- ✅ Maintains conversation history (context-aware responses)
- ✅ Multilingual: English, Amharic, Oromo, Spanish, French, Arabic, Urdu, Chinese
- ✅ Graceful offline fallback when API key is not configured
- ✅ All conversations are stored in the database per session

### Configuration
Set your `GEMINI_API_KEY` in `.env` to enable AI responses. Without it, StayMate will run in **offline mode** and provide a static response with useful hotel information.

---

## ☁️ Deployment

SmartStay is configured for deployment on **[Render](https://render.com/)** via the included `render.yaml`:

### Backend (Render Web Service)
```yaml
# render.yaml handles:
- gunicorn as the WSGI server
- WhiteNoise for static file serving
- dj-database-url for PostgreSQL connection
- Environment variable injection
```

### Quick Deploy Steps

1. Push your code to GitHub
2. Connect the repository to Render
3. Render will auto-detect `render.yaml` and provision the service
4. Set the required environment variables in the Render dashboard
5. The backend will auto-run `python manage.py migrate` on each deploy

### Production Checklist
- [ ] Set `DEBUG=False`
- [ ] Set a strong `SECRET_KEY`
- [ ] Configure a PostgreSQL database (`DATABASE_URL`)
- [ ] Set `ALLOWED_HOSTS` to your domain
- [ ] Set `CORS_ALLOWED_ORIGINS` to your frontend URL
- [ ] Provide `GEMINI_API_KEY` for the AI chatbot
- [ ] Provide `CHAPA_SECRET_KEY` for real payment processing
- [ ] Configure email credentials (`EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`)

---

## 🧱 Database Schema (Key Relations)

```
User (accounts.User)
 ├── Booking (booking.Booking)  ←→  Room (booking.Room)
 │      └── ServiceRequest (services.ServiceRequest) → Service
 │      └── FoodOrder (services.FoodOrder) → OrderItem → MenuItem
 │      └── Payment (payments.Payment) → Invoice
 ├── ChatSession (chatbot.ChatSession) → ChatMessage
 └── Notification (notifications.Notification)

Room → RoomCategory
Room → RoomMedia (images/videos)
```

---

## 🤝 Contributing

Contributions are always welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a new branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'Add: your feature description'`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open a Pull Request** and describe your changes

Please keep pull requests focused on a single feature or bug fix. Follow PEP 8 for Python and ESLint conventions for JavaScript.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by the SmartStay Team &nbsp;|&nbsp; Powered by Django, Next.js & Google Gemini
</p>
