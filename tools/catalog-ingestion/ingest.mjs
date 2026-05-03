import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const USER_AGENT =
  process.env.CATALOG_USER_AGENT ??
  'BookCompassCatalogIngestion/0.1 (contact: local-dev@bookcompass.local)';
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';
const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com';

const args = parseArgs(process.argv.slice(2));
const sourcesPath = resolve(args.sources ?? 'tools/catalog-ingestion/sources.json');
const outPath = resolve(args.out ?? '.local/catalog-drafts.jsonl');
const targetTotal = Number(args.target ?? 1000);
const perGenreOverride = args['per-genre'] ? Number(args['per-genre']) : undefined;
const delayMs = Number(args.delay ?? 350);

const outcomeRules = [
  ['business', ['better-manager', 'startup-thinking', 'leadership']],
  ['leadership', ['leadership', 'better-manager']],
  ['management', ['better-manager', 'leadership']],
  ['startup', ['startup-thinking', 'productivity']],
  ['entrepreneur', ['startup-thinking', 'leadership']],
  ['self-help', ['habit-building', 'discipline', 'productivity']],
  ['productivity', ['productivity', 'discipline', 'habit-building']],
  ['habit', ['habit-building', 'discipline']],
  ['psychology', ['persuasion', 'emotional-resilience']],
  ['philosophy', ['emotional-resilience', 'discipline']],
  ['technology', ['technical-learning', 'productivity']],
  ['science', ['technical-learning']],
  ['health', ['emotional-resilience', 'habit-building']],
  ['creativity', ['productivity', 'emotional-resilience']],
];

const fictionGenreKeys = new Set([
  'literary-fiction',
  'classics',
  'fantasy',
  'science-fiction',
  'mystery',
  'thriller',
  'romance',
]);

async function main() {
  const sources = JSON.parse(await readFile(sourcesPath, 'utf8'));
  const perGenre = perGenreOverride ?? sources.perGenre ?? 50;
  const selectedGenres = sources.genres.slice(
    0,
    Math.ceil(targetTotal / perGenre),
  );
  const drafts = [];
  const seen = new Set();

  for (const genre of selectedGenres) {
    const candidates = await fetchOpenLibraryCandidates(genre, perGenre * 3);
    let acceptedForGenre = 0;

    for (const candidate of candidates) {
      if (acceptedForGenre >= perGenre || drafts.length >= targetTotal) {
        break;
      }

      const googleVolume = await fetchGoogleBooksVolume(candidate);
      const draft = normalizeDraft({ candidate, genre, googleVolume });

      if (!draft.title || draft.authors.length === 0) {
        continue;
      }

      if (seen.has(draft.dedupeKey)) {
        continue;
      }

      seen.add(draft.dedupeKey);
      drafts.push(draft);
      acceptedForGenre += 1;
      await sleep(delayMs);
    }

    console.log(
      `${genre.label}: accepted ${acceptedForGenre}; total drafts ${drafts.length}`,
    );

    if (drafts.length >= targetTotal) {
      break;
    }
  }

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(
    outPath,
    `${drafts.map((draft) => JSON.stringify(draft)).join('\n')}\n`,
  );

  console.log(`Wrote ${drafts.length} catalog drafts to ${outPath}`);
}

async function fetchOpenLibraryCandidates(genre, limit) {
  const url = new URL('/search.json', OPEN_LIBRARY_BASE_URL);
  url.searchParams.set('subject', genre.openLibrarySubject);
  url.searchParams.set('language', 'eng');
  url.searchParams.set('limit', String(limit));
  url.searchParams.set(
    'fields',
    [
      'key',
      'title',
      'author_name',
      'first_publish_year',
      'isbn',
      'language',
      'subject',
      'ratings_average',
      'ratings_count',
      'want_to_read_count',
      'currently_reading_count',
      'already_read_count',
      'edition_count',
      'cover_i',
    ].join(','),
  );

  const data = await fetchJson(url);
  return [...(data.docs ?? [])].sort(compareOpenLibraryPopularity);
}

async function fetchGoogleBooksVolume(candidate) {
  const isbn = candidate.isbn?.[0];
  const title = candidate.title;
  const author = candidate.author_name?.[0];
  const query = isbn
    ? `isbn:${isbn}`
    : `${title ? `intitle:${title}` : ''}${author ? ` inauthor:${author}` : ''}`.trim();

  if (!query) {
    return undefined;
  }

  const url = new URL('/books/v1/volumes', GOOGLE_BOOKS_BASE_URL);
  url.searchParams.set('q', query);
  url.searchParams.set('maxResults', '1');
  url.searchParams.set('printType', 'books');
  url.searchParams.set('projection', 'lite');

  if (GOOGLE_BOOKS_API_KEY) {
    url.searchParams.set('key', GOOGLE_BOOKS_API_KEY);
  }

  try {
    const data = await fetchJson(url);
    return data.items?.[0];
  } catch (error) {
    console.warn(`Google Books enrichment skipped for "${candidate.title}": ${error.message}`);
    return undefined;
  }
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url.toString()}`);
  }

  return response.json();
}

function normalizeDraft({ candidate, genre, googleVolume }) {
  const google = googleVolume?.volumeInfo ?? {};
  const title = google.title ?? candidate.title;
  const authors = uniqueStrings(google.authors ?? candidate.author_name ?? []);
  const categories = uniqueStrings([
    genre.label,
    ...(google.categories ?? []),
    ...(candidate.subject ?? []).slice(0, 12),
  ]);
  const pageCount = google.pageCount;
  const publishedYear = extractYear(
    google.publishedDate ?? candidate.first_publish_year,
  );
  const isbn13 = google.industryIdentifiers?.find(
    (identifier) => identifier.type === 'ISBN_13',
  )?.identifier;
  const isbn10 = google.industryIdentifiers?.find(
    (identifier) => identifier.type === 'ISBN_10',
  )?.identifier;
  const isbn = isbn13 ?? isbn10 ?? candidate.isbn?.[0];
  const description = google.description;
  const semantic = inferSemanticData({
    categories,
    description,
    genre,
    pageCount,
    title,
  });

  return {
    title,
    subtitle: google.subtitle,
    authors,
    isbn,
    description,
    pageCount,
    publishedYear,
    language: google.language ?? 'en',
    genres: normalizeGenres(categories),
    sourceIds: {
      openLibraryWorkKey: candidate.key,
      googleBooksVolumeId: googleVolume?.id,
      openLibraryCoverId: candidate.cover_i,
    },
    sourceMetrics: {
      openLibraryRatingsAverage: candidate.ratings_average,
      openLibraryRatingsCount: candidate.ratings_count,
      openLibraryWantToReadCount: candidate.want_to_read_count,
      openLibraryAlreadyReadCount: candidate.already_read_count,
      googleAverageRating: google.averageRating,
      googleRatingsCount: google.ratingsCount,
    },
    sourceUrls: {
      openLibrary: candidate.key
        ? `${OPEN_LIBRARY_BASE_URL}${candidate.key}`
        : undefined,
      googleBooks: googleVolume?.selfLink,
      thumbnail: google.imageLinks?.thumbnail,
    },
    popularityScore: calculatePopularityScore(candidate, google),
    enrichmentStatus: 'needs-review',
    recommendationEligible: false,
    ...semantic,
    dedupeKey: normalizeDedupeKey(title, authors[0], isbn),
    reviewNotes: [],
  };
}

function inferSemanticData({ categories, description, genre, pageCount, title }) {
  const haystack =
    `${title ?? ''} ${description ?? ''} ${categories.join(' ')}`.toLowerCase();
  const outcomeTags = uniqueStrings(
    outcomeRules.flatMap(([needle, outcomes]) =>
      haystack.includes(needle) ? outcomes : [],
    ),
  ).slice(0, 4);

  if (outcomeTags.length === 0) {
    outcomeTags.push(
      fictionGenreKeys.has(genre.key) ? 'emotional-resilience' : 'technical-learning',
    );
  }

  const difficulty =
    pageCount && pageCount > 500
      ? 'challenging'
      : haystack.includes('philosophy') || haystack.includes('science')
        ? 'challenging'
        : pageCount && pageCount < 240
          ? 'easy'
          : 'moderate';
  const pacing = fictionGenreKeys.has(genre.key)
    ? genre.key === 'literary-fiction' || genre.key === 'classics'
      ? 'moderate'
      : 'fast'
    : pageCount && pageCount > 450
      ? 'slow'
      : 'moderate';
  const depth = difficulty === 'challenging' ? 'deep' : 'balanced';
  const estimatedMinutes = pageCount
    ? Math.max(60, Math.round(pageCount * 1.35))
    : undefined;

  return {
    outcomeTags,
    pacing,
    difficulty,
    depth,
    estimatedMinutes,
    styleTags: inferStyleTags(haystack, genre),
    riskTags: inferRiskTags({ difficulty, haystack, pageCount, pacing }),
  };
}

function inferStyleTags(haystack, genre) {
  const tags = [];

  if (fictionGenreKeys.has(genre.key)) {
    tags.push('narrative');
  } else {
    tags.push('instructional');
  }

  if (haystack.includes('memoir') || haystack.includes('biography')) {
    tags.push('personal-story');
  }

  if (haystack.includes('practical') || haystack.includes('guide')) {
    tags.push('practical');
  }

  if (haystack.includes('research') || haystack.includes('science')) {
    tags.push('research-backed');
  }

  return uniqueStrings(tags);
}

function inferRiskTags({ difficulty, haystack, pageCount, pacing }) {
  const tags = [];

  if (difficulty === 'challenging') {
    tags.push('dense');
  }

  if (pacing === 'slow') {
    tags.push('slow-start');
  }

  if (pageCount && pageCount > 550) {
    tags.push('long-read');
  }

  if (haystack.includes('theory') || haystack.includes('philosophy')) {
    tags.push('abstract');
  }

  return uniqueStrings(tags);
}

function calculatePopularityScore(candidate, google) {
  const openLibraryReads =
    (candidate.want_to_read_count ?? 0) +
    (candidate.currently_reading_count ?? 0) * 2 +
    (candidate.already_read_count ?? 0) * 3;
  const openLibraryRatings = (candidate.ratings_count ?? 0) * 2;
  const googleRatings = (google.ratingsCount ?? 0) * 2;
  const editions = candidate.edition_count ?? 0;

  return openLibraryReads + openLibraryRatings + googleRatings + editions;
}

function compareOpenLibraryPopularity(left, right) {
  return calculatePopularityScore(right, {}) - calculatePopularityScore(left, {});
}

function normalizeGenres(categories) {
  return uniqueStrings(
    categories
      .map((category) => String(category).trim())
      .filter(Boolean)
      .slice(0, 8),
  );
}

function normalizeDedupeKey(title, author, isbn) {
  if (isbn) {
    return `isbn:${isbn.replaceAll('-', '').toLowerCase()}`;
  }

  return `${title ?? ''}:${author ?? ''}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractYear(value) {
  const match = String(value ?? '').match(/\d{4}/);
  return match ? Number(match[0]) : undefined;
}

function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean).map((value) => String(value)))];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs(values) {
  const parsed = {};

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];

    if (value.startsWith('--')) {
      parsed[value.slice(2)] = values[index + 1];
      index += 1;
    }
  }

  return parsed;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
