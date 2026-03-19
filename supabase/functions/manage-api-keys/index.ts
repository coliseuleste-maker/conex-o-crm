import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (action === 'save') {
      const { key_name, key_value } = await req.json();
      if (!key_name || !key_value) {
        return new Response(JSON.stringify({ error: 'key_name e key_value são obrigatórios' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error } = await supabase.from('api_settings').upsert(
        { key_name, key_value, updated_at: new Date().toISOString() },
        { onConflict: 'key_name' }
      );

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get') {
      const keyName = url.searchParams.get('key_name');
      if (!keyName) {
        return new Response(JSON.stringify({ error: 'key_name é obrigatório' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data, error } = await supabase.from('api_settings')
        .select('key_value, updated_at')
        .eq('key_name', keyName)
        .maybeSingle();

      if (error) throw error;

      return new Response(JSON.stringify({ 
        exists: !!data, 
        updated_at: data?.updated_at || null 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'test') {
      const keyName = url.searchParams.get('key_name');
      if (!keyName) {
        return new Response(JSON.stringify({ error: 'key_name é obrigatório' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get key from DB
      const { data } = await supabase.from('api_settings')
        .select('key_value')
        .eq('key_name', keyName)
        .maybeSingle();

      // Fallback to env var
      const apiKey = data?.key_value || Deno.env.get(keyName);

      if (!apiKey) {
        return new Response(JSON.stringify({ success: false, error: 'Chave não configurada' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (keyName === 'CASA_DOS_DADOS_API_KEY') {
        const res = await fetch('https://api.casadosdados.com.br/v5/saldo', {
          method: 'GET',
          headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
        });
        const result = await res.json();
        if (!res.ok) {
          return new Response(JSON.stringify({ success: false, error: `API retornou ${res.status}`, details: result }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        return new Response(JSON.stringify({ success: true, balance: result }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Ação inválida. Use: save, get, test' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('manage-api-keys error:', error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
