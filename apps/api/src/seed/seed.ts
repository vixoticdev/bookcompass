import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthorsService } from '../authors/authors.service';
import { CreateAuthorDto } from '../authors/dto/create-author.dto';
import { BooksService } from '../books/books.service';
import { CreateBookDto } from '../books/dto/create-book.dto';

type SeedAuthor = CreateAuthorDto & {
  books: Omit<CreateBookDto, 'authorId'>[];
};

const standardFormats = ['paperback', 'hardcover', 'ebook', 'audiobook'];

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
        publishedYear: 2023,
        googleBooksVolumeId: 'WmqyDwAAQBAJ',
        thumbnailUrl:
          'http://books.google.com/books/content?id=WmqyDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
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
        subtitle: 'Rules for Focused Success in a Distracted World',
        publishedYear: 2016,
        googleBooksVolumeId: 'lZpFCgAAQBAJ',
        thumbnailUrl:
          'http://books.google.com/books/content?id=lZpFCgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
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
        subtitle:
          "How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses",
        publishedYear: 2011,
        googleBooksVolumeId: 'tvfyz-4JILwC',
        thumbnailUrl:
          'http://books.google.com/books/content?id=tvfyz-4JILwC&printsec=frontcover&img=1&zoom=1&source=gbs_api',
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
        publishedYear: 2011,
        googleBooksVolumeId: 'oV1tXT3HigoC',
        thumbnailUrl:
          'http://books.google.com/books/content?id=oV1tXT3HigoC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
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
        publishedYear: 2019,
        googleBooksVolumeId: 'UG6RzQEACAAJ',
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
  {
    name: 'Bianca Sparacino',
    bio: 'Writer focused on self-compassion, healing, emotional resilience, and reflective personal growth.',
    knownForGenres: ['Self-help', 'Personal growth', 'Mindfulness'],
    outcomeStrengths: ['emotional-resilience', 'habit-building', 'discipline'],
    books: [
      {
        title: 'A Gentle Reminder',
        isbn: '1949759296',
        publishedYear: 2020,
        googleBooksVolumeId: '-fvazQEACAAJ',
        thumbnailUrl:
          'http://books.google.com/books/content?id=-fvazQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        description:
          'A reflective collection for readers seeking self-compassion, emotional steadiness, and gentler inner dialogue.',
        genres: ['Self-help', 'Personal growth', 'Mindfulness'],
        outcomeTags: ['emotional-resilience', 'habit-building', 'discipline'],
        pacing: 'moderate',
        difficulty: 'easy',
        depth: 'balanced',
        formats: standardFormats,
        pageCount: 160,
        estimatedMinutes: 215,
      },
    ],
  },
  {
    name: 'Jordan B. Peterson',
    bio: 'Psychologist and author writing about responsibility, meaning, discipline, and practical philosophy.',
    knownForGenres: ['Self-help', 'Psychology', 'Philosophy'],
    outcomeStrengths: ['discipline', 'habit-building', 'emotional-resilience'],
    books: [
      {
        title: '12 Rules for Life',
        isbn: '9780735278516',
        subtitle: 'An Antidote to Chaos',
        publishedYear: 2019,
        googleBooksVolumeId: 'bXfzvAEACAAJ',
        thumbnailUrl:
          'http://books.google.com/books/content?id=bXfzvAEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        description:
          'A rule-based personal philosophy book about responsibility, order, discipline, and meaning.',
        genres: ['Self-help', 'Psychology', 'Philosophy'],
        outcomeTags: ['discipline', 'habit-building', 'emotional-resilience'],
        pacing: 'moderate',
        difficulty: 'challenging',
        depth: 'deep',
        formats: standardFormats,
        pageCount: 448,
        estimatedMinutes: 605,
      },
    ],
  },
  {
    name: 'Robert Greene',
    bio: 'Author of strategy and human behavior books focused on power, persuasion, mastery, and social dynamics.',
    knownForGenres: ['Psychology', 'Strategy', 'Personal growth'],
    outcomeStrengths: ['persuasion', 'leadership', 'discipline'],
    books: [
      {
        title: 'The Laws of Human Nature',
        isbn: '9780525561804',
        publishedYear: 2018,
        googleBooksVolumeId: 'vDDWvAEACAAJ',
        description:
          'A dense guide to motives, emotion, social behavior, empathy, and self-control.',
        genres: ['Psychology', 'Strategy', 'Personal growth'],
        outcomeTags: ['persuasion', 'emotional-resilience', 'discipline'],
        pacing: 'slow',
        difficulty: 'challenging',
        depth: 'deep',
        formats: standardFormats,
        pageCount: 624,
        estimatedMinutes: 845,
      },
    ],
  },
  {
    name: 'Naomi Klein',
    bio: 'Journalist and author focused on brands, economics, globalization, politics, and culture.',
    knownForGenres: ['Business', 'Politics', 'Culture'],
    outcomeStrengths: ['startup-thinking', 'better-manager', 'leadership'],
    books: [
      {
        title: 'No Logo',
        isbn: '9056374524',
        subtitle:
          'geen ruimte, geen keuze, geen werk : de strijd tegen de dwang van de wereldmerken',
        publishedYear: 2002,
        googleBooksVolumeId: 'hGVbAQAACAAJ',
        description:
          'A critique of branding, corporate power, labor practices, and global consumer culture.',
        genres: ['Business', 'Politics', 'Culture'],
        outcomeTags: ['startup-thinking', 'better-manager', 'leadership'],
        pacing: 'moderate',
        difficulty: 'moderate',
        depth: 'balanced',
        formats: standardFormats,
        pageCount: 528,
        estimatedMinutes: 715,
      },
    ],
  },
  {
    name: 'Darren Hardy',
    bio: 'Author and speaker focused on consistency, performance habits, and compounding daily improvement.',
    knownForGenres: ['Self-improvement', 'Productivity', 'Leadership'],
    outcomeStrengths: ['habit-building', 'discipline', 'productivity'],
    books: [
      {
        title: 'The Compound Effect',
        isbn: '159315724X',
        publishedYear: 2012,
        googleBooksVolumeId: 'g5pytAEACAAJ',
        thumbnailUrl:
          'http://books.google.com/books/content?id=g5pytAEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        description:
          'A practical book about small consistent actions, habit loops, and long-term performance gains.',
        genres: ['Self-improvement', 'Productivity', 'Leadership'],
        outcomeTags: ['habit-building', 'discipline', 'productivity'],
        pacing: 'fast',
        difficulty: 'easy',
        depth: 'balanced',
        formats: standardFormats,
        pageCount: 176,
        estimatedMinutes: 240,
      },
    ],
  },
  {
    name: 'Jim Collins',
    bio: 'Business researcher and author focused on organizational performance, leadership, and durable companies.',
    knownForGenres: ['Business', 'Leadership', 'Management'],
    outcomeStrengths: ['better-manager', 'leadership', 'startup-thinking'],
    books: [
      {
        title: 'Good to Great',
        isbn: '9780066620992',
        subtitle: "Why Some Companies Make the Leap...And Others Don't",
        publishedYear: 2001,
        googleBooksVolumeId: 'pJNt2ZFFT3sC',
        thumbnailUrl:
          'http://books.google.com/books/content?id=pJNt2ZFFT3sC&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        description:
          'A research-backed management book about disciplined people, focused strategy, and durable company performance.',
        genres: ['Business', 'Leadership', 'Management'],
        outcomeTags: ['better-manager', 'leadership', 'startup-thinking'],
        pacing: 'moderate',
        difficulty: 'moderate',
        depth: 'balanced',
        formats: standardFormats,
        pageCount: 320,
        estimatedMinutes: 430,
      },
    ],
  },
  {
    name: 'Sun Tzu',
    bio: 'Classical military strategist associated with enduring principles of conflict, positioning, and strategic judgment.',
    knownForGenres: ['Strategy', 'Classics', 'Philosophy'],
    outcomeStrengths: ['leadership', 'persuasion', 'discipline'],
    books: [
      {
        title: 'The Art of War',
        isbn: '9781494806569',
        publishedYear: 2013,
        googleBooksVolumeId: 'Op0UngEACAAJ',
        description:
          'A concise classical strategy text about conflict, positioning, timing, discipline, and leadership.',
        genres: ['Strategy', 'Classics', 'Philosophy'],
        outcomeTags: ['leadership', 'persuasion', 'discipline'],
        pacing: 'moderate',
        difficulty: 'challenging',
        depth: 'deep',
        formats: standardFormats,
        pageCount: 273,
        estimatedMinutes: 370,
      },
    ],
  },
  {
    name: 'Friedrich Nietzsche',
    bio: 'Philosopher whose work explores morality, meaning, culture, power, and self-overcoming.',
    knownForGenres: ['Philosophy', 'Classics', 'Ethics'],
    outcomeStrengths: ['emotional-resilience', 'discipline'],
    books: [
      {
        title: 'Beyond Good and Evil',
        isbn: '9781704936901',
        publishedYear: 2019,
        googleBooksVolumeId: 'QqDfzgEACAAJ',
        description:
          'A challenging philosophical work about morality, truth, values, power, and intellectual independence.',
        genres: ['Philosophy', 'Classics', 'Ethics'],
        outcomeTags: ['emotional-resilience', 'discipline'],
        pacing: 'slow',
        difficulty: 'challenging',
        depth: 'deep',
        formats: standardFormats,
        pageCount: 240,
        estimatedMinutes: 325,
      },
    ],
  },
  {
    name: 'Will Durant',
    bio: 'Historian and philosopher known for accessible surveys of philosophy, history, and civilization.',
    knownForGenres: ['Philosophy', 'History', 'Biography'],
    outcomeStrengths: ['technical-learning', 'emotional-resilience'],
    books: [
      {
        title: 'The Story of Philosophy',
        isbn: '1512110353',
        subtitle:
          'The Lives and Opinions Greatest Philosophers of the Western World (in Focus Biographies)',
        publishedYear: 2015,
        googleBooksVolumeId: 'QdPesgEACAAJ',
        description:
          'An accessible tour of major philosophers, their ideas, and the lives behind those ideas.',
        genres: ['Philosophy', 'History', 'Biography'],
        outcomeTags: ['technical-learning', 'emotional-resilience'],
        pacing: 'moderate',
        difficulty: 'challenging',
        depth: 'deep',
        formats: standardFormats,
        pageCount: 432,
        estimatedMinutes: 585,
      },
    ],
  },
  {
    name: 'Frederick Douglass',
    bio: 'Abolitionist, orator, writer, and statesman whose autobiographical work shaped American history and civil rights.',
    knownForGenres: ['Biography', 'History', 'Classics'],
    outcomeStrengths: ['emotional-resilience', 'leadership'],
    books: [
      {
        title: 'Narrative of the Life of Frederick Douglass',
        isbn: '9781613060117',
        description:
          'A powerful autobiographical account of enslavement, literacy, resistance, and liberation.',
        genres: ['Biography', 'History', 'Classics'],
        outcomeTags: ['emotional-resilience', 'leadership'],
        pacing: 'moderate',
        difficulty: 'moderate',
        depth: 'balanced',
        formats: standardFormats,
        pageCount: 144,
        estimatedMinutes: 195,
      },
    ],
  },
  {
    name: 'Lori Gottlieb',
    bio: 'Therapist and writer exploring psychotherapy, relationships, grief, change, and emotional growth.',
    knownForGenres: ['Memoir', 'Psychology', 'Personal growth'],
    outcomeStrengths: ['emotional-resilience', 'persuasion'],
    books: [
      {
        title: 'Maybe You Should Talk to Someone',
        isbn: '1799717429',
        description:
          'A memoir and psychology book about therapy, change, grief, relationships, and the stories people tell themselves.',
        genres: ['Memoir', 'Psychology', 'Personal growth'],
        outcomeTags: ['emotional-resilience', 'persuasion'],
        pacing: 'moderate',
        difficulty: 'moderate',
        depth: 'balanced',
        formats: standardFormats,
        pageCount: 432,
        estimatedMinutes: 585,
      },
    ],
  },
  {
    name: 'Joshua Foer',
    bio: 'Journalist and author writing about memory, learning, cognition, and human performance.',
    knownForGenres: ['Psychology', 'Science', 'Memoir'],
    outcomeStrengths: ['technical-learning', 'productivity'],
    books: [
      {
        title: 'Moonwalking with Einstein',
        isbn: '9781594202292',
        subtitle: 'The Art and Science of Remembering Everything',
        publishedYear: 2011,
        googleBooksVolumeId: 'cCmGngEACAAJ',
        thumbnailUrl:
          'http://books.google.com/books/content?id=cCmGngEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        description:
          'A narrative exploration of memory techniques, learning, competition, and cognitive performance.',
        genres: ['Psychology', 'Science', 'Memoir'],
        outcomeTags: ['technical-learning', 'productivity'],
        pacing: 'moderate',
        difficulty: 'moderate',
        depth: 'balanced',
        formats: standardFormats,
        pageCount: 320,
        estimatedMinutes: 430,
      },
    ],
  },
  {
    name: 'Matt Haig',
    bio: 'Novelist and nonfiction author writing about mental health, regret, possibility, and resilience.',
    knownForGenres: [
      'Literary fiction',
      'Contemporary fiction',
      'Mental health',
    ],
    outcomeStrengths: ['emotional-resilience'],
    books: [
      {
        title: 'The Midnight Library',
        isbn: '1786892731',
        publishedYear: 2021,
        googleBooksVolumeId: 'exTZzQEACAAJ',
        thumbnailUrl:
          'http://books.google.com/books/content?id=exTZzQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        description:
          'A reflective novel about regret, alternate lives, depression, possibility, and choosing to live.',
        genres: ['Literary fiction', 'Contemporary fiction'],
        outcomeTags: ['emotional-resilience'],
        pacing: 'moderate',
        difficulty: 'moderate',
        depth: 'balanced',
        formats: standardFormats,
        pageCount: 304,
        estimatedMinutes: 410,
      },
    ],
  },
  {
    name: 'J. R. R. Tolkien',
    bio: 'Fantasy author and philologist whose mythology shaped modern epic fantasy.',
    knownForGenres: ['Fantasy', 'Classics', 'Mythology'],
    outcomeStrengths: ['emotional-resilience'],
    books: [
      {
        title: 'The Silmarillion',
        isbn: '0618126988',
        publishedYear: 2001,
        googleBooksVolumeId: 'zlB71nO7T5EC',
        thumbnailUrl:
          'http://books.google.com/books/content?id=zlB71nO7T5EC&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        description:
          'A mythic fantasy history of Middle-earth, rich with creation stories, conflict, tragedy, and lore.',
        genres: ['Fantasy', 'Classics', 'Mythology'],
        outcomeTags: ['emotional-resilience'],
        pacing: 'slow',
        difficulty: 'challenging',
        depth: 'deep',
        formats: standardFormats,
        pageCount: 365,
        estimatedMinutes: 495,
      },
    ],
  },
  {
    name: 'Cixin Liu',
    bio: 'Science fiction author known for large-scale speculative ideas, technology, civilization, and cosmic risk.',
    knownForGenres: ['Science fiction', 'Technology', 'Speculative fiction'],
    outcomeStrengths: ['technical-learning'],
    books: [
      {
        title: "Death's End",
        isbn: '9780765386632',
        publishedYear: 2017,
        googleBooksVolumeId: '1MEOMQAACAAJ',
        thumbnailUrl:
          'http://books.google.com/books/content?id=1MEOMQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        description:
          'A large-scale science fiction novel about civilization, physics, strategy, and long-horizon existential risk.',
        genres: ['Science fiction', 'Technology', 'Speculative fiction'],
        outcomeTags: ['technical-learning'],
        pacing: 'moderate',
        difficulty: 'challenging',
        depth: 'deep',
        formats: standardFormats,
        pageCount: 604,
        estimatedMinutes: 815,
      },
    ],
  },
  {
    name: 'Arkady and Boris Strugatsky',
    bio: 'Science fiction authors known for philosophical speculative fiction, social critique, and strange-zone narratives.',
    knownForGenres: ['Science fiction', 'Philosophy', 'Speculative fiction'],
    outcomeStrengths: ['technical-learning', 'emotional-resilience'],
    books: [
      {
        title: 'Roadside Picnic',
        isbn: '9781473208735',
        publishedYear: 2014,
        googleBooksVolumeId: 'Dog5AwAAQBAJ',
        thumbnailUrl:
          'http://books.google.com/books/content?id=Dog5AwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        description:
          'A philosophical science fiction novel about alien remnants, risk, obsession, and human desire.',
        genres: ['Science fiction', 'Philosophy', 'Speculative fiction'],
        outcomeTags: ['technical-learning', 'emotional-resilience'],
        pacing: 'fast',
        difficulty: 'challenging',
        depth: 'deep',
        formats: standardFormats,
        pageCount: 224,
        estimatedMinutes: 305,
      },
    ],
  },
  {
    name: 'Agatha Christie',
    bio: 'Mystery novelist known for tightly plotted detective fiction, puzzle structure, and high-readability pacing.',
    knownForGenres: ['Mystery', 'Crime fiction', 'Classics'],
    outcomeStrengths: ['emotional-resilience'],
    books: [
      {
        title: 'The Man in the Brown Suit',
        isbn: '9798590301256',
        description:
          'A fast-moving mystery adventure built around murder, travel, mistaken identities, and hidden motives.',
        genres: ['Mystery', 'Crime fiction'],
        outcomeTags: ['emotional-resilience'],
        pacing: 'fast',
        difficulty: 'easy',
        depth: 'balanced',
        formats: standardFormats,
        pageCount: 288,
        estimatedMinutes: 390,
      },
      {
        title: '4:50 from Paddington',
        isbn: '9789875807549',
        description:
          'A Miss Marple mystery about a witnessed murder, family secrets, and careful deduction.',
        genres: ['Mystery', 'Crime fiction'],
        outcomeTags: ['emotional-resilience'],
        pacing: 'fast',
        difficulty: 'easy',
        depth: 'balanced',
        formats: standardFormats,
        pageCount: 288,
        estimatedMinutes: 390,
      },
      {
        title: 'The Mysterious Affair at Styles',
        isbn: '9798407818793',
        description:
          'The first Hercule Poirot mystery, centered on poisoning, inheritance, misdirection, and deduction.',
        genres: ['Mystery', 'Crime fiction', 'Classics'],
        outcomeTags: ['emotional-resilience'],
        pacing: 'fast',
        difficulty: 'easy',
        depth: 'balanced',
        formats: standardFormats,
        pageCount: 208,
        estimatedMinutes: 280,
      },
    ],
  },
  {
    name: 'Thomas Hardy',
    bio: 'Classic novelist known for rural settings, moral tension, relationships, social constraint, and emotional consequence.',
    knownForGenres: ['Classics', 'Romance', 'Literary fiction'],
    outcomeStrengths: ['emotional-resilience'],
    books: [
      {
        title: 'Far from the Madding Crowd',
        isbn: '9780497901103',
        description:
          'A classic novel about independence, love, loyalty, rural life, and consequential choices.',
        genres: ['Classics', 'Romance', 'Literary fiction'],
        outcomeTags: ['emotional-resilience'],
        pacing: 'moderate',
        difficulty: 'moderate',
        depth: 'balanced',
        formats: standardFormats,
        pageCount: 464,
        estimatedMinutes: 625,
      },
    ],
  },
  {
    name: 'Julie Smith',
    bio: 'Clinical psychologist and author focused on accessible mental health tools and emotional regulation.',
    knownForGenres: ['Psychology', 'Mental health', 'Self-help'],
    outcomeStrengths: ['emotional-resilience', 'discipline'],
    books: [
      {
        title: 'Why Has Nobody Told Me This Before?',
        isbn: '0241529735',
        subtitle:
          'The Sunday Times bestseller, with over 1 million copies sold',
        publishedYear: 2022,
        googleBooksVolumeId: 'fxcjEAAAQBAJ',
        thumbnailUrl:
          'http://books.google.com/books/content?id=fxcjEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        description:
          'A practical psychology guide to mood, motivation, anxiety, confidence, grief, and emotional regulation.',
        genres: ['Psychology', 'Mental health', 'Self-help'],
        outcomeTags: ['emotional-resilience', 'discipline', 'habit-building'],
        pacing: 'moderate',
        difficulty: 'easy',
        depth: 'balanced',
        formats: standardFormats,
        pageCount: 368,
        estimatedMinutes: 495,
      },
    ],
  },
  {
    name: 'Julia Cameron',
    bio: 'Author, artist, and teacher known for creative recovery, writing practice, and artistic discipline.',
    knownForGenres: ['Creativity', 'Self-help', 'Writing'],
    outcomeStrengths: ['productivity', 'emotional-resilience', 'discipline'],
    books: [
      {
        title: "The Artist's Way",
        isbn: '078656475X',
        description:
          'A guided creative recovery program built around morning pages, artist dates, discipline, and self-trust.',
        genres: ['Creativity', 'Self-help', 'Writing'],
        outcomeTags: ['productivity', 'emotional-resilience', 'discipline'],
        pacing: 'moderate',
        difficulty: 'easy',
        depth: 'balanced',
        formats: standardFormats,
        pageCount: 272,
        estimatedMinutes: 365,
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
