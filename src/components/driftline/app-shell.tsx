"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Gauge, Layers3, Menu, Plus, RotateCcw, Search, UserRound, UsersRound, Waves, X } from "lucide-react";
import { roles } from "@/lib/driftline/seed";
import type { RoleId } from "@/lib/driftline/types";
import { useDriftline } from "./driftline-provider";

const navigation = [
  { href: "/", label: "Dashboard", icon: Gauge },
  { href: "/work", label: "Portfolio", icon: Layers3 },
  { href: "/people", label: "People", icon: UsersRound },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, setRole, attentionCount, resetDemo, notice, undo } = useDriftline();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentRole = roles.find((entry) => entry.id === role) ?? roles[1];

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <div className={`workspace-shell ${collapsed ? "is-collapsed" : ""}`}>
      <header className="mobile-header">
        <Link href="/" className="brand"><span className="brand__mark"><Waves size={17} /></span><strong>Driftline</strong></Link>
        <button type="button" className="icon-button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Close navigation" : "Open navigation"}>{mobileOpen ? <X size={19} /> : <Menu size={19} />}</button>
      </header>

      <aside className={`workspace-nav ${mobileOpen ? "is-mobile-open" : ""}`}>
        <div className="workspace-nav__header">
          <Link href="/" className="brand" aria-label="Driftline dashboard" onClick={() => setMobileOpen(false)}><span className="brand__mark"><Waves size={18} strokeWidth={1.6} /></span><span className="brand__copy"><strong>Driftline</strong><small>Aster Bay Institute</small></span></Link>
          <button type="button" className="nav-collapse" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}><ChevronLeft size={16} /></button>
        </div>

        <Link href="/work" className="nav-search" onClick={() => setMobileOpen(false)}><Search size={15} /><span>Search records</span><kbd>⌘ K</kbd></Link>

        <nav className="workspace-nav__links" aria-label="Workspace navigation">
          <p>Workspace</p>
          {navigation.map((item) => {
            const Icon = item.icon;
            return <Link key={item.href} href={item.href} className={isActive(item.href) ? "is-active" : ""} onClick={() => setMobileOpen(false)}><Icon size={17} /><span>{item.label}</span>{item.href === "/" && attentionCount > 0 && <b>{attentionCount}</b>}</Link>;
          })}
        </nav>

        <section className="quick-actions" aria-labelledby="quick-actions-title">
          <p id="quick-actions-title">Create</p>
          <Link href="/new?stage=signal" onClick={() => setMobileOpen(false)}><Plus size={14} /><span>Capture signal</span></Link>
          <Link href="/new?stage=evaluation" onClick={() => setMobileOpen(false)}><Plus size={14} /><span>Start evaluation</span></Link>
          <Link href="/new?stage=operation" onClick={() => setMobileOpen(false)}><Plus size={14} /><span>Plan operation</span></Link>
        </section>

        <div className="workspace-nav__spacer" />

        <button type="button" className="nav-reset" onClick={resetDemo}><RotateCcw size={15} /><span>Reset demo</span></button>
        <label className="nav-persona">
          <span className="persona-avatar">{currentRole.initials}</span>
          <span className="nav-persona__copy"><small>Viewing as</small><strong>{currentRole.label}</strong></span>
          <select value={role} onChange={(event) => setRole(event.target.value as RoleId)} aria-label="View as persona">{roles.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</select>
          <UserRound size={15} />
        </label>
      </aside>

      <div className="workspace-main">
        <div className="workspace-status"><span><i /> System online</span><span>Model / AB-07</span><span className="workspace-status__right">Local demo data</span></div>
        {children}
      </div>

      {notice && <div className="toast" role="status"><span className="toast__check">✓</span><span>{notice.text}</span><button type="button" onClick={undo}>Undo</button></div>}
    </div>
  );
}
