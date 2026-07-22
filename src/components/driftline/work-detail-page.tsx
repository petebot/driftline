"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Clock3, ExternalLink, FileText, Plus, Sparkles } from "lucide-react";
import { ActionDialog } from "./action-dialog";
import { useDriftline } from "./driftline-provider";
import { people, roles, stageMeta } from "@/lib/driftline/seed";
import { getAttentionItems } from "@/lib/driftline/rules";
import type { DemoAction, StageId } from "@/lib/driftline/types";

export function WorkDetailPage({ id }: { id: string }) {
  const { state, role, performAction } = useDriftline();
  const [dialogOpen, setDialogOpen] = useState(false);
  const item = state.items.find((candidate) => candidate.id === id);

  if (!item) {
    return <div className="content-page not-found-state"><FileText size={28} /><h1>Record not found</h1><p>This record may have been removed when the demo was reset.</p><Link href="/work" className="button button--primary">Return to portfolio</Link></div>;
  }

  const owner = people.find((person) => person.id === item.ownerId);
  const parent = item.parentId ? state.items.find((candidate) => candidate.id === item.parentId) : null;
  const children = state.items.filter((candidate) => candidate.parentId === item.id && !candidate.closed);
  const currentAttention = getAttentionItems(state, role).find((entry) => entry.itemId === item.id) ?? null;
  const allRouting = roles.flatMap((entry) => getAttentionItems(state, entry.id).filter((attention) => attention.itemId === item.id).map((attention) => ({ ...attention, roleLabel: entry.label })));
  const stageOrder = Object.keys(stageMeta) as StageId[];
  const itemTitle = item.title;

  function submitAction(action: DemoAction) {
    const assignee = action.assigneeId ? people.find((person) => person.id === action.assigneeId) : null;
    let feedback = `${itemTitle} updated.`;
    if (action.family === "delegate") feedback = `${assignee?.name ?? "A lead"} is now accountable.`;
    if (action.family === "nudge") feedback = "Check-in sent and activity recorded.";
    if (action.outcome === "close") feedback = `${itemTitle} closed with context.`;
    if (action.family === "decide" && action.outcome !== "close") feedback = `${itemTitle} moved forward.`;
    performAction(action, feedback);
    setDialogOpen(false);
  }

  return (
    <div className="content-page detail-page">
      <div className="detail-topline"><Link href="/work" className="back-link"><ArrowLeft size={14} /> Back to portfolio</Link><span>{item.code} · Updated {item.updatedLabel}</span></div>

      <header className="detail-hero" style={{ "--stage-accent": stageMeta[item.stage].accent } as React.CSSProperties}>
        <div className="detail-hero__main"><div className="detail-badges"><span>{stageMeta[item.stage].label}</span><span>{item.kind}</span>{item.flags.map((flag) => <em key={flag}><CircleAlert size={11} /> {flag.replaceAll("-", " ")}</em>)}</div><h1>{item.title}</h1><p>{item.summary}</p></div>
        <div className="detail-owner"><small>Accountable owner</small>{owner ? <Link href={`/people/${owner.id}`}><span className="avatar" style={{ background: owner.color }}>{owner.initials}</span><span><strong>{owner.name}</strong><small>{owner.discipline}</small></span><ArrowRight size={14} /></Link> : <div className="detail-owner__empty"><span className="avatar avatar--empty">?</span><span><strong>Unassigned</strong><small>Ownership required</small></span></div>}</div>
      </header>

      <section className="lifecycle-rail" aria-label="Lifecycle position">{stageOrder.map((stageId, index) => <div key={stageId} className={`${stageId === item.stage ? "is-current" : ""} ${stageOrder.indexOf(item.stage) > index ? "is-complete" : ""}`}><span>{stageMeta[stageId].index}</span><strong>{stageMeta[stageId].label}</strong>{index < stageOrder.length - 1 && <i />}</div>)}</section>

      <div className="detail-layout">
        <div className="detail-main">
          <section className="detail-section"><header><div><p className="kicker">Decision context</p><h2>Evidence on record</h2></div><span>{item.evidence.length} entries</span></header><div className="evidence-grid">{item.evidence.map((entry, index) => <article key={entry}><span>{String(index + 1).padStart(2, "0")}</span><Check size={15} /><p>{entry}</p></article>)}</div></section>

          <section className="detail-section"><header><div><p className="kicker">Connected work</p><h2>Relationships</h2></div><Link href={`/new?stage=${item.stage === "program" ? "operation" : "signal"}`}><Plus size={13} /> Add related</Link></header><div className="relationship-list">{parent && <Link href={`/work/${parent.id}`}><span className="relationship-list__type">Parent</span><span className="kind-mark">{parent.kind.slice(0, 1)}</span><span><small>{stageMeta[parent.stage].label} · {parent.code}</small><strong>{parent.title}</strong></span><ArrowRight size={15} /></Link>}{children.map((child) => <Link href={`/work/${child.id}`} key={child.id}><span className="relationship-list__type">Child</span><span className="kind-mark">{child.kind.slice(0, 1)}</span><span><small>{stageMeta[child.stage].label} · {child.code}</small><strong>{child.title}</strong></span><ArrowRight size={15} /></Link>)}{!parent && children.length === 0 && <div className="relationship-empty">No relationships recorded yet.</div>}</div></section>

          <section className="detail-section"><header><div><p className="kicker">Traceable history</p><h2>Activity</h2></div></header><ol className="activity-timeline"><li><span><Sparkles size={14} /></span><div><strong>{item.flags.length > 0 ? "Routing rule matched" : "Record remains in normal flow"}</strong><p>{item.flags.length > 0 ? `The system detected: ${item.flags.join(", ").replaceAll("-", " ")}.` : "No intervention threshold is currently exceeded."}</p><small>{item.updatedLabel}</small></div></li><li><span><Check size={14} /></span><div><strong>Evidence updated</strong><p>{item.evidence.at(-1)}</p><small>{Math.max(1, item.activityDays - 1)} days ago</small></div></li><li><span><Clock3 size={14} /></span><div><strong>Entered {stageMeta[item.stage].label.toLowerCase()}</strong><p>Lifecycle position recorded in the portfolio model.</p><small>{item.ageDays} days ago</small></div></li></ol></section>
        </div>

        <aside className="detail-sidebar">
          {allRouting.length > 0 ? <section className="routing-card"><p className="kicker">Active routing</p><h2>{allRouting.length} {allRouting.length === 1 ? "decision" : "decisions"} waiting</h2>{allRouting.map((entry) => <div key={`${entry.role}-${entry.ruleId}`}><span>{entry.roleLabel}</span><strong>{entry.headline}</strong><p>{entry.reason}</p></div>)}{currentAttention ? <button type="button" className="button button--primary button--full" onClick={() => setDialogOpen(true)}>{currentAttention.primaryLabel} <ArrowRight size={14} /></button> : <p className="routing-card__note">This item is visible to you, but the next action belongs to another role.</p>}</section> : <section className="routing-card routing-card--clear"><Check size={19} /><h2>Moving normally</h2><p>No operating rule currently requires intervention.</p></section>}

          <section className="record-facts"><h2>Record facts</h2><dl><div><dt>Stage</dt><dd>{stageMeta[item.stage].label}</dd></div><div><dt>Region</dt><dd>{item.region}</dd></div><div><dt>Age in stage</dt><dd>{item.ageDays} days</dd></div><div><dt>Last activity</dt><dd>{item.updatedLabel}</dd></div>{typeof item.progress === "number" && <div><dt>Progress</dt><dd>{item.progress}%</dd></div>}</dl></section>
          <Link href="/work" className="button button--quiet button--full"><ExternalLink size={14} /> Browse portfolio</Link>
        </aside>
      </div>

      {dialogOpen && currentAttention && <ActionDialog attention={currentAttention} item={item} onClose={() => setDialogOpen(false)} onSubmit={submitAction} />}
    </div>
  );
}
