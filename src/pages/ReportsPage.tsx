import { useCRM } from "@/contexts/CRMContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, statusLabels } from "@/lib/format";
import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = [
  "hsl(220, 70%, 25%)", "hsl(200, 80%, 45%)", "hsl(152, 60%, 40%)",
  "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)", "hsl(270, 60%, 55%)",
];

export default function ReportsPage() {
  const { leads, companies, selectedCompanyId } = useCRM();
  const [companyFilter, setCompanyFilter] = useState<string>(selectedCompanyId || "all");

  const filtered = useMemo(
    () => (companyFilter === "all" ? leads : leads.filter((l) => l.companyId === companyFilter)),
    [leads, companyFilter]
  );

  const company = companies.find((c) => c.id === companyFilter);
  const totalLeads = filtered.length;
  const closedLeads = filtered.filter((l) => l.status === "closed");
  const lostLeads = filtered.filter((l) => l.status === "lost");
  const totalClosed = closedLeads.reduce((s, l) => s + l.potentialValue, 0);
  const totalNegotiation = filtered
    .filter((l) => ["negotiation", "proposal_sent"].includes(l.status))
    .reduce((s, l) => s + l.potentialValue, 0);
  const conversionRate = totalLeads > 0 ? (closedLeads.length / totalLeads) * 100 : 0;
  const commissionRate = company?.commissionRate || 0;
  const commissionExpected = (totalNegotiation + totalClosed) * (commissionRate / 100);
  const commissionReceived = totalClosed * (commissionRate / 100);

  const statusData = Object.entries(statusLabels).map(([key, label]) => ({
    name: label,
    value: filtered.filter((l) => l.status === key).length,
  }));

  const originData = filtered.reduce<Record<string, number>>((acc, l) => {
    acc[l.origin] = (acc[l.origin] || 0) + 1;
    return acc;
  }, {});
  const originChartData = Object.entries(originData).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
          <p className="text-sm text-muted-foreground">Análise detalhada de performance</p>
        </div>
        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as empresas</SelectItem>
            {companies.filter((c) => c.status === "active").map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total de Leads", value: totalLeads },
          { label: "Taxa de Conversão", value: `${conversionRate.toFixed(1)}%` },
          { label: "Em Negociação", value: formatCurrency(totalNegotiation) },
          { label: "Valor Fechado", value: formatCurrency(totalClosed) },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <p className="text-lg font-bold text-foreground">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {companyFilter !== "all" && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-lg font-bold text-success">{formatCurrency(commissionReceived)}</p>
              <p className="text-[11px] text-muted-foreground">Comissão Recebida ({commissionRate}%)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-lg font-bold text-warning">{formatCurrency(commissionExpected)}</p>
              <p className="text-[11px] text-muted-foreground">Comissão Prevista</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Funil de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Origem dos Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={originChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" name="Leads" fill="hsl(200, 80%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
