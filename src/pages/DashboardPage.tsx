import { useCRM } from "@/contexts/CRMContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { Building2, Users, DollarSign, TrendingUp, Target, Percent } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const COLORS = [
  "hsl(220, 70%, 25%)", "hsl(200, 80%, 45%)", "hsl(152, 60%, 40%)",
  "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)", "hsl(270, 60%, 55%)",
];

export default function DashboardPage() {
  const { companies, leads } = useCRM();

  const activeCompanies = companies.filter((c) => c.status === "active");
  const totalLeads = leads.length;
  const closedLeads = leads.filter((l) => l.status === "closed");
  const totalClosed = closedLeads.reduce((s, l) => s + l.potentialValue, 0);
  const totalInNegotiation = leads
    .filter((l) => ["negotiation", "proposal_sent"].includes(l.status))
    .reduce((s, l) => s + l.potentialValue, 0);
  const conversionRate = totalLeads > 0 ? (closedLeads.length / totalLeads) * 100 : 0;
  const totalCommission = closedLeads.reduce((s, l) => {
    const company = companies.find((c) => c.id === l.companyId);
    return s + (l.potentialValue * (company?.commissionRate || 0)) / 100;
  }, 0);

  const companyBarData = activeCompanies.map((c) => {
    const cLeads = leads.filter((l) => l.companyId === c.id);
    const closed = cLeads.filter((l) => l.status === "closed");
    const closedValue = closed.reduce((s, l) => s + l.potentialValue, 0);
    return {
      name: c.name.split(" ")[0],
      leads: cLeads.length,
      fechados: closedValue,
      comissao: (closedValue * c.commissionRate) / 100,
    };
  });

  const statusData = [
    { name: "Recebido", value: leads.filter((l) => l.status === "received").length },
    { name: "1º Contato", value: leads.filter((l) => l.status === "first_contact").length },
    { name: "Proposta", value: leads.filter((l) => l.status === "proposal_sent").length },
    { name: "Negociação", value: leads.filter((l) => l.status === "negotiation").length },
    { name: "Fechado", value: leads.filter((l) => l.status === "closed").length },
    { name: "Perdido", value: leads.filter((l) => l.status === "lost").length },
  ];

  const originData = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.origin] = (acc[l.origin] || 0) + 1;
    return acc;
  }, {});
  const originChartData = Object.entries(originData).map(([name, value]) => ({ name, value }));

  const kpiCards = [
    { label: "Empresas Ativas", value: activeCompanies.length, icon: Building2, accent: "text-accent" },
    { label: "Total de Leads", value: totalLeads, icon: Users, accent: "text-accent" },
    { label: "Em Negociação", value: formatCurrency(totalInNegotiation), icon: TrendingUp, accent: "text-warning" },
    { label: "Valor Fechado", value: formatCurrency(totalClosed), icon: DollarSign, accent: "text-success" },
    { label: "Taxa de Conversão", value: `${conversionRate.toFixed(1)}%`, icon: Target, accent: "text-accent" },
    { label: "Comissão Total", value: formatCurrency(totalCommission), icon: Percent, accent: "text-success" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral de todas as empresas</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`w-5 h-5 ${kpi.accent}`} />
              </div>
              <p className="text-lg font-bold text-foreground">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Company Comparison */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Comparativo por Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={companyBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))" }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="fechados" name="Valor Fechado" fill="hsl(220, 70%, 25%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="comissao" name="Comissão" fill="hsl(200, 80%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Funnel / Status Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Funil de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Origin & Leads by Company */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Origem dos Leads</CardTitle>
          </CardHeader>
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
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Leads por Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={companyBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="leads" name="Qtd Leads" fill="hsl(152, 60%, 40%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
