"use client";

import { useEffect, useRef, useState } from "react";
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
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [outcome, setOutcome] = useState("advance");
  const [assigneeId, setAssigneeId] = useState("p1");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState(
    attention.family === "nudge" ? "What support would help move this forward?" : "",
  );

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
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
      <section ref={dialogRef} className="action-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-context">
        <header className="action-dialog__header">
          <div>
            <span className="dialog-code">{item.code} · {stageMeta[item.stage].label}</span>
            <h2 id="dialog-title">
              {attention.family === "decide" && "Record a decision"}
              {attention.family === "delegate" && "Assign accountable lead"}
              {attention.family === "nudge" && "Send a human check-in"}
            </h2>
          </div>
          <button ref={closeButtonRef} className="icon-button icon-button--light" type="button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button>
        </header>

        <div className="action-dialog__body">
          <div className="dialog-item-context">
            <span className="kind-mark">{item.kind.slice(0, 1)}</span>
            <div><strong>{item.title}</strong><p id="dialog-context">{attention.reason}</p></div>
          </div>

          {attention.family === "decide" && (
            <div className="decision-options">
              <button type="button" aria-pressed={outcome === "advance"} className={outcome === "advance" ? "is-active" : ""} onClick={() => setOutcome("advance")}>
                <span className="decision-options__icon"><ArrowUpRight size={18} /></span>
                <span>
                  <strong>{item.flags.includes("empty-program") ? "Define first operation" : nextStage ? `Advance to ${stageMeta[nextStage].label}` : "Confirm progress"}</strong>
                  <small>Move forward with the evidence recorded here.</small>
                </span>
                {outcome === "advance" && <Check size={18} />}
              </button>
              <button type="button" aria-pressed={outcome === "close"} className={outcome === "close" ? "is-active is-close" : ""} onClick={() => setOutcome("close")}>
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
                <button type="button" key={person.id} aria-pressed={assigneeId === person.id} className={assigneeId === person.id ? "person-option is-active" : "person-option"} onClick={() => setAssigneeId(person.id)}>
                  <span className="avatar" style={{ background: person.color }}>{person.initials}</span>
                  <span className="person-option__identity"><strong>{person.name}</strong><small>{person.discipline} · {person.location}</small></span>
                  <span className="load-meter"><span role="progressbar" aria-label={`${person.name} allocation`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={person.load}><i style={{ width: `${person.load}%` }} /></span><small>{person.load}% allocated</small></span>
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
                  <button type="button" key={preset} aria-pressed={message === preset} className={message === preset ? "is-active" : ""} onClick={() => setMessage(preset)}>{preset}</button>
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
