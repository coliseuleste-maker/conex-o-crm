import { useCRM } from "@/contexts/CRMContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KANBAN_STAGES } from "@/data/mockData";
import { Lead, LeadStatus } from "@/types/crm";
import { formatCurrency, statusLabels } from "@/lib/format";
import { useMemo, useState, DragEvent } from "react";
import { User, DollarSign } from "lucide-react";

export default function KanbanPage() {
  const { leads, companies, selectedCompanyId, updateLeadStatus } = useCRM();

  const filteredLeads = useMemo(
    () => (selectedCompanyId ? leads.filter((l) => l.companyId === selectedCompanyId) : leads),
    [leads, selectedCompanyId]
  );

  const [draggedLead, setDraggedLead] = useState<string | null>(null);

  const handleDragStart = (e: DragEvent, leadId: string) => {
    setDraggedLead(leadId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: DragEvent, stageId: LeadStatus) => {
    e.preventDefault();
    if (draggedLead) {
      updateLeadStatus(draggedLead, stageId);
      setDraggedLead(null);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Kanban Comercial</h1>
        <p className="text-sm text-muted-foreground">
          {selectedCompanyId
            ? companies.find((c) => c.id === selectedCompanyId)?.name
            : "Todas as empresas"}{" "}
          — {filteredLeads.length} leads
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {KANBAN_STAGES.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.status === stage.id);
          const stageValue = stageLeads.reduce((s, l) => s + l.potentialValue, 0);

          return (
            <div
              key={stage.id}
              className="min-w-[280px] w-[280px] shrink-0"
              onDrop={(e) => handleDrop(e, stage.id)}
              onDragOver={handleDragOver}
            >
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                <h3 className="text-sm font-semibold text-foreground">{stage.label}</h3>
                <span className="ml-auto text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                  {stageLeads.length}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground px-1 mb-2">
                {formatCurrency(stageValue)}
              </p>

              <div className="space-y-2 min-h-[200px] bg-muted/50 rounded-lg p-2">
                {stageLeads.map((lead) => {
                  const company = companies.find((c) => c.id === lead.companyId);
                  return (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      className="bg-card rounded-lg border p-3 cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <p className="font-medium text-sm text-foreground">{lead.name}</p>
                        <span className="text-[10px] text-muted-foreground">{lead.entryDate}</span>
                      </div>
                      {company && (
                        <p className="text-[11px] text-accent font-medium mb-1">{company.name}</p>
                      )}
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />{lead.responsible}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />{formatCurrency(lead.potentialValue)}
                        </span>
                      </div>
                      {lead.origin && (
                        <span className="inline-block mt-1.5 text-[10px] bg-secondary rounded px-1.5 py-0.5 text-secondary-foreground">
                          {lead.origin}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
