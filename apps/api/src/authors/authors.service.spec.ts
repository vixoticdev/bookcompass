import { normalizeCatalogPagination } from '../catalog/catalog-query';
import { buildAuthorFilters } from './authors.service';

describe('buildAuthorFilters', () => {
  it('builds validated catalog filters for author list queries', () => {
    expect(
      buildAuthorFilters({
        q: 'Cal',
        genre: 'Productivity',
        outcome: 'discipline',
      }),
    ).toEqual({
      name: { $regex: 'Cal', $options: 'i' },
      knownForGenres: 'Productivity',
      outcomeStrengths: 'discipline',
    });
  });

  it('escapes search text before creating a regex filter', () => {
    expect(buildAuthorFilters({ q: 'A.B*' })).toEqual({
      name: { $regex: 'A\\.B\\*', $options: 'i' },
    });
  });
});

describe('normalizeCatalogPagination', () => {
  it('defaults and clamps list pagination', () => {
    expect(normalizeCatalogPagination({})).toEqual({ limit: 25, offset: 0 });
    expect(normalizeCatalogPagination({ limit: 500, offset: -10 })).toEqual({
      limit: 100,
      offset: 0,
    });
  });
});
