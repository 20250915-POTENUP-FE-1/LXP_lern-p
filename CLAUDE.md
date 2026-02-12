# CLAUDE.md - Lernix LXP Codebase Guide

## Project Overview

Lernix is a **role-switch Learning Experience Platform (LXP)** built with Next.js. Users can seamlessly switch between student and instructor roles. The platform supports course creation, enrollment, payment processing (TossPayments), shopping cart, and admin management. The UI language is Korean.

## Tech Stack

| Layer              | Technology                              |
| ------------------ | --------------------------------------- |
| Framework          | Next.js 16 (App Router)                 |
| Language           | TypeScript 5 (strict mode)              |
| React              | 19.2                                    |
| Styling            | Tailwind CSS v4 + CSS Modules           |
| State Management   | Zustand 5                               |
| Icons              | Lucide React                            |
| Backend/DB         | Firebase (Firestore + Auth)             |
| Payment            | TossPayments SDK                        |
| API Client         | Custom `fetchApi` (server-side)         |
| Mocking            | MSW (Mock Service Worker) 2             |
| Linting            | ESLint 9 + Prettier 3                   |
| Package Manager    | npm                                     |

## Quick Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router (pages, layouts, API routes)
│   ├── (auth)/             # Auth route group (signup)
│   ├── (user)/             # Protected user routes (mypage, instructor)
│   ├── admin/              # Admin dashboard & instructor approval
│   ├── api/                # API routes
│   ├── cart/               # Cart page
│   ├── courses/            # Course listing, detail, create, edit, learn
│   ├── orders/             # Payment success/failure callbacks
│   ├── _providers/         # Root providers (AuthProvider, MSWProvider)
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
│
├── domains/                # Feature-based domain modules
│   ├── admin/              # Admin components, pages, services, types
│   ├── auth/               # Auth actions, components, hooks, services, store, types, utils
│   ├── cart/               # Cart components, hooks, pages, services, types
│   ├── course/             # Course components, constants, hooks, pages, services, types, utils
│   └── user/               # User components, pages, services, types, utils
│
├── mocks/                  # MSW handlers and mock data (*.mock.ts)
│
└── shared/                 # Cross-cutting concerns
    ├── constants/           # Config (USE_MOCK flag)
    ├── guards/              # Auth/role guards (RequireAuth, RequireInstructor, RequireLearn)
    ├── hooks/               # Shared hooks (useModal, useInfiniteScroll)
    ├── lib/
    │   ├── api/fetchApi.ts  # Centralized server-side API client
    │   └── firebase/        # Firebase initialization (firebaseApp, firestore, auth)
    ├── services/            # Shared services (uploadThumbnail)
    ├── types/               # Shared type definitions
    ├── ui/                  # Layout components (AppShell, Header, Modal)
    └── util/                # Utilities (formatDate, fileSize, validateForm)
```

## Architecture & Conventions

### Domain-Driven Organization

Each feature lives in `src/domains/<domain>/` with a consistent internal structure:

```
domains/<domain>/
├── actions/       # Next.js Server Actions (if applicable)
├── components/    # UI components specific to this domain
├── constants/     # Domain-specific constants
├── hooks/         # Custom React hooks
├── pages/         # Page-level client components
├── services/      # API service functions
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

Not every domain has all subdirectories. Only create what is needed.

### Routing

- **App Router** with route groups: `(auth)`, `(user)` for layout grouping
- **Dynamic routes**: `[id]` segments for courses and orders
- **Route guards** in `shared/guards/` protect routes by auth state and user role
- **Layouts** nest: `RootLayout > AppShell > FeatureLayout`

### Key Routes

| Route                      | Access       | Purpose                     |
| -------------------------- | ------------ | --------------------------- |
| `/`                        | Public       | Home / course listing       |
| `/courses/[id]`            | Public       | Course detail               |
| `/courses/create`          | Instructor   | Create new course           |
| `/courses/[id]/edit`       | Instructor   | Edit course                 |
| `/courses/[id]/learn`      | Enrolled     | Course learning view        |
| `/cart`                    | Public       | Shopping cart               |
| `/(auth)/signup`           | Public       | Sign up                     |
| `/(user)/mypage`           | Authenticated| User dashboard              |
| `/(user)/mypage/profile`   | Authenticated| Profile settings            |
| `/(user)/mypage/enrollment`| Authenticated| Enrolled courses            |
| `/(user)/instructor`       | Instructor   | Instructor dashboard        |
| `/admin`                   | Admin        | Admin dashboard             |
| `/orders/[id]/success`     | Authenticated| Payment success callback    |
| `/orders/[id]/fail`        | Authenticated| Payment failure callback    |

### State Management

- **Zustand** stores live in `domains/auth/store/useAuthStore.ts`
- Two stores:
  - `useUserStore` — user data (id, email, roles, cart, enrolled courses)
  - `useAuthStore` — auth loading state flags
- Hydrated server-side in `RootLayout` via `AuthProvider`
- Accessed via `useAuthState()` hook in client components
- Course, cart, and enrollment data is fetched per-component (not global stores)

### API Layer

- **`fetchApi`** (`shared/lib/api/fetchApi.ts`) is the centralized API client
  - Marked `'use server'` — runs only on the server side
  - Auto-injects `Authorization: Bearer <token>` from cookies
  - Handles JSON and FormData requests
  - Token refresh via response header
  - 401 triggers cookie cleanup for re-login
  - 404 + `ER005` code treated as "no data" (returns `null`, not an error)
  - Convenience wrappers: `getApi`, `postApi`, `putApi`, `deleteApi`, `patchApi`

- **Service files** call `fetchApi` and are organized per domain:
  - `domains/auth/services/authService.ts`
  - `domains/course/services/courseService.ts` (+ 7 more course service files)
  - `domains/cart/services/cartService.ts`
  - `domains/user/services/userService.ts`, `enrollmentService.ts`, `orderService.ts`
  - `domains/admin/services/adminService.ts`

### Import Path Alias

Use `@/*` which maps to `./src/*`:
```typescript
import { fetchApi } from '@/shared/lib/api/fetchApi';
import { User } from '@/domains/user/types/user';
```

### Guards

Located in `shared/guards/`:
- `RequireAuth` — redirects unauthenticated users to home with login modal
- `RequireInstructor` — role-based access for instructor features
- `RequireLearn` — guards course learning views for enrolled users

## Code Style & Linting

### ESLint Rules

- Extends: `next/core-web-vitals`, `next/typescript`, `prettier`
- `@typescript-eslint/no-explicit-any`: **error** (never use `any`)
- `import/order`: **warn** — groups: builtin, external, internal, parent, sibling, index

### Prettier Configuration

```
semi: true
singleQuote: true
trailingComma: 'all'
tabWidth: 2
printWidth: 100
bracketSpacing: true
arrowParens: 'always'
endOfLine: 'lf'
plugins: prettier-plugin-tailwindcss
```

### TypeScript

- **Strict mode** enabled
- Target: ES2017
- Module resolution: bundler
- No `any` types allowed (enforced by ESLint)

### Naming Conventions

- **Components**: PascalCase (`CourseCard.tsx`, `LoginModal.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuthState.ts`, `useTossPayment.ts`)
- **Services**: camelCase (`courseService.ts`, `authService.ts`)
- **Types**: PascalCase for type/interface names, camelCase for files
- **Constants**: UPPER_SNAKE_CASE for values, camelCase for files
- **CSS Modules**: `*.module.css` with camelCase class names

### Code Comments

- Comments are written in **Korean** throughout the codebase. Follow this convention.

## Environment Variables

Required environment variables (set in `.env.local`):

```
NEXT_PUBLIC_BASE_URL=          # Backend API base URL
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_USE_MOCK=          # "true" to enable MSW mock mode
```

## Mocking (MSW)

- Toggle via `NEXT_PUBLIC_USE_MOCK=true`
- Mock handlers in `src/mocks/handlers.ts`
- Mock data files: `src/mocks/*.mock.ts`
- Browser setup: `src/mocks/browser.ts`
- Server setup: `src/mocks/server.ts`
- MSW provider currently **disabled** in root layout (commented out)

## Remote Image Hosts

Configured in `next.config.ts` for Next.js Image optimization:
- `localhost:8080`, `localhost:8081` (local dev)
- `43.202.82.239:8080` (EC2 backend)
- `lernix-bucket.s3.ap-northeast-2.amazonaws.com` (AWS S3)
- `example.com` (placeholder)

## User Roles

Three roles with ascending privileges:
1. **STUDENT** — enroll in courses, track progress, leave reviews
2. **INSTRUCTOR** — create/edit courses, manage sections/lectures/resources
3. **ADMIN** — approve instructor applications, platform management

Users apply for instructor status; admins approve/reject via the admin dashboard.

## Key Patterns to Follow

1. **Domain isolation**: Keep feature code within its domain directory. Shared utilities go in `shared/`.
2. **Server-side data fetching**: Use `fetchApi` (server actions) for all API calls. Do not call the backend directly from client components.
3. **Type safety**: Define types in `domains/<domain>/types/`. Never use `any`.
4. **Component structure**: Page-level components in `domains/<domain>/pages/`, presentational components in `domains/<domain>/components/`.
5. **Route protection**: Wrap protected pages with the appropriate guard component.
6. **State hydration**: Initial user data is fetched server-side in `RootLayout` and hydrated into Zustand stores via `AuthProvider`.
7. **File uploads**: Use S3 presigned URLs via resource services. Thumbnails use `shared/services/uploadThumbnail.ts`.
8. **Form validation**: Custom validation in domain `utils/` directories. No external form library.
9. **Styling**: Prefer Tailwind CSS utility classes. Use CSS Modules (`*.module.css`) for complex component-scoped styles.
10. **Import ordering**: Follow ESLint import/order rule — builtin, external, internal, parent, sibling, index.
