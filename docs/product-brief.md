# Driftline — Independent Public Product Brief

Status: Draft for approval  
Date: July 22, 2026

## Product summary

Driftline is a fictional decision workspace for the **Aster Bay Ocean Institute**, an independent ocean-research organization. It helps program leaders answer one recurring question:

> Where should my attention go next, and which work should move forward?

The product turns an otherwise invisible portfolio pipeline into an explicit, explainable flow. It shows where work is moving, where it has stalled, why an item needs attention, and which human action can restart it.

This is a focused product demo, not a full portfolio-management suite. Its five-minute experience is designed to demonstrate product judgment, interaction design, systems thinking, data visualization, and frontend engineering through one coherent workflow.

## Independent-reimplementation boundary

Driftline will be authored from scratch as an independently branded public project.

- No source code, components, helpers, styles, rules, data, tests, configuration, or file structure will be copied or adapted from the reference repository.
- No former-employer names, branding, terminology, packages, authentication, infrastructure, URLs, assets, screenshots, or data will appear in the project.
- The reference project was reviewed only to understand broad product territory and lessons.
- All organization names, people, research activities, metrics, copy, visual assets, data relationships, and rule definitions will be newly created.
- Only publicly available open-source dependencies will be used.
- The repository will be safe to publish publicly and designed for deployment to Vercel.

## Fictional setting

**Organization:** Aster Bay Ocean Institute  
**Product:** Driftline  
**Domain:** Ocean research and applied marine innovation

The institute manages a deliberate mix of work:

- Scientific hypotheses and research studies
- Proposed expeditions and field campaigns
- Conservation interventions
- Marine sensing and instrumentation concepts

This mixed portfolio creates meaningful prioritization tension: unlike kinds of work share governance and resources, but stall for different reasons.

## Product thesis

Work rarely stalls because a formal process says it should. It stalls between tools and conversations: evidence waits for review, reviewed concepts lack a sponsor, approved initiatives lack an execution plan, and inactive work remains visible without being consciously closed.

Driftline treats each stall as a decision waiting for a person. It makes that decision visible with:

1. A clear reason the item surfaced
2. The time since meaningful activity
3. The responsible role or current ownership gap
4. A small set of actions that can close the loop

The product is deterministic and explainable. It does not use vague AI prioritization or an unexplained health score.

## Primary user

The primary persona is the **Program Steward**, who is accountable for turning promising research and intervention concepts into active, well-owned programs.

The Program Steward needs to:

- Decide what advances and what closes
- Establish clear ownership at handoffs
- Intervene when work is blocked or inactive
- Understand whether the overall system is moving

## Four role lenses

The demo includes a visible persona switcher. Each role sees the same underlying portfolio, interpreted through different responsibilities and permissions.

| Role | Primary concern | Typical decisions |
| --- | --- | --- |
| Research Director | Portfolio direction and institutional priorities | Sponsor, redirect, pause, or close high-level work |
| Program Steward | Movement from evaluated concept to coordinated program | Advance, reject, assign leads, request missing evidence |
| Expedition Lead | Turning programs into executable field activity | Define operations, resolve blockers, request support |
| Research Specialist | Contribution, review, and local follow-through | Complete reviews, post updates, respond to requests |

The Program Steward is the default and receives the richest experience. Switching roles re-ranks the same portfolio, changes the explanation attached to each item, and changes which actions are available.

## Original lifecycle language

Driftline uses a newly defined four-stage flow:

1. **Signals** — observations, hypotheses, opportunities, and early concepts
2. **Evaluations** — bounded cases gathering evidence, peer input, and feasibility
3. **Programs** — approved bodies of work with an accountable steward and intended outcome
4. **Operations** — concrete studies, deployments, expeditions, or interventions in execution

Early drafts that have not entered formal evaluation appear in a distinct **Unsorted signals** area. They remain visible without being presented as equivalent to governed work.

## Core experience

### 1. Five-second system read

The opening view is a left-to-right flow visualization. A visitor should be able to answer both questions without clicking:

- Is work moving?
- Where is it clogged?

Each stage communicates:

- Total items
- Typical age in stage
- Number currently stalled
- Relative movement into and out of the stage

Stalled items are visually prominent without relying on red alone. Unsorted signals sit just outside the governed flow as a visible accumulation risk.

### 2. Attention list

Beneath or alongside the flow is a role-specific list of decisions. The working label is **Waiting on you**.

Every surfaced item includes:

- Plain-language reason for appearing
- Staleness or elapsed time
- Current lifecycle stage
- Owner, or an explicit ownership gap
- Evidence sufficient to support the next action
- One recommended action and relevant alternatives

There is no opaque priority score. Ordering is explained by visible, deterministic rules such as ownership, severity of the blockage, and elapsed time.

### 3. Three action families

Every item resolves through one of three interaction families:

#### Decide

- Advance to the next lifecycle stage
- Approve or reject a pending evaluation
- Create the first operation for an empty program
- Close or archive work with a required reason

Closing work is a first-class, healthy outcome. It should feel deliberate rather than punitive.

#### Delegate

- Assign an accountable steward
- Assign an operation lead
- Request or reassign a review

Assignment occurs in context. The interface should expose enough workload information to make a responsible choice without turning the primary experience into a staffing dashboard.

#### Nudge

- Ask for a progress update
- Ask what support would unblock the work
- Request missing evidence or review

Nudges use humane language and identify a real recipient. They are lightweight interventions, not automated escalation theater.

### 4. Visible consequence

Completing an action immediately updates the system:

- The item leaves or changes position in **Waiting on you**
- Stage counts and stall indicators update
- Ownership or activity history changes
- A concise confirmation explains what happened
- Undo remains available for a short interval

This consequence loop is the central engineering and interaction-design moment of the demo.

### 5. Persona shift

The visitor switches from Program Steward to another role and sees the same event from a different responsibility boundary. For example, assigning an Expedition Lead removes an ownership-gap decision from one role and creates a planning responsibility for another.

This demonstrates that Driftline models a shared system of work rather than four disconnected dashboards.

## Headline visualization

The primary visualization is an original responsive flow diagram combining stage volume, age, and stalled-item markers.

Design requirements:

- Direction reads left to right on wide screens and top to bottom on narrow screens.
- Stage volume is legible without requiring exact chart literacy.
- Age and stalled work are separable signals.
- Selecting a stage filters the attention list and reveals its item distribution.
- Selecting a stalled marker reveals the rule that classified it.
- Motion is restrained and used only to clarify changes after an action.
- Reduced-motion preferences are respected.

Secondary detail may show recent activity trend for a selected item. Capacity and investment views are outside the initial release unless they materially improve an assignment decision.

## Deterministic rule model

The demo uses a small, newly authored rule engine over fictional local data. Example rule concepts:

- Evaluation completed but no advance/close decision after a defined interval
- Approved program has no accountable steward
- Program has no operation plan
- Operation reports a blocker without follow-up
- Active item has no meaningful activity within its expected cadence
- Unsorted signal remains untouched beyond an intake interval

Each rule emits:

- A stable rule identifier
- A human-readable explanation
- The role responsible for responding
- The elapsed-time evidence
- Allowed actions
- The condition that clears the item

Rule thresholds will be visible in product language where useful; they will not masquerade as universal scientific truths.

## Demo data

All data is fictional and created for this project. The initial dataset should be small enough to understand but varied enough to demonstrate the system:

- 8–12 signals, including unsorted work
- 5–7 evaluations at different evidence/review states
- 4–6 programs with distinct ownership and health conditions
- 6–10 operations, including expeditions, sensor deployments, lab studies, and conservation trials
- 10–14 fictional staff across scientific, operational, and technical disciplines

Example subject areas may include deep-reef acoustic mapping, autonomous microplastic sampling, kelp restoration methods, thermal refuge identification, and low-power buoy communications. Names, descriptions, dates, and relationships will be original.

## Visual direction

**Character:** Restrained scientific-instrument precision

The interface should feel like a contemporary research instrument: calm, exact, legible, and trustworthy.

- Dark or deep-neutral field with high-clarity light surfaces and oceanic spectral accents
- Fine rules, measured spacing, tabular numerals, and disciplined typography
- Color used semantically and sparingly
- Subtle grid, depth, or trace motifs derived from measurement—not decorative nautical clichés
- No stock ocean photography required in the core product
- No submarine portholes, waves-as-dividers, anchors, compass roses, or sci-fi command-center styling
- Charts and state transitions should carry the visual interest

The design must meet WCAG AA contrast for core text and controls, preserve keyboard navigation, and avoid encoding status through color alone.

## Information architecture

Initial release:

- **Flow** — primary system visualization and role-specific attention list
- **Item detail** — evidence, activity, relationships, rule explanation, and actions in a focused panel or route
- **People** — compact lookup used primarily during delegation
- **Demo controls** — persona switcher and reset

The product should avoid a large enterprise sidebar. The narrow concept should remain evident from every route.

## Five-minute walkthrough

1. Read the pipeline and identify the largest bottleneck.
2. Inspect a Program Steward decision and see exactly why it surfaced.
3. Advance, close, assign, or nudge directly in context.
4. Watch the pipeline and attention list respond.
5. Switch persona and see the downstream responsibility created by that action.

## Technical direction

- Next.js with the App Router
- TypeScript
- Vercel-compatible, with no private infrastructure
- Static fictional seed data plus client-side demo state
- Local persistence for visitor actions, with an obvious reset control
- No authentication
- Original SVG/CSS data visualization; a charting dependency only if it materially improves accessibility or maintainability
- URL-addressable selected items where practical
- Responsive layout and keyboard-accessible interactions
- Unit tests for the deterministic rules and state transitions
- End-to-end coverage for the primary five-minute walkthrough

## Success criteria

The demo succeeds when:

- A new visitor can identify the major bottleneck within five seconds.
- A visitor can explain why the first item is waiting on the Program Steward.
- Decide, Delegate, and Nudge feel distinct and consequential.
- One action visibly changes both local item state and the system-level visualization.
- Persona switching reveals a coherent shared model rather than cosmetic content changes.
- The experience feels finished without pretending to be a complete enterprise platform.
- A hiring leader can reasonably conclude: “They can turn a complex organizational problem into a coherent product system—and carry it from strategy through interaction design to polished, working software.”

## Explicit non-goals

- Recreating the reference application or its complete feature set
- Authentication, permissions infrastructure, or real user accounts
- Real collaboration, messaging, notifications, or external integrations
- AI-generated prioritization or summaries
- Full capacity planning, budgeting, roadmapping, or reporting suites
- Production database or administrative tooling
- Organization-specific terminology or workflows from the reference project

## Open decisions for implementation

These can be resolved during visual and technical design without expanding the product thesis:

- Final typographic system and exact color palette
- Whether item detail is a side panel, route, or responsive hybrid
- Final role names after checking clarity in context
- Exact stage-flow visual encoding
- Which single action creates the clearest cross-persona consequence in the guided demo
