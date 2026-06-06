# Convive

Digital wedding invitations platform.

## Project structure

```
convive/
├── backend/    Laravel API (port 8000)
└── frontend/   React app (port 3000)
```

## Start development

**Terminal 1 — backend**

```bash
cd backend
php artisan serve
```

**Terminal 2 — frontend**

```bash
cd frontend
npm run dev
```

Open **http://localhost:3000** in your browser.

## Guest demo templates (no login)

| Template | URL |
|----------|-----|
| Velvet — red drape cinematic | http://localhost:3000/invite/demo |
| Bloom — blush botanical | http://localhost:3000/invite/demo-bloom |
| Noir — art deco midnight gold | http://localhost:3000/invite/demo-noir |

## Admin login

- Email: `you@platform.com`
- Password: `admin-change-me`

## First-time setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed

cd ../frontend
npm install
```
