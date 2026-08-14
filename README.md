# 🚀 FlowTech CRM Web

FlowTech CRM Web is a comprehensive enterprise Customer Relationship Management (CRM) platform built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Vanilla CSS Modules**, and **Prisma ORM** with **Neon PostgreSQL**.

It empowers organizations to seamlessly manage **Sales Pipelines**, **Marketing Analytics**, **Client & Customer Directories**, and a feature-rich **Customer Service Suite** (Customer Queries, Live Issue SLA Tracking, Knowledge Base Solutions, and CSAT Reviews).

---

## 🛠️ Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router with Server Components & API Routes |
| **Frontend UI** | [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/) | Strict type checking & modern React architecture |
| **Styling** | Vanilla CSS Modules | Custom design system with modern dark/light glassmorphism tokens |
| **Database & ORM** | [Prisma ORM v6](https://www.prisma.io/) & [PostgreSQL](https://neon.tech/) | Neon serverless PostgreSQL database |
| **Validation** | [Zod](https://zod.dev/) | 100% type-safe API request validation & SQL injection prevention |

---

## ✨ Key Feature Modules

### 1. 📊 Dashboard (`/dashboard`)
* **Financial Performance Overview**: Total Revenue, Quantity Sold, Number of Orders, and Average Order Value metrics.
* **Activity & Performance Feeds**: Real-time business activity stream and quick overview cards.

### 2. 💼 Sales & Pipeline (`/sales`)
* **Opportunity Management**: Track sales pipeline stages, deal statuses (*Pending, Won, In Progress, Lost*), and revenue estimations.
* **Sales Leaderboard**: Performance metrics for team members including order count and conversion rates.

### 3. 🎯 Marketing & Demographics (`/marketing`)
* **Demographics Analysis**: Age distribution breakdown of customer target audiences.
* **Product Preferences**: Ranking and purchasing volume of top products.

### 4. 👥 Customer & Client Directories (`/customers`, `/clients`)
* **Customer Directory**: Track customer status (*Loyal, New, Lost*), regional distributions, and acquisition sources.
* **Corporate Client Directory**: Manage B2B clients categorised by industry sector, tier level, and region.

### 5. 🎧 Customer Service Suite (`/service/*`)
* **Customer Queries (`/service/queries`)**: Ticketing system with priority levels (*Urgent, High, Medium, Low*). Features auto-escalation for high-priority tickets, ticket detail drawer, modal editing, and deletion.
* **Issue Tracking & SLA Center (`/service/issues`)**: Real-time SLA countdown timers, severity badges (*Critical, Major, Minor*), and direct linkage to source tickets (`TCK-xxxx`).
* **Solutions Library & Knowledge Base (`/service/solutions`)**: Hero search, category filtering, Markdown article viewer, view counter tracking, and upvote (*"This was helpful"*) feedback.
* **CSAT & Customer Feedback (`/service/csat`)**: Aggregate CSAT score tracking (e.g. 96.5%), average star ratings, customer review feeds, and agent tags.

### 6. 📈 Business Analytics (`/analytics`)
* Comprehensive business reports, sales insights, and downloadable report summaries.

---

## 🗄️ Database Schema Summary

Managed via Prisma ORM (`prisma/schema.prisma`):

* **`User`**: System user accounts and role-based access (`ADMIN`, `MANAGER`, `AGENT`).
* **`Customer`**: Customer directory data, acquisition source, and status.
* **`Opportunity`**: Sales opportunities & revenue pipeline tracking.
* **`SalesTeamMember` & `TaskCompletion`**: Team leaderboard and task completion analytics.
* **`Client`**: Corporate client directory by tier and industry.
* **`Ticket`**: Customer support tickets.
* **`Issue`**: Escalated issue tracking & SLA metrics (linked 1-to-1 with `Ticket`).
* **`SolutionArticle`**: Knowledge base articles.
* **`CsatReview`**: Customer satisfaction reviews & feedback.

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
| `npm run build` | Generates Prisma client, seeds the database, and builds the Next.js production bundle. |
| `npm run start` | Starts the built production server. |
| `npm run db:seed` | Populates the database with initial support articles, CSAT reviews, and demo data. |
| `npm run lint` | Runs ESLint to check code quality and formatting. |

---

## 🔒 Code Quality & Security Guidelines
* **SQL Injection Safety**: All database queries use Prisma ORM parameterization combined with Zod schema validation on API routes.
* **Strict Type Safety**: TypeScript checking enforced via `npx tsc --noEmit`.
* **CSS Modules**: Clean, scoped Vanilla CSS Modules (`*.module.css`) to prevent global style conflicts.

