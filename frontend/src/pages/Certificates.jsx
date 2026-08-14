import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Download, Eye, RefreshCcw, Send, Check, X, ChevronRight, AlertTriangle, BadgeCheck, FileCheck2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { DataTable, StatusBadge, PageHeader, InfoRow, Field, EmptyState, Modal } from "../components/ui";
import Timeline from "../components/Timeline";
import { STATUS_META } from "../i18n";
import { CURRENT_USER } from "../components/Layout";

const FLOW = ["borrador", "en_preparacion", "enviado_revision", "en_revision", "aprobado", "liberado"];

export function CertificatesList() {
  const { t, lang, certificates, clients, instruments } = useApp();
  const nav = useNavigate();
  const es = lang === "es";
  const cname = (id) => clients.find((c) => c.id === id)?.commercial || id;
  const iname = (id) => instruments.find((i) => i.id === id)?.name || id;
  const rows = certificates.map((c) => ({ ...c, clientName: cname(c.clientId), instrumentName: iname(c.instrumentId) }));

  return (
    <>
      <PageHeader title={t("certificados")} crumbs={[{ label: t("dashboard"), to: "/" }, { label: t("certificados") }]} />
      <DataTable
        testId="certificates-table"
        columns={[es ? "Certificado" : "Certificate", t("cliente"), es ? "Instrumento" : "Instrument", "OT", t("tecnico"), t("fecha"), t("estado"), t("acciones")]}
        rows={rows}
        searchKeys={["id", "clientName", "instrumentName", "orderId", "technician"]}
        filters={[
          { key: "status", label: t("estado"), options: [...FLOW, "rechazado"].map((s) => ({ value: s, label: STATUS_META[s][lang] })) },
          { key: "technician", label: t("tecnico"), options: [...new Set(certificates.map((c) => c.technician))].map((v) => ({ value: v, label: v })) },
        ]}
        pageSize={10}
        renderRow={(c) => (
          <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150">
            <td className="table-td font-semibold text-sky-700 dark:text-sky-400 cursor-pointer" onClick={() => nav(`/certificados/${c.id}`)}>{c.id}</td>
            <td className="table-td">{c.clientName}</td>
            <td className="table-td">{c.instrumentName}</td>
            <td className="table-td">{c.orderId}</td>
            <td className="table-td">{c.technician}</td>
            <td className="table-td">{c.calDate}</td>
            <td className="table-td"><StatusBadge status={c.status} /></td>
            <td className="table-td"><button data-testid={`view-cert-${c.id}`} className="btn-ghost" onClick={() => nav(`/certificados/${c.id}`)}>{t("ver")}</button></td>
          </tr>
        )}
      />
    </>
  );
}

function PdfPreview({ certId, es }) {
  return (
    <div className="bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4 h-full min-h-[420px] flex items-center justify-center" data-testid="pdf-preview">
      <div className="bg-white shadow-md w-full max-w-[380px] aspect-[8.5/11] p-6 text-slate-800 flex flex-col text-[10px]">
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
          <div>
            <p className="font-heading font-bold text-sm text-slate-900">QUALISTER</p>
            <p className="text-slate-500 text-[8px] uppercase tracking-widest">Laboratorio de Metrología</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-[11px]">{es ? "CERTIFICADO DE CALIBRACIÓN" : "CALIBRATION CERTIFICATE"}</p>
            <p className="text-sky-700 font-bold">{certId}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {[es ? "Cliente" : "Client", es ? "Instrumento" : "Instrument", es ? "Fabricante" : "Manufacturer", es ? "Modelo" : "Model", es ? "Serie" : "Serial", es ? "Fecha" : "Date"].map((l, i) => (
            <div key={i}><p className="text-slate-400 text-[8px] uppercase">{l}</p><div className="h-1.5 bg-slate-200 rounded w-4/5 mt-0.5" /></div>
          ))}
        </div>
        <p className="mt-4 text-[8px] uppercase text-slate-400 font-bold">{es ? "Resultados de medición" : "Measurement results"}</p>
        <div className="mt-1 border border-slate-200 flex-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`flex h-5 items-center px-2 gap-2 ${i === 0 ? "bg-slate-100 font-bold" : "border-t border-slate-100"}`}>
              {[...Array(4)].map((_, j) => <div key={j} className="h-1.5 bg-slate-200 rounded flex-1" />)}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-end mt-3">
          <div className="w-24"><div className="border-t border-slate-400 pt-0.5 text-[7px] text-center text-slate-400">{es ? "Técnico" : "Technician"}</div></div>
          <div className="w-24"><div className="border-t border-slate-400 pt-0.5 text-[7px] text-center text-slate-400">{es ? "Aprobó" : "Approved by"}</div></div>
        </div>
      </div>
    </div>
  );
}

function FlowDiagram({ status, es, lang }) {
  const isRejected = status === "rechazado";
  const activeIdx = FLOW.indexOf(status);
  return (
    <div className="flex items-center gap-1 flex-wrap" data-testid="certificate-flow">
      {FLOW.map((s, i) => {
        const active = !isRejected && i === activeIdx;
        const done = !isRejected && i < activeIdx;
        return (
          <React.Fragment key={s}>
            {i > 0 && <ChevronRight size={13} className="text-slate-300 shrink-0" />}
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${active ? "bg-sky-600 text-white" : done ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-slate-100 text-slate-400 dark:bg-slate-800"}`}>
              {STATUS_META[s][lang]}
            </span>
          </React.Fragment>
        );
      })}
      {isRejected && (
        <>
          <ChevronRight size={13} className="text-slate-300" />
          <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide bg-rose-600 text-white">{STATUS_META.rechazado[lang]}</span>
        </>
      )}
    </div>
  );
}

export function CertificateDetail() {
  const { id } = useParams();
  const { t, lang, role, certificates, clients, instruments, updateCertStatus } = useApp();
  const nav = useNavigate();
  const es = lang === "es";
  const [reviewModal, setReviewModal] = useState(false);
  const [comment, setComment] = useState("");
  const c = certificates.find((x) => x.id === id);
  if (!c) return <EmptyState title={t("sin_resultados")} />;
  const client = clients.find((x) => x.id === c.clientId);
  const ins = instruments.find((x) => x.id === c.instrumentId);
  const actor = CURRENT_USER[role]?.name;

  const canSend = ["borrador", "en_preparacion", "rechazado"].includes(c.status) && ["tecnico", "admin"].includes(role);
  const canRelease = c.status === "aprobado" && ["jefe", "admin"].includes(role);
  const canReview = ["enviado_revision", "en_revision"].includes(c.status) && ["jefe", "admin"].includes(role);

  const sendToReview = () => {
    updateCertStatus(c.id, "enviado_revision", { actor, rejection: null });
    setReviewModal(false);
    setComment("");
  };

  return (
    <>
      <PageHeader title={c.id} subtitle={es ? "Certificado de calibración" : "Calibration certificate"}
        crumbs={[{ label: t("certificados"), to: "/certificados" }, { label: c.id }]}
        actions={<>
          <StatusBadge status={c.status} className="text-xs py-1 px-3" />
          {canSend && <button data-testid="send-to-review-button" className="btn-primary" onClick={() => setReviewModal(true)}><Send size={14} /> {c.status === "rechazado" ? (es ? "Reenviar a revisión" : "Resend to review") : t("enviar_revision")}</button>}
          {canReview && <button data-testid="go-to-review-button" className="btn-primary" onClick={() => nav(`/certificados/${c.id}/revision`)}><Eye size={14} /> {es ? "Revisar" : "Review"}</button>}
          {canRelease && <button data-testid="release-cert-button" className="btn-primary" onClick={() => updateCertStatus(c.id, "liberado", { actor })}><BadgeCheck size={14} /> {es ? "Liberar" : "Release"}</button>}
        </>} />

      {c.status === "rechazado" && c.rejection && (
        <div className="card border-l-4 border-l-rose-500 p-4 mb-4 fade-up" data-testid="rejection-banner">
          <p className="font-heading font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2 uppercase tracking-wide text-sm"><AlertTriangle size={16} /> {es ? "Corrección requerida" : "Correction required"}</p>
          <p className="text-sm mt-2"><span className="text-slate-500">{es ? "Revisado por:" : "Reviewed by:"}</span> <span className="font-semibold">{c.rejection.by}</span> · <span className="text-slate-500">{es ? "Motivo:" : "Category:"}</span> {c.rejection.category}</p>
          <p className="text-sm mt-1 italic text-slate-600 dark:text-slate-300">"{c.rejection.reason}"</p>
          <div className="flex gap-2 mt-3">
            <button className="btn-secondary text-xs" data-testid="correct-button">{es ? "Corregir" : "Correct"}</button>
            <button className="btn-secondary text-xs" data-testid="replace-pdf-button"><RefreshCcw size={12} /> {es ? "Reemplazar PDF" : "Replace PDF"}</button>
            <button className="btn-primary text-xs" data-testid="resend-review-button" onClick={() => setReviewModal(true)}><Send size={12} /> {es ? "Reenviar a revisión" : "Resend to review"}</button>
          </div>
        </div>
      )}

      <div className="card p-4 mb-4">
        <p className="overline-label mb-2">{es ? "Flujo del certificado" : "Certificate flow"}</p>
        <FlowDiagram status={c.status} es={es} lang={lang} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-4" data-testid="cert-main-info">
            <p className="font-heading font-semibold text-sm mb-2">{es ? "Información principal" : "Main information"}</p>
            <div className="grid md:grid-cols-2 gap-x-8">
              <InfoRow label={t("cliente")} value={client?.commercial} />
              <InfoRow label="OT" value={<button className="text-sky-600 dark:text-sky-400 hover:underline font-semibold" onClick={() => nav(`/ordenes/${c.orderId}`)}>{c.orderId}</button>} />
              <InfoRow label={es ? "Instrumento" : "Instrument"} value={ins?.name} />
              <InfoRow label={t("fabricante")} value={ins?.manufacturer} />
              <InfoRow label={t("modelo")} value={ins?.model} />
              <InfoRow label={t("serie")} value={ins?.serial} />
              <InfoRow label={t("tecnico")} value={c.technician} />
              <InfoRow label={es ? "Fecha calibración" : "Calibration date"} value={c.calDate} />
              <InfoRow label={es ? "Procedimiento" : "Procedure"} value={c.procedure} />
              <InfoRow label={es ? "Patrones utilizados" : "Standards used"} value={c.standardsUsed.join(", ")} />
            </div>
          </div>

          <div className="card p-4" data-testid="cert-technical-data">
            <p className="font-heading font-semibold text-sm mb-2">{es ? "Datos técnicos" : "Technical data"}</p>
            <div className="grid md:grid-cols-2 gap-x-8">
              <InfoRow label={t("magnitud")} value={ins?.magnitude} />
              <InfoRow label={es ? "Rango" : "Range"} value={ins?.range} />
              <InfoRow label={es ? "Resolución" : "Resolution"} value={ins?.resolution} />
              <InfoRow label={es ? "Condiciones ambientales" : "Environmental conditions"} value="23 ± 1 °C · 45 % HR" />
            </div>
          </div>

          <div className="card p-4" data-testid="cert-documents">
            <p className="font-heading font-semibold text-sm mb-3">{t("documentos")}</p>
            <div className="grid md:grid-cols-3 gap-3">
              {c.docs.map((d, i) => (
                <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-md p-3" data-testid={`doc-card-${d.key}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center"><FileText size={15} className="text-rose-500" /></span>
                    <div className="min-w-0"><p className="text-xs font-bold uppercase text-slate-400">PDF {i + 1}</p><p className="text-sm font-semibold truncate">{d.name}</p></div>
                  </div>
                  <p className="text-[11px] text-slate-400">{es ? "Subido por" : "Uploaded by"} {d.uploadedBy} · {d.date} · {d.size}</p>
                  <div className="flex gap-1.5 mt-2.5">
                    <button className="btn-ghost text-[11px]" data-testid={`doc-view-${d.key}`}><Eye size={12} /> {t("ver")}</button>
                    <button className="btn-ghost text-[11px]"><Download size={12} /> {t("descargar")}</button>
                    <button className="btn-ghost text-[11px]"><RefreshCcw size={12} /> {es ? "Sustituir" : "Replace"}</button>
                  </div>
                </div>
              ))}
              <div className={`border rounded-md p-3 ${c.combined ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-500/5" : "border-dashed border-slate-300 dark:border-slate-700"}`} data-testid="doc-card-combined">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center"><FileCheck2 size={15} className="text-emerald-600" /></span>
                  <div className="min-w-0"><p className="text-xs font-bold uppercase text-slate-400">{es ? "Certificado completo" : "Full certificate"}</p><p className="text-sm font-semibold truncate">{c.id}.pdf</p></div>
                </div>
                {c.combined ? <StatusBadge status="liberado" className="!normal-case" /> : <p className="text-[11px] text-slate-400">{es ? "Aún no generado" : "Not generated yet"}</p>}
                <div className="flex gap-1.5 mt-2.5">
                  <button className="btn-ghost text-[11px]" data-testid="doc-preview-combined"><Eye size={12} /> {t("vista_previa")}</button>
                  <button className="btn-ghost text-[11px]"><Download size={12} /> {t("descargar")}</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <p className="font-heading font-semibold text-sm mb-3">{t("vista_previa")} PDF</p>
            <PdfPreview certId={c.id} es={es} />
          </div>
          <div className="card p-4" data-testid="cert-activity">
            <p className="font-heading font-semibold text-sm mb-3">{t("actividad")}</p>
            <Timeline items={c.timeline} />
          </div>
        </div>
      </div>

      <Modal open={reviewModal} onClose={() => setReviewModal(false)} title={es ? "Enviar certificado a revisión" : "Send certificate to review"}>
        <div data-testid="send-review-modal">
          <p className="text-sm text-slate-500 mb-1">{es ? "Certificado:" : "Certificate:"}</p>
          <p className="font-heading font-bold text-lg mb-4">{c.id}</p>
          <div className="space-y-2 mb-4">
            {[es ? "Información completa" : "Complete information", es ? "PDF 1 cargado" : "PDF 1 uploaded", es ? "PDF 2 cargado" : "PDF 2 uploaded", es ? "Certificado combinado generado" : "Combined certificate generated"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center"><Check size={12} className="text-emerald-600" /></span>
                {item}
              </div>
            ))}
          </div>
          <Field label={es ? "Comentarios para el revisor" : "Comments for the reviewer"}>
            <textarea data-testid="review-comment-input" className="input" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder={es ? "Opcional…" : "Optional…"} />
          </Field>
          <div className="flex justify-end gap-2 mt-4">
            <button className="btn-secondary" onClick={() => setReviewModal(false)}>{t("cancelar")}</button>
            <button data-testid="confirm-send-review" className="btn-primary" onClick={sendToReview}><Send size={14} /> {t("enviar_revision")}</button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export function CertificateReview() {
  const { id } = useParams();
  const { t, lang, role, certificates, clients, instruments, updateCertStatus } = useApp();
  const nav = useNavigate();
  const es = lang === "es";
  const [rejectModal, setRejectModal] = useState(false);
  const [reason, setReason] = useState("");
  const [category, setCategory] = useState("");
  const [decided, setDecided] = useState(null);
  const c = certificates.find((x) => x.id === id);
  if (!c) return <EmptyState title={t("sin_resultados")} />;
  const client = clients.find((x) => x.id === c.clientId);
  const ins = instruments.find((x) => x.id === c.instrumentId);
  const actor = CURRENT_USER[role]?.name || "Carlos López";

  const approve = () => { updateCertStatus(c.id, "aprobado", { actor }); setDecided("approved"); };
  const reject = () => {
    if (!reason.trim()) return;
    updateCertStatus(c.id, "rechazado", { actor, rejection: { by: actor, reason, category: category || "Otro" } });
    setRejectModal(false);
    setDecided("rejected");
  };

  return (
    <>
      <PageHeader title={es ? "Revisión de certificado" : "Certificate review"} subtitle={c.id}
        crumbs={[{ label: t("certificados"), to: "/certificados" }, { label: c.id, to: `/certificados/${c.id}` }, { label: es ? "Revisión" : "Review" }]}
        actions={<StatusBadge status={c.status} className="text-xs py-1 px-3" />} />

      {decided && (
        <div className={`card p-4 mb-4 border-l-4 fade-up ${decided === "approved" ? "border-l-emerald-500" : "border-l-rose-500"}`} data-testid="review-decision-banner">
          <p className="font-semibold text-sm">
            {decided === "approved" ? (es ? "✓ Certificado aprobado correctamente." : "✓ Certificate approved successfully.") : (es ? "✕ Certificado rechazado. El técnico será notificado." : "✕ Certificate rejected. The technician will be notified.")}
          </p>
          <button className="btn-secondary text-xs mt-2" onClick={() => nav(`/certificados/${c.id}`)}>{es ? "Ver certificado" : "View certificate"}</button>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-4 lg:h-[calc(100vh-220px)] lg:min-h-[520px]">
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
          <div className="card p-4">
            <p className="font-heading font-semibold text-sm mb-2">{es ? "Datos del servicio" : "Service data"}</p>
            <InfoRow label={t("cliente")} value={client?.commercial} />
            <InfoRow label={es ? "Instrumento" : "Instrument"} value={ins?.name} />
            <InfoRow label={t("modelo")} value={ins?.model} />
            <InfoRow label={t("serie")} value={ins?.serial} />
            <InfoRow label={t("tecnico")} value={c.technician} />
            <InfoRow label={es ? "Procedimiento" : "Procedure"} value={c.procedure} />
            <InfoRow label={es ? "Patrones utilizados" : "Standards used"} value={c.standardsUsed.join(", ")} />
            <InfoRow label={es ? "Fecha calibración" : "Calibration date"} value={c.calDate} />
          </div>
          <div className="card p-4">
            <p className="font-heading font-semibold text-sm mb-2">{t("documentos")}</p>
            {c.docs.map((d, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 text-sm border-b border-slate-100 dark:border-slate-800 last:border-0">
                <FileText size={14} className="text-rose-500 shrink-0" /><span className="truncate flex-1">{d.name}</span>
                <button className="btn-ghost text-[11px]"><Eye size={12} /></button>
              </div>
            ))}
          </div>
          {!decided && (
            <div className="card p-4 sticky bottom-0">
              <p className="overline-label mb-3">{es ? "Decisión" : "Decision"}</p>
              <div className="grid grid-cols-2 gap-2">
                <button data-testid="approve-cert-button" onClick={approve} className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors duration-200">
                  <Check size={17} /> {t("aprobar").toUpperCase()}
                </button>
                <button data-testid="reject-cert-button" onClick={() => setRejectModal(true)} className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-colors duration-200">
                  <X size={17} /> {t("rechazar").toUpperCase()}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-8 card p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <p className="font-heading font-semibold text-sm">{es ? "Visor de PDF" : "PDF viewer"} — {c.id}.pdf</p>
            <div className="flex gap-1.5">
              <button className="btn-ghost text-xs"><Download size={13} /> {t("descargar")}</button>
            </div>
          </div>
          <div className="flex-1"><PdfPreview certId={c.id} es={es} /></div>
        </div>
      </div>

      <Modal open={rejectModal} onClose={() => setRejectModal(false)} title={es ? "Motivo del rechazo" : "Rejection reason"}>
        <div data-testid="reject-modal">
          <Field label={es ? "Categoría" : "Category"}>
            <div className="flex flex-wrap gap-2 mb-1">
              {[es ? "Datos incorrectos" : "Incorrect data", es ? "PDF incorrecto" : "Wrong PDF", es ? "Información incompleta" : "Incomplete information", es ? "Error técnico" : "Technical error", es ? "Otro" : "Other"].map((cat) => (
                <button key={cat} data-testid={`reject-category-${cat}`} onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-200 ${category === cat ? "bg-rose-600 text-white border-rose-600" : "border-slate-300 dark:border-slate-700 hover:border-rose-400"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </Field>
          <Field label={es ? "Motivo (obligatorio)" : "Reason (required)"} required>
            <textarea data-testid="reject-reason-input" className="input" rows={4} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={es ? "Describe claramente qué debe corregirse…" : "Clearly describe what must be corrected…"} />
          </Field>
          {!reason.trim() && <p className="text-[11px] text-rose-500 mt-1">{es ? "El motivo es obligatorio." : "The reason is required."}</p>}
          <div className="flex justify-end gap-2 mt-4">
            <button className="btn-secondary" onClick={() => setRejectModal(false)}>{t("cancelar")}</button>
            <button data-testid="confirm-reject-button" disabled={!reason.trim()} onClick={reject} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm disabled:opacity-50 transition-colors duration-200">
              <X size={14} /> {t("rechazar")}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
