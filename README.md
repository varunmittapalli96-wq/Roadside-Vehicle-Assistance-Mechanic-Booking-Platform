# Roadside AAA — Vehicle Assistance & Mechanic Booking Platform

A real-time, on-demand roadside assistance platform connecting vehicle owners with verified nearby mechanics and towing partners.

## Features

### Vehicle Owners (Users)
- Register/login and manage vehicles
- Request roadside assistance (breakdown repair, towing, battery jump-start, flat tire, fuel delivery)
- View nearby mechanics with distance, ratings, ETA, and pricing
- Live service tracking with status updates
- Service history, invoices, and ratings

### Mechanics / Towing Partners
- Partner registration with admin verification
- Service profile, offerings, and pricing management
- Receive and accept service requests
- Update job status (en route → arrived → in progress → completed)
- Earnings and job history dashboard

### Admin
- Verify/reject mechanic and towing partner applications
- Monitor live service requests
- Handle disputes
- Performance and revenue KPI dashboard

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Backend  | Node.js, Express.js                 |
| Database | MongoDB                             |
| Auth     | JWT                                 |
| APIs     | REST                                |

## Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Quick Start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run seed    # Load demo data
npm run dev     # Starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev     # Starts on http://localhost:3000
```

### 3. Open the app

Visit [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Role     | Email                  | Password  |
|----------|------------------------|-----------|
| Admin    | admin@roadside.com     | admin123  |
| User     | user@roadside.com      | user123   |
| Mechanic | rajesh@roadside.com    | mech123   |
| Mechanic | suresh@roadside.com    | mech123   |
| Pending  | amit@roadside.com      | mech123   |

## API Endpoints

| Method | Endpoint                      | Description                |
|--------|-------------------------------|----------------------------|
| POST   | /api/auth/register            | Register user/mechanic     |
| POST   | /api/auth/login               | Login                      |
| GET    | /api/auth/me                  | Current user               |
| GET    | /api/vehicles                 | List user vehicles         |
| POST   | /api/vehicles                 | Add vehicle                |
| GET    | /api/mechanics/nearby         | Find nearby mechanics      |
| POST   | /api/requests                 | Create service request     |
| GET    | /api/requests/:id             | Get request details        |
| PUT    | /api/requests/:id/accept      | Mechanic accepts request   |
| PUT    | /api/requests/:id/status      | Update service status      |
| GET    | /api/admin/dashboard          | Admin KPIs and stats       |

## User Flow

1. User requests roadside assistance and selects service type
2. Platform finds nearby verified mechanics
3. User books a mechanic (or broadcasts to all)
4. Mechanic accepts and updates status through completion
5. User tracks progress in real time and submits feedback

## KPIs Tracked

- Number of service requests
- Average response time (ETA)
- Service completion rate
- User satisfaction rating
- Partner acceptance rate

## Deployment

- **Frontend:** Vercel or Netlify (`npm run build`)
- **Backend:** AWS EC2, Railway, or Render
- **Database:** MongoDB Atlas

Set `NEXT_PUBLIC_API_URL` to your deployed backend URL in production.

## Project Structure

```
├── backend/
│   ├── config/         # Database connection
│   ├── models/         # MongoDB schemas
│   ├── routes/         # REST API routes
│   ├── middleware/     # JWT auth
│   └── utils/          # Helpers & seed data
├── frontend/
│   ├── app/            # Next.js pages
│   ├── components/     # Shared UI components
│   └── lib/            # API client & auth context
└── docs/               # PRD & technical documentation
```

## License

Unified Mentor Project — Educational Use
