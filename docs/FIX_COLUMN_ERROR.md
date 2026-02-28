# 🔧 Correção de Erro: "Could not find the 'data_inicio_status' column"

## 📋 Problema Identificado

Ao tentar **editar galinhas**, o sistema retorna erro:
```
Could not find the 'data_inicio_status' column of 'galinhas' in the schema cache
```

## 🔍 Causa

Na **Etapa 1** do plano GALINHAS2.0, implementamos o **Status Reprodutivo** com três novos campos:
- `status_reprodutivo` (laying/broody/molting)
- `data_inicio_status` (data de início do status)
- `notas_status` (observações)

Esses campos foram adicionados:
- ✅ Na entidade `Galinha.js`
- ✅ No formulário `GalinhaForm.jsx`
- ✅ Nos componentes de visualização
- ❌ **Mas NÃO foram criados no banco Supabase**

## ✅ Solução

### Opção 1: Executar script SQL completo (RECOMENDADO)

1. Acesse o [Painel do Supabase](https://supabase.com)
2. Selecione seu projeto `galinheiro-app`
3. Vá em **SQL Editor** no menu lateral
4. Abra o arquivo `docs/SUPABASE_MIGRATION.sql` deste projeto
5. Copie todo o conteúdo
6. Cole no SQL Editor do Supabase
7. Clique em **Run** (ou pressione `Ctrl+Enter`)

### Opção 2: Executar comandos rápidos

Se preferir, cole apenas estes comandos no SQL Editor:

```sql
ALTER TABLE galinhas
ADD COLUMN IF NOT EXISTS status_reprodutivo VARCHAR(20) DEFAULT 'laying',
ADD COLUMN IF NOT EXISTS data_inicio_status DATE,
ADD COLUMN IF NOT EXISTS notas_status TEXT;

UPDATE galinhas
SET status_reprodutivo = 'laying'
WHERE status_reprodutivo IS NULL;
```

## 🧪 Verificação

Após executar a migração, você pode verificar se as colunas foram criadas:

```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'galinhas' 
AND column_name IN ('status_reprodutivo', 'data_inicio_status', 'notas_status');
```

Resultado esperado:
| column_name | data_type | column_default |
|-------------|-----------|----------------|
| status_reprodutivo | character varying | 'laying' |
| data_inicio_status | date | NULL |
| notas_status | text | NULL |

## 📝 O que esta migração faz?

### 1. `status_reprodutivo` (VARCHAR)
- **Valores possíveis**: `laying`, `broody`, `molting`
- **Padrão**: `'laying'` (em postura)
- **Uso**: Rastrear fase reprodutiva atual da galinha

### 2. `data_inicio_status` (DATE)
- **Valor**: Data em que a galinha entrou no status atual
- **Padrão**: `NULL`
- **Uso**: Calcular há quantos dias está em choco/muda

### 3. `notas_status` (TEXT)
- **Valor**: Observações livres sobre o status
- **Padrão**: `NULL`
- **Uso**: Anotar sintomas, comportamentos, tratamentos

## 🎯 Impacto nas funcionalidades

### Dashboard (Etapa 1)
- ✨ Widget de Status Reprodutivo
- 📊 Estatísticas por fase (postura/choco/muda)
- ⚠️ Alertas para galinhas em choco ou muda há muito tempo

### Página de Galinhas (Etapa 2)
- 🔍 Filtro por status reprodutivo
- 🏷️ Badges de status nos cards
- 📝 Formulário de edição com seleção de status

### Formulário de Cadastro/Edição
- 📋 ChickenStatusSelector component
- 📅 Campo de data de início (aparece em broody/molting)
- 📝 Campo de observações

## 🚨 Importante

⚠️ **Execute esta migração ANTES de usar as funcionalidades de edição de galinhas**

Sem essas colunas no banco, você verá erros ao:
- Editar galinha existente
- Cadastrar nova galinha
- Filtrar por status reprodutivo

## 📚 Referências

- Planejamento completo: `docs/GALINHAS2.0.md`
- Script de migração: `docs/SUPABASE_MIGRATION.sql`
- README principal: `README.md` (linha 533)
- Entidade Galinha: `src/domain/entities/Galinha.js`
- Formulário: `src/presentation/components/GalinhaForm.jsx`

---

**Data da correção**: 27 de fevereiro de 2026  
**Versão**: Etapas 1-4 implementadas
