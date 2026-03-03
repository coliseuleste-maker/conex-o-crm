import { useCRM } from "@/contexts/CRMContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Plus, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Company } from "@/types/crm";

export default function CompaniesPage() {
  const { companies, addCompany, leads } = useCRM();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ name: string; cnpj: string; responsible: string; commissionRate: string; segment: string; status: "active" | "inactive" }>({ name: "", cnpj: "", responsible: "", commissionRate: "", segment: "", status: "active" });

  const handleSubmit = () => {
    if (!form.name) return;
    addCompany({
      id: `c${Date.now()}`,
      name: form.name,
      cnpj: form.cnpj,
      responsible: form.responsible,
      commissionRate: Number(form.commissionRate) || 0,
      segment: form.segment,
      status: form.status,
    });
    setForm({ name: "", cnpj: "", responsible: "", commissionRate: "", segment: "", status: "active" });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Empresas Parceiras</h1>
          <p className="text-sm text-muted-foreground">{companies.length} empresas cadastradas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-1" />Nova Empresa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Empresa</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>CNPJ</Label><Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} /></div>
              <div><Label>Responsável</Label><Input value={form.responsible} onChange={(e) => setForm({ ...form, responsible: e.target.value })} /></div>
              <div><Label>Comissão (%)</Label><Input type="number" value={form.commissionRate} onChange={(e) => setForm({ ...form, commissionRate: e.target.value })} /></div>
              <div><Label>Segmento</Label><Input value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })} /></div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v: "active" | "inactive") => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="inactive">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleSubmit}>Cadastrar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((c) => {
          const cLeads = leads.filter((l) => l.companyId === c.id);
          const closed = cLeads.filter((l) => l.status === "closed");
          const closedValue = closed.reduce((s, l) => s + l.potentialValue, 0);
          const commission = (closedValue * c.commissionRate) / 100;

          return (
            <Card key={c.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate(`/empresas/${c.id}`)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">{c.name}</h3>
                      <p className="text-[11px] text-muted-foreground">{c.segment}</p>
                    </div>
                  </div>
                  <Badge variant={c.status === "active" ? "default" : "secondary"} className="text-[10px]">
                    {c.status === "active" ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p>CNPJ: {c.cnpj}</p>
                  <p>Responsável: {c.responsible}</p>
                  <p>Comissão: {c.commissionRate}%</p>
                </div>
                <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-foreground">{cLeads.length}</p>
                    <p className="text-[10px] text-muted-foreground">Leads</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-success">{closed.length}</p>
                    <p className="text-[10px] text-muted-foreground">Fechados</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-accent">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(commission)}</p>
                    <p className="text-[10px] text-muted-foreground">Comissão</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex items-center justify-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <span>Ver painel completo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
