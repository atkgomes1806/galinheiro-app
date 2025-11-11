# 🛰️ Integração GPS - Galinheiro App

## Visão Geral

O Galinheiro App agora possui funcionalidade completa de geolocalização GPS, permitindo aos usuários obter dados climáticos específicos para sua localização atual.

## 🎯 Características Implementadas

### 1. Hook useGeolocation
- **Localização**: `src/hooks/useGeolocation.js`
- **Funcionalidades**:
  - ✅ Solicitação de permissão GPS
  - ✅ Cache inteligente (24 horas de validade)
  - ✅ Reverse geocoding para nomes de localização
  - ✅ Tratamento de erros e timeout
  - ✅ Estados de carregamento e permissões

### 2. Serviços Aprimorados
- **OpenMeteoWeatherService**: Suporte para coordenadas dinâmicas
- **obterDadosClima**: Nova função `obterDadosClimaPorGPS()`

### 3. Interface do Usuário
- **WeatherCard**: Botão GPS integrado no header
- **Estados visuais**: Indicadores de GPS ativo/inativo
- **Feedback do usuário**: Mensagens de erro e carregamento

## 📱 Como Usar

### Para Usuários
1. **Ativar GPS**: Clique no ícone 📍 no card de clima
2. **Permitir localização**: Aceite a solicitação do browser
3. **Dados atualizados**: O clima será atualizado com sua localização
4. **Desativar**: Clique novamente no 📍 para voltar à localização padrão

### Para Desenvolvedores

#### Usando o Hook
```javascript
import { useGeolocation } from './hooks/useGeolocation';

const MyComponent = () => {
    const {
        coordinates,       // { latitude, longitude }
        locationName,     // Nome da localização
        loading,          // Estado de carregamento
        error,           // Mensagens de erro
        hasPermission,   // Permissão concedida
        isLocationCached, // Localização em cache
        requestLocation, // Função para solicitar GPS
        clearLocation   // Função para limpar localização
    } = useGeolocation();
    
    // Usar os dados...
};
```

#### Obtendo Dados Climáticos com GPS
```javascript
import { obterDadosClimaPorGPS } from './application/use-cases/obterDadosClima';

// Com coordenadas específicas
const dadosClima = await obterDadosClimaPorGPS(-23.5505, -46.6333);

// Ou usando o hook
const { coordinates } = useGeolocation();
if (coordinates) {
    const dadosClima = await obterDadosClimaPorGPS(
        coordinates.latitude, 
        coordinates.longitude
    );
}
```

## 🔧 Configurações Técnicas

### Parâmetros de Geolocalização
```javascript
const GPS_OPTIONS = {
    enableHighAccuracy: true,  // Maior precisão
    timeout: 10000,           // 10 segundos de timeout
    maximumAge: 300000        // 5 minutos de cache
};
```

### Cache Local
- **Chave de localização**: `galinheiro_user_location`
- **Chave de permissão**: `galinheiro_location_permission`
- **Validade**: 24 horas
- **Dados salvos**: Coordenadas, timestamp, permissões

### APIs Externas
- **Open-Meteo**: Dados climáticos baseados em coordenadas
- **BigDataCloud**: Reverse geocoding para nomes de localização

## 🛡️ Tratamento de Erros

### Tipos de Erro GPS
1. **PERMISSION_DENIED**: Usuário negou permissão
2. **POSITION_UNAVAILABLE**: GPS indisponível
3. **TIMEOUT**: Timeout na solicitação
4. **NETWORK_ERROR**: Erro de rede

### Fallbacks Implementados
- ❌ GPS falhou → Usar localização padrão
- ❌ Reverse geocoding falhou → Mostrar coordenadas
- ❌ Cache inválido → Nova solicitação GPS

## 📊 Estados da Interface

### Indicadores Visuais
- 📍 **Cinza**: GPS inativo (localização padrão)
- 📍 **Verde**: GPS ativo e funcionando
- 📍 **Piscando**: Carregando localização
- ❌ **Vermelho**: Erro na localização

### Mensagens de Feedback
- `"📍 Obtendo localização..."` - Carregando GPS
- `"🌦️ Carregando clima..."` - Atualizando dados climáticos
- `"📍 GPS desabilitado, voltou para localização padrão"` - GPS desativado
- Mensagens de erro específicas para cada tipo de falha

## 🧪 Testes

### Arquivo de Teste
- **Local**: `test-gps-integration.html`
- **Funcionalidade**: Teste completo de GPS sem dependências
- **Verificações**: Suporte do browser, localização, geocoding, cache

### Cenários de Teste
1. ✅ Browser suporta geolocalização
2. ✅ Usuário concede permissão
3. ✅ Usuário nega permissão
4. ✅ Timeout na solicitação
5. ✅ Erro de rede
6. ✅ Cache funcionando
7. ✅ Fallback para localização padrão

## 🔄 Fluxo de Funcionamento

### Primeira Utilização
1. Usuário clica no botão GPS 📍
2. Sistema solicita permissão do browser
3. Se autorizado, obtém coordenadas GPS
4. Faz reverse geocoding para nome da localização
5. Salva no cache por 24 horas
6. Atualiza dados climáticos para a nova localização
7. Atualiza interface com indicadores GPS

### Utilizações Subsequentes
1. Verifica cache ao carregar página
2. Se cache válido e permissão concedida, usa GPS automaticamente
3. Se cache expirado, solicita nova localização
4. Mantém preferência do usuário

### Desativação
1. Usuário clica novamente no botão GPS
2. Sistema limpa dados de localização
3. Volta para localização padrão
4. Atualiza dados climáticos
5. Remove indicadores GPS

## 📚 Dependências

### Hooks React
- `useState` - Estados do componente
- `useEffect` - Efeitos colaterais
- `useCallback` - Memoização de funções

### APIs Web
- `navigator.geolocation` - Geolocalização do browser
- `localStorage` - Cache local
- `fetch` - Requisições HTTP

### Serviços Externos
- **Open-Meteo API**: Dados meteorológicos
- **BigDataCloud API**: Reverse geocoding

## 🚀 Futuras Melhorias

### Recursos Planejados
- [ ] Histórico de localizações usadas
- [ ] Múltiplas localizações salvas
- [ ] Comparação de clima entre localizações
- [ ] Notificações baseadas em localização
- [ ] Integração com mapas
- [ ] Precisão de localização configurável

### Otimizações
- [ ] Redução de chamadas à API
- [ ] Cache mais inteligente
- [ ] Previsão offline
- [ ] Compressão de dados

## 🔗 Arquivos Relacionados

### Core
- `src/hooks/useGeolocation.js` - Hook principal
- `src/infrastructure/openmeteo/OpenMeteoWeatherService.js` - Serviço climático
- `src/application/use-cases/obterDadosClima.js` - Casos de uso

### Interface
- `src/presentation/components/WeatherCard.jsx` - Card de clima
- `src/styles/components.css` - Estilos GPS

### Testes
- `test-gps-integration.html` - Teste standalone