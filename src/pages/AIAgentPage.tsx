import { useCRM } from "@/contexts/CRMContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Bot, Brain, Zap, MessageSquare, Calendar, Target, Sparkles, GraduationCap, Activity } from "lucide-react";
import { formatPercent } from "@/lib/format";

export default function AIAgentPage() {
  const { aiAgents, users } = useCRM();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agentes de IA Comerciais</h1>
        <p className="text-sm text-muted-foreground">Configure e treine agentes inteligentes para cada colaborador</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Agentes Ativos", value: aiAgents.filter((a) => a.status === "active").length, icon: Bot, accent: "text-success" },
          { label: "Em Treinamento", value: aiAgents.filter((a) => a.status === "training").length, icon: Brain, accent: "text-warning" },
          { label: "Total Interações", value: aiAgents.reduce((s, a) => s + a.totalInteractions, 0), icon: MessageSquare, accent: "text-accent" },
          { label: "Taxa Média Sucesso", value: formatPercent(aiAgents.reduce((s, a) => s + a.successRate, 0) / (aiAgents.length || 1)), icon: Target, accent: "text-success" },
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

      {/* Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {aiAgents.map((agent) => {
          const user = users.find((u) => u.id === agent.userId);
          return (
            <Card key={agent.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{agent.name}</CardTitle>
                      <p className="text-[11px] text-muted-foreground">{user?.name}</p>
                    </div>
                  </div>
                  <Badge variant={agent.status === "active" ? "default" : agent.status === "training" ? "secondary" : "outline"} className="text-[10px]">
                    {agent.status === "active" ? "Ativo" : agent.status === "training" ? "Treinando" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-muted/50 text-center">
                    <p className="text-sm font-bold text-foreground">{agent.totalInteractions}</p>
                    <p className="text-[10px] text-muted-foreground">Interações</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50 text-center">
                    <p className="text-sm font-bold text-success">{formatPercent(agent.successRate)}</p>
                    <p className="text-[10px] text-muted-foreground">Taxa Sucesso</p>
                  </div>
                </div>

                {/* Knowledge */}
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground mb-1">Base de Conhecimento</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.knowledgeBase.map((k) => (
                      <Badge key={k} variant="outline" className="text-[10px]">{k}</Badge>
                    ))}
                  </div>
                </div>

                {/* Style & Strategy */}
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-[11px] text-muted-foreground">{agent.communicationStyle}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-[11px] text-muted-foreground">{agent.commercialStrategy}</p>
                  </div>
                </div>

                {/* Capabilities */}
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground mb-1">Capacidades</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.map((c) => (
                      <span key={c} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                        <Sparkles className="w-2.5 h-2.5" />{c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <GraduationCap className="w-3 h-3 mr-1" />Treinar Agente
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <Activity className="w-3 h-3 mr-1" />Ver Histórico
                  </Button>
                </div>

                {agent.lastTraining && (
                  <p className="text-[10px] text-muted-foreground text-center">Último treinamento: {agent.lastTraining}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Architecture Info */}
      <Card className="border-accent/20 bg-accent/5">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Funcionalidades Futuras dos Agentes</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: MessageSquare, title: "Respostas Automáticas", desc: "Responder leads automaticamente com personalização baseada no perfil" },
              { icon: Brain, title: "Qualificação por IA", desc: "Classificar leads com base em critérios aprendidos do histórico" },
              { icon: Calendar, title: "Agendamento Inteligente", desc: "Agendar reuniões automaticamente conforme disponibilidade" },
            ].map((feat) => (
              <div key={feat.title} className="flex gap-3 p-3 rounded-lg bg-card border border-border">
                <feat.icon className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">{feat.title}</p>
                  <p className="text-[11px] text-muted-foreground">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Sources */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Fontes de Aprendizado do Agente</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {["Histórico CRM", "Emails Enviados", "Reuniões Registradas", "Objeções dos Clientes", "Fechamentos Realizados"].map((source) => (
              <div key={source} className="p-3 rounded-lg border border-border text-center">
                <Brain className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-[11px] font-medium text-foreground">{source}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
