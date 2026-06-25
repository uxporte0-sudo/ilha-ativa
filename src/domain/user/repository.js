import { getOfficialCurrentUser, officialDataSource } from '@/data/officialDataSource';
import { createUser } from '@/domain/user/model';

export const UserRepository = {
  async getCurrent() {
    return createUser(getOfficialCurrentUser());
  },

  async list() {
    const users = await officialDataSource.users.list();
    return users.map(createUser);
  },

  async getById(userId) {
    const user = await officialDataSource.users.get(userId);
    return user ? createUser(user) : null;
  },

  async getByEmail(email) {
    const users = await officialDataSource.users.filter({ email });
    return users.length > 0 ? createUser(users[0]) : null;
  },

  async update(userId, data) {
    const updatedUser = await officialDataSource.users.update(userId, data);
    return updatedUser ? createUser(updatedUser) : null;
  },
};
