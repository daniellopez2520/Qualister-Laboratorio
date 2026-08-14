import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { ClientsList, ClientDetail, NewClient } from "./pages/Clients";
import { OrdersList, OrderDetail, NewOrderWizard } from "./pages/Orders";
import { InstrumentsList, InstrumentDetail } from "./pages/Instruments";
import { CertificatesList, CertificateDetail, CertificateReview } from "./pages/Certificates";
import { StandardsList, StandardDetail } from "./pages/Standards";
import Procedures from "./pages/Procedures";
import Quality from "./pages/Quality";
import Finance from "./pages/Finance";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Audit from "./pages/Audit";
import Settings from "./pages/Settings";
import { AccessDenied } from "./components/ui";
import { SearchX } from "lucide-react";

const PERMS = {
  "/clientes": ["tecnico", "jefe", "finanzas", "admin"],
  "/ordenes": ["tecnico", "jefe", "admin"],
  "/instrumentos": ["tecnico", "jefe", "admin"],
  "/certificados": ["tecnico", "jefe", "admin"],
  "/patrones": ["tecnico", "jefe", "admin"],
  "/procedimientos": ["tecnico", "jefe", "admin"],
  "/calidad": ["jefe", "admin"],
  "/finanzas": ["finanzas", "admin"],
  "/reportes": ["jefe", "finanzas", "admin"],
  "/usuarios": ["admin"],
  "/auditoria": ["admin"],
  "/configuracion": ["admin"],
};

function Guard({ children }) {
  const { role } = useApp();
  const loc = useLocation();
  if (!role) return <Navigate to="/login" replace />;
  const base = "/" + loc.pathname.split("/")[1];
  if (PERMS[base] && !PERMS[base].includes(role)) return <AccessDenied />;
  return children;
}

function NotFound() {
  const { t } = useApp();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center fade-up" data-testid="not-found">
      <SearchX size={40} className="text-slate-300 mb-4" />
      <h1 className="text-3xl font-heading font-bold">404</h1>
      <p className="font-semibold mt-1">{t("pagina_no_encontrada")}</p>
      <p className="text-slate-500 text-sm mt-1">{t("pagina_no_encontrada_msg")}</p>
    </div>
  );
}

function AppRoutes() {
  const { role } = useApp();
  return (
    <Routes>
      <Route path="/login" element={role ? <Navigate to="/" replace /> : <Login />} />
      <Route element={role ? <Layout /> : <Navigate to="/login" replace />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clientes" element={<Guard><ClientsList /></Guard>} />
        <Route path="/clientes/nuevo" element={<Guard><NewClient /></Guard>} />
        <Route path="/clientes/:id" element={<Guard><ClientDetail /></Guard>} />
        <Route path="/ordenes" element={<Guard><OrdersList /></Guard>} />
        <Route path="/ordenes/nueva" element={<Guard><NewOrderWizard /></Guard>} />
        <Route path="/ordenes/:id" element={<Guard><OrderDetail /></Guard>} />
        <Route path="/instrumentos" element={<Guard><InstrumentsList /></Guard>} />
        <Route path="/instrumentos/:id" element={<Guard><InstrumentDetail /></Guard>} />
        <Route path="/certificados" element={<Guard><CertificatesList /></Guard>} />
        <Route path="/certificados/:id" element={<Guard><CertificateDetail /></Guard>} />
        <Route path="/certificados/:id/revision" element={<Guard><CertificateReview /></Guard>} />
        <Route path="/patrones" element={<Guard><StandardsList /></Guard>} />
        <Route path="/patrones/:id" element={<Guard><StandardDetail /></Guard>} />
        <Route path="/procedimientos" element={<Guard><Procedures /></Guard>} />
        <Route path="/calidad" element={<Guard><Quality /></Guard>} />
        <Route path="/finanzas" element={<Guard><Finance /></Guard>} />
        <Route path="/reportes" element={<Guard><Reports /></Guard>} />
        <Route path="/usuarios" element={<Guard><Users /></Guard>} />
        <Route path="/auditoria" element={<Guard><Audit /></Guard>} />
        <Route path="/configuracion" element={<Guard><Settings /></Guard>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
