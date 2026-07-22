export type RoleId =
  | "research-director"
  | "program-steward"
  | "expedition-lead"
  | "research-specialist";

export type StageId = "signal" | "evaluation" | "program" | "operation";

export type WorkKind =
  | "Hypothesis"
  | "Expedition"
  | "Intervention"
  | "Instrument";

export type ActionFamily = "decide" | "delegate" | "nudge";

export type ItemFlag =
  | "unsorted"
  | "review-complete"
  | "missing-owner"
  | "empty-program"
  | "blocked"
  | "quiet"
  | "review-requested";

export interface Person {
  id: string;
  name: string;
  initials: string;
  discipline: string;
  role: RoleId;
  load: number;
  location: string;
  color: string;
}

export interface PortfolioItem {
  id: string;
  code: string;
  title: string;
  kind: WorkKind;
  stage: StageId;
  summary: string;
  region: string;
  ownerId: string | null;
  ageDays: number;
  activityDays: number;
  flags: ItemFlag[];
  evidence: string[];
  parentId?: string;
  progress?: number;
  closed?: boolean;
  updatedLabel: string;
}

export interface AttentionItem {
  key: string;
  itemId: string;
  ruleId: string;
  role: RoleId;
  family: ActionFamily;
  headline: string;
  reason: string;
  ageLabel: string;
  severity: "critical" | "watch" | "routine";
  clearsWhen: string;
  primaryLabel: string;
  priority: number;
}

export interface DemoState {
  items: PortfolioItem[];
  activityCount: number;
}

export interface DemoAction {
  family: ActionFamily;
  itemId: string;
  outcome: string;
  assigneeId?: string;
}
