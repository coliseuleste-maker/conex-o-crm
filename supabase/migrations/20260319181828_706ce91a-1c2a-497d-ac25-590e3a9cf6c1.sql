
CREATE TABLE public.api_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name text NOT NULL UNIQUE,
  key_value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.api_settings ENABLE ROW LEVEL SECURITY;

-- Allow edge functions (service role) full access, no public access
CREATE POLICY "Service role full access" ON public.api_settings
  FOR ALL USING (true) WITH CHECK (true);
