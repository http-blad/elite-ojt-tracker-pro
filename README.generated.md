<!--
  README for Elite OJT Tracker Pro
  - concise developer-focused getting-started and contribution pointers
-->

# Elite OJT Tracker Pro

![Version](https://img.shields.io/badge/version-0.0.0-blue.svg)
![Build Status](https://img.shields.io/badge/build-%F0%9F%94%A5-lightgrey)

A comprehensive On-the-Job Training (OJT) management web app with AI-assisted training plan generation and progress analysis. Built with React + Vite and small analytics components.

## Table of contents
- [What it does](#what-it-does)
- [Why it’s useful](#why-its-useful)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Project structure (key files)](#project-structure-key-files)
- [Contributing & support](#contributing--support)

## What it does

Elite OJT Tracker Pro helps organizations track intern/student on-the-job training progress, manage intern records, visualize progress and activity, and generate AI-assisted training plans.

Highlights:
- Student and intern dashboards and calendars
- Activity logging and progress charts
- Messaging and settings components
- Integration points for AI services (Gemini via `@google/genai`)

## Why it’s useful

- Centralizes intern training data and progress tracking.
- Provides visualizations and quick insights using `recharts`.
- Enables AI-assisted features for plan generation or summarization.
- Small, modern stack (React + Vite) — easy to run and extend.

## Tech stack

- Framework: React 19 + Vite
- Language: TypeScript
- Key dependencies: `@google/genai`, `recharts`, `lucide-react`
- Dev tools: `vite`, `typescript`, `@vitejs/plugin-react`

See `package.json` for full dependency list.

## Getting started

Prerequisites:
- Node.js (16+ recommended)

1. Clone the repository

   git clone <repo-url>
   cd elite-ojt-tracker-pro

2. Install dependencies

   npm install

3. Create an environment file

   - Copy `.env.example` to `.env.local` (or create `.env.local`)
   - Add required variables (see below)

4. Run the development server

   npm run dev

5. Build for production

   npm run build

6. Preview production build

   npm run preview

## Environment variables

This project integrates with the Google Gemini API via `@google/genai`. You should provide your API key or credentials in `.env.local`.

- `GEMINI_API_KEY` — set your Gemini API key for AI features.

Example `.env.local` (not committed):

```
GEMINI_API_KEY=your_gemini_api_key_here
```

## Project structure (key files)

- [App.tsx](App.tsx) — application entry and routing
- [index.tsx](index.tsx) — React bootstrap
- [vite.config.ts](vite.config.ts) — Vite config
- [components/](components/) — UI components and pages
  - [components/InternList.tsx](components/InternList.tsx)
  - [components/InternForm.tsx](components/InternForm.tsx)
  - [components/student/InternDetail.tsx](components/student/InternDetail.tsx)
- [services/geminiService.ts](services/geminiService.ts) — AI integration helpers

Explore the `components/` directory for UI implementations and the `services/` folder for integrations.

## Contributing & support

- Found a bug or have a feature request? Open an issue.
- Want to contribute? Please read [CONTRIBUTING.md](CONTRIBUTING.md) (if present) or open a discussion/PR.
- For license details, see [LICENSE](LICENSE).

If you need help getting started, open an issue or reach out to the maintainers.

---

If you want, I can also:
- add a `CONTRIBUTING.md` template
- add a minimal `.env.example`
- commit the README and create a PR
