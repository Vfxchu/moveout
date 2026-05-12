# Move-Out Service Platform - Complete Development Prompt

**Version:** 2.0 (Final)  
**Date:** May 12, 2026  
**Status:** Ready for Development

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [What You Need to Build](#what-you-need-to-build)
3. [Core Features](#core-features)
4. [Design Requirements](#design-requirements)
5. [Technical Requirements](#technical-requirements)
6. [Detailed Feature Checklist](#detailed-feature-checklist)
7. [Panel Synchronization & Real-Time Sync](#panel-synchronization--real-time-sync)
8. [Implementation Priority](#implementation-priority)
9. [Final Completion Checklist](#final-completion-checklist)
10. [Ready to Start Development](#ready-to-start-development)

---

## Project Overview

Build a complete, fully functional **Move-Out Service Platform** application with three integrated panels (User, Admin, Service Provider), mobile-first responsive design, Supabase backend integration, and all core features working seamlessly with real-time synchronization across all panels.

**Platform Purpose:** Enable users to request multiple services, receive optimized provider combinations, and manage service bookings in one unified interface while allowing service providers to bid intelligently and admins to oversee the entire ecosystem.

**Key Value Propositions:**
- Users get optimized combinations of service providers (cheapest, best-rated, fastest)
- Providers receive only relevant requests for services they offer
- Admins have complete visibility and control over the platform

---

## What You Need to Build

### PANEL 1: USER/CUSTOMER PANEL

**Complete Feature Set:**
- Service request creation with multiple service selection
- Real-time bid dashboard showing provider bids
- Smart recommendation system (cheapest, best-rated, fastest options)
- Order tracking across different statuses
- In-app messaging with providers
- Payment processing and split payment handling
- Provider ratings and reviews
- Complete service history and past bookings
- Secure authentication (phone + OTP, email + OTP)
- Account settings and preferences

---

### PANEL 2: SERVICE PROVIDER PANEL

**Complete Feature Set:**
- Provider registration and comprehensive verification system
- Service category selection and management
- Active bids management dashboard
- Intelligent bid submission with notes and estimated time
- Job status updates (on the way, started, completed)
- Real-time earnings tracking and wallet management
- Provider rating and performance analytics
- Availability and service area management
- Capacity management for concurrent jobs
- Direct messaging with customers
- Revenue reports and tax documentation

---

### PANEL 3: ADMIN DASHBOARD

**Complete Feature Set:**
- Real-time platform monitoring (users, providers, active jobs)
- Provider verification and approval workflow
- Service catalog management
- Bid monitoring and fraud detection
- Dispute resolution management
- Commission and revenue configuration
- Comprehensive analytics and business intelligence
- Financial reporting and provider payouts
- System health monitoring
- Document verification (ID, trade license, bank details)

---

## Core Features

### Smart Combination Algorithm

The heart of the platform that makes it unique:

- **Accept multiple bids** from different providers for different services
- **Calculate all possible provider combinations** mathematically
- **Rank combinations** by three criteria:
  - Price (lowest total cost)
  - Rating (best average provider ratings)
  - Speed (fastest completion time)
- **Present top 3 options** to users automatically
- **Allow manual override** - users can select any available provider for any service
- **Scalable architecture** - grows with more providers, not slower

**Example:** User needs painting + cleaning
- Provider A (painting only): ₹99
- Provider B (painting + cleaning): ₹199 + ₹99
- System recommends: Provider A + Provider B for cleaning = ₹198 (cheaper than Provider B alone at ₹298)

---

### Authentication & Security

**Multi-Method Secure Login:**
- Phone number + OTP verification
- Email + OTP verification
- Secure password recovery
- Session management with token refresh
- Role-based access control (User, Provider, Admin)
- Encrypted sensitive data
- PCI-DSS compliant payment gateway
- No sharing of customer data with providers without consent

---

### Service Request Workflow

**Step-by-Step Process:**

1. **User Creates Request**
   - Select multiple services from available categories
   - Provide property details (size, rooms, condition)
   - Upload photos/videos of property
   - Enter location with exact apartment details
   - Set preferred date and time
   - Add special notes or instructions

2. **System Broadcasts**
   - Platform separates request into individual service tasks
   - Each task broadcasts only to providers offering that service
   - Painting request → only painters receive it
   - Cleaning request → only cleaners receive it

3. **Providers Respond**
   - Relevant providers receive real-time notification
   - They submit bids with pricing and estimated time
   - They add detailed notes about approach/qualifications
   - They attach portfolio items if needed

4. **Smart Recommendations**
   - System analyzes all combinations
   - Shows three optimized options to user
   - User selects preferred combination
   - Payment is processed

5. **Execution & Tracking**
   - Providers update job status in real-time
   - User tracks progress on dashboard
   - Messaging system allows clarifications
   - Job completion triggers rating request

---

### Payment System

**Flexible & Secure:**
- Multiple payment methods (card, Apple Pay, Google Pay, wallet)
- Single payment to platform
- Automatic split distribution to multiple providers
- Transaction records and detailed receipts
- Refund management system
- Commission calculations (flat + percentage based)
- Provider wallet with withdrawal to bank account
- Real-time payment status updates

---

### Communication System

**Integrated Messaging:**
- In-app messaging between users and providers
- Direct notifications for bid updates
- Request status notifications
- Dispute communication tracking
- Message history stored for reference
- No direct phone number sharing
- Support ticket system for escalations

---

### Ratings & Reviews

**Comprehensive Quality Assurance:**
- Post-completion rating for each service provider
- Rate on: Quality, Timeliness, Professionalism
- Detailed written reviews with photo uploads
- Average rating calculations updated in real-time
- Review visibility in all provider profiles
- Review history for user reference
- Admin monitoring of review patterns for fraud detection

---

## Design Requirements

### Color Scheme & Visual Design

**Color Palette:**
- **Primary Blue:** #0066FF (buttons, highlights, primary actions)
- **Light Blue:** #E3F2FD (backgrounds, hover states)
- **White:** #FFFFFF (main background)
- **Text:** #333333 or #000000 (dark gray/black for readability)
- **Accent:** #0052CC (darker blue for secondary elements)
- **Success:** #4CAF50 (confirmations, completed status)
- **Warning:** #FF9800 (alerts, pending status)
- **Error:** #F44336 (errors, disputes)

**Design Philosophy:**
- Minimal, clean aesthetic
- No excessive elements or clutter
- Consistent spacing and typography
- Clear visual hierarchy
- Intuitive user flows
- Professional appearance

---

### Mobile-First Approach

**Primary Optimization:**
- Designed for mobile devices first (main focus)
- Touch-friendly buttons and spacing (minimum 44x44 px)
- Responsive design for tablets and desktop
- Easy navigation with bottom tabs or hamburger menu
- Fast loading times (optimized images, lazy loading)
- Smooth transitions and animations
- Readable fonts at small screen sizes
- Thumb-friendly placement of interactive elements

---

## Technical Requirements

### Supabase Integration

**Backend Infrastructure:**
- User authentication with phone/email OTP
- Realtime database for live bid updates
- Service request and provider data storage
- Payment and transaction records management
- Reviews and ratings system
- Role-based access control (RLS - Row Level Security)
- File storage for photos/videos and documents
- Cloud functions for automated tasks

---

### Database Tables & Schema

**Core Tables Required:**

| Table | Purpose |
|-------|---------|
| `users` | Customer profiles, authentication, preferences |
| `providers` | Service provider details, verification status, services offered |
| `services` | Service categories and subcategories master list |
| `requests` | Parent service requests from customers |
| `request_services` | Individual services within each request |
| `bids` | Provider bids for each service |
| `payments` | All transaction records and receipts |
| `reviews` | Ratings and customer feedback |
| `messages` | In-app communication between users and providers |
| `admin_users` | Admin panel access control |
| `disputes` | Dispute tickets and resolution history |
| `provider_availability` | Working hours, service areas, capacity |

---

### Real-Time Features

**Supabase Realtime Subscriptions:**
- Live bid updates on user dashboard (1-2 second sync)
- Real-time status changes across all panels
- Instant notifications to relevant parties
- Live messaging between users and providers
- Real-time earnings updates for providers
- Live admin dashboard metrics

---

## Detailed Feature Checklist

### USER PANEL FEATURES

**Authentication & Account**
- [ ] Secure phone + OTP login
- [ ] Secure email + OTP login
- [ ] Account creation and profile setup
- [ ] Password recovery
- [ ] Profile picture upload
- [ ] Account settings and preferences
- [ ] Logout functionality
- [ ] Session management

**Service Request Creation**
- [ ] Service selection form (multi-select)
- [ ] Service category browsing
- [ ] Property details input (size, rooms, condition)
- [ ] Photo/video upload for property condition
- [ ] Location input with apartment details
- [ ] Date preference selection
- [ ] Time window preference
- [ ] Special notes/instructions field
- [ ] Submit request button
- [ ] Request confirmation

**Real-Time Bidding**
- [ ] Live bid dashboard display
- [ ] Bid notifications (visual + sound)
- [ ] Provider name and verified badge
- [ ] Bid amount for each service
- [ ] Provider average rating display
- [ ] Provider review count
- [ ] Estimated completion time
- [ ] Provider experience level
- [ ] Provider portfolio preview
- [ ] Bid count tracking

**Smart Recommendations**
- [ ] Display cheapest option automatically
- [ ] Display best-rated option automatically
- [ ] Display fastest option automatically
- [ ] Show provider combination breakdown
- [ ] Show total cost comparison
- [ ] Show rating comparison
- [ ] Show time comparison
- [ ] Highlight recommended option

**Manual Selection**
- [ ] Override recommendations
- [ ] Select individual providers
- [ ] View detailed provider profiles
- [ ] See full provider history
- [ ] Filter by rating
- [ ] Filter by price
- [ ] Filter by speed
- [ ] Filter by verified status only

**Order & Payment**
- [ ] Confirm provider selection
- [ ] Review total cost breakdown
- [ ] Select payment method (card, Apple Pay, Google Pay, wallet)
- [ ] Process payment securely
- [ ] Show payment confirmation
- [ ] Generate receipt
- [ ] Email receipt option
- [ ] Payment status tracking

**Order Tracking**
- [ ] Track request status (bids received → confirmed → on way → started → completed)
- [ ] Real-time status updates
- [ ] Estimated completion time
- [ ] Provider current location (if available)
- [ ] Status timeline view
- [ ] Push notifications on status change
- [ ] In-app status notifications

**Communication**
- [ ] Message providers before accepting
- [ ] Initiate chat with provider
- [ ] View message history
- [ ] Send photos/files in chat
- [ ] Receive provider messages
- [ ] See delivery status (sent, read)
- [ ] Provider typing indicator
- [ ] Support chat option

**Service History**
- [ ] View all past requests
- [ ] View completed jobs
- [ ] View in-progress jobs
- [ ] Search request history
- [ ] Filter by service type
- [ ] Filter by date range
- [ ] View request details
- [ ] Re-request same services

**Ratings & Reviews**
- [ ] Rate each provider after completion
- [ ] Rate on quality (1-5 stars)
- [ ] Rate on timeliness (1-5 stars)
- [ ] Rate on professionalism (1-5 stars)
- [ ] Write detailed review
- [ ] Upload photos of completed work
- [ ] Submit review
- [ ] View your own reviews
- [ ] See review impact on provider rating

**Support & Disputes**
- [ ] Raise support ticket
- [ ] Report quality issues
- [ ] Report provider no-show
- [ ] Report incomplete work
- [ ] Upload evidence (photos, messages)
- [ ] View dispute status
- [ ] Chat with support team
- [ ] Receive dispute resolution
- [ ] Request refund
- [ ] Track refund status

---

### SERVICE PROVIDER PANEL FEATURES

**Registration & Verification**
- [ ] Company details form
- [ ] Trade license upload
- [ ] Government ID upload (Emirates ID/Passport)
- [ ] Bank account details
- [ ] Insurance certificate upload
- [ ] Portfolio photos upload
- [ ] Phone number verification
- [ ] Email verification
- [ ] Address verification
- [ ] Service category selection (multi-select)
- [ ] Verification status tracking
- [ ] Approval notification
- [ ] Account activation

**Login & Dashboard**
- [ ] Secure phone + OTP login
- [ ] Secure email + OTP login
- [ ] Dashboard overview
- [ ] Quick stats (active bids, completed jobs, earnings)
- [ ] Logout functionality

**Bid Management**
- [ ] Receive real-time bid notifications
- [ ] View request details
- [ ] See customer property photos
- [ ] See service requirements
- [ ] See preferred dates/times
- [ ] Submit bid for services offered
- [ ] Set bid amount
- [ ] Add detailed notes
- [ ] Provide estimated completion time
- [ ] Attach portfolio items
- [ ] Edit bid before acceptance
- [ ] Reject request
- [ ] View all active bids
- [ ] View bid status (pending, accepted, rejected)
- [ ] Cancel bid before acceptance

**Active Jobs Dashboard**
- [ ] View confirmed jobs
- [ ] See job details and location
- [ ] See customer contact info
- [ ] See scheduled date/time
- [ ] See job requirements
- [ ] See customer uploaded photos

**Job Tracking & Updates**
- [ ] Update job status (job confirmed)
- [ ] Update status (on the way)
- [ ] Upload location/proof of arrival
- [ ] Update status (work started)
- [ ] Upload photos of work in progress
- [ ] Update status (in progress with notes)
- [ ] Update status (completed)
- [ ] Upload photos of completed work
- [ ] Mark ready for review
- [ ] See real-time user notifications

**Communication**
- [ ] Receive messages from customers
- [ ] Send messages to customers
- [ ] View message history
- [ ] Send photos/files in chat
- [ ] See message delivery status
- [ ] Clarify job details via messaging
- [ ] Provide work updates via messaging

**Availability Management**
- [ ] Set working hours
- [ ] Set days of operation
- [ ] Define service areas
- [ ] Set multiple service area zones
- [ ] Emergency availability toggle
- [ ] Set capacity (concurrent jobs limit)
- [ ] Update availability in real-time
- [ ] View conflicting job times

**Earnings & Wallet**
- [ ] View wallet balance
- [ ] See all earned amount
- [ ] See pending payments
- [ ] Request withdrawal
- [ ] Select withdrawal bank account
- [ ] View withdrawal history
- [ ] Track payout status
- [ ] See commission breakdown
- [ ] View commission per service

**Revenue Reports**
- [ ] View daily earnings
- [ ] View weekly earnings
- [ ] View monthly earnings
- [ ] View annual earnings
- [ ] Filter by service type
- [ ] Export earnings report
- [ ] Tax documentation download
- [ ] Income statement generation
- [ ] View payment history

**Performance Analytics**
- [ ] View job completion rate
- [ ] View average rating
- [ ] View rating breakdown (quality, timeliness, professionalism)
- [ ] View customer review count
- [ ] View response time to bids
- [ ] View acceptance rate
- [ ] View cancellation rate
- [ ] Compare rates to similar providers
- [ ] View seasonal trends

**Profile Management**
- [ ] Edit company details
- [ ] Update phone number
- [ ] Update email
- [ ] Upload/change portfolio
- [ ] Edit service categories
- [ ] Update bank details
- [ ] View verification status
- [ ] Re-upload documents if needed
- [ ] Update profile picture

---

### ADMIN PANEL FEATURES

**Login & Dashboard**
- [ ] Secure admin login
- [ ] Dashboard overview
- [ ] Real-time metrics display
- [ ] Logout functionality

**Platform Monitoring**
- [ ] Total active users count
- [ ] Total verified providers count
- [ ] Active jobs in progress count
- [ ] Daily transaction volume
- [ ] Daily transaction value
- [ ] System health status
- [ ] Database performance
- [ ] API response times
- [ ] Active users right now
- [ ] Online providers right now

**Provider Management - Verification**
- [ ] View pending provider applications
- [ ] Review provider documents
- [ ] Verify government ID
- [ ] Verify trade license
- [ ] Verify bank account
- [ ] Review insurance certificates
- [ ] View provider details form
- [ ] Contact provider for clarification
- [ ] Approve provider application
- [ ] Request additional documents
- [ ] Reject application with reason
- [ ] Send approval notification
- [ ] Send rejection notification
- [ ] Track approval timeline

**Provider Management - Active**
- [ ] View all verified providers
- [ ] View provider profiles
- [ ] View provider services offered
- [ ] View provider ratings
- [ ] View provider job history
- [ ] View provider earnings
- [ ] Suspend provider
- [ ] Remove provider
- [ ] View provider violations
- [ ] Contact provider
- [ ] View provider reviews
- [ ] Monitor suspicious activity

**Service Catalog**
- [ ] Create new service category
- [ ] Edit existing categories
- [ ] Create subcategories
- [ ] Edit subcategories
- [ ] Set pricing guidelines
- [ ] Set pricing references
- [ ] Add service descriptions
- [ ] Add service requirements
- [ ] Activate/deactivate services
- [ ] View service demand stats
- [ ] View service popularity

**Bid Monitoring**
- [ ] View all active bids
- [ ] Monitor bid activity patterns
- [ ] Detect spam bidding
- [ ] Identify suspicious patterns
- [ ] Flag unusual pricing (too high/low)
- [ ] View provider bid history
- [ ] Detect collusion attempts
- [ ] Investigate flagged bids
- [ ] Block suspicious providers
- [ ] Review bid disputes

**Dispute Resolution**
- [ ] View dispute tickets
- [ ] Review customer complaint
- [ ] Review provider response
- [ ] View submitted evidence (photos, messages)
- [ ] Review documentation
- [ ] Make resolution decision
- [ ] Process refund
- [ ] Penalize provider if needed
- [ ] Suspend provider if needed
- [ ] Send resolution notification to both parties
- [ ] Document decision
- [ ] Maintain dispute history

**Commission & Revenue**
- [ ] Set flat commission amount
- [ ] Set percentage-based commission
- [ ] Set service-specific commission
- [ ] Create special commission rules
- [ ] View commission breakdown
- [ ] Calculate total platform revenue
- [ ] View revenue by service
- [ ] View revenue trends
- [ ] Generate revenue reports
- [ ] Export financial data

**Provider Payouts**
- [ ] View pending payout requests
- [ ] Process payout to provider
- [ ] Verify bank account details
- [ ] Process multiple payouts
- [ ] Track payout status
- [ ] View payout history
- [ ] Generate payout reports
- [ ] Identify payment issues
- [ ] Failed payout handling

**Analytics & Reporting**
- [ ] Most requested services
- [ ] Service demand trends
- [ ] Revenue by service
- [ ] Provider performance rankings
- [ ] Provider ratings analysis
- [ ] User satisfaction metrics
- [ ] Monthly growth rate
- [ ] Quarterly growth analysis
- [ ] User retention metrics
- [ ] Provider retention metrics
- [ ] Geographic demand analysis
- [ ] Peak service times
- [ ] Average bid response time
- [ ] Average job completion time
- [ ] Customer satisfaction score
- [ ] Provider satisfaction score
- [ ] Export analytics reports
- [ ] Create custom reports

---

## Panel Synchronization & Real-Time Sync

### Critical: How All Three Panels Must Sync Together

This is the foundation of a unified platform. Without proper synchronization, panels operate independently and user experience breaks down.

---

### USER PANEL → PROVIDER PANEL SYNC

**Request Creation to Provider Notification**
- [ ] When user creates request → instantly appears in all relevant providers' dashboards
- [ ] Provider notification triggers in real-time
- [ ] Only providers offering selected services receive request
- [ ] Provider cannot see requests for services they don't offer
- [ ] Request details fully visible to provider

**Service Details Sync**
- [ ] When user selects services → only providers offering those services receive notification
- [ ] When user uploads photos/videos → visible to all bidding providers in real-time
- [ ] When user updates location → all providers see updated location
- [ ] When user adds special notes → providers see notes in request details

**Bid Acceptance Sync**
- [ ] When user accepts a bid → provider's bid status changes to "Accepted" immediately
- [ ] Provider receives confirmation notification
- [ ] Bid appears in provider's "Active Jobs" section
- [ ] Other providers see their bids are "Not Selected"
- [ ] Only accepted provider can proceed to job execution

**Payment Sync**
- [ ] When user makes payment → provider sees payment confirmation instantly
- [ ] Amount reflects in provider's wallet immediately
- [ ] Provider notification: "Payment received - ₹XXX"
- [ ] Transaction appears in provider's earnings history
- [ ] Admin sees payment in transaction log

**Rating & Review Sync**
- [ ] When user rates provider → rating updates provider's profile in real-time
- [ ] Average rating recalculates and updates across system
- [ ] Review text appears in provider's public profile
- [ ] Provider receives notification of new rating
- [ ] Admin sees rating in analytics
- [ ] Other users see updated rating when viewing provider

**Messaging Sync**
- [ ] When user sends message → appears in provider's inbox instantly
- [ ] Message notification triggers for provider
- [ ] Message timestamp syncs for both parties
- [ ] Read status visible to user
- [ ] Chat history accessible to both

---

### PROVIDER PANEL → USER PANEL SYNC

**Bid Submission Sync**
- [ ] When provider submits bid → appears on user's dashboard within 1-2 seconds
- [ ] User sees provider name, amount, and rating
- [ ] User gets real-time notification
- [ ] Bid appears in correct service category
- [ ] Bid count increments for user

**Bid Editing Sync**
- [ ] When provider edits bid → user sees updated price in real-time
- [ ] Updated estimated time syncs to user dashboard
- [ ] User sees "Updated" indicator on bid
- [ ] Previous bid amount no longer visible
- [ ] Smart recommendation algorithm recalculates with new bid

**Request Rejection Sync**
- [ ] When provider rejects request → disappears from provider's list
- [ ] User doesn't see provider in available options
- [ ] Rejected provider not included in recommendation calculations

**Job Status Update Sync**
- [ ] When provider changes status to "On The Way" → user sees update instantly
- [ ] Status timeline updates for user
- [ ] User gets push notification
- [ ] Estimated arrival time displays if available
- [ ] Status appears in user's order tracking section

**Work Progress Sync**
- [ ] When provider updates status to "Started" → user sees status change immediately
- [ ] When provider uploads work-in-progress photos → user sees them
- [ ] When provider adds progress notes → user sees updates
- [ ] Status timeline updates with timestamps

**Job Completion Sync**
- [ ] When provider marks job "Completed" → user notification triggers
- [ ] Completed status appears in user's dashboard
- [ ] User can now rate provider
- [ ] Provider sees "Awaiting Rating" status
- [ ] Job moves from active to completed section

**Provider Message Sync**
- [ ] When provider sends message → appears in user's chat instantly
- [ ] Message notification triggers
- [ ] Read receipt visible to provider
- [ ] Chat history accessible to user
- [ ] Message timestamp syncs

---

### ADMIN PANEL → USER & PROVIDER PANEL SYNC

**Provider Approval Sync**
- [ ] When admin approves provider → provider account activation triggers
- [ ] Provider receives notification: "Account approved"
- [ ] Provider can now start bidding
- [ ] Verified badge appears in provider profile
- [ ] Users see "Verified" indicator on provider bids
- [ ] Provider appears in bid recommendations

**Provider Rejection Sync**
- [ ] When admin rejects provider → rejection notification sends
- [ ] Rejection reason appears in provider notification
- [ ] Provider cannot create or manage bids
- [ ] Option to reapply with correct documents

**Provider Suspension Sync**
- [ ] When admin suspends provider → provider access disabled
- [ ] All active bids cancelled automatically
- [ ] Users notified: "Provider unavailable"
- [ ] Bids removed from user dashboards
- [ ] Provider account suspended message displays
- [ ] Revenue calculation excludes suspended provider

**Service Category Creation Sync**
- [ ] When admin creates new service → instantly available in user request form
- [ ] Providers see new category in service selection
- [ ] New category appears in all request options
- [ ] Analytics start tracking new service

**Commission Rate Changes Sync**
- [ ] When admin updates commission → applies to all new bids forward
- [ ] Existing bids not affected (honor old commission)
- [ ] Provider dashboard shows updated commission rate
- [ ] Next payout calculated with new rate
- [ ] System-wide notification of commission change

**Refund Processing Sync**
- [ ] When admin processes refund → money syncs to user's wallet
- [ ] User receives notification: "Refund processed - ₹XXX"
- [ ] Provider loses payment notification
- [ ] Amount deducted from provider earnings
- [ ] Transaction logged in admin history
- [ ] Both parties see refund status

**Dispute Resolution Sync**
- [ ] When admin resolves dispute → decision notification sends to both parties
- [ ] If in user's favor: refund syncs to wallet
- [ ] If in provider's favor: provider retains payment
- [ ] Resolution reason visible to both parties
- [ ] Dispute closed in both panels

---

### PROVIDER PANEL → ADMIN PANEL SYNC

**Provider Registration Sync**
- [ ] When provider registers → application appears in admin's verification queue
- [ ] Admin notification: "New provider application"
- [ ] All documents visible to admin immediately
- [ ] Registration timestamp recorded
- [ ] Provider status shows "Pending Verification"

**Low Rating Detection Sync**
- [ ] When provider receives low ratings → admin dashboard flags performance issue
- [ ] Admin sees provider with < 3.5 rating in alerts
- [ ] Automatic notification to admin for review
- [ ] Provider appears in "At Risk" providers list

**Complaint History Sync**
- [ ] When complaints filed against provider → admin sees complaint count
- [ ] Dispute history accessible in provider profile
- [ ] Complaint patterns visible to admin
- [ ] Admin can monitor complaint trends

**Payout Request Sync**
- [ ] When provider requests withdrawal → appears in admin payout queue
- [ ] Admin sees pending withdrawal amount
- [ ] Bank account details visible for verification
- [ ] Payout status updates sync to provider wallet

---

### USER PANEL → ADMIN PANEL SYNC

**Dispute Filing Sync**
- [ ] When user raises dispute → appears in admin's dispute queue instantly
- [ ] Admin notification: "New dispute filed"
- [ ] Dispute details fully accessible to admin
- [ ] Timeline shows when dispute was filed
- [ ] Evidence attached to dispute

**Rating Visibility Sync**
- [ ] When user rates provider → admin sees rating immediately
- [ ] All user ratings aggregate to provider's average
- [ ] Admin can see individual reviews
- [ ] Quality monitoring dashboard updates
- [ ] Admin can flag fake reviews

**Refund Request Sync**
- [ ] When user requests refund → appears in admin refund queue
- [ ] Admin notification triggers
- [ ] Reason for refund visible
- [ ] Supporting evidence attached
- [ ] Refund status tracked

**Support Ticket Sync**
- [ ] When user opens support ticket → appears in support queue
- [ ] Ticket assigned to support team
- [ ] Chat history syncs between user and support
- [ ] Resolution status visible to user
- [ ] Closed tickets logged in admin history

---

### REAL-TIME UPDATES ACROSS ALL PANELS

**Bid Dashboard - Speed of Sync**
- [ ] User sees new bids within 1-2 seconds of provider submission
- [ ] Bid count updates in real-time
- [ ] New provider appears instantly
- [ ] Smart recommendation algorithm recalculates automatically
- [ ] Updated recommendations present within seconds

**Order Status - Instant Sync**
- [ ] All parties see status changes immediately (on way → started → completed)
- [ ] Timeline updates for user and admin
- [ ] Provider notification triggers for status change
- [ ] Push notifications sent
- [ ] Status never shows inconsistently across panels

**Messaging - Real-Time**
- [ ] Messages sync instantly between user and provider
- [ ] No lag or delay in message delivery
- [ ] Read receipts show immediately
- [ ] Typing indicators display in real-time
- [ ] Chat history always synchronized

**Earnings - Instant Update**
- [ ] Provider's wallet updates immediately on payment
- [ ] No delay between payment and wallet credit
- [ ] Earnings history updates instantly
- [ ] Revenue reports calculate in real-time
- [ ] Balance always accurate across sessions

**Ratings - Immediate Recalculation**
- [ ] Provider's average rating updates immediately after new review
- [ ] Rating change visible on all panels where provider appears
- [ ] Old rating never shows after new review submitted
- [ ] Admin dashboard reflects rating change instantly
- [ ] User sees updated rating when viewing provider

**Availability - Live Sync**
- [ ] When provider updates availability → system respects immediately
- [ ] Unavailable providers don't receive new requests
- [ ] New requests only go to available providers
- [ ] Users see only available providers in recommendations
- [ ] Capacity constraints honored in real-time

---

## Implementation Priority

### Phase 1: Foundation (Must Have First)

**Week 1-2: Core Infrastructure**
1. [ ] Supabase project setup with Realtime enabled
2. [ ] Database schema creation and relationships
3. [ ] Authentication system (all three panels)
4. [ ] User login (phone + email OTP)
5. [ ] Provider registration and verification
6. [ ] Admin login
7. [ ] Role-based access control (RLS)

**Week 3-4: Core Features**
1. [ ] User service request creation
2. [ ] Provider bid submission system
3. [ ] Smart combination algorithm
4. [ ] Real-time bid dashboard
5. [ ] Provider management (approve/reject)
6. [ ] Payment integration
7. [ ] Realtime subscriptions on key tables

**Week 5: Critical Sync**
1. [ ] Request broadcast to providers
2. [ ] Bid notification to users
3. [ ] Bid acceptance sync
4. [ ] Payment sync across panels
5. [ ] Job status update sync
6. [ ] Notification system

---

### Phase 2: Essential Features (After Foundation)

1. [ ] Complete order tracking system
2. [ ] Ratings and reviews system
3. [ ] Messaging system
4. [ ] Admin dispute resolution
5. [ ] Provider earnings and wallet
6. [ ] Revenue reports
7. [ ] Analytics dashboard
8. [ ] Refund system
9. [ ] Provider performance metrics

---

### Phase 3: Polish & Optimization (After Essential)

1. [ ] UI/UX refinement
2. [ ] Mobile responsiveness optimization
3. [ ] Performance optimization
4. [ ] Advanced analytics
5. [ ] Additional filtering options
6. [ ] Enhanced provider profiles
7. [ ] Service packages
8. [ ] Premium features
9. [ ] Bug fixes and stability

---

## Final Completion Checklist

### Status: READY FOR DEVELOPMENT

| Feature | Component | Status | Sync Requirement | Priority |
|---------|-----------|--------|------------------|----------|
| **USER AUTHENTICATION** | Phone OTP Login | ⬜ PENDING | N/A | P1 |
| | Email OTP Login | ⬜ PENDING | N/A | P1 |
| | Session Management | ⬜ PENDING | N/A | P1 |
| **REQUEST CREATION** | Service Selection | ⬜ PENDING | Broadcast to providers | P1 |
| | Property Details | ⬜ PENDING | Visible to providers | P1 |
| | Photo/Video Upload | ⬜ PENDING | Sync to all bidders | P1 |
| | Date/Time Preference | ⬜ PENDING | Sync to providers | P1 |
| **REAL-TIME BIDDING** | Bid Dashboard | ⬜ PENDING | Update in <2 seconds | P1 |
| | Provider Bid Submission | ⬜ PENDING | Instant notify user | P1 |
| | Bid Notifications | ⬜ PENDING | Real-time sync | P1 |
| **SMART ALGORITHM** | Combination Calculation | ⬜ PENDING | N/A | P1 |
| | Cheapest Option | ⬜ PENDING | Display instantly | P1 |
| | Best-Rated Option | ⬜ PENDING | Display instantly | P1 |
| | Fastest Option | ⬜ PENDING | Display instantly | P1 |
| **PROVIDER PANEL** | Registration | ⬜ PENDING | Sync to admin | P1 |
| | Bid Management | ⬜ PENDING | Real-time updates | P1 |
| | Job Dashboard | ⬜ PENDING | Sync with user | P1 |
| | Status Updates | ⬜ PENDING | Instant notify user | P1 |
| **PAYMENT** | Multi-Method Support | ⬜ PENDING | Sync to both parties | P1 |
| | Split Distribution | ⬜ PENDING | Automatic calculation | P1 |
| | Wallet System | ⬜ PENDING | Real-time balance | P2 |
| | Withdrawals | ⬜ PENDING | Process & notify | P2 |
| **TRACKING** | Order Status | ⬜ PENDING | Real-time sync | P1 |
| | Status Updates | ⬜ PENDING | Instant notification | P1 |
| | Timeline View | ⬜ PENDING | Live updates | P1 |
| **MESSAGING** | User-Provider Chat | ⬜ PENDING | Real-time sync | P2 |
| | Message Notifications | ⬜ PENDING | Instant delivery | P2 |
| | Chat History | ⬜ PENDING | Persistent storage | P2 |
| **RATINGS** | Post-Completion Rating | ⬜ PENDING | Update provider profile | P2 |
| | Review Submission | ⬜ PENDING | Sync to all panels | P2 |
| | Rating Recalculation | ⬜ PENDING | Instant average update | P2 |
| **ADMIN VERIFICATION** | Provider Approval | ⬜ PENDING | Activate provider | P1 |
| | Document Review | ⬜ PENDING | Admin only | P1 |
| | Provider Rejection | ⬜ PENDING | Notify provider | P1 |
| **ADMIN MONITORING** | Real-Time Dashboard | ⬜ PENDING | Live metrics | P2 |
| | Bid Monitoring | ⬜ PENDING | Fraud detection | P2 |
| | Dispute Management | ⬜ PENDING | Resolution system | P2 |
| **ANALYTICS** | User Growth | ⬜ PENDING | Admin only | P3 |
| | Service Demand | ⬜ PENDING | Admin only | P3 |
| | Revenue Tracking | ⬜ PENDING | Admin only | P3 |
| **DATABASE** | Supabase Setup | ⬜ PENDING | N/A | P1 |
| | Realtime Enabled | ⬜ PENDING | All subscriptions | P1 |
| | Row Level Security | ⬜ PENDING | Access control | P1 |
| | Tables Created | ⬜ PENDING | 12 core tables | P1 |
| **UI/UX** | Mobile Responsive | ⬜ PENDING | All panels | P1 |
| | Blue/White Design | ⬜ PENDING | Consistent theme | P1 |
| | Touch-Friendly | ⬜ PENDING | 44x44 minimum | P1 |
| | Fast Loading | ⬜ PENDING | Optimized assets | P1 |
| **SYNC SYSTEM** | Realtime Subscriptions | ⬜ PENDING | All key tables | P1 |
| | Notification Triggers | ⬜ PENDING | Event-based | P1 |
| | WebSocket Connections | ⬜ PENDING | Live updates | P1 |
| | Event Listeners | ⬜ PENDING | React state | P1 |
| | Panel-to-Panel Sync | ⬜ PENDING | All workflows | P1 |

---

## Key Sync Technologies to Implement

```
✓ Supabase Realtime
  - Database subscriptions on: requests, bids, jobs, messages, payments, reviews
  - Listen for INSERT, UPDATE, DELETE events
  - Automatic UI refresh when data changes

✓ Webhook System
  - Trigger for cross-panel events
  - Payment confirmations
  - Status change notifications
  - Admin alerts

✓ Push Notifications
  - Mobile push (FCM for Android, APNs for iOS)
  - In-app notifications
  - Alert badges
  - Sound alerts

✓ WebSocket Connections
  - Live messaging
  - Typing indicators
  - Real-time bid updates
  - Status change broadcasts

✓ Event Listeners (React/State Management)
  - Listen to Realtime subscriptions
  - Update local state
  - Trigger UI re-renders
  - Handle offline scenarios

✓ Automatic UI Refresh
  - Don't force page reload
  - Update specific components
  - Smooth transitions
  - No loading spinners for small updates
```

---

## Supabase Realtime Subscriptions Required

**Tables That Need Realtime:**

1. **requests** → Subscribe to user's requests
   - User sees new bids in real-time
   - Admin sees new requests

2. **bids** → Subscribe to request's bids
   - User gets live bid updates
   - Admin monitors bid activity
   - Smart algorithm recalculates on new bid

3. **request_services** → Subscribe to service status
   - Track service-specific updates

4. **messages** → Subscribe to user's messages
   - User-provider real-time chat
   - Typing indicators

5. **payments** → Subscribe to user's payments
   - Payment status updates
   - Wallet balance changes

6. **reviews** → Subscribe to provider's reviews
   - Provider sees new ratings
   - User sees updated ratings
   - Admin monitors quality

7. **jobs** (from bids with status) → Subscribe to job status
   - User sees status updates instantly
   - Admin tracks job progress

---

## Ready to Start Development

### Immediate Next Steps

1. **Setup Phase (Day 1)**
   - Create Supabase project
   - Enable Realtime
   - Set up authentication
   - Create database schema
   - Configure RLS policies

2. **Development Phase (Day 2-5)**
   - Build authentication UI for all three panels
   - Create database tables
   - Implement Realtime subscriptions
   - Build core features for Phase 1

3. **Testing Phase (Day 6-7)**
   - Test panel synchronization
   - Verify real-time updates
   - Security audit
   - Performance testing

4. **Deployment Phase (Day 8)**
   - Deploy to production
   - Monitor metrics
   - Support launch

---

## Summary of What's Being Built

| Aspect | Details |
|--------|---------|
| **Platforms** | Web + Mobile (React/React Native) |
| **Backend** | Supabase (PostgreSQL + Realtime) |
| **Panels** | 3 (User, Provider, Admin) |
| **Features** | 100+ core features |
| **Users** | Customers, Service Providers, Admins |
| **Core Algorithm** | Smart combination engine |
| **Payment** | Multi-method with split distribution |
| **Sync** | Real-time across all panels |
| **Design** | Mobile-first, blue/white minimal |
| **Security** | OTP auth, PCI-DSS, RLS, encryption |

---

## Contact & Support

This prompt is complete and ready for development. No modifications needed.

**Status:** ✅ READY TO BUILD

All specifications defined. All sync requirements detailed. All features listed. All checklists prepared.

Begin development with Phase 1 foundation immediately.

---

**End of Document**