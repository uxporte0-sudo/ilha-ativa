import { ZeladoriaFactory, ZeladoriaStatus } from "../domain/zeladoria/Zeladoria";
import { LocalService } from "./LocalService";
import { SessionService } from "./SessionService";
import { v4 as uuidv4 } from "uuid";

const zeladoriasDb = []; // Simula um banco de dados temporário

export const ZeladoriaService = {
  list: () => {
    return Promise.resolve(zeladoriasDb);
  },

  getById: (id) => {
    const zeladoria = zeladoriasDb.find((z) => z.id === id);
    return Promise.resolve(zeladoria || null);
  },

  listByLocal: (localId) => {
    const zeladorias = zeladoriasDb.filter((z) => z.localId === localId);
    return Promise.resolve(zeladorias);
  },

  create: async (zeladoriaData) => {
    const currentUser = await SessionService.getCurrentUser();
    if (!currentUser) {
      throw new Error("Usuário não autenticado.");
    }

    // Validação do localId, se existir
    if (zeladoriaData.localId) {
      const local = await LocalService.getById(zeladoriaData.localId);
      if (!local) {
        throw new Error("Local especificado não encontrado.");
      }
    }

    const newZeladoria = ZeladoriaFactory({
      ...zeladoriaData,
      id: uuidv4(),
      usuarioId: currentUser.id,
      dataCriacao: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: ZeladoriaStatus.ABERTO,
    });

    zeladoriasDb.push(newZeladoria);
    return Promise.resolve(newZeladoria);
  },

  updateStatus: async (id, newStatus) => {
    const zeladoriaIndex = zeladoriasDb.findIndex((z) => z.id === id);
    if (zeladoriaIndex === -1) {
      throw new Error("Zeladoria não encontrada.");
    }

    const zeladoria = zeladoriasDb[zeladoriaIndex];
    const updatedZeladoria = {
      ...zeladoria,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      ...(newStatus === ZeladoriaStatus.RESOLVIDO && {
        dataResolucao: new Date().toISOString(),
      }),
    };

    zeladoriasDb[zeladoriaIndex] = updatedZeladoria;
    return Promise.resolve(updatedZeladoria);
  },
};
