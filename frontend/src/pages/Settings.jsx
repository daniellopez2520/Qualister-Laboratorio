import React, { useState } from "react";
import { Building2, FileType2, FlaskConical, Wallet, Bell, Lock, Save } from "lucide-react";
import { useApp } from "../context/AppContext";
import { PageHeader, Tabs, Field, InfoRow } from "../components/ui";
import { LOGO } from "../components/Layout";

export default function Settings() {
  const { t, lang, settings } = useApp();
  const es = lang === "es";
  const [tab, setTab] = useState("empresa");
  const [saved, setSaved] = useState(false);

  const tabs = [
    { key: "empresa", label: es ? "Empresa" : "Company" }, { key: "documentos", label: t("documentos") },
    { key: "laboratorio", label: t("nav_laboratorio") }, { key: "finanzas", label: t("finanzas") },
    { key: "notificaciones", label: t("notificaciones") }, { key: "seguridad", label: es ? "Seguridad" : "Security" },
  ];

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 1500); };
  const ChipList = ({ items }) => (
    <div className="flex flex-wrap gap-2">{items.map((m) => <span key={m} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium">{m}</span>)}</div>
  );

  return (
    <>
      <PageHeader title={t("configuracion")} crumbs={[{ label: t("dashboard"), to: "/" }, { label: t("configuracion") }]}
        actions={<button data-testid="settings-save-button" className="btn-primary" onClick={save}><Save size={14} /> {saved ? "✓ " + (es ? "Guardado" : "Saved") : t("guardar")}</button>} />
      <div className="mb-4"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>
      <div className="fade-up max-w-3xl" key={tab}>
        {tab === "empresa" && (
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-4">
              <img src={LOGO} alt="logo" className="h-12 rounded bg-slate-900 p-1.5" />
              <button className="btn-secondary text-xs">{es ? "Cambiar logo" : "Change logo"}</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label={es ? "Nombre" : "Name"}><input data-testid="company-name-input" className="input" defaultValue={settings.company.name} /></Field>
              <Field label="RFC"><input className="input" defaultValue={settings.company.rfc} /></Field>
              <div className="md:col-span-2"><Field label={es ? "Dirección" : "Address"}><input className="input" defaultValue={settings.company.address} /></Field></div>
              <Field label={es ? "Teléfono" : "Phone"}><input className="input" defaultValue={settings.company.phone} /></Field>
              <Field label="Email"><input className="input" defaultValue={settings.company.email} /></Field>
            </div>
          </div>
        )}
        {tab === "documentos" && (
          <div className="card p-5 space-y-4">
            <p className="text-sm text-slate-500">{es ? "Formatos de numeración de documentos. La lógica real de asignación se implementará en la Fase 2." : "Document numbering formats. Real assignment logic will be implemented in Phase 2."}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label={es ? "Formato OT" : "WO format"}><input className="input font-mono" defaultValue={settings.formats.order} /></Field>
              <Field label={es ? "Formato certificado" : "Certificate format"}><input data-testid="cert-format-input" className="input font-mono" defaultValue={settings.formats.certificate} /></Field>
            </div>
            <div className="rounded-md bg-slate-50 dark:bg-slate-800 p-3 text-sm">
              <p className="overline-label mb-1">{es ? "Ejemplo" : "Example"}</p>
              <p className="font-mono font-semibold">QLM-CC-0258-2026</p>
            </div>
          </div>
        )}
        {tab === "laboratorio" && (
          <div className="card p-5 space-y-5">
            <div><p className="overline-label mb-2">{t("magnitud")}s</p><ChipList items={settings.magnitudes} /></div>
            <div><p className="overline-label mb-2">{es ? "Tipos de instrumento" : "Instrument types"}</p><ChipList items={settings.instrumentTypes} /></div>
            <div><p className="overline-label mb-2">{es ? "Tipos de servicio" : "Service types"}</p><ChipList items={settings.serviceTypes} /></div>
          </div>
        )}
        {tab === "finanzas" && (
          <div className="card p-5">
            <InfoRow label={es ? "Moneda" : "Currency"} value={settings.currency} />
            <InfoRow label={es ? "Impuestos" : "Taxes"} value={settings.tax} />
            <InfoRow label={es ? "Condiciones" : "Terms"} value={settings.terms} />
          </div>
        )}
        {tab === "notificaciones" && (
          <div className="card p-5 space-y-3">
            {[es ? "Alertas de vencimiento de patrones" : "Standard expiry alerts", es ? "Certificados pendientes de revisión" : "Certificates pending review", es ? "Facturas vencidas" : "Overdue invoices", es ? "Resumen semanal por email" : "Weekly email digest"].map((l, i) => (
              <label key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0 cursor-pointer">
                {l}
                <input type="checkbox" defaultChecked={i < 3} className="accent-sky-600 w-4 h-4" />
              </label>
            ))}
          </div>
        )}
        {tab === "seguridad" && (
          <div className="card p-5 space-y-4">
            <Field label={es ? "Tiempo de sesión (minutos)" : "Session timeout (minutes)"}><input type="number" className="input max-w-[140px]" defaultValue={60} /></Field>
            <Field label={es ? "Política de contraseñas" : "Password policy"}>
              <select className="input"><option>{es ? "Estándar (8+ caracteres)" : "Standard (8+ characters)"}</option><option>{es ? "Estricta (12+, símbolos)" : "Strict (12+, symbols)"}</option></select>
            </Field>
            <p className="text-xs text-slate-400 flex items-center gap-1.5"><Lock size={12} /> {es ? "La autenticación real se implementará en la Fase 2." : "Real authentication will be implemented in Phase 2."}</p>
          </div>
        )}
      </div>
    </>
  );
}
