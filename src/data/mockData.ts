import { Company, Lead, KanbanStage, User, ProspectCompany, AIAgent, AutomationSequence, SalesGoal, LeadSource, LeadAutomationFlow } from "@/types/crm";

export const KANBAN_STAGES: KanbanStage[] = [
  { id: "received", label: "Lead Recebido", color: "hsl(215, 20%, 65%)" },
  { id: "first_contact", label: "Primeiro Contato", color: "hsl(200, 80%, 45%)" },
  { id: "qualified", label: "Qualificado", color: "hsl(175, 60%, 45%)" },
  { id: "proposal_sent", label: "Proposta Enviada", color: "hsl(38, 92%, 50%)" },
  { id: "negotiation", label: "Negociação", color: "hsl(270, 60%, 55%)" },
  { id: "closed", label: "Fechamento", color: "hsl(152, 60%, 40%)" },
  { id: "lost", label: "Perdido", color: "hsl(0, 72%, 51%)" },
];

export const mockUsers: User[] = [
  { id: "u1", name: "Carlos Silva", email: "carlos@conexaocomercial.com", role: "admin", teamRole: "manager", phone: "(11) 99000-0001", active: true },
  { id: "u2", name: "Ana Souza", email: "ana@conexaocomercial.com", role: "manager", teamRole: "manager", phone: "(11) 99000-0002", active: true },
  { id: "u3", name: "Pedro Lima", email: "pedro@conexaocomercial.com", role: "seller", teamRole: "executive", phone: "(11) 99000-0003", active: true },
  { id: "u4", name: "Maria Santos", email: "maria@conexaocomercial.com", role: "seller", teamRole: "sdr", phone: "(11) 99000-0004", active: true },
  { id: "u5", name: "Lucas Ferreira", email: "lucas@conexaocomercial.com", role: "seller", teamRole: "sdr", phone: "(11) 99000-0005", active: true },
  { id: "u6", name: "Juliana Costa", email: "juliana@conexaocomercial.com", role: "seller", teamRole: "executive", phone: "(11) 99000-0006", active: true },
  { id: "u7", name: "Roberto Alves", email: "roberto@conexaocomercial.com", role: "viewer", phone: "(11) 99000-0007", active: true },
];

export const mockCompanies: Company[] = [
  { id: "c1", name: "Next", cnpj: "12.345.678/0001-90", responsible: "Carlos Silva", commissionRate: 10, segment: "Tecnologia", status: "active" },
  { id: "c2", name: "Amarelo Ouro", cnpj: "98.765.432/0001-10", responsible: "Ana Souza", commissionRate: 8, segment: "Marketing", status: "active" },
  { id: "c3", name: "Coliseu Hub", cnpj: "11.222.333/0001-44", responsible: "Carlos Silva", commissionRate: 12, segment: "Coworking", status: "active" },
  { id: "c4", name: "Método X", cnpj: "55.666.777/0001-88", responsible: "Ana Souza", commissionRate: 9, segment: "Educação", status: "active" },
];

export const mockLeads: Lead[] = [
  { id: "l1", name: "Marcos Pereira", phone: "(11) 99999-1234", email: "marcos@email.com", origin: "Google Ads", companyId: "c1", responsible: "Ana Souza", assignedSdrId: "u4", assignedExecutiveId: "u3", potentialValue: 45000, status: "received", qualification: "pending", score: 65, entryDate: "2025-12-01", notes: "Interessado em ERP", activities: [], contactAttempts: 0 },
  { id: "l2", name: "Juliana Ferreira", phone: "(21) 98888-5678", email: "juliana@email.com", origin: "Indicação", companyId: "c1", responsible: "Pedro Lima", assignedSdrId: "u5", assignedExecutiveId: "u3", potentialValue: 32000, status: "first_contact", qualification: "pending", score: 55, entryDate: "2025-12-05", notes: "", activities: [], contactAttempts: 1, lastContactDate: "2025-12-06" },
  { id: "l3", name: "Ricardo Nascimento", phone: "(31) 97777-9012", email: "ricardo@email.com", origin: "LinkedIn", companyId: "c1", responsible: "Ana Souza", assignedSdrId: "u4", assignedExecutiveId: "u6", potentialValue: 78000, status: "proposal_sent", qualification: "qualified", score: 82, entryDate: "2025-11-20", notes: "Pediu desconto", activities: [], contactAttempts: 4, lastContactDate: "2025-12-10" },
  { id: "l4", name: "Patrícia Gomes", phone: "(41) 96666-3456", email: "patricia@email.com", origin: "Site", companyId: "c2", responsible: "Pedro Lima", assignedSdrId: "u5", assignedExecutiveId: "u3", potentialValue: 120000, status: "negotiation", qualification: "qualified", score: 90, entryDate: "2025-11-15", notes: "Grande porte", activities: [], contactAttempts: 6, lastContactDate: "2025-12-12" },
  { id: "l5", name: "Fernando Oliveira", phone: "(51) 95555-7890", email: "fernando@email.com", origin: "Evento", companyId: "c2", responsible: "Ana Souza", assignedSdrId: "u4", assignedExecutiveId: "u6", potentialValue: 55000, status: "closed", qualification: "qualified", score: 95, entryDate: "2025-10-10", notes: "Fechado!", activities: [], contactAttempts: 5, lastContactDate: "2025-11-20" },
  { id: "l6", name: "Beatriz Campos", phone: "(61) 94444-2345", email: "beatriz@email.com", origin: "Instagram", companyId: "c2", responsible: "Pedro Lima", assignedSdrId: "u5", potentialValue: 28000, status: "lost", qualification: "unqualified", score: 20, entryDate: "2025-11-25", notes: "Sem orçamento", activities: [], contactAttempts: 2, lastContactDate: "2025-12-01" },
  { id: "l7", name: "Lucas Mendonça", phone: "(71) 93333-6789", email: "lucas@email.com", origin: "Cold Call", companyId: "c3", responsible: "Ana Souza", assignedSdrId: "u4", assignedExecutiveId: "u3", potentialValue: 250000, status: "proposal_sent", qualification: "qualified", score: 88, entryDate: "2025-12-02", notes: "Projeto grande", activities: [], contactAttempts: 3, lastContactDate: "2025-12-08" },
  { id: "l8", name: "Camila Rocha", phone: "(81) 92222-0123", email: "camila@email.com", origin: "Google Ads", companyId: "c3", responsible: "Pedro Lima", assignedSdrId: "u5", assignedExecutiveId: "u6", potentialValue: 180000, status: "negotiation", qualification: "qualified", score: 85, entryDate: "2025-11-18", notes: "", activities: [], contactAttempts: 7, lastContactDate: "2025-12-15" },
  { id: "l9", name: "André Barbosa", phone: "(91) 91111-4567", email: "andre@email.com", origin: "Site", companyId: "c3", responsible: "Ana Souza", assignedSdrId: "u4", assignedExecutiveId: "u3", potentialValue: 95000, status: "closed", qualification: "qualified", score: 92, entryDate: "2025-10-05", notes: "Cliente fiel", activities: [], contactAttempts: 4, lastContactDate: "2025-11-15" },
  { id: "l10", name: "Daniela Martins", phone: "(11) 90000-8901", email: "daniela@email.com", origin: "Indicação", companyId: "c1", responsible: "Pedro Lima", assignedSdrId: "u5", assignedExecutiveId: "u6", potentialValue: 62000, status: "closed", qualification: "qualified", score: 88, entryDate: "2025-09-15", notes: "", activities: [], contactAttempts: 3, lastContactDate: "2025-10-20" },
  { id: "l11", name: "Gustavo Teixeira", phone: "(21) 98765-1111", email: "gustavo@email.com", origin: "LinkedIn", companyId: "c2", responsible: "Ana Souza", assignedSdrId: "u4", potentialValue: 43000, status: "received", qualification: "pending", score: 50, entryDate: "2025-12-10", notes: "", activities: [], contactAttempts: 0 },
  { id: "l12", name: "Larissa Duarte", phone: "(31) 97654-2222", email: "larissa@email.com", origin: "Evento", companyId: "c3", responsible: "Pedro Lima", assignedSdrId: "u5", assignedExecutiveId: "u3", potentialValue: 310000, status: "first_contact", qualification: "needs_info", score: 72, entryDate: "2025-12-08", notes: "Mega projeto", activities: [], contactAttempts: 1, lastContactDate: "2025-12-09" },
  { id: "l13", name: "Rafael Souza", phone: "(11) 91234-5678", email: "rafael@email.com", origin: "Google Ads", companyId: "c4", responsible: "Ana Souza", assignedSdrId: "u4", potentialValue: 38000, status: "qualified", qualification: "qualified", score: 75, entryDate: "2025-12-03", notes: "Curso online", activities: [], contactAttempts: 2, lastContactDate: "2025-12-07" },
  { id: "l14", name: "Carla Mendes", phone: "(21) 98765-4321", email: "carla@email.com", origin: "Site", companyId: "c4", responsible: "Pedro Lima", assignedSdrId: "u5", assignedExecutiveId: "u6", potentialValue: 67000, status: "negotiation", qualification: "qualified", score: 80, entryDate: "2025-11-28", notes: "", activities: [], contactAttempts: 5, lastContactDate: "2025-12-14" },
];

export const mockProspects: ProspectCompany[] = [
  { id: "p1", razaoSocial: "Tech Solutions LTDA", nomeFantasia: "TechSol", cnpj: "33.444.555/0001-66", telefone: "(11) 3333-4444", email: "contato@techsol.com.br", endereco: "Rua Augusta, 1000 - São Paulo/SP", segmento: "Tecnologia", porte: "Médio", cidade: "São Paulo", estado: "SP", faturamentoEstimado: 5000000, funcionarios: 50, imported: false },
  { id: "p2", razaoSocial: "Marketing Digital Plus LTDA", nomeFantasia: "MKT Plus", cnpj: "44.555.666/0001-77", telefone: "(21) 2222-3333", email: "contato@mktplus.com.br", endereco: "Av. Rio Branco, 500 - Rio de Janeiro/RJ", segmento: "Marketing", porte: "Pequeno", cidade: "Rio de Janeiro", estado: "RJ", faturamentoEstimado: 1200000, funcionarios: 15, imported: false },
  { id: "p3", razaoSocial: "Educação Online SA", nomeFantasia: "EduOnline", cnpj: "55.666.777/0001-88", telefone: "(31) 3333-5555", email: "contato@eduonline.com.br", endereco: "Rua da Bahia, 200 - Belo Horizonte/MG", segmento: "Educação", porte: "Grande", cidade: "Belo Horizonte", estado: "MG", faturamentoEstimado: 20000000, funcionarios: 200, imported: false },
  { id: "p4", razaoSocial: "Construções Almeida LTDA", nomeFantasia: "Constru Almeida", cnpj: "66.777.888/0001-99", telefone: "(41) 4444-6666", email: "contato@construalmeida.com.br", endereco: "Rua XV de Novembro, 800 - Curitiba/PR", segmento: "Construção", porte: "Médio", cidade: "Curitiba", estado: "PR", faturamentoEstimado: 8000000, funcionarios: 80, imported: false },
  { id: "p5", razaoSocial: "Saúde Integral LTDA", nomeFantasia: "Saúde+", cnpj: "77.888.999/0001-00", telefone: "(51) 5555-7777", email: "contato@saudeintegral.com.br", endereco: "Av. Ipiranga, 600 - Porto Alegre/RS", segmento: "Saúde", porte: "Pequeno", cidade: "Porto Alegre", estado: "RS", faturamentoEstimado: 2500000, funcionarios: 30, imported: false },
  { id: "p6", razaoSocial: "Logística Express SA", nomeFantasia: "LogExpress", cnpj: "88.999.000/0001-11", telefone: "(61) 6666-8888", email: "contato@logexpress.com.br", endereco: "SIA Trecho 3 - Brasília/DF", segmento: "Logística", porte: "Grande", cidade: "Brasília", estado: "DF", faturamentoEstimado: 35000000, funcionarios: 500, imported: false },
  { id: "p7", razaoSocial: "Alimentação Natural LTDA", nomeFantasia: "NatuFood", cnpj: "99.000.111/0001-22", telefone: "(71) 7777-9999", email: "contato@natufood.com.br", endereco: "Rua Chile, 100 - Salvador/BA", segmento: "Alimentação", porte: "Pequeno", cidade: "Salvador", estado: "BA", faturamentoEstimado: 900000, funcionarios: 12, imported: false },
  { id: "p8", razaoSocial: "Consultoria Financeira Pro LTDA", nomeFantasia: "FinPro", cnpj: "00.111.222/0001-33", telefone: "(81) 8888-0000", email: "contato@finpro.com.br", endereco: "Av. Boa Viagem, 2000 - Recife/PE", segmento: "Finanças", porte: "Médio", cidade: "Recife", estado: "PE", faturamentoEstimado: 6000000, funcionarios: 45, imported: false },
];

export const mockAIAgents: AIAgent[] = [
  { id: "a1", companyId: "c1", name: "Agente Comercial Next", status: "active", objective: "sales", tone: "consultive", segment: "Tecnologia", product: "ERP e Soluções Cloud", knowledgeBase: ["Vendas B2B", "Negociação avançada", "Produtos de tecnologia"], communicationStyle: "Profissional e consultivo", commercialStrategy: "Solution selling com foco em ROI", totalInteractions: 245, successRate: 72, responseRate: 85, conversionRate: 35, lastTraining: "2025-12-10", capabilities: ["Qualificação", "Follow-up", "Agendamento"], trainingData: { companyDescription: "Next é uma empresa de tecnologia focada em soluções cloud", productsServices: "ERP Cloud, CRM, BI", targetAudience: "Empresas médias e grandes do segmento tech", salesScripts: "Abordagem consultiva com foco em ROI", faq: "Principais dúvidas sobre implementação", commonObjections: "Preço, tempo de implementação, migração", commercialMaterials: "Cases de sucesso, comparativos" } },
  { id: "a2", companyId: "c1", name: "Agente SDR Next", status: "training", objective: "sdr", tone: "friendly", segment: "Tecnologia", product: "Todos os produtos", knowledgeBase: ["Prospecção outbound", "Cold calling", "Qualificação BANT"], communicationStyle: "Direto e empático", commercialStrategy: "Abordagem consultiva para qualificação", totalInteractions: 120, successRate: 65, responseRate: 78, conversionRate: 28, lastTraining: "2025-12-08", capabilities: ["Qualificação", "Mensagens personalizadas"] },
  { id: "a3", companyId: "c2", name: "Agente Especial Amarelo Ouro", status: "active", objective: "sales", tone: "aggressive", segment: "Marketing", product: "Campanhas e Branding", knowledgeBase: ["Propostas comerciais", "Fechamento", "Upsell"], communicationStyle: "Persuasivo e detalhista", commercialStrategy: "Challenger Sale com insights de mercado", totalInteractions: 180, successRate: 78, responseRate: 90, conversionRate: 42, lastTraining: "2025-12-12", capabilities: ["Propostas", "Follow-up", "Negociação"] },
  { id: "a4", companyId: "c2", name: "Agente Follow-up Amarelo Ouro", status: "active", objective: "follow_up", tone: "formal", segment: "Marketing", product: "Todos os serviços", knowledgeBase: ["Follow-up", "Reengajamento", "Nutrição de leads"], communicationStyle: "Formal e persistente", commercialStrategy: "Follow-up sistemático com valor agregado", totalInteractions: 95, successRate: 60, responseRate: 70, conversionRate: 22, lastTraining: "2025-12-14", capabilities: ["Follow-up", "Reengajamento"] },
  { id: "a5", companyId: "c3", name: "Agente Premium Coliseu Hub", status: "active", objective: "qualification", tone: "consultive", segment: "Coworking", product: "Espaços Premium e Salas de Reunião", knowledgeBase: ["Qualificação", "Consultoria", "Espaços corporativos"], communicationStyle: "Consultivo e acolhedor", commercialStrategy: "Qualificação detalhada com tours virtuais", totalInteractions: 160, successRate: 70, responseRate: 82, conversionRate: 38, lastTraining: "2025-12-11", capabilities: ["Qualificação", "Agendamento", "Tour Virtual"] },
];

export const mockAutomationSequences: AutomationSequence[] = [
  { id: "seq1", name: "Prospecção Inicial - Email", channel: "email", steps: [
    { id: "s1", order: 1, type: "message", content: "Email de apresentação da empresa", delayDays: 0 },
    { id: "s2", order: 2, type: "wait", content: "", delayDays: 3 },
    { id: "s3", order: 3, type: "message", content: "Follow-up com case de sucesso", delayDays: 0 },
    { id: "s4", order: 4, type: "wait", content: "", delayDays: 5 },
    { id: "s5", order: 5, type: "message", content: "Convite para reunião", delayDays: 0 },
  ], active: true, leadsEnrolled: 45, responseRate: 32 },
  { id: "seq2", name: "Follow-up WhatsApp", channel: "whatsapp", steps: [
    { id: "s6", order: 1, type: "message", content: "Mensagem de contato inicial", delayDays: 0 },
    { id: "s7", order: 2, type: "wait", content: "", delayDays: 2 },
    { id: "s8", order: 3, type: "message", content: "Envio de material comercial", delayDays: 0 },
  ], active: true, leadsEnrolled: 30, responseRate: 48 },
  { id: "seq3", name: "Conexão LinkedIn", channel: "linkedin", steps: [
    { id: "s9", order: 1, type: "message", content: "Pedido de conexão personalizado", delayDays: 0 },
    { id: "s10", order: 2, type: "wait", content: "", delayDays: 7 },
    { id: "s11", order: 3, type: "message", content: "Mensagem com conteúdo de valor", delayDays: 0 },
  ], active: false, leadsEnrolled: 20, responseRate: 25 },
];

export const mockSalesGoals: SalesGoal[] = [
  { id: "g1", userId: "u3", month: "2025-12", targetValue: 200000, targetLeads: 10, achievedValue: 120000, achievedLeads: 6 },
  { id: "g2", userId: "u6", month: "2025-12", targetValue: 180000, targetLeads: 8, achievedValue: 55000, achievedLeads: 3 },
  { id: "g3", userId: "u4", month: "2025-12", targetValue: 0, targetLeads: 30, achievedValue: 0, achievedLeads: 18 },
  { id: "g4", userId: "u5", month: "2025-12", targetValue: 0, targetLeads: 25, achievedValue: 0, achievedLeads: 15 },
];

export const mockLeadSources: LeadSource[] = [
  { id: "ls1", name: "Formulário do Site Principal", channelType: "form", active: true, companyId: "c1", responsibleId: "u4", initialStage: "received", leadsGenerated: 128, conversionRate: 35 },
  { id: "ls2", name: "Landing Page - Campanha Verão", channelType: "landing_page", active: true, companyId: "c1", responsibleId: "u5", initialStage: "received", leadsGenerated: 85, conversionRate: 42 },
  { id: "ls3", name: "Meta Ads - Remarketing", channelType: "meta_ads", active: true, companyId: "c2", responsibleId: "u4", initialStage: "received", leadsGenerated: 210, conversionRate: 28 },
  { id: "ls4", name: "Google Ads - Pesquisa", channelType: "google_ads", active: true, companyId: "c2", responsibleId: "u5", initialStage: "received", leadsGenerated: 175, conversionRate: 31 },
  { id: "ls5", name: "WhatsApp Business", channelType: "whatsapp", active: true, companyId: "c1", responsibleId: "u4", initialStage: "received", leadsGenerated: 92, conversionRate: 55 },
  { id: "ls6", name: "Email Marketing", channelType: "email", active: false, companyId: "c3", responsibleId: "u5", initialStage: "received", leadsGenerated: 45, conversionRate: 18 },
  { id: "ls7", name: "API - Parceiros", channelType: "api", active: true, companyId: "c3", responsibleId: "u4", initialStage: "received", leadsGenerated: 60, conversionRate: 40 },
  { id: "ls8", name: "Upload de Planilhas", channelType: "spreadsheet", active: true, companyId: "c4", responsibleId: "u5", initialStage: "received", leadsGenerated: 30, conversionRate: 22 },
];

export const mockLeadAutomationFlows: LeadAutomationFlow[] = [
  { id: "af1", name: "Boas-vindas + Qualificação", active: true, leadsProcessed: 320, conversionRate: 45, steps: [
    { id: "afs1", order: 1, type: "welcome", content: "Olá! Obrigado pelo interesse. Sou o assistente da Conexão Comercial.", delayMinutes: 0 },
    { id: "afs2", order: 2, type: "qualification", content: "Para melhor atendê-lo, qual o porte da sua empresa?", delayMinutes: 2 },
    { id: "afs3", order: 3, type: "question", content: "Qual o principal desafio comercial que você enfrenta hoje?", delayMinutes: 5 },
    { id: "afs4", order: 4, type: "schedule", content: "Gostaria de agendar uma reunião com nosso especialista?", delayMinutes: 10 },
  ]},
  { id: "af2", name: "Follow-up Rápido", active: true, leadsProcessed: 150, conversionRate: 38, steps: [
    { id: "afs5", order: 1, type: "welcome", content: "Oi! Vi que você demonstrou interesse em nossos serviços.", delayMinutes: 0 },
    { id: "afs6", order: 2, type: "schedule", content: "Posso agendar uma conversa rápida de 15 minutos?", delayMinutes: 3 },
  ]},
  { id: "af3", name: "Reengajamento", active: false, leadsProcessed: 80, conversionRate: 22, steps: [
    { id: "afs7", order: 1, type: "welcome", content: "Olá novamente! Notamos que faz um tempo que conversamos.", delayMinutes: 0 },
    { id: "afs8", order: 2, type: "question", content: "Houve alguma mudança no cenário da sua empresa?", delayMinutes: 5 },
    { id: "afs9", order: 3, type: "schedule", content: "Temos novidades que podem interessar. Quer agendar um bate-papo?", delayMinutes: 15 },
  ]},
];
