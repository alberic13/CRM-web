# Project Memory & Knowledge Base — FlowTech CRM Web

This document serves as persistent memory for AI coding assistants working on the **FlowTech CRM Web** repository.

---

## 📌 Project Overview
* **Name**: FlowTech CRM Web
* **Repository**: `alberic13/CRM-web`
* **Purpose**: Comprehensive Enterprise CRM Web Application featuring Sales, Marketing, Client Management, and a full-featured Customer Service Suite (Customer Queries, Issue Tracking, Solutions Knowledge Base, CSAT & Feedback).

---

## 🛠️ Technology Stack & Architecture
1. **Framework**: Next.js 15 (App Router with Server Components & API Routes)
2. **UI & React**: React 19, TypeScript (Strict Type Checking)
3. **Styling**: Vanilla CSS Modules (`*.module.css`) with curated modern dark/light glassmorphism design tokens.
4. **Database & ORM**: Prisma ORM v6.4.0 connected to Neon PostgreSQL Database (`DATABASE_URL` & `DIRECT_URL`).
5. **Data Validation**: Zod schema validation on all API endpoints for 100% SQL Injection & payload safety.
6. **Prisma Pattern**: Singleton Prisma client exported from `src/lib/prisma.ts` to prevent serverless connection pool exhaustion.

---

## 🗄️ Database Models (`prisma/schema.prisma`)
* **User**: Authentication & Role-based Access Control (`ADMIN`, `MANAGER`, `AGENT`).
* **Customer**: Customer directory with regions, sources, and status (`Loyal`, `New`, `Lost`).
* **Opportunity**: Sales pipeline opportunities and revenue tracking.
* **SalesTeamMember & TaskCompletion**: Analytics & team leaderboards.
* **Client**: Client tier & region directory.
* **Ticket**: Customer queries table (`ticketNo`, `customerName`, `subject`, `category`, `priority`, `status`, `agentName`, `createdDate`, `issueId`).
* **Issue**: Live Issue Tracking & SLA Center items (`issueKey`, `title`, `affectedCustomer`, `status`, `assignedAgent`, `slaRemaining`, `severity`). Relates 1-to-1 with `Ticket` (`onDelete: Cascade`).
* **SolutionArticle**: Knowledge base articles (`title`, `category`, `views`, `helpfulCount`, `lastUpdated`, `summary`, `content`).
* **CsatReview**: Customer satisfaction feedback (`customerName`, `company`, `rating`, `agentName`, `comment`, `tag`).

---

## 🧭 Customer Service Sub-Modules (`/service/*`)

### 1. Customer Queries (`/service/queries`)
* **Features**:
  * Connected Issue Tracking column displaying linked `ISS-xxx` badge with SLA timer.
  * Ticket Detail Drawer modal for viewing full conversation context.
  * **Submit New Ticket Modal**: Saves tickets directly to PostgreSQL and auto-escalates high/urgent priority tickets to Issue Tracking.
  * **Edit Ticket Feature**: Blue pencil icon button opening an interactive edit modal (`PATCH /api/service/tickets/[id]`), automatically syncing updates to connected Issue Tracking items.
  * **Delete Ticket Feature**: Red trash icon button opening a delete confirmation modal (`DELETE /api/service/tickets/[id]`), deleting ticket and connected issue from PostgreSQL.

### 2. Issue Tracking & SLA Center (`/service/issues`)
* **Features**:
  * Live SLA timers, severity badges (`Critical`, `Major`, `Minor`), and status badges (`Open`, `In Progress`, `Escalated`, `Resolved`).
  * Source ticket link tags referencing `TCK-xxxx` back to Customer Queries.
  * URL search parameter filtering (`?issueKey=ISS-xxx`) to highlight specific escalated issues.

### 3. Solutions Library & Knowledge Base (`/service/solutions`)
* **Features**:
  * Search Hero and category filtering tabs (`All`, `Technical Integration`, `Billing & Subscription`, `Account Security`, `API Reference`).
  * **Create Article Modal**: Saves new articles directly to PostgreSQL (`POST /api/service/solutions`) and auto-resets filter to `All` for instant UI visibility.
  * **Article Preview Drawer**: Markdown parser supporting headers, bold text, code blocks, view counter tracking, and "This was helpful" upvoting (`PATCH /api/service/solutions`).
  * **No-Store Caching**: API route headers include `'Cache-Control': 'no-store, max-age=0'` to ensure real-time fresh data on page reloads.

### 4. CSAT & Feedback (`/service/csat`)
* **Features**:
  * Metric cards displaying Overall CSAT Score (96.5%), Average Star Rating (4.9 / 5.0), and Total Reviews.
  * Recent customer feedback review cards with agent tags and category badges (`Technical`, `Billing`, `Onboarding`).

---

## ⚙️ Build, Seed & Deployment Commands
* **Prisma Seed Script**: `prisma/seed.ts` populates initial solution articles, CSAT reviews, and support data.
* **Deployment Config (`package.json`)**:
  * `"postinstall": "prisma generate"`
  * `"build": "prisma generate && prisma db seed && next build"`
  * `"db:seed": "prisma db seed"`
* **Local Run**: `npm run dev` (starts Next.js dev server on http://localhost:3000).

---

## 🎯 User Preferences & Guidelines
1. **Clean Code & Maintainability**: Always write clean, well-structured, maintainable TypeScript code.
2. **SQL Injection Safety**: Ensure all database queries use Prisma ORM parameterization and Zod payload validation.
3. **No Superficial Symptom Patches**: Fix root causes and ensure type safety (`npx tsc --noEmit` must pass with 0 errors).
4. **Validation Preference**: Unless explicitly requested by the user, do NOT execute Playwright/DOM subagent browser tests. Perform code edits, run type checks (`npx tsc --noEmit`), and provide a clear, concise review so the user can test manually.
