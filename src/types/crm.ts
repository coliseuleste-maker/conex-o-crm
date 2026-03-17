export type UserRole = "admin" | "manager" | "seller" | "sdr" | "executive" | "viewer";

export type TeamRole = "sdr" | "executive" | "manager";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamRole?: TeamRole;
  avatar?: string;
  phone?: string;
  active: boolean;
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
  | "qualified"
  | "unqualified"
  | "proposal_sent"
  | "negotiation"
  | "closed"
  | "lost";

export type LeadQualification = "qualified" | "unqualified" | "needs_info" | "pending";

export interface LeadActivity {
  id: string;
  leadId: string;
  userId: string;
  type: "note" | "call" | "email" | "meeting" | "status_change" | "qualification" | "assignment";
  description: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  origin: string;
  companyId: string;
  responsible: string;
  assignedSdrId?: string;
  assignedExecutiveId?: string;
  potentialValue: number;
  status: LeadStatus;
  qualification: LeadQualification;
  score: number;
  entryDate: string;
  notes: string;
  activities: LeadActivity[];
  contactAttempts: number;
  lastContactDate?: string;
  // Enrichment data
  linkedinUrl?: string;
  website?: string;
  socialMedia?: string;
  decisionMaker?: string;
}

export interface KanbanStage {
  id: LeadStatus;
  label: string;
  color: string;
}

// Prospecting types
export interface ProspectCompany {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  segmento: string;
  porte: string;
  cidade: string;
  estado: string;
  faturamentoEstimado?: number;
  funcionarios?: number;
  imported: boolean;
}

export interface ProspectingFilter {
  segmento: string;
  cidade: string;
  estado: string;
  porte: string;
  faturamentoMin: number;
  faturamentoMax: number;
}

// AI Agent types (company-centric)
export type AgentObjective = "sales" | "qualification" | "support" | "follow_up" | "sdr";
export type AgentTone = "formal" | "consultive" | "aggressive" | "friendly";

export interface AIAgent {
  id: string;
  companyId: string;
  name: string;
  status: "active" | "training" | "inactive";
  objective: AgentObjective;
  tone: AgentTone;
  segment: string;
  product: string;
  knowledgeBase: string[];
  communicationStyle: string;
  commercialStrategy: string;
  totalInteractions: number;
  successRate: number;
  responseRate: number;
  conversionRate: number;
  lastTraining?: string;
  capabilities: string[];
  trainingData?: AgentTrainingData;
}

export interface AgentTrainingData {
  companyDescription: string;
  productsServices: string;
  targetAudience: string;
  salesScripts: string;
  faq: string;
  commonObjections: string;
  commercialMaterials: string;
}

// Prospect list types
export interface ProspectList {
  id: string;
  name: string;
  createdAt: string;
  prospectIds: string[];
}

export interface ProspectSearchHistory {
  id: string;
  query: string;
  filters: Record<string, string>;
  resultsCount: number;
  searchedAt: string;
}

// Automation types
export type AutomationChannel = "email" | "whatsapp" | "linkedin";

export interface AutomationSequence {
  id: string;
  name: string;
  channel: AutomationChannel;
  steps: AutomationStep[];
  active: boolean;
  leadsEnrolled: number;
  responseRate: number;
}

export interface AutomationStep {
  id: string;
  order: number;
  type: "message" | "wait" | "condition";
  content: string;
  delayDays: number;
}

// Lead Acquisition types
export type LeadChannelType = "form" | "landing_page" | "meta_ads" | "google_ads" | "whatsapp" | "email" | "api" | "spreadsheet";

export interface LeadSource {
  id: string;
  name: string;
  channelType: LeadChannelType;
  active: boolean;
  companyId: string;
  responsibleId: string;
  initialStage: LeadStatus;
  leadsGenerated: number;
  conversionRate: number;
}

export interface LeadAutomationFlow {
  id: string;
  name: string;
  active: boolean;
  steps: AutomationFlowStep[];
  leadsProcessed: number;
  conversionRate: number;
}

export interface AutomationFlowStep {
  id: string;
  order: number;
  type: "welcome" | "qualification" | "question" | "schedule";
  content: string;
  delayMinutes: number;
}

// Sales Goals
export interface SalesGoal {
  id: string;
  userId: string;
  month: string;
  targetValue: number;
  targetLeads: number;
  achievedValue: number;
  achievedLeads: number;
}
