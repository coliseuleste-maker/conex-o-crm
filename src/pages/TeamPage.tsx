import { useCRM } from "@/contexts/CRMContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercent, teamRoleLabels, qualificationLabels, statusLabels } from "@/lib/format";
import { Users, Target, TrendingUp, DollarSign, Award, Phone, CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";
import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["hsl(220, 70%, 25%)", "hsl(200, 80%, 45%)", "hsl(152, 60%, 40%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)", "hsl(270, 60%, 55%)"];

export default function TeamPage() {
  const { users, leads, salesGoals, companies, updateLeadQualification, assignLeadToUser } = useCRM();
  const [activeTab, setActiveTab] = useState("overview");

  const sdrs = users.filter((u) => u.teamRole === "sdr" && u.active);
  const executives = users.filter((u) => u.teamRole === "executive" && u.active);
  const managers = users.filter((u) => u.teamRole === "manager" && u.active);

  const getSDRMetrics = (userId: string) => {
    const assigned = leads.filter((l) => l.assignedSdrId === userId);
    const qualified = assigned.filter((l) => l.qualification === "qualified");
    const unqualified = assigned.filter((l) => l.qualification === "unqualified");
    const pending = assigned.filter((l) => l.qualification === "pending");
    const qualRate = assigned.length > 0 ? (qualified.length / assigned.length) * 100 : 0;
    return { assigned: assigned.length, qualified: qualified.length, unqualified: unqualified.length, pending: pending.length, qualRate };
  };

  const getExecMetrics = (userId: string) => {
    const assigned = leads.filter((l) => l.assignedExecutiveId === userId);
    const inNeg = assigned.filter((l) => ["proposal_sent", "negotiation"].includes(l.status));
    const closed = assigned.filter((l) => l.status === "closed");
    const lost = assigned.filter((l) => l.status === "lost");
    const closedValue = closed.reduce((s, l) => s + l.potentialValue, 0);
    const negValue = inNeg.reduce((s, l) => s + l.potentialValue, 0);
    const convRate = assigned.length > 0 ? (closed.length / assigned.length) * 100 : 0;
    const ticketMedio = closed.length > 0 ? closedValue / closed.length : 0;
    return { assigned: assigned.length, inNeg: inNeg.length, closed: closed.length, lost: lost.length, closedValue, negValue, convRate, ticketMedio };
  };

  // Rankings
  const execRanking = executives.map((u) => ({ user: u, ...getExecMetrics(u.id) })).sort((a, b) => b.closedValue - a.closedValue);
  const sdrRanking = sdrs.map((u) => ({ user: u, ...getSDRMetrics(u.id) })).sort((a, b) => b.qualified - a.qualified);

  // SDR unassigned leads
  const pendingLeads = leads.filter((l) => l.qualification === "pending" && l.assignedSdrId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Equipe Comercial</h1>
        <p className="text-sm text-muted-foreground">{sdrs.length} SDRs · {executives.length} Executivos · {managers.length} Gestores</p>
      </div>

      {/* Team KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: "SDRs Ativos", value: sdrs.length, icon: Phone, accent: "text-accent" },
          { label: "Executivos", value: executives.length, icon: Target, accent: "text-primary" },
          { label: "Leads Qualificados", value: leads.filter((l) => l.qualification === "qualified").length, icon: CheckCircle, accent: "text-success" },
          { label: "Em Negociação", value: formatCurrency(leads.filter((l) => ["negotiation", "proposal_sent"].includes(l.status)).reduce((s, l) => s + l.potentialValue, 0)), icon: TrendingUp, accent: "text-warning" },
          { label: "Fechamentos", value: leads.filter((l) => l.status === "closed").length, icon: Award, accent: "text-success" },
          { label: "Receita Gerada", value: formatCurrency(leads.filter((l) => l.status === "closed").reduce((s, l) => s + l.potentialValue, 0)), icon: DollarSign, accent: "text-success" },
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="sdr">Painel SDR</TabsTrigger>
          <TabsTrigger value="executive">Painel Executivo</TabsTrigger>
          <TabsTrigger value="manager">Painel Gestor</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ranking Executivos */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Ranking — Executivos Comerciais</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {execRanking.map((er, i) => (
                    <div key={er.user.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <span className="text-lg font-bold text-muted-foreground w-6">#{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{er.user.name}</p>
                        <p className="text-[11px] text-muted-foreground">{er.closed} fechamentos · {formatPercent(er.convRate)} conversão</p>
                      </div>
                      <p className="text-sm font-bold text-success">{formatCurrency(er.closedValue)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ranking SDRs */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Ranking — SDRs</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sdrRanking.map((sr, i) => (
                    <div key={sr.user.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <span className="text-lg font-bold text-muted-foreground w-6">#{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{sr.user.name}</p>
                        <p className="text-[11px] text-muted-foreground">{sr.qualified} qualificados de {sr.assigned} · {formatPercent(sr.qualRate)}</p>
                      </div>
                      <Badge variant="secondary">{sr.pending} pendentes</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance chart */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Performance por Colaborador</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[...execRanking.map((e) => ({ name: e.user.name.split(" ")[0], fechado: e.closedValue, negociação: e.negValue })), ...sdrRanking.map((s) => ({ name: s.user.name.split(" ")[0], qualificados: s.qualified, pendentes: s.pending }))]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => typeof v === "number" && v > 1000 ? formatCurrency(v) : v} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="fechado" name="Valor Fechado" fill="hsl(152, 60%, 40%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="negociação" name="Em Negociação" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="qualificados" name="Qualificados" fill="hsl(200, 80%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SDR PANEL */}
        <TabsContent value="sdr" className="space-y-6">
          {sdrs.map((sdr) => {
            const m = getSDRMetrics(sdr.id);
            const sdrLeads = leads.filter((l) => l.assignedSdrId === sdr.id);
            return (
              <Card key={sdr.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">{sdr.name} — SDR</CardTitle>
                    <Badge variant="secondary">{formatPercent(m.qualRate)} taxa qualif.</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: "Recebidos", value: m.assigned, color: "text-accent" },
                      { label: "Qualificados", value: m.qualified, color: "text-success" },
                      { label: "Descartados", value: m.unqualified, color: "text-destructive" },
                      { label: "Pendentes", value: m.pending, color: "text-warning" },
                    ].map((k) => (
                      <div key={k.label} className="text-center p-2 rounded-lg bg-muted/50">
                        <p className={`text-lg font-bold ${k.color}`}>{k.value}</p>
                        <p className="text-[10px] text-muted-foreground">{k.label}</p>
                      </div>
                    ))}
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lead</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Tentativas</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Qualificação</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sdrLeads.slice(0, 5).map((l) => {
                        const comp = companies.find((c) => c.id === l.companyId);
                        return (
                          <TableRow key={l.id}>
                            <TableCell><p className="font-medium text-sm">{l.name}</p><p className="text-[11px] text-muted-foreground">{l.email}</p></TableCell>
                            <TableCell className="text-sm">{comp?.name}</TableCell>
                            <TableCell className="text-sm">{l.contactAttempts}</TableCell>
                            <TableCell>
                              <span className={`text-sm font-medium ${l.score >= 80 ? "text-success" : l.score >= 50 ? "text-warning" : "text-destructive"}`}>{l.score}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant={l.qualification === "qualified" ? "default" : l.qualification === "unqualified" ? "destructive" : "secondary"} className="text-[10px]">
                                {qualificationLabels[l.qualification]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {l.qualification === "pending" && (
                                  <>
                                    <Button size="sm" variant="ghost" className="h-7 text-xs text-success" onClick={() => updateLeadQualification(l.id, "qualified")}>
                                      <CheckCircle className="w-3 h-3 mr-1" />Qualif.
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => updateLeadQualification(l.id, "unqualified")}>
                                      <XCircle className="w-3 h-3 mr-1" />Desc.
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* EXECUTIVE PANEL */}
        <TabsContent value="executive" className="space-y-6">
          {executives.map((exec) => {
            const m = getExecMetrics(exec.id);
            const execLeads = leads.filter((l) => l.assignedExecutiveId === exec.id);
            const goal = salesGoals.find((g) => g.userId === exec.id);
            return (
              <Card key={exec.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">{exec.name} — Executivo Comercial</CardTitle>
                    {goal && <Badge variant="secondary">{formatPercent((goal.achievedValue / goal.targetValue) * 100)} da meta</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { label: "Em Negociação", value: m.inNeg, color: "text-warning" },
                      { label: "Valor Negoc.", value: formatCurrency(m.negValue), color: "text-warning" },
                      { label: "Fechamentos", value: m.closed, color: "text-success" },
                      { label: "Conversão", value: formatPercent(m.convRate), color: "text-accent" },
                      { label: "Ticket Médio", value: formatCurrency(m.ticketMedio), color: "text-primary" },
                    ].map((k) => (
                      <div key={k.label} className="text-center p-2 rounded-lg bg-muted/50">
                        <p className={`text-sm font-bold ${k.color}`}>{k.value}</p>
                        <p className="text-[10px] text-muted-foreground">{k.label}</p>
                      </div>
                    ))}
                  </div>

                  {goal && (
                    <div className="p-3 rounded-lg border border-border">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Meta: {formatCurrency(goal.targetValue)}</span>
                        <span>Realizado: {formatCurrency(goal.achievedValue)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-success rounded-full h-2 transition-all" style={{ width: `${Math.min((goal.achievedValue / goal.targetValue) * 100, 100)}%` }} />
                      </div>
                    </div>
                  )}

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lead</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {execLeads.filter((l) => !["lost"].includes(l.status)).slice(0, 5).map((l) => (
                        <TableRow key={l.id}>
                          <TableCell className="font-medium text-sm">{l.name}</TableCell>
                          <TableCell className="text-sm">{formatCurrency(l.potentialValue)}</TableCell>
                          <TableCell><Badge variant="secondary" className="text-[10px]">{statusLabels[l.status]}</Badge></TableCell>
                          <TableCell><span className={`text-sm font-medium ${l.score >= 80 ? "text-success" : "text-warning"}`}>{l.score}</span></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* MANAGER PANEL */}
        <TabsContent value="manager" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metas vs Resultados */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Metas vs Resultados</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={salesGoals.filter((g) => g.targetValue > 0).map((g) => {
                    const u = users.find((u) => u.id === g.userId);
                    return { name: u?.name.split(" ")[0] || "", meta: g.targetValue, realizado: g.achievedValue };
                  })}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="meta" name="Meta" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} opacity={0.4} />
                    <Bar dataKey="realizado" name="Realizado" fill="hsl(152, 60%, 40%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Conversão por Vendedor */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Conversão por Vendedor</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={execRanking.map((e) => ({ name: e.user.name.split(" ")[0], conversão: e.convRate }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip formatter={(v: number) => formatPercent(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="conversão" name="Taxa Conversão" fill="hsl(200, 80%, 45%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Pipeline Geral */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Pipeline Geral — Distribuição</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Em Negociação</TableHead>
                    <TableHead>Fechados</TableHead>
                    <TableHead>Receita</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.filter((u) => u.teamRole && u.active).map((u) => {
                    const uLeads = leads.filter((l) => l.assignedSdrId === u.id || l.assignedExecutiveId === u.id);
                    const uNeg = uLeads.filter((l) => ["negotiation", "proposal_sent"].includes(l.status));
                    const uClosed = uLeads.filter((l) => l.status === "closed");
                    return (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium text-sm">{u.name}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-[10px]">{teamRoleLabels[u.teamRole!]}</Badge></TableCell>
                        <TableCell className="text-sm">{uLeads.length}</TableCell>
                        <TableCell className="text-sm">{uNeg.length}</TableCell>
                        <TableCell className="text-sm">{uClosed.length}</TableCell>
                        <TableCell className="text-sm font-medium text-success">{formatCurrency(uClosed.reduce((s, l) => s + l.potentialValue, 0))}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
