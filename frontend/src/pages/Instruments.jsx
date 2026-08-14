import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Plus, Gauge, Camera } from "lucide-react";
import { useApp } from "../context/AppContext";
import { DataTable, StatusBadge, PageHeader, Tabs, InfoRow, Field, EmptyState, Modal } from "../components/ui";

export function InstrumentsList() {
  const { t, lang, instruments, clients, addInstrument } = useApp();
  const nav = useNavigate();
  const es = lang === "es";
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(params.get("nuevo") === "1");
  const [form, setForm] = useState({ name: "", manufacturer: "", model: "", serial: "", clientId: "CL-001", magnitude: "RF", clientCode: "", range: "", resolution: "" });
  const cname = (id) => clients.find((c) => c.id === id)?.commercial || id;
  const rows = instruments.map((i) => ({ ...i, clientName: cname(i.clientId) }));
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <>
      <PageHeader title={t("instrumentos")} crumbs={[{ label: t("dashboard"), to: "/" }, { label: t("instrumentos") }]}
        actions={<button data-testid="new-instrument-button" className="btn-primary" onClick={() => setOpen(true)}><Plus size={15} /> {es ? "Agregar instrumento" : "Add instrument"}</button>} />
      <DataTable
        testId="instruments-table"
        columns={[es ? "Instrumento" : "Instrument", t("cliente"), t("fabricante"), t("modelo"), t("serie"), "ID cliente", t("magnitud"), es ? "Última calibración" : "Last calibration", es ? "Último certificado" : "Last certificate", t("estado"), t("acciones")]}
        rows={rows}
        searchKeys={["name", "serial", "model", "clientCode", "clientName", "lastCert"]}
        filters={[
          { key: "magnitude", label: t("magnitud"), options: ["RF", "Frecuencia", "Tiempo", "Eléctrica", "Temperatura"].map((m) => ({ value: m, label: m })) },
          { key: "clientName", label: t("cliente"), options: clients.map((c) => ({ value: c.commercial, label: c.commercial })) },
        ]}
        pageSize={10}
        renderRow={(i) => (
          <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150">
            <td className="table-td font-semibold cursor-pointer text-sky-700 dark:text-sky-400" onClick={() => nav(`/instrumentos/${i.id}`)}>{i.name}</td>
            <td className="table-td">{i.clientName}</td>
            <td className="table-td">{i.manufacturer}</td>
            <td className="table-td">{i.model}</td>
            <td className="table-td">{i.serial}</td>
            <td className="table-td">{i.clientCode}</td>
            <td className="table-td">{i.magnitude}</td>
            <td className="table-td">{i.lastCal}</td>
            <td className="table-td">{i.lastCert}</td>
            <td className="table-td"><StatusBadge status={i.status} /></td>
            <td className="table-td"><button data-testid={`view-instrument-${i.id}`} className="btn-ghost" onClick={() => nav(`/instrumentos/${i.id}`)}>{t("ver")}</button></td>
          </tr>
        )}
      />
      <Modal open={open} onClose={() => { setOpen(false); setParams({}); }} title={es ? "Agregar instrumento" : "Add instrument"}>
        <form onSubmit={(e) => { e.preventDefault(); addInstrument(form); setOpen(false); setParams({}); }} className="grid grid-cols-2 gap-3" data-testid="new-instrument-form">
          <Field label={es ? "Instrumento" : "Instrument"} required><input data-testid="instrument-name-input" className="input" required value={form.name} onChange={set("name")} /></Field>
          <Field label={t("cliente")} required><select className="input" value={form.clientId} onChange={set("clientId")}>{clients.map((c) => <option key={c.id} value={c.id}>{c.commercial}</option>)}</select></Field>
          <Field label={t("fabricante")}><input className="input" value={form.manufacturer} onChange={set("manufacturer")} /></Field>
          <Field label={t("modelo")}><input className="input" value={form.model} onChange={set("model")} /></Field>
          <Field label={t("serie")} required><input data-testid="instrument-serial-input" className="input" required value={form.serial} onChange={set("serial")} /></Field>
          <Field label="ID cliente"><input className="input" value={form.clientCode} onChange={set("clientCode")} /></Field>
          <Field label={t("magnitud")}><select className="input" value={form.magnitude} onChange={set("magnitude")}>{["RF", "Frecuencia", "Tiempo", "Eléctrica", "Temperatura"].map((m) => <option key={m}>{m}</option>)}</select></Field>
          <Field label={es ? "Rango" : "Range"}><input className="input" value={form.range} onChange={set("range")} /></Field>
          <div className="col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" className="btn-secondary" onClick={() => { setOpen(false); setParams({}); }}>{t("cancelar")}</button>
            <button data-testid="save-instrument-button" type="submit" className="btn-primary">{t("guardar")}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function InstrumentDetail() {
  const { id } = useParams();
  const { t, lang, instruments, clients, certificates, orders } = useApp();
  const nav = useNavigate();
  const es = lang === "es";
  const [tab, setTab] = useState("info");
  const i = instruments.find((x) => x.id === id);
  if (!i) return <EmptyState title={t("sin_resultados")} />;
  const client = clients.find((c) => c.id === i.clientId);
  const iCerts = certificates.filter((c) => c.instrumentId === i.id);
  const iOrders = orders.filter((o) => o.instrumentIds.includes(i.id));

  const calHistory = [
    { year: "2026", cert: i.lastCert, date: i.lastCal, tech: "Daniel Ramírez" },
    { year: "2025", cert: i.lastCert.replace("2026", "2025").replace(/-0(\d+)-/, "-0185-"), date: "2025-06-20", tech: "Juan Pérez" },
    { year: "2024", cert: i.lastCert.replace("2026", "2024").replace(/-0(\d+)-/, "-0094-"), date: "2024-06-18", tech: "Ana Torres" },
  ];

  const tabs = [
    { key: "info", label: es ? "Información" : "Information" },
    { key: "historial", label: es ? "Historial de calibraciones" : "Calibration history" },
    { key: "certificados", label: t("certificados") },
    { key: "ordenes", label: es ? "Órdenes" : "Orders" },
    { key: "documentos", label: t("documentos") },
  ];

  return (
    <>
      <PageHeader title={`${i.name} — ${i.model}`} subtitle={`${i.manufacturer} · ${t("serie")} ${i.serial}`}
        crumbs={[{ label: t("instrumentos"), to: "/instrumentos" }, { label: i.id }]}
        actions={<StatusBadge status={i.status} className="text-xs" />} />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      <div className="mt-4 fade-up">
        {tab === "info" && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card p-4 flex flex-col items-center justify-center min-h-[200px] border-dashed">
              <Camera size={28} className="text-slate-300 mb-2" />
              <p className="text-xs text-slate-400">{es ? "Foto opcional del instrumento" : "Optional instrument photo"}</p>
              <button className="btn-secondary text-xs mt-3" data-testid="upload-photo-button"><Plus size={12} /> {es ? "Subir foto" : "Upload photo"}</button>
            </div>
            <div className="card p-4 md:col-span-2">
              <p className="font-heading font-semibold text-sm mb-2">{es ? "Ficha técnica" : "Technical data"}</p>
              <div className="grid md:grid-cols-2 gap-x-8">
                <InfoRow label={t("cliente")} value={client?.commercial} />
                <InfoRow label={t("fabricante")} value={i.manufacturer} />
                <InfoRow label={t("modelo")} value={i.model} />
                <InfoRow label={t("serie")} value={i.serial} />
                <InfoRow label="ID cliente" value={i.clientCode} />
                <InfoRow label={t("magnitud")} value={i.magnitude} />
                <InfoRow label={es ? "Rango" : "Range"} value={i.range} />
                <InfoRow label={es ? "Resolución" : "Resolution"} value={i.resolution} />
              </div>
            </div>
          </div>
        )}
        {tab === "historial" && (
          <div className="card p-6 max-w-lg" data-testid="calibration-timeline">
            <p className="font-heading font-semibold text-sm mb-5">{es ? "Trazabilidad de calibraciones" : "Calibration traceability"}</p>
            <ol className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3">
              {calHistory.map((h, idx) => (
                <li key={idx} className="ml-5 pb-6 last:pb-0 relative">
                  <span className={`absolute -left-[27px] top-0.5 w-4 h-4 rounded-full border-2 ${idx === 0 ? "bg-sky-500 border-sky-500" : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"}`} />
                  <p className="font-heading font-bold text-lg leading-none">{h.year}</p>
                  <button className="text-sky-600 dark:text-sky-400 font-semibold text-sm hover:underline mt-1" onClick={() => idx === 0 && nav(`/certificados/${h.cert}`)}>{h.cert}</button>
                  <p className="text-xs text-slate-400 mt-0.5">{h.date} · {h.tech}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
        {tab === "certificados" && (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800"><tr><th className="table-th">{es ? "Certificado" : "Certificate"}</th><th className="table-th">{t("fecha")}</th><th className="table-th">{t("tecnico")}</th><th className="table-th">{t("estado")}</th></tr></thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {iCerts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer" onClick={() => nav(`/certificados/${c.id}`)}>
                    <td className="table-td font-semibold text-sky-700 dark:text-sky-400">{c.id}</td><td className="table-td">{c.calDate}</td><td className="table-td">{c.technician}</td><td className="table-td"><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {iCerts.length === 0 && <EmptyState title={t("sin_resultados")} />}
          </div>
        )}
        {tab === "ordenes" && (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800"><tr><th className="table-th">OT</th><th className="table-th">{t("tecnico")}</th><th className="table-th">{t("fecha_compromiso")}</th><th className="table-th">{t("estado")}</th></tr></thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {iOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer" onClick={() => nav(`/ordenes/${o.id}`)}>
                    <td className="table-td font-semibold text-sky-700 dark:text-sky-400">{o.id}</td><td className="table-td">{o.technician}</td><td className="table-td">{o.due}</td><td className="table-td"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {iOrders.length === 0 && <EmptyState title={t("sin_resultados")} />}
          </div>
        )}
        {tab === "documentos" && <EmptyState title={es ? "Sin documentos" : "No documents"} desc={es ? "Manuales, fotos y anexos del instrumento aparecerán aquí." : "Manuals, photos and attachments will appear here."} action={<button className="btn-secondary"><Plus size={14} /> {es ? "Subir documento" : "Upload document"}</button>} />}
      </div>
    </>
  );
}
