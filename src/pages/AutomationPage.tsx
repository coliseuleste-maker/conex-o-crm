import { useCRM } from "@/contexts/CRMContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Mail, MessageCircle, Linkedin, Play, Pause, Plus, Clock, ArrowRight, Send, Bell } from "lucide-react";

const channelIcons = { email: Mail, whatsapp: MessageCircle, linkedin: Linkedin };
const channelLabels = { email: "Email", whatsapp: "WhatsApp", linkedin: "LinkedIn" };

export default function AutomationPage() {
  const { automationSequences } = useCRM();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Automação de Contato</h1>
          <p className="text-sm text-muted-foreground">Sequências de prospecção, follow-ups e lembretes</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" />Nova Sequência</Button>
      </div>

      {/* Channel KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {(["email", "whatsapp", "linkedin"] as const).map((ch) => {
          const seqs = automationSequences.filter((s) => s.channel === ch);
          const Icon = channelIcons[ch];
          const enrolled = seqs.reduce((s, seq) => s + seq.leadsEnrolled, 0);
          const avgRate = seqs.length > 0 ? seqs.reduce((s, seq) => s + seq.responseRate, 0) / seqs.length : 0;
          return (
            <Card key={ch}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{channelLabels[ch]}</p>
                  <p className="text-[11px] text-muted-foreground">{enrolled} leads · {avgRate.toFixed(0)}% resposta</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sequences */}
      <div className="space-y-4">
        {automationSequences.map((seq) => {
          const Icon = channelIcons[seq.channel];
          return (
            <Card key={seq.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{seq.name}</CardTitle>
                      <p className="text-[11px] text-muted-foreground">{seq.steps.length} etapas · {seq.leadsEnrolled} leads</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={seq.active ? "default" : "secondary"} className="text-[10px]">
                      {seq.active ? "Ativa" : "Pausada"}
                    </Badge>
                    <Switch checked={seq.active} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Steps visualization */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {seq.steps.map((step, i) => (
                    <div key={step.id} className="flex items-center gap-2">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] shrink-0 ${step.type === "message" ? "bg-primary/5 border-primary/20" : "bg-muted border-border"}`}>
                        {step.type === "message" ? <Send className="w-3 h-3 text-primary" /> : <Clock className="w-3 h-3 text-muted-foreground" />}
                        {step.type === "message" ? step.content.substring(0, 30) + "..." : `Aguardar ${step.delayDays}d`}
                      </div>
                      {i < seq.steps.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex gap-4 text-[11px] text-muted-foreground">
                    <span>Taxa de resposta: <strong className="text-foreground">{seq.responseRate}%</strong></span>
                    <span>Leads ativos: <strong className="text-foreground">{seq.leadsEnrolled}</strong></span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="h-7 text-xs">Editar</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">{seq.active ? <><Pause className="w-3 h-3 mr-1" />Pausar</> : <><Play className="w-3 h-3 mr-1" />Ativar</>}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Automation Features */}
      <Card className="border-accent/20 bg-accent/5">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Recursos de Automação</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Send, title: "Sequências de Prospecção", desc: "Crie fluxos automatizados multicanal para engajar leads" },
              { icon: Bell, title: "Follow-ups Automáticos", desc: "Lembretes e mensagens de acompanhamento programados" },
              { icon: Clock, title: "Lembretes de Contato", desc: "Alertas para retomar contatos inativos ou atrasados" },
            ].map((feat) => (
              <div key={feat.title} className="flex gap-3 p-3 rounded-lg bg-card border border-border">
                <feat.icon className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">{feat.title}</p>
                  <p className="text-[11px] text-muted-foreground">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
