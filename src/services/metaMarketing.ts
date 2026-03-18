const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;

function getFunctionUrl() {
  return `https://${PROJECT_ID}.supabase.co/functions/v1/meta-marketing`;
}

async function callMeta(action: string, params?: Record<string, string>, body?: unknown) {
  const url = new URL(getFunctionUrl());
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
    throw new Error(data.error || `Erro Meta API ${response.status}`);
  }
  return data;
}

export interface MetaCampaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  daily_budget?: string;
  lifetime_budget?: string;
  start_time?: string;
  stop_time?: string;
}

export interface MetaInsight {
  impressions: string;
  clicks: string;
  spend: string;
  cpc: string;
  cpm: string;
  ctr: string;
  reach: string;
  frequency: string;
  actions?: Array<{ action_type: string; value: string }>;
}

export const metaMarketingService = {
  // Campaigns
  async listCampaigns(adAccountId: string): Promise<{ data: MetaCampaign[] }> {
    return callMeta('list-campaigns', { ad_account_id: adAccountId });
  },

  async createCampaign(adAccountId: string, data: Record<string, string>) {
    return callMeta('create-campaign', undefined, { ad_account_id: adAccountId, ...data });
  },

  async updateCampaign(campaignId: string, data: Record<string, string>) {
    return callMeta('update-campaign', undefined, { campaign_id: campaignId, ...data });
  },

  async pauseCampaign(campaignId: string) {
    return callMeta('update-campaign', undefined, { campaign_id: campaignId, status: 'PAUSED' });
  },

  async deleteCampaign(campaignId: string) {
    return callMeta('delete-campaign', { campaign_id: campaignId });
  },

  // Ad Sets
  async listAdSets(adAccountId: string) {
    return callMeta('list-adsets', { ad_account_id: adAccountId });
  },

  async createAdSet(adAccountId: string, data: Record<string, string>) {
    return callMeta('create-adset', undefined, { ad_account_id: adAccountId, ...data });
  },

  // Creatives
  async listCreatives(adAccountId: string) {
    return callMeta('list-creatives', { ad_account_id: adAccountId });
  },

  // Insights
  async getInsights(objectId: string, datePreset = 'last_30d'): Promise<{ data: MetaInsight[] }> {
    return callMeta('insights', { object_id: objectId, date_preset: datePreset });
  },

  // Audiences
  async listAudiences(adAccountId: string) {
    return callMeta('list-audiences', { ad_account_id: adAccountId });
  },
};
