"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createInitialState } from "@/lib/driftline/seed";
import { applyDemoAction, getAttentionItems } from "@/lib/driftline/rules";
import type { DemoAction, DemoState, PortfolioItem, RoleId, StageId, WorkKind } from "@/lib/driftline/types";

const STORAGE_KEY = "driftline-demo-state-v2";

interface CreateItemInput {
  title: string;
  summary: string;
  stage: StageId;
  kind: WorkKind;
  region: string;
  ownerId: string | null;
  evidence: string[];
}

interface Notice {
  text: string;
  snapshot: DemoState;
}

interface DriftlineContextValue {
  state: DemoState;
  role: RoleId;
  setRole: (role: RoleId) => void;
  attentionCount: number;
  performAction: (action: DemoAction, feedback: string) => void;
  createItem: (input: CreateItemInput) => string;
  resetDemo: () => void;
  undo: () => void;
  notice: Notice | null;
}

const DriftlineContext = createContext<DriftlineContextValue | null>(null);

export function DriftlineProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(() => createInitialState());
  const [role, setRole] = useState<RoleId>("program-steward");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) setState(JSON.parse(stored) as DemoState);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 6500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const attentionCount = useMemo(() => getAttentionItems(state, role).length, [state, role]);

  function performAction(action: DemoAction, feedback: string) {
    const snapshot = state;
    setState((current) => applyDemoAction(current, action));
    setNotice({ text: feedback, snapshot });
  }

  function createItem(input: CreateItemInput) {
    const id = `custom-${Date.now()}`;
    const stagePrefix: Record<StageId, string> = {
      signal: "SIG",
      evaluation: "EVL",
      program: "PRG",
      operation: "OPS",
    };
    const flags: PortfolioItem["flags"] =
      input.stage === "signal"
        ? ["unsorted"]
        : input.stage === "evaluation"
          ? ["review-requested"]
          : input.stage === "program" && !input.ownerId
            ? ["missing-owner"]
            : [];
    const newItem: PortfolioItem = {
      id,
      code: `${stagePrefix[input.stage]}-${String(state.items.length + 101).padStart(3, "0")}`,
      title: input.title,
      summary: input.summary,
      stage: input.stage,
      kind: input.kind,
      region: input.region,
      ownerId: input.ownerId,
      ageDays: 0,
      activityDays: 0,
      flags,
      evidence: input.evidence.length > 0 ? input.evidence : ["Initial record created"],
      progress: input.stage === "program" || input.stage === "operation" ? 4 : undefined,
      updatedLabel: "Created just now",
    };
    const snapshot = state;
    setState((current) => ({ items: [newItem, ...current.items], activityCount: current.activityCount + 1 }));
    setNotice({ text: `${input.title} created.`, snapshot });
    return id;
  }

  function resetDemo() {
    setState(createInitialState());
    setNotice(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  function undo() {
    if (!notice) return;
    setState(notice.snapshot);
    setNotice(null);
  }

  return (
    <DriftlineContext.Provider value={{ state, role, setRole, attentionCount, performAction, createItem, resetDemo, undo, notice }}>
      {children}
    </DriftlineContext.Provider>
  );
}

export function useDriftline() {
  const context = useContext(DriftlineContext);
  if (!context) throw new Error("useDriftline must be used within DriftlineProvider");
  return context;
}
