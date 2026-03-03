import React, { createContext, useContext, useState, ReactNode } from "react";
import { Company, Lead } from "@/types/crm";
import { mockCompanies, mockLeads } from "@/data/mockData";

interface CRMContextType {
  companies: Company[];
  leads: Lead[];
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;
  updateLeadStatus: (leadId: string, newStatus: Lead["status"]) => void;
  addLead: (lead: Lead) => void;
  addCompany: (company: Company) => void;
  getCompanyLeads: (companyId: string) => Lead[];
  getCompanyById: (companyId: string) => Company | undefined;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const updateLeadStatus = (leadId: string, newStatus: Lead["status"]) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
  };

  const addLead = (lead: Lead) => {
    setLeads((prev) => [...prev, lead]);
  };

  const addCompany = (company: Company) => {
    setCompanies((prev) => [...prev, company]);
  };

  const getCompanyLeads = (companyId: string) =>
    leads.filter((l) => l.companyId === companyId);

  const getCompanyById = (companyId: string) =>
    companies.find((c) => c.id === companyId);

  return (
    <CRMContext.Provider
      value={{
        companies,
        leads,
        selectedCompanyId,
        setSelectedCompanyId,
        updateLeadStatus,
        addLead,
        addCompany,
        getCompanyLeads,
        getCompanyById,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error("useCRM must be used within CRMProvider");
  return ctx;
};
