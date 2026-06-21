import { officialDataSource } from '@/data/officialDataSource';
import { createRetrospectiva } from '@/domain/retrospectiva/model';
import { RetrospectivaService } from '@/domain/retrospectiva/service';

export const RetrospectivaRepository = {
  async getByUserAndPeriod(userId, periodoInicio, periodoFim) {
    const retrospectivas = await officialDataSource.retrospectivas.filter({
      userId,
      periodoInicio,
      periodoFim,
    });

    if (retrospectivas[0]) return createRetrospectiva(retrospectivas[0]);

    return RetrospectivaService.calculateForUser(userId, periodoInicio, periodoFim);
  },

  async listByUser(userId) {
    const retrospectivas = await officialDataSource.retrospectivas.filter({ userId });
    return retrospectivas.map(createRetrospectiva);
  },

  async create(data) {
    const retrospectiva = createRetrospectiva(data);
    const createdRetrospectiva = await officialDataSource.retrospectivas.create(retrospectiva);
    return createRetrospectiva(createdRetrospectiva);
  },

  createEmpty(userId, periodoInicio, periodoFim) {
    return createRetrospectiva({
      id: `retrospectiva-${userId}-${periodoInicio}-${periodoFim}`,
      userId,
      periodoInicio,
      periodoFim,
    });
  },
};
