# Project Context & Memory - FlowTech CRM Web

Document ini berfungsi sebagai **Memory & Context File** permanen untuk AI assistant agar tidak perlu dilakukan briefing ulang setiap kali membuka IDE.

---

## 1. Summary Project & Tech Stack

- **Nama Project**: FlowTech CRM Management System
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Vanilla CSS Modules (Flexbox & CSS Grid, HSL Modern Color Palette `#5d5fef` Indigo, Glassmorphism, Dark Theme elements)
- **Database & ORM**: MySQL (`crm_db`) via **Prisma ORM**
- **Authentication**: Custom HTTP-Only Cookie Session (`crm_session`), bcrypt password hashing, Zod schema validation
- **GitHub Repository**: `https://github.com/alberic13/CRM-web` (Branch: `master`)

---

## 2. Aturan Bahasa & Lokalisasi (Strict Rule)

> **MANDATORY**: Entire UI strings, headers, labels, placeholders, modals, tooltips, validation errors, and API responses MUST BE **100% IN ENGLISH**.

---

## 3. Aturan Git & Push (Strict Rule)

> **DO NOT AUTO GIT PUSH**: Jangan melakukan `git push` secara otomatis setelah menyelesaikan tugas/prompt. Hanya lakukan `git push` ketika USER secara eksplisit meminta untuk *push ke github*.

---

## 4. Struktur Fitur & Halaman

### 📁 `src/app/dashboard/`
- **Dashboard Preview**: Tampilan 5 KPI Metrics, Overall Revenue Trends, Sales Channel Distribution, Revenue Target, Revenue Trend dengan toggle Daily/Weekly/Monthly, serta Tabel Sales Team & Task Completion dengan Foto Orang Asli.

### 📁 `src/app/service/` (Customer Service for Chris)
- **Customer Queries** (`/service/queries`):
  - Table of customer inquiry tickets, Priority filters (`Urgent`, `High`, `Medium`, `Low`), Status filters (`Open`, `Pending`, `Resolved`), Modal `SUBMIT NEW TICKET`.
- **Issue Tracking** (`/service/issues`):
  - Live Issue tracking table, SLA countdown timers, Severity badges (`Critical`, `Major`, `Minor`), Assigned agent avatars.
- **Solutions Library** (`/service/solutions`):
  - Knowledge Base & FAQ articles, category tabs, hero search bar, view & helpful metrics.
- **CSAT & Feedback** (`/service/csat`):
  - Overall CSAT score (94.8%), Average rating (4.8 / 5.0 stars), recent customer feedback review cards with real face photo avatars.

### 📁 `src/app/sales/` (Sales Management for Sam)
- **Sales Opportunities** (`/sales/opportunities`):
  - Header: `ADD OPPORTUNITY` modal form (English).
  - Filter: Last 1 Month / 3 Months / 6 Months, State (Pending, Won, In Progress, Lost).
  - Bulk Actions: `BULK DELETE`, `BULK EXPORT`.
- **Sales Activity** (`/sales/activity`):
  - Activity log (Calls, Emails, Meetings).
- **Customers** (`/customers`):
  - Table with search filter, region/status filter, modal `ADD CUSTOMER`.
- **Sales Reports & Analysis** (`/sales/reports`):
  - Combo Chart: Volume Bar Hijau Emerald (`#34d399`) + Kurva Smooth Revenue Indigo (`#5d5fef`).
  - World Regional Map: Peta dunia regional + Bendera negara asli (`US`, `Canada`, `China`, `UK`, `France`).
  - Customer Analysis: Proyeksi Pie Diagram Kiri + Metrics + Stacked Progress Bar.
  - Product Preferences: Grid TOP 10 produk.

### 📁 `src/app/marketing/` (Marketing for Mia)
- **Customer Segmentation** (`/marketing/segmentation`):
  - Metric Bar: Total Customers (1090), New (26), Loyal (158), Lost (11).
  - Card 1: `Customer source` Donut.
  - Card 2: `Age Distribution` Donut Diagram (Enlarged `350x200`) dengan **Garis Penunjuk Akurat (Callout Lines + Anchor Dots)** mengarah ke teks persentase (`0-20`, `21-30`, `31-40`, `41-50`, `>50`).
  - Card 3: `Purchase Behavior Analysis` **Horizontal LINE Graph** (bukan dot graph), lengkap dengan sumbu Y vertikal `(Purchase Frequency)` dan sumbu X `(Age)`.
- **Marketing Campaigns** (`/marketing/campaigns`):
  - Table Header: `Campaign Name`, `Channel`, `Budget`, `Leads Generated`, `Status`.

### 📁 `src/app/clients/`, `src/app/analytics/`, `src/app/settings/`
- **Clients**: Client table with English headers (`Client`, `Industry`, `Region`, `Tier Category`).
- **Analytics**: System metrics in English (`+4.2% vs last month`, `14 Mins`, `3x Faster`).
- **Settings**: Role management (`ADMIN`, `MANAGER`, `AGENT`) with user counts in English.

---

## 5. Keamanan & Git Rules

1. **Aturan Ignore (`.gitignore`)**:
   - `figma-mcp/` (Selalu abaikan folder token MCP Figma)
   - `.env*` (Abaikan environment variables)
   - `node_modules/`, `.next/`, `/build`
2. **Kredensial**:
   - Jangan pernah melakukan commit token rahasia, API key, atau password database production ke git.

---

## 6. Perintah Pengujian & Run Lokal

- **Development Server**: `npm run dev` (`http://localhost:3000`)
- **Production Build Check**: `npm run build`
- **Git Push**: Hanya jika diminta secara manual oleh user.
