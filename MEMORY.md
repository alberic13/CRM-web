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

## 3. Struktur Fitur & Halaman

### 📁 `src/app/dashboard/`
- **5 KPI Metrics**: Total Revenue, Total Quantity, Number of Orders, Average Order Value, Customer Count.
- **Charts**:
  - `Overall Revenue Trends`: Line chart (Total & Online).
  - `Sales Channel Distribution`: Donut chart (73.4% Online / 26.6% Retail).
  - `Revenue Trend`: Line chart dengan toggle (Daily / Weekly / Monthly).
- **Tabel**:
  - `Sales Team`: Menampilkan **Foto Avatar Orang Asli** (High-Res 32px, `public/avatars/user1.jpg` - `user10.jpg`). Header: `Member Name`, `Revenue`, `Orders Number`, `Conversion Rate`.
  - `Task Completion`: Menampilkan **Foto Avatar Orang Asli**. Header: `Company`, `Completed`, `In progress`.

### 📁 `src/app/sales/opportunities/`
- **Sales Opportunities**:
  - Header: `+ ADD OPPORTUNITY` modal form (English).
  - Filter: Last 1 Month / 3 Months / 6 Months, State (Pending, Won, In Progress, Lost).
  - Bulk Actions: `BULK DELETE`, `BULK EXPORT`.
  - Form Modal: Fields `Opportunity / Deal Name`, `Customer / Company Name`, `Estimated Revenue ($)`, `Deal Status`, `Expected Close Date`, `Owner / Sales Agent`, `Additional Notes`. Buttons: `Cancel`, `Save Opportunity`.

### 📁 `src/app/sales/reports/`
- **Sales Reports & Analysis**:
  - Combo Chart: Volume Bar Hijau Emerald (`#34d399`) + Kurva Smooth Revenue Indigo (`#5d5fef`).
  - World Regional Map: Peta dunia regional + Bendera negara asli (`US`, `Canada`, `China`, `UK`, `France`).
  - Customer Analysis: Proyeksi Pie Diagram Kiri + Metrics + Stacked Progress Bar (Repeat, One-time, Non-purchasing).
  - Product Preferences: Grid TOP 10 produk.

### 📁 `src/app/customers/`
- **Sales Customers**:
  - Header: `+ ADD CUSTOMER` modal form (English).
  - Search: `"Search name, email, No..."`.
  - Filters: Customer Status (Loyal, New, Lost), Region (North America, Europe, Asia Pacific).

### 📁 `src/app/marketing/segmentation/`
- **Marketing Segmentation**:
  - Metric Bar: Total Customers (1090), New (26), Loyal (158), Lost (11).
  - Card 1: `Customer source` Donut.
  - Card 2: `Age Distribution` Donut Diagram (Enlarged `350x200`) dengan **Garis Penunjuk Akurat (Callout Lines + Anchor Dots)** mengarah ke teks persentase (`0-20`, `21-30`, `31-40`, `41-50`, `>50`).
  - Card 3: `Purchase Behavior Analysis` **Horizontal LINE Graph** (bukan dot graph), lengkap dengan sumbu Y vertikal `(Purchase Frequency)` dan sumbu X `(Age)`.

### 📁 `src/app/marketing/campaigns/`
- **Marketing Campaigns**:
  - Table Header: `Campaign Name`, `Channel`, `Budget`, `Leads Generated`, `Status`.

### 📁 `src/app/clients/`
- **Clients Management**:
  - Table Header: `Client`, `Industry`, `Region`, `Tier Category`.

### 📁 `src/app/analytics/`
- **System Analytics**:
  - Metrics: `Sales Conversion Rate` (`+4.2% vs last month`), `Customer Retention Index` (`+1.8% vs last month`), `Average Lead Response Time` (`14 Mins`, `3x Faster`).

### 📁 `src/app/settings/`
- **User Role Management**:
  - Roles: `ADMIN`, `MANAGER`, `AGENT` dengan deskripsi penuh Bahasa Inggris & statistik pengguna.

### 📁 `src/app/login/`
- **Login Page**:
  - Title: `Welcome Back`, `Sign in to FlowTech CRM Management System`.
  - Demo Admin: `admin@flowtech.com` / `password123`.

### 🧩 Components (`src/components/`)
- `Sidebar.tsx`: Navigasi utama dengan scrollbar kustom yang serasi dengan tema UI.
- `Header.tsx`: Search bar (`"Search in CRM..."`), Tooltips (`Notifications`, `Language`, `Logout`), User profile badge.

---

## 4. Keamanan & Git Rules

1. **Aturan Ignore (`.gitignore`)**:
   - `figma-mcp/` (Selalu abaikan folder token MCP Figma)
   - `.env*` (Abaikan environment variables)
   - `node_modules/`, `.next/`, `/build`
2. **Kredensial**:
   - Jangan pernah melakukan commit token rahasia, API key, atau password database production ke git.

---

## 5. Perintah Pengujian & Run Lokal

- **Development Server**: `npm run dev` (`http://localhost:3000`)
- **Production Build Check**: `npm run build`
- **Prisma Seed**: `npx prisma db seed`
- **Git Push**: `git push origin master`
