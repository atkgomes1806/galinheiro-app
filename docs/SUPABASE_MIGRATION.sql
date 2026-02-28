-- ============================================
-- MIGRAÇÃO SUPABASE - GALINHEIRO APP
-- Data: 27 de fevereiro de 2026
-- ============================================
-- 
-- Este arquivo contém todas as alterações necessárias
-- no banco de dados Supabase para suportar as novas
-- funcionalidades implementadas nas Etapas 1-4.
--
-- INSTRUÇÕES:
-- 1. Acesse o painel do Supabase (https://supabase.com)
-- 2. Vá em SQL Editor
-- 3. Copie e cole este script completo
-- 4. Execute clicando em "Run"
--
-- ============================================

-- ETAPA 1: STATUS REPRODUTIVO
-- Adiciona colunas para rastreamento de status reprodutivo das galinhas
-- (em postura, em choco, em muda)
-- ============================================

ALTER TABLE galinhas
ADD COLUMN IF NOT EXISTS status_reprodutivo VARCHAR(20) DEFAULT 'laying',
ADD COLUMN IF NOT EXISTS data_inicio_status DATE,
ADD COLUMN IF NOT EXISTS notas_status TEXT;

-- Garante que galinhas existentes tenham valor padrão
UPDATE galinhas
SET status_reprodutivo = 'laying'
WHERE status_reprodutivo IS NULL;

-- ============================================
-- COMENTÁRIOS DAS COLUNAS (DOCUMENTAÇÃO)
-- ============================================

COMMENT ON COLUMN galinhas.status_reprodutivo IS 'Status reprodutivo atual: laying (postura), broody (choco), molting (muda)';
COMMENT ON COLUMN galinhas.data_inicio_status IS 'Data de início do status reprodutivo atual';
COMMENT ON COLUMN galinhas.notas_status IS 'Observações sobre o status reprodutivo (sintomas, comportamentos, etc)';

-- ============================================
-- VERIFICAÇÃO (OPCIONAL)
-- Execute após a migração para confirmar que as colunas existem
-- ============================================

-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'galinhas' 
-- AND column_name IN ('status_reprodutivo', 'data_inicio_status', 'notas_status');

-- ============================================
-- FIM DA MIGRAÇÃO
-- ============================================
