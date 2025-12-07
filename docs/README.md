# 📚 Documentação – Galinheiro App

Este diretório centraliza documentos técnicos, históricos e planos de evolução do projeto. Utilize-o como índice para navegação rápida e referência ao contexto das decisões.

## 🗂️ Índice dos Arquivos
| Arquivo | Status | Descrição |
|--------|--------|-----------|
| `GPS-INTEGRATION.md` | Ativo | Arquitetura e fluxo do hook de geolocalização, cache, permissões e reverse geocoding. |
| `ICONS-IMPLEMENTATION.md` | Ativo | Estratégia de favicon/PWA, manifest e recomendações de branding. |
| `VERCEL_SETUP.md` | Ativo | Notas de configuração de deploy na Vercel (build, variáveis). |
| `REFACTORING_PLAN.md` | Ativo | Principais alvos de refatoração e prioridades futuras. |
| `CODE-STUDY.md` | Ativo | Observações gerais sobre organização e padrões do código. |
| `STUDY.md` | Ativo | Links e anotações de pesquisas externas (referências técnicas). |
| `Weather_Forecast_API.md` | Ativo | Levantamento de APIs de clima (comparações, critérios). |
| `CORS_PROBLEM.md` | Legado | Histórico de incidentes CORS e solução anterior. |
| `BACKEND_PROXY_IMPLEMENTATION.md` | Legado | Detalhes do backend proxy descontinuado. |
| `TESTES_CLIMAPI_REAL.md` | Legado | Logs de testes com API ClimAPI (Embrapa) fase anterior. |

Legenda de Status:
- Ativo: Documento reflete estado atual e deve ser mantido.
- Legado: Referência histórica; não atualizar salvo necessidade de auditoria/contexto.

## 🧭 Diretrizes para Novos Documentos
1. Nome descritivo e conciso (`TEMA-DETALHE.md`).
2. Primeiro bloco deve conter: Objetivo, Escopo e Última atualização.
3. Usar seções claras: Contexto, Decisão, Alternativas, Próximos Passos.
4. Evitar duplicação: se conteúdo complementar já existir, linkar ao invés de repetir.
5. Sensibilidade: nunca inserir credenciais ou dados pessoais.

## 🧪 Versões e Histórico
- Alterações relevantes em docs devem ser commitadas com prefixo `docs:` (ex: `docs: adicionar estudo multi-localização`).
- Para grandes mudanças arquiteturais, criar documento separado e linkar no README.

## 🔐 Conteúdos Sensíveis
Se precisar demonstrar exemplos envolvendo chaves, usar placeholders (`SUPABASE_ANON_KEY`, `SUPABASE_URL`).

## 🌱 Próximos Documentos Sugeridos
- `MULTI-LOCATION.md` – Estratégia para múltiplas localizações salvas/selecionáveis.
- `CLIMATE_HISTORY.md` – Persistência e visualização de histórico climático + gráficos.
- `TESTING_GUIDE.md` – Estratégia de testes (unitários, integração, smoke). 
- `DATA_EXPORT.md` – Formatos e limites para exportação (CSV/JSON).
- `ACCESSIBILITY.md` – Boas práticas de acessibilidade na UI.

## 🔄 Manutenção
Revisão trimestral sugerida:
- Remover docs obsoletos.
- Atualizar planos de refatoração.
- Validar se integrações descritas (ex: APIs externas) permanecem ativas.

## 📌 Referências Cruzadas
- Scripts relacionados: ver `scripts/README.md`.
- Decisões de arquitetura: `REFACTORING_PLAN.md`.
- Clima & GPS: `GPS-INTEGRATION.md` + `Weather_Forecast_API.md`.
- PWA & Branding: `ICONS-IMPLEMENTATION.md`.

---
Atualizado em: 20/11/2025
Responsável: Documentação inicial estruturada.
