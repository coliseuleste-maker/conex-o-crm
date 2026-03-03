import { Company, Lead, KanbanStage, User } from "@/types/crm";

export const KANBAN_STAGES: KanbanStage[] = [
  { id: "received", label: "Lead Recebido", color: "hsl(215, 20%, 65%)" },
  { id: "first_contact", label: "Primeiro Contato", color: "hsl(200, 80%, 45%)" },
  { id: "proposal_sent", label: "Proposta Enviada", color: "hsl(38, 92%, 50%)" },
  { id: "negotiation", label: "Negociação", color: "hsl(270, 60%, 55%)" },
  { id: "closed", label: "Fechamento", color: "hsl(152, 60%, 40%)" },
  { id: "lost", label: "Perdido", color: "hsl(0, 72%, 51%)" },
];

export const mockUsers: User[] = [
  { id: "1", name: "Carlos Silva", email: "carlos@conexaocomercial.com", role: "admin" },
  { id: "2", name: "Ana Souza", email: "ana@conexaocomercial.com", role: "manager" },
  { id: "3", name: "Pedro Lima", email: "pedro@conexaocomercial.com", role: "seller" },
  { id: "4", name: "Maria Santos", email: "maria@conexaocomercial.com", role: "viewer" },
];

export const mockCompanies: Company[] = [
  {
    id: "c1",
    name: "TechSolutions Ltda",
    cnpj: "12.345.678/0001-90",
    responsible: "João Mendes",
    commissionRate: 10,
    segment: "Tecnologia",
    status: "active",
  },
  {
    id: "c2",
    name: "AgroVerde S.A.",
    cnpj: "98.765.432/0001-10",
    responsible: "Fernanda Costa",
    commissionRate: 8,
    segment: "Agronegócio",
    status: "active",
  },
  {
    id: "c3",
    name: "Construtora Horizonte",
    cnpj: "11.222.333/0001-44",
    responsible: "Roberto Alves",
    commissionRate: 12,
    segment: "Construção Civil",
    status: "active",
  },
  {
    id: "c4",
    name: "Saúde Plus",
    cnpj: "55.666.777/0001-88",
    responsible: "Dra. Camila Ramos",
    commissionRate: 7,
    segment: "Saúde",
    status: "inactive",
  },
];

const origins = ["Google Ads", "Indicação", "Site", "LinkedIn", "Instagram", "Evento", "Cold Call"];

export const mockLeads: Lead[] = [
  { id: "l1", name: "Marcos Pereira", phone: "(11) 99999-1234", email: "marcos@email.com", origin: "Google Ads", companyId: "c1", responsible: "Ana Souza", potentialValue: 45000, status: "received", entryDate: "2025-12-01", notes: "Interessado em ERP" },
  { id: "l2", name: "Juliana Ferreira", phone: "(21) 98888-5678", email: "juliana@email.com", origin: "Indicação", companyId: "c1", responsible: "Pedro Lima", potentialValue: 32000, status: "first_contact", entryDate: "2025-12-05", notes: "" },
  { id: "l3", name: "Ricardo Nascimento", phone: "(31) 97777-9012", email: "ricardo@email.com", origin: "LinkedIn", companyId: "c1", responsible: "Ana Souza", potentialValue: 78000, status: "proposal_sent", entryDate: "2025-11-20", notes: "Pediu desconto" },
  { id: "l4", name: "Patrícia Gomes", phone: "(41) 96666-3456", email: "patricia@email.com", origin: "Site", companyId: "c2", responsible: "Pedro Lima", potentialValue: 120000, status: "negotiation", entryDate: "2025-11-15", notes: "Grande porte" },
  { id: "l5", name: "Fernando Oliveira", phone: "(51) 95555-7890", email: "fernando@email.com", origin: "Evento", companyId: "c2", responsible: "Ana Souza", potentialValue: 55000, status: "closed", entryDate: "2025-10-10", notes: "Fechado!" },
  { id: "l6", name: "Beatriz Campos", phone: "(61) 94444-2345", email: "beatriz@email.com", origin: "Instagram", companyId: "c2", responsible: "Pedro Lima", potentialValue: 28000, status: "lost", entryDate: "2025-11-25", notes: "Sem orçamento" },
  { id: "l7", name: "Lucas Mendonça", phone: "(71) 93333-6789", email: "lucas@email.com", origin: "Cold Call", companyId: "c3", responsible: "Ana Souza", potentialValue: 250000, status: "proposal_sent", entryDate: "2025-12-02", notes: "Projeto grande" },
  { id: "l8", name: "Camila Rocha", phone: "(81) 92222-0123", email: "camila@email.com", origin: "Google Ads", companyId: "c3", responsible: "Pedro Lima", potentialValue: 180000, status: "negotiation", entryDate: "2025-11-18", notes: "" },
  { id: "l9", name: "André Barbosa", phone: "(91) 91111-4567", email: "andre@email.com", origin: "Site", companyId: "c3", responsible: "Ana Souza", potentialValue: 95000, status: "closed", entryDate: "2025-10-05", notes: "Cliente fiel" },
  { id: "l10", name: "Daniela Martins", phone: "(11) 90000-8901", email: "daniela@email.com", origin: "Indicação", companyId: "c1", responsible: "Pedro Lima", potentialValue: 62000, status: "closed", entryDate: "2025-09-15", notes: "" },
  { id: "l11", name: "Gustavo Teixeira", phone: "(21) 98765-1111", email: "gustavo@email.com", origin: "LinkedIn", companyId: "c2", responsible: "Ana Souza", potentialValue: 43000, status: "received", entryDate: "2025-12-10", notes: "" },
  { id: "l12", name: "Larissa Duarte", phone: "(31) 97654-2222", email: "larissa@email.com", origin: "Evento", companyId: "c3", responsible: "Pedro Lima", potentialValue: 310000, status: "first_contact", entryDate: "2025-12-08", notes: "Mega projeto" },
];
