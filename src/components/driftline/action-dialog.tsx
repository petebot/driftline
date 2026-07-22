"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Check, MessageCircleMore, UserRoundPlus, X } from "lucide-react";
import { people, stageMeta } from "@/lib/driftline/seed";
import type { AttentionItem, DemoAction, PortfolioItem } from "@/lib/driftline/types";

interface ActionDialogProps {
  attention: AttentionItem;
  item: PortfolioItem;
  onClose: () => void;
  onSubmit: (action: DemoAction, message: string) => void;
}

export function ActionDialog({ attention, item, onClose, onSubmit }: ActionDialogProps) {
  const [outcome, setOutcome] = useState("advance");
  const [assigneeId, setAssigneeId] = useState("p1");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState(
    attention.family === "nudge" ? "What support would help move this forward?" : "",
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const nextStage = item.stage === "signal" ? "evaluation" : item.stage === "evaluation" ? "program" : null;
  const eligiblePeople = people.filter((person) => person.role === "expedition-lead");
  const canSubmit = outcome !== "close" || reason.trim().length >= 8;

  function submit() {
    if (!canSubmit) return;
    onSubmit({
      family: attention.family,
      itemId: item.id,
      outcome,
      assigneeId: attention.family === "delegate" ? assigneeId : undefined,
    }, attention.family === "nudge" ? message : reason);
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="action-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <header className="action-dialog__header">
          <div>
            <span className="dialog-code">{item.code} · {stageMeta[item.stage].label}</span>
            <h2 id="dialog-title">
              {attention.family === "decide" && "Record a decision"}
              {attention.family === "delegate" && "Assign accountable lead"}
              {attention.family === "nudge" && "Send a human check-in"}
            </h2>
          </div>
          <button className="icon-button icon-button--light" type="button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button>
        </header>

        <div className="action-dialog__body">
          <div className="dialog-item-context">
            <span className="kind-mark">{item.kind.slice(0, 1)}</span>
            <div><strong>{item.title}</strong><p>{attention.reason}</p></div>
          </div>

          {attention.family === "decide" && (
            <div className="decision-options">
              <button type="button" className={outcome === "advance" ? "is-active" : ""} onClick={() => setOutcome("advance")}>
                <span className="decision-options__icon"><ArrowUpRight size={18} /></span>
                <span>
                  <strong>{item.flags.includes("empty-program") ? "Define first operation" : nextStage ? `Advance to ${stageMeta[nextStage].label}` : "Confirm progress"}</strong>
                  <small>Move forward with the evidence recorded here.</small>
                </span>
                {outcome === "advance" && <Check size={18} />}
              </button>
              <button type="button" className={outcome === "close" ? "is-active is-close" : ""} onClick={() => setOutcome("close")}>
                <span className="decision-options__icon"><X size={18} /></span>
                <span><strong>Close with context</strong><small>Preserve the reasoning and stop further prompts.</small></span>
                {outcome === "close" && <Check size={18} />}
              </button>
              {outcome === "close" && (
                <label className="field-group">
                  <span>Reason for closing</span>
                  <textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="What changed, or why is this no longer the right bet?" rows={3} autoFocus />
                  <small>{reason.trim().length < 8 ? "Add a little context so the decision remains useful." : "This context will stay with the record."}</small>
                </label>
              )}
            </div>
          )}

          {attention.family === "delegate" && (
            <div className="people-options">
              <p className="dialog-prompt"><UserRoundPlus size={16} /> Available Expedition Leads</p>
              {eligiblePeople.map((person) => (
                <button type="button" key={person.id} className={assigneeId === person.id ? "person-option is-active" : "person-option"} onClick={() => setAssigneeId(person.id)}>
                  <span className="avatar" style={{ background: person.color }}>{person.initials}</span>
                  <span className="person-option__identity"><strong>{person.name}</strong><small>{person.discipline} · {person.location}</small></span>
                  <span className="load-meter" aria-label={`${person.load}% allocated`}><span><i style={{ width: `${person.load}%` }} /></span><small>{person.load}% allocated</small></span>
                  {assigneeId === person.id && <Check size={18} />}
                </button>
              ))}
              <p className="sensitivity-note">Allocation is shown only to support this assignment decision.</p>
            </div>
          )}

          {attention.family === "nudge" && (
            <div className="nudge-compose">
              <p className="dialog-prompt"><MessageCircleMore size={16} /> Check in with the current owner</p>
              <div className="message-presets">
                {["What support would help move this forward?", "Could you share a brief progress update?", "Is the current plan still realistic?"].map((preset) => (
                  <button type="button" key={preset} className={message === preset ? "is-active" : ""} onClick={() => setMessage(preset)}>{preset}</button>
                ))}
              </div>
              <label className="field-group"><span>Message</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} /></label>
              <p className="sensitivity-note">A check-in records activity. It does not escalate or change status automatically.</p>
            </div>
          )}
        </div>

        <footer className="action-dialog__footer">
          <button type="button" className="button button--quiet" onClick={onClose}>Cancel</button>
          <button type="button" className="button button--primary" onClick={submit} disabled={!canSubmit}>
            {attention.family === "decide" && (outcome === "close" ? "Close item" : "Record decision")}
            {attention.family === "delegate" && "Assign lead"}
            {attention.family === "nudge" && "Send check-in"}
          </button>
        </footer>
      </section>
    </div>
  );
}
