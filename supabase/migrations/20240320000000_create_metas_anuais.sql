-- Create metas_anuais table
CREATE TABLE IF NOT EXISTS metas_anuais (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ano INTEGER NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(ano)
);

-- Create RLS policies
ALTER TABLE metas_anuais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver metas anuais"
  ON metas_anuais FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir metas anuais"
  ON metas_anuais FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar metas anuais"
  ON metas_anuais FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar metas anuais"
  ON metas_anuais FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at
CREATE TRIGGER update_metas_anuais_updated_at
  BEFORE UPDATE ON metas_anuais
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 