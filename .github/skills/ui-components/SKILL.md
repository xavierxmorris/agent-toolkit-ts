---
name: ui-components
description: Best practices for building UI with shadcn/ui and Tailwind.
---

## Core Principles

1. **Compose, Don’t Rebuild** — Prefer composing existing shadcn/ui primitives over creating new primitives.
2. **Primitives Stay Generic** — `web/components/ui/*` must not contain domain logic, data fetching, or feature-specific state.
3. **Match the Design System** — Reuse existing patterns, spacing, typography, and interaction styles.
4. **Mobile-First Tailwind** — Write mobile classes first, then scale up (e.g., `flex-col md:flex-row`).
5. **Prefer Utility Classes** — Use Tailwind for layout/spacing/typography; avoid inline styles unless unavoidable.

## Component Placement Rules

- `web/components/ui/` — UI primitives only (buttons, inputs, dialogs, etc.).
- `web/components/blocks/` — reusable compositions built from primitives.
- `web/features/*` — feature/domain UI (may compose blocks + primitives; owns feature logic).

## Decision Flow

1. Reuse an existing component from `web/components/*` (import via `@/components/*`).
2. If missing, look up the equivalent shadcn component using the skills reference /references/components.md
3. If still missing, create a new primitive under `web/components/ui/`.

## Styling Conventions

- Prefer `cn()` for `className` composition (see `web/components/lib/utils.ts`).
- Keep responsive behavior consistent with existing layouts (container widths, breakpoints, spacing).
- Avoid inline styles; use Tailwind utilities.

## Anti-Patterns to Avoid

- Adding feature-specific behavior to `web/components/ui/*`.
- Introducing new primitives when an existing shadcn/ui primitive already matches.
- Deep relative imports across domains (prefer `@/` absolute imports).
- Desktop-first styling that breaks mobile layouts.

## Quality Checklist

Before completing any UI component task:

1. Component is placed in the correct folder (`ui/` vs `blocks/` vs `features/`).
2. `web/components/ui/*` contains no domain logic or data fetching.
3. Tailwind classes are mobile-first and match existing spacing/typography patterns.
4. `className` composition uses `cn()` when applicable.
