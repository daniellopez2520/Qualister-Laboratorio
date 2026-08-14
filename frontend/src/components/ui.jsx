import React, { useState, useMemo } from "react";
import { X, Search, ChevronLeft, ChevronRight, Inbox, ShieldAlert, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { STATUS_META } from "../i18n";
import { useApp } from "../context/AppContext";

const TONE = {
  blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30",
  yellow: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30",
  red: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30",
  gray: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

export function StatusBadge({ status, className = "" }) {
  const { lang } = useApp();
  const meta = STATUS_META[status] || { es: status, en: status, tone: "gray" };
  return (
    <span data-testid={`badge-${status}`} className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap ${TONE[meta.tone]} ${className}`}>
      {lang === "en" ? meta.en : meta.es}
    </span>
  );
}

export function KpiCard({ label, value, icon: Icon, tone = "gray", sub, onClick, testId }) {
  const toneBar = { blue: "bg-sky-500", green: "bg-emerald-500", yellow: "bg-amber-500", red: "bg-rose-500", gray: "bg-slate-400", navy: "bg-slate-900 dark:bg-sky-400" }[tone];
  return (
    <button data-testid={testId} onClick={onClick} className="card p-4 text-left relative overflow-hidden hover:border-sky-400 dark:hover:border-sky-600 transition-colors duration-200 w-full">
      <span className={`absolute left-0 top-0 h-full w-1 ${toneBar}`} />
      <div className="flex items-start justify-between gap-2 pl-1.5">
        <div className="min-w-0">
          <p className="overline-label truncate">{label}</p>
          <p className="text-2xl font-heading font-bold mt-1 text-slate-900 dark:text-white">{value}</p>
          {sub && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{sub}</p>}
        </div>
        {Icon && <Icon size={18} className="text-slate-400 dark:text-slate-500 shrink-0 mt-1" />}
      </div>
    </button>
  );
}

export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative card w-full ${wide ? "max-w-3xl" : "max-w-lg"} max-h-[88vh] overflow-y-auto fade-up`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10 rounded-t-lg">
          <h3 className="font-heading font-semibold text-slate-900 dark:text-white">{title}</h3>
          <button data-testid="modal-close-button" onClick={onClose} className="btn-ghost"><X size={16} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Drawer({ open, onClose, title, children }) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div className={`absolute inset-0 bg-slate-900/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"} overflow-y-auto`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900">
          <h3 className="font-heading font-semibold">{title}</h3>
          <button data-testid="drawer-close-button" onClick={onClose} className="btn-ghost"><X size={16} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 flex gap-1 overflow-x-auto" role="tablist">
      {tabs.map((tab) => (
        <button key={tab.key} data-testid={`tab-${tab.key}`} onClick={() => onChange(tab.key)}
          className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors duration-200 ${active === tab.key ? "border-sky-500 text-sky-600 dark:text-sky-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function DataTable({ columns, rows, renderRow, searchKeys = [], filters = [], pageSize = 8, emptyTitle, emptyDesc, emptyAction, testId = "data-table" }) {
  const { t } = useApp();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [filterVals, setFilterVals] = useState({});

  const filtered = useMemo(() => {
    let r = rows;
    if (q) {
      const s = q.toLowerCase();
      r = r.filter((row) => searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(s)));
    }
    filters.forEach((f) => {
      const v = filterVals[f.key];
      if (v) r = r.filter((row) => String(f.get ? f.get(row) : row[f.key]) === v);
    });
    return r;
  }, [rows, q, filterVals, searchKeys, filters]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="card overflow-hidden" data-testid={testId}>
      {(searchKeys.length > 0 || filters.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-slate-200 dark:border-slate-800">
          {searchKeys.length > 0 && (
            <div className="relative flex-1 min-w-[180px] max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input data-testid={`${testId}-search`} value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder={t("buscar") + "..."} className="input pl-8" />
            </div>
          )}
          {filters.map((f) => (
            <select key={f.key} data-testid={`${testId}-filter-${f.key}`} className="input w-auto" value={filterVals[f.key] || ""}
              onChange={(e) => { setFilterVals((p) => ({ ...p, [f.key]: e.target.value })); setPage(0); }}>
              <option value="">{f.label} · {t("todos")}</option>
              {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ))}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
            <tr>{columns.map((c, i) => <th key={i} className="table-th">{c}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {pageRows.map(renderRow)}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState title={emptyTitle || t("sin_resultados")} desc={emptyDesc} action={emptyAction} />}
      </div>
      {filtered.length > pageSize && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <span>{filtered.length} registros</span>
          <div className="flex items-center gap-1">
            <button data-testid={`${testId}-prev-page`} className="btn-ghost" disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft size={14} /></button>
            <span className="px-2 font-semibold">{page + 1} / {pages}</span>
            <button data-testid={`${testId}-next-page`} className="btn-ghost" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}><ChevronRight size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

export function EmptyState({ title, desc, action, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center" data-testid="empty-state">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
        <Icon size={22} className="text-slate-400" />
      </div>
      <h4 className="font-heading font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
      {desc && <p className="text-sm text-slate-500 mt-1 max-w-xs">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Field({ label, required, children, hint }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
      {hint && <span className="text-[11px] text-slate-400 mt-0.5 block">{hint}</span>}
    </label>
  );
}

export function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-slate-500 dark:text-slate-400 shrink-0">{label}</span>
      <span className="font-medium text-right text-slate-800 dark:text-slate-200">{value ?? "—"}</span>
    </div>
  );
}

export function PageHeader({ title, subtitle, crumbs = [], actions }) {
  const nav = useNavigate();
  return (
    <div className="mb-5 fade-up">
      {crumbs.length > 0 && (
        <nav className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5 flex-wrap" data-testid="breadcrumbs">
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span>/</span>}
              {c.to ? <button className="hover:text-sky-600 transition-colors duration-200" onClick={() => nav(c.to)}>{c.label}</button> : <span className="text-slate-500 dark:text-slate-300 font-medium">{c.label}</span>}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
}

export function AccessDenied() {
  const nav = useNavigate();
  const { t } = useApp();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center fade-up" data-testid="access-denied">
      <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mb-4">
        <ShieldAlert size={28} className="text-rose-500" />
      </div>
      <h1 className="text-2xl font-heading font-bold">{t("acceso_denegado")}</h1>
      <p className="text-slate-500 mt-2">{t("acceso_denegado_msg")}</p>
      <button data-testid="back-to-dashboard-button" onClick={() => nav("/")} className="btn-primary mt-6"><ArrowLeft size={15} /> {t("volver_dashboard")}</button>
    </div>
  );
}

export function Skeleton({ className = "h-4 w-full" }) {
  return <div className={`skeleton ${className}`} />;
}
