import { useCRM } from "@/contexts/CRMContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { formatCurrency, statusLabels, qualificationLabels } from "@/lib/format";
import { Lead, LeadStatus } from "@/types/crm";

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

export default function LeadsPage() {
  const { leads, companies, selectedCompanyId, addLead } = useCRM();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", origin: "", companyId: "", responsible: "", potentialValue: "", notes: "",
  });

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (selectedCompanyId && l.companyId !== selectedCompanyId) return false;
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return l.name.toLowerCase().includes(s) || l.email.toLowerCase().includes(s) || l.phone.includes(s);
      }
      return true;
    });
  }, [leads, selectedCompanyId, statusFilter, search]);

  const handleSubmit = () => {
    if (!form.name || !form.companyId) return;
    addLead({
      id: `l${Date.now()}`,
      name: form.name,
      phone: form.phone,
      email: form.email,
      origin: form.origin,
      companyId: form.companyId,
      responsible: form.responsible,
      potentialValue: Number(form.potentialValue) || 0,
      status: "received",
      qualification: "pending",
      score: 50,
      entryDate: new Date().toISOString().split("T")[0],
      notes: form.notes,
      activities: [],
      contactAttempts: 0,
    });
    setForm({ name: "", phone: "", email: "", origin: "", companyId: "", responsible: "", potentialValue: "", notes: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground">{filteredLeads.length} leads encontrados</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-1" />Novo Lead</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Cadastrar Lead</DialogTitle></DialogHeader>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              <div><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Origem</Label><Input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder="Google Ads, Indicação..." /></div>
              <div>
                <Label>Empresa</Label>
                <Select value={form.companyId} onValueChange={(v) => setForm({ ...form, companyId: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {companies.filter((c) => c.status === "active").map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Responsável</Label><Input value={form.responsible} onChange={(e) => setForm({ ...form, responsible: e.target.value })} /></div>
              <div><Label>Valor Potencial (R$)</Label><Input type="number" value={form.potentialValue} onChange={(e) => setForm({ ...form, potentialValue: e.target.value })} /></div>
              <div><Label>Observações</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <Button className="w-full" onClick={handleSubmit}>Cadastrar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar por nome, email ou telefone..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {Object.entries(statusLabels).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((l) => {
              const company = companies.find((c) => c.id === l.companyId);
              return (
                <TableRow key={l.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{l.name}</p>
                      <p className="text-xs text-muted-foreground">{l.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{company?.name || "-"}</TableCell>
                  <TableCell className="text-sm">{l.origin}</TableCell>
                  <TableCell className="text-sm">{l.responsible}</TableCell>
                  <TableCell className="text-sm font-medium">{formatCurrency(l.potentialValue)}</TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium ${l.score >= 80 ? "text-success" : l.score >= 50 ? "text-warning" : "text-destructive"}`}>
                      {l.score}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusColors[l.status]}`}>
                      {statusLabels[l.status]}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.entryDate}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
