// Mock data — Phase 1 prototype. Will be replaced by real API in Phase 2.
const TECHS = ["Daniel Ramírez", "Juan Pérez", "Pedro Sánchez", "Ana Torres"];

export const clients = [
  { id: "CL-001", name: "Aeroespacial del Norte SA de CV", commercial: "AeroNorte", rfc: "AND120504QX1", city: "Monterrey", state: "Nuevo León", phone: "81 8340 2211", email: "compras@aeronorte.mx", web: "aeronorte.mx", contact: "Ing. Roberto Garza", activeOrders: 3, balance: 48500, status: "activo", paymentTerms: "Crédito", creditDays: 30, currency: "MXN", street: "Av. Fundidora 501", zip: "64010", country: "México", notes: "Cliente prioritario sector aeroespacial.", contacts: [ { name: "Ing. Roberto Garza", title: "Jefe de Calidad", email: "rgarza@aeronorte.mx", phone: "81 8340 2211" }, { name: "Lic. María Solís", title: "Compras", email: "msolis@aeronorte.mx", phone: "81 8340 2215" } ] },
  { id: "CL-002", name: "Electrónica Industrial Bajío SA", commercial: "EIB", rfc: "EIB980210KT4", city: "Querétaro", state: "Querétaro", phone: "442 215 7788", email: "lab@eib.com.mx", web: "eib.com.mx", contact: "Ing. Laura Medina", activeOrders: 2, balance: 12300, status: "activo", paymentTerms: "Contado", creditDays: 0, currency: "MXN", street: "Parque Ind. Benito Juárez 12", zip: "76120", country: "México", notes: "", contacts: [ { name: "Ing. Laura Medina", title: "Metrología", email: "lmedina@eib.com.mx", phone: "442 215 7788" } ] },
  { id: "CL-003", name: "TelecomRed de México SAPI", commercial: "TelecomRed", rfc: "TRM050822HH0", city: "Ciudad de México", state: "CDMX", phone: "55 5340 9080", email: "ingenieria@telecomred.mx", web: "telecomred.mx", contact: "Ing. Carlos Fuentes", activeOrders: 4, balance: 86200, status: "activo", paymentTerms: "Crédito", creditDays: 45, currency: "MXN", street: "Insurgentes Sur 1425", zip: "03920", country: "México", notes: "Equipos de RF y telecomunicaciones.", contacts: [ { name: "Ing. Carlos Fuentes", title: "Ingeniería RF", email: "cfuentes@telecomred.mx", phone: "55 5340 9080" } ] },
  { id: "CL-004", name: "Laboratorios Farma Vida SA de CV", commercial: "FarmaVida", rfc: "LFV110315PL8", city: "Guadalajara", state: "Jalisco", phone: "33 3642 1100", email: "calidad@farmavida.com", web: "farmavida.com", contact: "QFB. Elena Ríos", activeOrders: 1, balance: 0, status: "activo", paymentTerms: "Crédito", creditDays: 30, currency: "MXN", street: "Av. Patria 880", zip: "45030", country: "México", notes: "", contacts: [ { name: "QFB. Elena Ríos", title: "Aseguramiento de Calidad", email: "erios@farmavida.com", phone: "33 3642 1100" } ] },
  { id: "CL-005", name: "Energía y Potencia del Golfo SA", commercial: "EnerGolfo", rfc: "EPG090728WE2", city: "Veracruz", state: "Veracruz", phone: "229 934 5566", email: "mantenimiento@energolfo.mx", web: "energolfo.mx", contact: "Ing. Héctor Lara", activeOrders: 2, balance: 27800, status: "activo", paymentTerms: "Crédito", creditDays: 60, currency: "MXN", street: "Blvd. del Puerto 210", zip: "91700", country: "México", notes: "", contacts: [ { name: "Ing. Héctor Lara", title: "Mantenimiento", email: "hlara@energolfo.mx", phone: "229 934 5566" } ] },
  { id: "CL-006", name: "Automotriz Precisión MX S de RL", commercial: "AutoPrecisión", rfc: "APM140611RD5", city: "Saltillo", state: "Coahuila", phone: "844 415 3322", email: "metrologia@autoprecision.mx", web: "autoprecision.mx", contact: "Ing. Sofía Vega", activeOrders: 1, balance: 9400, status: "inactivo", paymentTerms: "Contado", creditDays: 0, currency: "MXN", street: "Carr. Monterrey Km 8.5", zip: "25270", country: "México", notes: "Reactivación pendiente de contrato.", contacts: [ { name: "Ing. Sofía Vega", title: "Metrología", email: "svega@autoprecision.mx", phone: "844 415 3322" } ] },
];

const CATALOG = [
  ["Spectrum Analyzer", "Keysight", "N9020A", "RF"],
  ["Signal Generator", "Rohde & Schwarz", "SMC100A", "RF"],
  ["Oscilloscope", "Tektronix", "MDO3054", "Tiempo"],
  ["Universal Counter", "Keysight", "53230A", "Frecuencia"],
  ["Power Meter", "Rohde & Schwarz", "NRP2", "RF"],
  ["Digital Multimeter", "Fluke", "8846A", "Eléctrica"],
  ["Power Supply", "Rigol", "DP832", "Eléctrica"],
  ["Signal Generator", "Keysight", "N5182B", "RF"],
  ["Spectrum Analyzer", "Rohde & Schwarz", "FSW26", "RF"],
  ["Oscilloscope", "Rigol", "DS1104Z", "Tiempo"],
  ["Digital Multimeter", "Keysight", "34465A", "Eléctrica"],
  ["Power Meter", "Keysight", "N1913A", "RF"],
  ["Frequency Counter", "Fluke", "PM6690", "Frecuencia"],
  ["Power Supply", "Keysight", "E36313A", "Eléctrica"],
  ["Thermometer", "Fluke", "1524", "Temperatura"],
];
const INSTR_STATUS = ["calibrado", "en_proceso", "pendiente", "en_revision"];

export const instruments = Array.from({ length: 30 }, (_, i) => {
  const c = CATALOG[i % CATALOG.length];
  const cl = clients[i % clients.length];
  return {
    id: `INS-${String(i + 1).padStart(3, "0")}`,
    name: c[0], manufacturer: c[1], model: c[2], magnitude: c[3],
    serial: `${["MY", "10", "C0", "SN"][i % 4]}${52310 + i * 137}`,
    clientId: cl.id, clientCode: `${cl.commercial.slice(0, 3).toUpperCase()}-EQ-${100 + i}`,
    range: c[3] === "RF" ? "9 kHz – 26.5 GHz" : c[3] === "Eléctrica" ? "0 – 1000 V / 10 A" : c[3] === "Temperatura" ? "-200 °C – 660 °C" : "DC – 350 MHz",
    resolution: c[3] === "Eléctrica" ? "6.5 dígitos" : c[3] === "Temperatura" ? "0.001 °C" : "1 Hz",
    lastCal: `2026-0${(i % 6) + 1}-1${i % 9}`,
    lastCert: `QLM-CC-0${240 + (i % 25)}-2026`,
    status: INSTR_STATUS[i % INSTR_STATUS.length],
  };
});

const ORDER_STATUS = ["en_proceso", "recibida", "en_revision", "pendiente_asignacion", "aprobada", "en_proceso", "correccion", "pendiente_facturacion", "lista_entrega", "cerrada", "en_proceso", "pendiente_info", "borrador", "cerrada", "cancelada"];
const PRIORITIES = ["alta", "normal", "normal", "urgente", "normal", "baja"];

export const orders = Array.from({ length: 15 }, (_, i) => {
  const cl = clients[i % clients.length];
  const ins = [instruments[i * 2 % 30].id, ...(i % 3 === 0 ? [instruments[(i * 2 + 1) % 30].id] : [])];
  return {
    id: `QLM-OT-2026-0${140 + i}`,
    clientId: cl.id, instrumentIds: ins,
    technician: TECHS[i % TECHS.length], chief: "Carlos López",
    received: `2026-06-${String(2 + (i % 12)).padStart(2, "0")}`,
    due: `2026-06-${String(15 + (i % 14)).padStart(2, "0")}`,
    priority: PRIORITIES[i % PRIORITIES.length],
    status: ORDER_STATUS[i],
    serviceType: i % 2 === 0 ? "Calibración en laboratorio" : "Calibración en sitio",
    location: i % 2 === 0 ? "Laboratorio Qualister" : cl.city,
    quoteId: `QLM-COT-2026-00${40 + i}`,
    notes: i % 4 === 0 ? "Cliente solicita entrega urgente con informe extendido." : "",
  };
});

const CERT_STATUS = ["en_revision", "borrador", "aprobado", "liberado", "rechazado", "enviado_revision", "en_preparacion", "liberado", "aprobado", "en_revision", "borrador", "liberado", "liberado", "aprobado", "en_revision", "liberado", "rechazado", "liberado", "aprobado", "liberado", "en_preparacion", "liberado", "borrador", "enviado_revision", "liberado"];
const PROCS = ["QLM-P-RF-01", "QLM-P-FRE-02", "QLM-P-TIE-03", "QLM-P-ELE-04", "QLM-P-TEM-05"];

export const certificates = Array.from({ length: 25 }, (_, i) => {
  const ins = instruments[i % 30];
  const ord = orders[i % 15];
  const status = CERT_STATUS[i];
  const base = [
    { date: "2026-06-10 09:15", event: "cert_created", user: TECHS[i % 4] },
    { date: "2026-06-10 10:37", event: "pdf1_uploaded", user: TECHS[i % 4] },
    { date: "2026-06-10 10:42", event: "pdf2_uploaded", user: TECHS[i % 4] },
  ];
  if (!["borrador", "en_preparacion"].includes(status)) base.push({ date: "2026-06-10 11:15", event: "sent_review", user: TECHS[i % 4] });
  if (["aprobado", "liberado"].includes(status)) base.push({ date: "2026-06-11 13:40", event: "approved", user: "Carlos López" });
  if (status === "liberado") base.push({ date: "2026-06-11 16:05", event: "released", user: "Carlos López" });
  if (status === "rechazado") base.push({ date: "2026-06-11 13:40", event: "rejected", user: "Carlos López" });
  return {
    id: `QLM-CC-0${240 + i}-2026`,
    orderId: ord.id, instrumentId: ins.id, clientId: ins.clientId,
    technician: TECHS[i % 4],
    calDate: `2026-06-${String(3 + (i % 10)).padStart(2, "0")}`,
    procedure: PROCS[i % 5],
    standardsUsed: ["PTR-001", "PTR-004"].slice(0, (i % 2) + 1),
    status,
    priority: PRIORITIES[i % PRIORITIES.length],
    sentDate: "2026-06-10", waiting: `${(i % 3) + 1} día(s)`,
    docs: [
      { key: "pdf1", name: `${240 + i}_parte1.pdf`, uploadedBy: TECHS[i % 4], date: "2026-06-10", size: "1.2 MB" },
      { key: "pdf2", name: `${240 + i}_parte2.pdf`, uploadedBy: TECHS[i % 4], date: "2026-06-10", size: "0.8 MB" },
    ],
    combined: !["borrador"].includes(status),
    rejection: status === "rechazado" ? { by: "Carlos López", reason: "Verificar información del patrón utilizado y reemplazar PDF 2.", category: "PDF incorrecto" } : null,
    timeline: base,
  };
});

const STD_STATUS = ["disponible", "en_uso", "disponible", "en_calibracion", "disponible", "mantenimiento", "disponible", "vencido", "disponible", "fuera_servicio"];
const STD_DAYS = [230, 145, 90, 60, 45, 30, 15, -12, 120, 75];

export const standards = Array.from({ length: 10 }, (_, i) => {
  const c = CATALOG[(i * 2) % CATALOG.length];
  const next = new Date(2026, 5, 14 + STD_DAYS[i]);
  return {
    id: `PTR-${String(i + 1).padStart(3, "0")}`,
    name: `Patrón ${c[0]}`, manufacturer: c[1], model: c[2],
    serial: `PT${88100 + i * 53}`, magnitude: c[3],
    range: c[3] === "RF" ? "100 kHz – 40 GHz" : "Rango completo",
    location: i % 2 === 0 ? "Lab. RF — Rack A" : "Lab. Eléctrica — Rack B",
    lastCal: "2025-07-10",
    nextCal: next.toISOString().slice(0, 10),
    daysToExpiry: STD_DAYS[i],
    status: STD_STATUS[i],
    externalProvider: i % 3 === 0 ? "CENAM" : "Lab. acreditado externo",
  };
});

export const procedures = [
  { code: "QLM-P-RF-01", name: "Calibración de generadores de señal RF", magnitude: "RF", revision: "C", effective: "2025-03-01", nextReview: "2027-03-01", status: "vigente", responsible: "Carlos López" },
  { code: "QLM-P-FRE-02", name: "Calibración de contadores universales de frecuencia", magnitude: "Frecuencia", revision: "B", effective: "2024-11-15", nextReview: "2026-11-15", status: "vigente", responsible: "Carlos López" },
  { code: "QLM-P-TIE-03", name: "Calibración de osciloscopios", magnitude: "Tiempo", revision: "D", effective: "2025-06-20", nextReview: "2027-06-20", status: "vigente", responsible: "Ana Torres" },
  { code: "QLM-P-ELE-04", name: "Calibración de multímetros digitales", magnitude: "Eléctrica", revision: "C", effective: "2025-01-10", nextReview: "2027-01-10", status: "vigente", responsible: "Juan Pérez" },
  { code: "QLM-P-TEM-05", name: "Calibración de termómetros de resistencia", magnitude: "Temperatura", revision: "A", effective: "2025-09-05", nextReview: "2026-09-05", status: "vigente", responsible: "Ana Torres" },
  { code: "QLM-P-RF-06", name: "Medición de potencia RF con sensores térmicos", magnitude: "RF", revision: "B", effective: "2024-08-12", nextReview: "2026-08-12", status: "vigente", responsible: "Carlos López" },
  { code: "QLM-P-ELE-07", name: "Calibración de fuentes de alimentación DC", magnitude: "Eléctrica", revision: "A", effective: "2026-02-01", nextReview: "2028-02-01", status: "vigente", responsible: "Juan Pérez" },
  { code: "QLM-P-RF-08", name: "Analizadores de espectro — verificación de amplitud", magnitude: "RF", revision: "A", effective: "2026-05-15", nextReview: "2028-05-15", status: "borrador", responsible: "Carlos López" },
  { code: "QLM-P-FRE-09", name: "Osciladores de referencia — estabilidad", magnitude: "Frecuencia", revision: "B", effective: "2023-04-01", nextReview: "2025-04-01", status: "obsoleto", responsible: "Carlos López" },
  { code: "QLM-P-TIE-10", name: "Bases de tiempo — intervalos y periodo", magnitude: "Tiempo", revision: "A", effective: "2025-12-01", nextReview: "2027-12-01", status: "vigente", responsible: "Ana Torres" },
];

const INV_STATUS = ["pendiente", "pagada", "vencida", "parcial", "pagada", "pendiente", "vencida", "pagada", "pendiente", "parcial"];
export const invoices = Array.from({ length: 10 }, (_, i) => {
  const cl = clients[i % 6];
  const total = 8500 + i * 4370;
  const st = INV_STATUS[i];
  return {
    id: `F-0${148 + i}`, clientId: cl.id, orderId: orders[i % 15].id,
    date: `2026-0${(i % 5) + 2}-1${i % 9}`, due: `2026-0${(i % 5) + 3}-1${i % 9}`,
    total, balance: st === "pagada" ? 0 : st === "parcial" ? Math.round(total * 0.4) : total,
    status: st,
    agingBucket: st === "vencida" ? (i % 2 === 0 ? "61-90" : "+90") : st === "pendiente" ? (i % 2 === 0 ? "0-30" : "31-60") : st === "parcial" ? "0-30" : null,
  };
});

const QUOTE_STATUS = ["enviada", "aceptada", "borrador", "convertida", "rechazada", "enviada", "vencida", "aceptada", "enviada", "convertida"];
export const quotes = Array.from({ length: 10 }, (_, i) => {
  const cl = clients[i % 6];
  return {
    id: `QLM-COT-2026-00${40 + i}`, clientId: cl.id,
    date: `2026-06-0${(i % 9) + 1}`, validity: "30 días",
    amount: 6200 + i * 3890, status: QUOTE_STATUS[i],
    items: [
      { service: "Calibración Signal Generator", qty: 1, price: 4200, discount: 0 },
      { service: "Calibración Spectrum Analyzer", qty: 1, price: 5800, discount: 5 },
    ],
    conditions: "Precios en MXN más IVA. Vigencia 30 días naturales.",
  };
});

export const payments = [
  { id: "P-001", clientId: "CL-001", invoiceId: "F-0149", date: "2026-06-05", amount: 12870, method: "Transferencia", reference: "SPEI-88231" },
  { id: "P-002", clientId: "CL-003", invoiceId: "F-0152", date: "2026-06-08", amount: 25980, method: "Transferencia", reference: "SPEI-90144" },
  { id: "P-003", clientId: "CL-002", invoiceId: "F-0151", date: "2026-06-10", amount: 8500, method: "Cheque", reference: "CHQ-0045" },
  { id: "P-004", clientId: "CL-005", invoiceId: "F-0155", date: "2026-06-11", amount: 15000, method: "Transferencia", reference: "SPEI-91002" },
  { id: "P-005", clientId: "CL-001", invoiceId: "F-0157", date: "2026-06-12", amount: 19600, method: "Transferencia", reference: "SPEI-91288" },
];

export const expenses = [
  { id: "G-001", date: "2026-06-02", category: "Calibraciones externas", supplier: "CENAM", description: "Calibración patrón PTR-001", orderId: "", amount: 18500, user: "Laura García" },
  { id: "G-002", date: "2026-06-04", category: "Envíos", supplier: "DHL", description: "Envío equipos a Querétaro", orderId: "QLM-OT-2026-0143", amount: 1240, user: "Laura García" },
  { id: "G-003", date: "2026-06-05", category: "Material", supplier: "Steren Industrial", description: "Cables RF y adaptadores N", orderId: "", amount: 3480, user: "Daniel Ramírez" },
  { id: "G-004", date: "2026-06-07", category: "Viáticos", supplier: "—", description: "Servicio en sitio Veracruz", orderId: "QLM-OT-2026-0144", amount: 5200, user: "Juan Pérez" },
  { id: "G-005", date: "2026-06-09", category: "Mantenimiento", supplier: "Clima Lab SA", description: "Mantenimiento HVAC laboratorio", orderId: "", amount: 7800, user: "Laura García" },
  { id: "G-006", date: "2026-06-10", category: "Reparaciones", supplier: "Keysight Service", description: "Reparación fuente E36313A", orderId: "", amount: 11200, user: "Carlos López" },
  { id: "G-007", date: "2026-06-11", category: "Equipos", supplier: "Fluke México", description: "Sensor de temperatura secundario", orderId: "", amount: 24600, user: "Carlos López" },
  { id: "G-008", date: "2026-06-12", category: "Otros", supplier: "Papelería Corp", description: "Consumibles de oficina", orderId: "", amount: 860, user: "Laura García" },
];

export const users = [
  { id: "U-001", username: "dramirez", name: "Daniel Ramírez", email: "daniel@qualister.mx", role: "tecnico", status: "activo", lastAccess: "2026-06-14 08:12" },
  { id: "U-002", username: "jperez", name: "Juan Pérez", email: "juan@qualister.mx", role: "tecnico", status: "activo", lastAccess: "2026-06-14 07:55" },
  { id: "U-003", username: "atorres", name: "Ana Torres", email: "ana@qualister.mx", role: "tecnico", status: "activo", lastAccess: "2026-06-13 17:40" },
  { id: "U-004", username: "clopez", name: "Carlos López", email: "carlos@qualister.mx", role: "jefe", status: "activo", lastAccess: "2026-06-14 08:30" },
  { id: "U-005", username: "lgarcia", name: "Laura García", email: "laura@qualister.mx", role: "finanzas", status: "activo", lastAccess: "2026-06-14 09:02" },
  { id: "U-006", username: "admin", name: "Miguel Ortega", email: "miguel@qualister.mx", role: "admin", status: "activo", lastAccess: "2026-06-14 09:15" },
];

export const auditLog = [
  { id: 1, datetime: "2026-06-14 09:15", user: "Miguel Ortega", role: "Administrador", module: "Usuarios", action: "Actualización", record: "U-003", ip: "192.168.1.24", before: "Estado: inactivo", after: "Estado: activo" },
  { id: 2, datetime: "2026-06-14 08:42", user: "Carlos López", role: "Jefe de Laboratorio", module: "Certificados", action: "Aprobación", record: "QLM-CC-0252-2026", ip: "192.168.1.11", before: "Estado: en revisión", after: "Estado: aprobado" },
  { id: 3, datetime: "2026-06-14 08:30", user: "Carlos López", role: "Jefe de Laboratorio", module: "Sesión", action: "Inicio de sesión", record: "—", ip: "192.168.1.11", before: "—", after: "—" },
  { id: 4, datetime: "2026-06-13 17:20", user: "Daniel Ramírez", role: "Técnico", module: "Certificados", action: "Envío a revisión", record: "QLM-CC-0258-2026", ip: "192.168.1.31", before: "Estado: en preparación", after: "Estado: enviado a revisión" },
  { id: 5, datetime: "2026-06-13 16:05", user: "Laura García", role: "Finanzas", module: "Cobranza", action: "Registro de pago", record: "F-0157", ip: "192.168.1.18", before: "Saldo: $19,600", after: "Saldo: $0" },
  { id: 6, datetime: "2026-06-13 14:48", user: "Daniel Ramírez", role: "Técnico", module: "Órdenes", action: "Creación", record: "QLM-OT-2026-0154", ip: "192.168.1.31", before: "—", after: "Estado: borrador" },
  { id: 7, datetime: "2026-06-13 12:10", user: "Ana Torres", role: "Técnico", module: "Instrumentos", action: "Alta", record: "INS-029", ip: "192.168.1.33", before: "—", after: "Registrado" },
  { id: 8, datetime: "2026-06-13 11:02", user: "Carlos López", role: "Jefe de Laboratorio", module: "Certificados", action: "Rechazo", record: "QLM-CC-0256-2026", ip: "192.168.1.11", before: "Estado: en revisión", after: "Estado: rechazado" },
  { id: 9, datetime: "2026-06-12 18:22", user: "Miguel Ortega", role: "Administrador", module: "Configuración", action: "Actualización", record: "Formato certificado", ip: "192.168.1.24", before: "QLM-CC-XXX-YY", after: "QLM-CC-XXXX-YEAR" },
  { id: 10, datetime: "2026-06-12 15:37", user: "Laura García", role: "Finanzas", module: "Facturas", action: "Emisión", record: "F-0157", ip: "192.168.1.18", before: "—", after: "Total: $19,600" },
  { id: 11, datetime: "2026-06-12 10:15", user: "Juan Pérez", role: "Técnico", module: "Certificados", action: "Carga de PDF", record: "QLM-CC-0250-2026", ip: "192.168.1.32", before: "—", after: "parte2.pdf" },
  { id: 12, datetime: "2026-06-11 09:44", user: "Miguel Ortega", role: "Administrador", module: "Usuarios", action: "Creación", record: "U-006", ip: "192.168.1.24", before: "—", after: "Rol: finanzas" },
];

export const notifications = [
  { id: 1, tone: "red", es: "Certificado QLM-CC-0256-2026 requiere corrección.", en: "Certificate QLM-CC-0256-2026 requires correction.", time: "hace 20 min", link: "/certificados/QLM-CC-0256-2026" },
  { id: 2, tone: "yellow", es: "Patrón PTR-007 vence en 15 días.", en: "Standard PTR-007 expires in 15 days.", time: "hace 1 h", link: "/patrones/PTR-007" },
  { id: 3, tone: "blue", es: "Nuevo certificado QLM-CC-0258-2026 esperando revisión.", en: "New certificate QLM-CC-0258-2026 awaiting review.", time: "hace 2 h", link: "/certificados/QLM-CC-0258-2026" },
  { id: 4, tone: "green", es: "Factura F-0152 pagada por TelecomRed.", en: "Invoice F-0152 paid by TelecomRed.", time: "hace 3 h", link: "/finanzas" },
  { id: 5, tone: "yellow", es: "OT QLM-OT-2026-0146 próxima a fecha compromiso.", en: "WO QLM-OT-2026-0146 close to due date.", time: "ayer", link: "/ordenes/QLM-OT-2026-0146" },
  { id: 6, tone: "red", es: "Patrón PTR-008 vencido — fuera de uso.", en: "Standard PTR-008 expired — out of use.", time: "ayer", link: "/patrones/PTR-008" },
];

export const nonconformities = [
  { folio: "NC-2026-011", type: "Trabajo no conforme", orderId: "QLM-OT-2026-0146", instrumentId: "INS-013", detectedBy: "Carlos López", responsible: "Daniel Ramírez", due: "2026-06-20", status: "abierta", description: "Se utilizó patrón con calibración próxima a vencer sin autorización documentada.", impact: "Medio", action: "Re-verificación de mediciones con patrón alterno." },
  { folio: "NC-2026-010", type: "Incidencia", orderId: "QLM-OT-2026-0144", instrumentId: "INS-007", detectedBy: "Ana Torres", responsible: "Juan Pérez", due: "2026-06-18", status: "en_proceso", description: "Instrumento recibido con daño físico no reportado en recepción.", impact: "Bajo", action: "Notificación al cliente y registro fotográfico." },
  { folio: "NC-2026-009", type: "Trabajo no conforme", orderId: "QLM-OT-2026-0141", instrumentId: "INS-003", detectedBy: "Carlos López", responsible: "Ana Torres", due: "2026-06-15", status: "en_proceso", description: "Desviación en condiciones ambientales durante calibración.", impact: "Alto", action: "Repetición del servicio bajo condiciones controladas." },
  { folio: "NC-2026-008", type: "Queja de cliente", orderId: "QLM-OT-2026-0139", instrumentId: "INS-020", detectedBy: "Laura García", responsible: "Carlos López", due: "2026-06-10", status: "cerrada", description: "Cliente reporta error tipográfico en certificado emitido.", impact: "Bajo", action: "Emisión de suplemento corregido." },
  { folio: "NC-2026-007", type: "Incidencia", orderId: "QLM-OT-2026-0138", instrumentId: "INS-015", detectedBy: "Daniel Ramírez", responsible: "Daniel Ramírez", due: "2026-06-05", status: "cerrada", description: "Falla intermitente en patrón PTR-005 durante servicio.", impact: "Medio", action: "Patrón enviado a mantenimiento." },
];

export const competencies = {
  magnitudes: ["RF", "Frecuencia", "Tiempo", "Temperatura", "Eléctrica"],
  rows: [
    { tech: "Daniel Ramírez", values: [true, true, true, false, true] },
    { tech: "Juan Pérez", values: [true, true, false, false, true] },
    { tech: "Ana Torres", values: [false, true, true, true, true] },
    { tech: "Pedro Sánchez", values: [true, false, true, true, false] },
  ],
};

export const priceList = [
  { code: "SRV-RF-01", service: "Calibración Signal Generator (hasta 6 GHz)", magnitude: "RF", price: 4200 },
  { code: "SRV-RF-02", service: "Calibración Spectrum Analyzer (hasta 26.5 GHz)", magnitude: "RF", price: 5800 },
  { code: "SRV-TIE-01", service: "Calibración Oscilloscope (hasta 500 MHz)", magnitude: "Tiempo", price: 3600 },
  { code: "SRV-FRE-01", service: "Calibración Universal Counter", magnitude: "Frecuencia", price: 2900 },
  { code: "SRV-ELE-01", service: "Calibración Digital Multimeter 6.5 díg.", magnitude: "Eléctrica", price: 2400 },
  { code: "SRV-ELE-02", service: "Calibración Power Supply", magnitude: "Eléctrica", price: 2100 },
  { code: "SRV-TEM-01", service: "Calibración Thermometer PRT", magnitude: "Temperatura", price: 3100 },
];

export const charts = {
  servicesPerMonth: [
    { m: "Ene", v: 32 }, { m: "Feb", v: 41 }, { m: "Mar", v: 38 }, { m: "Abr", v: 47 }, { m: "May", v: 52 }, { m: "Jun", v: 44 },
  ],
  ordersByState: [
    { name: "En proceso", value: 5, color: "#0284C7" }, { name: "En revisión", value: 3, color: "#38BDF8" },
    { name: "Pendientes", value: 3, color: "#F59E0B" }, { name: "Cerradas", value: 3, color: "#10B981" }, { name: "Canceladas", value: 1, color: "#94A3B8" },
  ],
  servicesByMagnitude: [
    { name: "RF", value: 38, color: "#0F172A" }, { name: "Frecuencia", value: 22, color: "#0284C7" },
    { name: "Tiempo", value: 15, color: "#38BDF8" }, { name: "Eléctrica", value: 18, color: "#64748B" }, { name: "Temperatura", value: 7, color: "#CBD5E1" },
  ],
  techWorkload: [
    { tech: "Daniel", activas: 6, cerradas: 14 }, { tech: "Juan", activas: 4, cerradas: 11 },
    { tech: "Ana", activas: 5, cerradas: 16 }, { tech: "Pedro", activas: 3, cerradas: 9 },
  ],
  deliveryTime: [
    { m: "Ene", d: 6.2 }, { m: "Feb", d: 5.8 }, { m: "Mar", d: 6.5 }, { m: "Abr", d: 5.1 }, { m: "May", d: 4.8 }, { m: "Jun", d: 5.3 },
  ],
  monthlyBilling: [
    { m: "Ene", fact: 182000, cob: 165000 }, { m: "Feb", fact: 214000, cob: 190000 }, { m: "Mar", fact: 198000, cob: 205000 },
    { m: "Abr", fact: 246000, cob: 221000 }, { m: "May", fact: 261000, cob: 240000 }, { m: "Jun", fact: 187400, cob: 152300 },
  ],
  salesByClient: [
    { name: "TelecomRed", value: 312000 }, { name: "AeroNorte", value: 265000 }, { name: "EIB", value: 148000 },
    { name: "EnerGolfo", value: 121000 }, { name: "FarmaVida", value: 87000 }, { name: "AutoPrecisión", value: 54000 },
  ],
  incomeVsExpenses: [
    { m: "Ene", ing: 165000, gas: 98000 }, { m: "Feb", ing: 190000, gas: 104000 }, { m: "Mar", ing: 205000, gas: 99000 },
    { m: "Abr", ing: 221000, gas: 112000 }, { m: "May", ing: 240000, gas: 118000 }, { m: "Jun", ing: 152300, gas: 72880 },
  ],
  aging: [
    { bucket: "0–30", value: 42300, color: "#10B981" }, { bucket: "31–60", value: 28900, color: "#F59E0B" },
    { bucket: "61–90", value: 15600, color: "#F97316" }, { bucket: "+90", value: 9800, color: "#E11D48" },
  ],
};

export const settingsMock = {
  company: { name: "Qualister Laboratorio de Metrología", rfc: "QLM150820XY9", address: "Av. Tecnológico 1200, Parque Industrial, Monterrey, N.L.", phone: "81 8000 1122", email: "contacto@qualister.mx", tagline: "The metrology guide" },
  formats: { order: "QLM-OT-YEAR-XXXX", certificate: "QLM-CC-XXXX-YEAR", quote: "QLM-COT-YEAR-XXXX" },
  magnitudes: ["RF", "Frecuencia", "Tiempo", "Temperatura", "Eléctrica"],
  instrumentTypes: ["Spectrum Analyzer", "Signal Generator", "Oscilloscope", "Universal Counter", "Power Meter", "Digital Multimeter", "Power Supply", "Thermometer"],
  serviceTypes: ["Calibración en laboratorio", "Calibración en sitio", "Verificación", "Ajuste"],
  currency: "MXN", tax: "IVA 16%", terms: "Pago a 30 días. Precios más IVA.",
};
