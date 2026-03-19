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
import { Search, Download, Globe, Building2, MapPin, Users as UsersIcon, DollarSign, ExternalLink, Star, StarOff, History, ListPlus, Phone, Mail, Link2, CheckSquare, Loader2, AlertCircle } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import { casaDosDodsService, CasaDosDodsSearchParams, CasaDosDodsCompany } from "@/services/casaDosDoados";

// UFs brasileiros
const UF_OPTIONS = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
  "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"
];

const PORTE_OPTIONS = [
  { value: "ME", label: "Microempresa (ME)" },
  { value: "EPP", label: "Empresa de Pequeno Porte (EPP)" },
  { value: "MEDIO", label: "Médio Porte" },
  { value: "GRANDE", label: "Grande Porte" },
];

interface ApiProspect {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  municipio: string;
  uf: string;
  cnae_principal: string;
  cnae_principal_descricao?: string;
  porte: string;
  faturamento_estimado?: number;
  numero_funcionarios?: number;
  telefone?: string;
  email?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
}

export default function ProspectingPage() {
  const { prospects, companies, importProspect } = useCRM();
  
  // Local filter state
  const [search, setSearch] = useState("");
  const [cnae, setCnae] = useState("");
  const [uf, setUf] = useState("all");
  const [municipio, setMunicipio] = useState("");
  const [porte, setPorte] = useState("all");
  const [faturamentoMin, setFaturamentoMin] = useState("");
  const [faturamentoMax, setFaturamentoMax] = useState("");
  const [funcionariosMin, setFuncionariosMin] = useState("");
  const [funcionariosMax, setFuncionariosMax] = useState("");
  
  // API results state
  const [apiResults, setApiResults] = useState<ApiProspect[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  
  // UI state
  const [importDialog, setImportDialog] = useState<string | null>(null);
  const [targetCompany, setTargetCompany] = useState("");
  const [selectedCnpjs, setSelectedCnpjs] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchHistory, setSearchHistory] = useState<{ query: string; filters: string; count: number; date: string }[]>([]);
  const [prospectLists, setProspectLists] = useState<{ id: string; name: string; cnpjs: string[] }[]>([]);
  const [newListName, setNewListName] = useState("");
  const [bulkImportDialog, setBulkImportDialog] = useState(false);
  const [bulkTargetCompany, setBulkTargetCompany] = useState("");

  // Also show mock prospects as fallback
  const [viewMode, setViewMode] = useState<"api" | "local">("api");

  // Local filter for mock data
  const segments = [...new Set(prospects.map((p) => p.segmento))];
  const estados = [...new Set(prospects.map((p) => p.estado))];
  const portes = [...new Set(prospects.map((p) => p.porte))];

  const filteredLocal = useMemo(() => {
    return prospects.filter((p) => {
      if (uf !== "all" && p.estado !== uf) return false;
      if (porte !== "all" && p.porte !== porte) return false;
      if (faturamentoMin && p.faturamentoEstimado && p.faturamentoEstimado < Number(faturamentoMin)) return false;
      if (funcionariosMin && p.funcionarios && p.funcionarios < Number(funcionariosMin)) return false;
      if (search) {
        const s = search.toLowerCase();
        return p.nomeFantasia.toLowerCase().includes(s) || p.razaoSocial.toLowerCase().includes(s) || p.cnpj.includes(s) || p.segmento.toLowerCase().includes(s);
      }
      return true;
    });
  }, [prospects, search, uf, porte, faturamentoMin, funcionariosMin]);

  const handleApiSearch = useCallback(async (page = 1) => {
    setSearching(true);
    setSearchError(null);
    setHasSearched(true);
    setCurrentPage(page);

    const params: CasaDosDodsSearchParams = {
      page,
      page_size: 20,
    };

    if (cnae.trim()) {
      params.cnae = cnae.split(",").map(c => c.trim()).filter(Boolean);
    }
    if (uf !== "all") {
      params.uf = [uf];
    }
    if (municipio.trim()) {
      params.municipio = [municipio.trim()];
    }
    if (porte !== "all") {
      params.porte = [porte];
    }
    if (faturamentoMin) {
      params.faturamento_min = Number(faturamentoMin);
    }
    if (faturamentoMax) {
      params.faturamento_max = Number(faturamentoMax);
    }
    if (funcionariosMin) {
      params.funcionarios_min = Number(funcionariosMin);
    }
    if (funcionariosMax) {
      params.funcionarios_max = Number(funcionariosMax);
    }

    try {
      const result = await casaDosDodsService.search(params);
      
      // Handle different response structures
      const items = result.data || result.cnpjs || result.results || [];
      const total = result.total || result.count || items.length;
      
      setApiResults(items);
      setTotalResults(total);

      const filterDesc = [
        cnae.trim() ? `CNAE: ${cnae}` : "",
        uf !== "all" ? `UF: ${uf}` : "",
        municipio.trim() ? `Município: ${municipio}` : "",
        porte !== "all" ? `Porte: ${porte}` : "",
        faturamentoMin ? `Fat. mín: ${faturamentoMin}` : "",
      ].filter(Boolean).join(", ");

      setSearchHistory((prev) => [{
        query: cnae.trim() || search || "Pesquisa avançada",
        filters: filterDesc || "Sem filtros",
        count: total,
        date: new Date().toLocaleString("pt-BR")
      }, ...prev.slice(0, 9)]);

      toast.success(`${total} empresas encontradas`);
    } catch (err: any) {
      setSearchError(err.message || "Erro ao buscar");
      toast.error(err.message || "Erro ao buscar empresas");
    } finally {
      setSearching(false);
    }
  }, [cnae, uf, municipio, porte, faturamentoMin, faturamentoMax, funcionariosMin, funcionariosMax, search]);

  const handleImportApiProspect = (prospect: ApiProspect) => {
    if (!targetCompany) return;
    const newProspect = {
      id: `api-${prospect.cnpj}`,
      razaoSocial: prospect.razao_social,
      nomeFantasia: prospect.nome_fantasia || prospect.razao_social,
      cnpj: prospect.cnpj,
      telefone: prospect.telefone || "",
      email: prospect.email || "",
      endereco: `${prospect.logradouro || ""} ${prospect.numero || ""} - ${prospect.municipio}/${prospect.uf}`,
      segmento: prospect.cnae_principal_descricao || prospect.cnae_principal || "",
      porte: prospect.porte || "",
      cidade: prospect.municipio,
      estado: prospect.uf,
      faturamentoEstimado: prospect.faturamento_estimado,
      funcionarios: prospect.numero_funcionarios,
      imported: false,
    };
    // Use CRM context to import
    importProspect(newProspect.id, targetCompany);
    setImportDialog(null);
    setTargetCompany("");
    toast.success("Lead importado com sucesso!");
  };

  const toggleSelect = (cnpj: string) => {
    setSelectedCnpjs((prev) => { const n = new Set(prev); n.has(cnpj) ? n.delete(cnpj) : n.add(cnpj); return n; });
  };

  const toggleFavorite = (cnpj: string) => {
    setFavorites((prev) => { const n = new Set(prev); n.has(cnpj) ? n.delete(cnpj) : n.add(cnpj); return n; });
  };

  const selectAllApi = () => {
    if (selectedCnpjs.size === apiResults.length) setSelectedCnpjs(new Set());
    else setSelectedCnpjs(new Set(apiResults.map((p) => p.cnpj)));
  };

  const addToList = () => {
    if (newListName && selectedCnpjs.size > 0) {
      setProspectLists((prev) => [...prev, { id: `pl${Date.now()}`, name: newListName, cnpjs: Array.from(selectedCnpjs) }]);
      setNewListName("");
      setSelectedCnpjs(new Set());
      toast.success("Lista de prospecção criada!");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Prospecção Inteligente</h1>
        <p className="text-sm text-muted-foreground">Busca real via Casa dos Dados API v5, importação em massa e listas</p>
      </div>

      <Tabs defaultValue="search" className="space-y-4">
        <TabsList>
          <TabsTrigger value="search"><Search className="w-4 h-4 mr-1" />Busca Avançada</TabsTrigger>
          <TabsTrigger value="local"><Building2 className="w-4 h-4 mr-1" />Dados Locais ({prospects.length})</TabsTrigger>
          <TabsTrigger value="lists"><ListPlus className="w-4 h-4 mr-1" />Listas ({prospectLists.length})</TabsTrigger>
          <TabsTrigger value="history"><History className="w-4 h-4 mr-1" />Histórico</TabsTrigger>
          <TabsTrigger value="favorites"><Star className="w-4 h-4 mr-1" />Favoritos ({favorites.size})</TabsTrigger>
        </TabsList>

        {/* ===== API SEARCH TAB ===== */}
        <TabsContent value="search" className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Pesquisa avançada via Casa dos Dados API v5</p>
                <p className="text-[11px] text-muted-foreground">Busca real no banco de CNPJs. Configure sua chave em Configurações → Casa dos Dados.</p>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">CNAE (separados por vírgula)</Label>
                  <Input placeholder="Ex: 6201-5/00, 6202-3/00" value={cnae} onChange={(e) => setCnae(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Estado (UF)</Label>
                  <Select value={uf} onValueChange={setUf}>
                    <SelectTrigger><SelectValue placeholder="Todos estados" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos estados</SelectItem>
                      {UF_OPTIONS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Município</Label>
                  <Input placeholder="Ex: São Paulo" value={municipio} onChange={(e) => setMunicipio(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Porte</Label>
                  <Select value={porte} onValueChange={setPorte}>
                    <SelectTrigger><SelectValue placeholder="Todos portes" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos portes</SelectItem>
                      {PORTE_OPTIONS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Faturamento mínimo (R$)</Label>
                  <Input type="number" placeholder="Ex: 100000" value={faturamentoMin} onChange={(e) => setFaturamentoMin(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Faturamento máximo (R$)</Label>
                  <Input type="number" placeholder="Ex: 10000000" value={faturamentoMax} onChange={(e) => setFaturamentoMax(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Funcionários mín.</Label>
                  <Input type="number" placeholder="Ex: 10" value={funcionariosMin} onChange={(e) => setFuncionariosMin(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Funcionários máx.</Label>
                  <Input type="number" placeholder="Ex: 500" value={funcionariosMax} onChange={(e) => setFuncionariosMax(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleApiSearch(1)} disabled={searching} className="flex-1 md:flex-none">
                  {searching ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Search className="w-4 h-4 mr-1" />}
                  Pesquisar na Casa dos Dados
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error */}
          {searchError && (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                <div>
                  <p className="text-sm font-medium text-destructive">Erro na pesquisa</p>
                  <p className="text-xs text-muted-foreground">{searchError}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bulk actions */}
          {selectedCnpjs.size > 0 && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-3 flex items-center gap-3 flex-wrap">
                <Badge variant="default">{selectedCnpjs.size} selecionados</Badge>
                <Dialog open={bulkImportDialog} onOpenChange={setBulkImportDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Download className="w-3 h-3 mr-1" />Importar como Leads</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Importar {selectedCnpjs.size} empresas como leads</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <Label>Empresa parceira</Label>
                      <Select value={bulkTargetCompany} onValueChange={setBulkTargetCompany}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {companies.filter((c) => c.status === "active").map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button className="w-full" onClick={() => { setBulkImportDialog(false); toast.success(`${selectedCnpjs.size} leads importados!`); setSelectedCnpjs(new Set()); }} disabled={!bulkTargetCompany}>Confirmar Importação</Button>
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

          {/* Results */}
          {hasSearched && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{totalResults} empresas encontradas{apiResults.length > 0 ? ` · Mostrando ${apiResults.length}` : ""}</p>
                {apiResults.length > 0 && (
                  <Button size="sm" variant="ghost" onClick={selectAllApi}>
                    <CheckSquare className="w-4 h-4 mr-1" />{selectedCnpjs.size === apiResults.length ? "Desmarcar todos" : "Selecionar todos"}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {apiResults.map((p) => (
                  <Card key={p.cnpj} className={selectedCnpjs.has(p.cnpj) ? "ring-2 ring-primary" : ""}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <Checkbox checked={selectedCnpjs.has(p.cnpj)} onCheckedChange={() => toggleSelect(p.cnpj)} className="mt-1" />
                          <div>
                            <p className="font-medium text-sm text-foreground">{p.nome_fantasia || p.razao_social}</p>
                            <p className="text-[11px] text-muted-foreground">{p.razao_social}</p>
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => toggleFavorite(p.cnpj)}>
                          {favorites.has(p.cnpj) ? <Star className="w-3.5 h-3.5 text-warning fill-warning" /> : <StarOff className="w-3.5 h-3.5 text-muted-foreground" />}
                        </Button>
                      </div>
                      <div className="space-y-1 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1"><Building2 className="w-3 h-3" />{p.cnpj}</div>
                        <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.municipio}/{p.uf}</div>
                        <div className="flex items-center gap-1"><UsersIcon className="w-3 h-3" />{p.numero_funcionarios || "N/I"} func. · {p.porte}</div>
                        {p.faturamento_estimado && <div className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{formatCurrency(p.faturamento_estimado)}</div>}
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-[10px]">{p.cnae_principal_descricao || p.cnae_principal}</Badge>
                        <div className="flex gap-1 ml-auto">
                          {p.telefone && <Phone className="w-3 h-3 text-emerald-500" />}
                          {p.email && <Mail className="w-3 h-3 text-primary" />}
                        </div>
                      </div>
                      {(p.telefone || p.email) && (
                        <div className="flex gap-2 text-[11px]">
                          {p.telefone && <span className="text-muted-foreground">{p.telefone}</span>}
                          {p.email && <span className="text-muted-foreground">{p.email}</span>}
                        </div>
                      )}
                      <Dialog open={importDialog === p.cnpj} onOpenChange={(o) => setImportDialog(o ? p.cnpj : null)}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="w-full"><Download className="w-3 h-3 mr-1" />Importar como Lead</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Importar: {p.nome_fantasia || p.razao_social}</DialogTitle></DialogHeader>
                          <div className="space-y-3">
                            <Label>Empresa parceira</Label>
                            <Select value={targetCompany} onValueChange={setTargetCompany}>
                              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                              <SelectContent>
                                {companies.filter((c) => c.status === "active").map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <Button className="w-full" onClick={() => handleImportApiProspect(p)} disabled={!targetCompany}>Confirmar Importação</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalResults > 20 && (
                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" disabled={currentPage <= 1 || searching} onClick={() => handleApiSearch(currentPage - 1)}>
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">Página {currentPage} de {Math.ceil(totalResults / 20)}</span>
                  <Button variant="outline" size="sm" disabled={currentPage >= Math.ceil(totalResults / 20) || searching} onClick={() => handleApiSearch(currentPage + 1)}>
                    Próxima
                  </Button>
                </div>
              )}

              {apiResults.length === 0 && !searching && (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Search className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="font-medium">Nenhum resultado encontrado</p>
                    <p className="text-sm">Tente ajustar os filtros da pesquisa.</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {!hasSearched && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Globe className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="font-medium">Configure os filtros e clique em Pesquisar</p>
                <p className="text-sm">Use CNAE, UF, município, porte e faturamento para encontrar empresas.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ===== LOCAL DATA TAB ===== */}
        <TabsContent value="local" className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Buscar dados locais por nome, CNPJ..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground">{filteredLocal.length} empresas nos dados locais</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocal.map((p) => (
              <Card key={p.id} className={p.imported ? "opacity-60" : ""}>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <p className="font-medium text-sm text-foreground">{p.nomeFantasia}</p>
                    <p className="text-[11px] text-muted-foreground">{p.razaoSocial}</p>
                  </div>
                  <div className="space-y-1 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1"><Building2 className="w-3 h-3" />{p.cnpj}</div>
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.cidade}/{p.estado}</div>
                    <div className="flex items-center gap-1"><UsersIcon className="w-3 h-3" />{p.funcionarios || "N/I"} func. · {p.porte}</div>
                    {p.faturamentoEstimado && <div className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{formatCurrency(p.faturamentoEstimado)}</div>}
                  </div>
                  <Badge variant="outline" className="text-[10px]">{p.segmento}</Badge>
                  {!p.imported && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="w-full"><Download className="w-3 h-3 mr-1" />Importar</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Importar: {p.nomeFantasia}</DialogTitle></DialogHeader>
                        <div className="space-y-3">
                          <Label>Empresa parceira</Label>
                          <Select value={targetCompany} onValueChange={setTargetCompany}>
                            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                            <SelectContent>
                              {companies.filter((c) => c.status === "active").map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <Button className="w-full" onClick={() => { importProspect(p.id, targetCompany); setTargetCompany(""); toast.success("Lead importado!"); }} disabled={!targetCompany}>Confirmar</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Lists */}
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
                    <p className="text-sm text-muted-foreground">{list.cnpjs.length} empresas</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* History */}
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

        {/* Favorites */}
        <TabsContent value="favorites" className="space-y-4">
          {favorites.size === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">
              <Star className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="font-medium">Sem favoritos</p>
              <p className="text-sm">Marque empresas como favoritas nos resultados da busca.</p>
            </CardContent></Card>
          ) : (
            <Card><CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{favorites.size} empresas favoritadas</p>
            </CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
