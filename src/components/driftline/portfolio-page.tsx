"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CircleAlert, Filter, Plus, Search } from "lucide-react";
import { people, stageMeta } from "@/lib/driftline/seed";
import { getStageStats } from "@/lib/driftline/rules";
import type { StageId } from "@/lib/driftline/types";
import { useDriftline } from "./driftline-provider";

type SortId = "activity" | "age" | "title";

export function PortfolioPage() {
  const { state } = useDriftline();
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<StageId | "all">("all");
  const [sort, setSort] = useState<SortId>("activity");

  const activeItems = useMemo(() => state.items.filter((item) => !item.closed), [state.items]);
  const stageStats = useMemo(() => getStageStats(activeItems), [activeItems]);
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return activeItems
      .filter((item) => stage === "all" || item.stage === stage)
      .filter((item) => !normalized || [item.title, item.summary, item.region, item.code, item.kind].some((value) => value.toLowerCase().includes(normalized)))
      .sort((a, b) => {
        if (sort === "age") return b.ageDays - a.ageDays;
        if (sort === "title") return a.title.localeCompare(b.title);
        return a.activityDays - b.activityDays;
      });
  }, [activeItems, query, sort, stage]);

  const stages: Array<StageId | "all"> = ["all", "signal", "evaluation", "program", "operation"];

  return (
    <div className="content-page portfolio-page">
      <header className="page-bar page-bar--spacious">
        <div><p className="kicker">Research portfolio · {activeItems.length} active records</p><h1>Portfolio</h1><p>Browse the work moving through Aster Bay’s research system.</p></div>
        <Link href="/new?stage=signal" className="button button--primary"><Plus size={15} /> Create record</Link>
      </header>

      <section className="portfolio-summary" aria-label="Portfolio stage summary">
        {(Object.keys(stageMeta) as StageId[]).map((stageId) => {
          const count = activeItems.filter((item) => item.stage === stageId).length;
          const stalled = stageStats.find((entry) => entry.stage === stageId)?.stalled ?? 0;
          return <button type="button" key={stageId} onClick={() => setStage(stage === stageId ? "all" : stageId)} className={stage === stageId ? "is-active" : ""} style={{ "--stage-accent": stageMeta[stageId].accent } as React.CSSProperties}><span>{stageMeta[stageId].index}</span><strong>{String(count).padStart(2, "0")}</strong><small>{stageMeta[stageId].label}</small>{stalled > 0 && <em><CircleAlert size={11} /> {stalled} stalled</em>}</button>;
        })}
      </section>

      <div className="listing-toolbar">
        <label className="search-field"><Search size={16} /><span className="sr-only">Search portfolio</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, region, code, or type…" /></label>
        <div className="stage-filters" aria-label="Filter by stage"><Filter size={14} />{stages.map((stageId) => <button type="button" key={stageId} onClick={() => setStage(stageId)} className={stage === stageId ? "is-active" : ""}>{stageId === "all" ? "All" : stageMeta[stageId].label}<span>{stageId === "all" ? activeItems.length : activeItems.filter((item) => item.stage === stageId).length}</span></button>)}</div>
        <label className="sort-select"><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value as SortId)}><option value="activity">Recent movement</option><option value="age">Oldest first</option><option value="title">Title A–Z</option></select></label>
      </div>

      <div className="listing-result-bar"><span>{results.length} records</span>{query && <span>matching “{query}”</span>}<span className="listing-result-bar__right">Select a record to inspect its evidence and relationships</span></div>

      {results.length > 0 ? (
        <div className="portfolio-grid">
          {results.map((item) => {
            const owner = people.find((person) => person.id === item.ownerId);
            const primaryFlag = item.flags[0];
            return (
              <Link href={`/work/${item.id}`} className="portfolio-card" key={item.id} style={{ "--stage-accent": stageMeta[item.stage].accent } as React.CSSProperties}>
                <div className="portfolio-card__header"><span>{stageMeta[item.stage].label}</span><code>{item.code}</code>{primaryFlag && <em><CircleAlert size={11} /> {primaryFlag.replaceAll("-", " ")}</em>}</div>
                <div className="portfolio-card__body"><span className="kind-mark">{item.kind.slice(0, 1)}</span><div><small>{item.kind} · {item.region}</small><h2>{item.title}</h2><p>{item.summary}</p></div></div>
                {typeof item.progress === "number" && <div className="portfolio-progress"><span><i style={{ width: `${item.progress}%` }} /></span><small>{item.progress}% progressed</small></div>}
                <div className="portfolio-card__footer"><span>{owner ? <><span className="avatar avatar--small" style={{ background: owner.color }}>{owner.initials}</span>{owner.name}</> : <><span className="avatar avatar--small avatar--empty">?</span>Owner needed</>}</span><span>Moved {item.updatedLabel} <ArrowRight size={14} /></span></div>
              </Link>
            );
          })}
        </div>
      ) : <div className="listing-empty"><Search size={22} /><h2>No matching records</h2><p>Try clearing a filter or searching another term.</p><button type="button" onClick={() => { setQuery(""); setStage("all"); }}>Clear filters</button></div>}
    </div>
  );
}
