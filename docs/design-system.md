# Driftline design system

**Contract version followed:** 1.0.0  
**Canonical contract:** `https://raw.githubusercontent.com/petebot/portfolio26/main/DESIGN_SYSTEM_CONTRACT.md`  
**System name:** Driftline Instrument System  
**System status:** living  
**Visual specimen:** [`/system`](../src/app/system/page.tsx) · [Public specimen](https://mission-control-lime-eta.vercel.app/system)

Driftline uses a restrained scientific-instrument language: calm surfaces, precise hierarchy, visible system state, and warm intervention colors reserved for moments that require attention.

## Design principles

1. **Make flow visible.** Movement and blockage appear before secondary metrics.
2. **Explain the prompt.** Every intervention includes its rule, evidence, age, owner, and clearing condition.
3. **Preserve human judgment.** The system routes attention; people still decide, delegate, and support.
4. **Earn the density.** Compact information remains readable, structured, and resilient under zoom and narrow containers.

## Project identity

- **Spatial character:** dense but calm; card rhythm follows instrument panels rather than consumer feeds.
- **Shape:** small-radius controls, medium-radius working surfaces, and larger immersive panels.
- **Typography:** Geist Sans for language and Geist Mono only for codes, metrics, timestamps, and operating labels.
- **Voice:** direct, humane, and explanatory. Prompts describe why attention is needed without pretending the system made the decision.
- **Motion:** snappy, instrument-like feedback that communicates hierarchy, continuity, state, and system response without slowing task completion.

## Foundations and tokens

Semantic tokens live at the top of `src/app/globals.css`. Feature UI consumes roles rather than duplicating visual values.

### Color and themes

| Role | Tokens | Purpose |
| --- | --- | --- |
| Content | `--ink`, `--ink-soft`, `--muted`, `--muted-on-inverse` | Primary, secondary, and supporting text |
| Surface | `--paper`, `--card`, `--surface-raised`, `--surface-subtle`, `--surface-muted`, `--surface-accent` | Canvas, cards, nested surfaces, and selection |
| Boundary | `--line`, `--line-dark`, `--track` | Borders, separators, and meters |
| Action | `--deep`, `--accent-ink`, `--focus-ring` | Primary action, interactive emphasis, and focus |
| Status | `--mint`, `--amber`, `--red`, `--blue` and soft/ink pairs | Flow, warning, critical, and informational states |

The semantic roles respond to `prefers-color-scheme`. Light and dark modes share component rules, and native controls opt into the matching system theme. Color never acts alone: icons, labels, counts, and state text accompany status accents.

### Typography

| Token | Size | Use |
| --- | ---: | --- |
| `--text-xs` | 12px | Codes and compact metadata; system floor |
| `--text-sm` | 13px | Supporting labels |
| `--text-base-sm` | 14px | Secondary copy |
| `--text-base` | 15px | Default body copy |
| `--text-md` | 16px | Card titles and controls |
| `--text-lg` | 18px | Section and component titles |
| `--text-xl` | 20px | Prominent component titles |

The scale uses `rem`, preserves browser and user settings, and maintains a 12px floor for non-decorative text.

### Spacing and layout

- `--space-1` through `--space-8` provide the shared 4–48px spacing rhythm.
- `--layout-reading`, `--layout-content`, and `--layout-wide` constrain prose, routes, and the flow model.
- Responsive changes occur when content no longer fits: 1180px for dense grids, 900px for navigation/layout changes, and 650–600px for single-column content.
- The pipeline may scroll horizontally inside its own labeled region on narrow screens; the page itself must not overflow.

### Borders, shape, and elevation

- `--line` and `--line-dark` define light and inverse boundaries.
- `--radius-sm`, `--radius-md`, and `--radius-lg` distinguish controls, cards, and immersive panels.
- `--shadow` is reserved for floating or selected surfaces. Borders carry normal hierarchy.

### Focus and target size

- `--focus-ring` supplies a three-pixel, offset `:focus-visible` ring in both themes.
- `--control-height` is 44px and applies to primary controls, navigation, inputs, and icon buttons.
- Smaller status labels are non-interactive. Compact filters retain at least a 40px target with adjacent spacing.

### Motion

- `--motion-fast`, `--motion-standard`, `--motion-reveal`, `--motion-count`, `--motion-stagger-step`, `--ease-standard`, and `--ease-snap` define feedback, reveal, count-up, and stagger timing.
- Route entry communicates continuity; lists resolve in reading order; numeric metrics and meters animate once they become visible.
- `prefers-reduced-motion` reduces animation and transitions to effectively immediate state changes.

### Layers

`--layer-header`, `--layer-sticky`, `--layer-navigation`, `--layer-mobile-header`, `--layer-drawer`, `--layer-dialog`, `--layer-toast`, and `--layer-skip` define the stacking order. Feature UI may use local negative or content layers inside an isolated component.

## System inventory

### Primitives

| Primitive | Purpose |
| --- | --- |
| Type roles | Sans language and mono instrument readouts |
| Semantic surfaces | Canvas, card, subtle, muted, selected, and inverse surfaces |
| Stack/grid rhythm | Tokenized spacing for recurring component compositions |
| Focus ring | Shared keyboard-focus treatment |

### Components

| Component | Variants and constraints | Behavior |
| --- | --- | --- |
| Button | Primary, quiet, full-width, icon, disabled | Native button/link semantics; 44px target; visible hover, focus, active, and disabled states |
| Status badge | Neutral, watch, critical | Text and icon accompany color; content stays short |
| Form field | Input, select, textarea, help, warning | Persistent label; help/error association where relevant; system theme support |
| Record card | Work and person variants | Entire card is a descriptive link; long content truncates or wraps without hiding its name |
| Progress meter | Work progress and allocation | Exposes label, min, max, and current value |
| Animated metric | Numeric readout with optional prefix, suffix, and zero padding | Counts from the previous displayed state when visible; exposes the final value to assistive technology and resolves immediately under reduced motion |
| Animated progress meter | Work progress, allocation, and instrument intensity | Fills to the named current value when visible and keeps native range semantics; decorative traces are hidden from assistive technology |
| Action dialog | Decide, delegate, nudge | Modal role, initial focus, Tab containment, Escape close, and trigger-focus restoration |
| Navigation drawer | Expanded, collapsed, mobile | Current page exposed; icon rail preserves optical centering; persona menu opens outside the rail without clipping; mobile focus contained; Escape returns focus to the menu control |
| Toast | Confirmation with optional undo | Message uses a polite status region; undo remains independently focusable |

### Product patterns

| Pattern | Purpose |
| --- | --- |
| Flow map | Shows volume, stage age, stalls, and unplaced work before drill-in metrics |
| Explainable attention routing | Connects a reason, rule, evidence, elapsed time, owner, clearing condition, and action |
| Lifecycle rail | Shows current and completed positions without relying on color alone |
| Role lens | Reframes one shared portfolio by responsibility boundary |

The flow map, lifecycle rail, role lens, and explainable routing composition remain product-specific patterns rather than generalized components.

### Motion patterns

- **Route entry:** the changing page surface settles upward and into focus while the persistent navigation remains stable.
- **Ordered reveal:** cards, stages, evidence, activity, choices, and specimen items enter one after another in DOM reading order.
- **Metric resolution:** counts use tabular numerals and animate on first visibility; progress values and fills resolve together.
- **Interaction feedback:** buttons compress subtly on activation while existing hover and focus states retain their semantic styling.
- **Reduced motion:** system preference removes reveal delay, count interpolation, scrolling, and meter travel while preserving final values and state.

## Complete-state expectations

- Controls define default, hover, focus-visible, active/pressed, selected, and disabled states where applicable.
- Lists and searches provide empty results; local persistence failures fall back to seed data.
- Long titles may wrap in detail and specimen views and truncate only where the full name remains available through the link or destination.
- Themes include light, dark, reduced-motion, and forced-color behavior.
- Loading states are omitted because the demo uses synchronous local data. An asynchronous data source would require loading and error states before adoption.

## Accessibility target

Driftline targets WCAG 2.2 AA.

- One `h1` and a logical heading hierarchy on every route.
- Skip navigation and semantic `main`, navigation, section, and aside landmarks.
- Keyboard-operable native controls with obvious focus-visible treatment.
- Selection exposed with `aria-pressed`; current navigation exposed with `aria-current`.
- Named progress meters with range and current values.
- Modal and mobile-drawer focus containment, Escape behavior, and focus restoration.
- Minimum 12px interface text, 15px default body copy, and `rem` scaling.
- AA text contrast target in light and dark themes; status never relies on color alone.
- Reduced motion, forced colors, narrow containers, and 200% browser-zoom reflow.

## Visual specimen

The discoverable `/system` route demonstrates:

- the four project principles;
- semantic color roles in the active system theme;
- type roles and content constraints;
- representative component variants and states;
- the explainable attention-routing pattern;
- the count-up, progress, and ordered-reveal motion patterns;
- accessibility and resilience commitments;
- one realistic path back into the product dashboard.

## Validation

```sh
npm run check:design-system
npm run check:design-system-version
npm run test:a11y
npm run test:visual
npm run lint
npx tsc --noEmit
npm test
npm run build
```

`check:design-system` verifies required artifacts and tokens. `check:design-system-version` compares the adopted version with the canonical source and is ready to run as an informational CI job when continuous integration is added. It never modifies the local contract. `test:a11y` checks the encoded accessibility contract. `test:visual` checks the durable specimen inventory and theme hooks. Browser review remains required for interaction and visual judgment:

1. Run `npm run dev` and open `http://localhost:3000/system`.
2. Inspect `/`, `/work`, `/people`, `/new`, and `/system` at 1440px, 720px, and 390px.
3. Repeat in system light and dark modes.
4. Tab from the skip link through navigation, filters, dialogs, and forms.
5. Verify the modal and mobile drawer contain focus, close with Escape, and restore focus.
6. Inspect reduced motion and forced-color mode.

## Known exceptions and gaps

| Rule | Need and scope | Impact and mitigation | Owner and resolution |
| --- | --- | --- | --- |
| Product UI should normally avoid raw visual values. | The flow map and fictional person colors retain a small number of domain-specific accents and local measurements in `globals.css` and seed data. | Maintenance cost is localized; semantic status, focus, text, surface, type, motion, and layer decisions are tokenized and checked. | Portfolio maintainer. Promote a local value when a second credible component needs the same meaning. Temporary. |
| Visual regression should compare rendered output. | `test:visual` currently verifies specimen structure rather than pixels. | Browser inspection is mandatory and documented; accidental pixel drift is not automatically detected. | Portfolio maintainer. Add stable Playwright screenshots before the first hosted case-study release. Temporary. |
| The canonical contract URL should be available. | The contract update is currently published on `codex/design-system-contract`; its declared `main` URL returns 404. | The version check tries the canonical URL first, reports the gap, then uses the supplied adoption branch without changing local files. | Portfolio maintainer. Remove the fallback after the upstream contract is merged to `main`. Temporary. |

No accessibility exception is currently accepted. Unverified behavior must be reported rather than treated as passing.

## Major decisions and history

### 2026-07-24 — Motion language expanded

- Added semantic reveal, count, stagger, and snap-easing tokens.
- Added shared visibility-aware numeric and progress components across dashboard, portfolio, people, detail, dialog, navigation, and specimen surfaces.
- Added route-entry continuity, ordered list reveals, and tactile pressed feedback while preserving DOM order and native control semantics.
- Refined the collapsed navigation into a smoothly transitioning icon rail with distinct creation actions and no control overlap.
- Replaced the collapsed native persona selector with an unclipped, keyboard-accessible menu and fixed icon/badge flex geometry.
- Kept reduced-motion behavior effectively immediate and exposed final metric and progress values to assistive technology.

### 2026-07-22 — Contract 1.0.0 adopted

- Raised the interface type floor from 7px to 12px and set 15px body copy.
- Introduced semantic light/dark surfaces, contrast roles, spacing, layout, motion, layer, shape, and target tokens.
- Added skip navigation, focus containment, pressed/current state semantics, and named progress values.
- Added the `/system` specimen, repeatable checks, shared contract, and project agent guidance.

## Portfolio evidence

The repository preserves the following case-study evidence:

- project principles and identity in this document and `/system`;
- a semantic color and typography specimen;
- component variants and meaningful states;
- the explainable attention-routing pattern in specimen and product context;
- light/dark and 200% reflow examples;
- the type-scale and accessibility iteration recorded in this history;
- a system decision that propagates through navigation, dashboard, records, people, creation, and dialogs via shared tokens.

The machine-readable portfolio exchange object is preserved in [`docs/portfolio-handoff.json`](portfolio-handoff.json), including the stable public specimen URL.
