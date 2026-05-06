import databaseSeed from '@/data/database.json';

const entityCollections = {
  User: 'users',
  Atividade: 'atividades',
  Court: 'courts',
  Booking: 'bookings',
  RepairRequest: 'repairRequests',
};

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function createInitialDatabase() {
  return clone(databaseSeed);
}

let currentDatabase = createInitialDatabase();

function readDatabase() {
  return currentDatabase;
}

function writeDatabase(database) {
  currentDatabase = database;
}

function sortRecords(records, sortBy) {
  if (!sortBy) return records;

  const desc = sortBy.startsWith('-');
  const field = desc ? sortBy.slice(1) : sortBy;

  return [...records].sort((a, b) => {
    const left = a[field] ?? '';
    const right = b[field] ?? '';

    if (left === right) return 0;
    return (left > right ? 1 : -1) * (desc ? -1 : 1);
  });
}

function createEntityApi(collectionName) {
  return {
    async list(sortBy, limit) {
      const database = readDatabase();
      const records = sortRecords(database[collectionName] ?? [], sortBy);

      return clone(typeof limit === 'number' ? records.slice(0, limit) : records);
    },

    async filter(filters = {}) {
      const database = readDatabase();
      const records = database[collectionName] ?? [];

      return clone(
        records.filter((record) =>
          Object.entries(filters).every(([key, value]) => record[key] === value)
        )
      );
    },

    async get(id) {
      const database = readDatabase();
      const record = (database[collectionName] ?? []).find((item) => item.id === id);

      return record ? clone(record) : null;
    },

    async create(data = {}) {
      const database = readDatabase();
      const record = {
        id: `${collectionName}-${Date.now()}`,
        created_date: new Date().toISOString(),
        ...data,
      };

      database[collectionName] = [record, ...(database[collectionName] ?? [])];
      writeDatabase(database);

      return clone(record);
    },

    async update(id, data = {}) {
      const database = readDatabase();
      const records = database[collectionName] ?? [];
      const updatedRecord = {
        ...records.find((record) => record.id === id),
        ...data,
        id,
        updated_date: new Date().toISOString(),
      };

      database[collectionName] = records.map((record) =>
        record.id === id ? updatedRecord : record
      );
      writeDatabase(database);

      return clone(updatedRecord);
    },

    async delete(id) {
      const database = readDatabase();

      database[collectionName] = (database[collectionName] ?? []).filter(
        (record) => record.id !== id
      );
      writeDatabase(database);

      return { id };
    },
  };
}

export function getCurrentUser() {
  const database = readDatabase();
  return clone(database.users[0]);
}

export function resetPseudoDatabase() {
  const initialDatabase = createInitialDatabase();
  writeDatabase(initialDatabase);
  return clone(initialDatabase);
}

export const pseudoDb = {
  entities: new Proxy(
    {},
    {
      get: (_target, entityName) => {
        const collectionName = entityCollections[entityName];

        if (!collectionName) {
          return createEntityApi(String(entityName));
        }

        return createEntityApi(collectionName);
      },
    }
  ),
};
