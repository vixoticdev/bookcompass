import { buildBookFilters } from './books.service';

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
