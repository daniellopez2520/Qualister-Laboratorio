import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Eye, Pencil, ClipboardPlus, FileText, History, MoreHorizontal, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { DataTable, StatusBadge, PageHeader, Tabs, KpiCard, InfoRow, Field, EmptyState, Modal } from "../components/ui";
import { money } from "../i18n";

export function ClientsList() {
  const { t, lang, clients } = useApp();
  const nav = useNavigate();
  const es = lang === "es";
  const [menuFor, setMenuFor] = useState(null);

  return (
    <>
      <PageHeader title={t("clientes")} crumbs={[{ label: t("dashboard"), to: "/" }, { label: t("clientes") }]}
        actions={<button data-testid="new-client-button" className="btn-primary" onClick={() => nav("/clientes/nuevo")}><Plus size={15} /> {es ? "Nuevo cliente" : "New client"}</button>} />
      <DataTable
        testId="clients-table"
        columns={[t("cliente"), es ? "Razón social" : "Legal name", "RFC", es ? "Ciudad" : "City", es ? "Contacto" : "Contact", es ? "Órdenes activas" : "Active orders", t("saldo"), t("estado"), t("acciones")]}
        rows={clients}
        searchKeys={["name", "commercial", "rfc", "city", "contact"]}
        filters={[{ key: "status", label: t("estado"), options: [{ value: "activo", label: es ? "Activo" : "Active" }, { value: "inactivo", label: es ? "Inactivo" : "Inactive" }] }]}
        renderRow={(c) => (
          <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150">
            <td className="table-td font-semibold text-sky-700 dark:text-sky-400 cursor-pointer" onClick={() => nav(`/clientes/${c.id}`)}>{c.commercial}</td>
            <td className="table-td max-w-[220px] truncate">{c.name}</td>
            <td className="table-td">{c.rfc}</td>
            <td className="table-td">{c.city}</td>
            <td className="table-td">{c.contact}</td>
            <td className="table-td text-center">{c.activeOrders}</td>
            <td className="table-td">{money(c.balance)}</td>
            <td className="table-td"><StatusBadge status={c.status} /></td>
            <td className="table-td relative">
              <div className="flex items-center gap-1">
                <button data-testid={`view-client-${c.id}`} className="btn-ghost" onClick={() => nav(`/clientes/${c.id}`)}><Eye size={14} /></button>
                <button data-testid={`client-menu-${c.id}`} className="btn-ghost" onClick={() => setMenuFor(menuFor === c.id ? null : c.id)}><MoreHorizontal size={14} /></button>
              </div>
              {menuFor === c.id && (
                <div className="absolute right-4 top-10 card shadow-lg z-20 py-1 w-44 text-left">
                  {[[Pencil, t("editar"), `/clientes/${c.id}`], [ClipboardPlus, es ? "Nueva OT" : "New WO", "/ordenes/nueva"], [FileText, es ? "Nueva cotización" : "New quote", "/finanzas?tab=cotizaciones"], [History, t("historial"), `/clientes/${c.id}`]].map(([I, l, to], i) => (
                    <button key={i} className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => { setMenuFor(null); nav(to); }}><I size={13} /> {l}</button>
                  ))}
                </div>
              )}
            </td>
          </tr>
        )}
      />
    </>
  );
}

export function ClientDetail() {
  const { id } = useParams();
  const { t, lang, clients, orders, instruments, certificates, invoices, quotes, payments } = useApp();
  const nav = useNavigate();
  const es = lang === "es";
  const [tab, setTab] = useState("resumen");
  const c = clients.find((x) => x.id === id);
  if (!c) return <EmptyState title={t("sin_resultados")} />;

  const cOrders = orders.filter((o) => o.clientId === id);
  const cIns = instruments.filter((i) => i.clientId === id);
  const cCerts = certificates.filter((x) => x.clientId === id);
  const cInv = invoices.filter((f) => f.clientId === id);
  const cQuotes = quotes.filter((q) => q.clientId === id);
  const cPays = payments.filter((p) => p.clientId === id);

  const tabs = [
    { key: "resumen", label: t("resumen") }, { key: "contactos", label: es ? "Contactos" : "Contacts" },
    { key: "sucursales", label: es ? "Sucursales" : "Branches" }, { key: "instrumentos", label: t("instrumentos") },
    { key: "ordenes", label: es ? "Órdenes" : "Orders" }, { key: "certificados", label: t("certificados") },
    { key: "cotizaciones", label: es ? "Cotizaciones" : "Quotes" }, { key: "facturas", label: es ? "Facturas" : "Invoices" },
    { key: "pagos", label: es ? "Pagos" : "Payments" }, { key: "historial", label: t("historial") },
  ];

  const MiniTable = ({ cols, rows, render }) => (
    <div className="card overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800"><tr>{cols.map((cc, i) => <th key={i} className="table-th">{cc}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{rows.map(render)}</tbody>
      </table>
      {rows.length === 0 && <EmptyState title={t("sin_resultados")} />}
    </div>
  );

  return (
    <>
      <PageHeader title={c.commercial} subtitle={c.name}
        crumbs={[{ label: t("clientes"), to: "/clientes" }, { label: c.commercial }]}
        actions={<>
          <button data-testid="client-new-order" className="btn-secondary" onClick={() => nav("/ordenes/nueva")}><ClipboardPlus size={15} /> {es ? "Nueva OT" : "New WO"}</button>
          <button data-testid="client-edit" className="btn-primary"><Pencil size={15} /> {t("editar")}</button>
        </>} />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      <div className="mt-4 fade-up">
        {tab === "resumen" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
              <KpiCard label={es ? "Órdenes activas" : "Active orders"} value={c.activeOrders} tone="blue" />
              <KpiCard label={es ? "Instrumentos" : "Instruments"} value={cIns.length} tone="gray" />
              <KpiCard label={es ? "Certificados" : "Certificates"} value={cCerts.length} tone="green" />
              <KpiCard label={es ? "Facturación" : "Billing"} value={money(cInv.reduce((a, f) => a + f.total, 0))} tone="navy" />
              <KpiCard label={es ? "Saldo pendiente" : "Outstanding"} value={money(c.balance)} tone={c.balance > 0 ? "yellow" : "green"} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="card p-4">
                <p className="font-heading font-semibold text-sm mb-2">{es ? "Información general" : "General information"}</p>
                <InfoRow label="RFC" value={c.rfc} /><InfoRow label={es ? "Teléfono" : "Phone"} value={c.phone} />
                <InfoRow label="Email" value={c.email} /><InfoRow label={es ? "Sitio web" : "Website"} value={c.web} />
                <InfoRow label={es ? "Dirección" : "Address"} value={`${c.street}, ${c.city}, ${c.state}, ${c.zip}`} />
              </div>
              <div className="card p-4">
                <p className="font-heading font-semibold text-sm mb-2">{es ? "Información comercial" : "Commercial info"}</p>
                <InfoRow label={es ? "Condiciones de pago" : "Payment terms"} value={c.paymentTerms} />
                <InfoRow label={es ? "Días de crédito" : "Credit days"} value={c.creditDays} />
                <InfoRow label={es ? "Moneda" : "Currency"} value={c.currency} />
                <InfoRow label={es ? "Observaciones" : "Notes"} value={c.notes || "—"} />
              </div>
            </div>
          </>
        )}
        {tab === "contactos" && (
          <div className="grid md:grid-cols-2 gap-3">
            {c.contacts.map((ct, i) => (
              <div key={i} className="card p-4">
                <p className="font-semibold">{ct.name}</p>
                <p className="text-xs text-slate-500 mb-2">{ct.title}</p>
                <InfoRow label="Email" value={ct.email} /><InfoRow label={es ? "Teléfono" : "Phone"} value={ct.phone} />
              </div>
            ))}
          </div>
        )}
        {tab === "sucursales" && <EmptyState title={es ? "Sin sucursales registradas" : "No branches registered"} desc={es ? "Este cliente opera desde su dirección principal." : "This client operates from its main address."} action={<button className="btn-secondary"><Plus size={14} /> {es ? "Agregar sucursal" : "Add branch"}</button>} />}
        {tab === "instrumentos" && <MiniTable cols={[es ? "Instrumento" : "Instrument", t("modelo"), t("serie"), t("magnitud"), t("estado")]} rows={cIns} render={(i) => (
          <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer" onClick={() => nav(`/instrumentos/${i.id}`)}>
            <td className="table-td font-medium">{i.name}</td><td className="table-td">{i.model}</td><td className="table-td">{i.serial}</td><td className="table-td">{i.magnitude}</td><td className="table-td"><StatusBadge status={i.status} /></td></tr>)} />}
        {tab === "ordenes" && <MiniTable cols={["OT", t("tecnico"), t("fecha_compromiso"), t("estado")]} rows={cOrders} render={(o) => (
          <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer" onClick={() => nav(`/ordenes/${o.id}`)}>
            <td className="table-td font-semibold text-sky-700 dark:text-sky-400">{o.id}</td><td className="table-td">{o.technician}</td><td className="table-td">{o.due}</td><td className="table-td"><StatusBadge status={o.status} /></td></tr>)} />}
        {tab === "certificados" && <MiniTable cols={[es ? "Certificado" : "Certificate", t("tecnico"), t("fecha"), t("estado")]} rows={cCerts} render={(x) => (
          <tr key={x.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer" onClick={() => nav(`/certificados/${x.id}`)}>
            <td className="table-td font-semibold text-sky-700 dark:text-sky-400">{x.id}</td><td className="table-td">{x.technician}</td><td className="table-td">{x.calDate}</td><td className="table-td"><StatusBadge status={x.status} /></td></tr>)} />}
        {tab === "cotizaciones" && <MiniTable cols={[es ? "Cotización" : "Quote", t("fecha"), es ? "Importe" : "Amount", t("estado")]} rows={cQuotes} render={(q) => (
          <tr key={q.id}><td className="table-td font-semibold">{q.id}</td><td className="table-td">{q.date}</td><td className="table-td">{money(q.amount)}</td><td className="table-td"><StatusBadge status={q.status} /></td></tr>)} />}
        {tab === "facturas" && <MiniTable cols={[es ? "Factura" : "Invoice", t("fecha"), t("total"), t("saldo"), t("estado")]} rows={cInv} render={(f) => (
          <tr key={f.id}><td className="table-td font-semibold">{f.id}</td><td className="table-td">{f.date}</td><td className="table-td">{money(f.total)}</td><td className="table-td">{money(f.balance)}</td><td className="table-td"><StatusBadge status={f.status} /></td></tr>)} />}
        {tab === "pagos" && <MiniTable cols={[t("fecha"), es ? "Factura" : "Invoice", es ? "Importe" : "Amount", es ? "Método" : "Method", es ? "Referencia" : "Reference"]} rows={cPays} render={(p) => (
          <tr key={p.id}><td className="table-td">{p.date}</td><td className="table-td font-semibold">{p.invoiceId}</td><td className="table-td">{money(p.amount)}</td><td className="table-td">{p.method}</td><td className="table-td">{p.reference}</td></tr>)} />}
        {tab === "historial" && (
          <div className="card p-5">
            <ul className="space-y-3 text-sm">
              {[["2026-06-12", es ? "Factura F-0157 emitida." : "Invoice F-0157 issued."], ["2026-06-10", es ? "OT QLM-OT-2026-0152 en proceso." : "WO QLM-OT-2026-0152 in progress."], ["2026-06-05", es ? "Pago registrado por " + money(12870) + "." : "Payment recorded for " + money(12870) + "."], ["2026-05-28", es ? "Cliente actualizado por Miguel Ortega." : "Client updated by Miguel Ortega."]].map(([d, e], i) => (
                <li key={i} className="flex gap-3"><span className="text-slate-400 text-xs w-20 shrink-0 mt-0.5">{d}</span><span>{e}</span></li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export function NewClient() {
  const { t, lang, addClient } = useApp();
  const nav = useNavigate();
  const es = lang === "es";
  const [form, setForm] = useState({ name: "", commercial: "", rfc: "", phone: "", email: "", web: "", street: "", city: "", state: "", country: "México", zip: "", paymentTerms: "Contado", creditDays: 0, currency: "MXN", notes: "" });
  const [contacts, setContacts] = useState([{ name: "", title: "", email: "", phone: "" }]);
  const [saved, setSaved] = useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const setC = (i, k) => (e) => setContacts((p) => p.map((c, j) => (j === i ? { ...c, [k]: e.target.value } : c)));

  const Section = ({ title, children }) => (
    <div className="card p-5 mb-4"><p className="font-heading font-semibold mb-4">{title}</p><div className="grid md:grid-cols-3 gap-4">{children}</div></div>
  );

  const submit = (e) => {
    e.preventDefault();
    addClient({ ...form, contact: contacts[0]?.name || "", contacts: contacts.filter((c) => c.name) });
    setSaved(true);
    setTimeout(() => nav("/clientes"), 900);
  };

  return (
    <>
      <PageHeader title={es ? "Nuevo cliente" : "New client"} crumbs={[{ label: t("clientes"), to: "/clientes" }, { label: es ? "Nuevo" : "New" }]} />
      <form onSubmit={submit} className="max-w-4xl" data-testid="new-client-form">
        <Section title={es ? "Información general" : "General information"}>
          <Field label={es ? "Razón social" : "Legal name"} required><input data-testid="client-name-input" className="input" required value={form.name} onChange={set("name")} /></Field>
          <Field label={es ? "Nombre comercial" : "Trade name"} required><input data-testid="client-commercial-input" className="input" required value={form.commercial} onChange={set("commercial")} /></Field>
          <Field label="RFC / ID fiscal"><input data-testid="client-rfc-input" className="input" value={form.rfc} onChange={set("rfc")} /></Field>
          <Field label={es ? "Teléfono" : "Phone"}><input className="input" value={form.phone} onChange={set("phone")} /></Field>
          <Field label="Email"><input type="email" className="input" value={form.email} onChange={set("email")} /></Field>
          <Field label={es ? "Sitio web" : "Website"}><input className="input" value={form.web} onChange={set("web")} /></Field>
        </Section>
        <Section title={es ? "Dirección" : "Address"}>
          <Field label={es ? "Calle y número" : "Street & number"}><input className="input" value={form.street} onChange={set("street")} /></Field>
          <Field label={es ? "Ciudad" : "City"}><input data-testid="client-city-input" className="input" value={form.city} onChange={set("city")} /></Field>
          <Field label={es ? "Estado" : "State"}><input className="input" value={form.state} onChange={set("state")} /></Field>
          <Field label={es ? "País" : "Country"}><input className="input" value={form.country} onChange={set("country")} /></Field>
          <Field label="CP"><input className="input" value={form.zip} onChange={set("zip")} /></Field>
        </Section>
        <Section title={es ? "Información comercial" : "Commercial information"}>
          <Field label={es ? "Condiciones de pago" : "Payment terms"}>
            <select className="input" value={form.paymentTerms} onChange={set("paymentTerms")}><option>Contado</option><option>Crédito</option></select>
          </Field>
          <Field label={es ? "Días de crédito" : "Credit days"}><input type="number" className="input" value={form.creditDays} onChange={set("creditDays")} /></Field>
          <Field label={es ? "Moneda" : "Currency"}><select className="input" value={form.currency} onChange={set("currency")}><option>MXN</option><option>USD</option></select></Field>
          <Field label={es ? "Observaciones" : "Notes"}><input className="input" value={form.notes} onChange={set("notes")} /></Field>
        </Section>
        <div className="card p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <p className="font-heading font-semibold">{es ? "Contactos" : "Contacts"}</p>
            <button type="button" data-testid="add-contact-button" className="btn-secondary text-xs" onClick={() => setContacts((p) => [...p, { name: "", title: "", email: "", phone: "" }])}><Plus size={13} /> {es ? "Agregar contacto" : "Add contact"}</button>
          </div>
          {contacts.map((ct, i) => (
            <div key={i} className="grid md:grid-cols-5 gap-3 mb-3 items-end">
              <Field label={es ? "Nombre" : "Name"}><input className="input" value={ct.name} onChange={setC(i, "name")} /></Field>
              <Field label={es ? "Cargo" : "Title"}><input className="input" value={ct.title} onChange={setC(i, "title")} /></Field>
              <Field label="Email"><input className="input" value={ct.email} onChange={setC(i, "email")} /></Field>
              <Field label={es ? "Teléfono" : "Phone"}><input className="input" value={ct.phone} onChange={setC(i, "phone")} /></Field>
              <button type="button" className="btn-ghost text-rose-500 mb-1" onClick={() => setContacts((p) => p.filter((_, j) => j !== i))}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" className="btn-secondary" onClick={() => nav("/clientes")}>{t("cancelar")}</button>
          <button data-testid="save-client-button" type="submit" className="btn-primary">{saved ? (es ? "✓ Guardado" : "✓ Saved") : t("guardar")}</button>
        </div>
      </form>
    </>
  );
}
