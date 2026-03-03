export type UserRole = "admin" | "manager" | "seller" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type CompanyStatus = "active" | "inactive";

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  responsible: string;
  commissionRate: number;
  segment: string;
  status: CompanyStatus;
}

export type LeadStatus =
  | "received"
  | "first_contact"
  | "proposal_sent"
  | "negotiation"
  | "closed"
  | "lost";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  origin: string;
  companyId: string;
  responsible: string;
  potentialValue: number;
  status: LeadStatus;
  entryDate: string;
  notes: string;
}

export interface KanbanStage {
  id: LeadStatus;
  label: string;
  color: string;
}
