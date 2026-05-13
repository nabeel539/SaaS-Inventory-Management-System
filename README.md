# StockFlow — Precision Inventory Management

A multi-tenant SaaS Inventory Management System built with modern web technologies.

![StockFlow](https://img.shields.io/badge/StockFlow-Inventory_Management-000000?style=for-the-badge)

## 🚀 Live Demo

**Url:** [https://saa-s-inventory-management-system-two.vercel.app/login](https://saa-s-inventory-management-system-two.vercel.app/login)

### 🔑 Demo Credentials
- **Email:** `admin@nexus.com`
- **Password:** `password123`

---

### Frontend
- **React 19** + **Vite** — Lightning-fast build tooling
- **TypeScript** — Type-safe development
- **TailwindCSS v3** — Utility-first styling
- **React Router DOM** — Client-side routing
- **Axios** — HTTP client with interceptors
- **React Hook Form** + **Zod** — Form handling & validation
- **Lucide React** — Beautiful icons

### Backend
- **Node.js** + **Express.js** — REST API server
- **TypeScript** — Full-stack type safety
- **Prisma** — Type-safe ORM
- **PostgreSQL** — Relational database
- **JWT** — Stateless authentication
- **bcryptjs** — Password hashing

## Architecture

```
inventory-management-app/
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React Context (Auth)
│   │   ├── hooks/            # Custom hooks
│   │   ├── layouts/          # Page layouts
│   │   ├── pages/            # Route pages
│   │   ├── services/         # API service layer
│   │   ├── types/            # TypeScript interfaces
│   │   └── utils/            # Utilities & constants
│   └── ...
├── backend/                  # Express + Prisma
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/        # Auth middleware
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic & utils
│   │   ├── types/            # TypeScript definitions
│   │   └── utils/            # Helpers (API response)
│   └── ...
└── README.md
```

## Prerequisites

- **Node.js** >= 20.x
- **PostgreSQL** >= 14
- **npm** >= 9.x

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/inventory-management-app.git
cd inventory-management-app
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your database URL and JWT secret

npm install
npx prisma generate
npx prisma db push    # Push schema to database
npm run dev           # Starts on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env

npm install
npm run dev           # Starts on http://localhost:5173
```

## Environment Variables

### Backend (`.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_SECRET` | Secret key for JWT signing | — |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `PORT` | API server port | `5000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (`.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account + organization |
| POST | `/api/auth/login` | Login with credentials |
| GET | `/api/auth/me` | Get current user (protected) |

### Products (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (paginated, searchable) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Dashboard (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get inventory statistics |

### Settings (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get organization settings |
| PUT | `/api/settings` | Update settings |

## Multi-Tenancy

Every database query is scoped by `organizationId`, extracted from the authenticated user's JWT token. This ensures:
- Complete data isolation between organizations
- Zero cross-tenant data leaks
- Automatic scoping without manual filtering

## Deployment

### Frontend → Vercel / Netlify
```bash
cd frontend && npm run build
```

### Backend → Render / Railway
Set environment variables and deploy the `backend/` directory.

### Database → Neon PostgreSQL
Recommended managed PostgreSQL with connection pooling.

## License

MIT
