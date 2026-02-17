<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Elite OJT Tracker Pro (Frontend)

React + Vite frontend for the Elite OJT Tracker Pro platform. This UI connects to the Laravel backend for authentication and system logs, and uses Gemini to generate training plans and progress insights.

**Tech**
1. React 19 + Vite 6
2. TypeScript
3. Recharts
4. Google GenAI SDK (Gemini)

**Quickstart**
1. Install dependencies.
2. Add your Gemini API key.
3. Start the dev server.

```bash
npm install
```

```bash
# frontend/.env.local
GEMINI_API_KEY=your_key_here
```

```bash
npm run dev
```

The app runs on `http://localhost:3000` by default.

**Configuration**
1. `GEMINI_API_KEY` is required to enable AI features. It is injected into the client by Vite.
2. The backend URL is currently hardcoded in `frontend/services/authService.ts` as `http://localhost:8000`. Update it if your API runs elsewhere.

**Scripts**
1. `npm run dev` starts the Vite dev server.
2. `npm run build` creates a production build.
3. `npm run preview` serves the production build locally.

**Troubleshooting**
1. If Gemini calls fail, confirm `GEMINI_API_KEY` is set and restart the dev server.
2. If login fails with CSRF errors, ensure the backend is running and reachable at the configured URL.
3. If you changed the API base URL, clear browser cookies to reset the CSRF token.
