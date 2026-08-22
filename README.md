# Mawaqit Web

**Mawaqit** (مواقيت) — *Islamic Prayer Times & Quran Companion*

A modern, accessible web application for accurate prayer times, Quran reading with translations and tafsir, an Islamic knowledge library, and Zakat calculation. Built with Next.js 15, React 19, and Tailwind CSS v4.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | [Next.js](https://nextjs.org) | 15 (App Router, Turbopack) |
| Language | [TypeScript](https://www.typescriptlang.org) | 5 (strict mode) |
| Styling | [Tailwind CSS](https://tailwindcss.com) | v4 (CSS-first, no config file) |
| State / Data | [SWR](https://swr.vercel.app) | 2.4 (caching, revalidation) |
| Fonts | [Inter](https://rsms.me/inter/) + [Noto Sans Arabic](https://fonts.google.com/noto/specimen/Noto+Sans+Arabic) | via `next/font/google` |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) | class-based dark mode |
| Icons | [lucide-react](https://lucide.dev) | inline SVG |
| Validation | [Zod](https://zod.dev) | 4 |
| Maps | [Leaflet](https://leafletjs.com) + [react-leaflet](https://react-leaflet.js.org) | 1.9 / 5.0 |
| Hijri Calendar | [hijri-js](https://github.com/amina-s/hijri-js) | 1.0 |
| Notifications | [sonner](https://sonner.emilkowal.ski) | 2.0 |

---

## Features

### 🕌 Prayer Times (`/prayer-times`)
- **Today / specific date / date range** — accurate times for any location
- **11 calculation methods** — Muslim World League, Egyptian, Karachi, Umm al-Qura, Dubai, Moon Sighting Committee, North America, Kuwait, Qatar, Singapore, UOIF
- **Madhab support** — Shafi'i and Hanafi for Asr
- **High-latitude rules** — Middle of the Night, Seventh of the Night, Twilight Angle
- **Nafl prayers** — Ishraq, Duha, Tahajjud with configurable methods
- **Manual adjustments** — per-prayer minute offsets (±60 min)
- **Geolocation + timezone auto-detect** — browser GPS + IANA timezone
- **Persisted preferences** — localStorage + URL sync (debounced)

### 📖 Quran (`/quran`)
- **All 114 surahs** with revelation type, verse count, page/juz mapping
- **Verse-by-verse reading** with Arabic text, translations, and tafsir
- **36 translation/tafseer editions** — 32 translations + 6 tafseers (multi-language, RTL/LTR)
- **Edition persistence** — selected translation carried across surah/verse navigation via URL
- **Search & filter** — by surah, juz, page, sajda verses

### 📚 Islamic Library (`/library`)
- **Category → Subcategory → Items** hierarchy (Quran, Hadith, Fiqh, etc.)
- **Articles & videos** — auto-detected by link presence
- **Admin-managed content** — CRUD via protected endpoints

### 💰 Zakat Calculator (`/zakat`)
- **Frontend-only** — no backend dependency
- **Multi-currency** — USD, EUR, GBP, PKR, SAR, AED, INR, CAD, AUD
- **Nisab by silver (595g) / gold (85g) / custom** — live price inputs
- **Asset categories** — cash, gold (g), silver (g), investments, business inventory, receivables
- **Deductible debts** — subtracted before 2.5% calculation
- **Visual result** — green when above Nisab, breakdown card

### 🛡️ Admin Panel (`/admin/*`)
- **JWT authentication** — login, credential rotation
- **Content management** — categories, subcategories, articles/videos
- **Quran management** — surahs, verses, translations, tafseer details
- **Role-guarded routes** — middleware protection

---

## Project Structure

```
mawaqit-web/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                 # Public route group (no auth)
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── layout.tsx            # Public layout + providers
│   │   │   ├── prayer-times/         # Prayer times routes
│   │   │   │   ├── page.tsx          # Today (SSR + client)
│   │   │   │   ├── [date]/page.tsx   # Specific date
│   │   │   │   └── range/page.tsx    # Date range
│   │   │   ├── quran/                # Quran routes
│   │   │   │   ├── page.tsx          # Surah list
│   │   │   │   ├── [surah_number]/page.tsx        # Surah view
│   │   │   │   └── [surah_number]/[verse_number]/page.tsx  # Verse detail
│   │   │   ├── library/              # Library routes
│   │   │   │   ├── page.tsx          # Categories
│   │   │   │   ├── [category_id]/page.tsx
│   │   │   │   ├── [category_id]/[subcategory_id]/page.tsx
│   │   │   │   └── item/[id]/page.tsx
│   │   │   └── zakat/page.tsx        # Zakat calculator
│   │   ├── (admin)/                  # Admin route group (protected)
│   │   │   ├── layout.tsx            # Admin layout + auth check
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── categories/page.tsx
│   │   │   ├── articles/page.tsx
│   │   │   ├── videos/page.tsx
│   │   │   ├── surahs/page.tsx
│   │   │   ├── verses/page.tsx
│   │   │   ├── translations/page.tsx
│   │   │   └── tafsir/page.tsx
│   │   ├── globals.css               # Tailwind v4 + CSS variables + theme
│   │   ├── providers.tsx             # SWRConfig + ThemeProvider
│   │   └── layout.tsx                # Root layout (fonts, providers)
│   ├── components/
│   │   ├── ui/                       # Base UI components (Button, Select, Input, Card, etc.)
│   │   ├── prayer-times/             # Prayer times specific components
│   │   ├── quran/                    # Quran components (SurahList, VerseDetail, etc.)
│   │   ├── library/                  # Library components
│   │   ├── zakat/                    # Zakat calculator components
│   │   └── layout/                   # PageContainer, Header, Footer, ThemeToggle
│   ├── hooks/
│   │   ├── usePrayerTimes.ts         # SWR hooks for prayer times
│   │   ├── useLocation.ts            # Location state + localStorage
│   │   ├── useLocationMutations.ts   # Location updates + SWR revalidation
│   │   ├── useQuran.ts               # SWR hooks for Quran data
│   │   └── useLibrary.ts             # SWR hooks for library data
│   ├── lib/
│   │   ├── api.ts                    # API client with retry logic
│   │   ├── validation.ts             # Zod schemas
│   │   ├── errors.ts                 # Custom error classes
│   │   └── swr-config.ts             # SWR global config
│   └── types/
│       ├── prayer-times.ts           # TypeScript interfaces for prayer times
│       ├── quran.ts                  # Quran-related types
│       └── library.ts                # Library-related types
├── public/                           # Static assets
├── .env                              # NEXT_PUBLIC_API_URL=http://localhost:8000/api
├── .env.example
├── tsconfig.json                     # Path aliases: @/*, @/components/*, @/hooks/*, @/types/*
├── next.config.js
├── package.json
└── README.md
```

### Route Groups
- **`(public)`** — no authentication, public layouts, shared providers
- **`(admin)`** — JWT-protected, admin layout with sidebar, middleware guard

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.