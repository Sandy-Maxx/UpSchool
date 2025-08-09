# School ERP Frontend

This is a Vite + React + TypeScript frontend scaffold aligned with the backend School ERP.

Quick start:

1. Install dependencies
   npm install

2. Initialize husky
   npm run prepare

3. Start dev server
   npm run dev

Environment:
- Set VITE_API_BASE_URL in .env.development (default http://localhost:8000)

Health check:
- Visit /health to ping backend /api/health/

Auth:
- Basic login page at /auth/login posting to /api/v1/accounts/login/

