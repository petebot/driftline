"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Gauge, Layers3, Menu, Palette, Plus, RotateCcw, Search, UserRound, UsersRound, Waves, X } from "lucide-react";
import { roles } from "@/lib/driftline/seed";
import type { RoleId } from "@/lib/driftline/types";
import { useDriftline } from "./driftline-provider";

const navigation = [
  { href: "/", label: "Dashboard", icon: Gauge },
  { href: "/work", label: "Portfolio", icon: Layers3 },
  { href: "/people", label: "People", icon: UsersRound },
  { href: "/system", label: "System", icon: Palette },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, setRole, attentionCount, resetDemo, notice, undo } = useDriftline();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const currentRole = roles.find((entry) => entry.id === role) ?? roles[1];

  useEffect(() => {
    if (!mobileOpen) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const menuButton = menuButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    navRef.current?.querySelector<HTMLElement>("a, button, select")?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab" || !navRef.current) return;
      const focusable = Array.from(navRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      (previouslyFocused ?? menuButton)?.focus();
    };
  }, [mobileOpen]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <div className={`workspace-shell ${collapsed ? "is-collapsed" : ""}`}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="mobile-header">
        <Link href="/" className="brand"><span className="brand__mark"><Waves size={17} /></span><strong>Driftline</strong></Link>
        <button ref={menuButtonRef} type="button" className="icon-button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="workspace-navigation">{mobileOpen ? <X size={19} /> : <Menu size={19} />}</button>
      </header>

      <aside ref={navRef} id="workspace-navigation" className={`workspace-nav ${mobileOpen ? "is-mobile-open" : ""}`} aria-label="Driftline workspace">
        <div className="workspace-nav__header">
          <Link href="/" className="brand" aria-label="Driftline dashboard" onClick={() => setMobileOpen(false)}><span className="brand__mark"><Waves size={18} strokeWidth={1.6} /></span><span className="brand__copy"><strong>Driftline</strong><small>Aster Bay Institute</small></span></Link>
          <button type="button" className="nav-collapse" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expand navigation" : "Collapse navigation"} aria-expanded={!collapsed}><ChevronLeft size={16} /></button>
        </div>

        <Link href="/work" className="nav-search" aria-label="Search portfolio records" onClick={() => setMobileOpen(false)}><Search size={15} /><span>Search records</span></Link>

        <nav className="workspace-nav__links" aria-label="Workspace navigation">
          <p>Workspace</p>
          {navigation.map((item) => {
            const Icon = item.icon;
            return <Link key={item.href} href={item.href} aria-label={item.label} aria-current={isActive(item.href) ? "page" : undefined} className={isActive(item.href) ? "is-active" : ""} onClick={() => setMobileOpen(false)}><Icon size={17} /><span>{item.label}</span>{item.href === "/" && attentionCount > 0 && <b><span aria-hidden="true">{attentionCount}</span><span className="sr-only"> decisions waiting</span></b>}</Link>;
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
        <main id="main-content" tabIndex={-1}>{children}</main>
      </div>

      {notice && <div className="toast"><span className="toast__check">✓</span><span role="status">{notice.text}</span><button type="button" onClick={undo}>Undo</button></div>}
    </div>
  );
}
