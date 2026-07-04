# Product Requirements Document (PRD)

## Roadside Vehicle Assistance & Mechanic Booking Platform

**Project:** Roadside AAA  
**Organization:** Unified Mentor  
**Version:** 1.0 (Phase 1)

---

## 1. Problem Statement

Vehicle breakdowns cause stress and delay due to difficulty finding reliable mechanics, unclear pricing, delayed support, lack of real-time tracking, and dependence on manual phone calls.

## 2. Objectives

### Primary
- Fast roadside assistance during breakdowns
- Connect users with verified nearby mechanics and towing services
- Transparent pricing and service details
- Reduce vehicle downtime and user stress

### Secondary
- Improve trust in local automotive services
- Enable service history and accountability
- Support scalable expansion across cities

## 3. Scope

### In Scope (Phase 1)
- Responsive web platform (desktop & mobile)
- Real-time mechanic discovery and booking
- Roadside assistance, towing, and on-site repair
- Service tracking and status updates
- User, mechanic, and admin dashboards

### Out of Scope (Phase 1)
- Native mobile applications
- Vehicle insurance claim processing
- Spare parts inventory management
- Online payments

## 4. User Roles & Features

### 4.1 Vehicle Owner
| Feature | Status |
|---------|--------|
| Registration & login | ✅ Implemented |
| Add/manage vehicles | ✅ Implemented |
| Request roadside assistance | ✅ Implemented |
| Select service type (5 types) | ✅ Implemented |
| View nearby mechanics | ✅ Implemented |
| Real-time tracking | ✅ Implemented (polling) |
| Service history & ratings | ✅ Implemented |

### 4.2 Mechanic / Towing Partner
| Feature | Status |
|---------|--------|
| Partner registration | ✅ Implemented |
| Admin verification | ✅ Implemented |
| Service profile & pricing | ✅ Implemented |
| Accept service requests | ✅ Implemented |
| Update service status | ✅ Implemented |
| Earnings & job history | ✅ Implemented |

### 4.3 Admin
| Feature | Status |
|---------|--------|
| Verify partners | ✅ Implemented |
| Manage users | ✅ Implemented |
| Monitor live requests | ✅ Implemented |
| Handle disputes | ✅ Implemented |
| Performance reports | ✅ Implemented |

## 5. Service Types

1. Breakdown Repair
2. Towing
3. Battery Jump-Start
4. Flat Tire Repair
5. Fuel Delivery

## 6. Non-Functional Requirements

| Requirement | Implementation |
|-------------|----------------|
| Performance | 5s polling for live updates; geospatial queries |
| Security | JWT auth, bcrypt password hashing |
| Usability | Emergency-friendly UI, large CTAs, mobile responsive |
| Scalability | Stateless API, MongoDB indexing |

## 7. Data Model

- **Users** — vehicle owners, mechanics, admins
- **Vehicles** — linked to users
- **Service Requests** — core booking entity with status flow
- **Locations** — GeoJSON points for users and mechanics

## 8. Status Flow

```
pending → accepted → en_route → arrived → in_progress → completed
                    ↘ cancelled (user/admin)
```

## 9. KPIs

- Number of service requests
- Average response time (ETA)
- Service completion rate
- User satisfaction rating
- Partner acceptance rate

## 10. Future Enhancements (Phase 2+)

- Online payment & invoicing
- Mobile app with SOS button
- Insurance integration
- AI-based ETA and cost estimation
- Spare parts ordering

---

*Document prepared for Unified Mentor submission.*
