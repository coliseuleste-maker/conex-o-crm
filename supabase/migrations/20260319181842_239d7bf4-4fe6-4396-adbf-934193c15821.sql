
DROP POLICY "Service role full access" ON public.api_settings;

-- No public access at all - only service role (which bypasses RLS) can access
CREATE POLICY "No public access" ON public.api_settings
  FOR ALL USING (false) WITH CHECK (false);
