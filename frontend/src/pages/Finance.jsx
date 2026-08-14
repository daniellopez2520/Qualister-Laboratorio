import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Download, Eye, FileText, ArrowRightLeft, Wallet, Pencil, Check, X } from "lucide-react";
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useApp } from "../context/AppContext";
import { DataTable, StatusBadge, PageHeader, Tabs, KpiCard, Field, Modal, InfoRow } from "../components/ui";
import { ChartCard } from "./Dashboard";
import { money, STATUS_META } from "../i18n";

const tooltipStyle = { fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" };

function PriceRow({ p, es, t, updatePrice }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(p.price);
  const save = () => { updatePrice(p.code, val); setEditing(false); };
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150">
      <td className="table-td font-semibold">{p.code}</td>
      <td className="table-td">{p.service}</td>
      <td className="table-td">{p.magnitude}</td>
      <td className="table-td font-semibold">
        {editing ? (
          <input data-testid={`price-input-${p.code}`} type="number" className="input w-28 py-1" autoFocus value={val}
            onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save()} />
        ) : money(p.price)}
      </td>
      <td className="table-td">
        {editing ? (
          <div className="flex gap-1">
            <button data-testid={`price-save-${p.code}`} className="btn-primary text-xs px-2.5 py-1" onClick={save}><Check size={13} /> {t("guardar")}</button>
            <button className="btn-ghost text-xs" onClick={() => { setVal(p.price); setEditing(false); }}><X size={13} /></button>
          </div>
        ) : (
          <button data-testid={`price-edit-${p.code}`} className="btn-ghost text-xs" onClick={() => { setVal(p.price); setEditing(true); }}><Pencil size={13} /> {t("editar")}</button>
        )}
      </td>
    </tr>
  );
}

function QuoteEditor({ quote, onClose, es, t, clients }) {
  const [items, setItems] = useState(quote.items.map((i) => ({ ...i })));
  const subtotal = items.reduce((a, i) => a + i.qty * i.price * (1 - i.discount / 100), 0);
  const tax = subtotal * 0.16;
  const setItem = (idx, k) => (e) => setItems((p) => p.map((it, j) => (j === idx ? { ...it, [k]: k === "service" ? e.target.value : Number(e.target.value) } : it)));
  return (
    <div data-testid="quote-editor">
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <span><span className="text-slate-500">{t("cliente")}:</span> <b>{clients.find((c) => c.id === quote.clientId)?.commercial}</b></span>
        <span><span className="text-slate-500">{t("fecha")}:</span> <b>{quote.date}</b></span>
        <span><span className="text-slate-500">{es ? "Vigencia" : "Validity"}:</span> <b>{quote.validity}</b></span>
        <StatusBadge status={quote.status} />
      </div>
      <table className="w-full mb-3">
        <thead className="bg-slate-50 dark:bg-slate-800/60"><tr>
          <th className="table-th">{es ? "Servicio" : "Service"}</th><th className="table-th w-16">{es ? "Cant." : "Qty"}</th>
          <th className="table-th w-28">{es ? "P. unitario" : "Unit price"}</th><th className="table-th w-20">{es ? "Desc. %" : "Disc. %"}</th><th className="table-th w-28 text-right">Subtotal</th>
        </tr></thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map((it, i) => (
            <tr key={i}>
              <td className="p-1.5"><input className="input" value={it.service} onChange={setItem(i, "service")} /></td>
              <td className="p-1.5"><input type="number" className="input" value={it.qty} onChange={setItem(i, "qty")} /></td>
              <td className="p-1.5"><input type="number" className="input" value={it.price} onChange={setItem(i, "price")} /></td>
              <td className="p-1.5"><input type="number" className="input" value={it.discount} onChange={setItem(i, "discount")} /></td>
              <td className="p-1.5 text-right text-sm font-semibold">{money(it.qty * it.price * (1 - it.discount / 100))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button data-testid="quote-add-service" className="btn-secondary text-xs mb-4" onClick={() => setItems((p) => [...p, { service: "", qty: 1, price: 0, discount: 0 }])}><Plus size={13} /> {es ? "Agregar servicio" : "Add service"}</button>
      <div className="flex justify-end">
        <div className="w-56 text-sm space-y-1">
          <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">IVA 16%</span><span>{money(tax)}</span></div>
          <div className="flex justify-between font-bold text-base border-t border-slate-200 dark:border-slate-700 pt-1"><span>{t("total")}</span><span>{money(subtotal + tax)}</span></div>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-3">{quote.conditions}</p>
      <div className="flex flex-wrap justify-end gap-2 mt-4">
        <button className="btn-secondary text-xs"><Eye size={13} /> {t("vista_previa")}</button>
        <button className="btn-secondary text-xs"><Download size={13} /> {t("descargar")}</button>
        <button className="btn-secondary text-xs"><ArrowRightLeft size={13} /> {es ? "Convertir en OT" : "Convert to WO"}</button>
        <button data-testid="quote-save-button" className="btn-primary text-xs" onClick={onClose}>{t("guardar")}</button>
      </div>
    </div>
  );
}

export default function Finance() {
  const { t, lang, invoices, quotes, payments, expenses, clients, charts, priceList, registerPayment, updatePrice } = useApp();
  const es = lang === "es";
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "resumen";
  const setTab = (k) => setParams({ tab: k });
  const [payModal, setPayModal] = useState(false);
  const [payForm, setPayForm] = useState({ clientId: "CL-001", invoiceId: "", date: "2026-06-14", amount: "", method: "Transferencia", reference: "", notes: "" });
  const [paySaved, setPaySaved] = useState(false);
  const [selQuote, setSelQuote] = useState(null);
  const [selInvoice, setSelInvoice] = useState(null);
  const cname = (id) => clients.find((c) => c.id === id)?.commercial || id;

  const receivable = invoices.reduce((a, f) => a + f.balance, 0);
  const overdueAmt = invoices.filter((f) => f.status === "vencida").reduce((a, f) => a + f.balance, 0);
  const clientInvoices = useMemo(() => invoices.filter((f) => f.clientId === payForm.clientId && f.balance > 0), [invoices, payForm.clientId]);

  const tabs = [
    { key: "resumen", label: t("resumen") }, { key: "cotizaciones", label: es ? "Cotizaciones" : "Quotes" },
    { key: "tarifario", label: es ? "Tarifario" : "Price list" }, { key: "facturas", label: es ? "Facturas" : "Invoices" },
    { key: "cobranza", label: es ? "Cobranza" : "Collections" }, { key: "gastos", label: es ? "Gastos" : "Expenses" },
  ];

  const submitPay = (e) => {
    e.preventDefault();
    registerPayment(payForm);
    setPaySaved(true);
    setTimeout(() => { setPayModal(false); setPaySaved(false); setPayForm((p) => ({ ...p, invoiceId: "", amount: "", reference: "" })); }, 1000);
  };

  return (
    <>
      <PageHeader title={t("finanzas")} crumbs={[{ label: t("dashboard"), to: "/" }, { label: t("finanzas") }]}
        actions={<button data-testid="register-payment-button" className="btn-primary" onClick={() => setPayModal(true)}><Wallet size={15} /> {es ? "Registrar pago" : "Record payment"}</button>} />
      <div className="mb-4"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      {tab === "resumen" && (
        <div className="fade-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <KpiCard label={es ? "Facturación (jun)" : "Billing (Jun)"} value={money(187400)} tone="navy" />
            <KpiCard label={es ? "Cobrado (jun)" : "Collected (Jun)"} value={money(152300)} tone="green" />
            <KpiCard label={es ? "Por cobrar" : "Receivable"} value={money(receivable)} tone="yellow" />
            <KpiCard label={es ? "Gastos (jun)" : "Expenses (Jun)"} value={money(72880)} tone="gray" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <ChartCard title={es ? "Facturación mensual" : "Monthly billing"}>
              <BarChart data={charts.monthlyBilling}><XAxis dataKey="m" fontSize={11} /><YAxis fontSize={11} width={52} tickFormatter={(v) => "$" + v / 1000 + "k"} /><Tooltip contentStyle={tooltipStyle} formatter={(v) => money(v)} /><Legend wrapperStyle={{ fontSize: 11 }} /><Bar dataKey="fact" name={es ? "Facturado" : "Billed"} fill="#0F172A" radius={[4, 4, 0, 0]} /><Bar dataKey="cob" name={es ? "Cobrado" : "Collected"} fill="#38BDF8" radius={[4, 4, 0, 0]} /></BarChart>
            </ChartCard>
            <ChartCard title={es ? "Ventas por cliente" : "Sales by client"}>
              <BarChart data={charts.salesByClient} layout="vertical"><XAxis type="number" fontSize={11} tickFormatter={(v) => "$" + v / 1000 + "k"} /><YAxis type="category" dataKey="name" fontSize={11} width={90} /><Tooltip contentStyle={tooltipStyle} formatter={(v) => money(v)} /><Bar dataKey="value" name={es ? "Ventas" : "Sales"} fill="#0284C7" radius={[0, 4, 4, 0]} /></BarChart>
            </ChartCard>
          </div>
        </div>
      )}

      {tab === "cotizaciones" && (
        <div className="fade-up">
          <div className="flex justify-end mb-3"><button data-testid="new-quote-button" className="btn-primary" onClick={() => setSelQuote(quotes[0])}><Plus size={15} /> {es ? "Nueva cotización" : "New quote"}</button></div>
          <DataTable
            testId="quotes-table"
            columns={[es ? "Cotización" : "Quote", t("cliente"), t("fecha"), es ? "Vigencia" : "Validity", es ? "Importe" : "Amount", t("estado"), t("acciones")]}
            rows={quotes.map((q) => ({ ...q, clientName: cname(q.clientId) }))}
            searchKeys={["id", "clientName"]}
            filters={[{ key: "status", label: t("estado"), options: ["borrador", "enviada", "aceptada", "rechazada", "vencida", "convertida"].map((s) => ({ value: s, label: STATUS_META[s][lang] })) }]}
            renderRow={(q) => (
              <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150">
                <td className="table-td font-semibold text-sky-700 dark:text-sky-400 cursor-pointer" onClick={() => setSelQuote(q)}>{q.id}</td>
                <td className="table-td">{q.clientName}</td><td className="table-td">{q.date}</td><td className="table-td">{q.validity}</td>
                <td className="table-td font-semibold">{money(q.amount)}</td><td className="table-td"><StatusBadge status={q.status} /></td>
                <td className="table-td"><button data-testid={`view-quote-${q.id}`} className="btn-ghost" onClick={() => setSelQuote(q)}>{t("ver")}</button></td>
              </tr>
            )}
          />
        </div>
      )}

      {tab === "tarifario" && (
        <DataTable
          testId="pricelist-table"
          columns={[es ? "Código" : "Code", es ? "Servicio" : "Service", t("magnitud"), es ? "Precio" : "Price", t("acciones")]}
          rows={priceList}
          searchKeys={["code", "service"]}
          renderRow={(p) => <PriceRow key={p.code} p={p} es={es} t={t} updatePrice={updatePrice} />}
        />
      )}

      {tab === "facturas" && (
        <DataTable
          testId="invoices-table"
          columns={[es ? "Factura" : "Invoice", t("cliente"), "OT", t("fecha"), es ? "Vencimiento" : "Due", t("total"), t("saldo"), t("estado"), t("acciones")]}
          rows={invoices.map((f) => ({ ...f, clientName: cname(f.clientId) }))}
          searchKeys={["id", "clientName", "orderId"]}
          filters={[{ key: "status", label: t("estado"), options: ["pendiente", "parcial", "pagada", "vencida", "cancelada"].map((s) => ({ value: s, label: STATUS_META[s][lang] })) }]}
          renderRow={(f) => (
            <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150">
              <td className="table-td font-semibold text-sky-700 dark:text-sky-400 cursor-pointer" onClick={() => setSelInvoice(f)}>{f.id}</td>
              <td className="table-td">{f.clientName}</td><td className="table-td">{f.orderId}</td><td className="table-td">{f.date}</td><td className="table-td">{f.due}</td>
              <td className="table-td">{money(f.total)}</td><td className="table-td font-semibold">{money(f.balance)}</td>
              <td className="table-td"><StatusBadge status={f.status} /></td>
              <td className="table-td"><button data-testid={`view-invoice-${f.id}`} className="btn-ghost" onClick={() => setSelInvoice(f)}>{t("ver")}</button></td>
            </tr>
          )}
        />
      )}

      {tab === "cobranza" && (
        <div className="fade-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <KpiCard label={es ? "Total por cobrar" : "Total receivable"} value={money(receivable)} tone="yellow" />
            <KpiCard label={es ? "Vencido" : "Overdue"} value={money(overdueAmt)} tone="red" />
            <KpiCard label={es ? "Próximo a vencer" : "Due soon"} value={money(28900)} tone="yellow" />
            <KpiCard label={es ? "Cobrado este mes" : "Collected this month"} value={money(152300)} tone="green" />
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-5">
            <ChartCard title={es ? "Aging de cartera" : "Receivables aging"}>
              <BarChart data={charts.aging}><XAxis dataKey="bucket" fontSize={11} /><YAxis fontSize={11} width={52} tickFormatter={(v) => "$" + v / 1000 + "k"} /><Tooltip contentStyle={tooltipStyle} formatter={(v) => money(v)} /><Bar dataKey="value" name={es ? "Saldo" : "Balance"} radius={[4, 4, 0, 0]}>{charts.aging.map((e, i) => <Cell key={i} fill={e.color} />)}</Bar></BarChart>
            </ChartCard>
            <div className="card overflow-hidden">
              <p className="font-heading font-semibold text-sm p-4 pb-2">{es ? "Pagos recientes" : "Recent payments"}</p>
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800"><tr><th className="table-th">{t("fecha")}</th><th className="table-th">{t("cliente")}</th><th className="table-th">{es ? "Factura" : "Invoice"}</th><th className="table-th">{es ? "Importe" : "Amount"}</th><th className="table-th">{es ? "Método" : "Method"}</th></tr></thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {payments.slice(0, 6).map((p) => (
                    <tr key={p.id}><td className="table-td">{p.date}</td><td className="table-td">{cname(p.clientId)}</td><td className="table-td font-semibold">{p.invoiceId}</td><td className="table-td font-semibold text-emerald-600">{money(p.amount)}</td><td className="table-td">{p.method}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "gastos" && (
        <DataTable
          testId="expenses-table"
          columns={[t("fecha"), es ? "Categoría" : "Category", es ? "Proveedor" : "Supplier", es ? "Descripción" : "Description", "OT", es ? "Monto" : "Amount", es ? "Usuario" : "User"]}
          rows={expenses}
          searchKeys={["category", "supplier", "description"]}
          filters={[{ key: "category", label: es ? "Categoría" : "Category", options: [...new Set(expenses.map((g) => g.category))].map((c) => ({ value: c, label: c })) }]}
          renderRow={(g) => (
            <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <td className="table-td">{g.date}</td><td className="table-td">{g.category}</td><td className="table-td">{g.supplier}</td>
              <td className="table-td max-w-[240px] truncate">{g.description}</td><td className="table-td">{g.orderId || "—"}</td>
              <td className="table-td font-semibold">{money(g.amount)}</td><td className="table-td">{g.user}</td>
            </tr>
          )}
        />
      )}

      <Modal open={payModal} onClose={() => setPayModal(false)} title={es ? "Registrar pago" : "Record payment"}>
        {paySaved ? (
          <p className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold text-sm" data-testid="payment-saved-message">✓ {es ? "Pago registrado. Saldos actualizados." : "Payment recorded. Balances updated."}</p>
        ) : (
          <form onSubmit={submitPay} className="grid grid-cols-2 gap-3" data-testid="payment-form">
            <Field label={t("cliente")} required>
              <select data-testid="payment-client-select" className="input" value={payForm.clientId} onChange={(e) => setPayForm((p) => ({ ...p, clientId: e.target.value, invoiceId: "" }))}>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.commercial}</option>)}
              </select>
            </Field>
            <Field label={es ? "Factura" : "Invoice"} required>
              <select data-testid="payment-invoice-select" className="input" required value={payForm.invoiceId} onChange={(e) => setPayForm((p) => ({ ...p, invoiceId: e.target.value }))}>
                <option value="">—</option>
                {clientInvoices.map((f) => <option key={f.id} value={f.id}>{f.id} · {money(f.balance)}</option>)}
              </select>
            </Field>
            <Field label={t("fecha")}><input type="date" className="input" value={payForm.date} onChange={(e) => setPayForm((p) => ({ ...p, date: e.target.value }))} /></Field>
            <Field label={es ? "Importe" : "Amount"} required><input data-testid="payment-amount-input" type="number" className="input" required value={payForm.amount} onChange={(e) => setPayForm((p) => ({ ...p, amount: e.target.value }))} /></Field>
            <Field label={es ? "Método" : "Method"}><select className="input" value={payForm.method} onChange={(e) => setPayForm((p) => ({ ...p, method: e.target.value }))}><option>Transferencia</option><option>Cheque</option><option>Efectivo</option><option>Tarjeta</option></select></Field>
            <Field label={es ? "Referencia" : "Reference"}><input className="input" value={payForm.reference} onChange={(e) => setPayForm((p) => ({ ...p, reference: e.target.value }))} /></Field>
            <div className="col-span-2"><Field label={es ? "Comprobante" : "Receipt"}><div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-md p-3 text-center text-xs text-slate-400"><FileText size={16} className="mx-auto mb-1" />{es ? "Arrastra o haz clic para subir (demo)" : "Drag or click to upload (demo)"}</div></Field></div>
            <div className="col-span-2"><Field label={es ? "Observaciones" : "Notes"}><input className="input" value={payForm.notes} onChange={(e) => setPayForm((p) => ({ ...p, notes: e.target.value }))} /></Field></div>
            <div className="col-span-2 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setPayModal(false)}>{t("cancelar")}</button>
              <button data-testid="save-payment-button" type="submit" className="btn-primary">{t("guardar")}</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={!!selQuote} onClose={() => setSelQuote(null)} title={selQuote?.id} wide>
        {selQuote && <QuoteEditor quote={selQuote} onClose={() => setSelQuote(null)} es={es} t={t} clients={clients} />}
      </Modal>

      <Modal open={!!selInvoice} onClose={() => setSelInvoice(null)} title={selInvoice?.id}>
        {selInvoice && (
          <div data-testid="invoice-detail-modal">
            <div className="flex items-center gap-2 mb-3"><StatusBadge status={selInvoice.status} /></div>
            <InfoRow label={t("cliente")} value={cname(selInvoice.clientId)} />
            <InfoRow label="RFC" value={clients.find((c) => c.id === selInvoice.clientId)?.rfc} />
            <InfoRow label="OT" value={selInvoice.orderId} />
            <InfoRow label={es ? "Cotización" : "Quote"} value={quotes.find((q) => q.clientId === selInvoice.clientId)?.id || "—"} />
            <InfoRow label={t("fecha")} value={selInvoice.date} />
            <InfoRow label={es ? "Vencimiento" : "Due"} value={selInvoice.due} />
            <InfoRow label={t("total")} value={money(selInvoice.total)} />
            <InfoRow label={t("saldo")} value={money(selInvoice.balance)} />
            <p className="overline-label mt-4 mb-2">{es ? "Pagos" : "Payments"}</p>
            {payments.filter((p) => p.invoiceId === selInvoice.id).map((p) => (
              <p key={p.id} className="text-sm py-1 border-b border-slate-100 dark:border-slate-800 flex justify-between"><span>{p.date} · {p.method}</span><span className="font-semibold text-emerald-600">{money(p.amount)}</span></p>
            ))}
            {payments.filter((p) => p.invoiceId === selInvoice.id).length === 0 && <p className="text-sm text-slate-400">{es ? "Sin pagos registrados." : "No payments recorded."}</p>}
          </div>
        )}
      </Modal>
    </>
  );
}
