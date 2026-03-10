import React, { createContext, useContext, useState, ReactNode } from "react";
import { Company, Lead, ProspectCompany, AIAgent, AutomationSequence, User, SalesGoal } from "@/types/crm";
import { mockCompanies, mockLeads, mockProspects, mockAIAgents, mockAutomationSequences, mockUsers, mockSalesGoals } from "@/data/mockData";

interface CRMContextType {
  companies: Company[];
  leads: Lead[];
  users: User[];
  prospects: ProspectCompany[];
  aiAgents: AIAgent[];
  automationSequences: AutomationSequence[];
  salesGoals: SalesGoal[];
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;
  updateLeadStatus: (leadId: string, newStatus: Lead["status"]) => void;
  updateLeadQualification: (leadId: string, qualification: Lead["qualification"]) => void;
  assignLeadToUser: (leadId: string, userId: string, role: "sdr" | "executive") => void;
  addLead: (lead: Lead) => void;
  addCompany: (company: Company) => void;
  getCompanyLeads: (companyId: string) => Lead[];
  getCompanyById: (companyId: string) => Company | undefined;
  getUserById: (userId: string) => User | undefined;
  importProspect: (prospectId: string, companyId: string) => void;
  updateLeadScore: (leadId: string, score: number) => void;
  addContactAttempt: (leadId: string) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [users] = useState<User[]>(mockUsers);
  const [prospects, setProspects] = useState<ProspectCompany[]>(mockProspects);
  const [aiAgents] = useState<AIAgent[]>(mockAIAgents);
  const [automationSequences] = useState<AutomationSequence[]>(mockAutomationSequences);
  const [salesGoals] = useState<SalesGoal[]>(mockSalesGoals);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const updateLeadStatus = (leadId: string, newStatus: Lead["status"]) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
  };

  const updateLeadQualification = (leadId: string, qualification: Lead["qualification"]) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, qualification } : l)));
  };

  const assignLeadToUser = (leadId: string, userId: string, role: "sdr" | "executive") => {
    setLeads((prev) => prev.map((l) => {
      if (l.id !== leadId) return l;
      return role === "sdr" ? { ...l, assignedSdrId: userId } : { ...l, assignedExecutiveId: userId };
    }));
  };

  const addLead = (lead: Lead) => setLeads((prev) => [...prev, lead]);
  const addCompany = (company: Company) => setCompanies((prev) => [...prev, company]);
  const getCompanyLeads = (companyId: string) => leads.filter((l) => l.companyId === companyId);
  const getCompanyById = (companyId: string) => companies.find((c) => c.id === companyId);
  const getUserById = (userId: string) => users.find((u) => u.id === userId);

  const importProspect = (prospectId: string, companyId: string) => {
    const prospect = prospects.find((p) => p.id === prospectId);
    if (!prospect || prospect.imported) return;
    const newLead: Lead = {
      id: `l${Date.now()}`,
      name: prospect.nomeFantasia || prospect.razaoSocial,
      phone: prospect.telefone,
      email: prospect.email,
      origin: "Prospecção",
      companyId,
      responsible: "",
      potentialValue: prospect.faturamentoEstimado ? prospect.faturamentoEstimado * 0.01 : 0,
      status: "received",
      qualification: "pending",
      score: 50,
      entryDate: new Date().toISOString().split("T")[0],
      notes: `Importado: ${prospect.razaoSocial} - ${prospect.segmento} - ${prospect.cidade}/${prospect.estado}`,
      activities: [],
      contactAttempts: 0,
    };
    setLeads((prev) => [...prev, newLead]);
    setProspects((prev) => prev.map((p) => (p.id === prospectId ? { ...p, imported: true } : p)));
  };

  const updateLeadScore = (leadId: string, score: number) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, score } : l)));
  };

  const addContactAttempt = (leadId: string) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, contactAttempts: l.contactAttempts + 1, lastContactDate: new Date().toISOString().split("T")[0] } : l)));
  };

  return (
    <CRMContext.Provider value={{
      companies, leads, users, prospects, aiAgents, automationSequences, salesGoals,
      selectedCompanyId, setSelectedCompanyId,
      updateLeadStatus, updateLeadQualification, assignLeadToUser,
      addLead, addCompany, getCompanyLeads, getCompanyById, getUserById,
      importProspect, updateLeadScore, addContactAttempt,
    }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error("useCRM must be used within CRMProvider");
  return ctx;
};
