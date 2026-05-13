# StockFlow

StockFlow is a modern SaaS-based Inventory Management System built as part of a Full Stack Developer technical assessment.

The objective of this project is to create a minimal multi-tenant inventory platform where users can manage products, monitor stock levels, and track low inventory items through a clean and responsive dashboard.

---

## Tech Stack

### Frontend

* React + Vite
* TypeScript
* Tailwind CSS
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* PostgreSQL
* Prisma ORM

### Authentication

* JWT Authentication
* bcrypt password hashing

---

## Project Structure

```bash
stockflow/
├── frontend/
├── backend/
└── README.md
```

---

## Planned Features

* User Authentication
* Multi-Tenant Organization Support
* Dashboard Overview
* Product Management
* Inventory Tracking
* Low Stock Alerts
* Settings Management
* Responsive UI

---

## Current Status

Initial project setup and architecture are currently in progress.

This repository currently includes:

* Frontend boilerplate setup
* Backend boilerplate setup
* Tailwind CSS configuration
* Prisma setup
* Basic folder structure
* Initial routing and API structure

Additional features and implementation will be added incrementally.

---

## Local Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

---

## Environment Variables

### Backend

Create a `.env` file inside the `backend/` directory:

```env
DATABASE_URL=
JWT_SECRET=
PORT=5000
```

### Frontend

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Database

Prisma ORM is used for database management.

Run database migrations:

```bash
npx prisma migrate dev
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

## Planned Deployment

* Frontend → Vercel / Netlify
* Backend → Render / Railway
* Database → Neon PostgreSQL

---

## Author

Mohammed Nabeel Ahemad
