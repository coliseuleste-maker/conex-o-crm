import { useCRM } from "@/contexts/CRMContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Download, Globe, Building2, MapPin, Users as UsersIcon, DollarSign, ExternalLink, Star, StarOff, History, ListPlus, Phone, Mail, Link2, CheckSquare } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";

export default function ProspectingPage() {
  const { prospects, companies, importProspect } = useCRM();
  const [search, setSearch] = useState("");
  const [segmento, setSegmento] = useState("all");
  const [estado, setEstado] = useState("all");
  const [porte, setPorte] = useState("all");
  const [faturamentoMin, setFaturamentoMin] = useState("");
  const [funcionariosMin, setFuncionariosMin] = useState("");
  const [importDialog, setImportDialog] = useState<string | null>(null);
  const [targetCompany, setTargetCompany] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchHistory, setSearchHistory] = useState<{ query: string; filters: string; count: number; date: string }[]>([]);
  const [prospectLists, setProspectLists] = useState<{ id: string; name: string; ids: string[] }[]>([]);
  const [newListName, setNewListName] = useState("");
  const [bulkImportDialog, setBulkImportDialog] = useState(false);
  const [bulkTargetCompany, setBulkTargetCompany] = useState("");

  const segments = [...new Set(prospects.map((p) => p.segmento))];
  const estados = [...new Set(prospects.map((p) => p.estado))];
  const portes = [...new Set(prospects.map((p) => p.porte))];

  const filtered = useMemo(() => {
    return prospects.filter((p) => {
      if (segmento !== "all" && p.segmento !== segmento) return false;
      if (estado !== "all" && p.estado !== estado) return false;
      if (porte !== "all" && p.porte !== porte) return false;
      if (faturamentoMin && p.faturamentoEstimado && p.faturamentoEstimado < Number(faturamentoMin)) return false;
      if (funcionariosMin && p.funcionarios && p.funcionarios < Number(funcionariosMin)) return false;
      if (search) {
        const s = search.toLowerCase();
        return p.nomeFantasia.toLowerCase().includes(s) || p.razaoSocial.toLowerCase().includes(s) || p.cnpj.includes(s) || p.segmento.toLowerCase().includes(s);
      }
      return true;
    });
  }, [prospects, search, segmento, estado, porte, faturamentoMin, funcionariosMin]);

  const handleSearch = useCallback(() => {
    const filters = [segmento !== "all" ? segmento : "", estado !== "all" ? estado : "", porte !== "all" ? porte : ""].filter(Boolean).join(", ");
    setSearchHistory((prev) => [{ query: search || "Todos", filters: filters || "Sem filtros", count: filtered.length, date: new Date().toLocaleString("pt-BR") }, ...prev.slice(0, 9)]);
    toast.success(`${filtered.length} empresas encontradas`);
  }, [search, segmento, estado, porte, filtered.length]);

  const handleImport = () => {
    if (importDialog && targetCompany) {
      importProspect(importDialog, targetCompany);
      setImportDialog(null);
      setTargetCompany("");
      toast.success("Lead importado com sucesso!");
    }
  };

  const handleBulkImport = () => {
    if (selectedIds.size > 0 && bulkTargetCompany) {
      selectedIds.forEach((id) => importProspect(id, bulkTargetCompany));
      setSelectedIds(new Set());
      setBulkImportDialog(false);
      setBulkTargetCompany("");
      toast.success(`${selectedIds.size} leads importados!`);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const selectAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((p) => p.id)));
  };

  const addToList = () => {
    if (newListName && selectedIds.size > 0) {
      setProspectLists((prev) => [...prev, { id: `pl${Date.now()}`, name: newListName, ids: Array.from(selectedIds) }]);
      setNewListName("");
      setSelectedIds(new Set());
      toast.success("Lista de prospecção criada!");
    }
  };

  const favoritedProspects = prospects.filter((p) => favorites.has(p.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Prospecção Inteligente</h1>
        <p className="text-sm text-muted-foreground">Busca nativa, importação em massa e listas de prospecção</p>
      </div>

      <Tabs defaultValue="search" className="space-y-4">
        <TabsList>
          <TabsTrigger value="search"><Search className="w-4 h-4 mr-1" />Busca Avançada</TabsTrigger>
          <TabsTrigger value="lists"><ListPlus className="w-4 h-4 mr-1" />Listas ({prospectLists.length})</TabsTrigger>
          <TabsTrigger value="history"><History className="w-4 h-4 mr-1" />Histórico</TabsTrigger>
          <TabsTrigger value="favorites"><Star className="w-4 h-4 mr-1" />Favoritos ({favorites.size})</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          {/* Casa dos Dados integration banner */}
          <Card className="border-accent/20 bg-accent/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Busca integrada com Casa dos Dados</p>
                <p className="text-[11px] text-muted-foreground">Filtre por CNAE, cidade, porte, faturamento e funcionários diretamente no CRM.</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0" onClick={() => window.open("https://casadosdados.com.br/solucao/cnpj/pesquisa-avancada", "_blank")}>
                <ExternalLink className="w-4 h-4 mr-1" />Fonte Externa
              </Button>
            </CardContent>
          </Card>

          {/* Search & Filters */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Buscar por nome, CNPJ, segmento..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button onClick={handleSearch}><Search className="w-4 h-4 mr-1" />Buscar</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Select value={segmento} onValueChange={setSegmento}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Segmento (CNAE)" /></SelectTrigger>
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
                <Input className="w-40" type="number" placeholder="Faturamento mín." value={faturamentoMin} onChange={(e) => setFaturamentoMin(e.target.value)} />
                <Input className="w-40" type="number" placeholder="Funcionários mín." value={funcionariosMin} onChange={(e) => setFuncionariosMin(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          {/* Bulk actions */}
          {selectedIds.size > 0 && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-3 flex items-center gap-3">
                <Badge variant="default">{selectedIds.size} selecionados</Badge>
                <Dialog open={bulkImportDialog} onOpenChange={setBulkImportDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Download className="w-3 h-3 mr-1" />Importar como Leads</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Importar {selectedIds.size} prospects como leads</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <Label>Empresa parceira</Label>
                      <Select value={bulkTargetCompany} onValueChange={setBulkTargetCompany}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {companies.filter((c) => c.status === "active").map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button className="w-full" onClick={handleBulkImport} disabled={!bulkTargetCompany}>Confirmar Importação em Massa</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="flex gap-2 items-center ml-auto">
                  <Input className="w-48" placeholder="Nome da lista..." value={newListName} onChange={(e) => setNewListName(e.target.value)} />
                  <Button size="sm" variant="outline" onClick={addToList} disabled={!newListName}><ListPlus className="w-3 h-3 mr-1" />Criar Lista</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{filtered.length} empresas encontradas</p>
            <Button size="sm" variant="ghost" onClick={selectAll}>
              <CheckSquare className="w-4 h-4 mr-1" />{selectedIds.size === filtered.length ? "Desmarcar todos" : "Selecionar todos"}
            </Button>
          </div>

          {/* Results grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <Card key={p.id} className={`${p.imported ? "opacity-60" : ""} ${selectedIds.has(p.id) ? "ring-2 ring-primary" : ""}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <Checkbox checked={selectedIds.has(p.id)} onCheckedChange={() => toggleSelect(p.id)} className="mt-1" />
                      <div>
                        <p className="font-medium text-sm text-foreground">{p.nomeFantasia}</p>
                        <p className="text-[11px] text-muted-foreground">{p.razaoSocial}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => toggleFavorite(p.id)}>
                        {favorites.has(p.id) ? <Star className="w-3.5 h-3.5 text-warning fill-warning" /> : <StarOff className="w-3.5 h-3.5 text-muted-foreground" />}
                      </Button>
                      {p.imported && <Badge variant="secondary" className="text-[10px]">Importado</Badge>}
                    </div>
                  </div>
                  <div className="space-y-1 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1"><Building2 className="w-3 h-3" />{p.cnpj}</div>
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.cidade}/{p.estado}</div>
                    <div className="flex items-center gap-1"><UsersIcon className="w-3 h-3" />{p.funcionarios || "N/I"} func. · {p.porte}</div>
                    {p.faturamentoEstimado && <div className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{formatCurrency(p.faturamentoEstimado)}</div>}
                  </div>
                  {/* Enrichment preview */}
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-[10px]">{p.segmento}</Badge>
                    <div className="flex gap-1 ml-auto">
                      {p.telefone && <Phone className="w-3 h-3 text-success" />}
                      {p.email && <Mail className="w-3 h-3 text-accent" />}
                      <Link2 className="w-3 h-3 text-muted-foreground/40" />
                    </div>
                  </div>
                  <div className="flex gap-2 text-[11px]">
                    <span className="text-muted-foreground">{p.telefone}</span>
                    <span className="text-muted-foreground">{p.email}</span>
                  </div>
                  {!p.imported && (
                    <Dialog open={importDialog === p.id} onOpenChange={(o) => setImportDialog(o ? p.id : null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="w-full"><Download className="w-3 h-3 mr-1" />Importar como Lead</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Importar: {p.nomeFantasia}</DialogTitle></DialogHeader>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">Selecione a empresa parceira:</p>
                          <Label>Empresa parceira</Label>
                          <Select value={targetCompany} onValueChange={setTargetCompany}>
                            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                            <SelectContent>
                              {companies.filter((c) => c.status === "active").map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <p className="text-[11px] text-muted-foreground">O sistema tentará enriquecer automaticamente: telefone, email, site e redes sociais.</p>
                          <Button className="w-full" onClick={handleImport} disabled={!targetCompany}>Confirmar Importação</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lists" className="space-y-4">
          {prospectLists.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">
              <ListPlus className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="font-medium">Nenhuma lista criada</p>
              <p className="text-sm">Selecione prospects na busca e crie uma lista de prospecção.</p>
            </CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prospectLists.map((list) => (
                <Card key={list.id}>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">{list.name}</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{list.ids.length} prospects</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {list.ids.slice(0, 5).map((id) => {
                        const p = prospects.find((pr) => pr.id === id);
                        return p ? <Badge key={id} variant="outline" className="text-[10px]">{p.nomeFantasia}</Badge> : null;
                      })}
                      {list.ids.length > 5 && <Badge variant="secondary" className="text-[10px]">+{list.ids.length - 5}</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {searchHistory.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">
              <History className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="font-medium">Sem histórico</p>
              <p className="text-sm">Realize buscas para armazenar o histórico aqui.</p>
            </CardContent></Card>
          ) : (
            <div className="space-y-2">
              {searchHistory.map((h, i) => (
                <Card key={i}>
                  <CardContent className="p-3 flex items-center gap-4">
                    <History className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">"{h.query}"</p>
                      <p className="text-[11px] text-muted-foreground">{h.filters} · {h.count} resultados</p>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{h.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          {favoritedProspects.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">
              <Star className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="font-medium">Sem favoritos</p>
              <p className="text-sm">Marque prospects como favoritos na busca.</p>
            </CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoritedProspects.map((p) => (
                <Card key={p.id}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm text-foreground">{p.nomeFantasia}</p>
                        <p className="text-[11px] text-muted-foreground">{p.razaoSocial}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => toggleFavorite(p.id)}>
                        <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                      </Button>
                    </div>
                    <div className="text-[11px] text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1"><Building2 className="w-3 h-3" />{p.cnpj}</div>
                      <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.cidade}/{p.estado}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{p.segmento}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
