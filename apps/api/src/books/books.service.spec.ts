import { BooksService, buildBookFilters } from './books.service';

describe('buildBookFilters', () => {
  it('builds validated catalog filters for book list queries', () => {
    expect(
      buildBookFilters({
        q: 'Deep Work',
        authorId: '507f1f77bcf86cd799439011',
        genre: 'Productivity',
        outcome: 'productivity',
        pacing: 'moderate',
        difficulty: 'moderate',
        depth: 'deep',
        format: 'ebook',
        maxEstimatedMinutes: 420,
      }),
    ).toEqual({
      title: { $regex: 'Deep Work', $options: 'i' },
      authorId: '507f1f77bcf86cd799439011',
      genres: 'Productivity',
      outcomeTags: 'productivity',
      pacing: 'moderate',
      difficulty: 'moderate',
      depth: 'deep',
      formats: 'ebook',
      estimatedMinutes: { $lte: 420 },
    });
  });

  it('escapes search text before creating a regex filter', () => {
    expect(buildBookFilters({ q: 'C++ (fast)' })).toEqual({
      title: { $regex: 'C\\+\\+ \\(fast\\)', $options: 'i' },
    });
  });
});

describe('BooksService catalog mutations', () => {
  const bookModel = {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };
  let service: BooksService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BooksService(bookModel as never);
  });

  it('finds a single book by id and rejects missing ids', async () => {
    const exec = jest.fn().mockResolvedValueOnce({ _id: 'book-1' });
    bookModel.findById.mockReturnValueOnce({ exec });

    await expect(service.findById('book-1')).resolves.toEqual({
      _id: 'book-1',
    });
    expect(bookModel.findById.mock.calls[0]).toEqual(['book-1']);

    bookModel.findById.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    });
    await expect(service.findById('missing-book')).rejects.toThrow(
      'Book not found.',
    );
  });

  it('updates books with validators and returns the updated record', async () => {
    const updatedBook = { _id: 'book-1', title: 'Updated Book' };
    const exec = jest.fn().mockResolvedValue(updatedBook);
    bookModel.findByIdAndUpdate.mockReturnValue({ exec });

    await expect(
      service.updateById('book-1', { title: 'Updated Book' }),
    ).resolves.toBe(updatedBook);
    expect(bookModel.findByIdAndUpdate.mock.calls[0]).toEqual([
      'book-1',
      { $set: { title: 'Updated Book' } },
      { new: true, runValidators: true },
    ]);
  });

  it('rejects updates and deletes for missing books', async () => {
    bookModel.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    await expect(service.updateById('missing-book', {})).rejects.toThrow(
      'Book not found.',
    );

    bookModel.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    await expect(service.deleteById('missing-book')).rejects.toThrow(
      'Book not found.',
    );
  });

  it('deletes books by id', async () => {
    const deletedBook = { _id: 'book-1', title: 'Deleted Book' };
    const exec = jest.fn().mockResolvedValue(deletedBook);
    bookModel.findByIdAndDelete.mockReturnValue({ exec });

    await expect(service.deleteById('book-1')).resolves.toBe(deletedBook);
    expect(bookModel.findByIdAndDelete.mock.calls[0]).toEqual(['book-1']);
  });
});
