import { useState } from "react";
import { Globe, MapPin, Building2, BarChart3, Plus, Search, ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { countries, currencies, languages, mockInternationalLeads, mockInternationalCompanies } from "@/data/internationalData";
import { formatInternationalCurrency, convertToUSD, formatCompactCurrency } from "@/lib/internationalFormat";
import { Country, InternationalLead, LanguageCode, CurrencyCode } from "@/types/international";
import { getTranslation } from "@/i18n/translations";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const CHART_COLORS = [
  "hsl(200, 80%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(152, 60%, 40%)",
  "hsl(270, 60%, 55%)",
  "hsl(0, 72%, 51%)",
  "hsl(175, 60%, 45%)",
  "hsl(220, 70%, 25%)",
];

export default function InternationalPage() {
  const [currentLang] = useState<LanguageCode>("pt");
  const t = getTranslation(currentLang);
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>("all");
  const [registrationCountry, setRegistrationCountry] = useState<string>("");
  const [showRegDialog, setShowRegDialog] = useState(false);
  const [intLeads] = useState<InternationalLead[]>(mockInternationalLeads);

  const filteredLeads = selectedCountryFilter === "all"
    ? intLeads
    : intLeads.filter((l) => l.countryId === selectedCountryFilter);

  const getCountry = (id: string) => countries.find((c) => c.id === id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Globe className="w-7 h-7 text-accent" />
            {t.internationalExpansion}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie operações em múltiplos países da América Latina e Estados Unidos
          </p>
        </div>
      </div>

      <Tabs defaultValue="countries" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="countries" className="gap-1.5"><MapPin className="w-4 h-4" />{t.countriesAndRegions}</TabsTrigger>
          <TabsTrigger value="registration" className="gap-1.5"><Building2 className="w-4 h-4" />{t.internationalRegistration}</TabsTrigger>
          <TabsTrigger value="reports" className="gap-1.5"><BarChart3 className="w-4 h-4" />{t.internationalReports}</TabsTrigger>
        </TabsList>

        {/* MODULE 1: Countries & Regions */}
        <TabsContent value="countries" className="space-y-4">
          <CountriesPanel />
        </TabsContent>

        {/* MODULE 2: International Registration */}
        <TabsContent value="registration" className="space-y-4">
          <RegistrationPanel
            t={t}
            registrationCountry={registrationCountry}
            setRegistrationCountry={setRegistrationCountry}
            showRegDialog={showRegDialog}
            setShowRegDialog={setShowRegDialog}
            selectedCountryFilter={selectedCountryFilter}
            setSelectedCountryFilter={setSelectedCountryFilter}
            filteredLeads={filteredLeads}
            getCountry={getCountry}
          />
        </TabsContent>

        {/* MODULE 3: International Reports */}
        <TabsContent value="reports" className="space-y-4">
          <ReportsPanel intLeads={intLeads} getCountry={getCountry} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ─── MODULE 1: Countries ─── */
function CountriesPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {countries.map((c) => {
        const curr = currencies.find((cu) => cu.code === c.currency);
        const lang = languages.find((l) => l.code === c.language);
        const leadCount = mockInternationalLeads.filter((l) => l.countryId === c.id).length;
        return (
          <Card key={c.id} className="hover:shadow-md transition-shadow border-border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="text-2xl">{c.flag}</span>
                {c.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Código:</span><Badge variant="outline">{c.code}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Idioma:</span><span className="font-medium">{lang?.nativeName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Moeda:</span><span className="font-medium">{curr?.symbol} ({c.currency})</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Fuso:</span><span className="font-medium text-[11px]">{c.timezone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Prefixo:</span><span className="font-medium">{c.phonePrefix}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Doc. Fiscal:</span><Badge variant="secondary">{c.taxDocumentLabel}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Leads:</span><Badge className="bg-accent text-accent-foreground">{leadCount}</Badge></div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/* ─── MODULE 2: International Registration ─── */
function RegistrationPanel({
  t, registrationCountry, setRegistrationCountry, showRegDialog, setShowRegDialog,
  selectedCountryFilter, setSelectedCountryFilter, filteredLeads, getCountry,
}: {
  t: ReturnType<typeof getTranslation>;
  registrationCountry: string;
  setRegistrationCountry: (v: string) => void;
  showRegDialog: boolean;
  setShowRegDialog: (v: boolean) => void;
  selectedCountryFilter: string;
  setSelectedCountryFilter: (v: string) => void;
  filteredLeads: InternationalLead[];
  getCountry: (id: string) => Country | undefined;
}) {
  const selectedCountry = countries.find((c) => c.id === registrationCountry);

  const getFieldLabels = (country: Country) => {
    if (country.language === "en") return { businessName: "Business Name", taxDoc: country.taxDocumentLabel, phone: "Phone", email: "Email", state: "State", city: "City", industry: "Industry" };
    if (country.language === "es") return { businessName: "Razón Social", taxDoc: country.taxDocumentLabel, phone: "Teléfono", email: "Email", state: "Estado", city: "Ciudad", industry: "Industria" };
    return { businessName: "Razão Social", taxDoc: country.taxDocumentLabel, phone: "Telefone", email: "Email", state: "Estado", city: "Cidade", industry: "Segmento" };
  };

  const statusColors: Record<string, string> = {
    new: "bg-muted text-muted-foreground",
    contacted: "bg-accent/20 text-accent",
    qualified: "bg-primary/20 text-primary",
    negotiation: "bg-warning/20 text-warning",
    closed: "bg-success/20 text-success",
    lost: "bg-destructive/20 text-destructive",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select value={selectedCountryFilter} onValueChange={setSelectedCountryFilter}>
          <SelectTrigger className="w-[220px]"><SelectValue placeholder={t.allCountries} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.allCountries}</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.flag} {c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={showRegDialog} onOpenChange={setShowRegDialog}>
          <DialogTrigger asChild>
            <Button className="gap-1.5"><Plus className="w-4 h-4" />{t.registerLead}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Globe className="w-5 h-5" />{t.registerLead}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{t.selectCountry}</Label>
                <Select value={registrationCountry} onValueChange={setRegistrationCountry}>
                  <SelectTrigger><SelectValue placeholder={t.selectCountry} /></SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.flag} {c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedCountry && (() => {
                const labels = getFieldLabels(selectedCountry);
                return (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="text-lg">{selectedCountry.flag}</span>
                      Formulário para {selectedCountry.name} • {selectedCountry.currency} • {selectedCountry.taxDocumentLabel}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2"><Label>{labels.businessName}</Label><Input placeholder={labels.businessName} /></div>
                      <div><Label>{labels.taxDoc}</Label><Input placeholder={labels.taxDoc} /></div>
                      <div><Label>{labels.phone}</Label><Input placeholder={`${selectedCountry.phonePrefix} ${selectedCountry.phoneFormat}`} /></div>
                      <div className="col-span-2"><Label>{labels.email}</Label><Input type="email" placeholder={labels.email} /></div>
                      <div><Label>{labels.state}</Label><Input placeholder={labels.state} /></div>
                      <div><Label>{labels.city}</Label><Input placeholder={labels.city} /></div>
                      <div><Label>{labels.industry}</Label><Input placeholder={labels.industry} /></div>
                      <div><Label>{t.potentialValue} ({selectedCountry.currency})</Label><Input type="number" placeholder="0" /></div>
                    </div>
                    <Button className="w-full mt-2" onClick={() => setShowRegDialog(false)}>{t.save}</Button>
                  </div>
                );
              })()}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.country}</TableHead>
                <TableHead>{t.businessName}</TableHead>
                <TableHead>{t.taxDocument}</TableHead>
                <TableHead>{t.phone}</TableHead>
                <TableHead>{t.industry}</TableHead>
                <TableHead>{t.potentialValue}</TableHead>
                <TableHead>{t.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => {
                const country = getCountry(lead.countryId);
                return (
                  <TableRow key={lead.id}>
                    <TableCell><span className="flex items-center gap-1.5"><span className="text-lg">{country?.flag}</span><span className="text-xs">{country?.code}</span></span></TableCell>
                    <TableCell className="font-medium">{lead.businessName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{lead.taxDocument}</TableCell>
                    <TableCell className="text-xs">{lead.phone}</TableCell>
                    <TableCell className="text-xs">{lead.industry}</TableCell>
                    <TableCell className="font-medium text-xs">{formatInternationalCurrency(lead.potentialValue, lead.currency)}</TableCell>
                    <TableCell><Badge className={statusColors[lead.status] || ""}>{lead.status}</Badge></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── MODULE 3: International Reports ─── */
function ReportsPanel({ intLeads, getCountry }: { intLeads: InternationalLead[]; getCountry: (id: string) => Country | undefined }) {
  const countryMetrics = countries.map((c, i) => {
    const cLeads = intLeads.filter((l) => l.countryId === c.id);
    const totalValueUSD = cLeads.reduce((sum, l) => sum + convertToUSD(l.potentialValue, l.currency), 0);
    const closedUSD = cLeads.filter((l) => l.status === "closed").reduce((sum, l) => sum + convertToUSD(l.potentialValue, l.currency), 0);
    const closedCount = cLeads.filter((l) => l.status === "closed").length;
    return {
      name: `${c.flag} ${c.code}`,
      fullName: c.name,
      flag: c.flag,
      leads: cLeads.length,
      totalValueUSD: Math.round(totalValueUSD),
      closedValueUSD: Math.round(closedUSD),
      avgTicketUSD: closedCount > 0 ? Math.round(closedUSD / closedCount) : 0,
      conversionRate: cLeads.length > 0 ? Math.round((closedCount / cLeads.length) * 100) : 0,
      color: CHART_COLORS[i % CHART_COLORS.length],
    };
  }).filter((m) => m.leads > 0);

  const totalLeads = countryMetrics.reduce((s, m) => s + m.leads, 0);
  const totalValueUSD = countryMetrics.reduce((s, m) => s + m.totalValueUSD, 0);
  const totalClosedUSD = countryMetrics.reduce((s, m) => s + m.closedValueUSD, 0);
  const globalConversion = totalLeads > 0 ? Math.round((intLeads.filter((l) => l.status === "closed").length / totalLeads) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4">
          <p className="text-xs text-muted-foreground">Total de Leads Global</p>
          <p className="text-2xl font-bold text-foreground">{totalLeads}</p>
          <p className="text-xs text-muted-foreground">{countries.filter((c) => intLeads.some((l) => l.countryId === c.id)).length} países ativos</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4">
          <p className="text-xs text-muted-foreground">Valor Total (USD)</p>
          <p className="text-2xl font-bold text-foreground">${totalValueUSD.toLocaleString()}</p>
          <p className="text-xs text-accent flex items-center gap-1"><ArrowRightLeft className="w-3 h-3" />Convertido para USD</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4">
          <p className="text-xs text-muted-foreground">Valor Fechado (USD)</p>
          <p className="text-2xl font-bold text-success">${totalClosedUSD.toLocaleString()}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4">
          <p className="text-xs text-muted-foreground">Taxa de Conversão Global</p>
          <p className="text-2xl font-bold text-foreground">{globalConversion}%</p>
        </CardContent></Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">Leads por País</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={countryMetrics} dataKey="leads" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, leads }) => `${name} (${leads})`}>
                  {countryMetrics.map((m, i) => <Cell key={i} fill={m.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Valor em Negociação por País (USD)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={countryMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Valor USD"]} />
                <Bar dataKey="totalValueUSD" radius={[4, 4, 0, 0]}>
                  {countryMetrics.map((m, i) => <Cell key={i} fill={m.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-sm">Comparativo entre Países</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>País</TableHead>
                  <TableHead className="text-right">Leads</TableHead>
                  <TableHead className="text-right">Valor Total (USD)</TableHead>
                  <TableHead className="text-right">Valor Fechado (USD)</TableHead>
                  <TableHead className="text-right">Ticket Médio (USD)</TableHead>
                  <TableHead className="text-right">Conversão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {countryMetrics.sort((a, b) => b.totalValueUSD - a.totalValueUSD).map((m) => (
                  <TableRow key={m.name}>
                    <TableCell className="font-medium">{m.flag} {m.fullName}</TableCell>
                    <TableCell className="text-right">{m.leads}</TableCell>
                    <TableCell className="text-right font-medium">${m.totalValueUSD.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-success font-medium">${m.closedValueUSD.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${m.avgTicketUSD.toLocaleString()}</TableCell>
                    <TableCell className="text-right"><Badge variant={m.conversionRate >= 30 ? "default" : "secondary"}>{m.conversionRate}%</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
