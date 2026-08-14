import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Ruler, Waves, Timer, Thermometer } from "lucide-react";
import { useApp } from "../context/AppContext";
import { LOGO } from "../components/Layout";
import { ROLE_LABELS } from "../i18n";

export default function Login() {
  const { setRole, lang, setLang } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState("daniel@qualister.mx");
  const [pwd, setPwd] = useState("demo1234");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [selRole, setSelRole] = useState("tecnico");
  const [loading, setLoading] = useState(false);
  const es = lang === "es";

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setRole(selRole); nav("/"); }, 600);
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Visual side */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] relative overflow-hidden p-12 bg-slate-900">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#38BDF8 1px, transparent 1px), linear-gradient(90deg, #38BDF8 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full border border-sky-500/20" />
        <div className="absolute -bottom-24 -right-24 w-[320px] h-[320px] rounded-full border border-sky-500/30" />
        <img src={LOGO} alt="Qualister" className="h-12 w-fit object-contain relative" />
        <div className="relative">
          <p className="text-sky-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">{es ? "Sistema de gestión de laboratorio" : "Laboratory management system"}</p>
          <h1 className="text-4xl font-heading font-bold text-white tracking-tight leading-tight">
            {es ? "Precisión y trazabilidad en cada calibración." : "Precision and traceability in every calibration."}
          </h1>
          <p className="text-slate-400 mt-4 max-w-md">
            {es ? "Administra órdenes, instrumentos, certificados, patrones y finanzas desde una sola plataforma." : "Manage orders, instruments, certificates, standards and finance from a single platform."}
          </p>
          <div className="flex gap-6 mt-8">
            {[[Waves, "RF"], [Ruler, es ? "Eléctrica" : "Electrical"], [Timer, es ? "Tiempo y frecuencia" : "Time & frequency"], [Thermometer, es ? "Temperatura" : "Temperature"]].map(([I, l], i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <I size={15} className="text-sky-400" /> {l}
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-600 text-xs relative">© 2026 Qualister Laboratorio de Metrología · The metrology guide</p>
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <form onSubmit={submit} className="w-full max-w-sm fade-up" data-testid="login-form">
          <img src={LOGO} alt="Qualister" className="h-11 object-contain mb-8 lg:hidden mx-auto rounded" />
          <h2 className="text-2xl font-heading font-bold tracking-tight text-slate-900 dark:text-white">{es ? "Iniciar sesión" : "Sign in"}</h2>
          <p className="text-sm text-slate-500 mt-1 mb-7">Qualister Laboratorio de Metrología</p>

          <label className="block mb-4">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{es ? "Email o usuario" : "Email or username"}</span>
            <input data-testid="login-email-input" className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="block mb-4">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{es ? "Contraseña" : "Password"}</span>
            <div className="relative mt-1">
              <input data-testid="login-password-input" type={show ? "text" : "password"} className="input pr-10" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
              <button type="button" data-testid="toggle-password-visibility" onClick={() => setShow(!show)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <label className="block mb-4">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{es ? "Perfil de demostración (Fase 1)" : "Demo profile (Phase 1)"}</span>
            <select data-testid="login-role-select" className="input mt-1" value={selRole} onChange={(e) => setSelRole(e.target.value)}>
              {Object.keys(ROLE_LABELS).map((r) => <option key={r} value={r}>{ROLE_LABELS[r][lang]}</option>)}
            </select>
          </label>

          <div className="flex items-center justify-between mb-6 text-sm">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer">
              <input data-testid="remember-me-checkbox" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-sky-600" />
              {es ? "Recordarme" : "Remember me"}
            </label>
            <button type="button" data-testid="forgot-password-link" className="text-sky-600 dark:text-sky-400 font-semibold hover:underline" onClick={() => alert(es ? "Recuperación de contraseña disponible en Fase 2." : "Password recovery available in Phase 2.")}>
              {es ? "Recuperar contraseña" : "Forgot password"}
            </button>
          </div>

          <button data-testid="login-submit-button" type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 disabled:opacity-60">
            {loading ? (es ? "Ingresando…" : "Signing in…") : (<><LogIn size={16} /> {es ? "Iniciar sesión" : "Sign in"}</>)}
          </button>

          <button type="button" data-testid="login-language-toggle" onClick={() => setLang(es ? "en" : "es")} className="mt-6 text-xs text-slate-400 hover:text-sky-600 mx-auto block transition-colors duration-200">
            {es ? "Switch to English" : "Cambiar a Español"}
          </button>
          <p className="text-[11px] text-slate-400 text-center mt-3">{es ? "Prototipo Fase 1 — cualquier credencial es válida." : "Phase 1 prototype — any credentials are valid."}</p>
        </form>
      </div>
    </div>
  );
}
