import React, { useState, useMemo, useRef, useEffect } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Users2, ClipboardList, Gauge, FileCheck2, Wrench, BookOpenText, ShieldCheck,
  Wallet, BarChart3, UserCog, ScrollText, Settings, Search, Bell, ChevronDown, Sun, Moon,
  Menu, X, LogOut, Languages, CircleUserRound, Eye,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { ROLE_LABELS } from "../i18n";

export const LOGO = "https://customer-assets-agu9un31.emergentagent.net/job_metrologia-lab-ui/artifacts/rv6f4lg3_logo%20qlm.png";

export const NAV = [
  { group: "nav_operacion", items: [
    { key: "dashboard", to: "/", icon: LayoutDashboard, roles: ["tecnico", "jefe", "finanzas", "admin"] },
    { key: "clientes", to: "/clientes", icon: Users2, roles: ["tecnico", "jefe", "finanzas", "admin"] },
    { key: "ordenes", to: "/ordenes", icon: ClipboardList, roles: ["tecnico", "jefe", "admin"] },
    { key: "instrumentos", to: "/instrumentos", icon: Gauge, roles: ["tecnico", "jefe", "admin"] },
    { key: "certificados", to: "/certificados", icon: FileCheck2, roles: ["tecnico", "jefe", "admin"] },
  ]},
  { group: "nav_laboratorio", items: [
    { key: "patrones", to: "/patrones", icon: Wrench, roles: ["tecnico", "jefe", "admin"], readonlyFor: ["tecnico"] },
    { key: "procedimientos", to: "/procedimientos", icon: BookOpenText, roles: ["tecnico", "jefe", "admin"], readonlyFor: ["tecnico"] },
    { key: "calidad", to: "/calidad", icon: ShieldCheck, roles: ["jefe", "admin"] },
  ]},
  { group: "nav_administracion", items: [
    { key: "finanzas", to: "/finanzas", icon: Wallet, roles: ["finanzas", "admin"] },
    { key: "reportes", to: "/reportes", icon: BarChart3, roles: ["jefe", "finanzas", "admin"] },
  ]},
  { group: "nav_sistema", items: [
    { key: "usuarios", to: "/usuarios", icon: UserCog, roles: ["admin"] },
    { key: "auditoria", to: "/auditoria", icon: ScrollText, roles: ["admin"] },
    { key: "configuracion", to: "/configuracion", icon: Settings, roles: ["admin"] },
  ]},
];

export const CURRENT_USER = {
  tecnico: { name: "Daniel Ramírez", initials: "DR" },
  jefe: { name: "Carlos López", initials: "CL" },
  finanzas: { name: "Laura García", initials: "LG" },
  admin: { name: "Miguel Ortega", initials: "MO" },
};

function useClickOutside(ref, cb) {
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) cb(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, cb]);
}

function GlobalSearch() {
  const { t, certificates, orders, clients, instruments, lang } = useApp();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  const results = useMemo(() => {
    if (q.length < 2) return null;
    const s = q.toLowerCase();
    return {
      certs: certificates.filter((c) => c.id.toLowerCase().includes(s)).slice(0, 4),
      ords: orders.filter((o) => o.id.toLowerCase().includes(s)).slice(0, 4),
      cls: clients.filter((c) => c.name.toLowerCase().includes(s) || c.commercial.toLowerCase().includes(s)).slice(0, 4),
      ins: instruments.filter((i) => i.serial.toLowerCase().includes(s) || i.model.toLowerCase().includes(s) || i.name.toLowerCase().includes(s)).slice(0, 4),
    };
  }, [q, certificates, orders, clients, instruments]);

  const go = (to) => { setOpen(false); setQ(""); nav(to); };
  const Group = ({ title, children }) => <div className="py-1"><p className="overline-label px-3 py-1">{title}</p>{children}</div>;
  const Item = ({ onClick, children }) => (
    <button onClick={onClick} className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150">{children}</button>
  );

  return (
    <div ref={ref} className="relative flex-1 max-w-lg hidden sm:block">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input data-testid="global-search-input" value={q} onFocus={() => setOpen(true)}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        placeholder={t("search_global")} className="input pl-9 bg-slate-50 dark:bg-slate-800" />
      {open && results && (
        <div data-testid="global-search-results" className="absolute top-full mt-1.5 w-full card shadow-lg z-50 max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {results.certs.length > 0 && <Group title={t("certificados")}>{results.certs.map((c) => <Item key={c.id} onClick={() => go(`/certificados/${c.id}`)}><span className="font-semibold">{c.id}</span></Item>)}</Group>}
          {results.ords.length > 0 && <Group title={t("ordenes")}>{results.ords.map((o) => <Item key={o.id} onClick={() => go(`/ordenes/${o.id}`)}><span className="font-semibold">{o.id}</span></Item>)}</Group>}
          {results.cls.length > 0 && <Group title={t("clientes")}>{results.cls.map((c) => <Item key={c.id} onClick={() => go(`/clientes/${c.id}`)}>{c.name}</Item>)}</Group>}
          {results.ins.length > 0 && <Group title={t("instrumentos")}>{results.ins.map((i) => <Item key={i.id} onClick={() => go(`/instrumentos/${i.id}`)}>{i.manufacturer} {i.model} — {lang === "en" ? "Serial" : "Serie"} {i.serial}</Item>)}</Group>}
          {!results.certs.length && !results.ords.length && !results.cls.length && !results.ins.length && (
            <p className="px-3 py-3 text-sm text-slate-500">{t("sin_resultados")}</p>
          )}
        </div>
      )}
    </div>
  );
}

const NOTIF_DOT = { red: "bg-rose-500", yellow: "bg-amber-500", blue: "bg-sky-500", green: "bg-emerald-500" };

function NotifBell() {
  const { t, notifs, lang, dismissNotif } = useApp();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));
  return (
    <div ref={ref} className="relative">
      <button data-testid="notifications-bell" onClick={() => setOpen(!open)} className="relative p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200">
        <Bell size={18} className="text-slate-600 dark:text-slate-300" />
        {notifs.length > 0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">{notifs.length}</span>}
      </button>
      {open && (
        <div data-testid="notifications-dropdown" className="absolute right-0 top-full mt-1.5 w-80 card shadow-lg z-50 overflow-hidden">
          <p className="px-4 py-3 font-heading font-semibold text-sm border-b border-slate-200 dark:border-slate-800">{t("notificaciones")}</p>
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {notifs.map((n) => (
              <div key={n.id} className="flex items-start gap-2.5 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors duration-150 group">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${NOTIF_DOT[n.tone]}`} />
                <button className="text-left flex-1" onClick={() => { setOpen(false); nav(n.link); }}>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{lang === "en" ? n.en : n.es}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{n.time}</p>
                </button>
                <button data-testid={`dismiss-notif-${n.id}`} onClick={() => dismissNotif(n.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 transition-opacity duration-150"><X size={13} /></button>
              </div>
            ))}
            {notifs.length === 0 && <p className="px-4 py-6 text-sm text-slate-400 text-center">{t("sin_resultados")}</p>}
          </div>
          <button data-testid="view-all-notifications" onClick={() => setOpen(false)} className="w-full px-4 py-2.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-200 dark:border-slate-800 transition-colors duration-150">
            {t("ver_todas")}
          </button>
        </div>
      )}
    </div>
  );
}

function ProfileMenu() {
  const { t, role, setRole, lang, setLang, dark, toggleDark } = useApp();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));
  const user = CURRENT_USER[role];
  return (
    <div ref={ref} className="relative">
      <button data-testid="profile-menu-button" onClick={() => setOpen(!open)} className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200">
        <span className="w-8 h-8 rounded-full bg-slate-900 dark:bg-sky-600 text-white text-xs font-bold flex items-center justify-center">{user.initials}</span>
        <span className="hidden md:block text-left">
          <span className="block text-sm font-semibold leading-tight">{user.name}</span>
          <span className="block text-[11px] text-slate-400 leading-tight">{ROLE_LABELS[role][lang]}</span>
        </span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>
      {open && (
        <div data-testid="profile-dropdown" className="absolute right-0 top-full mt-1.5 w-64 card shadow-lg z-50 overflow-hidden py-1">
          <p className="overline-label px-4 pt-2 pb-1">{t("cambiar_rol")}</p>
          {Object.keys(ROLE_LABELS).map((r) => (
            <button key={r} data-testid={`role-switch-${r}`} onClick={() => { setRole(r); setOpen(false); nav("/"); }}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150 ${role === r ? "text-sky-600 dark:text-sky-400 font-semibold" : ""}`}>
              <CircleUserRound size={15} /> {ROLE_LABELS[r][lang]}
            </button>
          ))}
          <div className="border-t border-slate-200 dark:border-slate-800 mt-1 pt-1">
            <button data-testid="toggle-language" onClick={() => { setLang(lang === "es" ? "en" : "es"); setOpen(false); }} className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150">
              <Languages size={15} /> {t("idioma")}: {lang === "es" ? "Español → English" : "English → Español"}
            </button>
            <button data-testid="toggle-theme" onClick={() => { toggleDark(); setOpen(false); }} className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150">
              {dark ? <Sun size={15} /> : <Moon size={15} />} {dark ? t("modo_claro") : t("modo_oscuro")}
            </button>
            <button data-testid="logout-button" onClick={() => { setRole(null); nav("/login"); }} className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors duration-150">
              <LogOut size={15} /> {t("logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const { t, role, lang } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      <div className={`flex items-center gap-2 px-4 h-16 border-b border-slate-800 shrink-0 ${collapsed ? "justify-center px-2" : ""}`}>
        <img src={LOGO} alt="Qualister" className={collapsed ? "h-8 object-contain" : "h-9 object-contain"} />
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV.map((g) => {
          const items = g.items.filter((it) => it.roles.includes(role));
          if (!items.length) return null;
          return (
            <div key={g.group}>
              {!collapsed && <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{t(g.group)}</p>}
              {items.map((it) => (
                <NavLink key={it.key} to={it.to} end={it.to === "/"} data-testid={`nav-${it.key}`}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium mb-0.5 border-l-2 transition-colors duration-200 ${isActive ? "bg-slate-800 text-white border-sky-400" : "border-transparent hover:bg-slate-800/60 hover:text-white"} ${collapsed ? "justify-center px-2" : ""}`}
                  title={t(it.key)}>
                  <it.icon size={17} className="shrink-0" />
                  {!collapsed && <span className="flex-1 truncate">{t(it.key)}</span>}
                  {!collapsed && it.readonlyFor?.includes(role) && <Eye size={12} className="text-slate-500" title={lang === "en" ? "Read only" : "Solo consulta"} />}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>
      <div className="p-3 border-t border-slate-800 text-[10px] text-slate-500 shrink-0">
        {!collapsed && <p>Qualister LIMS · v0.1 · {lang === "en" ? "Prototype" : "Prototipo"} Fase 1</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <aside className={`hidden lg:block shrink-0 transition-[width] duration-300 ${collapsed ? "w-16" : "w-60"} sticky top-0 h-screen`} data-testid="sidebar">
        {sidebar}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64">{sidebar}</aside>
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 px-4 sticky top-0 z-40" data-testid="header">
          <button data-testid="sidebar-toggle" className="btn-ghost" onClick={() => (window.innerWidth >= 1024 ? setCollapsed(!collapsed) : setMobileOpen(true))}><Menu size={18} /></button>
          <GlobalSearch />
          <div className="flex-1" />
          <NotifBell />
          <ProfileMenu />
        </header>
        <main className="flex-1 p-4 md:p-6 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
