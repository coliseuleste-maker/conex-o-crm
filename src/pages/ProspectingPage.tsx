import { useCRM } from "@/contexts/CRMContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Download, Globe, Building2, MapPin, Users as UsersIcon, DollarSign, ExternalLink } from "lucide-react";
import { useState, useMemo } from "react";
import { formatCurrency, formatNumber } from "@/lib/format";

export default function ProspectingPage() {
  const { prospects, companies, importProspect } = useCRM();
  const [search, setSearch] = useState("");
  const [segmento, setSegmento] = useState("all");
  const [estado, setEstado] = useState("all");
  const [porte, setPorte] = useState("all");
  const [importDialog, setImportDialog] = useState<string | null>(null);
  const [targetCompany, setTargetCompany] = useState("");

  const segments = [...new Set(prospects.map((p) => p.segmento))];
  const estados = [...new Set(prospects.map((p) => p.estado))];
  const portes = [...new Set(prospects.map((p) => p.porte))];

  const filtered = useMemo(() => {
    return prospects.filter((p) => {
      if (segmento !== "all" && p.segmento !== segmento) return false;
      if (estado !== "all" && p.estado !== estado) return false;
      if (porte !== "all" && p.porte !== porte) return false;
      if (search) {
        const s = search.toLowerCase();
        return p.nomeFantasia.toLowerCase().includes(s) || p.razaoSocial.toLowerCase().includes(s) || p.cnpj.includes(s);
      }
      return true;
    });
  }, [prospects, search, segmento, estado, porte]);

  const handleImport = () => {
    if (importDialog && targetCompany) {
      importProspect(importDialog, targetCompany);
      setImportDialog(null);
      setTargetCompany("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Prospecção Inteligente</h1>
        <p className="text-sm text-muted-foreground">Busca e importação de empresas para prospecção</p>
      </div>

      {/* Link Casa dos Dados */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Integração com Casa dos Dados</p>
            <p className="text-[11px] text-muted-foreground">Busque empresas por CNAE, cidade, porte e faturamento estimado para alimentar sua base de prospecção.</p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0" onClick={() => window.open("https://casadosdados.com.br/solucao/cnpj/pesquisa-avancada", "_blank")}>
            <ExternalLink className="w-4 h-4 mr-1" />Acessar
          </Button>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar empresa..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={segmento} onValueChange={setSegmento}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Segmento" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos segmentos</SelectItem>
            {segments.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={estado} onValueChange={setEstado}>
          <SelectTrigger className="w-32"><SelectValue placeholder="Estado" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos estados</SelectItem>
            {estados.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={porte} onValueChange={setPorte}>
          <SelectTrigger className="w-32"><SelectValue placeholder="Porte" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos portes</SelectItem>
            {portes.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} empresas encontradas</p>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <Card key={p.id} className={p.imported ? "opacity-60" : ""}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm text-foreground">{p.nomeFantasia}</p>
                  <p className="text-[11px] text-muted-foreground">{p.razaoSocial}</p>
                </div>
                {p.imported && <Badge variant="secondary" className="text-[10px]">Importado</Badge>}
              </div>
              <div className="space-y-1 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1"><Building2 className="w-3 h-3" />{p.cnpj}</div>
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.cidade}/{p.estado}</div>
                <div className="flex items-center gap-1"><UsersIcon className="w-3 h-3" />{p.funcionarios || "N/I"} func. · {p.porte}</div>
                {p.faturamentoEstimado && <div className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{formatCurrency(p.faturamentoEstimado)}</div>}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">{p.segmento}</Badge>
              </div>
              <div className="flex gap-2 text-[11px]">
                <span className="text-muted-foreground">{p.telefone}</span>
                <span className="text-muted-foreground">{p.email}</span>
              </div>
              {!p.imported && (
                <Dialog open={importDialog === p.id} onOpenChange={(o) => setImportDialog(o ? p.id : null)}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="w-full"><Download className="w-3 h-3 mr-1" />Importar para Leads</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Importar: {p.nomeFantasia}</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Selecione a empresa parceira para vincular este lead:</p>
                      <div>
                        <Label>Empresa parceira</Label>
                        <Select value={targetCompany} onValueChange={setTargetCompany}>
                          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            {companies.filter((c) => c.status === "active").map((c) => (
                              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full" onClick={handleImport} disabled={!targetCompany}>Confirmar Importação</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
