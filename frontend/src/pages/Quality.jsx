import React, { useState } from "react";
import { Plus, ShieldAlert, ClipboardX, ListChecks, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { DataTable, StatusBadge, PageHeader, KpiCard, Field, Modal } from "../components/ui";

export default function Quality() {
  const { t, lang, nonconformities } = useApp();
  const es = lang === "es";
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(null);
  const [saved, setSaved] = useState(false);

  return (
    <>
      <PageHeader title={t("calidad")} crumbs={[{ label: t("dashboard"), to: "/" }, { label: t("calidad") }]}
        actions={<button data-testid="new-incident-button" className="btn-primary" onClick={() => { setSaved(false); setOpen(true); }}><Plus size={15} /> {es ? "Nueva incidencia" : "New incident"}</button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <KpiCard testId="kpi-open-incidents" label={es ? "Incidencias abiertas" : "Open incidents"} value={nonconformities.filter((n) => n.status === "abierta").length} icon={ShieldAlert} tone="red" />
        <KpiCard testId="kpi-ncw" label={es ? "Trabajo no conforme" : "Nonconforming work"} value={nonconformities.filter((n) => n.type === "Trabajo no conforme").length} icon={ClipboardX} tone="yellow" />
        <KpiCard testId="kpi-pending-actions" label={es ? "Acciones pendientes" : "Pending actions"} value={nonconformities.filter((n) => n.status === "en_proceso").length} icon={ListChecks} tone="blue" />
        <KpiCard testId="kpi-closed-month" label={es ? "Cerradas este mes" : "Closed this month"} value={nonconformities.filter((n) => n.status === "cerrada").length} icon={CheckCircle2} tone="green" />
      </div>
      <DataTable
        testId="quality-table"
        columns={["Folio", es ? "Tipo" : "Type", "OT", es ? "Instrumento" : "Instrument", es ? "Detectado por" : "Detected by", es ? "Responsable" : "Responsible", t("fecha_compromiso"), t("estado")]}
        rows={nonconformities}
        searchKeys={["folio", "type", "orderId"]}
        renderRow={(n) => (
          <tr key={n.folio} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors duration-150" onClick={() => setSel(n)}>
            <td className="table-td font-semibold text-sky-700 dark:text-sky-400">{n.folio}</td>
            <td className="table-td">{n.type}</td>
            <td className="table-td">{n.orderId}</td>
            <td className="table-td">{n.instrumentId}</td>
            <td className="table-td">{n.detectedBy}</td>
            <td className="table-td">{n.responsible}</td>
            <td className="table-td">{n.due}</td>
            <td className="table-td"><StatusBadge status={n.status} /></td>
          </tr>
        )}
      />

      <Modal open={!!sel} onClose={() => setSel(null)} title={sel?.folio}>
        {sel && (
          <div className="space-y-2 text-sm" data-testid="incident-detail-modal">
            <p><span className="text-slate-500">{es ? "Tipo:" : "Type:"}</span> <span className="font-semibold">{sel.type}</span> · <StatusBadge status={sel.status} /></p>
            <p><span className="text-slate-500">{es ? "Descripción:" : "Description:"}</span> {sel.description}</p>
            <p><span className="text-slate-500">{es ? "Impacto:" : "Impact:"}</span> {sel.impact}</p>
            <p><span className="text-slate-500">{es ? "Acción inmediata:" : "Immediate action:"}</span> {sel.action}</p>
            <p><span className="text-slate-500">{es ? "Responsable:" : "Responsible:"}</span> {sel.responsible} · <span className="text-slate-500">{t("fecha_compromiso")}:</span> {sel.due}</p>
          </div>
        )}
      </Modal>

      <Modal open={open} onClose={() => setOpen(false)} title={es ? "Nueva incidencia" : "New incident"} wide>
        {saved ? (
          <p className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold text-sm" data-testid="incident-saved-message">✓ {es ? "Incidencia registrada (demo)." : "Incident recorded (demo)."}</p>
        ) : (
          <form data-testid="incident-form" className="grid md:grid-cols-2 gap-3" onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setOpen(false), 900); }}>
            <div className="md:col-span-2"><Field label={es ? "Descripción" : "Description"} required><textarea data-testid="incident-description" className="input" rows={2} required /></Field></div>
            <Field label={es ? "Tipo" : "Type"}><select className="input"><option>Trabajo no conforme</option><option>Incidencia</option><option>Queja de cliente</option></select></Field>
            <Field label="OT"><input className="input" placeholder="QLM-OT-2026-…" /></Field>
            <Field label={es ? "Instrumento" : "Instrument"}><input className="input" /></Field>
            <Field label={es ? "Impacto" : "Impact"}><select className="input"><option>{es ? "Bajo" : "Low"}</option><option>{es ? "Medio" : "Medium"}</option><option>{es ? "Alto" : "High"}</option></select></Field>
            <div className="md:col-span-2"><Field label={es ? "Acción inmediata" : "Immediate action"}><input className="input" /></Field></div>
            <Field label={es ? "Responsable" : "Responsible"}><select className="input"><option>Daniel Ramírez</option><option>Juan Pérez</option><option>Ana Torres</option><option>Carlos López</option></select></Field>
            <Field label={t("fecha_compromiso")}><input type="date" className="input" /></Field>
            <div className="md:col-span-2"><Field label={es ? "Observaciones" : "Notes"}><textarea className="input" rows={2} /></Field></div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>{t("cancelar")}</button>
              <button data-testid="save-incident-button" type="submit" className="btn-primary">{t("guardar")}</button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
