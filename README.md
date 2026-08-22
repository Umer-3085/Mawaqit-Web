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

---

## Getting Started

### Prerequisites
- **Node.js** 18+ (recommended: 20 LTS)
- **npm** 9+ (or yarn/pnpm/bun)
- **Backend API** running at `http://localhost:8000` (see [mawaqit-api](../mawaqit-api))

### Environment Variables
Copy `.env.example` to `.env` and adjust:
```bash
cp .env.example .env
```
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (must include `/api`) | `http://localhost:8000/api` |

### Installation
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development
```bash
npm run dev
# Runs on http://localhost:3000 with Turbopack
```

### Production Build
```bash
npm run build   # Type-checks + compiles
npm run start   # Serves production build
```

### Linting & Type Checking
```bash
npm run lint      # ESLint
# npm run typecheck  # TypeScript only (if configured)
```

---

## API Integration

The frontend communicates with the **Mawaqit API** (FastAPI) running at `NEXT_PUBLIC_API_URL`.

### Base Configuration
```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
```

### Prayer Times Endpoints

| Endpoint | Hook | Purpose | Key Params |
|----------|------|---------|------------|
| `GET /prayer-times/today` | `useTodayPrayerTimes` | Today's prayer times | `lat`, `lng`, `timezone`, `calculation_method?`, `madhab?`, `high_latitude_rule?`, `nafl_method?` |
| `GET /prayer-times` | `usePrayerTimes` | Specific date | Above + `date` (YYYY-MM-DD), adjustments (`*_adj`) |
| `GET /prayer-times/range` | `usePrayerTimesRange` | Date range (max 30 days) | `start_date`, `end_date`, same as above |
| `GET /prayer-times/methods` | `usePrayerTimesMethods` | List 11 calculation methods | — |

### Quran Endpoints
| Endpoint | Hook | Purpose |
|----------|------|---------|
| `GET /surahs` | `useSurahs` | Paginated surah list (filter: revelation type, search) |
| `GET /surahs/{number}` | `useSurah` | Single surah with verses |
| `GET /verses/surah/{surah}` | `useVerses` | All verses of a surah |
| `GET /texts/surah/{surah}/ayah/{ayah}` | `useVerseTexts` | All translations/tafseers for a verse |
| `GET /details` | `useDetails` | Translation/tafseer metadata (36 editions) |

### Library Endpoints
| Endpoint | Hook | Purpose |
|----------|------|---------|
| `GET /categories` | `useCategories` | Category list |
| `GET /subcategories?category_id=` | `useSubcategories` | Subcategories by category |
| `GET /articles-videos` | `useArticlesVideos` | Items (filter: category, subcategory, type) |

### SWR Configuration (lib/swr-config.ts)
```typescript
export const swrConfig = {
  revalidateOnFocus: false,
  dedupingInterval: 60_000,        // 1 minute
  refreshInterval: 0,              // No auto-refresh
  onErrorRetry: (err, key, cfg, revalidate, { retryCount }) => {
    if (retryCount >= 3) return;
    if (err.status === 404) return;
    setTimeout(() => revalidate({ retryCount }), 1000 * retryCount);
  },
};
```

---

## Key Conventions

### Path Aliases (tsconfig.json)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*", "./types/*", "./lib/*", "./hooks/*"],
      "@/components/*": ["./components/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/types/*": ["./types/*"]
    }
  }
}
```

### Import Patterns
```typescript
// ✅ Correct — use path aliases
import { Button } from '@/components/ui/Button';
import { useTodayPrayerTimes } from '@/hooks/usePrayerTimes';
import type { LocationParams } from '@/types/prayer-times';

// ❌ Wrong — relative imports
import { Button } from '../../../components/ui/Button';
```

### Component Structure
```tsx
'use client';  // Only for client components

import { cn } from '@/components/ui/utils';

export interface ComponentProps {
  // props with JSDoc comments for complex props
}

export function Component({ prop }: ComponentProps) {
  // implementation
}
```

### Tailwind v4 Usage
- **No `tailwind.config.ts`** — all config in `src/app/globals.css`
- Use `@theme inline` for design tokens
- **Dark mode via `.dark` class selector** (not `prefers-color-scheme`)
- CSS variables for all colors, fonts, spacing

### State Management
- **Server state**: SWR hooks (`useTodayPrayerTimes`, `usePrayerTimes`, etc.)
- **Client state**: React `useState` + `useCallback`
- **Persistence**: localStorage via `useLocation` hook
- **URL sync**: Debounced `router.push()` with search params (300ms)

---

## Theming & Design System

### Color Palette (CSS Variables in `globals.css`)
```css
:root {
  --color-primary: #006B3C;           /* Islamic green */
  --color-primary-hover: #005a32;
  --color-primary-light: #008f4d;
  --color-secondary: #f39c12;         /* Gold */
  --color-background: #ffffff;
  --color-surface: #f8faf8;
  --color-surface-elevated: #ffffff;
  --color-text: #1a1a1a;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;
  --color-border-focus: #006B3C;
  --color-error: #dc2626;
  --color-success: #006B3C;
}

.dark {
  --color-primary: #2ecc71;
  --color-primary-hover: #27ae60;
  --color-background: #1a1a1a;
  --color-surface: #242424;
  --color-surface-elevated: #2d2d2d;
  --color-text: #f5f5f5;
  --color-text-muted: #a0a0a0;
  --color-border: #333333;
}
```

### Dark Mode
- **Class-based** via `next-themes` (`.dark` on `<html>`)
- **No `prefers-color-scheme`** — user preference only
- **CSS variables** for all colors — automatic switching

### Typography
```css
--font-sans: 'Inter', system-ui, sans-serif;           /* Latin + Latin-ext */
--font-arabic: 'Noto Sans Arabic', system-ui, sans-serif;  /* Arabic */
```
- **Arabic content**: use `font-arabic` class, line-height 1.8, supports diacritics

### Spacing System
Base unit: **4px (0.25rem)** — tokens 1–12 (4px → 48px)

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 4px | Chips, badges |
| `DEFAULT` | 8px | **Buttons, inputs, cards** |
| `md` | 12px | Modals, dropdowns |
| `lg` | 16px | Sheets, panels |
| `xl` | 24px | Large containers |
| `full` | 9999px | Pills, avatars |

### Shadows
| Token | Light | Dark |
|-------|-------|------|
| `sm` | `0 1px 2px rgba(0,0,0,0.05)` | `0 1px 2px rgba(0,0,0,0.3)` |
| `DEFAULT` | `0 4px 6px rgba(0,0,0,0.07)` | `0 4px 6px rgba(0,0,0,0.4)` |
| `md` | `0 10px 15px rgba(0,0,0,0.1)` | `0 10px 15px rgba(0,0,0,0.5)` |
| `lg` | `0 20px 25px rgba(0,0,0,0.15)` | `0 20px 25px rgba(0,0,0,0.6)` |

---

## Testing Checklist

- [ ] SSR page loads with initial data (no hydration mismatch)
- [ ] Client hydrates correctly with `fallbackData`
- [ ] Location inputs update and revalidate
- [ ] Geolocation button works (HTTPS required in prod)
- [ ] All 4 method dropdowns update and revalidate
- [ ] 6 obligatory + 7 nafl/elevation cards display
- [ ] Loading spinner shows during fetch
- [ ] Error alert shows on API failure
- [ ] Dark mode toggle works
- [ ] URL sync works (debounced 300ms)
- [ ] localStorage persistence works
- [ ] `npm run build` and `npm run lint` pass

## Common Issues & Fixes

### Hydration Mismatch
- **Cause**: Invalid HTML (e.g., `<span>` inside `<svg>`)
- **Fix**: Move accessible text outside SVG wrapper

### Timezone Validation Fails on Windows
- **Cause**: Python `zoneinfo` needs `tzdata` package
- **Fix**: `pip install tzdata` + full server restart

### Dropdown Not Updating
- **Cause**: Key mismatch (camelCase vs snake_case)
- **Fix**: Ensure `onChange` keys match `ClientParams` interface

### API 404
- **Cause**: Missing `/api` prefix in `NEXT_PUBLIC_API_URL`
- **Fix**: Set `NEXT_PUBLIC_API_URL=http://localhost:8000/api`

### Path Alias Not Resolving
- **Cause**: Missing entries in `tsconfig.json` paths
- **Fix**: Add `@/components/*`, `@/hooks/*`, `@/types/*` aliases

---

## Deployment

### Vercel (Recommended)
1. Push to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Add `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

### Environment Variables for Production
| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Production API URL (e.g., `https://api.mawaqit.com/api`) |

---

## Accessibility (WCAG AA)

- **Semantic HTML** — `<main>`, `<section aria-labelledby>`, `<article>`
- **ARIA labels** — on icon-only buttons, form inputs, live regions
- **Focus management** — visible focus rings, `focus-visible` for keyboard-only
- **Color contrast** — primary text 12.6:1, muted text 4.5:1, buttons 7.8:1
- **Keyboard navigation** — tab order matches visual, Escape closes modals
- **Screen readers** — `sr-only` for visual-only content, live regions for updates

### Arabic / RTL Support
- `Noto Sans Arabic` font loaded via `next/font`
- `dir="rtl"` on Arabic content containers
- `font-arabic` Tailwind class via `@theme inline`

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Follow conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
4. Run `npm run build && npm run lint` before pushing
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](../LICENSE) for details.

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.