import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList, Gauge, FileCheck2, AlertTriangle, Clock, PlusCircle, Search, ListTodo,
  Users2, Wrench, TrendingUp, Wallet, Receipt, PiggyBank, Percent, Activity, ShieldCheck, Timer,
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";
import { useApp } from "../context/AppContext";
import { KpiCard, StatusBadge, PageHeader } from "../components/ui";
import { money } from "../i18n";

const tooltipStyle = { fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" };

export function ChartCard({ title, children, h = 220 }) {
  return (
    <div className="card p-4">
      <p className="font-heading font-semibold text-sm mb-3">{title}</p>
      <div style={{ height: h }}>
        <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
      </div>
    </div>
  );
}

function TechDashboard() {
  const { t, lang, orders, certificates, clients } = useApp();
  const nav = useNavigate();
  const es = lang === "es";
  const mine = orders.filter((o) => o.technician === "Daniel Ramírez");
  const myCerts = certificates.filter((c) => c.technician === "Daniel Ramírez");
  const drafts = myCerts.filter((c) => ["borrador", "en_preparacion"].includes(c.status)).length;
  const inReview = myCerts.filter((c) => ["en_revision", "enviado_revision"].includes(c.status)).length;
  const rejected = myCerts.filter((c) => c.status === "rechazado").length;
  const cname = (id) => clients.find((c) => c.id === id)?.commercial || id;

  const quick = [
    { label: es ? "+ Nueva orden" : "+ New order", icon: PlusCircle, to: "/ordenes/nueva", id: "quick-new-order" },
    { label: es ? "+ Agregar instrumento" : "+ Add instrument", icon: Gauge, to: "/instrumentos?nuevo=1", id: "quick-add-instrument" },
    { label: es ? "Buscar certificado" : "Search certificate", icon: Search, to: "/certificados", id: "quick-search-cert" },
    { label: es ? "Mis pendientes" : "My pending items", icon: ListTodo, to: "/certificados?filtro=pendientes", id: "quick-my-pending" },
  ];

  return (
    <>
      <PageHeader title={es ? "Hola, Daniel 👋" : "Hello, Daniel 👋"} subtitle={es ? "Este es tu resumen de trabajo de hoy." : "Here is your work summary for today."} />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-5">
        <KpiCard testId="kpi-active-orders" label={es ? "Mis órdenes activas" : "My active orders"} value={mine.filter((o) => !["cerrada", "cancelada"].includes(o.status)).length} icon={ClipboardList} tone="blue" onClick={() => nav("/ordenes")} />
        <KpiCard testId="kpi-pending-instruments" label={es ? "Instrumentos pendientes" : "Pending instruments"} value={7} icon={Gauge} tone="yellow" onClick={() => nav("/instrumentos")} />
        <KpiCard testId="kpi-draft-certs" label={es ? "Certificados en borrador" : "Draft certificates"} value={drafts} icon={FileCheck2} tone="gray" onClick={() => nav("/certificados")} />
        <KpiCard testId="kpi-review-certs" label={es ? "En revisión" : "Under review"} value={inReview} icon={Clock} tone="blue" onClick={() => nav("/certificados")} />
        <KpiCard testId="kpi-rejected-certs" label={es ? "Rechazados" : "Rejected"} value={rejected} icon={AlertTriangle} tone="red" onClick={() => nav("/certificados")} />
        <KpiCard testId="kpi-due-soon" label={es ? "Próximos a vencer" : "Due soon"} value={4} icon={Timer} tone="yellow" onClick={() => nav("/ordenes")} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        <div className="lg:col-span-2 card p-4" data-testid="today-work-section">
          <p className="font-heading font-semibold mb-3">{es ? "Trabajo de hoy" : "Today's work"}</p>
          <div className="space-y-2">
            {mine.slice(0, 3).map((o) => (
              <button key={o.id} data-testid={`today-order-${o.id}`} onClick={() => nav(`/ordenes/${o.id}`)} className="w-full flex flex-wrap items-center gap-3 p-3 rounded-md border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 transition-colors duration-200 text-left">
                <span className="font-semibold text-sm text-sky-700 dark:text-sky-400">{o.id}</span>
                <span className="text-sm text-slate-500 flex-1">{cname(o.clientId)} · {o.instrumentIds.length} {es ? "instrumento(s)" : "instrument(s)"}</span>
                <span className="text-xs text-slate-400">{t("fecha_compromiso")}: {o.due}</span>
                <StatusBadge status={o.status} />
              </button>
            ))}
          </div>
        </div>
        <div className="card p-4" data-testid="pending-section">
          <p className="font-heading font-semibold mb-3">{es ? "Pendientes" : "Pending items"}</p>
          <ul className="space-y-2.5 text-sm">
            <li className="flex gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />{es ? "3 certificados requieren documentos." : "3 certificates require documents."}</li>
            <li className="flex gap-2"><span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />{es ? `${rejected} certificados fueron rechazados.` : `${rejected} certificates were rejected.`}</li>
            <li className="flex gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />{es ? "4 trabajos próximos a fecha compromiso." : "4 jobs close to due date."}</li>
          </ul>
          <p className="overline-label mt-5 mb-2">{es ? "Accesos rápidos" : "Quick actions"}</p>
          <div className="grid grid-cols-2 gap-2">
            {quick.map((qk) => (
              <button key={qk.id} data-testid={qk.id} onClick={() => nav(qk.to)} className="flex items-center gap-2 p-2.5 rounded-md border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200">
                <qk.icon size={14} className="text-sky-600 dark:text-sky-400 shrink-0" /> {qk.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden" data-testid="recent-orders-table">
        <p className="font-heading font-semibold p-4 pb-3">{es ? "Mis órdenes recientes" : "My recent orders"}</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800">
              <tr><th className="table-th">OT</th><th className="table-th">{t("cliente")}</th><th className="table-th">{t("instrumentos")}</th><th className="table-th">{t("fecha_compromiso")}</th><th className="table-th">{t("estado")}</th><th className="table-th">{t("acciones")}</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mine.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150">
                  <td className="table-td font-semibold text-sky-700 dark:text-sky-400">{o.id}</td>
                  <td className="table-td">{cname(o.clientId)}</td>
                  <td className="table-td">{o.instrumentIds.length}</td>
                  <td className="table-td">{o.due}</td>
                  <td className="table-td"><StatusBadge status={o.status} /></td>
                  <td className="table-td"><button data-testid={`view-order-${o.id}`} className="btn-ghost" onClick={() => nav(`/ordenes/${o.id}`)}>{t("ver")}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ChiefDashboard() {
  const { t, lang, certificates, orders, charts, standards, clients, instruments } = useApp();
  const nav = useNavigate();
  const es = lang === "es";
  const pending = certificates.filter((c) => ["en_revision", "enviado_revision"].includes(c.status));
  const expSoon = standards.filter((s) => s.daysToExpiry > 0 && s.daysToExpiry <= 60).length;
  const expired = standards.filter((s) => s.daysToExpiry <= 0).length;
  const cname = (id) => clients.find((c) => c.id === id)?.commercial || id;
  const iname = (id) => instruments.find((i) => i.id === id)?.name || id;

  return (
    <>
      <PageHeader title={es ? "Panel del Jefe de Laboratorio" : "Lab Manager Dashboard"} subtitle={es ? "Supervisión de revisiones, técnicos y patrones." : "Oversight of reviews, technicians and standards."} />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-5">
        <KpiCard testId="kpi-pending-review" label={es ? "Pendientes de revisión" : "Pending review"} value={pending.length} icon={FileCheck2} tone="blue" onClick={() => nav("/certificados?filtro=revision")} />
        <KpiCard testId="kpi-active-orders" label={es ? "Órdenes activas" : "Active orders"} value={orders.filter((o) => !["cerrada", "cancelada"].includes(o.status)).length} icon={ClipboardList} tone="blue" onClick={() => nav("/ordenes")} />
        <KpiCard testId="kpi-late-orders" label={es ? "Órdenes atrasadas" : "Overdue orders"} value={2} icon={AlertTriangle} tone="red" onClick={() => nav("/ordenes")} />
        <KpiCard testId="kpi-techs-working" label={es ? "Técnicos trabajando" : "Technicians working"} value={4} icon={Users2} tone="gray" />
        <KpiCard testId="kpi-standards-expiring" label={es ? "Patrones por vencer" : "Standards expiring"} value={expSoon} icon={Wrench} tone="yellow" onClick={() => nav("/patrones")} />
        <KpiCard testId="kpi-standards-expired" label={es ? "Patrones vencidos" : "Standards expired"} value={expired} icon={AlertTriangle} tone="red" onClick={() => nav("/patrones")} />
      </div>

      <div className="card overflow-hidden mb-5 border-l-4 border-l-sky-500" data-testid="pending-review-table">
        <div className="flex items-center justify-between p-4 pb-3">
          <p className="font-heading font-semibold">{es ? "Pendientes de revisión" : "Awaiting review"}</p>
          <button className="btn-secondary text-xs" data-testid="view-all-reviews" onClick={() => nav("/certificados")}>{es ? "Ver todos" : "View all"}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800">
              <tr><th className="table-th">{es ? "Certificado" : "Certificate"}</th><th className="table-th">{t("cliente")}</th><th className="table-th">{es ? "Instrumento" : "Instrument"}</th><th className="table-th">{t("tecnico")}</th><th className="table-th">{es ? "Enviado" : "Sent"}</th><th className="table-th">{es ? "Esperando" : "Waiting"}</th><th className="table-th">{t("prioridad")}</th><th className="table-th">{t("acciones")}</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pending.slice(0, 5).map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150">
                  <td className="table-td font-semibold text-sky-700 dark:text-sky-400">{c.id}</td>
                  <td className="table-td">{cname(c.clientId)}</td>
                  <td className="table-td">{iname(c.instrumentId)}</td>
                  <td className="table-td">{c.technician}</td>
                  <td className="table-td">{c.sentDate}</td>
                  <td className="table-td">{c.waiting}</td>
                  <td className="table-td"><StatusBadge status={c.priority === "baja" ? "baja_p" : c.priority} /></td>
                  <td className="table-td"><button data-testid={`review-cert-${c.id}`} className="btn-primary text-xs px-3 py-1.5" onClick={() => nav(`/certificados/${c.id}/revision`)}>{es ? "Revisar" : "Review"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">
        <ChartCard title={es ? "Servicios por mes" : "Services per month"}>
          <BarChart data={charts.servicesPerMonth}><XAxis dataKey="m" fontSize={11} /><YAxis fontSize={11} width={28} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="v" name={es ? "Servicios" : "Services"} fill="#0284C7" radius={[4, 4, 0, 0]} /></BarChart>
        </ChartCard>
        <ChartCard title={es ? "Órdenes por estado" : "Orders by state"}>
          <PieChart><Pie data={charts.ordersByState} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>{charts.ordersByState.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} /><Legend wrapperStyle={{ fontSize: 11 }} /></PieChart>
        </ChartCard>
        <ChartCard title={es ? "Servicios por magnitud" : "Services by magnitude"}>
          <PieChart><Pie data={charts.servicesByMagnitude} dataKey="value" nameKey="name" outerRadius={70}>{charts.servicesByMagnitude.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} /><Legend wrapperStyle={{ fontSize: 11 }} /></PieChart>
        </ChartCard>
        <ChartCard title={es ? "Carga de trabajo por técnico" : "Workload per technician"}>
          <BarChart data={charts.techWorkload}><XAxis dataKey="tech" fontSize={11} /><YAxis fontSize={11} width={28} /><Tooltip contentStyle={tooltipStyle} /><Legend wrapperStyle={{ fontSize: 11 }} /><Bar dataKey="activas" name={es ? "Activas" : "Active"} fill="#0284C7" radius={[4, 4, 0, 0]} /><Bar dataKey="cerradas" name={es ? "Cerradas" : "Closed"} fill="#CBD5E1" radius={[4, 4, 0, 0]} /></BarChart>
        </ChartCard>
        <ChartCard title={es ? "Tiempo promedio de entrega (días)" : "Average delivery time (days)"}>
          <LineChart data={charts.deliveryTime}><XAxis dataKey="m" fontSize={11} /><YAxis fontSize={11} width={28} /><Tooltip contentStyle={tooltipStyle} /><Line type="monotone" dataKey="d" name={es ? "Días" : "Days"} stroke="#0F172A" strokeWidth={2} dot={{ r: 3 }} /></LineChart>
        </ChartCard>
        <div className="card p-4" data-testid="lab-alerts">
          <p className="font-heading font-semibold text-sm mb-3 flex items-center gap-2"><AlertTriangle size={15} className="text-amber-500" /> {es ? "Alertas del laboratorio" : "Lab alerts"}</p>
          <ul className="space-y-2.5 text-sm">
            <li className="flex gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />{es ? "Patrón PTR-007 vence en 15 días." : "Standard PTR-007 expires in 15 days."}</li>
            <li className="flex gap-2"><span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />{es ? "OT QLM-OT-2026-0146 atrasada." : "WO QLM-OT-2026-0146 overdue."}</li>
            <li className="flex gap-2"><span className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0" />{es ? `${pending.length} certificados esperando revisión.` : `${pending.length} certificates awaiting review.`}</li>
            <li className="flex gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />{es ? "Procedimiento QLM-P-TEM-05 próximo a revisión." : "Procedure QLM-P-TEM-05 due for review."}</li>
          </ul>
        </div>
      </div>
    </>
  );
}

function FinanceDashboard() {
  const { t, lang, invoices, charts, clients } = useApp();
  const nav = useNavigate();
  const es = lang === "es";
  const receivable = invoices.reduce((a, f) => a + f.balance, 0);
  const overdue = invoices.filter((f) => f.status === "vencida");
  const cname = (id) => clients.find((c) => c.id === id)?.commercial || id;

  return (
    <>
      <PageHeader title={es ? "Panel de Finanzas" : "Finance Dashboard"} subtitle={es ? "Facturación, cobranza y salud financiera." : "Billing, collections and financial health."} />
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3 mb-5">
        <KpiCard testId="kpi-month-billing" label={es ? "Facturación del mes" : "Billing this month"} value={money(187400)} icon={Receipt} tone="navy" />
        <KpiCard testId="kpi-month-collected" label={es ? "Cobrado este mes" : "Collected this month"} value={money(152300)} icon={Wallet} tone="green" />
        <KpiCard testId="kpi-receivable" label={es ? "Cuentas por cobrar" : "Accounts receivable"} value={money(receivable)} icon={PiggyBank} tone="yellow" onClick={() => nav("/finanzas?tab=cobranza")} />
        <KpiCard testId="kpi-overdue-invoices" label={es ? "Facturas vencidas" : "Overdue invoices"} value={overdue.length} icon={AlertTriangle} tone="red" onClick={() => nav("/finanzas?tab=facturas")} />
        <KpiCard testId="kpi-open-quotes" label={es ? "Cotizaciones abiertas" : "Open quotes"} value={4} icon={ClipboardList} tone="blue" onClick={() => nav("/finanzas?tab=cotizaciones")} />
        <KpiCard testId="kpi-month-expenses" label={es ? "Gastos del mes" : "Expenses this month"} value={money(72880)} icon={TrendingUp} tone="gray" onClick={() => nav("/finanzas?tab=gastos")} />
        <KpiCard testId="kpi-margin" label={es ? "Margen estimado" : "Estimated margin"} value="61%" icon={Percent} tone="green" />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <ChartCard title={es ? "Facturación vs cobranza mensual" : "Monthly billing vs collections"}>
          <BarChart data={charts.monthlyBilling}><XAxis dataKey="m" fontSize={11} /><YAxis fontSize={11} width={52} tickFormatter={(v) => "$" + v / 1000 + "k"} /><Tooltip contentStyle={tooltipStyle} formatter={(v) => money(v)} /><Legend wrapperStyle={{ fontSize: 11 }} /><Bar dataKey="fact" name={es ? "Facturado" : "Billed"} fill="#0F172A" radius={[4, 4, 0, 0]} /><Bar dataKey="cob" name={es ? "Cobrado" : "Collected"} fill="#38BDF8" radius={[4, 4, 0, 0]} /></BarChart>
        </ChartCard>
        <ChartCard title={es ? "Ingresos vs gastos" : "Income vs expenses"}>
          <AreaChart data={charts.incomeVsExpenses}><XAxis dataKey="m" fontSize={11} /><YAxis fontSize={11} width={52} tickFormatter={(v) => "$" + v / 1000 + "k"} /><Tooltip contentStyle={tooltipStyle} formatter={(v) => money(v)} /><Legend wrapperStyle={{ fontSize: 11 }} /><Area type="monotone" dataKey="ing" name={es ? "Ingresos" : "Income"} stroke="#0284C7" fill="#0284C7" fillOpacity={0.15} strokeWidth={2} /><Area type="monotone" dataKey="gas" name={es ? "Gastos" : "Expenses"} stroke="#E11D48" fill="#E11D48" fillOpacity={0.08} strokeWidth={2} /></AreaChart>
        </ChartCard>
        <ChartCard title={es ? "Ventas por cliente" : "Sales by client"}>
          <BarChart data={charts.salesByClient} layout="vertical"><XAxis type="number" fontSize={11} tickFormatter={(v) => "$" + v / 1000 + "k"} /><YAxis type="category" dataKey="name" fontSize={11} width={90} /><Tooltip contentStyle={tooltipStyle} formatter={(v) => money(v)} /><Bar dataKey="value" name={es ? "Ventas" : "Sales"} fill="#0284C7" radius={[0, 4, 4, 0]} /></BarChart>
        </ChartCard>
        <div className="card p-4" data-testid="aging-section">
          <p className="font-heading font-semibold text-sm mb-4">{es ? "Antigüedad de saldos (aging)" : "Receivables aging"}</p>
          {charts.aging.map((b) => {
            const max = Math.max(...charts.aging.map((x) => x.value));
            return (
              <div key={b.bucket} className="mb-3">
                <div className="flex justify-between text-xs mb-1"><span className="font-semibold">{b.bucket} {es ? "días" : "days"}</span><span>{money(b.value)}</span></div>
                <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${(b.value / max) * 100}%`, background: b.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card overflow-hidden" data-testid="receivable-table">
        <p className="font-heading font-semibold p-4 pb-3">{es ? "Cuentas por cobrar" : "Accounts receivable"}</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800">
              <tr><th className="table-th">{t("cliente")}</th><th className="table-th">{es ? "Factura" : "Invoice"}</th><th className="table-th">{t("fecha")}</th><th className="table-th">{es ? "Vencimiento" : "Due"}</th><th className="table-th">{t("total")}</th><th className="table-th">{t("saldo")}</th><th className="table-th">{t("estado")}</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoices.filter((f) => f.balance > 0).map((f) => (
                <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors duration-150" onClick={() => nav("/finanzas?tab=facturas")}>
                  <td className="table-td">{cname(f.clientId)}</td>
                  <td className="table-td font-semibold">{f.id}</td>
                  <td className="table-td">{f.date}</td>
                  <td className="table-td">{f.due}</td>
                  <td className="table-td">{money(f.total)}</td>
                  <td className="table-td font-semibold">{money(f.balance)}</td>
                  <td className="table-td"><StatusBadge status={f.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function AdminDashboard() {
  const { lang, certificates, orders, invoices, charts, standards, usersList } = useApp();
  const nav = useNavigate();
  const es = lang === "es";
  const Section = ({ title, icon: Icon, children }) => (
    <div className="mb-5">
      <p className="overline-label mb-2 flex items-center gap-1.5"><Icon size={13} /> {title}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{children}</div>
    </div>
  );
  return (
    <>
      <PageHeader title={es ? "Panel Ejecutivo" : "Executive Dashboard"} subtitle={es ? "Visión general de toda la empresa." : "Company-wide overview."} />
      <Section title={es ? "Operación" : "Operations"} icon={ClipboardList}>
        <KpiCard testId="kpi-open-orders" label={es ? "Órdenes abiertas" : "Open orders"} value={orders.filter((o) => !["cerrada", "cancelada"].includes(o.status)).length} tone="blue" onClick={() => nav("/ordenes")} />
        <KpiCard testId="kpi-active-services" label={es ? "Servicios activos" : "Active services"} value={18} tone="blue" />
        <KpiCard testId="kpi-done-services" label={es ? "Servicios terminados" : "Completed services"} value={44} tone="green" />
        <KpiCard testId="kpi-issued-certs" label={es ? "Certificados emitidos" : "Certificates issued"} value={certificates.filter((c) => c.status === "liberado").length} tone="green" onClick={() => nav("/certificados")} />
      </Section>
      <Section title={es ? "Laboratorio" : "Laboratory"} icon={ShieldCheck}>
        <KpiCard testId="kpi-pending-reviews" label={es ? "Revisiones pendientes" : "Pending reviews"} value={certificates.filter((c) => ["en_revision", "enviado_revision"].includes(c.status)).length} tone="blue" onClick={() => nav("/certificados")} />
        <KpiCard testId="kpi-expiring-standards" label={es ? "Patrones por vencer" : "Standards expiring"} value={standards.filter((s) => s.daysToExpiry > 0 && s.daysToExpiry <= 60).length} tone="yellow" onClick={() => nav("/patrones")} />
        <KpiCard testId="kpi-late-jobs" label={es ? "Trabajos atrasados" : "Overdue jobs"} value={2} tone="red" onClick={() => nav("/ordenes")} />
        <KpiCard testId="kpi-productivity" label={es ? "Productividad" : "Productivity"} value="92%" tone="green" />
      </Section>
      <Section title={es ? "Finanzas" : "Finance"} icon={Wallet}>
        <KpiCard testId="kpi-billing" label={es ? "Facturación (jun)" : "Billing (Jun)"} value={money(187400)} tone="navy" onClick={() => nav("/finanzas")} />
        <KpiCard testId="kpi-collections" label={es ? "Cobranza (jun)" : "Collections (Jun)"} value={money(152300)} tone="green" onClick={() => nav("/finanzas")} />
        <KpiCard testId="kpi-receivable-admin" label={es ? "Por cobrar" : "Receivable"} value={money(invoices.reduce((a, f) => a + f.balance, 0))} tone="yellow" onClick={() => nav("/finanzas")} />
        <KpiCard testId="kpi-margin-admin" label={es ? "Margen" : "Margin"} value="61%" tone="green" />
      </Section>
      <Section title={es ? "Sistema" : "System"} icon={Activity}>
        <KpiCard testId="kpi-active-users" label={es ? "Usuarios activos" : "Active users"} value={usersList.filter((u) => u.status === "activo").length} tone="gray" onClick={() => nav("/usuarios")} />
        <KpiCard testId="kpi-last-access" label={es ? "Último acceso" : "Last access"} value="09:15" sub="Miguel Ortega" tone="gray" onClick={() => nav("/auditoria")} />
        <KpiCard testId="kpi-recent-events" label={es ? "Eventos recientes" : "Recent events"} value={12} tone="gray" onClick={() => nav("/auditoria")} />
        <KpiCard testId="kpi-alerts" label={es ? "Alertas" : "Alerts"} value={6} tone="red" />
      </Section>
      <div className="grid md:grid-cols-2 gap-4">
        <ChartCard title={es ? "Servicios por mes" : "Services per month"}>
          <BarChart data={charts.servicesPerMonth}><XAxis dataKey="m" fontSize={11} /><YAxis fontSize={11} width={28} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="v" name={es ? "Servicios" : "Services"} fill="#0F172A" radius={[4, 4, 0, 0]} /></BarChart>
        </ChartCard>
        <ChartCard title={es ? "Ingresos vs gastos" : "Income vs expenses"}>
          <AreaChart data={charts.incomeVsExpenses}><XAxis dataKey="m" fontSize={11} /><YAxis fontSize={11} width={52} tickFormatter={(v) => "$" + v / 1000 + "k"} /><Tooltip contentStyle={tooltipStyle} formatter={(v) => money(v)} /><Area type="monotone" dataKey="ing" name={es ? "Ingresos" : "Income"} stroke="#0284C7" fill="#0284C7" fillOpacity={0.15} strokeWidth={2} /><Area type="monotone" dataKey="gas" name={es ? "Gastos" : "Expenses"} stroke="#E11D48" fill="#E11D48" fillOpacity={0.08} strokeWidth={2} /></AreaChart>
        </ChartCard>
      </div>
    </>
  );
}

export default function Dashboard() {
  const { role } = useApp();
  if (role === "tecnico") return <TechDashboard />;
  if (role === "jefe") return <ChiefDashboard />;
  if (role === "finanzas") return <FinanceDashboard />;
  return <AdminDashboard />;
}
