import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { DataTable, PageHeader, Drawer, InfoRow } from "../components/ui";

export default function Audit() {
  const { t, lang, auditLog } = useApp();
  const es = lang === "es";
  const [sel, setSel] = useState(null);

  return (
    <>
      <PageHeader title={t("auditoria")} crumbs={[{ label: t("dashboard"), to: "/" }, { label: t("auditoria") }]}
        subtitle={es ? "Registro de eventos del sistema (datos de demostración)." : "System event log (demo data)."} />
      <DataTable
        testId="audit-table"
        columns={[es ? "Fecha/Hora" : "Date/Time", es ? "Usuario" : "User", es ? "Rol" : "Role", es ? "Módulo" : "Module", es ? "Acción" : "Action", es ? "Registro" : "Record", "IP", es ? "Detalles" : "Details"]}
        rows={auditLog}
        searchKeys={["user", "module", "action", "record"]}
        filters={[
          { key: "user", label: es ? "Usuario" : "User", options: [...new Set(auditLog.map((a) => a.user))].map((u) => ({ value: u, label: u })) },
          { key: "module", label: es ? "Módulo" : "Module", options: [...new Set(auditLog.map((a) => a.module))].map((m) => ({ value: m, label: m })) },
          { key: "action", label: es ? "Acción" : "Action", options: [...new Set(auditLog.map((a) => a.action))].map((m) => ({ value: m, label: m })) },
        ]}
        pageSize={10}
        renderRow={(a) => (
          <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors duration-150" onClick={() => setSel(a)} data-testid={`audit-row-${a.id}`}>
            <td className="table-td">{a.datetime}</td>
            <td className="table-td font-semibold">{a.user}</td>
            <td className="table-td">{a.role}</td>
            <td className="table-td">{a.module}</td>
            <td className="table-td">{a.action}</td>
            <td className="table-td font-medium text-sky-700 dark:text-sky-400">{a.record}</td>
            <td className="table-td">{a.ip}</td>
            <td className="table-td"><button className="btn-ghost text-xs">{t("ver")}</button></td>
          </tr>
        )}
      />
      <Drawer open={!!sel} onClose={() => setSel(null)} title={es ? "Detalles del evento" : "Event details"}>
        {sel && (
          <div data-testid="audit-detail-drawer">
            <InfoRow label={es ? "Usuario" : "User"} value={sel.user} />
            <InfoRow label={es ? "Rol" : "Role"} value={sel.role} />
            <InfoRow label={es ? "Fecha" : "Date"} value={sel.datetime} />
            <InfoRow label={es ? "Módulo" : "Module"} value={sel.module} />
            <InfoRow label={es ? "Acción" : "Action"} value={sel.action} />
            <InfoRow label={es ? "Registro" : "Record"} value={sel.record} />
            <InfoRow label="IP" value={sel.ip} />
            <div className="mt-5 grid gap-3">
              <div className="rounded-md border border-rose-200 dark:border-rose-500/30 bg-rose-50/50 dark:bg-rose-500/5 p-3">
                <p className="overline-label text-rose-500 mb-1">{es ? "Valor anterior" : "Previous value"}</p>
                <p className="text-sm">{sel.before}</p>
              </div>
              <div className="rounded-md border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5 p-3">
                <p className="overline-label text-emerald-600 mb-1">{es ? "Valor nuevo" : "New value"}</p>
                <p className="text-sm">{sel.after}</p>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
