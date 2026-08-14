// Bilingual dictionary + status metadata
export const STATUS_META = {
  // generic / order
  borrador: { es: "Borrador", en: "Draft", tone: "gray" },
  recibida: { es: "Recibida", en: "Received", tone: "blue" },
  pendiente_asignacion: { es: "Pendiente de asignación", en: "Pending assignment", tone: "yellow" },
  en_proceso: { es: "En proceso", en: "In progress", tone: "blue" },
  pendiente_info: { es: "Pendiente de información", en: "Pending information", tone: "yellow" },
  en_revision: { es: "En revisión", en: "Under review", tone: "blue" },
  correccion: { es: "Corrección requerida", en: "Correction required", tone: "red" },
  aprobada: { es: "Aprobada", en: "Approved", tone: "green" },
  pendiente_facturacion: { es: "Pendiente de facturación", en: "Pending invoicing", tone: "yellow" },
  lista_entrega: { es: "Lista para entrega", en: "Ready for delivery", tone: "green" },
  cerrada: { es: "Cerrada", en: "Closed", tone: "gray" },
  cancelada: { es: "Cancelada", en: "Cancelled", tone: "gray" },
  // certificate
  en_preparacion: { es: "En preparación", en: "In preparation", tone: "blue" },
  enviado_revision: { es: "Enviado a revisión", en: "Sent to review", tone: "blue" },
  aprobado: { es: "Aprobado", en: "Approved", tone: "green" },
  liberado: { es: "Liberado", en: "Released", tone: "green" },
  rechazado: { es: "Rechazado", en: "Rejected", tone: "red" },
  // standards
  disponible: { es: "Disponible", en: "Available", tone: "green" },
  en_uso: { es: "En uso", en: "In use", tone: "blue" },
  en_calibracion: { es: "En calibración", en: "In calibration", tone: "blue" },
  mantenimiento: { es: "Mantenimiento", en: "Maintenance", tone: "yellow" },
  fuera_servicio: { es: "Fuera de servicio", en: "Out of service", tone: "gray" },
  vencido: { es: "Vencido", en: "Expired", tone: "red" },
  baja: { es: "Baja", en: "Retired", tone: "gray" },
  // invoices / quotes
  pendiente: { es: "Pendiente", en: "Pending", tone: "yellow" },
  parcial: { es: "Parcialmente pagada", en: "Partially paid", tone: "yellow" },
  pagada: { es: "Pagada", en: "Paid", tone: "green" },
  enviada: { es: "Enviada", en: "Sent", tone: "blue" },
  aceptada: { es: "Aceptada", en: "Accepted", tone: "green" },
  rechazada: { es: "Rechazada", en: "Rejected", tone: "red" },
  vencida: { es: "Vencida", en: "Overdue", tone: "red" },
  convertida: { es: "Convertida a OT", en: "Converted to WO", tone: "green" },
  // procedures / instruments / quality
  vigente: { es: "Vigente", en: "Current", tone: "green" },
  obsoleto: { es: "Obsoleto", en: "Obsolete", tone: "gray" },
  calibrado: { es: "Calibrado", en: "Calibrated", tone: "green" },
  abierta: { es: "Abierta", en: "Open", tone: "red" },
  activo: { es: "Activo", en: "Active", tone: "green" },
  inactivo: { es: "Inactivo", en: "Inactive", tone: "gray" },
  alta: { es: "Alta", en: "High", tone: "red" },
  normal: { es: "Normal", en: "Normal", tone: "blue" },
  urgente: { es: "Urgente", en: "Urgent", tone: "red" },
  baja_p: { es: "Baja", en: "Low", tone: "gray" },
};

export const ROLE_LABELS = {
  tecnico: { es: "Técnico de Laboratorio", en: "Lab Technician" },
  jefe: { es: "Jefe de Laboratorio", en: "Lab Manager" },
  finanzas: { es: "Finanzas", en: "Finance" },
  admin: { es: "Administrador", en: "Administrator" },
};

const D = {
  // navigation
  nav_operacion: ["Operación", "Operations"], nav_laboratorio: ["Laboratorio", "Laboratory"],
  nav_administracion: ["Administración", "Administration"], nav_sistema: ["Sistema", "System"],
  dashboard: ["Dashboard", "Dashboard"], clientes: ["Clientes", "Clients"],
  ordenes: ["Órdenes de Trabajo", "Work Orders"], instrumentos: ["Instrumentos", "Instruments"],
  certificados: ["Certificados", "Certificates"], patrones: ["Equipos y Patrones", "Equipment & Standards"],
  procedimientos: ["Procedimientos", "Procedures"], calidad: ["Calidad", "Quality"],
  finanzas: ["Finanzas", "Finance"], reportes: ["Reportes", "Reports"],
  usuarios: ["Usuarios", "Users"], auditoria: ["Auditoría", "Audit Log"], configuracion: ["Configuración", "Settings"],
  // common
  search_global: ["Buscar OT, certificado, cliente, serie...", "Search WO, certificate, client, serial..."],
  notificaciones: ["Notificaciones", "Notifications"], ver_todas: ["Ver todas las notificaciones", "View all notifications"],
  acciones: ["Acciones", "Actions"], ver: ["Ver", "View"], editar: ["Editar", "Edit"], estado: ["Estado", "Status"],
  cliente: ["Cliente", "Client"], tecnico: ["Técnico", "Technician"], fecha: ["Fecha", "Date"],
  guardar: ["Guardar", "Save"], cancelar: ["Cancelar", "Cancel"], buscar: ["Buscar", "Search"],
  filtros: ["Filtros", "Filters"], todos: ["Todos", "All"], total: ["Total", "Total"], saldo: ["Saldo", "Balance"],
  prioridad: ["Prioridad", "Priority"], descargar: ["Descargar", "Download"], siguiente: ["Siguiente", "Next"],
  anterior: ["Anterior", "Back"], crear: ["Crear", "Create"], nuevo: ["Nuevo", "New"], cerrar: ["Cerrar", "Close"],
  resumen: ["Resumen", "Summary"], historial: ["Historial", "History"], documentos: ["Documentos", "Documents"],
  actividad: ["Actividad", "Activity"], fecha_compromiso: ["Fecha compromiso", "Due date"],
  fecha_recepcion: ["Fecha recepción", "Received date"], magnitud: ["Magnitud", "Magnitude"],
  fabricante: ["Fabricante", "Manufacturer"], modelo: ["Modelo", "Model"], serie: ["Serie", "Serial"],
  sin_resultados: ["Sin resultados", "No results"], vista_previa: ["Vista previa", "Preview"],
  aprobar: ["Aprobar", "Approve"], rechazar: ["Rechazar", "Reject"],
  enviar_revision: ["Enviar a revisión", "Send to review"],
  logout: ["Cerrar sesión", "Sign out"], perfil: ["Perfil", "Profile"],
  cambiar_rol: ["Cambiar de rol (demo)", "Switch role (demo)"],
  modo_oscuro: ["Modo oscuro", "Dark mode"], modo_claro: ["Modo claro", "Light mode"],
  idioma: ["Idioma", "Language"],
  acceso_denegado: ["Acceso restringido", "Access restricted"],
  acceso_denegado_msg: ["No tienes permisos para consultar esta sección.", "You do not have permission to view this section."],
  volver_dashboard: ["Volver al dashboard", "Back to dashboard"],
  pagina_no_encontrada: ["Página no encontrada", "Page not found"],
  pagina_no_encontrada_msg: ["La página que buscas no existe o fue movida.", "The page you are looking for does not exist or was moved."],
};

export function makeT(lang) {
  const i = lang === "en" ? 1 : 0;
  return (key, fallback) => (D[key] ? D[key][i] : fallback ?? key);
}

export const money = (n) => "$" + Number(n).toLocaleString("es-MX");
