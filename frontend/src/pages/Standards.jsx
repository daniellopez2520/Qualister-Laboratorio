import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Wrench, AlertTriangle, CalendarClock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { DataTable, StatusBadge, PageHeader, Tabs, InfoRow, KpiCard, EmptyState } from "../components/ui";
import { STATUS_META } from "../i18n";

function ExpiryBadge({ days, es }) {
  if (days <= 0) return <span className="text-[11px] font-bold text-rose-600">{es ? "VENCIDO" : "EXPIRED"}</span>;
  const tone = days <= 15 ? "text-rose-600" : days <= 30 ? "text-orange-500" : days <= 60 ? "text-amber-500" : days <= 90 ? "text-yellow-600" : "text-emerald-600";
  return <span className={`text-[11px] font-bold ${tone}`}>{days} {es ? "días" : "days"}</span>;
}

export function StandardsList() {
  const { t, lang, standards, role } = useApp();
  const nav = useNavigate();
  const es = lang === "es";
  const readonly = role === "tecnico";

  return (
    <>
      <PageHeader title={t("patrones")} crumbs={[{ label: t("dashboard"), to: "/" }, { label: t("patrones") }]}
        subtitle={readonly ? (es ? "Modo consulta" : "Read-only mode") : undefined}
        actions={!readonly && <button data-testid="new-standard-button" className="btn-primary"><Plus size={15} /> {es ? "Nuevo equipo" : "New equipment"}</button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <KpiCard testId="kpi-std-active" label={es ? "Equipos activos" : "Active equipment"} value={standards.filter((s) => !["fuera_servicio", "baja"].includes(s.status)).length} icon={Wrench} tone="green" />
        <KpiCard testId="kpi-std-expiring" label={es ? "Próximos a vencer" : "Expiring soon"} value={standards.filter((s) => s.daysToExpiry > 0 && s.daysToExpiry <= 60).length} icon={CalendarClock} tone="yellow" />
        <KpiCard testId="kpi-std-expired" label={es ? "Vencidos" : "Expired"} value={standards.filter((s) => s.daysToExpiry <= 0).length} icon={AlertTriangle} tone="red" />
        <KpiCard testId="kpi-std-oos" label={es ? "Fuera de servicio" : "Out of service"} value={standards.filter((s) => s.status === "fuera_servicio").length} tone="gray" />
      </div>
      <DataTable
        testId="standards-table"
        columns={["ID", es ? "Equipo" : "Equipment", t("fabricante"), t("modelo"), t("serie"), t("magnitud"), es ? "Última cal." : "Last cal.", es ? "Próxima cal." : "Next cal.", t("estado"), t("acciones")]}
        rows={standards}
        searchKeys={["id", "name", "model", "serial"]}
        filters={[
          { key: "magnitude", label: t("magnitud"), options: [...new Set(standards.map((s) => s.magnitude))].map((m) => ({ value: m, label: m })) },
          { key: "status", label: t("estado"), options: ["disponible", "en_uso", "en_calibracion", "mantenimiento", "fuera_servicio", "vencido", "baja"].map((s) => ({ value: s, label: STATUS_META[s][lang] })) },
        ]}
        pageSize={10}
        renderRow={(s) => (
          <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150">
            <td className="table-td font-semibold text-sky-700 dark:text-sky-400 cursor-pointer" onClick={() => nav(`/patrones/${s.id}`)}>{s.id}</td>
            <td className="table-td">{s.name}</td>
            <td className="table-td">{s.manufacturer}</td>
            <td className="table-td">{s.model}</td>
            <td className="table-td">{s.serial}</td>
            <td className="table-td">{s.magnitude}</td>
            <td className="table-td">{s.lastCal}</td>
            <td className="table-td">{s.nextCal} · <ExpiryBadge days={s.daysToExpiry} es={es} /></td>
            <td className="table-td"><StatusBadge status={s.status} /></td>
            <td className="table-td"><button data-testid={`view-standard-${s.id}`} className="btn-ghost" onClick={() => nav(`/patrones/${s.id}`)}>{t("ver")}</button></td>
          </tr>
        )}
      />
    </>
  );
}

export function StandardDetail() {
  const { id } = useParams();
  const { t, lang, standards, certificates } = useApp();
  const es = lang === "es";
  const [tab, setTab] = useState("info");
  const s = standards.find((x) => x.id === id);
  if (!s) return <EmptyState title={t("sin_resultados")} />;
  const pct = Math.max(0, Math.min(100, 100 - (s.daysToExpiry / 365) * 100));
  const usedIn = certificates.filter((c) => c.standardsUsed.includes(s.id)).slice(0, 6);

  const tabs = [
    { key: "info", label: es ? "Información" : "Information" }, { key: "cal", label: es ? "Calibraciones" : "Calibrations" },
    { key: "certs", label: t("certificados") }, { key: "mant", label: es ? "Mantenimiento" : "Maintenance" },
    { key: "hist", label: t("historial") }, { key: "servicios", label: es ? "Servicios donde fue utilizado" : "Services where used" },
  ];

  return (
    <>
      <PageHeader title={`${s.id} — ${s.name}`} subtitle={`${s.manufacturer} ${s.model} · ${t("serie")} ${s.serial}`}
        crumbs={[{ label: t("patrones"), to: "/patrones" }, { label: s.id }]}
        actions={<StatusBadge status={s.status} className="text-xs py-1 px-3" />} />
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <div className="card p-5 border-l-4 border-l-sky-500" data-testid="next-cal-card">
          <p className="overline-label">{es ? "Próxima calibración" : "Next calibration"}</p>
          <p className="text-3xl font-heading font-bold mt-1">{s.daysToExpiry > 0 ? `${s.daysToExpiry} ${es ? "días" : "days"}` : (es ? "VENCIDO" : "EXPIRED")}</p>
          <p className="text-xs text-slate-400 mt-0.5">{s.nextCal} · {s.externalProvider}</p>
          <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-3">
            <div className={`h-full rounded-full transition-[width] duration-500 ${s.daysToExpiry <= 0 ? "bg-rose-500" : s.daysToExpiry <= 30 ? "bg-orange-500" : s.daysToExpiry <= 90 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${s.daysToExpiry <= 0 ? 100 : pct}%` }} />
          </div>
        </div>
        <div className="card p-4 lg:col-span-2">
          <p className="font-heading font-semibold text-sm mb-2">{es ? "Ficha del patrón" : "Standard data"}</p>
          <div className="grid md:grid-cols-2 gap-x-8">
            <InfoRow label="ID interno" value={s.id} />
            <InfoRow label={t("magnitud")} value={s.magnitude} />
            <InfoRow label={es ? "Rango" : "Range"} value={s.range} />
            <InfoRow label={es ? "Ubicación" : "Location"} value={s.location} />
            <InfoRow label={es ? "Última calibración" : "Last calibration"} value={s.lastCal} />
            <InfoRow label={es ? "Proveedor de calibración" : "Calibration provider"} value={s.externalProvider} />
          </div>
        </div>
      </div>
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      <div className="mt-4 fade-up">
        {tab === "info" && <div className="card p-4 max-w-lg"><InfoRow label={t("estado")} value={<StatusBadge status={s.status} />} /><InfoRow label={es ? "Trazabilidad" : "Traceability"} value="CENAM / SI" /><InfoRow label={es ? "Incertidumbre" : "Uncertainty"} value="Según certificado vigente" /></div>}
        {tab === "cal" && (
          <div className="card p-5 max-w-md">
            <ol className="space-y-3 text-sm">
              {[["2025-07-10", s.externalProvider], ["2024-07-08", s.externalProvider], ["2023-07-05", "CENAM"]].map(([d, p], i) => (
                <li key={i} className="flex gap-3"><span className={`w-2 h-2 rounded-full mt-1.5 ${i === 0 ? "bg-sky-500" : "bg-slate-300"}`} /><div><p className="font-semibold">{d}</p><p className="text-xs text-slate-400">{p}</p></div></li>
              ))}
            </ol>
          </div>
        )}
        {tab === "certs" && <EmptyState title={es ? "Certificados externos del patrón" : "External certificates"} desc={es ? "Los PDF de calibración externa aparecerán aquí." : "External calibration PDFs will appear here."} action={<button className="btn-secondary"><Plus size={14} /> {es ? "Subir certificado" : "Upload certificate"}</button>} />}
        {tab === "mant" && <EmptyState title={es ? "Sin mantenimientos registrados" : "No maintenance records"} action={<button className="btn-secondary"><Plus size={14} /> {es ? "Registrar mantenimiento" : "Log maintenance"}</button>} />}
        {tab === "hist" && (
          <div className="card p-5 max-w-md">
            <ul className="space-y-3 text-sm">
              {[["2026-06-01", es ? "Cambio de ubicación a Rack A." : "Moved to Rack A."], ["2025-07-12", es ? "Calibración externa recibida." : "External calibration received."], ["2025-07-01", es ? "Enviado a calibración externa." : "Sent for external calibration."]].map(([d, e], i) => (
                <li key={i} className="flex gap-3"><span className="text-slate-400 text-xs w-20 shrink-0 mt-0.5">{d}</span><span>{e}</span></li>
              ))}
            </ul>
          </div>
        )}
        {tab === "servicios" && (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800"><tr><th className="table-th">{es ? "Certificado" : "Certificate"}</th><th className="table-th">{t("tecnico")}</th><th className="table-th">{t("fecha")}</th><th className="table-th">{t("estado")}</th></tr></thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {usedIn.map((c) => <tr key={c.id}><td className="table-td font-semibold text-sky-700 dark:text-sky-400">{c.id}</td><td className="table-td">{c.technician}</td><td className="table-td">{c.calDate}</td><td className="table-td"><StatusBadge status={c.status} /></td></tr>)}
              </tbody>
            </table>
            {usedIn.length === 0 && <EmptyState title={t("sin_resultados")} />}
          </div>
        )}
      </div>
    </>
  );
}
