import { LanguageCode } from "@/types/international";

type TranslationKeys = {
  // General
  newLead: string;
  leads: string;
  companies: string;
  dashboard: string;
  reports: string;
  commissions: string;
  team: string;
  prospecting: string;
  aiAgents: string;
  automation: string;
  internationalExpansion: string;
  kanban: string;
  // International module
  countriesAndRegions: string;
  internationalRegistration: string;
  internationalReports: string;
  country: string;
  language: string;
  currency: string;
  timezone: string;
  phoneFormat: string;
  taxDocument: string;
  // Form fields
  businessName: string;
  tradeName: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  industry: string;
  address: string;
  selectCountry: string;
  save: string;
  cancel: string;
  add: string;
  edit: string;
  delete: string;
  search: string;
  filter: string;
  // Status
  status: string;
  new: string;
  contacted: string;
  qualified: string;
  negotiation: string;
  closed: string;
  lost: string;
  // Metrics
  totalLeads: string;
  totalValue: string;
  closedValue: string;
  avgTicket: string;
  commissionGenerated: string;
  conversionRate: string;
  leadsByCountry: string;
  valueByCountry: string;
  comparativeChart: string;
  // Actions
  importToLeads: string;
  registerCompany: string;
  registerLead: string;
  viewDetails: string;
  allCountries: string;
  potentialValue: string;
};

const translations: Record<LanguageCode, TranslationKeys> = {
  pt: {
    newLead: "Novo Lead",
    leads: "Leads",
    companies: "Empresas",
    dashboard: "Dashboard",
    reports: "Relatórios",
    commissions: "Comissões",
    team: "Equipe Comercial",
    prospecting: "Prospecção",
    aiAgents: "Agentes de IA",
    automation: "Automação",
    internationalExpansion: "Expansão Internacional",
    kanban: "Kanban",
    countriesAndRegions: "Países e Regiões",
    internationalRegistration: "Cadastro Internacional",
    internationalReports: "Relatórios Internacionais",
    country: "País",
    language: "Idioma",
    currency: "Moeda",
    timezone: "Fuso Horário",
    phoneFormat: "Formato de Telefone",
    taxDocument: "Documento Fiscal",
    businessName: "Razão Social",
    tradeName: "Nome Fantasia",
    phone: "Telefone",
    email: "Email",
    state: "Estado",
    city: "Cidade",
    industry: "Segmento",
    address: "Endereço",
    selectCountry: "Selecionar País",
    save: "Salvar",
    cancel: "Cancelar",
    add: "Adicionar",
    edit: "Editar",
    delete: "Excluir",
    search: "Buscar",
    filter: "Filtrar",
    status: "Status",
    new: "Novo",
    contacted: "Contatado",
    qualified: "Qualificado",
    negotiation: "Negociação",
    closed: "Fechado",
    lost: "Perdido",
    totalLeads: "Total de Leads",
    totalValue: "Valor Total em Negociação",
    closedValue: "Valor Fechado",
    avgTicket: "Ticket Médio",
    commissionGenerated: "Comissão Gerada",
    conversionRate: "Taxa de Conversão",
    leadsByCountry: "Leads por País",
    valueByCountry: "Valor por País",
    comparativeChart: "Comparativo entre Países",
    importToLeads: "Importar para Leads",
    registerCompany: "Cadastrar Empresa",
    registerLead: "Cadastrar Lead",
    viewDetails: "Ver Detalhes",
    allCountries: "Todos os Países",
    potentialValue: "Valor Potencial",
  },
  es: {
    newLead: "Nuevo Lead",
    leads: "Leads",
    companies: "Empresas",
    dashboard: "Dashboard",
    reports: "Informes",
    commissions: "Comisiones",
    team: "Equipo Comercial",
    prospecting: "Prospección",
    aiAgents: "Agentes de IA",
    automation: "Automatización",
    internationalExpansion: "Expansión Internacional",
    kanban: "Kanban",
    countriesAndRegions: "Países y Regiones",
    internationalRegistration: "Registro Internacional",
    internationalReports: "Informes Internacionales",
    country: "País",
    language: "Idioma",
    currency: "Moneda",
    timezone: "Zona Horaria",
    phoneFormat: "Formato de Teléfono",
    taxDocument: "Documento Fiscal",
    businessName: "Razón Social",
    tradeName: "Nombre Comercial",
    phone: "Teléfono",
    email: "Email",
    state: "Estado",
    city: "Ciudad",
    industry: "Industria",
    address: "Dirección",
    selectCountry: "Seleccionar País",
    save: "Guardar",
    cancel: "Cancelar",
    add: "Agregar",
    edit: "Editar",
    delete: "Eliminar",
    search: "Buscar",
    filter: "Filtrar",
    status: "Estado",
    new: "Nuevo",
    contacted: "Contactado",
    qualified: "Calificado",
    negotiation: "Negociación",
    closed: "Cerrado",
    lost: "Perdido",
    totalLeads: "Total de Leads",
    totalValue: "Valor Total en Negociación",
    closedValue: "Valor Cerrado",
    avgTicket: "Ticket Promedio",
    commissionGenerated: "Comisión Generada",
    conversionRate: "Tasa de Conversión",
    leadsByCountry: "Leads por País",
    valueByCountry: "Valor por País",
    comparativeChart: "Comparativo entre Países",
    importToLeads: "Importar a Leads",
    registerCompany: "Registrar Empresa",
    registerLead: "Registrar Lead",
    viewDetails: "Ver Detalles",
    allCountries: "Todos los Países",
    potentialValue: "Valor Potencial",
  },
  en: {
    newLead: "New Lead",
    leads: "Leads",
    companies: "Companies",
    dashboard: "Dashboard",
    reports: "Reports",
    commissions: "Commissions",
    team: "Sales Team",
    prospecting: "Prospecting",
    aiAgents: "AI Agents",
    automation: "Automation",
    internationalExpansion: "International Expansion",
    kanban: "Kanban",
    countriesAndRegions: "Countries & Regions",
    internationalRegistration: "International Registration",
    internationalReports: "International Reports",
    country: "Country",
    language: "Language",
    currency: "Currency",
    timezone: "Timezone",
    phoneFormat: "Phone Format",
    taxDocument: "Tax Document",
    businessName: "Business Name",
    tradeName: "Trade Name",
    phone: "Phone",
    email: "Email",
    state: "State",
    city: "City",
    industry: "Industry",
    address: "Address",
    selectCountry: "Select Country",
    save: "Save",
    cancel: "Cancel",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    search: "Search",
    filter: "Filter",
    status: "Status",
    new: "New",
    contacted: "Contacted",
    qualified: "Qualified",
    negotiation: "Negotiation",
    closed: "Closed",
    lost: "Lost",
    totalLeads: "Total Leads",
    totalValue: "Total Negotiation Value",
    closedValue: "Closed Value",
    avgTicket: "Average Ticket",
    commissionGenerated: "Commission Generated",
    conversionRate: "Conversion Rate",
    leadsByCountry: "Leads by Country",
    valueByCountry: "Value by Country",
    comparativeChart: "Country Comparison",
    importToLeads: "Import to Leads",
    registerCompany: "Register Company",
    registerLead: "Register Lead",
    viewDetails: "View Details",
    allCountries: "All Countries",
    potentialValue: "Potential Value",
  },
};

export const getTranslation = (lang: LanguageCode) => translations[lang];
export default translations;
