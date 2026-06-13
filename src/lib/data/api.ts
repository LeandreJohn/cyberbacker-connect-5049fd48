// API-ready service layer.
//
// These async functions currently resolve mock data, but their signatures and
// return shapes mirror the future FastAPI REST endpoints. To switch to the live
// backend, set VITE_API_BASE and replace each `mock(...)` call with the matching
// `fetchJson(...)` call already stubbed in comments below.

import * as mock from "./mock";
import type {
  ActivityItem,
  Article,
  AttendanceEntry,
  AuditEntry,
  Candidate,
  ClientAccount,
  Contract,
  CurrentUser,
  Cyberbacker,
  FunnelStep,
  Invoice,
  KbCategory,
  KpiStat,
  Notification,
  PaymentMethod,
  PerformancePoint,
  PipelineCandidate,
  RevenuePoint,
  Reward,
  SystemUser,
  Ticket,
} from "./types";

export const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

// Simulate network latency so loading states are visible.
function mockResponse<T>(data: T, delay = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

// Real implementation to use once FastAPI is connected:
// async function fetchJson<T>(path: string): Promise<T> {
//   const res = await fetch(`${API_BASE}${path}`, {
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//   });
//   if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
//   return (await res.json()) as T;
// }

export const getCurrentUser = (): Promise<CurrentUser> => mockResponse(mock.currentUser);
export const getDashboardStats = (): Promise<KpiStat[]> => mockResponse(mock.dashboardStats);
export const getActivityFeed = (): Promise<ActivityItem[]> => mockResponse(mock.activityFeed);
export const getCyberbackers = (): Promise<Cyberbacker[]> => mockResponse(mock.cyberbackers);
export const getCandidates = (): Promise<Candidate[]> => mockResponse(mock.candidates);
export const getAttendance = (): Promise<AttendanceEntry[]> => mockResponse(mock.attendance);
export const getPerformanceTrend = (): Promise<PerformancePoint[]> =>
  mockResponse(mock.performanceTrend);
export const getTickets = (): Promise<Ticket[]> => mockResponse(mock.tickets);
export const getKbCategories = (): Promise<KbCategory[]> => mockResponse(mock.kbCategories);
export const getArticles = (): Promise<Article[]> => mockResponse(mock.articles);
export const getContracts = (): Promise<Contract[]> => mockResponse(mock.contracts);
export const getInvoices = (): Promise<Invoice[]> => mockResponse(mock.invoices);
export const getPaymentMethods = (): Promise<PaymentMethod[]> =>
  mockResponse(mock.paymentMethods);
export const getRewards = (): Promise<Reward[]> => mockResponse(mock.rewards);
export const getClientAccounts = (): Promise<ClientAccount[]> =>
  mockResponse(mock.clientAccounts);
export const getPipeline = (): Promise<PipelineCandidate[]> => mockResponse(mock.pipeline);
export const getRevenueTrend = (): Promise<RevenuePoint[]> => mockResponse(mock.revenueTrend);
export const getAcquisitionFunnel = (): Promise<FunnelStep[]> =>
  mockResponse(mock.acquisitionFunnel);
export const getSystemUsers = (): Promise<SystemUser[]> => mockResponse(mock.systemUsers);
export const getAuditLog = (): Promise<AuditEntry[]> => mockResponse(mock.auditLog);
export const getNotifications = (): Promise<Notification[]> => mockResponse(mock.notifications);
