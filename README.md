# Driftline

Driftline is a fictional decision workspace for the fictional Aster Bay Ocean Institute. It makes the flow of ocean-research work visible, explains where work has stalled, and routes specific Decide, Delegate, or Nudge actions to the responsible role.

The demo is an independently authored public reinterpretation of broad product lessons. It contains original code, visual design, product language, rules, and fictional data. It does not include proprietary source code, packages, authentication, branding, infrastructure, assets, screenshots, or data from the internal reference project.

## Experience

- Left-to-right research pipeline showing volume, age, and bottlenecks
- Unified Dashboard combining flow and the deterministic **Waiting on you** queue
- Sticky, collapsible product navigation with role-aware creation shortcuts
- Searchable and filterable Portfolio card grid
- Individual work records with lifecycle, ownership, evidence, relationships, activity, and actions
- Stage-aware record creation with an immediate detail view
- People grid with allocation, active-work, and attention statistics
- Individual people views connecting assignments and responsibility
- Discoverable `/system` route documenting foundations, components, states, and product patterns
- Four responsibility lenses over one shared portfolio
- Decide, Delegate, and Nudge interaction families
- Immediate flow and responsibility updates after an action
- Local demo persistence, undo, and reset
- Responsive and keyboard-accessible interface

The approved [product brief](docs/product-brief.md), shared [design-system contract](DESIGN_SYSTEM_CONTRACT.md), and project [design system](docs/design-system.md) document the product thesis, system method, visual foundations, component language, and accessibility contract.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm test
npm run check:design-system
npm run check:design-system-version
npm run test:a11y
npm run test:visual
npm run build
```

## Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS foundation with an original CSS visual system
- Vitest for deterministic rule and transition coverage
- Lucide icons and the open-source Geist typeface

No backend, authentication, environment variables, or private services are required. The app is ready for a standard Vercel deployment.

## Fictional-data notice

Aster Bay Ocean Institute, its people, programs, operations, research records, locations in context, and all measurements shown in the interface are fictional demo content.
