# Mawaqit Web - AI Agent Guide

## Project Overview
**Mawaqit** is a modern Islamic prayer times application built with Next.js 15+, React 19, Tailwind CSS v4, and TypeScript. It provides accurate prayer times based on user location and calculation method preferences.

## Tech Stack
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (CSS-first, no config file)
- **State/Data**: SWR for data fetching, localStorage for persistence
- **Fonts**: Inter (Latin) + Noto Sans Arabic (Arabic) via `next/font/google`
- **Theming**: `next-themes` with class-based dark mode
- **Icons**: Inline SVG components
- **Validation**: Zod schemas

## Project Structure
```
mawaqit-web/
├── src/
│   ├── app/
│   │   ├── prayer-times/
│   │   │   └── page.tsx          # SSR page for today's prayer times
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── page.tsx              # Landing page
│   │   ├── globals.css           # Tailwind v4 + CSS variables + theme
│   │   └── providers.tsx         # SWRConfig provider
│   ├── components/
│   │   ├── ui/                   # Base UI components (Button, Select, Input, Card, etc.)
│   │   └── prayer-times/         # Prayer times specific components
│   │       ├── TodayPrayerTimesClient.tsx
│   │       ├── LocationInput.tsx
│   │       ├── MethodControls.tsx
│   │       ├── PrayerTimeCard.tsx
│   │       └── index.ts
│   └── lib/
│       ├── api.ts                # API client with retry logic
│       ├── validation.ts         # Zod schemas
│       ├── errors.ts             # Custom error classes
│       └── swr-config.ts         # SWR global config
├── hooks/
│   ├── usePrayerTimes.ts         # SWR hooks for prayer times
│   ├── useLocation.ts            # Location state + localStorage
│   └── useLocationMutations.ts   # Location updates + SWR revalidation
├── types/
│   └── prayer-times.ts           # TypeScript interfaces
├── .env                          # NEXT_PUBLIC_API_URL=http://localhost:8000/api
└── tsconfig.json                 # Path aliases: @/*, @/components/*, @/hooks/*, @/types/*
```

## Key Conventions

### Path Aliases (tsconfig.json)
```json
"@/*": ["./src/*", "./types/*", "./lib/*", "./hooks/*"],
"@/components/*": ["./components/*"],
"@/hooks/*": ["./hooks/*"],
"@/types/*": ["./types/*"]
```

### Import Patterns
```typescript
// ✅ Correct - use path aliases
import { Button } from '@/components/ui/Button';
import { useTodayPrayerTimes } from '@/hooks/usePrayerTimes';
import type { LocationParams } from '@/types/prayer-times';

// ❌ Wrong - relative imports
import { Button } from '../../../components/ui/Button';
```

### Component Structure
```typescript
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
- No `tailwind.config.ts` - all config in `src/app/globals.css`
- Use `@theme inline` for design tokens
- Dark mode via `.dark` class selector (not `prefers-color-scheme`)
- CSS variables for all colors, fonts, spacing

### State Management
- **Server state**: SWR hooks (`useTodayPrayerTimes`, `usePrayerTimes`, etc.)
- **Client state**: React `useState` + `useCallback`
- **Persistence**: localStorage via `useLocation` hook
- **URL sync**: Debounced `router.push()` with search params

## API Integration

### Base URL
`NEXT_PUBLIC_API_URL=http://localhost:8000/api` (includes `/api` prefix)

### Endpoints Used
| Endpoint | Hook | Purpose |
|----------|------|---------|
| `GET /prayer-times/today` | `useTodayPrayerTimes` | Today's prayer times |
| `GET /prayer-times` | `usePrayerTimes` | Specific date |
| `GET /prayer-times/range` | `usePrayerTimesRange` | Date range |
| `GET /prayer-times/methods` | `usePrayerTimesMethods` | Calculation methods |

### Request Parameters
```typescript
interface SingleDayParams {
  lat: number;
  lng: number;
  timezone: string;           // IANA timezone
  calculation_method: string; // e.g., MUSLIM_WORLD_LEAGUE
  madhab: string;             // SHAFI | HANAFI
  high_latitude_rule: string; // MIDDLE_OF_THE_NIGHT | SEVENTH_OF_THE_NIGHT | TWILIGHT_ANGLE
  nafl_method: string;        // QUARTER_DAY | SOLAR_ANGLE_DUHA | etc.
}
```

## Data Flow (Prayer Times Page)

```
page.tsx (SSR)
  ├─ parse searchParams → LocationParams
  ├─ fetch today's data via apiClient.getTodayPrayerTimes()
  └─ render <TodayPrayerTimesClient initialData={data} initialParams={params} />
        │
        ▼
TodayPrayerTimesClient (Client)
  ├─ useTodayPrayerTimes(params, { fallbackData: initialData })
  ├─ useLocation() + useUpdateLocation() for persistence
  ├─ handleChange → setParams + debounced URL sync + updateLocation()
  ├─ handleGeolocation → navigator.geolocation + auto timezone
  └─ Render: LocationInput + MethodControls + PrayerTimeCard[]
```

## UI Components

### Base Components (`components/ui/`)
| Component | Props | Notes |
|-----------|-------|-------|
| `Button` | `variant`, `size`, `disabled`, `onClick` | primary, outline, ghost, destructive |
| `Select` | `options`, `value`, `onChange`, `label` | Generic `<T>` support |
| `Input` | `type`, `value`, `onChange`, `label`, `error` | number, text, email |
| `Card` | `children`, `className` | CardHeader, CardContent, CardFooter |
| `LoadingSpinner` | `size`, `color`, `aria-label` | Inline SVG, accessible |
| `ErrorAlert` | `message`, `onDismiss`, `onRetry` | Dismissible, retry action |
| `MethodSelect` | `value`, `onChange` | 12 calculation methods |

### Prayer Times Components (`components/prayer-times/`)
| Component | Purpose |
|-----------|---------|
| `TodayPrayerTimesClient` | Main client component |
| `LocationInput` | Lat/Lng inputs + timezone select + geolocation button |
| `MethodControls` | 4 dropdowns: calculation, madhab, high-lat, nafl |
| `PrayerTimeCard` | Single time display (obligatory + nafl + elevation) |

## Theming

### Color Palette (CSS Variables in `globals.css`)
```css
:root {
  --color-primary: #006B3C;           /* Islamic green */
  --color-primary-hover: #005a32;
  --color-primary-light: #008f4d;
  --color-secondary: #f39c12;         /* Gold */
  --color-background: #ffffff;
  --color-surface: #f8faf8;
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
  --color-text: #f5f5f5;
  --color-text-muted: #a0a0a0;
  --color-border: #333333;
}
```

### Theme Provider
```tsx
// components/ui/theme-provider.tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme={false}>
  {children}
</ThemeProvider>
```

## Development Commands
```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build + type check
npm run lint     # ESLint
npm run typecheck # TypeScript only (if separate script)
```

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

## Backend API (mawaqit-api)
Separate FastAPI project at `../mawaqit-api/`:
- Runs on `http://localhost:8000`
- Requires `tzdata` package on Windows
- Prayer times use `adhanpy` library (no DB needed for core endpoints)
- CORS configured for `http://localhost:3000`

## Git Workflow
- Feature branches from `main`
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Run `npm run build && npm run lint` before PR

## Performance Notes
- SWR `dedupingInterval: 60000` (1 min)
- `revalidateOnFocus: false`
- Debounced URL updates (300ms)
- Static generation for landing page
- Dynamic SSR for `/prayer-times`

## Accessibility
- Semantic HTML (`<section aria-labelledby>`)
- ARIA labels on interactive elements
- Focus-visible states on all inputs
- Color contrast ratios (WCAG AA)
- Screen reader support (sr-only text)
- Keyboard navigation

## Arabic/RTL Support
- `Noto Sans Arabic` font loaded via `next/font`
- `dir="rtl"` on Arabic content containers
- `font-arabic` Tailwind class via `@theme inline`