"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CircleAlert, MapPin } from "lucide-react";
import { useDriftline } from "./driftline-provider";
import { people, roles, stageMeta } from "@/lib/driftline/seed";
import { getAttentionItems } from "@/lib/driftline/rules";
import { AnimatedNumber } from "./animated-number";
import { AnimatedProgress } from "./animated-progress";

export function PersonDetailPage({ id }: { id: string }) {
  const { state } = useDriftline();
  const person = people.find((candidate) => candidate.id === id);
  if (!person) return <div className="content-page not-found-state"><h1>Person not found</h1><Link href="/people" className="button button--primary">Return to people</Link></div>;

  const role = roles.find((entry) => entry.id === person.role);
  const assignments = state.items.filter((item) => !item.closed && item.ownerId === person.id);
  const roleAttention = getAttentionItems(state, person.role).filter((entry) => assignments.some((item) => item.id === entry.itemId));

  return (
    <div className="content-page person-detail-page">
      <Link href="/people" className="back-link"><ArrowLeft size={14} /> Back to people</Link>
      <header className="person-hero"><span className="avatar avatar--hero" style={{ background: person.color }}>{person.initials}</span><div><p className="kicker">{role?.label}</p><h1>{person.name}</h1><p>{person.discipline} <span><MapPin size={12} /> {person.location}</span></p></div><div className="person-hero__load"><span>Current allocation</span><strong><AnimatedNumber value={person.load} suffix="%" /></strong><AnimatedProgress value={person.load} label={`${person.name} allocation`} /><small>{person.load >= 80 ? "Limited room for new work" : person.load <= 50 ? "Capacity available for assignment" : "Within preferred range"}</small></div></header>

      <div className="person-stat-strip motion-stagger"><div><span>Active ownership</span><strong><AnimatedNumber value={assignments.length} /></strong></div><div><span>Decisions waiting</span><strong><AnimatedNumber value={roleAttention.length} /></strong></div><div><span>Lifecycle stages</span><strong><AnimatedNumber value={new Set(assignments.map((item) => item.stage)).size} /></strong></div><div><span>Most recent movement</span><strong>{assignments.sort((a, b) => a.activityDays - b.activityDays)[0]?.updatedLabel ?? "—"}</strong></div></div>

      <div className="person-detail-layout"><section className="detail-section"><header><div><p className="kicker">Current responsibility</p><h2>Active work</h2></div><span><AnimatedNumber value={assignments.length} /> records</span></header><div className="assignment-grid motion-stagger">{assignments.map((item) => <Link href={`/work/${item.id}`} key={item.id} style={{ "--stage-accent": stageMeta[item.stage].accent } as React.CSSProperties}><span className="kind-mark">{item.kind.slice(0, 1)}</span><span><small>{stageMeta[item.stage].label} · {item.code}</small><strong>{item.title}</strong><p>{item.region} · moved {item.updatedLabel}</p></span><ArrowRight size={15} /></Link>)}{assignments.length === 0 && <div className="relationship-empty">No active records are assigned to this person.</div>}</div></section><aside className="person-routing motion-stagger"><p className="kicker">Personal attention</p><h2>{roleAttention.length ? <><AnimatedNumber value={roleAttention.length} /> items waiting</> : "Nothing waiting"}</h2>{roleAttention.length ? roleAttention.map((entry) => { const item = state.items.find((candidate) => candidate.id === entry.itemId); return <Link href={`/work/${entry.itemId}`} key={entry.key}><CircleAlert size={14} /><span><strong>{entry.headline}</strong><small>{item?.title} · {entry.ageLabel}</small></span><ArrowRight size={14} /></Link>; }) : <div className="person-routing__clear"><Check size={18} /><p>No owned work currently exceeds an operating threshold.</p></div>}</aside></div>
    </div>
  );
}
