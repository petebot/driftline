import { ArrowRight, CircleAlert } from "lucide-react";
import { stageMeta } from "@/lib/driftline/seed";
import { getStageStats } from "@/lib/driftline/rules";
import type { PortfolioItem, StageId } from "@/lib/driftline/types";

interface FlowMapProps {
  items: PortfolioItem[];
  selectedStage: StageId | null;
  onSelectStage: (stage: StageId | null) => void;
}

export function FlowMap({ items, selectedStage, onSelectStage }: FlowMapProps) {
  const stats = getStageStats(items);
  const unsorted = items.filter(
    (item) => !item.closed && item.flags.includes("unsorted"),
  ).length;
  const totalStalled = stats.reduce((sum, stage) => sum + stage.stalled, 0);

  return (
    <section className="flow-panel" aria-labelledby="flow-title">
      <div className="flow-panel__heading">
        <div>
          <p className="kicker kicker--dark">Portfolio flow · Live model</p>
          <h2 id="flow-title">Where is work losing momentum?</h2>
        </div>
        <div className="system-readout" aria-label={`${totalStalled} stalled items detected`}>
          <span className="system-readout__pulse" aria-hidden="true" />
          <span><strong>{totalStalled}</strong> stalled</span>
          <span className="system-readout__divider" />
          <span>Updated now</span>
        </div>
      </div>

      <div className="flow-canvas">
        <button
          className={`unsorted-node ${selectedStage === "signal" ? "is-related" : ""}`}
          type="button"
          onClick={() => onSelectStage(selectedStage === "signal" ? null : "signal")}
          aria-pressed={selectedStage === "signal"}
          aria-label={`${unsorted} unsorted signals. Filter signals.`}
        >
          <span className="unsorted-node__count">{String(unsorted).padStart(2, "0")}</span>
          <span>
            <strong>Unsorted</strong>
            <small>outside intake</small>
          </span>
        </button>

        <div className="flow-axis" aria-label="Work lifecycle stages">
          {stats.map((stat, index) => {
            const meta = stageMeta[stat.stage];
            const isSelected = selectedStage === stat.stage;
            const intensity = Math.max(18, Math.round((stat.stalled / Math.max(stat.count, 1)) * 100));

            return (
              <div className="flow-stage-wrap" key={stat.stage}>
                <button
                  type="button"
                  className={`flow-stage ${isSelected ? "is-selected" : ""} ${stat.stalled >= 3 ? "is-bottleneck" : ""}`}
                  style={{ "--stage-accent": meta.accent, "--stall-intensity": `${intensity}%` } as React.CSSProperties}
                  onClick={() => onSelectStage(isSelected ? null : stat.stage)}
                  aria-pressed={isSelected}
                  aria-label={`${meta.label}: ${stat.count} items, ${stat.stalled} stalled, median age ${stat.median} days`}
                >
                  <span className="flow-stage__topline">
                    <span className="flow-stage__index">{meta.index}</span>
                    {stat.stalled > 0 && (
                      <span className="flow-stage__flag">
                        <CircleAlert size={12} strokeWidth={1.8} /> {stat.stalled} stalled
                      </span>
                    )}
                  </span>
                  <span className="flow-stage__metric">{String(stat.count).padStart(2, "0")}</span>
                  <span className="flow-stage__label">{meta.label}</span>
                  <span className="flow-stage__description">{meta.description}</span>
                  <span className="flow-stage__age">
                    <span>Median age</span>
                    <strong>{stat.median}d</strong>
                  </span>
                  <span className="flow-stage__trace" aria-hidden="true"><span /></span>
                </button>
                {index < stats.length - 1 && (
                  <span className="flow-link" aria-hidden="true">
                    <span className="flow-link__line" />
                    <ArrowRight size={15} strokeWidth={1.4} />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flow-legend">
        <span><i className="legend-dot legend-dot--moving" /> Moving normally</span>
        <span><i className="legend-dot legend-dot--stalled" /> Waiting beyond threshold</span>
        <span className="flow-legend__hint">Select a stage to filter decisions</span>
      </div>
    </section>
  );
}
