import React, { useState } from "react";
import { Plus, FileText, Check, Minus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { DataTable, StatusBadge, PageHeader, Tabs, InfoRow, Modal } from "../components/ui";
import { STATUS_META } from "../i18n";

export default function Procedures() {
  const { t, lang, procedures, competencies, role } = useApp();
  const es = lang === "es";
  const readonly = role === "tecnico";
  const showMatrix = ["jefe", "admin"].includes(role);
  const [tab, setTab] = useState("lista");
  const [sel, setSel] = useState(null);

  const tabs = [{ key: "lista", label: t("procedimientos") }, ...(showMatrix ? [{ key: "matriz", label: es ? "Matriz de competencias" : "Competency matrix" }] : [])];

  return (
    <>
      <PageHeader title={t("procedimientos")} crumbs={[{ label: t("dashboard"), to: "/" }, { label: t("procedimientos") }]}
        subtitle={readonly ? (es ? "Modo consulta" : "Read-only mode") : undefined}
        actions={!readonly && <button data-testid="new-procedure-button" className="btn-primary"><Plus size={15} /> {es ? "Nuevo procedimiento" : "New procedure"}</button>} />
      {tabs.length > 1 && <div className="mb-4"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>}
      {tab === "lista" && (
        <DataTable
          testId="procedures-table"
          columns={[es ? "Código" : "Code", es ? "Procedimiento" : "Procedure", t("magnitud"), es ? "Revisión" : "Revision", es ? "Fecha vigencia" : "Effective date", es ? "Próxima revisión" : "Next review", t("estado"), t("acciones")]}
          rows={procedures}
          searchKeys={["code", "name"]}
          filters={[
            { key: "magnitude", label: t("magnitud"), options: [...new Set(procedures.map((p) => p.magnitude))].map((m) => ({ value: m, label: m })) },
            { key: "status", label: t("estado"), options: ["borrador", "vigente", "obsoleto"].map((s) => ({ value: s, label: STATUS_META[s][lang] })) },
          ]}
          pageSize={10}
          renderRow={(p) => (
            <tr key={p.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150">
              <td className="table-td font-semibold text-sky-700 dark:text-sky-400 cursor-pointer" onClick={() => setSel(p)}>{p.code}</td>
              <td className="table-td max-w-[320px] truncate">{p.name}</td>
              <td className="table-td">{p.magnitude}</td>
              <td className="table-td text-center">{p.revision}</td>
              <td className="table-td">{p.effective}</td>
              <td className="table-td">{p.nextReview}</td>
              <td className="table-td"><StatusBadge status={p.status} /></td>
              <td className="table-td"><button data-testid={`view-procedure-${p.code}`} className="btn-ghost" onClick={() => setSel(p)}>{t("ver")}</button></td>
            </tr>
          )}
        />
      )}
      {tab === "matriz" && (
        <div className="card overflow-x-auto" data-testid="competency-matrix">
          <div className="p-4 pb-2">
            <p className="font-heading font-semibold">{es ? "Matriz de competencias por magnitud" : "Competency matrix by magnitude"}</p>
            <p className="text-xs text-slate-500">{es ? "✓ autorizado · — no autorizado" : "✓ authorized · — not authorized"}</p>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800">
              <tr><th className="table-th">{t("tecnico")}</th>{competencies.magnitudes.map((m) => <th key={m} className="table-th text-center">{m}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {competencies.rows.map((r) => (
                <tr key={r.tech} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="table-td font-semibold">{r.tech}</td>
                  {r.values.map((v, i) => (
                    <td key={i} className="table-td text-center">
                      {v ? <span className="inline-flex w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/15 items-center justify-center"><Check size={13} className="text-emerald-600" /></span>
                        : <span className="inline-flex w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center"><Minus size={13} className="text-slate-400" /></span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={!!sel} onClose={() => setSel(null)} title={sel?.code}>
        {sel && (
          <div data-testid="procedure-detail-modal">
            <p className="font-semibold mb-3">{sel.name}</p>
            <InfoRow label={t("magnitud")} value={sel.magnitude} />
            <InfoRow label={es ? "Revisión" : "Revision"} value={sel.revision} />
            <InfoRow label={es ? "Responsable" : "Responsible"} value={sel.responsible} />
            <InfoRow label={es ? "Fecha vigencia" : "Effective date"} value={sel.effective} />
            <InfoRow label={es ? "Próxima revisión" : "Next review"} value={sel.nextReview} />
            <InfoRow label={t("estado")} value={<StatusBadge status={sel.status} />} />
            <div className="mt-4 border border-slate-200 dark:border-slate-800 rounded-md p-3 flex items-center gap-3">
              <FileText size={18} className="text-rose-500" />
              <div className="flex-1"><p className="text-sm font-semibold">{sel.code}_rev{sel.revision}.pdf</p><p className="text-[11px] text-slate-400">PDF · 2.4 MB</p></div>
              <button className="btn-secondary text-xs">{t("ver")}</button>
            </div>
            <p className="overline-label mt-4 mb-2">{es ? "Historial de versiones" : "Version history"}</p>
            <ul className="text-sm space-y-1.5">
              {["C — 2025", "B — 2023", "A — 2021"].filter((_, i) => i < (sel.revision.charCodeAt(0) - 64)).map((v, i) => (
                <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Rev. {v}</li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </>
  );
}
