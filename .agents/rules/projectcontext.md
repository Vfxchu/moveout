---
trigger: always_on
---

# MoveOut MVP Project Context

## Project Summary
This is a Move-Out Service Platform MVP. It connects customers with service providers for move-out services such as painting, cleaning, handyman, packing/moving, AC service, plumbing, electrical work, and pest control.

The app has 3 panels:
1. Customer/User Panel
2. Service Provider Panel
3. Admin Panel

This is not a normal website. It must feel like a mobile application first, with clean mobile navigation, bottom tab menus, simple screens, and app-like flows.

## Existing Tech Stack
- React
- TypeScript
- TanStack Router / TanStack Start
- Vite
- Tailwind CSS
- shadcn/Radix UI components
- Supabase Auth
- Supabase Database
- Supabase Realtime
- Supabase RLS
- Cloudflare/Wrangler setup

## Current MVP Status
The project is already partially built. Do not rebuild from scratch.

Already present:
- Landing page
- Auth page
- Customer dashboard
- Customer request creation
- Customer request detail page
- Provider onboarding
- Provider service selection
- Provider bid submission
- Provider active jobs
- Admin dashboard
- Admin provider approval
- Basic Supabase schema
- Basic realtime listeners
- Basic smart recommendation logic

Not fully complete:
- Mobile app-style UI
- Proper bottom navigation
- Clean screen organization
- Full OTP auth
- Payments
- Messaging UI
- Reviews UI
- Disputes UI
- Document upload
- Provider verification workflow
- Admin analytics
- Full realtime sync
- Full testing

## Main Development Rule
Work phase by phase. Do not jump ahead. Do not build payment, chat, reviews, or advanced admin tools before the core mobile MVP flow is clean.

## UI Direction
The UI must be mobile-first and app-like.

User panel:
- Bottom navigation
- Home
- New Request
- Bids / Orders
- Messages
- Profile

Provider panel:
- Bottom navigation
- Requests
- My Bids
- Jobs
- Wallet
- Profile

Admin panel:
- Dashboard
- Providers
- Requests
- Services
- Disputes
- Analytics

Admin can use desktop/sidebar layout, but it must still be responsive.

## Visual Style
- Primary Blue: #0066FF
- Light Blue: #E3F2FD
- White: #FFFFFF
- Text: #333333 / #000000
- Accent Blue: #0052CC
- Success: #4CAF50
- Warning: #FF9800
- Error: #F44336

Design must be:
- Minimal
- Clean
- Modern
- Mobile-first
- Touch-friendly
- Not cluttered
- Rounded cards
- Clear hierarchy
- Bottom navigation for mobile panels

## Development Order
Phase 0: Audit current code and write status report.
Phase 1: Reorganize UI and navigation.
Phase 2: Complete Customer MVP flow.
Phase 3: Complete Provider MVP flow.
Phase 4: Complete Admin MVP flow.
Phase 5: Fix realtime sync across panels.
Phase 6: Polish mobile/PWA experience.
Phase 7: Add payments, messaging, reviews, disputes, and analytics.

## Strict Rules
- Do not delete existing working features.
- Do not rewrite the whole app from scratch.
- Do not change database schema without explaining why.
- Do not expose .env values.
- Do not commit secrets.
- Do not add payment gateway until instructed.
- Do not add unnecessary libraries.
- Keep TypeScript clean.
- Keep mobile-first design.
- Keep User, Provider, and Admin flows separate.
- Always update this file if project direction changes.