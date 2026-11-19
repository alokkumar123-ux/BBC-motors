import { Link, useNavigate, type LinkProps } from "@tanstack/react-router";
import { ChevronDown, LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Emblem } from "@/components/site/Emblem";
import { cn } from "@/lib/utils";

export interface PortalNavItem {
  to: NonNullable<LinkProps["to"]>;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export function PortalShell({
  title,
  subtitle,
  nav,
  user,
  onLogout,
  children,
}: {
  title: string;
  subtitle: string;
  nav: PortalNavItem[];
  user: { name: string; initial: string };
  onLogout?: () => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const sidebar = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <Link to="/" className="flex items-center gap-3 px-5 py-6">
        <Emblem className="h-12 w-12" />
        <div className="leading-tight">
          <p className="text-base font-bold text-sidebar-primary-foreground">{title}</p>
          <p className="text-sm">{subtitle}</p>
        </div>
      </Link>
      <nav className="flex-1 space-y-1 px-3">
        {nav.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: !!exact }}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-primary data-[status=active]:text-sidebar-primary-foreground"
          >
            <Icon className="h-[18px] w-[18px]" /> {label}
          </Link>
        ))}
        <button
          onClick={() => {
            if (onLogout) {
              onLogout();
            } else {
              if (typeof window !== "undefined") {
                try { localStorage.removeItem("bbc_active_student"); } catch {}
              }
              navigate({ to: "/login" });
            }
          }}
          className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-sidebar-accent"
        >
          <LogOut className="h-[18px] w-[18px]" /> Logout
        </button>
      </nav>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close menu" className="absolute inset-0 bg-navy-deep/50" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-64 animate-in slide-in-from-left">{sidebar}</aside>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur sm:px-6">
          <button aria-label="Open menu" onClick={() => setOpen(true)} className="rounded-md p-2 hover:bg-muted lg:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="ml-auto flex items-center gap-2 text-sm font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-navy text-xs text-navy-foreground">
              {user.initial}
            </span>
            {user.name}
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ title, action, className, children }: { title?: string; action?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={cn("rounded-2xl border bg-card p-5 shadow-card", className)}>
      {title && (
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-base font-bold">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const STATUS_TONES: Record<string, string> = {
  Valid: "bg-success-soft text-success",
  Paid: "bg-success-soft text-success",
  Completed: "bg-success-soft text-success",
  "In Progress": "bg-brand-soft text-brand",
  Enrolled: "bg-brand-soft text-brand",
  Pending: "bg-warning-soft text-warning",
  Revoked: "bg-destructive/10 text-destructive",
  Failed: "bg-destructive/10 text-destructive",
  "Not Found": "bg-destructive/10 text-destructive",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_TONES[status] ?? "bg-muted text-muted-foreground")}>
      {status}
    </span>
  );
}

export function DataTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
            {head.map((h) => (
              <th key={h} className="px-3 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
              {cells.map((c, j) => (
                <td key={j} className="px-3 py-3">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
