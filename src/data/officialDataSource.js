import { officialSeeds } from '@/data/officialSeeds';

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function createInitialData() {
  return clone(officialSeeds);
}

let currentData = createInitialData();

function sortRecords(records, sortBy) {
  if (!sortBy) return records;

  const desc = sortBy.startsWith('-');
  const field = desc ? sortBy.slice(1) : sortBy;

  return [...records].sort((left, right) => {
    const leftValue = left[field] ?? '';
    const rightValue = right[field] ?? '';

    if (leftValue === rightValue) return 0;
    return (leftValue > rightValue ? 1 : -1) * (desc ? -1 : 1);
  });
}

function createId(collectionName) {
  return `${collectionName}-${Date.now()}`;
}

function nowIso() {
  return new Date().toISOString();
}

function createCollectionApi(collectionName) {
  return {
    async list(sortBy, limit) {
      const records = sortRecords(currentData[collectionName] ?? [], sortBy);
      return clone(typeof limit === 'number' ? records.slice(0, limit) : records);
    },

    async filter(filters = {}) {
      const records = currentData[collectionName] ?? [];

      return clone(
        records.filter((record) =>
          Object.entries(filters).every(([key, value]) => record[key] === value)
        )
      );
    },

    async get(id) {
      const record = (currentData[collectionName] ?? []).find((item) => item.id === id);
      return record ? clone(record) : null;
    },

    async create(data = {}) {
      const timestamp = nowIso();
      const record = {
        ...data,
        id: data.id ?? createId(collectionName),
        createdAt: data.createdAt ?? timestamp,
        updatedAt: data.updatedAt ?? timestamp,
      };

      currentData = {
        ...currentData,
        [collectionName]: [record, ...(currentData[collectionName] ?? [])],
      };

      return clone(record);
    },

    async update(id, data = {}) {
      const records = currentData[collectionName] ?? [];
      const existing = records.find((record) => record.id === id);
      if (!existing) return null;

      const updatedRecord = {
        ...existing,
        ...data,
        id,
        updatedAt: data.updatedAt ?? nowIso(),
      };

      currentData = {
        ...currentData,
        [collectionName]: records.map((record) => (record.id === id ? updatedRecord : record)),
      };

      return clone(updatedRecord);
    },

    async delete(id) {
      currentData = {
        ...currentData,
        [collectionName]: (currentData[collectionName] ?? []).filter((record) => record.id !== id),
      };

      return { id };
    },
  };
}

export function getOfficialCurrentUser() {
  return clone(currentData.users[0]);
}

export function resetOfficialDataSource() {
  currentData = createInitialData();
  return clone(currentData);
}

export const officialDataSource = {
  users: createCollectionApi('users'),
  ativos: createCollectionApi('ativos'),
  participacoes: createCollectionApi('participacoes'),
  locais: createCollectionApi('locais'),
  zeladorias: createCollectionApi('zeladorias'),
  retrospectivas: createCollectionApi('retrospectivas'),
};
