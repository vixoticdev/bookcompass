import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthorsService } from '../authors/authors.service';
import { CreateAuthorDto } from '../authors/dto/create-author.dto';
import { BooksService } from '../books/books.service';
import { CreateBookDto } from '../books/dto/create-book.dto';

type SeedAuthor = CreateAuthorDto & {
  books: Omit<CreateBookDto, 'authorId'>[];
};

const seedAuthors: SeedAuthor[] = [
  {
    name: 'James Clear',
    bio: 'Author focused on behavior design, habits, and practical self-improvement systems.',
    knownForGenres: [
      'Self-improvement',
      'Productivity',
      'Behavioral psychology',
    ],
    outcomeStrengths: ['habit-building', 'discipline', 'productivity'],
    books: [
      {
        title: 'Atomic Habits',
        description:
          'A practical system for building good habits, breaking bad ones, and making incremental progress visible.',
        genres: ['Self-improvement', 'Productivity'],
        outcomeTags: ['habit-building', 'discipline', 'productivity'],
        pacing: 'fast',
        difficulty: 'easy',
        depth: 'balanced',
        formats: ['paperback', 'hardcover', 'ebook', 'audiobook'],
        pageCount: 320,
        estimatedMinutes: 360,
      },
    ],
  },
  {
    name: 'Cal Newport',
    bio: 'Computer science professor and author writing about focus, work, technology, and craft.',
    knownForGenres: ['Productivity', 'Business', 'Technology'],
    outcomeStrengths: ['productivity', 'technical-learning', 'discipline'],
    books: [
      {
        title: 'Deep Work',
        description:
          'A framework for protecting attention and producing high-value work in distraction-heavy environments.',
        genres: ['Productivity', 'Business'],
        outcomeTags: ['productivity', 'discipline', 'technical-learning'],
        pacing: 'moderate',
        difficulty: 'moderate',
        depth: 'deep',
        formats: ['paperback', 'hardcover', 'ebook', 'audiobook'],
        pageCount: 304,
        estimatedMinutes: 420,
      },
    ],
  },
  {
    name: 'Eric Ries',
    bio: 'Entrepreneur and author known for lean startup methodology and validated learning.',
    knownForGenres: ['Startup', 'Business', 'Product'],
    outcomeStrengths: ['startup-thinking', 'leadership', 'better-manager'],
    books: [
      {
        title: 'The Lean Startup',
        description:
          'A startup operating model built around experimentation, feedback loops, and validated learning.',
        genres: ['Startup', 'Business', 'Product'],
        outcomeTags: ['startup-thinking', 'better-manager', 'leadership'],
        pacing: 'moderate',
        difficulty: 'moderate',
        depth: 'balanced',
        formats: ['paperback', 'hardcover', 'ebook', 'audiobook'],
        pageCount: 336,
        estimatedMinutes: 430,
      },
    ],
  },
  {
    name: 'Daniel Kahneman',
    bio: 'Psychologist and Nobel laureate whose work shaped behavioral economics and decision science.',
    knownForGenres: ['Psychology', 'Decision science', 'Behavioral economics'],
    outcomeStrengths: ['persuasion', 'leadership', 'better-manager'],
    books: [
      {
        title: 'Thinking, Fast and Slow',
        description:
          'A deep exploration of cognitive bias, judgment, and the two systems behind human decision-making.',
        genres: ['Psychology', 'Decision science'],
        outcomeTags: ['persuasion', 'better-manager', 'leadership'],
        pacing: 'slow',
        difficulty: 'challenging',
        depth: 'deep',
        formats: ['paperback', 'hardcover', 'ebook', 'audiobook'],
        pageCount: 512,
        estimatedMinutes: 780,
      },
    ],
  },
  {
    name: 'Brene Brown',
    bio: 'Researcher and author focused on courage, vulnerability, resilience, and leadership.',
    knownForGenres: ['Leadership', 'Psychology', 'Personal growth'],
    outcomeStrengths: ['emotional-resilience', 'leadership', 'better-manager'],
    books: [
      {
        title: 'Dare to Lead',
        description:
          'A leadership book about courage, trust, difficult conversations, and resilient team culture.',
        genres: ['Leadership', 'Personal growth'],
        outcomeTags: ['emotional-resilience', 'leadership', 'better-manager'],
        pacing: 'moderate',
        difficulty: 'easy',
        depth: 'balanced',
        formats: ['paperback', 'hardcover', 'ebook', 'audiobook'],
        pageCount: 320,
        estimatedMinutes: 390,
      },
    ],
  },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const authorsService = app.get(AuthorsService);
  const booksService = app.get(BooksService);

  try {
    let authorCount = 0;
    let bookCount = 0;

    for (const { books, ...authorSeed } of seedAuthors) {
      const author = await authorsService.upsertByName(authorSeed);
      authorCount += 1;

      for (const bookSeed of books) {
        await booksService.upsertByTitleAndAuthor({
          ...bookSeed,
          authorId: String(author._id),
        });
        bookCount += 1;
      }
    }

    console.log(
      `Seeded ${authorCount} authors and ${bookCount} books into BookCompass.`,
    );
  } finally {
    await app.close();
  }
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
