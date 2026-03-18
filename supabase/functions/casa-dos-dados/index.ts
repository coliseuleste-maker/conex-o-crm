import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CASA_DOS_DADOS_BASE_V5 = "https://api.casadosdados.com.br/v5";
const CASA_DOS_DADOS_BASE_V4 = "https://api.casadosdados.com.br/v4";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CASA_DOS_DADOS_API_KEY = Deno.env.get('CASA_DOS_DADOS_API_KEY');
    if (!CASA_DOS_DADOS_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Chave da API Casa dos Dados não configurada. Adicione-a nas Configurações.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    const headers = {
      'api-key': CASA_DOS_DADOS_API_KEY,
      'Content-Type': 'application/json',
    };

    let response: Response;

    switch (action) {
      case 'search': {
        const body = await req.json();
        response = await fetch(`${CASA_DOS_DADOS_BASE_V5}/cnpj/pesquisa-avancada`, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        });
        break;
      }

      case 'balance': {
        response = await fetch(`${CASA_DOS_DADOS_BASE_V5}/saldo`, {
          method: 'GET',
          headers,
        });
        break;
      }

      case 'cnpj': {
        const cnpj = url.searchParams.get('cnpj');
        if (!cnpj) {
          return new Response(
            JSON.stringify({ error: 'Parâmetro CNPJ é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        response = await fetch(`${CASA_DOS_DADOS_BASE_V4}/cnpj/${cnpj}`, {
          method: 'GET',
          headers,
        });
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Ação inválida. Use: search, balance, cnpj' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    if (response.status === 401) {
      return new Response(
        JSON.stringify({ error: 'Chave de API inválida (401 Unauthorized). Verifique sua chave nas Configurações.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (response.status === 403) {
      return new Response(
        JSON.stringify({ error: 'Acesso negado (403 Forbidden). Sua conta pode não ter permissão para este recurso.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Casa dos Dados error:', error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ error: `Erro ao processar requisição: ${message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
