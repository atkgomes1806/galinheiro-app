import { DashboardService } from '../../application/services/DashboardService';
import { galinhaRepository } from './galinhaInjector';
import { registroOvoRepository } from './registroOvoInjector';
import { tratamentoRepository } from './tratamentoInjector';

// Exporta repositórios
export { galinhaRepository } from './galinhaInjector';
export { registroOvoRepository } from './registroOvoInjector';
export { tratamentoRepository } from './tratamentoInjector';

// Factory para criar DashboardService com dependências injetadas
export const dashboardService = new DashboardService(
  galinhaRepository,
  registroOvoRepository,
  tratamentoRepository
);

// Factory para criar nova instância se necessário
export function createDashboardService() {
  return new DashboardService(
    galinhaRepository,
    registroOvoRepository,
    tratamentoRepository
  );
}
