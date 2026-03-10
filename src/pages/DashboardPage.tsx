import { useCRM } from "@/contexts/CRMContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Building2, Users, DollarSign, TrendingUp, Target, Percent, Brain, AlertTriangle, Clock, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const COLORS = [
  "hsl(220, 70%, 25%)", "hsl(200, 80%, 45%)", "hsl(152, 60%, 40%)",
  "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)", "hsl(270, 60%, 55%)",
];

export default function DashboardPage() {
  const { companies, leads, users, salesGoals } = useCRM();

  const activeCompanies = companies.filter((c) => c.status === "active");
  const totalLeads = leads.length;
  const closedLeads = leads.filter((l) => l.status === "closed");
  const totalClosed = closedLeads.reduce((s, l) => s + l.potentialValue, 0);
  const totalInNegotiation = leads.filter((l) => ["negotiation", "proposal_sent"].includes(l.status)).reduce((s, l) => s + l.potentialValue, 0);
  const conversionRate = totalLeads > 0 ? (closedLeads.length / totalLeads) * 100 : 0;
  const totalCommission = closedLeads.reduce((s, l) => {
    const company = companies.find((c) => c.id === l.companyId);
    return s + (l.potentialValue * (company?.commissionRate || 0)) / 100;
  }, 0);
  const ticketMedio = closedLeads.length > 0 ? totalClosed / closedLeads.length : 0;
  const qualifiedLeads = leads.filter((l) => l.qualification === "qualified").length;
  const avgScore = leads.length > 0 ? leads.reduce((s, l) => s + l.score, 0) / leads.length : 0;

  // Opportunities detection
  const highProbLeads = leads.filter((l) => l.score >= 80 && !["closed", "lost"].includes(l.status));
  const abandonedLeads = leads.filter((l) => {
    if (["closed", "lost"].includes(l.status)) return false;
    if (!l.lastContactDate) return l.contactAttempts === 0;
    const daysSince = Math.floor((Date.now() - new Date(l.lastContactDate).getTime()) / (1000 * 60 * 60 * 24));
    return daysSince > 7;
  });

  const companyBarData = activeCompanies.map((c) => {
    const cLeads = leads.filter((l) => l.companyId === c.id);
    const closed = cLeads.filter((l) => l.status === "closed");
    const closedValue = closed.reduce((s, l) => s + l.potentialValue, 0);
    return { name: c.name.split(" ")[0], leads: cLeads.length, fechados: closedValue, comissao: (closedValue * c.commissionRate) / 100, ticket: closed.length > 0 ? closedValue / closed.length : 0 };
  });

  const statusData = [
    { name: "Recebido", value: leads.filter((l) => l.status === "received").length },
    { name: "1º Contato", value: leads.filter((l) => l.status === "first_contact").length },
    { name: "Qualificado", value: leads.filter((l) => l.status === "qualified").length },
    { name: "Proposta", value: leads.filter((l) => l.status === "proposal_sent").length },
    { name: "Negociação", value: leads.filter((l) => l.status === "negotiation").length },
    { name: "Fechado", value: leads.filter((l) => l.status === "closed").length },
    { name: "Perdido", value: leads.filter((l) => l.status === "lost").length },
  ];

  const originData = leads.reduce<Record<string, number>>((acc, l) => { acc[l.origin] = (acc[l.origin] || 0) + 1; return acc; }, {});
  const originChartData = Object.entries(originData).map(([name, value]) => ({ name, value }));

  // Sales forecast based on pipeline
  const forecastValue = leads.filter((l) => ["negotiation", "proposal_sent", "qualified"].includes(l.status)).reduce((s, l) => s + l.potentialValue * (l.score / 100), 0);

  const kpiCards = [
    { label: "Empresas Ativas", value: activeCompanies.length, icon: Building2, accent: "text-accent" },
    { label: "Total de Leads", value: totalLeads, icon: Users, accent: "text-accent" },
    { label: "Qualificados", value: qualifiedLeads, icon: Target, accent: "text-success" },
    { label: "Em Negociação", value: formatCurrency(totalInNegotiation), icon: TrendingUp, accent: "text-warning" },
    { label: "Valor Fechado", value: formatCurrency(totalClosed), icon: DollarSign, accent: "text-success" },
    { label: "Conversão", value: formatPercent(conversionRate), icon: Target, accent: "text-accent" },
    { label: "Ticket Médio", value: formatCurrency(ticketMedio), icon: DollarSign, accent: "text-primary" },
    { label: "Comissão Total", value: formatCurrency(totalCommission), icon: Percent, accent: "text-success" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral — RevOps Platform</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} className="border-border">
            <CardContent className="p-3">
              <kpi.icon className={`w-4 h-4 mb-1.5 ${kpi.accent}`} />
              <p className="text-base font-bold text-foreground">{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-4 flex items-start gap-3">
            <Brain className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Previsão de Vendas</p>
              <p className="text-lg font-bold text-success">{formatCurrency(forecastValue)}</p>
              <p className="text-[11px] text-muted-foreground">Baseado no pipeline ponderado por score</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="p-4 flex items-start gap-3">
            <Award className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Alta Probabilidade</p>
              <p className="text-lg font-bold text-accent">{highProbLeads.length} leads</p>
              <p className="text-[11px] text-muted-foreground">Score ≥ 80 em negociação ativa</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Atenção Necessária</p>
              <p className="text-lg font-bold text-warning">{abandonedLeads.length} leads</p>
              <p className="text-[11px] text-muted-foreground">Sem contato há +7 dias ou sem tentativa</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Comparativo por Empresa</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={companyBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="fechados" name="Valor Fechado" fill="hsl(220, 70%, 25%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="comissao" name="Comissão" fill="hsl(200, 80%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Funil de Vendas</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Origem dos Leads</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={originChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="value" name="Leads" fill="hsl(200, 80%, 45%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Ticket Médio por Empresa</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={companyBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="ticket" name="Ticket Médio" fill="hsl(270, 60%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Score & Segment Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Score Médio por Empresa</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeCompanies.map((c) => {
                const cLeads = leads.filter((l) => l.companyId === c.id);
                const avg = cLeads.length > 0 ? cLeads.reduce((s, l) => s + l.score, 0) / cLeads.length : 0;
                return (
                  <div key={c.id} className="flex items-center gap-3">
                    <p className="text-sm text-foreground w-24 truncate">{c.name}</p>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div className={`rounded-full h-2 transition-all ${avg >= 70 ? "bg-success" : avg >= 50 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${avg}%` }} />
                    </div>
                    <span className="text-sm font-medium text-foreground w-10 text-right">{avg.toFixed(0)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Segmentos mais Lucrativos</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...new Set(activeCompanies.map((c) => c.segment))].filter(Boolean).map((seg) => {
                const segCompanies = activeCompanies.filter((c) => c.segment === seg);
                const segLeads = leads.filter((l) => segCompanies.some((c) => c.id === l.companyId));
                const segClosed = segLeads.filter((l) => l.status === "closed");
                const segValue = segClosed.reduce((s, l) => s + l.potentialValue, 0);
                const segTicket = segClosed.length > 0 ? segValue / segClosed.length : 0;
                return (
                  <div key={seg} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{seg}</p>
                      <p className="text-[11px] text-muted-foreground">{segClosed.length} fechamentos · {segLeads.length} leads</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-success">{formatCurrency(segValue)}</p>
                      <p className="text-[10px] text-muted-foreground">Ticket: {formatCurrency(segTicket)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
