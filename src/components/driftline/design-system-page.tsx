import Link from "next/link";
import { ArrowRight, Check, CircleAlert, Focus, Moon, MoveRight, Sun } from "lucide-react";

const colorRoles = [
  ["Canvas", "Application background", "swatch--paper"],
  ["Surface", "Cards and controls", "swatch--surface"],
  ["Ink", "Primary content", "swatch--ink"],
  ["Muted", "Supporting content", "swatch--muted"],
  ["Flow", "Healthy movement", "swatch--mint"],
  ["Watch", "Threshold approaching", "swatch--amber"],
  ["Critical", "Intervention required", "swatch--red"],
] as const;

const typeRoles = [
  ["Display", "Where is work losing momentum?", "type-sample--display"],
  ["Section", "Waiting on you", "type-sample--section"],
  ["Body", "Specific decisions surfaced by visible operating rules.", "type-sample--body"],
  ["Instrument", "OPERATION.BLOCKER.NO_RESPONSE · 06 DAYS", "type-sample--instrument"],
] as const;

export function DesignSystemPage() {
  return (
    <div className="content-page system-page">
      <header className="page-bar page-bar--spacious">
        <div>
          <p className="kicker">Driftline system · Living · Contract 1.0.0</p>
          <h1>Design system</h1>
          <p>A portable method expressed as a precise ocean-research instrument.</p>
        </div>
        <Link href="/" className="button button--quiet">View in context <ArrowRight size={16} /></Link>
      </header>

      <section className="system-intro" aria-labelledby="principles-title">
        <div>
          <p className="kicker">Design principles</p>
          <h2 id="principles-title">Calm enough to scan. Explicit enough to act.</h2>
        </div>
        <ol className="principle-grid">
          <li><span>01</span><strong>Make flow visible</strong><p>Movement and blockage appear before secondary metrics.</p></li>
          <li><span>02</span><strong>Explain the prompt</strong><p>Every intervention shows its rule, evidence, age, and owner.</p></li>
          <li><span>03</span><strong>Preserve human judgment</strong><p>The system routes attention; people still decide, delegate, and support.</p></li>
          <li><span>04</span><strong>Earn the density</strong><p>Compact information stays readable, structured, and resilient.</p></li>
        </ol>
      </section>

      <section className="system-section" aria-labelledby="color-title">
        <header><div><p className="kicker">Foundation 01</p><h2 id="color-title">Semantic color</h2></div><p><Sun size={15} /> System light <Moon size={15} /> System dark</p></header>
        <div className="swatch-grid">
          {colorRoles.map(([name, purpose, className]) => <article key={name}><span className={`system-swatch ${className}`} aria-hidden="true" /><div><strong>{name}</strong><p>{purpose}</p></div></article>)}
        </div>
      </section>

      <section className="system-section" aria-labelledby="type-title">
        <header><div><p className="kicker">Foundation 02</p><h2 id="type-title">Type with instrument precision</h2></div><p>12px floor · 15px body · rem scaling</p></header>
        <div className="type-specimens">
          {typeRoles.map(([name, copy, className]) => <article key={name}><span>{name}</span><p className={className}>{copy}</p></article>)}
        </div>
      </section>

      <section className="system-section" aria-labelledby="components-title">
        <header><div><p className="kicker">System inventory</p><h2 id="components-title">Components and states</h2></div><p>Native semantics · 44px targets</p></header>
        <div className="component-specimens">
          <article className="component-specimen">
            <h3>Actions</h3><p>One primary commitment; quiet controls preserve hierarchy.</p>
            <div className="specimen-row"><button type="button" className="button button--primary">Primary action <MoveRight size={15} /></button><button type="button" className="button button--quiet">Quiet action</button><button type="button" className="button button--quiet" disabled>Disabled</button></div>
          </article>
          <article className="component-specimen">
            <h3>Status</h3><p>Text, icon, and color carry the meaning together.</p>
            <div className="specimen-row"><span className="age-badge">Moving normally</span><span className="age-badge age-badge--watch"><CircleAlert size={13} /> 11d waiting</span><span className="age-badge age-badge--critical"><CircleAlert size={13} /> 14d blocked</span></div>
          </article>
          <article className="component-specimen">
            <h3>Selection</h3><p>Pressed state is visible and exposed to assistive technology.</p>
            <div className="specimen-row"><button type="button" className="filter-chip" aria-pressed="true"><Check size={14} /> Evaluations</button><button type="button" className="button button--quiet" aria-pressed="false">Programs</button></div>
          </article>
          <article className="component-specimen">
            <h3>Input</h3><p>Labels remain visible; supporting text describes the expected value.</p>
            <label className="field-group"><span>Working title</span><input defaultValue="Thermal refuge atlas" aria-describedby="specimen-input-help" /><small id="specimen-input-help">Use a clear, specific noun phrase.</small></label>
          </article>
        </div>
      </section>

      <section className="system-section" aria-labelledby="pattern-title">
        <header><div><p className="kicker">Product pattern</p><h2 id="pattern-title">Explainable attention routing</h2></div><p>Reason · evidence · owner · action</p></header>
        <div className="pattern-specimen">
          <article className="specimen-attention">
            <span className="severity-mark severity-mark--watch" aria-hidden="true" />
            <div><p className="kicker">Decision · EVL-204 · Evaluation</p><h3>Deep-reef acoustic observatory</h3><p>Review complete—choose an outcome.</p></div>
            <span className="age-badge age-badge--watch">14d waiting</span>
          </article>
          <MoveRight className="pattern-arrow" aria-hidden="true" />
          <aside className="specimen-rule"><span><Focus size={17} /></span><div><p className="kicker">Rule REVIEW.COMPLETE.NO_DECISION</p><strong>Peer review is complete and no lifecycle decision has been recorded.</strong><small>Clears when the evaluation advances or closes with context.</small></div></aside>
        </div>
      </section>

      <section className="system-proof" aria-labelledby="proof-title">
        <div><p className="kicker">Accessibility and resilience</p><h2 id="proof-title">The constraints are part of the visual language.</h2></div>
        <ul><li><Check size={16} /> WCAG 2.2 AA contrast target</li><li><Check size={16} /> Keyboard focus and modal containment</li><li><Check size={16} /> System themes and forced colors</li><li><Check size={16} /> Reduced motion and 200% reflow</li></ul>
      </section>
    </div>
  );
}
