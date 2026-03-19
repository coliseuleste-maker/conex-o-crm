const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;

function getFunctionUrl(name: string) {
  return `https://${PROJECT_ID}.supabase.co/functions/v1/${name}`;
}

export const apiSettingsService = {
  async saveKey(keyName: string, keyValue: string) {
    const url = new URL(getFunctionUrl('manage-api-keys'));
    url.searchParams.set('action', 'save');

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key_name: keyName, key_value: keyValue }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `Erro ${response.status}`);
    return data;
  },

  async getKeyStatus(keyName: string) {
    const url = new URL(getFunctionUrl('manage-api-keys'));
    url.searchParams.set('action', 'get');
    url.searchParams.set('key_name', keyName);

    const response = await fetch(url.toString());
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `Erro ${response.status}`);
    return data as { exists: boolean; updated_at: string | null };
  },

  async testKey(keyName: string) {
    const url = new URL(getFunctionUrl('manage-api-keys'));
    url.searchParams.set('action', 'test');
    url.searchParams.set('key_name', keyName);

    const response = await fetch(url.toString());
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `Erro ${response.status}`);
    return data;
  },
};
