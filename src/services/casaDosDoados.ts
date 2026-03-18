import { supabase } from "@/integrations/supabase/client";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;

function getFunctionUrl(name: string) {
  return `https://${PROJECT_ID}.supabase.co/functions/v1/${name}`;
}

export interface CasaDosDodsSearchParams {
  cnae?: string[];
  municipio?: string[];
  uf?: string[];
  porte?: string[];
  faturamento_min?: number;
  faturamento_max?: number;
  funcionarios_min?: number;
  funcionarios_max?: number;
  situacao_cadastral?: string;
  page?: number;
  page_size?: number;
}

export interface CasaDosDodsCompany {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  municipio: string;
  uf: string;
  cnae_principal: string;
  porte: string;
  faturamento_estimado?: number;
  numero_funcionarios?: number;
  telefone?: string;
  email?: string;
}

export interface CasaDosDodsBalance {
  saldo: number;
  plano: string;
}

async function callFunction(action: string, params?: Record<string, string>, body?: unknown) {
  const url = new URL(getFunctionUrl('casa-dos-dados'));
  url.searchParams.set('action', action);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const response = await fetch(url.toString(), {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Erro ${response.status}`);
  }

  return data;
}

export const casaDosDodsService = {
  async search(params: CasaDosDodsSearchParams) {
    return callFunction('search', undefined, params);
  },

  async getBalance(): Promise<CasaDosDodsBalance> {
    return callFunction('balance');
  },

  async getCnpj(cnpj: string) {
    return callFunction('cnpj', { cnpj: cnpj.replace(/\D/g, '') });
  },
};
