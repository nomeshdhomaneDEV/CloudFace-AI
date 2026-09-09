# CloudFace AI – Cloud-Based Smart Face Recognition Attendance Management System

An academic cloud computing micro-project delivering an automated, contactless student attendance management system powered by AI facial verification, Next.js, and PostgreSQL.

---

## 📌 Project Purpose

Traditional student attendance systems rely on physical paper registers or manual spreadsheet entry. These approaches suffer from:
- Time lost during class hours
- Human error and attendance record tampering
- Proxy attendance ("buddy punching")
- Tedious report generation for faculty and administrators

**CloudFace AI** solves this problem by automating identity verification at the camera level and syncing attendance records directly with a cloud database in real time.

---

## 🛠️ Technology Stack (100% Free Tier)

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Full-stack serverless framework |
| **Frontend Core** | React 19 & TypeScript 5 | Type-safe declarative user interface |
| **Styling** | Tailwind CSS v4 | Responsive modern dark-theme UI |
| **Icons** | Lucide React | Clean, lightweight UI iconography |
| **ORM** | Prisma ORM 6.19 | Type-safe PostgreSQL client & migrations |
| **Database** | PostgreSQL / Supabase | Cloud relational database for attendance data |
| **Hosting** | Vercel | Production cloud deployment platform |
| **3D Graphics** | Three.js / React Three Fiber | Prepared for Phase 10 interactive visual canvas |

---

## 📁 Project Directory Structure

```text
CloudFace AI/
├── app/                  # Next.js App Router (pages, layout, styles)
│   ├── globals.css       # Core styling, glow effects, and design system tokens
│   ├── layout.tsx        # Production root layout with metadata & fonts
│   └── page.tsx          # CloudFace AI Landing Page
├── components/           # Reusable UI components
│   └── landing/          # Modular landing page sections
│       ├── Navbar.tsx
│       ├── HeroSection.tsx
│       ├── FeaturesSection.tsx
│       ├── ArchitectureSection.tsx
│       ├── RoadmapSection.tsx
│       ├── Footer.tsx
│       └── AuthModal.tsx
├── hooks/                # Custom React hooks
│   └── use-mounted.ts    # Safe hydration detection hook
├── lib/                  # Application utilities and singletons
│   ├── prisma.ts         # Singleton Prisma Client for Next.js
│   └── utils.ts          # Tailwind cn() merge utility
├── prisma/               # Database modeling
│   └── schema.prisma     # PostgreSQL schema definitions
├── public/               # Static assets & icons
├── types/                # Central TypeScript interfaces
│   └── index.ts
├── .env.example          # Safe template for environment variables
├── package.json          # Project scripts and dependencies
├── tsconfig.json         # Strict TypeScript compiler options
└── README.md             # Project documentation
```

---

## ⚙️ Local Setup Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v20+ or v22+ recommended)
- `npm` (packaged with Node.js)
- A free [Supabase](https://supabase.com/) account (for Phase 3 PostgreSQL database)

> **Windows Note**: If running PowerShell with script execution policies disabled, run npm commands using `npm.cmd` or run PowerShell as Administrator and execute `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`.

### 2. Clone and Install Dependencies
```bash
# Navigate to the project root
cd "CloudFace AI"

# Install dependencies
npm install
```

---

## 🔐 Environment Variables

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Configure your PostgreSQL credentials in `.env`:

```env
# Transaction Mode (with connection pooling, recommended for Vercel serverless)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Session / Direct Mode (used by Prisma migrations and schema pushes)
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> ⚠️ **Security Warning**: Real database credentials must never be committed to Git. The `.gitignore` file is strictly configured to protect `.env`.

---

## 🚀 Running the Development Server

Start the local Next.js dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the CloudFace AI landing page.

---

## 🗄️ How Prisma ORM is Used

Prisma acts as the type-safe object-relational mapper between Next.js and PostgreSQL.

### Key Database Models (`prisma/schema.prisma`):
1. **`Profile`**: Core user accounts (Students and Admins) with role-based attributes.
2. **`Student`**: Academic information (roll number, class, division, face enrollment status).
3. **`Attendance`**: Daily attendance records with a composite unique index (`[studentId, attendanceDate]`) ensuring students cannot mark duplicate attendance on the same day.
4. **`AdminActivityLog`**: Audit trail recording administrative changes and exports.

### Useful Prisma Commands:
```bash
# Regenerate the TypeScript Prisma Client after modifying schema.prisma
npm run postinstall
# or
npx prisma generate

# Push schema changes directly to your PostgreSQL database (Phase 3)
npm run db:push

# Open the interactive visual database browser (Prisma Studio)
npm run db:studio

# Validate schema syntax
npx prisma validate
```

---

## 🗺️ Development Roadmap

- [x] **Phase 1: Architecture & Planning** — Finalize SRS, database schema, and project rules.
- [x] **Phase 2: Project Setup & Foundation** — Next.js 16, TypeScript, Tailwind CSS, Prisma ORM, responsive landing page.
- [ ] **Phase 3: Supabase Cloud Database** — Connect remote PostgreSQL database and apply schema.
- [ ] **Phase 4: Authentication** — Student and Admin login/registration with Supabase Auth.
- [ ] **Phase 5: Student Portal** — Profile view, attendance percentage, and history logs.
- [ ] **Phase 6: Face Enrollment** — Device camera integration and biometric enrollment.
- [ ] **Phase 7: Attendance Verification** — Real-time camera scanner with anti-duplicate logic.
- [ ] **Phase 8: Administrator Console** — Student roster management and date filters.
- [ ] **Phase 9: Analytics & CSV Export** — Institutional reporting and interactive charts.
- [ ] **Phase 10: 3D Landing Page** — Interactive Three.js / React Three Fiber cloud visualization.
- [ ] **Phase 11: Testing & Hardening** — Full cross-device testing and security audit.
- [ ] **Phase 12: Production Vercel Deployment** — Cloud deployment and live URL release.

---

## 📄 License
Academic college micro-project developed for educational demonstration purposes.
