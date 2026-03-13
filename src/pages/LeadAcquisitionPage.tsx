import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Megaphone, Globe, MessageSquare, Mail, Upload, Code, FileSpreadsheet,
  ArrowRight, Play, Pause, Plus, Eye, TrendingUp, Users, Clock, Zap,
  BarChart3, Target,
} from "lucide-react";
import { useCRM } from "@/contexts/CRMContext";
import { mockLeadSources, mockLeadAutomationFlows } from "@/data/mockData";
import { formatCurrency } from "@/lib/format";
import type { LeadChannelType, LeadSource } from "@/types/crm";

const channelIcons: Record<LeadChannelType, typeof Globe> = {
  form: Globe,
  landing_page: Target,
  meta_ads: Megaphone,
  google_ads: Megaphone,
  whatsapp: MessageSquare,
  email: Mail,
  api: Code,
  spreadsheet: FileSpreadsheet,
};

const channelLabels: Record<LeadChannelType, string> = {
  form: "Formulário de Site",
  landing_page: "Landing Page",
  meta_ads: "Meta Ads",
  google_ads: "Google Ads",
  whatsapp: "WhatsApp",
  email: "Email",
  api: "API",
  spreadsheet: "Planilha",
};

export default function LeadAcquisitionPage() {
  const { companies, users, leads } = useCRM();
  const [sources, setSources] = useState<LeadSource[]>(mockLeadSources);
  const [flows] = useState(mockLeadAutomationFlows);

  const totalLeadsGenerated = sources.reduce((sum, s) => sum + s.leadsGenerated, 0);
  const activeSources = sources.filter((s) => s.active).length;
  const avgConversion = sources.length
    ? Math.round(sources.reduce((sum, s) => sum + s.conversionRate, 0) / sources.length)
    : 0;
  const leadsToday = Math.floor(totalLeadsGenerated * 0.03);

  const toggleSource = (id: string) => {
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  // Leads by origin for monitoring
  const leadsByOrigin = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.origin] = (acc[l.origin] || 0) + 1;
    return acc;
  }, {});
  const pendingLeads = leads.filter((l) => l.status === "received").length;
  const inProgressLeads = leads.filter((l) => l.status === "first_contact" || l.status === "qualified").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Aquisição de Leads</h1>
        <p className="text-muted-foreground text-sm">Centralize canais de entrada e automatize o fluxo de captação</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Leads Gerados</p>
                <p className="text-xl font-bold text-foreground">{totalLeadsGenerated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Canais Ativos</p>
                <p className="text-xl font-bold text-foreground">{activeSources}/{sources.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Conversão Média</p>
                <p className="text-xl font-bold text-foreground">{avgConversion}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Leads Hoje</p>
                <p className="text-xl font-bold text-foreground">{leadsToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="channels" className="space-y-4">
        <TabsList>
          <TabsTrigger value="channels">Canais de Entrada</TabsTrigger>
          <TabsTrigger value="flows">Fluxos Automáticos</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
        </TabsList>

        {/* ===== CANAIS DE ENTRADA ===== */}
        <TabsContent value="channels" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Canais de Entrada de Leads</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Novo Canal</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Canal de Entrada</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <Label>Nome do Canal</Label>
                    <Input placeholder="Ex: Formulário de contato" />
                  </div>
                  <div>
                    <Label>Tipo de Canal</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(channelLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Empresa Vinculada</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {companies.filter((c) => c.status === "active").map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Responsável Inicial</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {users.filter((u) => u.active).map((u) => (
                          <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Criar Canal</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((source) => {
              const Icon = channelIcons[source.channelType];
              const company = companies.find((c) => c.id === source.companyId);
              const responsible = users.find((u) => u.id === source.responsibleId);
              return (
                <Card key={source.id} className="relative overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-foreground">{source.name}</h3>
                          <Badge variant="outline" className="text-[10px] mt-0.5">
                            {channelLabels[source.channelType]}
                          </Badge>
                        </div>
                      </div>
                      <Switch checked={source.active} onCheckedChange={() => toggleSource(source.id)} />
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center border-t border-border pt-3">
                      <div>
                        <p className="text-lg font-bold text-foreground">{source.leadsGenerated}</p>
                        <p className="text-[10px] text-muted-foreground">Leads</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-success">{source.conversionRate}%</p>
                        <p className="text-[10px] text-muted-foreground">Conversão</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">{company?.name || "—"}</p>
                        <p className="text-[10px] text-muted-foreground">Empresa</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Responsável: {responsible?.name || "—"}</span>
                      <Badge variant={source.active ? "default" : "secondary"} className="text-[10px]">
                        {source.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Form Generator */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Gerador de Formulário</CardTitle>
              <CardDescription>Gere um formulário para incorporar em sites e landing pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["Nome", "Telefone", "Email", "Empresa", "Segmento", "Mensagem"].map((field) => (
                  <div key={field} className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/30">
                    <Switch defaultChecked className="scale-75" />
                    <span className="text-xs text-foreground">{field}</span>
                  </div>
                ))}
              </div>
              <div>
                <Label className="text-xs">Código de Incorporação</Label>
                <Textarea
                  readOnly
                  className="font-mono text-xs h-20"
                  value={`<iframe src="https://app.conexaocomercial.com/form/embed?company=c1" width="100%" height="500"></iframe>`}
                />
              </div>
              <Button variant="outline" size="sm"><Code className="w-4 h-4 mr-1" /> Copiar Código</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== FLUXOS AUTOMÁTICOS ===== */}
        <TabsContent value="flows" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Fluxos Automáticos de Atendimento</h2>
            <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Novo Fluxo</Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {flows.map((flow) => (
              <Card key={flow.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{flow.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant={flow.active ? "default" : "secondary"} className="text-[10px]">
                          {flow.active ? "Ativo" : "Inativo"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{flow.leadsProcessed} leads processados</span>
                        <span className="text-xs text-success font-medium">{flow.conversionRate}% conversão</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {flow.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {flow.steps.map((step, idx) => (
                      <div key={step.id} className="flex items-center gap-2 shrink-0">
                        <div className="p-3 rounded-lg border border-border bg-muted/30 min-w-[200px]">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[10px] capitalize">{step.type}</Badge>
                            {step.delayMinutes > 0 && (
                              <span className="text-[10px] text-muted-foreground">⏱ {step.delayMinutes}min</span>
                            )}
                          </div>
                          <p className="text-xs text-foreground line-clamp-2">{step.content}</p>
                        </div>
                        {idx < flow.steps.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Distribution Rules */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Atribuição Automática de Leads</CardTitle>
              <CardDescription>Configure como os leads são distribuídos para a equipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Distribuição por rodada entre SDRs", desc: "Leads distribuídos igualmente entre os SDRs ativos", active: true },
                { label: "Distribuição por equipe", desc: "Leads direcionados conforme a equipe do canal", active: false },
                { label: "Distribuição manual pelo gestor", desc: "Gestor atribui cada lead manualmente", active: false },
              ].map((rule) => (
                <div key={rule.label} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">{rule.label}</p>
                    <p className="text-xs text-muted-foreground">{rule.desc}</p>
                  </div>
                  <Switch defaultChecked={rule.active} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== MONITORAMENTO ===== */}
        <TabsContent value="monitoring" className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Monitoramento em Tempo Real</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{pendingLeads}</p>
                <p className="text-xs text-muted-foreground">Aguardando Resposta</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{inProgressLeads}</p>
                <p className="text-xs text-muted-foreground">Em Atendimento</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{leads.length}</p>
                <p className="text-xs text-muted-foreground">Total de Leads</p>
              </CardContent>
            </Card>
          </div>

          {/* Leads by origin */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Leads por Canal de Origem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(leadsByOrigin)
                  .sort(([, a], [, b]) => b - a)
                  .map(([origin, count]) => {
                    const pct = Math.round((count / leads.length) * 100);
                    return (
                      <div key={origin}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground font-medium">{origin}</span>
                          <span className="text-muted-foreground">{count} leads ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Recent leads */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Leads Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leads.slice(0, 8).map((lead) => {
                  const company = companies.find((c) => c.id === lead.companyId);
                  return (
                    <div key={lead.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{lead.name}</p>
                          <p className="text-[10px] text-muted-foreground">{lead.origin} · {company?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-foreground">{formatCurrency(lead.potentialValue)}</p>
                        <p className="text-[10px] text-muted-foreground">{lead.entryDate}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
