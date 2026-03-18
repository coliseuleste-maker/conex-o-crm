import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const META_API_VERSION = "v25.0";
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const META_ACCESS_TOKEN = Deno.env.get('META_ACCESS_TOKEN');
    if (!META_ACCESS_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'Token da Meta Marketing API não configurado. Adicione-o nas Configurações.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const body = req.method === 'POST' ? await req.json() : null;

    const metaHeaders = {
      'Content-Type': 'application/json',
    };

    let response: Response;

    switch (action) {
      // === CAMPAIGNS ===
      case 'list-campaigns': {
        const adAccountId = url.searchParams.get('ad_account_id');
        if (!adAccountId) {
          return new Response(JSON.stringify({ error: 'ad_account_id é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        response = await fetch(
          `${META_BASE_URL}/act_${adAccountId}/campaigns?access_token=${META_ACCESS_TOKEN}&fields=id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time`,
          { headers: metaHeaders }
        );
        break;
      }

      case 'create-campaign': {
        const { ad_account_id, ...campaignData } = body;
        if (!ad_account_id) {
          return new Response(JSON.stringify({ error: 'ad_account_id é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        const params = new URLSearchParams({ access_token: META_ACCESS_TOKEN, ...campaignData });
        response = await fetch(`${META_BASE_URL}/act_${ad_account_id}/campaigns`, {
          method: 'POST',
          headers: metaHeaders,
          body: params.toString(),
        });
        break;
      }

      case 'update-campaign': {
        const { campaign_id, ...updateData } = body;
        if (!campaign_id) {
          return new Response(JSON.stringify({ error: 'campaign_id é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        const params = new URLSearchParams({ access_token: META_ACCESS_TOKEN, ...updateData });
        response = await fetch(`${META_BASE_URL}/${campaign_id}`, {
          method: 'POST',
          headers: metaHeaders,
          body: params.toString(),
        });
        break;
      }

      case 'delete-campaign': {
        const campaignId = url.searchParams.get('campaign_id');
        if (!campaignId) {
          return new Response(JSON.stringify({ error: 'campaign_id é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        response = await fetch(`${META_BASE_URL}/${campaignId}?access_token=${META_ACCESS_TOKEN}`, {
          method: 'DELETE',
          headers: metaHeaders,
        });
        break;
      }

      // === AD SETS ===
      case 'list-adsets': {
        const adAccountId = url.searchParams.get('ad_account_id');
        if (!adAccountId) {
          return new Response(JSON.stringify({ error: 'ad_account_id é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        response = await fetch(
          `${META_BASE_URL}/act_${adAccountId}/adsets?access_token=${META_ACCESS_TOKEN}&fields=id,name,status,daily_budget,targeting,campaign_id`,
          { headers: metaHeaders }
        );
        break;
      }

      case 'create-adset': {
        const { ad_account_id: acctId, ...adsetData } = body;
        if (!acctId) {
          return new Response(JSON.stringify({ error: 'ad_account_id é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        response = await fetch(`${META_BASE_URL}/act_${acctId}/adsets`, {
          method: 'POST',
          headers: { ...metaHeaders, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ access_token: META_ACCESS_TOKEN, ...adsetData }).toString(),
        });
        break;
      }

      // === AD CREATIVES ===
      case 'list-creatives': {
        const adAccountId = url.searchParams.get('ad_account_id');
        if (!adAccountId) {
          return new Response(JSON.stringify({ error: 'ad_account_id é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        response = await fetch(
          `${META_BASE_URL}/act_${adAccountId}/adcreatives?access_token=${META_ACCESS_TOKEN}&fields=id,name,title,body,image_url,status`,
          { headers: metaHeaders }
        );
        break;
      }

      // === INSIGHTS ===
      case 'insights': {
        const objectId = url.searchParams.get('object_id');
        const datePreset = url.searchParams.get('date_preset') || 'last_30d';
        if (!objectId) {
          return new Response(JSON.stringify({ error: 'object_id é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        response = await fetch(
          `${META_BASE_URL}/${objectId}/insights?access_token=${META_ACCESS_TOKEN}&fields=impressions,clicks,spend,cpc,cpm,ctr,reach,frequency,actions&date_preset=${datePreset}`,
          { headers: metaHeaders }
        );
        break;
      }

      // === AUDIENCES ===
      case 'list-audiences': {
        const adAccountId = url.searchParams.get('ad_account_id');
        if (!adAccountId) {
          return new Response(JSON.stringify({ error: 'ad_account_id é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        response = await fetch(
          `${META_BASE_URL}/act_${adAccountId}/customaudiences?access_token=${META_ACCESS_TOKEN}&fields=id,name,approximate_count,data_source`,
          { headers: metaHeaders }
        );
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Ação inválida. Use: list-campaigns, create-campaign, update-campaign, delete-campaign, list-adsets, create-adset, list-creatives, insights, list-audiences' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    const data = await response.json();

    if (!response.ok) {
      const metaError = data?.error;
      return new Response(
        JSON.stringify({
          error: metaError?.message || `Erro da Meta API [${response.status}]`,
          code: metaError?.code,
          type: metaError?.type,
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Meta Marketing error:', error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ error: `Erro ao processar requisição: ${message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
