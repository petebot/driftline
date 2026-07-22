"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleAlert, FlaskConical, Layers3, Radio, Waves } from "lucide-react";
import { people, stageMeta } from "@/lib/driftline/seed";
import type { StageId, WorkKind } from "@/lib/driftline/types";
import { useDriftline } from "./driftline-provider";

const stages = Object.keys(stageMeta) as StageId[];
const kinds: WorkKind[] = ["Hypothesis", "Expedition", "Intervention", "Instrument"];
const stageIcons = { signal: Radio, evaluation: FlaskConical, program: Layers3, operation: Waves };

export function CreateWorkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedStage = searchParams.get("stage") as StageId | null;
  const [stage, setStage] = useState<StageId>(requestedStage && stages.includes(requestedStage) ? requestedStage : "signal");
  const [kind, setKind] = useState<WorkKind>("Hypothesis");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [region, setRegion] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [evidence, setEvidence] = useState("");
  const { createItem } = useDriftline();
  const requiresOwner = stage === "program" || stage === "operation";
  const ready = title.trim().length >= 4 && summary.trim().length >= 16 && region.trim().length >= 2;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
    const id = createItem({ title: title.trim(), summary: summary.trim(), stage, kind, region: region.trim(), ownerId: ownerId || null, evidence: evidence.split("\n").map((line) => line.trim()).filter(Boolean) });
    router.push(`/work/${id}`);
  }

  return (
    <div className="content-page create-page">
      <Link href="/work" className="back-link"><ArrowLeft size={14} /> Back to portfolio</Link>
      <header className="page-bar page-bar--spacious"><div><p className="kicker">New portfolio record</p><h1>Create work</h1><p>Capture the minimum context needed for a useful handoff.</p></div></header>

      <form className="create-layout" onSubmit={submit}>
        <div className="create-main">
          <fieldset className="form-section"><legend><span>01</span> Where does this enter the system?</legend><p>Downstream records can also be created directly for demo purposes.</p><div className="stage-choice-grid">{stages.map((stageId) => { const Icon = stageIcons[stageId]; return <button type="button" key={stageId} aria-pressed={stage === stageId} className={stage === stageId ? "is-active" : ""} onClick={() => setStage(stageId)} style={{ "--stage-accent": stageMeta[stageId].accent } as React.CSSProperties}><Icon size={17} /><strong>{stageMeta[stageId].label}</strong><small>{stageMeta[stageId].description}</small>{stage === stageId && <Check size={15} />}</button>; })}</div></fieldset>

          <fieldset className="form-section"><legend><span>02</span> Describe the work</legend><div className="form-grid"><label className="field-group field-group--wide"><span>Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A clear, specific working title" autoFocus /><small>{title.length}/80</small></label><label className="field-group field-group--wide"><span>Summary</span><textarea value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="What is being explored or changed, and why does it matter?" rows={5} /></label><label className="field-group"><span>Work type</span><select value={kind} onChange={(event) => setKind(event.target.value as WorkKind)}>{kinds.map((value) => <option key={value}>{value}</option>)}</select></label><label className="field-group"><span>Region</span><input value={region} onChange={(event) => setRegion(event.target.value)} placeholder="e.g. Labrador Shelf" /></label></div></fieldset>

          <fieldset className="form-section"><legend><span>03</span> Ownership and evidence</legend><div className="form-grid"><label className="field-group field-group--wide"><span>Accountable owner {requiresOwner ? "recommended" : "optional"}</span><select value={ownerId} onChange={(event) => setOwnerId(event.target.value)}><option value="">No owner yet</option>{people.map((person) => <option key={person.id} value={person.id}>{person.name} — {person.discipline}</option>)}</select>{requiresOwner && !ownerId && <small className="field-warning"><CircleAlert size={11} /> This record will surface as an ownership gap.</small>}</label><label className="field-group field-group--wide"><span>Evidence on record <em>one item per line</em></span><textarea value={evidence} onChange={(event) => setEvidence(event.target.value)} placeholder={"Initial observation documented\nPartner interest confirmed\nFeasibility note attached"} rows={4} /></label></div></fieldset>
        </div>

        <aside className="create-summary"><p className="kicker">Record preview</p><span className="create-summary__stage" style={{ "--stage-accent": stageMeta[stage].accent } as React.CSSProperties}>{stageMeta[stage].index} · {stageMeta[stage].label}</span><span className="kind-mark kind-mark--large">{kind.slice(0, 1)}</span><small>{kind} · {region || "Region not set"}</small><h2>{title || "Untitled record"}</h2><p>{summary || "Your summary will appear here."}</p><dl><div><dt>Owner</dt><dd>{people.find((person) => person.id === ownerId)?.name ?? "Unassigned"}</dd></div><div><dt>Evidence</dt><dd>{evidence.split("\n").filter(Boolean).length || 0} items</dd></div><div><dt>Initial routing</dt><dd>{stage === "signal" ? "Intake review" : stage === "evaluation" ? "Peer review" : requiresOwner && !ownerId ? "Ownership gap" : "No prompt"}</dd></div></dl><button className="button button--primary button--full" type="submit" disabled={!ready}>Create {stageMeta[stage].label.slice(0, -1)} <ArrowRight size={15} /></button><Link href="/work" className="button button--quiet button--full">Cancel</Link></aside>
      </form>
    </div>
  );
}
