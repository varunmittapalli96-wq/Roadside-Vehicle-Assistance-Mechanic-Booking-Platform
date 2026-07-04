# Technical Documentation

## Architecture Overview

```
┌─────────────────┐     REST/JSON      ┌─────────────────┐
│   Next.js App   │ ◄────────────────► │  Express API    │
│   (Port 3000)   │     JWT Auth         │   (Port 5000)   │
└─────────────────┘                      └────────┬────────┘
                                                  │
                                         ┌────────▼────────┐
                                         │    MongoDB      │
                                         │  (GeoJSON 2dsphere) │
                                         └─────────────────┘
```

## Backend

### Stack
- **Runtime:** Node.js
- **Framework:** Express.js 4.x
- **ODM:** Mongoose 8.x
- **Auth:** jsonwebtoken + bcryptjs

### Models

#### User
- Roles: `user`, `mechanic`, `admin`
- GeoJSON location with 2dsphere index
- Embedded mechanic profile (pricing, rating, services)

#### Vehicle
- Linked to user via `userId`
- Make, model, year, license plate, fuel type

#### ServiceRequest
- Full lifecycle with `statusHistory` audit trail
- GeoJSON for breakdown location and mechanic location
- Rating and feedback on completion

### Key Algorithms

**Nearby mechanic search:** Fetches verified available mechanics, calculates Haversine distance from user coordinates, filters within 50km, sorts by distance.

**ETA estimation:** `distance / 30 km/h * 60` minutes (minimum 5 min).

### Authentication Flow
1. Register/login returns JWT (7-day expiry)
2. Protected routes require `Authorization: Bearer <token>`
3. Role-based access via `authorize()` middleware

## Frontend

### Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.x
- **Icons:** Lucide React

### State Management
- React Context for auth (`AuthProvider`)
- Local component state for forms and lists
- Polling (5–15s) for live tracking updates

### Route Structure

| Path | Role | Purpose |
|------|------|---------|
| `/` | Public | Landing page |
| `/login`, `/register` | Public | Authentication |
| `/dashboard/user/*` | User | Vehicles, requests, tracking |
| `/dashboard/mechanic/*` | Mechanic | Jobs, earnings, profile |
| `/dashboard/admin/*` | Admin | Verification, monitoring |

## Environment Variables

### Backend (`.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/roadside_assistance
JWT_SECRET=<strong-secret>
NODE_ENV=development
```

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Database Indexes

- `User.location` — 2dsphere (geospatial queries)
- `User.role + isVerified` — compound (mechanic filtering)
- `ServiceRequest.location` — 2dsphere
- `ServiceRequest.status + createdAt` — compound (admin dashboard)

## Deployment Checklist

1. Set production `JWT_SECRET`
2. Configure MongoDB Atlas connection string
3. Deploy backend (Railway/Render/AWS)
4. Set `NEXT_PUBLIC_API_URL` on frontend
5. Deploy frontend to Vercel/Netlify
6. Enable CORS for production domain on backend

## Security Notes

- Passwords hashed with bcrypt (12 rounds)
- JWT stored in localStorage (Phase 1); consider httpOnly cookies for production
- Role checks on both frontend routing and backend middleware
- No payment data in Phase 1

---

*Technical documentation for Unified Mentor project submission.*
