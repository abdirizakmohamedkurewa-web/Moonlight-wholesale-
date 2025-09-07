# Moonlight Wholesale (Starter B2B Marketplace)

A ready-to-run starter like Soko Yetu/Twiga with:

- User auth (JWT)
- Product catalog (CRUD)
- Orders & order items
- PostgreSQL schema + migrations
- Flutter app (login + product list + basic order flow)
- M-Pesa Daraja (STK Push) integration scaffold

## Monorepo Layout
```
moonlight-wholesale/
  backend/   # Node.js + Express + PostgreSQL
  frontend/  # Flutter mobile app
  database/  # SQL schema
```

## Quickstart

### 1) Database
- Install PostgreSQL and create the DB:
  ```bash
  createdb moonlight_db
  ```
- Apply schema:
  ```bash
  psql -d moonlight_db -f database/schema.sql
  ```

### 2) Backend API
```
cd backend
cp .env.example .env   # fill in values
npm install
npm run dev
```
API runs at `http://localhost:5000` (Android emulator use `http://10.0.2.2:5000`).

### 3) Flutter App
```
cd frontend
flutter pub get
flutter run
```

### 4) Push to GitHub
Replace YOUR-USERNAME with your GitHub name:
```bash
cd /path/to/moonlight-wholesale
git init
git add .
git commit -m "Initial commit - Moonlight Wholesale starter"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/Moonlight-wholesale-.git
git push -u origin main
```
