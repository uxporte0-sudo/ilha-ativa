import { createUser } from '@/domain/user/model';
import {
  getCurrentUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUser as updateDemoUser,
  addUser as addDemoUser,
} from '@/domain/user/demoSession';
import { UserRelationshipsService } from '@/domain/user/relationshipsService';

export const UserRepository = {
  async getCurrent() {
    return getCurrentUser();
  },

  async list() {
    return getUsers();
  },

  async getById(userId) {
    return getUserById(userId);
  },

  async getByEmail(email) {
    return getUserByEmail(email);
  },

  async update(userId, data) {
    return updateDemoUser(userId, data);
  },

  async create(userData) {
    return addDemoUser(userData);
  },

  async ativosCriados(userId) {
    return UserRelationshipsService.ativosCriados(userId);
  },

  async ativosParticipando(userId) {
    return UserRelationshipsService.ativosParticipando(userId);
  },

  async participacoes(userId) {
    return UserRelationshipsService.participacoes(userId);
  },

  async retrospectiva(userId, periodoInicio, periodoFim) {
    return UserRelationshipsService.retrospectiva(userId, periodoInicio, periodoFim);
  },

  async zeladorias(userId) {
    return UserRelationshipsService.zeladorias(userId);
  },

  async amigos(userId) {
    return UserRelationshipsService.amigos(userId);
  },

  async adicionarAmigo(userId, friendId) {
    return UserRelationshipsService.adicionarAmigo(userId, friendId);
  },

  async removerAmigo(userId, friendId) {
    return UserRelationshipsService.removerAmigo(userId, friendId);
  },
};