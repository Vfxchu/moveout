# MoveOut MVP Status Report

## 1. Current Tech Stack
- **Frameworks & Libraries:** React 19, TypeScript, Vite, TanStack Router, TanStack Start, Tailwind CSS v4, Radix UI, Lucide React.
- **Backend & Auth:** Supabase (Auth, Postgres Database, Realtime, RLS).
- **Deployment & Infrastructure:** Cloudflare Vite plugin setup.
- **State Management:** TanStack Query (installed but underutilized), React Context for Auth.

## 2. Current Implemented Features
- **Routing:** Basic setup with TanStack Router (`__root.tsx`, `index.tsx`, etc.).
- **Authentication:** Supabase Auth wrapper in `src/lib/auth.tsx` managing `customer`, `provider`, and `admin` roles.
- **Landing Page:** Simple landing page at `/` redirecting based on roles.
- **Customer Panel:** 
  - Dashboard (`/customer/`): List requests, view statuses.
  - New Request (`/customer/new`): UI to create requests.
  - Request Detail (`/customer/r/$id`): View specific request and (presumably) bids.
- **Provider Panel:** 
  - Onboarding workflow (business details, service area).
  - Service selection (`provider_services`).
  - Dashboard: View open requests matching their services, place bids, update job statuses.
- **Admin Panel:** 
  - Dashboard: High-level stats.
  - Provider management: Approve/reject pending providers.
- **Database:** Comprehensive schema set up in `20260512133618_b5370650-63ed-4baa-919f-02749d214c4f.sql` covering core entities (Profiles, Roles, Services, Providers, Requests, Bids, Messages, Reviews, Disputes).

## 3. Current Missing Features
- **Mobile-First Navigation:** Persistent bottom tab bars are missing across user panels.
- **OTP Auth:** Current auth seems basic; full OTP flow is requested but not fully fleshed out.
- **Payments:** No payment gateway integrated yet.
- **Messaging/Chat UI:** Schema exists, but no UI implemented.
- **Reviews & Disputes UI:** Schema exists, UI missing.
- **Document Upload:** No workflow for providers to upload verification documents.
- **PWA Configuration:** Missing web app manifest, service workers, and safe-area padding for mobile.

## 4. Current Route Structure
- `/` - Landing Page
- `/auth` - Authentication Page
- `/customer/` - Customer Dashboard
- `/customer/new` - Create New Request
- `/customer/r/$id` - Request Details
- `/provider/` - Provider Onboarding & Dashboard (Monolithic)
- `/admin/` - Admin Dashboard (Monolithic)

## 5. Current Supabase Tables
1. `profiles`
2. `user_roles`
3. `services`
4. `providers`
5. `provider_services`
6. `requests`
7. `request_services`
8. `bids`
9. `messages`
10. `reviews`
11. `disputes`

## 6. Current Realtime Usage
- **Customer:** Subscribed to `requests` table changes (`customer_id` filter).
- **Provider:** Subscribed to `request_services`, `requests`, and `bids` table changes (`provider_id` filter).
- **Admin:** Subscribed to `providers` table changes.
- *Note:* Realtime is implemented manually via `useEffect` rather than integrated with TanStack Query cache invalidation.

## 7. Current UI Problems
- **Lack of Tabularity:** `AppShell` has a `bottomNav` prop, but it is not utilized to create standard mobile app tabs.
- **Monolithic Files:** `provider.index.tsx` and `admin.index.tsx` handle too many concerns (onboarding, feeds, stats, job management) making them hard to scale and style nicely.
- **Desktop Paradigm:** Some layouts (like tables or long lists) lack swipe gestures, pull-to-refresh, or sticky bottom actions typical of mobile apps.

## 8. Current Mobile-App Problems & UI Reorganization Strategy
Currently, panels are built as single long-scrolling web pages. To feel app-like, we need to restructure them into sub-routes wrapped by a Layout route that renders a fixed bottom navigation bar.

**Proposed Reorganization:**
- **Customer App:**
  - `src/routes/customer/__layout.tsx` (Renders AppShell with Bottom Nav)
  - `src/routes/customer/__layout/index.tsx` -> Home
  - `src/routes/customer/__layout/requests.tsx` -> Bids / Orders
  - `src/routes/customer/__layout/messages.tsx` -> Messages
  - `src/routes/customer/__layout/profile.tsx` -> Profile
  - *Note:* `/customer/new` should likely be a full-screen modal/route outside the tab layout.
- **Provider App:**
  - `src/routes/provider/__layout.tsx` (Renders AppShell with Bottom Nav)
  - `src/routes/provider/__layout/index.tsx` -> Requests (Open market)
  - `src/routes/provider/__layout/bids.tsx` -> My Bids
  - `src/routes/provider/__layout/jobs.tsx` -> Active Jobs
  - `src/routes/provider/__layout/wallet.tsx` -> Wallet
  - `src/routes/provider/__layout/profile.tsx` -> Profile
- **Admin App:**
  - Keep as a desktop-first dashboard with sidebar navigation, utilizing sub-routes:
  - `/admin/dashboard`, `/admin/providers`, `/admin/requests`, `/admin/services`, etc.

## 9. Bugs or Risky Areas
- **State Management:** Heavy reliance on React `useState` and `useEffect` for data fetching instead of TanStack Query. This will lead to race conditions, stale data, and poor UX on mobile connections.
- **Realtime Leaks:** Manual `supabase.removeChannel(ch)` inside `useEffect` can be fragile if components unmount abruptly or channels fail to connect.
- **Security:** Business logic (like updating request statuses based on job completion in `provider.index.tsx`) is handled client-side. This should ideally be moved to Supabase Edge Functions or Postgres Triggers to prevent tampering.
- **UI Overflow:** Inputs and modals on mobile might push the viewport up or hide under the keyboard if not properly managed with safe-area-insets.

## 10. Recommended Phase-by-Phase Roadmap

### Phase 1: Reorganize UI and Navigation
- Break down monolithic routes (`provider.index.tsx`, `customer.index.tsx`).
- Implement nested routing for Customer and Provider panels.
- Build persistent, mobile-first Bottom Navigation bars.
- Refactor `AppShell` to enforce mobile constraints.

### Phase 2: Complete Customer MVP Flow
- Refine the New Request flow (multi-step wizard instead of single form).
- Polish the Bids view (comparing bids, accepting/rejecting).
- Improve loading states and empty states.

### Phase 3: Complete Provider MVP Flow
- Separate onboarding into a dedicated full-screen flow.
- Polish active job status updates (swipe-to-complete, clear UI indicators).
- Add wallet transaction history UI.

### Phase 4: Complete Admin MVP Flow
- Setup sidebar layout for desktop/tablet.
- Build detailed views for Provider verification (document review placeholders).
- Implement basic analytics charts.

### Phase 5: Fix Realtime Sync Across Panels
- Migrate data fetching to TanStack Query.
- Setup Supabase Realtime to invalidate React Query caches instead of manually updating local state.
- Ensure strict error handling for offline/online states.

### Phase 6: Polish Mobile/PWA Experience
- Add `manifest.json` and service worker for PWA installability.
- Implement CSS environment variables (`env(safe-area-inset-bottom)`).
- Add micro-animations (page transitions, active tab indicators).

### Phase 7: Advanced Features
- Integrate Payment Gateway.
- Build Real-time Messaging UI.
- Implement Reviews and Rating workflows.
- Implement Disputes resolution flow.
