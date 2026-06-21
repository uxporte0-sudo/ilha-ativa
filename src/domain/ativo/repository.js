import { officialDataSource } from '@/data/officialDataSource';
import { createAtivo } from '@/domain/ativo/model';

export const AtivoRepository = {
  async list() {
    const ativos = await officialDataSource.ativos.list('-createdAt');
    return ativos.map(createAtivo);
  },

  async getById(ativoId) {
    const ativo = await officialDataSource.ativos.get(ativoId);
    return ativo ? createAtivo(ativo) : null;
  },

  async listByLocal(localId) {
    const ativos = await this.list();
    return ativos.filter((ativo) => ativo.localId === localId);
  },

  async listByPeriod(periodoInicio, periodoFim) {
    const ativos = await this.list();
    const start = new Date(periodoInicio).getTime();
    const end = new Date(periodoFim).getTime();

    return ativos.filter((ativo) => {
      const value = new Date(ativo.dataHoraInicio).getTime();
      return value >= start && value <= end;
    });
  },

  async create(data = {}) {
    const timestamp = new Date().toISOString();
    const ativo = createAtivo({
      ...data,
      createdAt: data.createdAt ?? timestamp,
      updatedAt: data.updatedAt ?? timestamp,
    });
    const createdAtivo = await officialDataSource.ativos.create(ativo);
    return createAtivo(createdAtivo);
  },
};


