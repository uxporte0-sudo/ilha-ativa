const emptyEntity = {
  list: async () => [],
  filter: async () => [],
  get: async () => null,
  create: async (data = {}) => ({
    id: `local-${Date.now()}`,
    created_date: new Date().toISOString(),
    ...data,
  }),
  update: async (id, data = {}) => ({
    id,
    updated_date: new Date().toISOString(),
    ...data,
  }),
  delete: async (id) => ({ id }),
};

export const db = {
  auth: {
    isAuthenticated: async () => true,
    me: async () => ({
      id: 'local-ui-user',
      full_name: 'Usuario Local',
      email: 'local@example.com',
      role: 'admin',
    }),
    logout: () => {},
    redirectToLogin: () => {},
  },
  entities: new Proxy({}, { get: () => emptyEntity }),
  integrations: {
    Core: {
      UploadFile: async ({ file } = {}) => ({
        file_url: file ? URL.createObjectURL(file) : '',
      }),
    },
  },
};

export const base44 = db;
export default db;
