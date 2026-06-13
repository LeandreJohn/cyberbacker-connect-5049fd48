import { queryOptions } from "@tanstack/react-query";
import * as api from "./api";

export const q = {
  currentUser: () => queryOptions({ queryKey: ["currentUser"], queryFn: api.getCurrentUser }),
  dashboardStats: () =>
    queryOptions({ queryKey: ["dashboardStats"], queryFn: api.getDashboardStats }),
  activityFeed: () => queryOptions({ queryKey: ["activityFeed"], queryFn: api.getActivityFeed }),
  cyberbackers: () => queryOptions({ queryKey: ["cyberbackers"], queryFn: api.getCyberbackers }),
  candidates: () => queryOptions({ queryKey: ["candidates"], queryFn: api.getCandidates }),
  attendance: () => queryOptions({ queryKey: ["attendance"], queryFn: api.getAttendance }),
  performanceTrend: () =>
    queryOptions({ queryKey: ["performanceTrend"], queryFn: api.getPerformanceTrend }),
  tickets: () => queryOptions({ queryKey: ["tickets"], queryFn: api.getTickets }),
  kbCategories: () => queryOptions({ queryKey: ["kbCategories"], queryFn: api.getKbCategories }),
  articles: () => queryOptions({ queryKey: ["articles"], queryFn: api.getArticles }),
  contracts: () => queryOptions({ queryKey: ["contracts"], queryFn: api.getContracts }),
  invoices: () => queryOptions({ queryKey: ["invoices"], queryFn: api.getInvoices }),
  paymentMethods: () =>
    queryOptions({ queryKey: ["paymentMethods"], queryFn: api.getPaymentMethods }),
  rewards: () => queryOptions({ queryKey: ["rewards"], queryFn: api.getRewards }),
  clientAccounts: () =>
    queryOptions({ queryKey: ["clientAccounts"], queryFn: api.getClientAccounts }),
  pipeline: () => queryOptions({ queryKey: ["pipeline"], queryFn: api.getPipeline }),
  revenueTrend: () => queryOptions({ queryKey: ["revenueTrend"], queryFn: api.getRevenueTrend }),
  acquisitionFunnel: () =>
    queryOptions({ queryKey: ["acquisitionFunnel"], queryFn: api.getAcquisitionFunnel }),
  systemUsers: () => queryOptions({ queryKey: ["systemUsers"], queryFn: api.getSystemUsers }),
  auditLog: () => queryOptions({ queryKey: ["auditLog"], queryFn: api.getAuditLog }),
  notifications: () =>
    queryOptions({ queryKey: ["notifications"], queryFn: api.getNotifications }),
};
