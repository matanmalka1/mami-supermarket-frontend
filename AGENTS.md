Mami Supermarket & OpsPortal — Agent Ecosystem (AGENTS.md)

This document defines roles (Agents), responsibilities, and engineering standards for the Mami Supermarket (Customer) and OpsPortal (Operations) platform.

Applies to: Frontend + shared API/types packages
Non-goal: This is not a product spec. It is an ownership + quality system.

⸻

0) Working Agreements

Scope & Minimal Change Policy
	•	Keep changes minimal and scoped to the task.
	•	Do not remove user-facing flows or operational flows without explicit approval.
	•	Do not introduce new libraries unless:
	1.	there is a clear need, and
	2.	it is recorded in the worklog / PR description.

Single Source of Truth
	•	Backend contract wins. If UI assumptions conflict with API, fix UI first (or raise a contract mismatch).

⸻

1) System Personas (Agents)

1. Customer Agent (Mami Supermarket)

Context: Browse, Search, Cart, Checkout
Goal: Seamless discovery and frictionless commerce
Traits: High-fidelity visuals, empathetic feedback loops, personalized suggestions
Primary Routes:
	•	/store
	•	/store/category/*
	•	/store/product/*
	•	/cart
	•	/checkout/*

Owned Concerns
	•	Search UX (filters, sorting, autocomplete UI)
	•	Cart & checkout state (optimistic UX with strict server reconciliation)
	•	Accessibility + performance for high-SKU browsing

⸻

2. Picker Agent (OpsPortal — Fulfillment Intelligence)

Context: Order fulfillment, picking workflow, shelf/bin operations
Goal: Max accuracy + minimum picking time
Traits: High-contrast UI, scan-friendly typography, real-time sync, scale integration readiness
Primary Routes:
	•	/
	•	/picking/*
	•	/map

Owned Concerns
	•	Pick path + step-by-step pick UI (fast, minimal taps)
	•	Item substitution / out-of-stock handling
	•	Real-time updates (order status, item picked status)

⸻

4. Admin Agent (System Governor)

Context: Catalog CRUD, inventory control, global settings, audit
Goal: Governance + total observability
Traits: Strict audit logging, bulk tools, configurable business logic
Primary Routes:
	•	/admin/*
	•	/inventory
	•	/audit

Owned Concerns
	•	Safe CRUD patterns (confirmations, validation, bulk actions)
	•	Audit integrity (who/what/when, before/after)
	•	Role-based access (deny-by-default for dangerous actions)

⸻

4) Design Language (High-Fidelity Ops Aesthetic)

Typography
	•	Headers: font-black italic tracking-tighter
	•	Labels: text-[10px] font-black uppercase tracking-widest text-gray-400

Geometry & Components
	•	Main Cards: rounded-[2.5rem] / rounded-[3rem] + border-gray-100
	•	Primary Buttons: h-16 rounded-2xl font-black italic shadow-xl
	•	Modals: backdrop-blur-md overlays + animate-in zoom-in-95

Accessibility (Non-Negotiable)
	•	Maintain readable contrast in Ops screens (Picker/Logistics).
	•	All actionable controls must be keyboard accessible.
	•	Provide clear focus states (especially in scan-heavy flows).

⸻

5) Engineering Quality Gates (Non-Negotiable)

5.1 API Isolation
	•	No raw axios / fetch inside components.
	•	Use apiService from src/api.ts.
	•	API modules must:
	•	return normalized data, or
	•	throw normalized AppError.

5.2 Type Safety
	•	New features must define interfaces/types in src/types/.
	•	Avoid any. If unavoidable, document why and localize it (never spread).

5.3 File Granularity
	•	Code files > 150 lines must be split into:
	•	sub-components, hooks, or services
	•	Prefer:
	•	src/features/<domain>/components/
	•	src/features/<domain>/hooks/
	•	src/features/<domain>/services/
	•	src/shared/ (cross-domain)

5.4 Error Handling
	•	Catch API errors and map to code-based user messages via AppError.
	•	Never show raw backend stack/errors to users.
	•	OpsPortal errors must include actionable next-step hints (retry, mark exception, escalate).

5.5 Performance
	•	High-SKU grids must include:
	•	skeleton loaders
	•	lazy loading / pagination / virtualization (as relevant)
	•	Avoid unnecessary rerenders in pick flows (Picker Agent is latency-sensitive).

5.6 Security & Access Control
	•	Enforce role checks in routing + UI + API layer (defense in depth).
	•	Dangerous actions (bulk delete, inventory overwrite) require confirmation patterns.

5.7 Observability
	•	Log key lifecycle events:
	•	checkout preview/confirm
	•	pick started/completed
	•	substitutions
	•	delivery status changes
	•	Ensure logs include correlation identifiers (orderId, requestId) where available.

⸻

6) Definition of Done (DoD)

A change is “done” only if:
	•	✅ Routes and responsibilities match the correct Agent
	•	✅ API calls go through apiService
	•	✅ Types added/updated in src/types/
	•	✅ Errors mapped to AppError with user-friendly messages
	•	✅ No code file exceeds 150 lines (or was split)
	•	✅ Loading states exist for network-dependent views
	•	✅ Role/access rules respected (especially Admin actions)

⸻

Last Updated: Jan 22, 2026