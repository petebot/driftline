"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search, UsersRound } from "lucide-react";
import { people, roles, stageMeta } from "@/lib/driftline/seed";
import { getAttentionItems } from "@/lib/driftline/rules";
import type { RoleId } from "@/lib/driftline/types";
import { useDriftline } from "./driftline-provider";
import { AnimatedNumber } from "./animated-number";
import { AnimatedProgress } from "./animated-progress";

export function PeoplePage() {
  const { state } = useDriftline();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleId | "all">("all");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return people.filter((person) => roleFilter === "all" || person.role === roleFilter).filter((person) => !normalized || [person.name, person.discipline, person.location, roles.find((role) => role.id === person.role)?.label ?? ""].some((value) => value.toLowerCase().includes(normalized)));
  }, [query, roleFilter]);

  const averageLoad = Math.round(people.reduce((sum, person) => sum + person.load, 0) / people.length);
  const openOwnership = state.items.filter((item) => !item.closed && !item.ownerId).length;

  return (
    <div className="content-page people-page">
      <header className="page-bar page-bar--spacious"><div><p className="kicker">Operating network · Fictional people</p><h1>People</h1><p>Capacity, responsibility, and active work across the institute.</p></div><div className="people-rollup motion-stagger"><div><strong><AnimatedNumber value={people.length} /></strong><span>People</span></div><div><strong><AnimatedNumber value={averageLoad} suffix="%" /></strong><span>Avg. allocated</span></div><div><strong><AnimatedNumber value={openOwnership} /></strong><span>Ownership gaps</span></div></div></header>

      <div className="listing-toolbar people-toolbar"><label className="search-field"><Search size={16} /><span className="sr-only">Search people</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, discipline, or location…" /></label><div className="stage-filters" aria-label="Filter people by role"><UsersRound size={14} aria-hidden="true" /><button type="button" aria-pressed={roleFilter === "all"} onClick={() => setRoleFilter("all")} className={roleFilter === "all" ? "is-active" : ""}>All <span>{people.length}</span></button>{roles.map((role) => <button type="button" key={role.id} aria-pressed={roleFilter === role.id} onClick={() => setRoleFilter(role.id)} className={roleFilter === role.id ? "is-active" : ""}>{role.shortLabel} <span>{people.filter((person) => person.role === role.id).length}</span></button>)}</div></div>

      <div className="people-grid motion-stagger">
        {results.map((person) => {
          const assignments = state.items.filter((item) => !item.closed && item.ownerId === person.id);
          const roleAttention = getAttentionItems(state, person.role);
          const personalAttention = roleAttention.filter((entry) => assignments.some((item) => item.id === entry.itemId));
          const role = roles.find((entry) => entry.id === person.role);
          const stageCounts = (Object.keys(stageMeta) as Array<keyof typeof stageMeta>).map((stageId) => ({ stageId, count: assignments.filter((item) => item.stage === stageId).length })).filter((entry) => entry.count > 0);
          return (
            <Link href={`/people/${person.id}`} className="person-card" key={person.id}>
              <div className="person-card__identity"><span className="avatar avatar--person" style={{ background: person.color }}>{person.initials}</span><div><span>{role?.label}</span><h2>{person.name}</h2><p>{person.discipline} · {person.location}</p></div><ArrowRight size={16} /></div>
              <div className="person-card__load"><div><span>Allocation</span><strong><AnimatedNumber value={person.load} suffix="%" /></strong></div><AnimatedProgress className="load-track" value={person.load} label={`${person.name} allocation`} /><small>{person.load >= 80 ? "Limited room" : person.load <= 50 ? "Capacity available" : "Balanced load"}</small></div>
              <dl className="person-card__stats"><div><dt>Active work</dt><dd><AnimatedNumber value={assignments.length} /></dd></div><div><dt>Waiting</dt><dd><AnimatedNumber value={personalAttention.length} /></dd></div><div><dt>Stages</dt><dd><AnimatedNumber value={stageCounts.length} /></dd></div></dl>
              <div className="person-card__assignments">{assignments.slice(0, 2).map((item) => <span key={item.id}><i style={{ background: stageMeta[item.stage].accent }} />{item.title}</span>)}{assignments.length === 0 && <span>No active ownership</span>}{assignments.length > 2 && <small>+{assignments.length - 2} more</small>}</div>
            </Link>
          );
        })}
      </div>
      {results.length === 0 && <div className="listing-empty"><UsersRound size={22} /><h2>No people found</h2><p>Try a different role or search term.</p></div>}
    </div>
  );
}
