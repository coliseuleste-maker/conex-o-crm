import { useCRM } from "@/contexts/CRMContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Bot, Brain, Zap, MessageSquare, Calendar, Target, Sparkles, GraduationCap, Activity, Building2, Plus, Send, BarChart3 } from "lucide-react";
import { formatPercent } from "@/lib/format";
import { useState } from "react";
import { AIAgent, AgentObjective, AgentTone } from "@/types/crm";
import { toast } from "sonner";

const objectiveLabels: Record<AgentObjective, string> = { sales: "Vendas", qualification: "Qualificação", support: "Suporte", follow_up: "Follow-up", sdr: "SDR" };
const toneLabels: Record<AgentTone, string> = { formal: "Formal", consultive: "Consultivo", aggressive: "Agressivo", friendly: "Amigável" };

export default function AIAgentPage() {
  const { aiAgents, companies } = useCRM();
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [trainDialog, setTrainDialog] = useState<AIAgent | null>(null);
  const [chatDialog, setChatDialog] = useState<AIAgent | null>(null);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "agent"; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [filterCompany, setFilterCompany] = useState("all");

  const filteredAgents = filterCompany === "all" ? aiAgents : aiAgents.filter((a) => a.companyId === filterCompany);

  // Group agents by company
  const agentsByCompany = companies.reduce((acc, c) => {
    acc[c.id] = { company: c, agents: aiAgents.filter((a) => a.companyId === c.id) };
    return acc;
  }, {} as Record<string, { company: typeof companies[0]; agents: AIAgent[] }>);

  const startChat = (agent: AIAgent) => {
    setChatDialog(agent);
    setChatMessages([{ role: "agent", text: `Olá! Sou o ${agent.name}. Como posso ajudá-lo hoje?` }]);
    setChatInput("");
  };

  const sendChat = () => {
    if (!chatInput.trim() || !chatDialog) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    // Simulated agent response
    setTimeout(() => {
      const responses = [
        `Entendi! Com base na minha estratégia de ${chatDialog.commercialStrategy}, posso ajudá-lo com isso.`,
        `Ótima pergunta! O ${chatDialog.product} oferece exatamente o que você precisa.`,
        `Interessante! Posso agendar uma reunião para discutirmos em detalhes?`,
        `Perfeito! Deixe-me qualificar melhor sua necessidade com algumas perguntas.`,
      ];
      setChatMessages((prev) => [...prev, { role: "agent", text: responses[Math.floor(Math.random() * responses.length)] }]);
    }, 800);
  };

  const handleTrainSave = () => {
    toast.success("Treinamento atualizado com sucesso!");
    setTrainDialog(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agentes de IA Comerciais</h1>
          <p className="text-sm text-muted-foreground">Agentes que representam a identidade comercial de cada empresa</p>
        </div>
        <Select value={filterCompany} onValueChange={setFilterCompany}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Todas empresas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas empresas</SelectItem>
            {companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Agentes Ativos", value: aiAgents.filter((a) => a.status === "active").length, icon: Bot, accent: "text-success" },
          { label: "Em Treinamento", value: aiAgents.filter((a) => a.status === "training").length, icon: Brain, accent: "text-warning" },
          { label: "Total Interações", value: aiAgents.reduce((s, a) => s + a.totalInteractions, 0), icon: MessageSquare, accent: "text-accent" },
          { label: "Taxa Média Resposta", value: formatPercent(aiAgents.reduce((s, a) => s + a.responseRate, 0) / (aiAgents.length || 1)), icon: Zap, accent: "text-primary" },
          { label: "Conversão Média", value: formatPercent(aiAgents.reduce((s, a) => s + a.conversionRate, 0) / (aiAgents.length || 1)), icon: Target, accent: "text-success" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <kpi.icon className={`w-5 h-5 mb-2 ${kpi.accent}`} />
              <p className="text-lg font-bold text-foreground">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents"><Bot className="w-4 h-4 mr-1" />Agentes por Empresa</TabsTrigger>
          <TabsTrigger value="performance"><BarChart3 className="w-4 h-4 mr-1" />Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-6">
          {Object.entries(agentsByCompany).filter(([, v]) => v.agents.length > 0 && (filterCompany === "all" || filterCompany === v.company.id)).map(([, { company, agents }]) => (
            <div key={company.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">{company.name}</h2>
                <Badge variant="outline" className="text-[10px]">{company.segment}</Badge>
                <Badge variant="secondary" className="text-[10px]">{agents.length} agentes</Badge>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {agents.map((agent) => (
                  <Card key={agent.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-sm">{agent.name}</CardTitle>
                            <p className="text-[11px] text-muted-foreground">{objectiveLabels[agent.objective]} · {toneLabels[agent.tone]}</p>
                          </div>
                        </div>
                        <Badge variant={agent.status === "active" ? "default" : agent.status === "training" ? "secondary" : "outline"} className="text-[10px]">
                          {agent.status === "active" ? "Ativo" : agent.status === "training" ? "Treinando" : "Inativo"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 rounded-lg bg-muted/50 text-center">
                          <p className="text-sm font-bold text-foreground">{agent.totalInteractions}</p>
                          <p className="text-[10px] text-muted-foreground">Interações</p>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50 text-center">
                          <p className="text-sm font-bold text-primary">{formatPercent(agent.responseRate)}</p>
                          <p className="text-[10px] text-muted-foreground">Resposta</p>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50 text-center">
                          <p className="text-sm font-bold text-success">{formatPercent(agent.conversionRate)}</p>
                          <p className="text-[10px] text-muted-foreground">Conversão</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex items-center gap-2">
                          <Target className="w-3 h-3 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">{agent.segment} · {agent.product}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-3 h-3 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">{agent.communicationStyle}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {agent.capabilities.map((c) => (
                          <span key={c} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                            <Sparkles className="w-2.5 h-2.5" />{c}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Dialog open={trainDialog?.id === agent.id} onOpenChange={(o) => setTrainDialog(o ? agent : null)}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="flex-1 text-xs"><GraduationCap className="w-3 h-3 mr-1" />Treinar</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader><DialogTitle>Treinar: {agent.name}</DialogTitle></DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Descrição da Empresa</Label>
                                <Textarea defaultValue={agent.trainingData?.companyDescription} placeholder="Descreva a empresa..." className="mt-1" />
                              </div>
                              <div>
                                <Label>Produtos e Serviços</Label>
                                <Textarea defaultValue={agent.trainingData?.productsServices} placeholder="Liste produtos e serviços..." className="mt-1" />
                              </div>
                              <div>
                                <Label>Público-Alvo</Label>
                                <Textarea defaultValue={agent.trainingData?.targetAudience} placeholder="Descreva o público-alvo..." className="mt-1" />
                              </div>
                              <div>
                                <Label>Scripts de Vendas</Label>
                                <Textarea defaultValue={agent.trainingData?.salesScripts} placeholder="Scripts de abordagem..." className="mt-1" />
                              </div>
                              <div>
                                <Label>Perguntas Frequentes</Label>
                                <Textarea defaultValue={agent.trainingData?.faq} placeholder="FAQ do produto/serviço..." className="mt-1" />
                              </div>
                              <div>
                                <Label>Objeções Comuns</Label>
                                <Textarea defaultValue={agent.trainingData?.commonObjections} placeholder="Objeções e respostas..." className="mt-1" />
                              </div>
                              <div>
                                <Label>Materiais Comerciais</Label>
                                <Textarea defaultValue={agent.trainingData?.commercialMaterials} placeholder="Links, PDFs, referências..." className="mt-1" />
                              </div>
                              <Button className="w-full" onClick={handleTrainSave}><Brain className="w-4 h-4 mr-1" />Salvar Treinamento</Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => startChat(agent)}>
                          <MessageSquare className="w-3 h-3 mr-1" />Simular
                        </Button>
                      </div>

                      {agent.lastTraining && <p className="text-[10px] text-muted-foreground text-center">Último treinamento: {agent.lastTraining}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAgents.map((agent) => {
              const company = companies.find((c) => c.id === agent.companyId);
              return (
                <Card key={agent.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{agent.name}</CardTitle>
                      <Badge variant="outline" className="text-[10px]">{company?.name}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Taxa de Sucesso</span>
                        <span className="font-medium text-foreground">{formatPercent(agent.successRate)}</span>
                      </div>
                      <Progress value={agent.successRate} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Taxa de Resposta</span>
                        <span className="font-medium text-foreground">{formatPercent(agent.responseRate)}</span>
                      </div>
                      <Progress value={agent.responseRate} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Taxa de Conversão</span>
                        <span className="font-medium text-foreground">{formatPercent(agent.conversionRate)}</span>
                      </div>
                      <Progress value={agent.conversionRate} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2 rounded-lg bg-muted/50 text-center">
                        <p className="text-sm font-bold text-foreground">{agent.totalInteractions}</p>
                        <p className="text-[10px] text-muted-foreground">Interações</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50 text-center">
                        <p className="text-sm font-bold text-foreground">{objectiveLabels[agent.objective]}</p>
                        <p className="text-[10px] text-muted-foreground">Objetivo</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Chat simulation dialog */}
      <Dialog open={!!chatDialog} onOpenChange={(o) => !o && setChatDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Simulação: {chatDialog?.name}</DialogTitle></DialogHeader>
          <div className="h-64 overflow-y-auto space-y-2 p-3 bg-muted/30 rounded-lg">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Simule uma mensagem de lead..." onKeyDown={(e) => e.key === "Enter" && sendChat()} />
            <Button size="icon" onClick={sendChat}><Send className="w-4 h-4" /></Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
