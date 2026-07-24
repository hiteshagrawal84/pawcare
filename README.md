# PawCare — Premium Pet Care Website Template

Production-ready, Docker-based SaaS pet care platform with a modern public website, customer portal, and full admin CMS.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, React Hook Form, Zod |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB |
| Auth | JWT + bcrypt, role-based access (Super Admin, Admin, Doctor, Customer) |
| Storage | AWS S3–compatible (MinIO locally) |
| Infra | Docker Compose |

## Quick Start (Docker)

```bash
# 1. Clone / open project
cd petcare

# 2. Start all services
docker compose up --build -d

# 3. Seed demo data (first time)
docker compose exec backend npm run seed

# 4. Open the app
# Frontend: http://localhost:3010  (host port; container uses 3000)
# API:      http://localhost:5001/api/health  (host 5001 → container 5000; avoids macOS AirPlay on 5000)
# MinIO:    http://localhost:9001 (pawcare / pawcaresecret)
```

> **Port notes:** On macOS, port `5000` is often used by AirPlay Receiver. This compose file maps the API to **5001** and the frontend to **3010**. Adjust `docker-compose.yml` if needed.## Demo Accounts

Password for all: `Password123!`

| Role | Email |
|------|-------|
| Super Admin | superadmin@pawcare.vet |
| Admin | admin@pawcare.vet |
| Doctor | sarah@pawcare.vet |
| Customer | customer@pawcare.vet |

## Local Development (without Docker for apps)

```bash
# Terminal 1 — MongoDB (or use docker compose up mongo minio -d)
docker compose up mongo minio minio-init -d

# Terminal 2 — Backend
cd backend
cp .env.example .env   # adjust MONGODB_URI to mongodb://localhost:27017/pawcare
npm install
npm run seed
npm run dev

# Terminal 3 — Frontend
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## Project Structure

```
petcare/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── seed/
│   │   └── utils/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # UI, layout, home, admin
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── services/      # API clients
│   │   ├── store/         # Zustand auth + cart
│   │   ├── types/
│   │   └── lib/
│   ├── Dockerfile
│   └── package.json
├── design/                # Original Figma Make design reference
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

## Features

### Public Website
- Homepage matching the premium PawCare design (green/orange theme)
- Services, Doctors, Shop (search/filter/cart/checkout), Adoption, Blog, Contact
- Appointment booking with live API persistence
- SEO: metadata, Open Graph, Schema.org VeterinaryClinic, robots.txt, sitemap.xml

### Customer Dashboard
- Profile, appointments, orders, saved pets, wishlist, reviews

### Admin Dashboard
- Stats cards + appointment/revenue/customer charts
- CRUD: Users, Doctors, Services, Appointments, Pets, Adoption, Products, Orders, Blogs
- Media library (S3/MinIO), Settings (SEO, contact, announcement)

## API Overview

Base URL: `/api`

| Resource | Endpoints |
|----------|-----------|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Users | `GET/POST /users`, `PATCH/DELETE /users/:id` |
| Doctors | `GET/POST /doctors`, `PATCH/DELETE /doctors/:id` |
| Services | `GET/POST /services`, `PATCH/DELETE /services/:id` |
| Appointments | `POST /appointments`, `GET /appointments`, `PATCH /appointments/:id` |
| Products | `GET/POST /products`, categories under `/products/categories` |
| Orders | `POST/GET /orders`, `PATCH /orders/:id` |
| Adoptions | `GET/POST /adoptions`, `POST /adoptions/:id/request` |
| Blogs | `GET/POST /blogs`, `PATCH/DELETE /blogs/:id` |
| Admin | `GET /admin/dashboard`, `GET/PATCH /admin/settings`, media upload |

All list endpoints support `page`, `limit`, `search`, and relevant filters.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Strong random secret |
| `CORS_ORIGIN` | Frontend origin |
| `S3_*` | S3/MinIO credentials and endpoint |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | e.g. `http://localhost:5000/api` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |

---

## Deployment Guide

### 1. Frontend → Vercel

1. Push the repo to GitHub.
2. Import the **`frontend`** folder as a Vercel project (Root Directory: `frontend`).
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://api.yourdomain.com/api`
   - `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`
4. Deploy. Vercel builds with `npm run build`.

### 2. Backend → VPS (Docker)

```bash
# On your VPS
git clone <repo> && cd petcare
cp backend/.env.example backend/.env
# Edit backend/.env:
#   MONGODB_URI=mongodb+srv://... (Atlas) OR local mongo
#   JWT_SECRET=<strong-secret>
#   CORS_ORIGIN=https://yourdomain.com
#   S3_* = your AWS S3 or keep MinIO

docker compose -f docker-compose.prod.yml up --build -d
docker compose -f docker-compose.prod.yml exec backend npm run seed
```

Put Nginx or Caddy in front:

```nginx
server {
  server_name api.yourdomain.com;
  location / {
    proxy_pass http://127.0.0.1:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

### 3. MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow your VPS IP (or `0.0.0.0/0` for testing).
3. Copy the connection string into `MONGODB_URI`.
4. Restart the backend container.

### 4. AWS S3 (production media)

```env
S3_ENDPOINT=
S3_PUBLIC_URL=https://your-bucket.s3.amazonaws.com
S3_ACCESS_KEY=AKIA...
S3_SECRET_KEY=...
S3_BUCKET=pawcare
S3_REGION=us-east-1
S3_FORCE_PATH_STYLE=false
```

---

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT authentication with role guards
- Helmet, CORS, rate limiting, mongo-sanitize
- Secure file upload filtering (type + size)

## License

Premium template — customize and sell as a white-label pet care website.
