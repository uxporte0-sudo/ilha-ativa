import { officialDataSource } from '@/data/officialDataSource';
import { createLocal } from '@/domain/local/model';

export const LocalRepository = {
  async list() {
    const locais = await officialDataSource.locais.list();
    return locais.map(createLocal);
  },

  async getById(localId) {
    const local = await officialDataSource.locais.get(localId);
    return local ? createLocal(local) : null;
  },

  async search({ termo = '', categoria } = {}) {
    const locais = await this.list();
    const normalizedTerm = termo.trim().toLowerCase();

    return locais.filter((local) => {
      const matchesTerm =
        !normalizedTerm ||
        local.nome.toLowerCase().includes(normalizedTerm) ||
        local.endereco?.toLowerCase().includes(normalizedTerm) ||
        local.bairro?.toLowerCase().includes(normalizedTerm);
      const matchesCategoria = !categoria || local.categoria === categoria;

      return matchesTerm && matchesCategoria;
    });
  },

  async listTrending(limit = 5) {
    const locais = await this.list();
    return locais.slice(0, limit);
  },

  async create(data) {
    const local = createLocal(data);
    const createdLocal = await officialDataSource.locais.create(local);
    return createLocal(createdLocal);
  },
};
