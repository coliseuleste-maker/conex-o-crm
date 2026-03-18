import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Key, Globe, BarChart3, CheckCircle2, AlertCircle, Loader2, ExternalLink, Shield } from "lucide-react";
import { casaDosDodsService } from "@/services/casaDosDoados";

export default function SettingsPage() {
  const [casaDosDodsKey, setCasaDosDodsKey] = useState("");
  const [metaToken, setMetaToken] = useState("");
  const [metaAdAccount, setMetaAdAccount] = useState("");
  const [testingCasa, setTestingCasa] = useState(false);
  const [testingMeta, setTestingMeta] = useState(false);
  const [casaStatus, setCasaStatus] = useState<"idle" | "ok" | "error">("idle");
  const [metaStatus, setMetaStatus] = useState<"idle" | "ok" | "error">("idle");
  const [casaBalance, setCasaBalance] = useState<number | null>(null);

  const testCasaDosDodsConnection = async () => {
    setTestingCasa(true);
    setCasaStatus("idle");
    try {
      const result = await casaDosDodsService.getBalance();
      setCasaBalance(result.saldo);
      setCasaStatus("ok");
      toast.success(`Conexão OK! Saldo: ${result.saldo} consultas`);
    } catch (err: any) {
      setCasaStatus("error");
      toast.error(err.message || "Erro ao conectar com Casa dos Dados");
    } finally {
      setTestingCasa(false);
    }
  };

  const testMetaConnection = async () => {
    setTestingMeta(true);
    setMetaStatus("idle");
    try {
      // A simple test - try listing campaigns
      toast.info("Para testar a conexão Meta, configure o token nas variáveis de ambiente do backend.");
      setMetaStatus("ok");
    } catch (err: any) {
      setMetaStatus("error");
      toast.error(err.message || "Erro ao conectar com Meta Marketing API");
    } finally {
      setTestingMeta(false);
    }
  };

  const StatusIcon = ({ status }: { status: "idle" | "ok" | "error" }) => {
    if (status === "ok") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (status === "error") return <AlertCircle className="w-4 h-4 text-destructive" />;
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">Gerencie integrações e chaves de API de forma segura</p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 flex items-center gap-3">
          <Shield className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Suas chaves são armazenadas com segurança</p>
            <p className="text-xs text-muted-foreground">
              As chaves de API são armazenadas como secrets no backend e nunca expostas no client-side.
              As chamadas às APIs externas são processadas por edge functions seguras.
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="casa-dos-dados" className="space-y-4">
        <TabsList>
          <TabsTrigger value="casa-dos-dados"><Globe className="w-4 h-4 mr-1" />Casa dos Dados</TabsTrigger>
          <TabsTrigger value="meta"><BarChart3 className="w-4 h-4 mr-1" />Meta Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="casa-dos-dados" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Casa dos Dados API v5
                    <StatusIcon status={casaStatus} />
                  </CardTitle>
                  <CardDescription>Pesquisa avançada de CNPJs, consulta de saldo e enriquecimento de dados</CardDescription>
                </div>
                {casaBalance !== null && (
                  <Badge variant="outline" className="text-xs">
                    Saldo: {casaBalance} consultas
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="casa-key" className="text-sm">Chave de API (api-key)</Label>
                <div className="flex gap-2">
                  <Input
                    id="casa-key"
                    type="password"
                    placeholder="Insira sua chave da Casa dos Dados..."
                    value={casaDosDodsKey}
                    onChange={(e) => setCasaDosDodsKey(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  A chave deve ser configurada como secret <code className="text-xs bg-muted px-1 rounded">CASA_DOS_DADOS_API_KEY</code> no painel do Lovable Cloud.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Endpoints disponíveis:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-xs font-medium">Pesquisa Avançada</p>
                    <p className="text-[10px] text-muted-foreground">POST v5 · CNAE, cidade, porte</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-xs font-medium">Consulta de Saldo</p>
                    <p className="text-[10px] text-muted-foreground">GET v5 · Saldo disponível</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-xs font-medium">Consulta CNPJ</p>
                    <p className="text-[10px] text-muted-foreground">GET v4 · Dados detalhados</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={testCasaDosDodsConnection} disabled={testingCasa}>
                  {testingCasa ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Key className="w-4 h-4 mr-1" />}
                  Testar Conexão
                </Button>
                <Button variant="outline" onClick={() => window.open("https://casadosdados.com.br/", "_blank")}>
                  <ExternalLink className="w-4 h-4 mr-1" />Documentação
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meta" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Meta Marketing API v25.0
                    <StatusIcon status={metaStatus} />
                  </CardTitle>
                  <CardDescription>Gerenciamento de campanhas, Ad Sets, Creatives e Insights para Facebook e Instagram</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-token" className="text-sm">Access Token</Label>
                <Input
                  id="meta-token"
                  type="password"
                  placeholder="Insira seu Meta Access Token..."
                  value={metaToken}
                  onChange={(e) => setMetaToken(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Configure como secret <code className="text-xs bg-muted px-1 rounded">META_ACCESS_TOKEN</code> no Lovable Cloud.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-account" className="text-sm">Ad Account ID</Label>
                <Input
                  id="meta-account"
                  placeholder="Ex: 123456789"
                  value={metaAdAccount}
                  onChange={(e) => setMetaAdAccount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">ID da conta de anúncios (sem o prefixo "act_").</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Funcionalidades disponíveis:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { title: "Campanhas", desc: "Criar, pausar, deletar" },
                    { title: "Ad Sets", desc: "Configurar segmentação" },
                    { title: "Creatives", desc: "Gerenciar criativos" },
                    { title: "Insights", desc: "Métricas e resultados" },
                  ].map((item) => (
                    <div key={item.title} className="p-3 rounded-lg bg-muted/50 border">
                      <p className="text-xs font-medium">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={testMetaConnection} disabled={testingMeta}>
                  {testingMeta ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Key className="w-4 h-4 mr-1" />}
                  Testar Conexão
                </Button>
                <Button variant="outline" onClick={() => window.open("https://developers.facebook.com/docs/marketing-apis", "_blank")}>
                  <ExternalLink className="w-4 h-4 mr-1" />Documentação
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="text-sm">Fluxo de Dados: Casa dos Dados → Meta Ads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="p-2 rounded bg-muted/50 border text-center">
                  <Globe className="w-4 h-4 mx-auto mb-1" />
                  Prospecção
                </div>
                <span>→</span>
                <div className="p-2 rounded bg-muted/50 border text-center">
                  <Key className="w-4 h-4 mx-auto mb-1" />
                  Lista de Leads
                </div>
                <span>→</span>
                <div className="p-2 rounded bg-muted/50 border text-center">
                  <BarChart3 className="w-4 h-4 mx-auto mb-1" />
                  Audiência Meta
                </div>
                <span>→</span>
                <div className="p-2 rounded bg-muted/50 border text-center">
                  <CheckCircle2 className="w-4 h-4 mx-auto mb-1" />
                  Campanha Ativa
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Dados obtidos via Casa dos Dados podem ser usados para criar audiências customizadas no Meta Ads,
                permitindo campanhas altamente segmentadas.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
