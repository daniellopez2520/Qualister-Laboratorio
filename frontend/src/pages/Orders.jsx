import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Pencil, FolderOpen, MoreHorizontal, Check, ChevronRight, ChevronLeft, Gauge, FileCheck2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { DataTable, StatusBadge, PageHeader, Tabs, InfoRow, Field, EmptyState } from "../components/ui";
import Timeline from "../components/Timeline";
import { STATUS_META, money } from "../i18n";

const ORDER_STATES = ["borrador", "recibida", "pendiente_asignacion", "en_proceso", "pendiente_info", "en_revision", "correccion", "aprobada", "pendiente_facturacion", "lista_entrega", "cerrada", "cancelada"];

export function OrdersList() {
  const { t, lang, orders, clients } = useApp();
  const nav = useNavigate();
  const es = lang === "es";
  const cname = (id) => clients.find((c) => c.id === id)?.commercial || id;
  const rows = orders.map((o) => ({ ...o, clientName: cname(o.clientId) }));

  return (
    <>
      <PageHeader title={t("ordenes")} crumbs={[{ label: t("dashboard"), to: "/" }, { label: t("ordenes") }]}
        actions={<button data-testid="new-order-button" className="btn-primary" onClick={() => nav("/ordenes/nueva")}><Plus size={15} /> {es ? "Nueva orden" : "New order"}</button>} />
      <DataTable
        testId="orders-table"
        columns={["OT", t("cliente"), t("instrumentos"), t("tecnico"), t("fecha_recepcion"), t("fecha_compromiso"), t("prioridad"), t("estado"), t("acciones")]}
        rows={rows}
        searchKeys={["id", "clientName", "technician"]}
        filters={[
          { key: "clientName", label: t("cliente"), options: clients.map((c) => ({ value: c.commercial, label: c.commercial })) },
          { key: "technician", label: t("tecnico"), options: [...new Set(orders.map((o) => o.technician))].map((v) => ({ value: v, label: v })) },
          { key: "status", label: t("estado"), options: ORDER_STATES.map((s) => ({ value: s, label: STATUS_META[s][lang] })) },
          { key: "priority", label: t("prioridad"), options: ["urgente", "alta", "normal", "baja"].map((p) => ({ value: p, label: STATUS_META[p === "baja" ? "baja_p" : p][lang] })) },
        ]}
        renderRow={(o) => (
          <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150">
            <td className="table-td font-semibold text-sky-700 dark:text-sky-400 cursor-pointer" onClick={() => nav(`/ordenes/${o.id}`)}>{o.id}</td>
            <td className="table-td">{o.clientName}</td>
            <td className="table-td text-center">{o.instrumentIds.length}</td>
            <td className="table-td">{o.technician}</td>
            <td className="table-td">{o.received}</td>
            <td className="table-td">{o.due}</td>
            <td className="table-td"><StatusBadge status={o.priority === "baja" ? "baja_p" : o.priority} /></td>
            <td className="table-td"><StatusBadge status={o.status} /></td>
            <td className="table-td"><button data-testid={`view-order-${o.id}`} className="btn-ghost" onClick={() => nav(`/ordenes/${o.id}`)}>{t("ver")}</button></td>
          </tr>
        )}
      />
    </>
  );
}

export function OrderDetail() {
  const { id } = useParams();
  const { t, lang, orders, clients, instruments, certificates } = useApp();
  const nav = useNavigate();
  const es = lang === "es";
  const [tab, setTab] = useState("resumen");
  const o = orders.find((x) => x.id === id);
  if (!o) return <EmptyState title={t("sin_resultados")} />;
  const client = clients.find((c) => c.id === o.clientId);
  const oIns = instruments.filter((i) => o.instrumentIds.includes(i.id));

  const tabs = [
    { key: "resumen", label: t("resumen") }, { key: "instrumentos", label: t("instrumentos") },
    { key: "documentos", label: t("documentos") }, { key: "finanzas", label: t("finanzas") },
    { key: "actividad", label: t("actividad") + " / " + t("historial") },
  ];

  return (
    <>
      <PageHeader title={o.id} crumbs={[{ label: t("ordenes"), to: "/ordenes" }, { label: o.id }]}
        subtitle={`${t("cliente")}: ${client?.commercial}`}
        actions={<>
          <button data-testid="order-edit-button" className="btn-secondary"><Pencil size={14} /> {t("editar")}</button>
          <button data-testid="order-add-instrument" className="btn-secondary"><Plus size={14} /> {es ? "Agregar instrumento" : "Add instrument"}</button>
          <button data-testid="order-documents" className="btn-secondary"><FolderOpen size={14} /> {t("documentos")}</button>
          <button data-testid="order-more-actions" className="btn-ghost"><MoreHorizontal size={16} /></button>
        </>} />

      <div className="card p-4 mb-4 grid grid-cols-2 md:grid-cols-5 gap-4" data-testid="order-summary-bar">
        <div><p className="overline-label">{t("estado")}</p><StatusBadge status={o.status} className="mt-1" /></div>
        <div><p className="overline-label">{t("fecha_recepcion")}</p><p className="font-semibold text-sm mt-1">{o.received}</p></div>
        <div><p className="overline-label">{t("fecha_compromiso")}</p><p className="font-semibold text-sm mt-1">{o.due}</p></div>
        <div><p className="overline-label">{t("tecnico")}</p><p className="font-semibold text-sm mt-1">{o.technician}</p></div>
        <div><p className="overline-label">{t("prioridad")}</p><StatusBadge status={o.priority === "baja" ? "baja_p" : o.priority} className="mt-1" /></div>
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      <div className="mt-4 fade-up">
        {tab === "resumen" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-4">
              <p className="font-heading font-semibold text-sm mb-2">{es ? "Información de la orden" : "Order information"}</p>
              <InfoRow label={es ? "Tipo de servicio" : "Service type"} value={o.serviceType} />
              <InfoRow label={es ? "Lugar del servicio" : "Service location"} value={o.location} />
              <InfoRow label={es ? "Cotización" : "Quote"} value={o.quoteId} />
              <InfoRow label={es ? "Jefe responsable" : "Responsible manager"} value={o.chief} />
              <InfoRow label={es ? "Observaciones" : "Notes"} value={o.notes || "—"} />
            </div>
            <div className="card p-4">
              <p className="font-heading font-semibold text-sm mb-2">{t("cliente")}</p>
              <InfoRow label={es ? "Razón social" : "Legal name"} value={client?.name} />
              <InfoRow label={es ? "Contacto" : "Contact"} value={client?.contact} />
              <InfoRow label="Email" value={client?.email} />
              <InfoRow label={es ? "Teléfono" : "Phone"} value={client?.phone} />
            </div>
          </div>
        )}
        {tab === "instrumentos" && (
          <div className="grid md:grid-cols-2 gap-3">
            {oIns.map((i) => {
              const cert = certificates.find((c) => c.instrumentId === i.id);
              return (
                <div key={i.id} className="card p-4" data-testid={`order-instrument-${i.id}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><Gauge size={17} className="text-sky-600" /></span>
                      <div><p className="font-heading font-semibold">{i.name}</p><p className="text-xs text-slate-500">{i.manufacturer}</p></div>
                    </div>
                    {cert && <StatusBadge status={cert.status} />}
                  </div>
                  <div className="mt-3 text-sm grid grid-cols-2 gap-x-4">
                    <InfoRow label={t("modelo")} value={i.model} /><InfoRow label={t("serie")} value={i.serial} />
                    <InfoRow label={es ? "Certificado" : "Certificate"} value={cert?.id || "—"} /><InfoRow label={t("magnitud")} value={i.magnitude} />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button data-testid={`instrument-view-${i.id}`} className="btn-secondary text-xs" onClick={() => nav(`/instrumentos/${i.id}`)}>{t("ver")}</button>
                    <button className="btn-secondary text-xs"><Pencil size={12} /> {t("editar")}</button>
                    {cert && <button data-testid={`instrument-cert-${i.id}`} className="btn-primary text-xs" onClick={() => nav(`/certificados/${cert.id}`)}><FileCheck2 size={12} /> {es ? "Certificado" : "Certificate"}</button>}
                  </div>
                </div>
              );
            })}
            <button className="card p-4 border-dashed flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-sky-600 hover:border-sky-400 transition-colors duration-200 min-h-[120px]" data-testid="add-instrument-card">
              <Plus size={16} /> {es ? "Agregar instrumento" : "Add instrument"}
            </button>
          </div>
        )}
        {tab === "documentos" && <EmptyState title={es ? "Sin documentos adjuntos" : "No attached documents"} desc={es ? "Los documentos de la orden aparecerán aquí." : "Order documents will appear here."} action={<button className="btn-secondary"><Plus size={14} /> {es ? "Subir documento" : "Upload document"}</button>} />}
        {tab === "finanzas" && (
          <div className="card p-4 max-w-md">
            <p className="font-heading font-semibold text-sm mb-2">{t("finanzas")}</p>
            <InfoRow label={es ? "Cotización" : "Quote"} value={o.quoteId} />
            <InfoRow label={es ? "Importe estimado" : "Estimated amount"} value={money(14800)} />
            <InfoRow label={es ? "Estado de facturación" : "Billing status"} value={es ? "Pendiente de facturación" : "Pending invoicing"} />
          </div>
        )}
        {tab === "actividad" && (
          <div className="card p-5 max-w-xl">
            <Timeline items={[
              { date: o.received + " 09:00", event: "cert_created", user: o.technician },
              { date: o.received + " 10:15", event: "in_prep", user: o.technician },
              { date: o.received + " 12:30", event: "pdf1_uploaded", user: o.technician },
            ]} />
          </div>
        )}
      </div>
    </>
  );
}

export function NewOrderWizard() {
  const { t, lang, clients, instruments, addOrder } = useApp();
  const nav = useNavigate();
  const es = lang === "es";
  const [step, setStep] = useState(0);
  const [clientId, setClientId] = useState("");
  const [info, setInfo] = useState({ received: "2026-06-14", due: "2026-06-28", serviceType: "Calibración en laboratorio", location: "Laboratorio Qualister", priority: "normal", quoteId: "", notes: "" });
  const [selIns, setSelIns] = useState([]);
  const [assign, setAssign] = useState({ technician: "Daniel Ramírez", chief: "Carlos López" });
  const [created, setCreated] = useState(null);

  const steps = [es ? "Cliente" : "Client", es ? "Información" : "Information", t("instrumentos"), es ? "Asignación" : "Assignment", t("resumen")];
  const client = clients.find((c) => c.id === clientId);
  const clientIns = instruments.filter((i) => i.clientId === clientId);
  const setI = (k) => (e) => setInfo((p) => ({ ...p, [k]: e.target.value }));
  const canNext = step === 0 ? !!clientId : step === 2 ? selIns.length > 0 : true;

  const create = () => {
    const id = addOrder({ clientId, instrumentIds: selIns, ...info, ...assign });
    setCreated(id);
    setTimeout(() => nav(`/ordenes/${id}`), 1200);
  };

  return (
    <>
      <PageHeader title={es ? "Nueva orden de trabajo" : "New work order"} crumbs={[{ label: t("ordenes"), to: "/ordenes" }, { label: es ? "Nueva" : "New" }]} />
      <div className="flex items-center gap-0 mb-6 overflow-x-auto" data-testid="wizard-steps">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className={`h-px w-8 md:w-14 shrink-0 ${i <= step ? "bg-sky-500" : "bg-slate-200 dark:bg-slate-700"}`} />}
            <div className="flex items-center gap-2 shrink-0">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${i < step ? "bg-emerald-500 text-white" : i === step ? "bg-sky-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>
                {i < step ? <Check size={13} /> : i + 1}
              </span>
              <span className={`text-xs font-semibold hidden md:block ${i === step ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>{s}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="card p-5 max-w-3xl fade-up" key={step}>
        {step === 0 && (
          <>
            <p className="font-heading font-semibold mb-4">{es ? "Selecciona el cliente" : "Select client"}</p>
            <div className="grid md:grid-cols-2 gap-2 mb-4">
              {clients.map((c) => (
                <button key={c.id} data-testid={`wizard-client-${c.id}`} onClick={() => setClientId(c.id)}
                  className={`p-3 rounded-md border text-left transition-colors duration-200 ${clientId === c.id ? "border-sky-500 bg-sky-50 dark:bg-sky-500/10" : "border-slate-200 dark:border-slate-800 hover:border-slate-300"}`}>
                  <p className="font-semibold text-sm">{c.commercial}</p>
                  <p className="text-xs text-slate-500">{c.city} · {c.rfc}</p>
                </button>
              ))}
            </div>
            <button className="btn-secondary text-xs" onClick={() => nav("/clientes/nuevo")}><Plus size={13} /> {es ? "Crear cliente" : "Create client"}</button>
          </>
        )}
        {step === 1 && (
          <>
            <p className="font-heading font-semibold mb-4">{es ? "Información de la orden" : "Order information"}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label={t("fecha_recepcion")} required><input data-testid="wizard-received-date" type="date" className="input" value={info.received} onChange={setI("received")} /></Field>
              <Field label={t("fecha_compromiso")} required><input data-testid="wizard-due-date" type="date" className="input" value={info.due} onChange={setI("due")} /></Field>
              <Field label={es ? "Tipo de servicio" : "Service type"}><select className="input" value={info.serviceType} onChange={setI("serviceType")}><option>Calibración en laboratorio</option><option>Calibración en sitio</option><option>Verificación</option><option>Ajuste</option></select></Field>
              <Field label={es ? "Lugar del servicio" : "Service location"}><input className="input" value={info.location} onChange={setI("location")} /></Field>
              <Field label={t("prioridad")}><select data-testid="wizard-priority" className="input" value={info.priority} onChange={setI("priority")}><option value="urgente">{es ? "Urgente" : "Urgent"}</option><option value="alta">{es ? "Alta" : "High"}</option><option value="normal">Normal</option><option value="baja">{es ? "Baja" : "Low"}</option></select></Field>
              <Field label={es ? "Cotización" : "Quote"}><input className="input" placeholder="QLM-COT-2026-…" value={info.quoteId} onChange={setI("quoteId")} /></Field>
              <div className="md:col-span-2"><Field label={es ? "Observaciones" : "Notes"}><textarea className="input" rows={2} value={info.notes} onChange={setI("notes")} /></Field></div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <p className="font-heading font-semibold mb-1">{es ? "Instrumentos del cliente" : "Client instruments"}</p>
            <p className="text-xs text-slate-500 mb-4">{es ? "Selecciona uno o varios instrumentos." : "Select one or more instruments."}</p>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {clientIns.map((i) => (
                <label key={i.id} data-testid={`wizard-instrument-${i.id}`} className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors duration-200 ${selIns.includes(i.id) ? "border-sky-500 bg-sky-50 dark:bg-sky-500/10" : "border-slate-200 dark:border-slate-800"}`}>
                  <input type="checkbox" className="accent-sky-600" checked={selIns.includes(i.id)} onChange={(e) => setSelIns((p) => e.target.checked ? [...p, i.id] : p.filter((x) => x !== i.id))} />
                  <div className="flex-1"><p className="font-semibold text-sm">{i.name} — {i.model}</p><p className="text-xs text-slate-500">{i.manufacturer} · {t("serie")} {i.serial}</p></div>
                  <span className="text-xs text-slate-400">{i.magnitude}</span>
                </label>
              ))}
              {clientIns.length === 0 && <EmptyState title={es ? "Este cliente no tiene instrumentos" : "This client has no instruments"} action={<button className="btn-secondary text-xs"><Plus size={13} /> {es ? "Agregar instrumento" : "Add instrument"}</button>} />}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <p className="font-heading font-semibold mb-4">{es ? "Asignación" : "Assignment"}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label={t("tecnico")} required><select data-testid="wizard-technician" className="input" value={assign.technician} onChange={(e) => setAssign((p) => ({ ...p, technician: e.target.value }))}>{["Daniel Ramírez", "Juan Pérez", "Ana Torres", "Pedro Sánchez"].map((x) => <option key={x}>{x}</option>)}</select></Field>
              <Field label={es ? "Jefe responsable" : "Responsible manager"}><select className="input" value={assign.chief} onChange={(e) => setAssign((p) => ({ ...p, chief: e.target.value }))}><option>Carlos López</option></select></Field>
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <p className="font-heading font-semibold mb-4">{t("resumen")}</p>
            <div className="grid md:grid-cols-2 gap-x-8">
              <InfoRow label={t("cliente")} value={client?.commercial} />
              <InfoRow label={t("fecha_recepcion")} value={info.received} />
              <InfoRow label={t("fecha_compromiso")} value={info.due} />
              <InfoRow label={es ? "Tipo de servicio" : "Service type"} value={info.serviceType} />
              <InfoRow label={t("prioridad")} value={info.priority} />
              <InfoRow label={t("instrumentos")} value={selIns.length} />
              <InfoRow label={t("tecnico")} value={assign.technician} />
              <InfoRow label={es ? "Jefe responsable" : "Manager"} value={assign.chief} />
            </div>
            {created && <p className="mt-4 p-3 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-sm font-semibold" data-testid="order-created-message">✓ {es ? `Orden ${created} creada correctamente.` : `Order ${created} created successfully.`}</p>}
          </>
        )}
      </div>

      <div className="flex justify-between max-w-3xl mt-4">
        <button data-testid="wizard-back-button" className="btn-secondary" disabled={step === 0 || !!created} onClick={() => setStep(step - 1)}><ChevronLeft size={15} /> {t("anterior")}</button>
        {step < 4
          ? <button data-testid="wizard-next-button" className="btn-primary" disabled={!canNext} onClick={() => setStep(step + 1)}>{t("siguiente")} <ChevronRight size={15} /></button>
          : <button data-testid="wizard-create-button" className="btn-primary" disabled={!!created} onClick={create}><Check size={15} /> {es ? "Crear orden" : "Create order"}</button>}
      </div>
    </>
  );
}
