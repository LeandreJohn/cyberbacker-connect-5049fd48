import type {
  ActivityItem,
  Announcement,
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
  Renewal,
  RevenuePoint,
  Reward,
  SystemUser,
  Ticket,
} from "./types";

export const currentUser: CurrentUser = {
  id: "u_001",
  name: "Jordan Avery",
  email: "jordan.avery@brightpath.co",
  role: "Client",
  company: "BrightPath Ventures",
  initials: "JA",
};

export const dashboardStats: KpiStat[] = [
  { id: "k1", label: "Active Cyberbackers", value: "6", change: 12.5, trend: "up", hint: "vs last month" },
  { id: "k2", label: "Hours This Week", value: "214", change: 8.1, trend: "up", hint: "of 240 capacity" },
  { id: "k3", label: "Avg. Performance", value: "94%", change: 2.4, trend: "up", hint: "team average" },
  { id: "k4", label: "Open Tickets", value: "3", change: -25, trend: "down", hint: "vs last week" },
];

export const activityFeed: ActivityItem[] = [
  { id: "a1", actor: "Maya Lin", initials: "ML", action: "submitted a weekly report for", target: "Inbox Management", time: "12m ago" },
  { id: "a2", actor: "Recruitment", initials: "RC", action: "matched a new candidate for", target: "Executive Assistant role", time: "1h ago" },
  { id: "a3", actor: "Diego Santos", initials: "DS", action: "clocked in for", target: "Tuesday shift", time: "3h ago" },
  { id: "a4", actor: "Finance", initials: "FN", action: "issued invoice", target: "#INV-2048", time: "5h ago" },
  { id: "a5", actor: "Priya Nair", initials: "PN", action: "completed onboarding for", target: "Social Media Management", time: "1d ago" },
];

export const cyberbackers: Cyberbacker[] = [
  { id: "cb1", name: "Maya Lin", initials: "ML", role: "Executive Assistant", status: "active", hoursThisWeek: 38, weeklyCapacity: 40, performance: 96, startedOn: "2024-08-12", email: "maya.lin@cyberbacker.com", timezone: "PHT (GMT+8)", skills: ["Calendar", "Inbox", "Travel"] },
  { id: "cb2", name: "Diego Santos", initials: "DS", role: "Bookkeeper", status: "active", hoursThisWeek: 40, weeklyCapacity: 40, performance: 92, startedOn: "2024-05-03", email: "diego.santos@cyberbacker.com", timezone: "PHT (GMT+8)", skills: ["QuickBooks", "Payroll", "AR/AP"] },
  { id: "cb3", name: "Priya Nair", initials: "PN", role: "Social Media Manager", status: "active", hoursThisWeek: 32, weeklyCapacity: 40, performance: 89, startedOn: "2025-01-20", email: "priya.nair@cyberbacker.com", timezone: "IST (GMT+5:30)", skills: ["Content", "Canva", "Analytics"] },
  { id: "cb4", name: "Tomas Reyes", initials: "TR", role: "Customer Support", status: "onboarding", hoursThisWeek: 14, weeklyCapacity: 40, performance: 78, startedOn: "2026-06-01", email: "tomas.reyes@cyberbacker.com", timezone: "PHT (GMT+8)", skills: ["Zendesk", "Chat", "Email"] },
  { id: "cb5", name: "Hana Kim", initials: "HK", role: "Data Entry Specialist", status: "active", hoursThisWeek: 36, weeklyCapacity: 40, performance: 94, startedOn: "2024-11-08", email: "hana.kim@cyberbacker.com", timezone: "KST (GMT+9)", skills: ["Excel", "CRM", "Research"] },
  { id: "cb6", name: "Liam Walsh", initials: "LW", role: "Marketing Assistant", status: "paused", hoursThisWeek: 0, weeklyCapacity: 40, performance: 85, startedOn: "2025-03-15", email: "liam.walsh@cyberbacker.com", timezone: "GMT+0", skills: ["SEO", "Email", "Ads"] },
];

export const candidates: Candidate[] = [
  { id: "c1", name: "Sofia Mendoza", initials: "SM", title: "Senior Executive Assistant", availability: "available", rating: 4.9, hourlyRate: 14, yearsExperience: 7, location: "Manila, PH", skills: ["Calendar", "Project Mgmt", "Inbox"], matchScore: 97 },
  { id: "c2", name: "Arjun Patel", initials: "AP", title: "Full-Charge Bookkeeper", availability: "available", rating: 4.8, hourlyRate: 16, yearsExperience: 9, location: "Bengaluru, IN", skills: ["Xero", "QuickBooks", "Payroll"], matchScore: 94 },
  { id: "c3", name: "Camille Roy", initials: "CR", title: "Social Media Strategist", availability: "interviewing", rating: 4.7, hourlyRate: 15, yearsExperience: 5, location: "Cebu, PH", skills: ["Content", "Paid Ads", "Analytics"], matchScore: 91 },
  { id: "c4", name: "Noah Becker", initials: "NB", title: "Customer Success Specialist", availability: "available", rating: 4.6, hourlyRate: 13, yearsExperience: 4, location: "Cape Town, ZA", skills: ["Zendesk", "Onboarding", "Retention"], matchScore: 88 },
  { id: "c5", name: " Live Tan", initials: "LT", title: "Operations Coordinator", availability: "available", rating: 4.8, hourlyRate: 15, yearsExperience: 6, location: "Davao, PH", skills: ["Ops", "SOPs", "Automation"], matchScore: 90 },
  { id: "c6", name: "Grace Okafor", initials: "GO", title: "Marketing Generalist", availability: "hired", rating: 4.5, hourlyRate: 14, yearsExperience: 5, location: "Lagos, NG", skills: ["SEO", "Email", "Copy"], matchScore: 85 },
];

export const attendance: AttendanceEntry[] = [
  { id: "at1", cyberbacker: "Maya Lin", initials: "ML", date: "2026-06-12", clockIn: "08:02", clockOut: "16:05", hours: 8, status: "present" },
  { id: "at2", cyberbacker: "Diego Santos", initials: "DS", date: "2026-06-12", clockIn: "09:14", clockOut: "17:30", hours: 8, status: "late" },
  { id: "at3", cyberbacker: "Priya Nair", initials: "PN", date: "2026-06-12", clockIn: "08:00", clockOut: "14:00", hours: 6, status: "present" },
  { id: "at4", cyberbacker: "Hana Kim", initials: "HK", date: "2026-06-12", clockIn: "—", clockOut: "—", hours: 0, status: "leave" },
  { id: "at5", cyberbacker: "Tomas Reyes", initials: "TR", date: "2026-06-12", clockIn: "08:30", clockOut: "12:30", hours: 4, status: "present" },
  { id: "at6", cyberbacker: "Liam Walsh", initials: "LW", date: "2026-06-12", clockIn: "—", clockOut: "—", hours: 0, status: "absent" },
];

export const performanceTrend: PerformancePoint[] = [
  { label: "Jan", productivity: 82, satisfaction: 88, hours: 720 },
  { label: "Feb", productivity: 85, satisfaction: 89, hours: 760 },
  { label: "Mar", productivity: 87, satisfaction: 90, hours: 810 },
  { label: "Apr", productivity: 90, satisfaction: 91, hours: 845 },
  { label: "May", productivity: 92, satisfaction: 93, hours: 870 },
  { label: "Jun", productivity: 94, satisfaction: 95, hours: 905 },
];

export const tickets: Ticket[] = [
  { id: "t1", subject: "Cannot access timesheet export", requester: "Jordan Avery", category: "Billing", status: "open", priority: "high", createdAt: "2026-06-12", updatedAt: "2026-06-13", assignedTo: "Support Team", slaHoursLeft: 4 },
  { id: "t2", subject: "Request additional Cyberbacker hours", requester: "BrightPath Ventures", category: "Account", status: "in_progress", priority: "medium", createdAt: "2026-06-11", updatedAt: "2026-06-13", assignedTo: "Facilitator", slaHoursLeft: 12 },
  { id: "t3", subject: "Onboarding docs for new hire", requester: "Jordan Avery", category: "Onboarding", status: "waiting", priority: "low", createdAt: "2026-06-10", updatedAt: "2026-06-12", assignedTo: "Support Team", slaHoursLeft: 22 },
  { id: "t4", subject: "Performance report discrepancy", requester: "Casey Wu", category: "Reports", status: "open", priority: "urgent", createdAt: "2026-06-13", updatedAt: "2026-06-13", assignedTo: "Unassigned", slaHoursLeft: 1 },
  { id: "t5", subject: "Update payment method", requester: "Jordan Avery", category: "Billing", status: "resolved", priority: "medium", createdAt: "2026-06-08", updatedAt: "2026-06-09", assignedTo: "Finance Team", slaHoursLeft: 0 },
];

export const kbCategories: KbCategory[] = [
  { id: "kc1", name: "Getting Started", description: "Onboarding and account setup", articleCount: 18, icon: "Rocket" },
  { id: "kc2", name: "Managing Cyberbackers", description: "Delegation, hours, and reviews", articleCount: 24, icon: "Users" },
  { id: "kc3", name: "Billing & Contracts", description: "Invoices, plans, and payments", articleCount: 12, icon: "CreditCard" },
  { id: "kc4", name: "Productivity Tools", description: "Integrations and best practices", articleCount: 31, icon: "Zap" },
];

export const articles: Article[] = [
  { id: "ar1", title: "How to delegate your first task", category: "Getting Started", excerpt: "A step-by-step guide to handing off work effectively to your Cyberbacker.", readMinutes: 5, views: 4210, updatedAt: "2026-05-28" },
  { id: "ar2", title: "Setting weekly priorities with your team", category: "Managing Cyberbackers", excerpt: "Run an effective weekly planning ritual that keeps everyone aligned.", readMinutes: 7, views: 3180, updatedAt: "2026-06-02" },
  { id: "ar3", title: "Understanding your monthly invoice", category: "Billing & Contracts", excerpt: "Breakdown of line items, hours, and add-ons on your statement.", readMinutes: 4, views: 2560, updatedAt: "2026-06-09" },
  { id: "ar4", title: "Top 10 automations for assistants", category: "Productivity Tools", excerpt: "Save hours every week with these no-code automation recipes.", readMinutes: 9, views: 5890, updatedAt: "2026-06-10" },
];

export const contracts: Contract[] = [
  { id: "ct1", title: "Master Services Agreement", party: "Cyberbacker LLC", status: "active", value: 0, startDate: "2024-08-01", endDate: "2026-08-01", signedOn: "2024-07-28" },
  { id: "ct2", title: "Executive Assistant — Full Time", party: "Maya Lin", status: "active", value: 2240, startDate: "2024-08-12", endDate: "2026-08-12", signedOn: "2024-08-10" },
  { id: "ct3", title: "Bookkeeper — Full Time", party: "Diego Santos", status: "active", value: 2560, startDate: "2024-05-03", endDate: "2026-05-03", signedOn: "2024-05-01" },
  { id: "ct4", title: "Customer Support — Part Time", party: "Tomas Reyes", status: "pending_signature", value: 1280, startDate: "2026-06-15", endDate: "2027-06-15" },
  { id: "ct5", title: "Marketing Assistant — Addendum", party: "Liam Walsh", status: "draft", value: 1600, startDate: "2026-07-01", endDate: "2027-07-01" },
];

export const invoices: Invoice[] = [
  { id: "iv1", number: "INV-2048", period: "Jun 2026", amount: 9680, status: "due", issuedOn: "2026-06-01", dueOn: "2026-06-15" },
  { id: "iv2", number: "INV-2031", period: "May 2026", amount: 9440, status: "paid", issuedOn: "2026-05-01", dueOn: "2026-05-15" },
  { id: "iv3", number: "INV-2018", period: "Apr 2026", amount: 9120, status: "paid", issuedOn: "2026-04-01", dueOn: "2026-04-15" },
  { id: "iv4", number: "INV-2002", period: "Mar 2026", amount: 8800, status: "paid", issuedOn: "2026-03-01", dueOn: "2026-03-15" },
  { id: "iv5", number: "INV-1987", period: "Feb 2026", amount: 8800, status: "overdue", issuedOn: "2026-02-01", dueOn: "2026-02-15" },
];

export const paymentMethods: PaymentMethod[] = [
  { id: "pm1", brand: "Visa", last4: "4242", expiry: "08/27", isDefault: true },
  { id: "pm2", brand: "Mastercard", last4: "5588", expiry: "11/26", isDefault: false },
];

export const rewards: Reward[] = [
  { id: "rw1", title: "2 Free Bonus Hours", description: "Add 2 complimentary hours to any Cyberbacker this month.", type: "credit", value: "+2 hrs", code: "BONUS2", expiresOn: "2026-06-30", status: "available" },
  { id: "rw2", title: "Referral Reward", description: "Refer a business and earn account credit when they sign.", type: "credit", value: "$250", code: "REFER250", expiresOn: "2026-12-31", status: "available" },
  { id: "rw3", title: "Annual Plan Discount", description: "Switch to annual billing and save 15%.", type: "coupon", value: "15% off", code: "ANNUAL15", expiresOn: "2026-08-01", status: "available" },
  { id: "rw4", title: "Priority Support Pass", description: "30 days of priority support response times.", type: "perk", value: "Priority", expiresOn: "2026-05-31", status: "redeemed" },
];

export const clientAccounts: ClientAccount[] = [
  { id: "cl1", company: "BrightPath Ventures", initials: "BV", contact: "Jordan Avery", plan: "Scale", cyberbackers: 6, mrr: 9680, status: "active", health: 92, since: "2024-08-01" },
  { id: "cl2", company: "Northwind Labs", initials: "NL", contact: "Casey Wu", plan: "Growth", cyberbackers: 4, mrr: 6240, status: "active", health: 81, since: "2024-11-15" },
  { id: "cl3", company: "Harbor & Co", initials: "HC", contact: "Dana Cole", plan: "Starter", cyberbackers: 2, mrr: 3120, status: "at_risk", health: 58, since: "2025-02-20" },
  { id: "cl4", company: "Vela Studio", initials: "VS", contact: "Sam Ortiz", plan: "Growth", cyberbackers: 3, mrr: 4680, status: "trial", health: 74, since: "2026-05-30" },
  { id: "cl5", company: "Kestrel Group", initials: "KG", contact: "Robin Hale", plan: "Scale", cyberbackers: 8, mrr: 12480, status: "active", health: 88, since: "2023-12-04" },
  { id: "cl6", company: "Apex Dental", initials: "AD", contact: "Pat Lee", plan: "Starter", cyberbackers: 1, mrr: 1560, status: "churned", health: 22, since: "2025-06-12" },
];

export const pipeline: PipelineCandidate[] = [
  { id: "p1", name: "Sofia Mendoza", initials: "SM", role: "Executive Assistant", stage: "offer", recruiter: "Alex Park", appliedOn: "2026-05-30", score: 97 },
  { id: "p2", name: "Arjun Patel", initials: "AP", role: "Bookkeeper", stage: "assessment", recruiter: "Alex Park", appliedOn: "2026-06-02", score: 94 },
  { id: "p3", name: "Camille Roy", initials: "CR", role: "Social Media", stage: "interview", recruiter: "Jamie Fox", appliedOn: "2026-06-04", score: 91 },
  { id: "p4", name: "Noah Becker", initials: "NB", role: "Customer Support", stage: "screening", recruiter: "Jamie Fox", appliedOn: "2026-06-07", score: 88 },
  { id: "p5", name: "Grace Okafor", initials: "GO", role: "Marketing", stage: "placed", recruiter: "Alex Park", appliedOn: "2026-05-12", score: 85 },
  { id: "p6", name: "Ravi Shah", initials: "RS", role: "Data Entry", stage: "applied", recruiter: "Jamie Fox", appliedOn: "2026-06-11", score: 79 },
  { id: "p7", name: "Elena Voss", initials: "EV", role: "Executive Assistant", stage: "applied", recruiter: "Alex Park", appliedOn: "2026-06-12", score: 82 },
  { id: "p8", name: "Mateo Cruz", initials: "MC", role: "Bookkeeper", stage: "interview", recruiter: "Jamie Fox", appliedOn: "2026-06-05", score: 86 },
];

export const revenueTrend: RevenuePoint[] = [
  { month: "Jan", revenue: 182000, payouts: 96000 },
  { month: "Feb", revenue: 191000, payouts: 99000 },
  { month: "Mar", revenue: 205000, payouts: 104000 },
  { month: "Apr", revenue: 218000, payouts: 109000 },
  { month: "May", revenue: 231000, payouts: 116000 },
  { month: "Jun", revenue: 247000, payouts: 121000 },
];

export const acquisitionFunnel: FunnelStep[] = [
  { step: "Visitors", value: 24800 },
  { step: "Leads", value: 6200 },
  { step: "Trials", value: 1840 },
  { step: "Demos", value: 720 },
  { step: "Customers", value: 312 },
];

export const systemUsers: SystemUser[] = [
  { id: "su1", name: "Jordan Avery", email: "jordan.avery@brightpath.co", role: "Client", status: "active", lastActive: "2m ago" },
  { id: "su2", name: "Alex Park", email: "alex.park@cyberbacker.com", role: "Recruiter", status: "active", lastActive: "18m ago" },
  { id: "su3", name: "Riley Stone", email: "riley.stone@cyberbacker.com", role: "Facilitator", status: "active", lastActive: "1h ago" },
  { id: "su4", name: "Sam Okada", email: "sam.okada@cyberbacker.com", role: "Support Agent", status: "active", lastActive: "3h ago" },
  { id: "su5", name: "Morgan Bell", email: "morgan.bell@cyberbacker.com", role: "Finance Team", status: "invited", lastActive: "—" },
  { id: "su6", name: "Taylor Quinn", email: "taylor.quinn@cyberbacker.com", role: "Administrator", status: "active", lastActive: "5h ago" },
  { id: "su7", name: "Drew Carter", email: "drew.carter@cyberbacker.com", role: "Executive", status: "suspended", lastActive: "8d ago" },
];

export const auditLog: AuditEntry[] = [
  { id: "al1", actor: "Taylor Quinn", action: "Updated role permissions", resource: "Role: Finance Team", time: "2026-06-13 09:42", ip: "10.0.4.18" },
  { id: "al2", actor: "Alex Park", action: "Created candidate", resource: "Candidate: Elena Voss", time: "2026-06-12 16:20", ip: "10.0.4.21" },
  { id: "al3", actor: "Morgan Bell", action: "Issued invoice", resource: "INV-2048", time: "2026-06-01 08:05", ip: "10.0.4.30" },
  { id: "al4", actor: "Jordan Avery", action: "Updated payment method", resource: "Visa •••• 4242", time: "2026-05-29 11:14", ip: "203.0.113.9" },
  { id: "al5", actor: "System", action: "Nightly backup completed", resource: "Database snapshot", time: "2026-06-13 02:00", ip: "internal" },
];

export const notifications: Notification[] = [
  { id: "n1", title: "New candidate matched", description: "Sofia Mendoza is a 97% match for your EA role.", time: "12m ago", type: "success", read: false },
  { id: "n2", title: "Invoice due soon", description: "INV-2048 ($9,680) is due Jun 15.", time: "2h ago", type: "warning", read: false },
  { id: "n3", title: "Ticket update", description: "Support replied to 'Cannot access timesheet export'.", time: "4h ago", type: "ticket", read: false },
  { id: "n4", title: "Weekly report ready", description: "Maya Lin submitted her weekly report.", time: "1d ago", type: "info", read: true },
  { id: "n5", title: "Onboarding complete", description: "Priya Nair finished onboarding.", time: "2d ago", type: "success", read: true },
];
