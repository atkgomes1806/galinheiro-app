# 📜 Scripts e Testes - Galinheiro App

Esta pasta contém scripts auxiliares e arquivos de teste para o projeto Galinheiro App.

## 🧪 Arquivos de Teste

### `test-connection.js`
**Objetivo**: Teste de conectividade básica do projeto
- Verifica se o backend responde corretamente
- Testa endpoints básicos da aplicação
- Valida conexão entre frontend e backend
- **Uso**: `node scripts/test-connection.js`

### `test-embrapa-api.js`
**Objetivo**: Teste comparativo OAuth 2.0 vs Bearer Token
- Testa autenticação OAuth 2.0
- Testa token Bearer direto
- Compara performance e confiabilidade
- **Uso**: `node scripts/test-embrapa-api.js`

### `test-fallback-strategy.js` 🆕
**Objetivo**: Teste da estratégia de fallback Bearer → OAuth
- Simula Bearer Token válido e inválido
- Demonstra fallback automático para OAuth
- Testa endpoint do backend com fallback
- **Uso**: `node scripts/test-fallback-strategy.js`

### `test-real-api.js` 
**Objetivo**: Teste completo da API usando token Bearer real
- Testa health check da API
- Lista todas as variáveis disponíveis
- Obtém dados reais de temperatura e umidade de São Paulo
- Demonstra que a API funciona 100% com token Bearer
- **Uso**: `node scripts/test-real-api.js`

## 🔧 Scripts de Automação

### `start-backend.ps1`
**Objetivo**: Script PowerShell para iniciar o backend facilmente
- Navega automaticamente para o diretório do backend
- Verifica se as dependências estão instaladas
- Valida arquivo .env
- Inicia o servidor backend na porta 3002
- **Uso**: `PowerShell -ExecutionPolicy Bypass -File "scripts/start-backend.ps1"`

## 🚀 Como Usar

### 1. Testar Conectividade Básica
```bash
cd C:\Projetos\galinheiro-app\galinheiro-app
node scripts/test-connection.js
```

### 2. Testar Estratégia de Fallback (recomendado) 🆕
```bash
cd C:\Projetos\galinheiro-app\galinheiro-app
node scripts/test-fallback-strategy.js
```

### 3. Testar Comparativo OAuth vs Bearer
```bash
cd C:\Projetos\galinheiro-app\galinheiro-app
node scripts/test-embrapa-api.js
```

### 4. Testar API Real (Token Bearer)  
```bash
cd C:\Projetos\galinheiro-app\galinheiro-app
node scripts/test-real-api.js
```

### 3. Iniciar Backend
```powershell
cd C:\Projetos\galinheiro-app\galinheiro-app
PowerShell -ExecutionPolicy Bypass -File "scripts/start-backend.ps1"
```

### 4. Iniciar Frontend (separadamente)
```bash
cd C:\Projetos\galinheiro-app\galinheiro-app
npm run dev
```

## 📋 Resultados Esperados

### ✅ API Real Funcionando
- **Temperature**: Status 200 ✅ (14.6°C de São Paulo)
- **Humidity**: Status 200 ✅ (87% de São Paulo)  
- **Health Check**: Status 204 ✅
- **Variables**: Status 200 ✅ (19 variáveis disponíveis)

### 🎯 Dashboard Operacional
- Card de clima mostrando dados reais da Embrapa
- Atualização automática a cada 30 minutos
- Avaliação das condições para o galinheiro
- Fallback para dados simulados se API falhar

## 🔑 Credenciais

### Token Bearer (Funciona)
```
724ecc90-70b1-36c1-b573-c5b01d6173ea
```

### OAuth 2.0 (Limitado)
- **Consumer Key**: `Gu1cl2cXpRt8mPwOw0IjntwrnZsa`
- **Consumer Secret**: `4kVqfR7tip5lm2rPKfKuj3gofFoa`
- **Status**: Autentica OK, mas dados retornam 403 Forbidden

## 📚 Documentação Relacionada

- `docs/TESTES_CLIMAPI_REAL.md` - Log completo de todos os testes realizados
- `docs/BACKEND_PROXY_IMPLEMENTATION.md` - Implementação do backend proxy
- `docs/CORS_PROBLEM.md` - Resolução de problemas de CORS

---

*Scripts criados e testados em 9 de novembro de 2025*
*API ClimAPI da Embrapa - Dados climáticos reais para agricultura*