import React from "react";
import { FilePlus, Upload, Send, CheckCircle2, XCircle, BadgeCheck, PenLine, Eye } from "lucide-react";
import { useApp } from "../context/AppContext";

const EVENT_META = {
  cert_created: { es: "creó el certificado", en: "created the certificate", icon: FilePlus, tone: "text-slate-500" },
  pdf1_uploaded: { es: "cargó PDF 1", en: "uploaded PDF 1", icon: Upload, tone: "text-sky-500" },
  pdf2_uploaded: { es: "cargó PDF 2", en: "uploaded PDF 2", icon: Upload, tone: "text-sky-500" },
  pdf_replaced: { es: "sustituyó un PDF", en: "replaced a PDF", icon: Upload, tone: "text-sky-500" },
  sent_review: { es: "envió a revisión", en: "sent to review", icon: Send, tone: "text-blue-500" },
  review_started: { es: "inició la revisión", en: "started the review", icon: Eye, tone: "text-blue-500" },
  approved: { es: "aprobó el certificado", en: "approved the certificate", icon: CheckCircle2, tone: "text-emerald-500" },
  released: { es: "liberó el certificado", en: "released the certificate", icon: BadgeCheck, tone: "text-emerald-600" },
  rejected: { es: "rechazó el certificado", en: "rejected the certificate", icon: XCircle, tone: "text-rose-500" },
  in_prep: { es: "pasó a preparación", en: "moved to preparation", icon: PenLine, tone: "text-slate-500" },
};

export default function Timeline({ items }) {
  const { lang } = useApp();
  return (
    <ol className="relative ml-2" data-testid="activity-timeline">
      {items.map((it, i) => {
        const meta = EVENT_META[it.event] || { es: it.event, en: it.event, icon: PenLine, tone: "text-slate-400" };
        const Icon = meta.icon;
        return (
          <li key={i} className="relative pl-8 pb-5 last:pb-0">
            {i < items.length - 1 && <span className="absolute left-[11px] top-6 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />}
            <span className={`absolute left-0 top-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center ${meta.tone}`}>
              <Icon size={13} />
            </span>
            <p className="text-xs text-slate-400 font-medium">{it.date}</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">{it.user}</span> {lang === "en" ? meta.en : meta.es}.
            </p>
            {it.note && <p className="text-xs text-slate-500 italic mt-0.5">"{it.note}"</p>}
          </li>
        );
      })}
    </ol>
  );
}
