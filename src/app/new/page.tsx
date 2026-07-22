import { Suspense } from "react";
import { CreateWorkPage } from "@/components/driftline/create-work-page";

export const metadata = { title: "Create work — Driftline" };

export default function NewPage() {
  return <Suspense fallback={<div className="route-loading">Preparing record…</div>}><CreateWorkPage /></Suspense>;
}
