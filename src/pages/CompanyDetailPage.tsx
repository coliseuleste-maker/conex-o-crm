import { useParams, useNavigate } from "react-router-dom";
import { useCRM } from "@/contexts/CRMContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Users, DollarSign, TrendingUp, Target, Percent, Building2 } from "lucide-react";
import { useState, useMemo } from "react";
import { formatCurrency, statusLabels } from "@/lib/format";
import { Lead, LeadStatus } from "@/types/crm";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["hsl(220, 70%, 25%)", "hsl(200, 80%, 45%)", "hsl(152, 60%, 40%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)", "hsl(270, 60%, 55%)"];

const statusColors: Record<LeadStatus, string> = {
  received: "bg-muted text-muted-foreground",
  first_contact: "bg-accent/20 text-accent",
  qualified: "bg-success/20 text-success",
  unqualified: "bg-destructive/20 text-destructive",
  proposal_sent: "bg-warning/20 text-warning",
  negotiation: "bg-primary/20 text-primary",
  closed: "bg-success/20 text-success",
  lost: "bg-destructive/20 text-destructive",
};

const kanbanStages: { id: LeadStatus; label: string }[] = [
  { id: "received", label: "Recebido" },
  { id: "first_contact", label: "1º Contato" },
  { id: "qualified", label: "Qualificado" },
  { id: "proposal_sent", label: "Proposta" },
  { id: "negotiation", label: "Negociação" },
  { id: "closed", label: "Fechado" },
  { id: "lost", label: "Perdido" },
];

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { companies, leads, addLead, updateLeadStatus } = useCRM();

  const company = companies.find((c) => c.id === id);
  const companyLeads = useMemo(() => leads.filter((l) => l.companyId === id), [leads, id]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", origin: "", responsible: "", potentialValue: "", notes: "" });
  const [draggedLead, setDraggedLead] = useState<string | null>(null);

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Empresa não encontrada</p>
        <Button variant="outline" onClick={() => navigate("/empresas")}><ArrowLeft className="w-4 h-4 mr-1" /> Voltar</Button>
      </div>
    );
  }

  const closedLeads = companyLeads.filter((l) => l.status === "closed");
  const totalClosed = closedLeads.reduce((s, l) => s + l.potentialValue, 0);
  const totalInNegotiation = companyLeads.filter((l) => ["negotiation", "proposal_sent"].includes(l.status)).reduce((s, l) => s + l.potentialValue, 0);
  const conversionRate = companyLeads.length > 0 ? (closedLeads.length / companyLeads.length) * 100 : 0;
  const totalCommission = (totalClosed * company.commissionRate) / 100;

  const statusData = kanbanStages.map((s) => ({ name: s.label, value: companyLeads.filter((l) => l.status === s.id).length }));
  const originData = companyLeads.reduce<Record<string, number>>((acc, l) => { acc[l.origin] = (acc[l.origin] || 0) + 1; return acc; }, {});
  const originChartData = Object.entries(originData).map(([name, value]) => ({ name, value }));

  const handleSubmit = () => {
    if (!form.name || !id) return;
    addLead({
      id: `l${Date.now()}`, name: form.name, phone: form.phone, email: form.email, origin: form.origin, companyId: id, responsible: form.responsible,
      potentialValue: Number(form.potentialValue) || 0, status: "received", qualification: "pending", score: 50, entryDate: new Date().toISOString().split("T")[0], notes: form.notes, activities: [], contactAttempts: 0,
    });
    setForm({ name: "", phone: "", email: "", origin: "", responsible: "", potentialValue: "", notes: "" });
    setOpen(false);
  };

  const handleDrop = (status: LeadStatus) => { if (draggedLead) { updateLeadStatus(draggedLead, status); setDraggedLead(null); } };

  const kpiCards = [
    { label: "Total de Leads", value: companyLeads.length, icon: Users, accent: "text-accent" },
    { label: "Em Negociação", value: formatCurrency(totalInNegotiation), icon: TrendingUp, accent: "text-warning" },
    { label: "Valor Fechado", value: formatCurrency(totalClosed), icon: DollarSign, accent: "text-success" },
    { label: "Taxa de Conversão", value: `${conversionRate.toFixed(1)}%`, icon: Target, accent: "text-accent" },
    { label: "Comissão (%)", value: `${company.commissionRate}%`, icon: Percent, accent: "text-muted-foreground" },
    { label: "Comissão Total", value: formatCurrency(totalCommission), icon: DollarSign, accent: "text-success" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/empresas")}><ArrowLeft className="w-5 h-5" /></Button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Building2 className="w-5 h-5 text-primary" /></div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{company.name}</h1>
            <p className="text-sm text-muted-foreground">{company.segment && `${company.segment} · `}CNPJ: {company.cnpj}{company.responsible && ` · Responsável: ${company.responsible}`}</p>
          </div>
          <Badge variant={company.status === "active" ? "default" : "secondary"} className="ml-2">{company.status === "active" ? "Ativa" : "Inativa"}</Badge>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" />Novo Lead</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo Lead — {company.name}</DialogTitle></DialogHeader>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              <div><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Origem</Label><Input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder="Google Ads, Indicação..." /></div>
              <div><Label>Responsável</Label><Input value={form.responsible} onChange={(e) => setForm({ ...form, responsible: e.target.value })} /></div>
              <div><Label>Valor Potencial (R$)</Label><Input type="number" value={form.potentialValue} onChange={(e) => setForm({ ...form, potentialValue: e.target.value })} /></div>
              <div><Label>Observações</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <Button className="w-full" onClick={handleSubmit}>Cadastrar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label}><CardContent className="p-4"><kpi.icon className={`w-5 h-5 mb-2 ${kpi.accent}`} /><p className="text-lg font-bold text-foreground">{kpi.value}</p><p className="text-[11px] text-muted-foreground">{kpi.label}</p></CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList><TabsTrigger value="leads">Leads</TabsTrigger><TabsTrigger value="kanban">Kanban</TabsTrigger><TabsTrigger value="relatorios">Relatórios</TabsTrigger></TabsList>

        <TabsContent value="leads">
          <div className="rounded-lg border bg-card overflow-hidden">
            <Table>
              <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Origem</TableHead><TableHead>Responsável</TableHead><TableHead>Valor</TableHead><TableHead>Score</TableHead><TableHead>Status</TableHead><TableHead>Data</TableHead></TableRow></TableHeader>
              <TableBody>
                {companyLeads.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum lead cadastrado.</TableCell></TableRow>}
                {companyLeads.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell><p className="font-medium text-sm">{l.name}</p><p className="text-xs text-muted-foreground">{l.email}</p></TableCell>
                    <TableCell className="text-sm">{l.origin}</TableCell>
                    <TableCell className="text-sm">{l.responsible}</TableCell>
                    <TableCell className="text-sm font-medium">{formatCurrency(l.potentialValue)}</TableCell>
                    <TableCell><span className={`text-sm font-medium ${l.score >= 80 ? "text-success" : l.score >= 50 ? "text-warning" : "text-destructive"}`}>{l.score}</span></TableCell>
                    <TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusColors[l.status]}`}>{statusLabels[l.status]}</span></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{l.entryDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="kanban">
          <div className="flex gap-3 overflow-x-auto pb-4">
            {kanbanStages.map((stage) => {
              const stageLeads = companyLeads.filter((l) => l.status === stage.id);
              const stageValue = stageLeads.reduce((s, l) => s + l.potentialValue, 0);
              return (
                <div key={stage.id} className="flex-shrink-0 w-56 bg-muted/50 rounded-lg p-3" onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(stage.id)}>
                  <div className="flex items-center justify-between mb-3"><h3 className="text-xs font-semibold text-foreground">{stage.label}</h3><Badge variant="secondary" className="text-[10px]">{stageLeads.length}</Badge></div>
                  <p className="text-[10px] text-muted-foreground mb-3">{formatCurrency(stageValue)}</p>
                  <div className="space-y-2">
                    {stageLeads.map((lead) => (
                      <div key={lead.id} draggable onDragStart={() => setDraggedLead(lead.id)} className="bg-card border border-border rounded-md p-3 cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow">
                        <p className="text-sm font-medium text-foreground">{lead.name}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">{lead.responsible}</p>
                        <p className="text-xs font-semibold text-primary mt-1">{formatCurrency(lead.potentialValue)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="relatorios">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Funil de Vendas</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={280}><PieChart><Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>{statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
            </CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Origem dos Leads</CardTitle></CardHeader><CardContent>
              {originChartData.length === 0 ? <p className="text-sm text-muted-foreground text-center py-12">Sem dados</p> : (
                <ResponsiveContainer width="100%" height={280}><BarChart data={originChartData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} /><Tooltip /><Bar dataKey="value" name="Leads" fill="hsl(200, 80%, 45%)" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer>
              )}
            </CardContent></Card>
            <Card className="lg:col-span-2"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Comissões — Leads Fechados</CardTitle></CardHeader><CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table><TableHeader><TableRow><TableHead>Lead</TableHead><TableHead>Valor Fechado</TableHead><TableHead>Taxa</TableHead><TableHead>Comissão</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {closedLeads.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-6">Nenhum lead fechado.</TableCell></TableRow>}
                    {closedLeads.map((l) => (
                      <TableRow key={l.id}><TableCell className="font-medium text-sm">{l.name}</TableCell><TableCell className="text-sm">{formatCurrency(l.potentialValue)}</TableCell><TableCell className="text-sm">{company.commissionRate}%</TableCell><TableCell className="text-sm font-semibold text-success">{formatCurrency((l.potentialValue * company.commissionRate) / 100)}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
