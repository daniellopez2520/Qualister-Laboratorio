// Data access layer. Phase 2: replace mock imports with real API calls (REACT_APP_BACKEND_URL).
import * as mock from "../data/mockData";

export const dataService = {
  getClients: () => [...mock.clients],
  getOrders: () => [...mock.orders],
  getInstruments: () => [...mock.instruments],
  getCertificates: () => mock.certificates.map((c) => ({ ...c, timeline: [...c.timeline] })),
  getStandards: () => [...mock.standards],
  getProcedures: () => [...mock.procedures],
  getInvoices: () => [...mock.invoices],
  getQuotes: () => [...mock.quotes],
  getPayments: () => [...mock.payments],
  getExpenses: () => [...mock.expenses],
  getUsers: () => [...mock.users],
  getAuditLog: () => [...mock.auditLog],
  getNotifications: () => [...mock.notifications],
  getNonconformities: () => [...mock.nonconformities],
  getCompetencies: () => mock.competencies,
  getPriceList: () => [...mock.priceList],
  getCharts: () => mock.charts,
  getSettings: () => mock.settingsMock,
};
