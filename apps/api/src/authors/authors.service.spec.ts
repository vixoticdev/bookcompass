import { normalizeCatalogPagination } from '../catalog/catalog-query';
import { AuthorsService, buildAuthorFilters } from './authors.service';

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

describe('AuthorsService catalog mutations', () => {
  const authorModel = {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };
  let service: AuthorsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthorsService(authorModel as never);
  });

  it('finds a single author by id and rejects missing ids', async () => {
    const exec = jest.fn().mockResolvedValueOnce({ _id: 'author-1' });
    authorModel.findById.mockReturnValueOnce({ exec });

    await expect(service.findById('author-1')).resolves.toEqual({
      _id: 'author-1',
    });
    expect(authorModel.findById.mock.calls[0]).toEqual(['author-1']);

    authorModel.findById.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    });
    await expect(service.findById('missing-author')).rejects.toThrow(
      'Author not found.',
    );
  });

  it('updates authors with validators and returns the updated record', async () => {
    const updatedAuthor = { _id: 'author-1', name: 'Updated Author' };
    const exec = jest.fn().mockResolvedValue(updatedAuthor);
    authorModel.findByIdAndUpdate.mockReturnValue({ exec });

    await expect(
      service.updateById('author-1', { name: 'Updated Author' }),
    ).resolves.toBe(updatedAuthor);
    expect(authorModel.findByIdAndUpdate.mock.calls[0]).toEqual([
      'author-1',
      { $set: { name: 'Updated Author' } },
      { new: true, runValidators: true },
    ]);
  });

  it('rejects updates and deletes for missing authors', async () => {
    authorModel.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    await expect(service.updateById('missing-author', {})).rejects.toThrow(
      'Author not found.',
    );

    authorModel.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    await expect(service.deleteById('missing-author')).rejects.toThrow(
      'Author not found.',
    );
  });

  it('deletes authors by id', async () => {
    const deletedAuthor = { _id: 'author-1', name: 'Deleted Author' };
    const exec = jest.fn().mockResolvedValue(deletedAuthor);
    authorModel.findByIdAndDelete.mockReturnValue({ exec });

    await expect(service.deleteById('author-1')).resolves.toBe(deletedAuthor);
    expect(authorModel.findByIdAndDelete.mock.calls[0]).toEqual(['author-1']);
  });
});
