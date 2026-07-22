import type { DemoState, Person, PortfolioItem, RoleId, StageId } from "./types";

export const roles: Array<{
  id: RoleId;
  label: string;
  shortLabel: string;
  person: string;
  initials: string;
  remit: string;
}> = [
  {
    id: "research-director",
    label: "Research Director",
    shortLabel: "Director",
    person: "Dr. Anika Rao",
    initials: "AR",
    remit: "Portfolio direction",
  },
  {
    id: "program-steward",
    label: "Program Steward",
    shortLabel: "Steward",
    person: "Elias Chen",
    initials: "EC",
    remit: "Program movement",
  },
  {
    id: "expedition-lead",
    label: "Expedition Lead",
    shortLabel: "Expedition",
    person: "Mara Voss",
    initials: "MV",
    remit: "Field execution",
  },
  {
    id: "research-specialist",
    label: "Research Specialist",
    shortLabel: "Specialist",
    person: "Jon Bell",
    initials: "JB",
    remit: "Evidence & review",
  },
];

export const stageMeta: Record<
  StageId,
  { label: string; index: string; description: string; accent: string }
> = {
  signal: {
    label: "Signals",
    index: "01",
    description: "Observed and proposed",
    accent: "#7dd3c7",
  },
  evaluation: {
    label: "Evaluations",
    index: "02",
    description: "Evidence and review",
    accent: "#f2b86b",
  },
  program: {
    label: "Programs",
    index: "03",
    description: "Approved and owned",
    accent: "#7ca6f6",
  },
  operation: {
    label: "Operations",
    index: "04",
    description: "Active in the field",
    accent: "#b4d987",
  },
};

export const people: Person[] = [
  { id: "p1", name: "Mara Voss", initials: "MV", discipline: "Field systems", role: "expedition-lead", load: 63, location: "Bergen", color: "#89b8ff" },
  { id: "p2", name: "Tomas Ibarra", initials: "TI", discipline: "Marine robotics", role: "expedition-lead", load: 81, location: "Monterey", color: "#b8a7ff" },
  { id: "p3", name: "Nia Okafor", initials: "NO", discipline: "Restoration ecology", role: "expedition-lead", load: 48, location: "Accra", color: "#84d8bd" },
  { id: "p4", name: "Leonie Park", initials: "LP", discipline: "Acoustic sensing", role: "research-specialist", load: 72, location: "Halifax", color: "#efbd78" },
  { id: "p5", name: "Jon Bell", initials: "JB", discipline: "Ocean chemistry", role: "research-specialist", load: 54, location: "Woods Hole", color: "#f2a8a8" },
  { id: "p6", name: "Saira Nordin", initials: "SN", discipline: "Data systems", role: "research-specialist", load: 39, location: "Reykjavík", color: "#7ec8dc" },
  { id: "p7", name: "Elias Chen", initials: "EC", discipline: "Research programs", role: "program-steward", load: 68, location: "Seattle", color: "#e0cc77" },
  { id: "p8", name: "Anika Rao", initials: "AR", discipline: "Research strategy", role: "research-director", load: 57, location: "Lisbon", color: "#98c9a3" },
];

const items: PortfolioItem[] = [
  { id: "s1", code: "SIG-041", title: "Mesophotic reef soundscape shift", kind: "Hypothesis", stage: "signal", summary: "A recurring low-frequency change may indicate altered grazing patterns below conventional survey depth.", region: "Labrador Shelf", ownerId: "p4", ageDays: 18, activityDays: 18, flags: ["unsorted"], evidence: ["3 passive-acoustic transects", "Hydrophone anomaly logged"], updatedLabel: "18 days ago" },
  { id: "s2", code: "SIG-044", title: "Biodegradable drifter housing", kind: "Instrument", stage: "signal", summary: "A low-cost housing concept designed to eliminate retrieval waste from short-duration drift studies.", region: "North Atlantic", ownerId: "p6", ageDays: 13, activityDays: 13, flags: ["unsorted"], evidence: ["Material sample documented"], updatedLabel: "13 days ago" },
  { id: "s3", code: "SIG-047", title: "Night-light corridor mapping", kind: "Intervention", stage: "signal", summary: "Map coastal light spill against juvenile migration corridors before proposing mitigation trials.", region: "Skagerrak", ownerId: "p5", ageDays: 6, activityDays: 2, flags: [], evidence: ["Coastal GIS layer attached"], updatedLabel: "2 days ago" },
  { id: "s4", code: "SIG-048", title: "Vent plume microbial sampler", kind: "Instrument", stage: "signal", summary: "A pressure-tolerant sampler for preserving microbial gradients through ascent.", region: "Azores Plateau", ownerId: "p2", ageDays: 4, activityDays: 1, flags: [], evidence: ["Bench concept uploaded"], updatedLabel: "Yesterday" },
  { id: "s5", code: "SIG-050", title: "Subtidal heat refuge indicators", kind: "Hypothesis", stage: "signal", summary: "Cross-reference persistent cold pockets with kelp survival during marine heat events.", region: "Iberian Shelf", ownerId: "p3", ageDays: 3, activityDays: 3, flags: [], evidence: ["Satellite temperature note"], updatedLabel: "3 days ago" },
  { id: "s6", code: "SIG-052", title: "Quiet-zone buoy protocol", kind: "Intervention", stage: "signal", summary: "A voluntary vessel routing protocol around seasonal cetacean feeding zones.", region: "Gulf of Maine", ownerId: "p1", ageDays: 2, activityDays: 1, flags: [], evidence: ["Stakeholder map started"], updatedLabel: "Yesterday" },
  { id: "e1", code: "EVL-204", title: "Deep-reef acoustic observatory", kind: "Instrument", stage: "evaluation", summary: "Test whether a sparse, solar-assisted hydrophone mesh can provide a reliable picture of deep-reef recovery.", region: "Labrador Shelf", ownerId: "p4", ageDays: 29, activityDays: 14, flags: ["review-complete"], evidence: ["3/3 peer reviews complete", "Feasibility: supported", "Risk register attached"], updatedLabel: "14 days ago" },
  { id: "e2", code: "EVL-209", title: "Autonomous microplastic transects", kind: "Instrument", stage: "evaluation", summary: "Validate a low-power sampler that can map near-surface microplastic concentration during routine crossings.", region: "Sargasso Sea", ownerId: "p2", ageDays: 24, activityDays: 11, flags: ["review-complete"], evidence: ["2/2 technical reviews complete", "Prototype accuracy ±8%"], updatedLabel: "11 days ago" },
  { id: "e3", code: "EVL-211", title: "Seagrass carbon verification", kind: "Hypothesis", stage: "evaluation", summary: "Compare acoustic biomass estimates with sediment cores across restored and reference meadows.", region: "Adriatic Coast", ownerId: "p5", ageDays: 20, activityDays: 4, flags: ["review-requested"], evidence: ["1/2 reviews complete", "Core protocol drafted"], updatedLabel: "4 days ago" },
  { id: "e4", code: "EVL-215", title: "Kelp-edge thermal refuges", kind: "Intervention", stage: "evaluation", summary: "Identify persistent cool-water edges that could anchor restoration through future heat events.", region: "Iberian Shelf", ownerId: "p3", ageDays: 17, activityDays: 8, flags: ["quiet"], evidence: ["Remote-sensing study complete", "Field validation pending"], updatedLabel: "8 days ago" },
  { id: "e5", code: "EVL-218", title: "eDNA storm pulse survey", kind: "Expedition", stage: "evaluation", summary: "Sample before and after major storm systems to test rapid biodiversity redistribution signals.", region: "Bay of Biscay", ownerId: "p1", ageDays: 8, activityDays: 2, flags: [], evidence: ["Vessel window identified"], updatedLabel: "2 days ago" },
  { id: "p1i", code: "PRG-108", title: "Thermal refuge atlas", kind: "Intervention", stage: "program", summary: "Create a decision-ready atlas of coastal cold-water refuges for restoration partners.", region: "Northeast Atlantic", ownerId: "p7", ageDays: 31, activityDays: 9, flags: ["empty-program"], evidence: ["Program charter approved", "No operation plan", "Partner cohort confirmed"], progress: 12, updatedLabel: "9 days ago" },
  { id: "p2i", code: "PRG-112", title: "Open-ocean plastics observatory", kind: "Instrument", stage: "program", summary: "Establish repeatable autonomous sampling across commercial and research vessel routes.", region: "North Atlantic Gyre", ownerId: null, ageDays: 19, activityDays: 11, flags: ["missing-owner"], evidence: ["Evaluation approved", "Operating envelope defined", "No accountable lead"], progress: 8, updatedLabel: "11 days ago" },
  { id: "p3i", code: "PRG-116", title: "Blue carbon field standard", kind: "Hypothesis", stage: "program", summary: "Develop a reproducible evidence standard for restored seagrass carbon claims.", region: "Atlantic Basin", ownerId: "p7", ageDays: 48, activityDays: 3, flags: [], evidence: ["2 operations active", "External methods panel formed"], progress: 43, updatedLabel: "3 days ago" },
  { id: "p4i", code: "PRG-119", title: "Coastal sound refuge network", kind: "Intervention", stage: "program", summary: "Coordinate seasonal acoustic monitoring and vessel-behavior trials across three ports.", region: "Gulf of Maine", ownerId: "p7", ageDays: 42, activityDays: 5, flags: [], evidence: ["3 operations active", "Port agreements signed"], progress: 61, updatedLabel: "5 days ago" },
  { id: "o1", code: "OPS-331", title: "Kelp recovery plot — São Vicente", kind: "Intervention", stage: "operation", parentId: "p1i", summary: "Validate cool-water edge persistence and juvenile kelp survival at the first atlas reference site.", region: "São Vicente", ownerId: "p3", ageDays: 23, activityDays: 6, flags: ["blocked"], evidence: ["Blocker: mooring permit pending", "14-day field window at risk", "Support requested"], progress: 38, updatedLabel: "6 days ago" },
  { id: "o2", code: "OPS-327", title: "Seagrass core calibration — Rovinj", kind: "Expedition", stage: "operation", parentId: "p3i", summary: "Calibrate acoustic biomass estimates against a compact sediment-core campaign.", region: "Rovinj", ownerId: "p1", ageDays: 18, activityDays: 2, flags: [], evidence: ["Sampling 68% complete"], progress: 68, updatedLabel: "2 days ago" },
  { id: "o3", code: "OPS-319", title: "Harbor quiet-hours trial", kind: "Intervention", stage: "operation", parentId: "p4i", summary: "Test voluntary reduced-speed windows against passive acoustic baselines.", region: "Portland Harbor", ownerId: "p1", ageDays: 36, activityDays: 12, flags: ["quiet"], evidence: ["No field update for 12 days", "Trial window active"], progress: 52, updatedLabel: "12 days ago" },
  { id: "o4", code: "OPS-336", title: "Acoustic classifier validation", kind: "Instrument", stage: "operation", parentId: "p4i", summary: "Validate on-device species classification against expert-labelled recordings.", region: "Halifax", ownerId: "p4", ageDays: 15, activityDays: 1, flags: [], evidence: ["Validation set at 74%"], progress: 74, updatedLabel: "Yesterday" },
  { id: "o5", code: "OPS-340", title: "Sediment protocol round robin", kind: "Hypothesis", stage: "operation", parentId: "p3i", summary: "Compare repeatability of the draft carbon protocol across five partner laboratories.", region: "Distributed", ownerId: "p5", ageDays: 9, activityDays: 3, flags: [], evidence: ["4/5 laboratories active"], progress: 46, updatedLabel: "3 days ago" },
];

export const initialDemoState: DemoState = {
  items,
  activityCount: 18,
};

export function createInitialState(): DemoState {
  return JSON.parse(JSON.stringify(initialDemoState)) as DemoState;
}
