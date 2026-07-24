"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, CircleDot, ExternalLink, FlaskConical, Info, Plus, SlidersHorizontal, Sparkles, TimerReset, UserRoundPlus } from "lucide-react";
import { ActionDialog } from "./action-dialog";
import { FlowMap } from "./flow-map";
import { useDriftline } from "./driftline-provider";
import { people, roles, stageMeta } from "@/lib/driftline/seed";
import { getAttentionItems } from "@/lib/driftline/rules";
import type { ActionFamily, DemoAction, StageId } from "@/lib/driftline/types";
import { AnimatedNumber } from "./animated-number";

const familyIcons = { decide: CircleDot, delegate: UserRoundPlus, nudge: TimerReset };
const familyLabels: Record<ActionFamily, string> = { decide: "Decision", delegate: "Ownership", nudge: "Check-in" };

export function DriftlineApp() {
  const { state, role, setRole, performAction } = useDriftline();
  const [selectedStage, setSelectedStage] = useState<StageId | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [dialogKey, setDialogKey] = useState<string | null>(null);

  const attention = useMemo(() => getAttentionItems(state, role), [state, role]);
  const filteredAttention = useMemo(
    () => selectedStage
      ? attention.filter((entry) => state.items.find((item) => item.id === entry.itemId)?.stage === selectedStage)
      : attention,
    [attention, selectedStage, state.items],
  );
  const selectedAttention = filteredAttention.find((entry) => entry.key === selectedKey) ?? filteredAttention[0] ?? null;
  const selectedItem = selectedAttention ? state.items.find((item) => item.id === selectedAttention.itemId) ?? null : null;
  const dialogAttention = attention.find((entry) => entry.key === dialogKey) ?? null;
  const dialogItem = dialogAttention ? state.items.find((item) => item.id === dialogAttention.itemId) ?? null : null;
  const currentRole = roles.find((entry) => entry.id === role) ?? roles[1];

  function submitAction(action: DemoAction) {
    const target = state.items.find((item) => item.id === action.itemId);
    const assignee = action.assigneeId ? people.find((person) => person.id === action.assigneeId) : null;
    let feedback = `${target?.title ?? "Item"} updated.`;
    if (action.family === "delegate") feedback = `${assignee?.name ?? "A lead"} is now accountable.`;
    if (action.family === "nudge") feedback = "Check-in sent and activity recorded.";
    if (action.outcome === "close") feedback = `${target?.title ?? "Item"} closed with context.`;
    if (action.family === "decide" && action.outcome !== "close") feedback = `${target?.title ?? "Item"} moved forward.`;
    performAction(action, feedback);
    setDialogKey(null);
    setSelectedKey(null);
  }

  return (
    <div className="dashboard-page">
      <header className="page-bar">
        <div><p className="kicker">Overview · {currentRole.remit}</p><h1>Dashboard</h1><p>Portfolio movement and the decisions waiting on your role.</p></div>
        <Link href="/new?stage=signal" className="button button--primary"><Plus size={15} /> Capture signal</Link>
      </header>

      <FlowMap items={state.items} selectedStage={selectedStage} onSelectStage={setSelectedStage} />

      <section className="decision-workspace" aria-labelledby="decisions-title">
        <div className="decision-list">
          <header className="section-heading">
            <div><p className="kicker">Attention routing · {currentRole.remit}</p><h2 id="decisions-title">Waiting on you</h2><p>Specific decisions surfaced by visible operating rules.</p></div>
            <div className="queue-controls">
              {selectedStage && <button type="button" className="filter-chip" onClick={() => setSelectedStage(null)}><SlidersHorizontal size={13} /> {stageMeta[selectedStage].label} <span>×</span></button>}
              <span className="queue-count" aria-live="polite" aria-label={`${filteredAttention.length} decisions shown`}><AnimatedNumber value={filteredAttention.length} minimumIntegerDigits={2} /></span>
            </div>
          </header>

          <div className="attention-stack motion-stagger">
            {filteredAttention.length === 0 ? (
              <div className="empty-state"><span><Check size={20} /></span><div><strong>No decisions waiting here.</strong><p>Clear the stage filter or switch roles to inspect another responsibility boundary.</p></div>{selectedStage && <button type="button" onClick={() => setSelectedStage(null)}>Clear filter</button>}</div>
            ) : filteredAttention.map((entry) => {
              const item = state.items.find((candidate) => candidate.id === entry.itemId);
              if (!item) return null;
              const Icon = familyIcons[entry.family];
              const owner = people.find((person) => person.id === item.ownerId);
              return (
                <article className={`attention-card ${selectedAttention?.key === entry.key ? "is-selected" : ""}`} key={entry.key}>
                  <button className="attention-card__select" type="button" aria-pressed={selectedAttention?.key === entry.key} onClick={() => setSelectedKey(entry.key)} aria-label={`Inspect ${item.title}`}>
                    <span className={`severity-mark severity-mark--${entry.severity}`} aria-hidden="true" />
                    <span className="attention-card__main"><span className="attention-card__meta"><span className="family-label"><Icon size={13} /> {familyLabels[entry.family]}</span><span>{item.code}</span><span>{stageMeta[item.stage].label}</span></span><strong className="attention-card__title">{item.title}</strong><span className="attention-card__reason">{entry.headline}</span></span>
                    <span className="attention-card__right"><span className={`age-badge age-badge--${entry.severity}`}>{entry.ageLabel}</span><span className="owner-readout">{owner ? <><span className="avatar avatar--small" style={{ background: owner.color }}>{owner.initials}</span>{owner.name}</> : <><span className="avatar avatar--small avatar--empty">?</span>No owner</>}</span></span>
                  </button>
                  <div className="card-action-group"><Link href={`/work/${item.id}`} aria-label={`Open ${item.title}`}><ExternalLink size={14} /> View</Link><button type="button" onClick={() => setDialogKey(entry.key)}>{entry.primaryLabel} <ArrowRight size={15} /></button></div>
                </article>
              );
            })}
          </div>
          <Link className="view-all-link" href="/work">View all portfolio records <ArrowRight size={14} /></Link>
        </div>

        <aside className="inspector" aria-label="Decision inspector">
          {selectedAttention && selectedItem ? (
            <>
              <header className="inspector__header"><p className="kicker">Why this surfaced</p><span className={`age-badge age-badge--${selectedAttention.severity}`}>{selectedAttention.ageLabel}</span></header>
              <div className="inspector__title"><span className="kind-mark kind-mark--large">{selectedItem.kind.slice(0, 1)}</span><div><span>{selectedItem.kind} · {selectedItem.region}</span><h3>{selectedItem.title}</h3></div></div>
              <p className="inspector__summary">{selectedItem.summary}</p>
              <div className="rule-explanation"><span className="rule-explanation__icon"><Sparkles size={16} /></span><div><span>Rule {selectedAttention.ruleId}</span><strong>{selectedAttention.reason}</strong></div></div>
              <div className="evidence-block"><div className="evidence-block__heading"><span>Evidence on record</span><small><AnimatedNumber value={selectedItem.evidence.length} /> signals</small></div><ul className="motion-stagger">{selectedItem.evidence.map((evidence) => <li key={evidence}><Check size={13} /> {evidence}</li>)}</ul></div>
              <dl className="inspector-metrics"><div><dt>Current stage</dt><dd>{stageMeta[selectedItem.stage].label}</dd></div><div><dt>Last movement</dt><dd>{selectedItem.updatedLabel}</dd></div><div><dt>Clears when</dt><dd>{selectedAttention.clearsWhen}</dd></div></dl>
              <div className="inspector-actions"><Link className="button button--quiet" href={`/work/${selectedItem.id}`}>Open record</Link><button className="button button--primary" type="button" onClick={() => setDialogKey(selectedAttention.key)}>{selectedAttention.primaryLabel} <ArrowRight size={15} /></button></div>
              <p className="deterministic-note"><Info size={13} /> Ordered by ownership, blockage severity, and elapsed time. No hidden score.</p>
            </>
          ) : <div className="inspector-empty"><FlaskConical size={24} /><strong>Select a decision</strong><p>Its evidence and routing rule will appear here.</p></div>}
        </aside>
      </section>

      <section className="role-lenses" aria-labelledby="roles-title">
        <div><p className="kicker">One system · Four responsibility boundaries</p><h2 id="roles-title">See the handoff, not another dashboard.</h2></div>
        <div className="role-tabs motion-stagger" aria-label="Switch role lens">{roles.map((entry) => <button type="button" key={entry.id} aria-pressed={role === entry.id} className={role === entry.id ? "is-active" : ""} onClick={() => { setRole(entry.id); setSelectedKey(null); setSelectedStage(null); }}><span className="persona-avatar">{entry.initials}</span><span><strong>{entry.label}</strong><small>{entry.remit}</small></span><span className="role-tabs__count"><AnimatedNumber value={getAttentionItems(state, entry.id).length} /></span></button>)}</div>
      </section>

      {dialogAttention && dialogItem && <ActionDialog key={dialogAttention.key} attention={dialogAttention} item={dialogItem} onClose={() => setDialogKey(null)} onSubmit={submitAction} />}
    </div>
  );
}
