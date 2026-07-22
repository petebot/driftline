import { describe, expect, it } from "vitest";
import { createInitialState } from "./seed";
import { applyDemoAction, getAttentionItems, getStageStats } from "./rules";

describe("Driftline attention rules", () => {
  it("routes the default decision set to the Program Steward in explicit priority order", () => {
    const attention = getAttentionItems(createInitialState(), "program-steward");

    expect(attention).toHaveLength(5);
    expect(attention[0]).toMatchObject({
      itemId: "o1",
      family: "nudge",
      ruleId: "OPERATION.BLOCKER.NO_RESPONSE",
    });
    expect(attention.map((item) => item.family)).toEqual([
      "nudge",
      "delegate",
      "decide",
      "decide",
      "decide",
    ]);
  });

  it("makes the evaluation bottleneck visible at the system level", () => {
    const stages = getStageStats(createInitialState().items);
    const evaluation = stages.find((stage) => stage.stage === "evaluation");

    expect(evaluation).toMatchObject({ count: 5, stalled: 3, median: 20 });
  });

  it("advances a reviewed evaluation and turns the next ownership gap into a new decision", () => {
    const next = applyDemoAction(createInitialState(), {
      family: "decide",
      itemId: "e1",
      outcome: "advance",
    });
    const advanced = next.items.find((item) => item.id === "e1");
    const attention = getAttentionItems(next, "program-steward");

    expect(advanced).toMatchObject({
      stage: "program",
      ownerId: null,
      flags: ["missing-owner"],
    });
    expect(attention.some((entry) => entry.itemId === "e1" && entry.family === "delegate")).toBe(true);
  });

  it("moves accountability across roles after delegation", () => {
    const next = applyDemoAction(createInitialState(), {
      family: "delegate",
      itemId: "p2i",
      outcome: "assign",
      assigneeId: "p1",
    });

    expect(getAttentionItems(next, "program-steward").some((entry) => entry.itemId === "p2i")).toBe(false);
    expect(getAttentionItems(next, "expedition-lead")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ itemId: "p2i", family: "decide", ruleId: "PROGRAM.ACTIVE.NO_OPERATION" }),
      ]),
    );
  });

  it("clears a blocker prompt for both steward and expedition lead after a check-in", () => {
    const next = applyDemoAction(createInitialState(), {
      family: "nudge",
      itemId: "o1",
      outcome: "support",
    });

    expect(getAttentionItems(next, "program-steward").some((entry) => entry.itemId === "o1")).toBe(false);
    expect(getAttentionItems(next, "expedition-lead").some((entry) => entry.itemId === "o1")).toBe(false);
  });
});
