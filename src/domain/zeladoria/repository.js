import { officialDataSource } from '@/data/officialDataSource';
import { createZeladoria } from '@/domain/zeladoria/model';

export const ZeladoriaRepository = {
  async list() {
    const zeladorias = await officialDataSource.zeladorias.list('-createdAt');
    return zeladorias.map(createZeladoria);
  },

  async getById(zeladoriaId) {
    const zeladoria = await officialDataSource.zeladorias.get(zeladoriaId);
    return zeladoria ? createZeladoria(zeladoria) : null;
  },

  async listByLocal(localId) {
    const zeladorias = await this.list();
    return zeladorias.filter((zeladoria) => zeladoria.localId === localId);
  },

  async create(data) {
    const zeladoria = createZeladoria({ ...data, status: data.status ?? 'aberto' });
    const createdZeladoria = await officialDataSource.zeladorias.create(zeladoria);
    return createZeladoria(createdZeladoria);
  },
};
