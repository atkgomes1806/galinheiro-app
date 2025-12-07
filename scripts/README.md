# 📜 Scripts e Testes – Galinheiro App

Esta pasta contém scripts utilitários e arquivos de teste rápido (smoke / sandbox) para funcionalidades do projeto. O foco atual está em integrações com Supabase e geolocalização (Open-Meteo + Reverse Geocoding). Conteúdo legado relacionado a backend antigo/Embrapa será removido gradualmente.

## 🗂️ Visão Geral dos Arquivos Atuais

| Arquivo | Tipo | Status | Descrição rápida |
|---------|------|--------|------------------|
| `test-connection.js` | Node | Ativo | Smoke test de leitura nas tabelas Supabase (`galinhas`, `registros_ovos`, `tratamentos`). |
| `test-gps-integration.html` | HTML | Ativo | Sandbox manual para testar geolocalização, reverse geocoding (BigDataCloud) e cache localStorage. |
| `test-backend-only.js` | Node | Legado | Inicializa backend antigo e valida endpoint de clima. Mantido provisoriamente para referência. |
| `start-backend.ps1` | PowerShell | Legado | Script de conveniência para subir backend descontinuado. |
| `README.md` | Markdown | Ativo | Este documento. |

## ✅ Scripts Ativos

### `test-connection.js`
Objetivo: validar rapidamente se a configuração Supabase (chaves / URL) está funcional.
Testes executados:
- Seleção das primeiras 5 galinhas.
- Seleção dos primeiros registros de ovos com join simples.
- Seleção de tratamentos.
Execução:
```powershell
node scripts/test-connection.js
```
Possíveis erros esperados:
- Falha de autenticação (verificar variáveis de ambiente ou arquivo de configuração do cliente).
- Tabelas ausentes (rodar migrações ou criar manualmente).

### `test-gps-integration.html`
Uso: abrir diretamente no navegador (duplo clique) ou servir via Vite para evitar restrições locais.
Funcionalidades validadas:
- Suporte do browser a `navigator.geolocation`.
- Solicitação de coordenadas com alta precisão.
- Reverse geocoding (BigDataCloud API).
- Armazenamento e limpeza de cache em `localStorage`.
Checklist manual:
1. Permitir geolocalização quando solicitado.
2. Confirmar precisão (< 100m desejável em desktop / < 30m em mobile GPS).
3. Verificar endereço retornado (cidade / subdivisão / país).
4. Testar persistência do cache e limpeza.

## 🧩 Conteúdo Legado (Manutenção Temporária)
Os arquivos abaixo referem-se a uma fase anterior com backend custom e integração Embrapa. Planejado para remoção após migração total para fontes abertas (Open-Meteo) e Supabase.

- `test-backend-only.js`: dependente de diretório `backend` que não faz parte da estrutura corrente.
- `start-backend.ps1`: script de inicialização de servidor Node antigo.

Se precisar repetir testes históricos, consulte documentação em `docs/TESTES_CLIMAPI_REAL.md` e `docs/BACKEND_PROXY_IMPLEMENTATION.md`.

## 🚀 Execução Rápida (Windows PowerShell)
```powershell
# Teste Supabase
node scripts/test-connection.js

# Abrir sandbox GPS (opcional via dev server)
npm run dev
# Depois acessar: http://localhost:5173/scripts/test-gps-integration.html (se exposto) ou abrir o arquivo direto.
```

## 🛠️ Boas Práticas ao Adicionar Novos Scripts
- Nome descritivo: `acao-detalhe.js` (ex: `seed-galinhas.js`).
- Evitar credenciais hardcoded: usar variáveis de ambiente ou módulo de configuração.
- Saída clara: usar ícones simples (✅ ❌ ⚠️) para status.
- Idempotência: permitir reexecução sem corromper dados.
- Documentar intenção no topo do arquivo.

## 🔐 Segurança & Dados Sensíveis
- Nunca commitar tokens ou chaves privadas.
- Verificar antes de compartilhar logs: podem conter IDs internos.
- Para reproduções externas, criar scripts de mock em vez de expor tabelas reais.

## 📚 Referências Relacionadas
- `docs/GPS-INTEGRATION.md` – Detalhes do hook e lógica de geolocalização.
- `docs/ICONS-IMPLEMENTATION.md` – PWA e icons.
- `docs/TESTES_CLIMAPI_REAL.md` – Histórico de testes (legado Embrapa).
- `docs/CORS_PROBLEM.md` – Incidentes anteriores e solução (legado).

## 🔮 Próximos Passos Sugeridos
- Script de seed inicial Supabase (`seed-inicial.js`).
- Script de exportação CSV (produção de ovos mensal).
- Script de limpeza de registros de teste (`purge-test-data.js`).
- Automação de verificação de integridade (counts esperados vs reais).

---
Atualizado em: 20/11/2025
Estado: Foco atual em Supabase + GPS. Backend custom descontinuado.
