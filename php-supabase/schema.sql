-- Script de Criação do Banco de Dados no Supabase
-- Execute este script no SQL Editor do seu painel do Supabase (https://supabase.com/dashboard)

-- 1. Criação da tabela de assinaturas
CREATE TABLE IF NOT EXISTS public.signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    site TEXT DEFAULT 'www.avcore.com.br',
    company_name TEXT DEFAULT 'AV CORE',
    company_tagline TEXT DEFAULT 'Soluções em Tecnologia e Interatividade',
    custom_logo_url TEXT
);

-- 2. Habilitação de RLS (Row Level Security)
ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Acesso (Permitir leitura e gravação anônima se usar anon key)
CREATE POLICY "Permitir leitura pública das assinaturas" 
ON public.signatures FOR SELECT 
USING (true);

CREATE POLICY "Permitir inserção de novas assinaturas" 
ON public.signatures FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir atualização de assinaturas" 
ON public.signatures FOR UPDATE 
USING (true);

CREATE POLICY "Permitir exclusão de assinaturas" 
ON public.signatures FOR DELETE 
USING (true);

-- 4. Criação de Bucket de Storage no Supabase (Opcional, para upload de logos)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('signatures', 'signatures', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Permitir upload publico de imagens" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'signatures');

CREATE POLICY "Permitir leitura publica de imagens" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'signatures');
