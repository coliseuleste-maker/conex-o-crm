import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Building2, Users, KanbanSquare, BarChart3, DollarSign,
  ChevronLeft, ChevronRight, Zap, UserCog, Search, Bot, Workflow, Globe, Megaphone,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCRM } from "@/contexts/CRMContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/empresas", icon: Building2, label: "Empresas" },
  { to: "/leads", icon: Users, label: "Leads" },
  { to: "/kanban", icon: KanbanSquare, label: "Kanban" },
  { to: "/equipe", icon: UserCog, label: "Equipe Comercial" },
  { to: "/prospeccao", icon: Search, label: "Prospecção" },
  { to: "/agentes-ia", icon: Bot, label: "Agentes de IA" },
  { to: "/automacao", icon: Workflow, label: "Automação" },
  { to: "/internacional", icon: Globe, label: "Internacional" },
  { to: "/relatorios", icon: BarChart3, label: "Relatórios" },
  { to: "/comissoes", icon: DollarSign, label: "Comissões" },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { companies, selectedCompanyId, setSelectedCompanyId } = useCRM();
  const location = useLocation();

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
      collapsed ? "w-[68px]" : "w-[250px]"
    )}>
      <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-sidebar-primary-foreground truncate">Conexão Comercial</h1>
            <p className="text-[10px] text-sidebar-muted truncate">RevOps Platform</p>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="px-3 py-3 border-b border-sidebar-border">
          <label className="text-[10px] uppercase tracking-wider text-sidebar-muted font-semibold mb-1 block">Empresa</label>
          <Select value={selectedCompanyId || "all"} onValueChange={(v) => setSelectedCompanyId(v === "all" ? null : v)}>
            <SelectTrigger className="h-8 text-xs bg-sidebar-accent border-sidebar-border text-sidebar-foreground">
              <SelectValue placeholder="Todas as empresas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as empresas</SelectItem>
              {companies.filter((c) => c.status === "active").map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
          return (
            <NavLink key={item.to} to={item.to} className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
              isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}>
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <button onClick={() => setCollapsed(!collapsed)} className="mx-2 mb-3 p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-muted transition-colors flex items-center justify-center">
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
