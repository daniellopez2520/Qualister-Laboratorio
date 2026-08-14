import React, { useState } from "react";
import { FileBarChart2, Download, Printer, Play, FlaskConical, Wallet } from "lucide-react";
import { useApp } from "../context/AppContext";
import { PageHeader, Field, Skeleton } from "../components/ui";

const REPORTS = {
  lab: [
    ["certificados", "Certificados emitidos", "Issued certificates"],
    ["ordenes", "Órdenes de trabajo", "Work orders"],
    ["tecnicos", "Productividad por técnico", "Technician productivity"],
    ["magnitudes", "Servicios por magnitud", "Services by magnitude"],
    ["tiempos", "Tiempos de entrega", "Delivery times"],
    ["patrones", "Estado de equipos patrón", "Standards status"],
  ],
  fin: [
    ["ventas", "Ventas", "Sales"],
    ["facturacion", "Facturación", "Billing"],
    ["cobranza", "Cobranza", "Collections"],
    ["gastos", "Gastos", "Expenses"],
    ["clientes", "Análisis por cliente", "Client analysis"],
    ["rentabilidad", "Rentabilidad", "Profitability"],
  ],
};

export default function Reports() {
  const { t, lang, role, clients } = useApp();
  const es = lang === "es";
  const [sel, setSel] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const showLab = ["jefe", "admin"].includes(role);
  const showFin = ["finanzas", "admin"].includes(role);

  const generate = () => {
    setGenerating(true); setGenerated(false);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1200);
  };

  const Group = ({ title, icon: Icon, items }) => (
    <div className="card p-4">
      <p className="font-heading font-semibold mb-3 flex items-center gap-2"><Icon size={16} className="text-sky-600" /> {title}</p>
      <div className="grid grid-cols-2 gap-2">
        {items.map(([key, esL, enL]) => (
          <button key={key} data-testid={`report-${key}`} onClick={() => { setSel(key); setGenerated(false); }}
            className={`p-3 rounded-md border text-left text-sm font-semibold transition-colors duration-200 ${sel === key ? "border-sky-500 bg-sky-50 dark:bg-sky-500/10" : "border-slate-200 dark:border-slate-800 hover:border-slate-300"}`}>
            {es ? esL : enL}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title={es ? "Centro de Reportes" : "Reports Center"} crumbs={[{ label: t("dashboard"), to: "/" }, { label: t("reportes") }]} />
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {showLab && <Group title={t("nav_laboratorio")} icon={FlaskConical} items={REPORTS.lab} />}
          {showFin && <Group title={t("finanzas")} icon={Wallet} items={REPORTS.fin} />}
        </div>
        <div className="card p-4 h-fit sticky top-20" data-testid="report-filters">
          <p className="font-heading font-semibold mb-3 flex items-center gap-2"><FileBarChart2 size={16} className="text-sky-600" /> {t("filtros")}</p>
          <div className="space-y-3">
            <Field label={es ? "Periodo" : "Period"}><select className="input"><option>{es ? "Este mes" : "This month"}</option><option>{es ? "Último trimestre" : "Last quarter"}</option><option>2026</option><option>{es ? "Personalizado" : "Custom"}</option></select></Field>
            <Field label={t("cliente")}><select className="input"><option>{t("todos")}</option>{clients.map((c) => <option key={c.id}>{c.commercial}</option>)}</select></Field>
            <Field label={t("tecnico")}><select className="input"><option>{t("todos")}</option><option>Daniel Ramírez</option><option>Juan Pérez</option><option>Ana Torres</option><option>Pedro Sánchez</option></select></Field>
            <Field label={t("magnitud")}><select className="input"><option>{t("todos")}</option><option>RF</option><option>Frecuencia</option><option>Tiempo</option><option>Eléctrica</option><option>Temperatura</option></select></Field>
            <Field label={t("estado")}><select className="input"><option>{t("todos")}</option></select></Field>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <button data-testid="generate-report-button" className="btn-primary justify-center" disabled={!sel || generating} onClick={generate}><Play size={14} /> {generating ? (es ? "Generando…" : "Generating…") : (es ? "Generar" : "Generate")}</button>
            <div className="grid grid-cols-2 gap-2">
              <button data-testid="export-report-button" className="btn-secondary justify-center text-xs" disabled={!generated}><Download size={13} /> {es ? "Exportar" : "Export"}</button>
              <button data-testid="print-report-button" className="btn-secondary justify-center text-xs" disabled={!generated}><Printer size={13} /> {es ? "Imprimir" : "Print"}</button>
            </div>
          </div>
          {generating && <div className="mt-4 space-y-2"><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-4/5" /><Skeleton className="h-3 w-3/5" /></div>}
          {generated && <p className="mt-4 p-2.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold" data-testid="report-generated-message">✓ {es ? "Reporte generado (datos ficticios de demostración)." : "Report generated (demo mock data)."}</p>}
        </div>
      </div>
    </>
  );
}
