import type { AttentionItem, DemoAction, DemoState, PortfolioItem, RoleId, StageId } from "./types";

const ROLE_PERSON: Partial<Record<RoleId, string>> = {
  "research-director": "p8",
  "program-steward": "p7",
  "expedition-lead": "p1",
  "research-specialist": "p5",
};

export function getAttentionItems(state: DemoState, role: RoleId): AttentionItem[] {
  const results: AttentionItem[] = [];

  for (const item of state.items) {
    if (item.closed) continue;

    if (item.flags.includes("review-complete")) {
      results.push({
        key: `${item.id}-review-complete`,
        itemId: item.id,
        ruleId: "EVAL.REVIEW_COMPLETE.NO_DECISION",
        role: "program-steward",
        family: "decide",
        headline: "Review complete — choose an outcome",
        reason: `Peer review closed ${item.activityDays} days ago, but no advance or close decision was recorded.`,
        ageLabel: `${item.activityDays}d waiting`,
        severity: item.activityDays >= 14 ? "critical" : "watch",
        clearsWhen: "An advance or close decision is recorded",
        primaryLabel: "Decide",
        priority: 100 + item.activityDays,
      });
    }

    if (item.flags.includes("missing-owner")) {
      results.push({
        key: `${item.id}-missing-owner`,
        itemId: item.id,
        ruleId: "PROGRAM.APPROVED.NO_OWNER",
        role: "program-steward",
        family: "delegate",
        headline: "Approved program has no field lead",
        reason: `This program was approved ${item.activityDays} days ago and cannot enter operation without an accountable lead.`,
        ageLabel: `${item.activityDays}d unowned`,
        severity: "critical",
        clearsWhen: "An Expedition Lead is assigned",
        primaryLabel: "Assign lead",
        priority: 124,
      });
    }

    if (item.flags.includes("empty-program")) {
      const targetRole: RoleId = item.ownerId === "p1" ? "expedition-lead" : "program-steward";
      results.push({
        key: `${item.id}-empty-program`,
        itemId: item.id,
        ruleId: "PROGRAM.ACTIVE.NO_OPERATION",
        role: targetRole,
        family: "decide",
        headline: "Program has no operation plan",
        reason: `The charter is active, but no field study, deployment, or intervention has been defined after ${item.activityDays} days.`,
        ageLabel: `${item.activityDays}d stationary`,
        severity: "watch",
        clearsWhen: "The first operation is scoped",
        primaryLabel: "Define operation",
        priority: 88 + item.activityDays,
      });
    }

    if (item.flags.includes("blocked")) {
      results.push({
        key: `${item.id}-blocked-steward`,
        itemId: item.id,
        ruleId: "OPERATION.BLOCKER.NO_RESPONSE",
        role: "program-steward",
        family: "nudge",
        headline: "Field blocker needs support",
        reason: `A blocker was reported ${item.activityDays} days ago and no support response has been recorded.`,
        ageLabel: `${item.activityDays}d blocked`,
        severity: "critical",
        clearsWhen: "Support is offered or the blocker is cleared",
        primaryLabel: "Offer support",
        priority: 120 + item.activityDays,
      });
      results.push({
        key: `${item.id}-blocked-lead`,
        itemId: item.id,
        ruleId: "OPERATION.BLOCKER.UPDATE_DUE",
        role: "expedition-lead",
        family: "nudge",
        headline: "Post a blocker update",
        reason: `The field blocker has had no recorded movement for ${item.activityDays} days.`,
        ageLabel: `${item.activityDays}d blocked`,
        severity: "critical",
        clearsWhen: "A progress update is recorded",
        primaryLabel: "Post update",
        priority: 126,
      });
    }

    if (item.flags.includes("quiet") && item.stage === "operation") {
      results.push({
        key: `${item.id}-quiet`,
        itemId: item.id,
        ruleId: "OPERATION.ACTIVE.CADENCE_MISSED",
        role: "expedition-lead",
        family: "nudge",
        headline: "Field update cadence missed",
        reason: `No meaningful activity has been recorded for ${item.activityDays} days during an active field window.`,
        ageLabel: `${item.activityDays}d quiet`,
        severity: "watch",
        clearsWhen: "The owner posts a progress update",
        primaryLabel: "Request update",
        priority: 82 + item.activityDays,
      });
    }

    if (item.flags.includes("unsorted")) {
      results.push({
        key: `${item.id}-unsorted`,
        itemId: item.id,
        ruleId: "SIGNAL.UNSORTED.INTAKE_OVERDUE",
        role: "research-director",
        family: "decide",
        headline: "Signal has not entered intake",
        reason: `This signal has remained outside formal evaluation for ${item.activityDays} days.`,
        ageLabel: `${item.activityDays}d unsorted`,
        severity: item.activityDays >= 16 ? "watch" : "routine",
        clearsWhen: "It enters evaluation or is closed with context",
        primaryLabel: "Triage signal",
        priority: 60 + item.activityDays,
      });
    }

    if (item.flags.includes("review-requested")) {
      results.push({
        key: `${item.id}-review-requested`,
        itemId: item.id,
        ruleId: "EVAL.REVIEW.REQUEST_OPEN",
        role: "research-specialist",
        family: "decide",
        headline: "Peer review is waiting",
        reason: "One specialist review remains before this evaluation can reach a decision.",
        ageLabel: `${item.activityDays}d assigned`,
        severity: "routine",
        clearsWhen: "The final review is submitted",
        primaryLabel: "Complete review",
        priority: 70 + item.activityDays,
      });
    }
  }

  return results
    .filter((result) => result.role === role)
    .sort((a, b) => b.priority - a.priority);
}

export function getStageStats(items: PortfolioItem[]) {
  const stages: StageId[] = ["signal", "evaluation", "program", "operation"];
  return stages.map((stage) => {
    const active = items.filter((item) => item.stage === stage && !item.closed);
    const stalled = active.filter((item) =>
      item.flags.some((flag) =>
        ["unsorted", "review-complete", "missing-owner", "empty-program", "blocked", "quiet"].includes(flag),
      ),
    );
    const ages = active.map((item) => item.ageDays).sort((a, b) => a - b);
    const midpoint = Math.floor(ages.length / 2);
    const median = ages.length
      ? ages.length % 2
        ? ages[midpoint]
        : Math.round((ages[midpoint - 1] + ages[midpoint]) / 2)
      : 0;
    return { stage, count: active.length, stalled: stalled.length, median };
  });
}

export function applyDemoAction(state: DemoState, action: DemoAction): DemoState {
  const items = state.items.map((item): PortfolioItem => {
    if (item.id !== action.itemId) return item;

    if (action.family === "delegate") {
      return {
        ...item,
        ownerId: action.assigneeId ?? "p1",
        flags: item.flags
          .filter((flag) => flag !== "missing-owner")
          .concat(item.stage === "program" ? ["empty-program"] : []),
        activityDays: 0,
        updatedLabel: "Just now",
      };
    }

    if (action.family === "nudge") {
      return {
        ...item,
        flags: item.flags.filter((flag) => flag !== "blocked" && flag !== "quiet"),
        activityDays: 0,
        updatedLabel: "Just now",
      };
    }

    if (action.outcome === "close") {
      return {
        ...item,
        closed: true,
        flags: [],
        activityDays: 0,
        updatedLabel: "Closed just now",
      };
    }

    if (item.stage === "evaluation") {
      return {
        ...item,
        stage: "program" as const,
        code: item.code.replace("EVL", "PRG"),
        flags: ["missing-owner"],
        ownerId: null,
        ageDays: 0,
        activityDays: 0,
        updatedLabel: "Advanced just now",
      };
    }

    if (item.flags.includes("empty-program")) {
      return {
        ...item,
        flags: item.flags.filter((flag) => flag !== "empty-program"),
        activityDays: 0,
        progress: Math.max(item.progress ?? 0, 18),
        updatedLabel: "Operation scoped just now",
      };
    }

    if (item.flags.includes("unsorted")) {
      return {
        ...item,
        stage: "evaluation" as const,
        code: item.code.replace("SIG", "EVL"),
        flags: ["review-requested"],
        ageDays: 0,
        activityDays: 0,
        updatedLabel: "Entered evaluation just now",
      };
    }

    if (item.flags.includes("review-requested")) {
      return {
        ...item,
        flags: ["review-complete"],
        activityDays: 0,
        updatedLabel: "Reviewed just now",
      };
    }

    return item;
  });

  return { items, activityCount: state.activityCount + 1 };
}

export function roleOwnsItem(item: PortfolioItem, role: RoleId) {
  return item.ownerId === ROLE_PERSON[role];
}
