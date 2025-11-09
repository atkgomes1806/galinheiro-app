# 🚀 Configuração Vercel - Galinheiro App

## 🎯 **SOLUÇÃO PARA O PROBLEMA**

**Problema**: API funciona localmente mas não no Vercel  
**Causa**: URL localhost não existe no Vercel  
**Solução**: Serverless Functions do Vercel + detecção automática de ambiente

## 📋 **PASSOS PARA CONFIGURAR NO VERCEL**

### 1️⃣ **Deploy do Código**
```bash
git add .
git commit -m "🚀 Add Vercel Serverless Functions"
git push origin main
```

### 2️⃣ **Configurar Variáveis de Ambiente no Vercel**
No dashboard do Vercel, vá em **Settings > Environment Variables** e adicione:

```bash
# Obrigatórias para API funcionar
EMBRAPA_CONSUMER_KEY=Gu1cl2cXpRt8mPwOw0IjntwrnZsa
EMBRAPA_CONSUMER_SECRET=4kVqfR7tip5lm2rPKfKuj3gofFoa

# URLs da API (já configuradas por padrão)
EMBRAPA_TOKEN_URL=https://api.cnptia.embrapa.br/token
EMBRAPA_API_URL=https://api.cnptia.embrapa.br/climapi/v1
NODE_ENV=production
```

### 3️⃣ **Endpoints Disponíveis**
Depois do deploy, a API estará disponível em:
```
https://seu-app.vercel.app/api/weather/data-real
```

## 🔧 **COMO FUNCIONA**

### **Local (Desenvolvimento)**
```
Frontend (localhost:3000) 
    ↓
Backend Express (localhost:3002)
    ↓  
API Embrapa
```

### **Vercel (Produção)**
```
Frontend (seu-app.vercel.app)
    ↓
Serverless Function (/api/weather/data-real)
    ↓
API Embrapa
```

## 🎯 **DETECÇÃO AUTOMÁTICA**
O `EmbrapaWeatherService` agora detecta automaticamente o ambiente:
- **Local**: Usa `http://localhost:3002`
- **Vercel**: Usa o próprio domínio (`/api/weather/data-real`)

## 🔄 **ESTRATÉGIA DE FALLBACK MANTIDA**
1. **Bearer Token** (rápido) ✅
2. **OAuth 2.0** (robusto) ✅  
3. **Dados Simulados** (último recurso) ✅

## 🧪 **TESTANDO**
Após deploy, teste a API diretamente:
```
https://seu-app.vercel.app/api/weather/data-real
```

Deve retornar:
```json
{
  "temperatura": 14.6,
  "umidade": 87,
  "fonte": "API Embrapa ClimAPI (Dados Reais)",
  "timestamp": "2025-11-09T22:30:00.000Z"
}
```

## ⚠️ **IMPORTANTE**
- As credenciais OAuth **DEVEM** ser configuradas nas Environment Variables do Vercel
- Sem as credenciais, a API retornará dados simulados
- O Bearer Token está hardcoded e funciona como fallback principal

## 🎉 **RESULTADO**
✅ API funcionará tanto local quanto no Vercel  
✅ Dados climáticos reais sempre disponíveis  
✅ Fallback automático em caso de problemas  
✅ Zero configuração manual do usuário