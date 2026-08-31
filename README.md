# 🚀 FlowTech CRM Web

[![Live Demo](https://img.shields.io/badge/Live%20Demo-crm--web--zalde.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://crm-web-zalde.vercel.app)
[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD%20Pipeline-Passing-22c55e?style=for-the-badge&logo=githubactions&logoColor=white)](https://crm-web-zalde.vercel.app)
[![ESLint](https://img.shields.io/badge/ESLint-0%20Errors%20%7C%200%20Warnings-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](#-code-quality--lint-test-results)
[![TypeScript](https://img.shields.io/badge/TypeScript%205-Type%20Safe-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#-code-quality--lint-test-results)
[![Next.js](https://img.shields.io/badge/Next.js%2016-App%20Router-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma%20ORM-v6.4.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Neon%20PostgreSQL-Serverless-00E599?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech/)

> 🌐 **Live Demo Website**: [https://crm-web-zalde.vercel.app](https://crm-web-zalde.vercel.app)

FlowTech CRM Web is a comprehensive enterprise Customer Relationship Management (CRM) platform built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Vanilla CSS Modules**, and **Prisma ORM** backed by **Neon PostgreSQL**.

It empowers organizations to seamlessly manage **Sales Pipelines**, **Marketing Analytics**, **Client & Customer Directories**, and an integrated **Customer Service Suite** (Customer Queries, Live Issue SLA Tracking, Knowledge Base Solutions, and CSAT Reviews).

---

## 🌐 Live Demo & Deployment

| Resource | URL | Status |
| :--- | :--- | :--- |
| **Production Demo** | [https://crm-web-zalde.vercel.app](https://crm-web-zalde.vercel.app) | ![Deployed](https://img.shields.io/badge/Status-Live%20Online-22c55e?style=flat-square) |
| **Demo Login** | `/login` (Demo credentials pre-filled) | ![Auth Active](https://img.shields.io/badge/Auth-Demo%20Ready-0284c7?style=flat-square) |

---

## 🛠️ Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router with Turbopack, Server Components & Route Handlers |
| **Frontend UI** | [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/) | Strict type checking & modern React architecture |
| **Styling** | Vanilla CSS Modules | Custom design system with modern dark/light glassmorphism tokens |
| **Database & ORM** | [Prisma ORM v6.4](https://www.prisma.io/) & [PostgreSQL](https://neon.tech/) | Neon serverless PostgreSQL database with transaction support |
| **Validation & Security** | [Zod](https://zod.dev/) | 100% type-safe API request validation & SQL injection prevention |
| **CI / Quality Gate** | ESLint 9 + TypeScript Compiler | Continuous quality check with 0 errors / 0 warnings |

---

## 📊 Code Quality & Lint Test Results

All quality gates, linter rules, and TypeScript type-checks pass cleanly with **0 errors and 0 warnings**:

```text
============================================================
           CI / CODE QUALITY GATE AUDIT REPORT
============================================================
✓ ESLint Flat Config (eslint .)   : 0 Problems (0 errors, 0 warnings)
✓ TypeScript Typecheck (tsc)      : 0 Errors (100% Type Safe)
✓ Next.js 16 Production Build     : 21 / 21 Routes Compiled (Turbopack)
✓ Prisma ORM Client & Seed        : Synchronized & Verified
============================================================
```

### Audit Command Execution

```bash
# 1. ESLint Static Analysis Check
$ npx eslint .
✔ No problems found! (0 errors, 0 warnings)

# 2. Strict TypeScript Verification
$ npx tsc --noEmit
✔ Compilation completed with 0 errors.

# 3. Next.js Production Build
$ npm run build
✔ Generated Prisma Client (v6.4.0)
✔ Database seeding completed
✔ Compiled successfully in 31.7s (21/21 routes generated)
```

---

## ✨ Key Feature Modules

### 1. 📊 Executive Dashboard (`/dashboard`)
* **Financial Performance Overview**: Total Revenue, Quantity Sold, Number of Orders, and Average Order Value metrics.
* **Activity & Performance Feeds**: Real-time business activity stream and quick overview cards.

### 2. 💼 Sales & Pipeline Management (`/sales`)
* **Opportunity Management (`/sales/opportunities`)**: Track sales pipeline stages, deal statuses (*Pending, Won, In Progress, Lost*), expected close dates, and revenue estimations.
* **Sales Activity Log (`/sales/activity`)**: Time-stamped activity records of sales team interactions.
* **Reports & Analysis (`/sales/reports`)**: Interactive revenue/volume combo trend charts, channel distribution donut charts, world regional penetration map, and customer retention metrics.

### 3. 🎯 Marketing & Segmentation (`/marketing`)
* **Customer Segmentation (`/marketing/segmentation`)**: Dynamic customer filtering by type, region, state, and age group with multi-factor weighting.
* **Campaigns Tracking (`/marketing/campaigns`)**: ROI tracking, conversion funnels, and marketing performance stats.
* **Demographics & Product Preferences**: Age distribution breakdown and top 10 product demand rankings.

### 4. 👥 Customer & Client Directories (`/customers`, `/clients`)
* **Customer Directory (`/customers`)**: Track customer status (*Loyal, New, Lost*), regional distributions, and acquisition sources.
* **Corporate Client Directory (`/clients`)**: Manage B2B enterprise clients categorized by industry sector, tier level, and region.

### 5. 🎧 Customer Service Suite (`/service/*`)
* **Customer Queries (`/service/queries`)**: Ticketing system with priority levels (*Urgent, High, Medium, Low*). Features auto-escalation for high-priority tickets, ticket detail drawer, modal editing, and deletion.
* **Issue Tracking & SLA Center (`/service/issues`)**: Real-time SLA countdown timers, severity badges (*Critical, Major, Minor*), and direct linkage to source tickets (`TCK-xxxx`).
* **Solutions Library & Knowledge Base (`/service/solutions`)**: Search hero, category filtering, Markdown article viewer, view counter tracking, and upvote (*"This was helpful"*) feedback.
* **CSAT & Customer Feedback (`/service/csat`)**: Aggregate CSAT score tracking (e.g. 96.5%), average star ratings, customer review feeds, and agent tags.

### 6. 📈 Business Analytics (`/analytics`)
* Comprehensive business reports, sales insights, and downloadable Excel/CSV data exports.

---

## 🗄️ Database Schema & Entity Relationship Diagram (ERD)

The database schema is managed via **Prisma ORM** with **Neon PostgreSQL**:

```mermaid
erDiagram
    USER {
        string id PK
        string email UK
        string password
        string name
        enum role "ADMIN | MANAGER | AGENT"
        string avatar
        datetime createdAt
        datetime updatedAt
    }

    CUSTOMER {
        string id PK
        string customerNo UK
        string name
        string email
        string phone
        string region
        string source
        enum status "Loyal | New | Lost"
        datetime lastPurchase
        datetime createdAt
        datetime updatedAt
    }

    OPPORTUNITY {
        string id PK
        string opportunityNo UK
        string name
        enum status "Pending | Won | InProgress | Lost"
        float revenue
        datetime expCloseDate
        string customerName
        string ownerName
        datetime creationDate
        string notes
        datetime createdAt
        datetime updatedAt
    }

    CLIENT {
        string id PK
        string name
        string industry
        string region
        string tier
        datetime createdAt
        datetime updatedAt
    }

    TICKET {
        string id PK
        string ticketNo UK
        string customerName
        string avatar
        string subject
        string category
        string priority
        string status
        string agentName
        string createdDate
        string issueId FK "Unique (1:1 with Issue)"
        datetime createdAt
        datetime updatedAt
    }

    ISSUE {
        string id PK
        string issueKey UK
        string title
        string affectedCustomer
        string status
        string assignedAgent
        string avatar
        string slaRemaining
        string severity
        datetime createdAt
        datetime updatedAt
    }

    SOLUTION_ARTICLE {
        string id PK
        string title
        string category
        int views
        int helpfulCount
        string lastUpdated
        string summary
        string content
        datetime createdAt
        datetime updatedAt
    }

    CSAT_REVIEW {
        string id PK
        string customerName
        string company
        string avatar
        int rating
        string agentName
        string date
        string comment
        string tag
        datetime createdAt
        datetime updatedAt
    }

    SALES_TEAM_MEMBER {
        string id PK
        string name
        string avatar
        float revenue
        int orders
        float conversionRate
    }

    TASK_COMPLETION {
        string id PK
        string companyName
        string avatar
        int completed
        int inProgress
    }

    METRIC_SUMMARY {
        string id PK
        float totalRevenue
        float totalRevenueInc
        int totalQuantity
        int totalQuantityInc
        int numberOrders
        int customerCount
        datetime updatedAt
    }

    TICKET ||--o| ISSUE : "escalates / links (1:1)"
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.x or higher
* **npm** / **yarn** / **pnpm**
* **PostgreSQL Database** (e.g., Neon PostgreSQL)

### Environment Setup
Create a `.env` file in the root directory with your PostgreSQL connection strings:
```env
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@host:port/dbname?sslmode=require"
```

### Installation & Development Server

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Generate Prisma Client & Seed Database**:
   ```bash
   npx prisma generate
   npm run db:seed
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server. |
| `npm run build` | Generates Prisma client, seeds the database, and builds Next.js production bundle. |
| `npm run start` | Starts the built production server. |
| `npm run db:seed` | Populates the database with initial demo data, knowledge base articles, and CSAT reviews. |
| `npm run lint` | Runs ESLint to check code quality and rules compliance. |

---

## 🔒 Code Quality & Security Guidelines
* **SQL Injection Safety**: All database queries use Prisma ORM parameterization combined with Zod schema validation on API routes.
* **Strict Type Safety**: Full TypeScript checking enforced via `npx tsc --noEmit`.
* **CSS Modules**: Clean, scoped Vanilla CSS Modules (`*.module.css`) to prevent global style conflicts.
* **Zero Lint Warnings**: Enforced zero errors and zero warnings across the repository.
