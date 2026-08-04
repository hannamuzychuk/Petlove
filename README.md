# Petlove

Petlove is a responsive React web app for finding pets, reading news, browsing partner organizations, and managing a personal pet profile.

## Features

- **Home** — branded landing page
- **Find pet (Notices)** — searchable/filterable pet listings with pagination, favorites, and detail modal
- **News** — news feed with search and server-side pagination
- **Our friends** — partner organizations list
- **Auth** — register / login with form validation
- **Profile** (private) — user info, edit modal, own pets, favorites & viewed notices, logout
- **Add pet** (private) — form to add a pet to the profile
- **Global loader** — full-screen branded progress overlay during API requests
- **404** — custom not-found page

## Tech stack

- React 19 + Vite
- React Router
- Redux Toolkit
- Axios
- React Hook Form + Yup
- React Select
- React Hot Toast

Backend API: [https://petlove.b.goit.study/api](https://petlove.b.goit.study/api)

## Getting started

### Requirements

- Node.js 18+ (recommended)
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/home` | Public | Home page |
| `/login` | Guests only | Login |
| `/register` | Guests only | Registration |
| `/notices` | Public | Find pet |
| `/news` | Public | News |
| `/friends` | Public | Our friends |
| `/profile` | Authenticated | User profile |
| `/add-pet` | Authenticated | Add a pet |
| `*` | Public | 404 page |

Authenticated routes are protected with a private route. Login and register redirect authenticated users away via a public restricted route.

## Project structure

```
src/
  app/           # Route config
  components/    # UI, layout, feature components
  pages/         # Page-level views
  redux/         # Store and slices (auth, loading)
  routes/        # Private / public route guards
  services/      # API clients
  validation/    # Yup schemas
  utils/         # Helpers
public/
  images/        # Static images (responsive assets)
  sprite.svg     # Icon sprite
```

## Notes

- Auth token is stored in `localStorage` and attached to protected API requests.
- Responsive breakpoints used across the UI: mobile `<768`, tablet `768–1279`, desktop `1280+`.
- Toasts are used for API error/success feedback.

## License

Private student project.
