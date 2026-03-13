import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CRMProvider } from "@/contexts/CRMContext";
import AppLayout from "@/components/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import CompaniesPage from "@/pages/CompaniesPage";
import LeadsPage from "@/pages/LeadsPage";
import KanbanPage from "@/pages/KanbanPage";
import ReportsPage from "@/pages/ReportsPage";
import CommissionsPage from "@/pages/CommissionsPage";
import CompanyDetailPage from "@/pages/CompanyDetailPage";
import TeamPage from "@/pages/TeamPage";
import ProspectingPage from "@/pages/ProspectingPage";
import AIAgentPage from "@/pages/AIAgentPage";
import AutomationPage from "@/pages/AutomationPage";
import InternationalPage from "@/pages/InternationalPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CRMProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/empresas" element={<CompaniesPage />} />
              <Route path="/empresas/:id" element={<CompanyDetailPage />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/kanban" element={<KanbanPage />} />
              <Route path="/equipe" element={<TeamPage />} />
              <Route path="/prospeccao" element={<ProspectingPage />} />
              <Route path="/agentes-ia" element={<AIAgentPage />} />
              <Route path="/automacao" element={<AutomationPage />} />
              <Route path="/internacional" element={<InternationalPage />} />
              <Route path="/relatorios" element={<ReportsPage />} />
              <Route path="/comissoes" element={<CommissionsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </CRMProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
