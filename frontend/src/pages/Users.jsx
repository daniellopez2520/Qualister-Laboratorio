import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { DataTable, StatusBadge, PageHeader, Field, Modal } from "../components/ui";
import { ROLE_LABELS } from "../i18n";

export default function Users() {
  const { t, lang, usersList, addUser } = useApp();
  const es = lang === "es";
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "tecnico", status: "activo", username: "" });
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <>
      <PageHeader title={t("usuarios")} crumbs={[{ label: t("dashboard"), to: "/" }, { label: t("usuarios") }]}
        actions={<button data-testid="new-user-button" className="btn-primary" onClick={() => setOpen(true)}><Plus size={15} /> {es ? "Nuevo usuario" : "New user"}</button>} />
      <DataTable
        testId="users-table"
        columns={[es ? "Usuario" : "Username", es ? "Nombre" : "Name", "Email", es ? "Rol" : "Role", t("estado"), es ? "Último acceso" : "Last access", t("acciones")]}
        rows={usersList}
        searchKeys={["username", "name", "email"]}
        filters={[{ key: "role", label: es ? "Rol" : "Role", options: Object.keys(ROLE_LABELS).map((r) => ({ value: r, label: ROLE_LABELS[r][lang] })) }]}
        renderRow={(u) => (
          <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150">
            <td className="table-td font-semibold">{u.username}</td>
            <td className="table-td">{u.name}</td>
            <td className="table-td">{u.email}</td>
            <td className="table-td">{ROLE_LABELS[u.role]?.[lang] || u.role}</td>
            <td className="table-td"><StatusBadge status={u.status} /></td>
            <td className="table-td">{u.lastAccess}</td>
            <td className="table-td"><button data-testid={`edit-user-${u.id}`} className="btn-ghost">{t("editar")}</button></td>
          </tr>
        )}
      />
      <Modal open={open} onClose={() => setOpen(false)} title={es ? "Nuevo usuario" : "New user"}>
        <form data-testid="new-user-form" className="space-y-3" onSubmit={(e) => { e.preventDefault(); addUser({ ...form, username: form.username || form.email.split("@")[0] }); setOpen(false); }}>
          <Field label={es ? "Nombre" : "Name"} required><input data-testid="user-name-input" className="input" required value={form.name} onChange={set("name")} /></Field>
          <Field label="Email" required><input data-testid="user-email-input" type="email" className="input" required value={form.email} onChange={set("email")} /></Field>
          <Field label={es ? "Rol" : "Role"}><select data-testid="user-role-select" className="input" value={form.role} onChange={set("role")}>{Object.keys(ROLE_LABELS).map((r) => <option key={r} value={r}>{ROLE_LABELS[r][lang]}</option>)}</select></Field>
          <Field label={t("estado")}><select className="input" value={form.status} onChange={set("status")}><option value="activo">{es ? "Activo" : "Active"}</option><option value="inactivo">{es ? "Inactivo" : "Inactive"}</option></select></Field>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>{t("cancelar")}</button>
            <button data-testid="save-user-button" type="submit" className="btn-primary">{t("guardar")}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
