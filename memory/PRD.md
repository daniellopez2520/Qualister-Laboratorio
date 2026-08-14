# Qualister Laboratorio de Metrología — LIMS

## Problem Statement (original)
Build PHASE 1 of a professional internal web application for "Qualister Laboratorio de Metrología": a LIMS + administrative system for a metrology/calibration laboratory. Phase 1 is EXCLUSIVELY visual design, UX/UI, navigation, dashboards, forms, tables, flows, states, modals, menus, interactions, responsive design, and per-role experience. NO real database, NO definitive backend, NO real certificate logic. All data is mock; buttons simulate actions visually. Architecture must separate UI → services → mock data so the mock layer can later be replaced by a real backend without rebuilding screens. Do NOT start real backend until user explicitly approves the design.

## User Choices
- Bilingual Spanish/English UI (toggle)
- Simulated login (any credentials) + role selector at login + role switcher in profile menu
- Light theme + optional dark mode
- Existing logo provided: https://customer-assets-agu9un31.emergentagent.net/job_metrologia-lab-ui/artifacts/rv6f4lg3_logo%20qlm.png
- Corporate colors: white, navy blue, light blue, gray

## Architecture
- Frontend: React 18 (CRA) + Tailwind 3 + react-router-dom 6 + recharts + lucide-react. No shadcn; custom lightweight UI primitives.
- Backend: FastAPI placeholder only (`GET /api/` health). Real backend deferred to Phase 2.
- Data layering: `src/data/mockData.js` (mock) → `src/services/dataService.js` (data access, swap point for Phase 2 API) → `src/context/AppContext.js` (state + visual mutations) → pages.
- Roles: tecnico, jefe, finanzas, admin. Route guards in `App.js` (PERMS map), sidebar filtering in `Layout.jsx` (NAV roles).
- i18n: `src/i18n.js` — dictionary + STATUS_META (status key → es/en label + badge tone).
- Role persisted in sessionStorage (survives reload; logout clears).

## Implemented (2026-06-14) — Phase 1 complete, tested (iteration_1.json, 100% pass)
- Login (bilingual, demo role select), 4 role dashboards (tecnico/jefe/finanzas/admin) with KPIs + recharts
- Layout: collapsible sidebar (grouped nav, role-filtered, read-only markers), header with global grouped search, notification bell (dismiss/navigate), profile menu (role switch, language, dark mode, logout), breadcrumbs
- Clients: list + filters, detail with 10 tabs, new client sectioned form with multi-contacts
- Orders: list (12 states), 5-step wizard, detail with instrument cards + tabs
- Instruments: list, add modal, detail with calibration timeline
- Certificates (flagship): list, detail (flow diagram, docs cards PDF1/PDF2/combined, PDF mock preview, activity timeline), send-to-review modal with checklist, chief split review screen (approve / reject with mandatory reason + categories), rejected banner "CORRECCIÓN REQUERIDA" + resend
- Standards: mini-dashboard, expiry badges (90/60/30/15/expired), detail with proximity bar + 6 tabs
- Procedures: table + detail modal + competency matrix (jefe/admin)
- Quality: KPIs, NC table, incident detail + new incident form
- Finance: 6 tabs (resumen, cotizaciones w/ line-item editor, tarifario, facturas w/ detail modal, cobranza w/ aging + register payment that updates balances, gastos)
- Reports center (lab + finance, filters, simulated generation), Users (admin CRUD modal), Audit (filters + detail drawer before/after), Settings (6 tabs)
- Empty states, skeletons, 404, access denied, dark mode, ES/EN, responsive (mobile sidebar drawer)

## Backlog / Phase 2 (pending user design approval)
- P0: Real backend (FastAPI + MongoDB) replacing dataService mock; real auth (to be chosen: JWT vs Google); real certificate numbering logic; file storage for PDFs
- P1: Real audit trail, notifications engine, server-side permissions, invoice/quote PDF generation
- P2: Email alerts, fiscal service integrations, report exports

## Notes for future agents
- DO NOT start real backend until user explicitly approves the design (user instruction).
- All mutations are in-memory (AppContext); reload resets data (role persists via sessionStorage).
- data-testid conventions documented in test report iteration_1.json context field.
