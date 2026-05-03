export type CatalogPage<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};

export type CatalogPaginationQuery = {
  limit?: number;
  offset?: number;
};

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

export function normalizeCatalogPagination(query: CatalogPaginationQuery) {
  const limit = Math.min(Math.max(query.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
  const offset = Math.max(query.offset ?? 0, 0);

  return { limit, offset };
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
