import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { dataService } from "../services/dataService";
import { makeT } from "../i18n";

const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

export function AppProvider({ children }) {
  const [role, setRoleState] = useState(() => sessionStorage.getItem("qlm_role") || null);
  const setRole = useCallback((r) => {
    if (r) sessionStorage.setItem("qlm_role", r); else sessionStorage.removeItem("qlm_role");
    setRoleState(r);
  }, []);
  const [lang, setLang] = useState("es");
  const [dark, setDark] = useState(false);

  const [clients, setClients] = useState(dataService.getClients);
  const [orders, setOrders] = useState(dataService.getOrders);
  const [instruments, setInstruments] = useState(dataService.getInstruments);
  const [certificates, setCertificates] = useState(dataService.getCertificates);
  const [invoices, setInvoices] = useState(dataService.getInvoices);
  const [payments, setPayments] = useState(dataService.getPayments);
  const [usersList, setUsersList] = useState(dataService.getUsers);
  const [notifs, setNotifs] = useState(dataService.getNotifications);

  const standards = dataService.getStandards();
  const procedures = dataService.getProcedures();
  const quotes = dataService.getQuotes();
  const expenses = dataService.getExpenses();
  const auditLog = dataService.getAuditLog();
  const nonconformities = dataService.getNonconformities();
  const competencies = dataService.getCompetencies();
  const priceList = dataService.getPriceList();
  const charts = dataService.getCharts();
  const settings = dataService.getSettings();

  const t = useMemo(() => makeT(lang), [lang]);

  const toggleDark = useCallback(() => {
    setDark((d) => {
      document.documentElement.classList.toggle("dark", !d);
      return !d;
    });
  }, []);

  const now = () => "2026-06-14 " + new Date().toTimeString().slice(0, 5);

  const updateCertStatus = useCallback((certId, status, extra = {}) => {
    setCertificates((prev) =>
      prev.map((c) => {
        if (c.id !== certId) return c;
        const ev = { borrador: "cert_created", en_preparacion: "in_prep", enviado_revision: "sent_review", en_revision: "review_started", aprobado: "approved", liberado: "released", rechazado: "rejected" }[status];
        return { ...c, status, ...extra, timeline: [...c.timeline, { date: now(), event: ev, user: extra.actor || "Usuario demo" }] };
      })
    );
  }, []);

  const registerPayment = useCallback((pay) => {
    setPayments((prev) => [{ id: `P-${String(prev.length + 1).padStart(3, "0")}`, ...pay }, ...prev]);
    setInvoices((prev) =>
      prev.map((f) => {
        if (f.id !== pay.invoiceId) return f;
        const nb = Math.max(0, f.balance - Number(pay.amount || 0));
        return { ...f, balance: nb, status: nb === 0 ? "pagada" : "parcial" };
      })
    );
  }, []);

  const addClient = useCallback((c) => {
    setClients((prev) => [{ id: `CL-${String(prev.length + 1).padStart(3, "0")}`, activeOrders: 0, balance: 0, status: "activo", contacts: [], ...c }, ...prev]);
  }, []);

  const addOrder = useCallback((o) => {
    const id = `QLM-OT-2026-0${155 + Math.floor(Math.random() * 40)}`;
    setOrders((prev) => [{ id, status: "recibida", ...o }, ...prev]);
    return id;
  }, []);

  const addInstrument = useCallback((ins) => {
    setInstruments((prev) => [{ id: `INS-${String(prev.length + 1).padStart(3, "0")}`, status: "pendiente", lastCal: "—", lastCert: "—", ...ins }, ...prev]);
  }, []);

  const addUser = useCallback((u) => {
    setUsersList((prev) => [{ id: `U-${String(prev.length + 1).padStart(3, "0")}`, lastAccess: "—", ...u }, ...prev]);
  }, []);

  const dismissNotif = useCallback((id) => setNotifs((prev) => prev.filter((n) => n.id !== id)), []);

  const value = {
    role, setRole, lang, setLang, dark, toggleDark, t,
    clients, orders, instruments, certificates, invoices, payments, usersList, notifs,
    standards, procedures, quotes, expenses, auditLog, nonconformities, competencies, priceList, charts, settings,
    updateCertStatus, registerPayment, addClient, addOrder, addInstrument, addUser, dismissNotif,
  };
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
