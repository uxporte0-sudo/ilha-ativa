import { getCurrentUser, pseudoDb } from '@/lib/pseudoDb';

export const db = {
  auth: {
    isAuthenticated: async () => true,
    me: async () => getCurrentUser(),
    logout: () => {},
    redirectToLogin: () => {},
  },
  entities: pseudoDb.entities,
  integrations: {
    Core: {
      UploadFile: async ({ file } = {}) => ({
        file_url: file ? URL.createObjectURL(file) : '',
      }),
    },
  },
};

export default db;
