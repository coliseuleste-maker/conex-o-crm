import { useCRM } from "@/contexts/CRMContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/format";
import { useState, useMemo } from "react";
import { DollarSign, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function CommissionsPage() {
  const { leads, companies } = useCRM();
  const [companyFilter, setCompanyFilter] = useState<string>("all");

  const closedLeads = useMemo(
    () => leads.filter((l) => l.status === "closed" && (companyFilter === "all" || l.companyId === companyFilter)),
    [leads, companyFilter]
  );

  const commissionData = useMemo(() => {
    return companies
      .filter((c) => c.status === "active")
      .map((c) => {
        const cClosed = leads.filter((l) => l.status === "closed" && l.companyId === c.id);
        const closedValue = cClosed.reduce((s, l) => s + l.potentialValue, 0);
        const commission = (closedValue * c.commissionRate) / 100;
        return {
          company: c,
          closedCount: cClosed.length,
          closedValue,
          commission,
          rate: c.commissionRate,
        };
      });
  }, [leads, companies]);

  const totalCommission = commissionData.reduce((s, d) => s + d.commission, 0);
  const totalClosed = commissionData.reduce((s, d) => s + d.closedValue, 0);

  const chartData = commissionData.map((d) => ({
    name: d.company.name.split(" ")[0],
    comissao: d.commission,
    fechado: d.closedValue,
  }));

  const leadCommissions = closedLeads.map((l) => {
    const company = companies.find((c) => c.id === l.companyId);
    const rate = company?.commissionRate || 0;
    return {
      lead: l,
      company,
      commission: (l.potentialValue * rate) / 100,
      rate,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Comissões</h1>
          <p className="text-sm text-muted-foreground">Controle de comissões por empresa e lead</p>
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

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{formatCurrency(totalCommission)}</p>
              <p className="text-[11px] text-muted-foreground">Comissão Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{formatCurrency(totalClosed)}</p>
              <p className="text-[11px] text-muted-foreground">Valor Total Fechado</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">
                {totalClosed > 0 ? ((totalCommission / totalClosed) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-[11px] text-muted-foreground">Taxa Média de Comissão</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Comissão por Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="comissao" name="Comissão" fill="hsl(152, 60%, 40%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fechado" name="Valor Fechado" fill="hsl(220, 70%, 25%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detail Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Detalhamento por Lead Fechado</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Valor Fechado</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead>Comissão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leadCommissions.map((lc) => (
                <TableRow key={lc.lead.id}>
                  <TableCell className="font-medium text-sm">{lc.lead.name}</TableCell>
                  <TableCell className="text-sm">{lc.company?.name || "-"}</TableCell>
                  <TableCell className="text-sm">{formatCurrency(lc.lead.potentialValue)}</TableCell>
                  <TableCell className="text-sm">{lc.rate}%</TableCell>
                  <TableCell className="text-sm font-semibold text-success">{formatCurrency(lc.commission)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
