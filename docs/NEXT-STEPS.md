# 🚀 PRÓXIMOS PASSOS - Roadmap de Desenvolvimento

**Status Atual**: 3/3 Problemas Críticos Corrigidos ✅

---

## 📋 Tarefas Imediatas (Esta Semana)

### 1. Integrar DashboardService em DashboardPage
**Arquivo**: `src/presentation/pages/DashboardPage.jsx`

```javascript
// Remover imports diretos
// ❌ import { obterSumarioGalinheiro } from '...';

// Adicionar import de DashboardService
import { dashboardService } from '../../infrastructure/config';

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const dados = await dashboardService.carregarDadosDashboard({});
      setData(dados);
    };
    load();
  }, []);

  // Usar data.sumario, data.galinhas, data.registros, data.tratamentos
}
```

**Estimativa**: 2-4 horas
**Dependência**: ✅ Já implementado (DashboardService)

---

### 2. Criar Testes para Galinha.js
**Arquivo**: `src/__tests__/domain/entities/Galinha.test.js` (novo)

```javascript
import { describe, it, expect } from 'vitest';
import Galinha from '../../domain/entities/Galinha';

describe('Galinha Entity', () => {
  it('deve criar galinha com valores válidos', () => {
    const galinha = Galinha.criar('Amarelinha', 'Poedeira', new Date());
    expect(galinha.nome).toBe('Amarelinha');
    expect(galinha.isViva()).toBe(true);
  });

  it('deve lançar erro com nome inválido', () => {
    expect(() => {
      new Galinha({ nome: 'A' }); // < 2 caracteres
    }).toThrow();
  });

  it('deve lançar erro com idade inválida', () => {
    expect(() => {
      new Galinha({ nome: 'Test', idade: 20 }); // > 15
    }).toThrow();
  });

  it('deve marcar como morta corretamente', () => {
    const galinha = Galinha.criar('Test', 'Poedeira', new Date());
    galinha.marcarComoMorta();
    expect(galinha.isViva()).toBe(false);
  });

  it('deve envelhecer corretamente', () => {
    const galinha = Galinha.criar('Test', 'Poedeira', new Date());
    const idadeAntes = galinha.idade;
    galinha.envelhecer();
    expect(galinha.idade).toBe(idadeAntes + 1);
  });

  it('deve identificar fase de produção', () => {
    const galinha = new Galinha({
      nome: 'Test',
      idade: 8,
      raca: 'Poedeira',
      statusProducao: 'ativa',
      dataMorte: null
    });
    expect(galinha.isProducao()).toBe(true);
  });

  it('deve verificar se pode receber tratamento', () => {
    const galinha = Galinha.criar('Test', 'Poedeira', new Date());
    expect(galinha.podeReceberTratamento()).toBe(true);

    galinha.marcarQuarentena();
    expect(galinha.podeReceberTratamento()).toBe(false);
  });

  // ... mais testes
});
```

**Estimativa**: 4-6 horas
**Dependência**: Setup Vitest (próximo passo)

---

### 3. Setup de Testes (Vitest)
**Arquivo**: `package.json` + `vitest.config.js` (novos)

```bash
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom
```

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

**Estimativa**: 1-2 horas
**Dependência**: Node.js 16+

---

## 📅 Tarefas Curto Prazo (2-4 Semanas)

### 4. Testes de Use Cases
**Arquivos**: `src/__tests__/application/use-cases/*.test.js` (novos)

```javascript
// Exemplo: listarGalinhas.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { listarGalinhas } from '../../application/use-cases/listarGalinhas';

describe('Use Case: Listar Galinhas', () => {
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      listar: vi.fn()
    };
  });

  it('deve retornar lista de galinhas', async () => {
    const galinhas = [
      { id: 1, nome: 'Amarelinha' },
      { id: 2, nome: 'Marisol' }
    ];

    mockRepository.listar.mockResolvedValue(galinhas);

    const result = await listarGalinhas(mockRepository);

    expect(result).toEqual(galinhas);
    expect(mockRepository.listar).toHaveBeenCalledOnce();
  });

  it('deve propagar erro do repositório', async () => {
    mockRepository.listar.mockRejectedValue(new Error('DB Error'));

    await expect(listarGalinhas(mockRepository)).rejects.toThrow('DB Error');
  });
});
```

**Target**: 10+ use cases testados
**Estimativa**: 1-2 semanas

---

### 5. Testes de Componentes
**Arquivos**: `src/__tests__/presentation/components/*.test.jsx` (novos)

```javascript
// Exemplo: CalendarHeatmap.test.jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CalendarHeatmap from '../../presentation/components/CalendarHeatmap';

describe('CalendarHeatmap Component', () => {
  it('deve renderizar calendário com dias', () => {
    const days = [
      { date: '2025-12-01', label: 1, value: 5, percent: 50, galinhas: [] },
      { date: '2025-12-02', label: 2, value: 6, percent: 60, galinhas: [] }
    ];

    render(<CalendarHeatmap days={days} month={12} year={2025} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('deve aplicar classes de nível corretas', () => {
    const days = [
      { date: '2025-12-01', label: 1, value: 0, percent: 0, galinhas: [] },
      { date: '2025-12-02', label: 2, value: 5, percent: 75, galinhas: [] }
    ];

    const { container } = render(
      <CalendarHeatmap days={days} month={12} year={2025} />
    );

    const cells = container.querySelectorAll('.heatmap-cell');
    expect(cells[0].className).toContain('level-0');
    expect(cells[1].className).toContain('level-3');
  });
});
```

**Target**: 5+ componentes testados
**Estimativa**: 1 semana

---

## 🎯 Tarefas Médio Prazo (4-8 Semanas)

### 6. Testes de Integração
**Arquivos**: `src/__tests__/integration/*.test.js` (novos)

- Testar DashboardPage com dados reais
- Testar fluxos completos (criar galinha → listar → atualizar)
- Testar integração com Supabase

**Target**: 5+ fluxos integrados
**Estimativa**: 2 semanas

---

### 7. Extrair GeocodingService
**Arquivo**: `src/infrastructure/services/GeocodingService.js` (novo)

```javascript
export class GeocodingService {
  static async reverseGeocode(latitude, longitude) {
    const response = await fetch(
      `https://api.bigdatacloud.net/...`
    );
    if (!response.ok) throw new Error('Geocoding failed');
    return response.json();
  }
}
```

**Arquivos Afetados**:
- `src/hooks/useGeolocation.js` (simplificar)

**Estimativa**: 1 dia

---

### 8. CI/CD Pipeline (GitHub Actions)
**Arquivo**: `.github/workflows/test.yml` (novo)

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run build
      - uses: codecov/codecov-action@v3
```

**Estimativa**: 2 horas

---

## 📊 80%+ Code Coverage Target

### Cobertura por Camada

| Camada | Atual | Target | Testes Necessários |
|--------|-------|--------|-------------------|
| Domain | 0% | 90%+ | 15-20 |
| Application | 0% | 85%+ | 20-25 |
| Infrastructure | 0% | 70%+ | 10-15 |
| Presentation | 0% | 60%+ | 15-20 |
| **Total** | **0%** | **80%+** | **60-80** |

---

## 🎓 Recursos de Aprendizado

### Vitest Documentation
- https://vitest.dev/
- https://testing-library.com/react

### Testing Patterns
- Unit Testing (domain + use cases)
- Integration Testing (páginas + componentes)
- E2E Testing (fluxos completos)

### Exemplos no Projeto
- `src/__tests__/` (quando criado)

---

## 🔄 Processo de Desenvolvimento Recomendado

```
1. Crie arquivo de teste
2. Escreva teste que falha (RED)
3. Implemente funcionalidade (GREEN)
4. Refatore código (REFACTOR)
5. Commit com "test: adiciona testes para X"
```

---

## 📈 Progresso Esperado

### Semana 1
- ✅ Integrar DashboardService
- ✅ Setup Vitest
- 🔄 Primeiros 5+ testes de Galinha

### Semana 2-3
- 🔄 Testes de use cases (10+)
- 🔄 Testes de componentes (5+)

### Semana 4
- 🔄 Testes de integração
- 🔄 CI/CD pipeline

### Semana 5-8
- 🔄 Coverage 80%+
- 🔄 Refatorações finais

---

## 🚨 Bloqueadores Atuais

| Issue | Impacto | Status |
|-------|--------|--------|
| Sem testes | CRÍTICO | 🔴 PENDENTE |
| DashboardPage não usa DashboardService | MÉDIO | 🟡 PARCIAL |
| GeocodingService não extraído | BAIXO | 🟢 OK |

---

## ✅ Checklist de Conclusão

- [ ] DashboardPage integrada com DashboardService
- [ ] 60+ testes implementados
- [ ] 80%+ coverage alcançado
- [ ] CI/CD pipeline funcionando
- [ ] GeocodingService extraído
- [ ] Documentação de testes atualizada
- [ ] README atualizado com status de testes

---

## 📞 Contato & Suporte

Para dúvidas sobre a implementação:
1. Consulte `docs/ARCHITECTURE-ANALYSIS.md`
2. Consulte `docs/CORRECTIONS-SUMMARY.md`
3. Revise exemplos de testes neste documento

---

**Data**: 7 de Dezembro de 2025  
**Próxima Atualização**: Quando DashboardService estiver integrado  
**Estimativa Total**: 4-8 semanas para 80%+ coverage
