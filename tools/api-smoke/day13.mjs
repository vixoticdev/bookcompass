const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const READER_EMAIL =
  process.env.SMOKE_READER_EMAIL ?? `day13-reader-${stamp}@bookcompass.local`;
const READER_PASSWORD = process.env.SMOKE_READER_PASSWORD ?? 'bookcompass-demo';

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error(
    'Set ADMIN_EMAIL and ADMIN_PASSWORD for an existing admin before running Day 13 smoke.',
  );
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.token ? { authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    throw new Error(
      `${options.method ?? 'GET'} ${path} failed with ${response.status}: ${text}`,
    );
  }

  return body;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const health = await request('/health');
  assert(health.status === 'ok', 'API health check did not return ok.');

  const adminAuth = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });
  assert(adminAuth.user.role === 'admin', 'Smoke credentials are not admin.');

  const readerAuth = await request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      displayName: 'Day 13 Smoke Reader',
      email: READER_EMAIL,
      password: READER_PASSWORD,
    }),
  });

  await request('/profiles', {
    method: 'POST',
    token: readerAuth.accessToken,
    body: JSON.stringify({
      favoriteGenres: ['Productivity'],
      targetOutcomes: ['productivity'],
      preferredDepth: 'balanced',
      pacingTolerance: 'moderate',
      difficultyTolerance: 'moderate',
      preferredFormats: ['ebook'],
      dailyReadingMinutes: 45,
    }),
  });

  const author = await request('/authors', {
    method: 'POST',
    token: adminAuth.accessToken,
    body: JSON.stringify({
      name: `Day 13 Smoke Author ${stamp}`,
      knownForGenres: ['Productivity'],
      outcomeStrengths: ['productivity'],
    }),
  });

  const authorList = await request('/authors?limit=100');
  assert(
    authorList.items.some((item) => item._id === author._id),
    '/admin/authors backing list did not include the created author.',
  );

  const book = await request('/books', {
    method: 'POST',
    token: adminAuth.accessToken,
    body: JSON.stringify({
      title: `Day 13 Smoke Book ${stamp}`,
      authorId: author._id,
      genres: ['Productivity'],
      outcomeTags: ['productivity'],
      pacing: 'moderate',
      difficulty: 'moderate',
      depth: 'balanced',
      formats: ['ebook'],
      estimatedMinutes: 180,
      enrichmentStatus: 'imported',
      recommendationEligible: false,
      styleTags: ['practical'],
      riskTags: ['dense'],
    }),
  });

  const importedDrafts = await request(
    '/books?enrichmentStatus=imported&recommendationEligible=false&limit=20',
  );
  assert(
    importedDrafts.items.some((item) => item._id === book._id),
    'Imported draft queue did not include the created draft.',
  );

  await request(`/books/${book._id}`, {
    method: 'PATCH',
    token: adminAuth.accessToken,
    body: JSON.stringify({
      enrichmentStatus: 'reviewed',
      recommendationEligible: true,
    }),
  });
  const eligibleBooks = await request(
    '/books?enrichmentStatus=reviewed&recommendationEligible=true&limit=20',
  );
  assert(
    eligibleBooks.items.some((item) => item._id === book._id),
    'Approved eligibility queue did not include the reviewed book.',
  );

  const event = await request('/reading-events', {
    method: 'POST',
    token: readerAuth.accessToken,
    body: JSON.stringify({
      bookId: book._id,
      eventType: 'started',
      progressPercent: 10,
      note: 'Smoke started event',
    }),
  });
  assert(event.eventType === 'started', 'Reading event was not created.');

  const dnf = await request('/dnf-records', {
    method: 'POST',
    token: readerAuth.accessToken,
    body: JSON.stringify({
      bookId: book._id,
      stoppedAtPercent: 25,
      reason: 'wrong-mood',
      pacingSnapshot: 'moderate',
      difficultySnapshot: 'moderate',
      note: 'Smoke DNF record',
    }),
  });
  assert(dnf.reason === 'wrong-mood', 'DNF record was not created.');

  const session = await request('/recommendation-sessions', {
    method: 'POST',
    token: readerAuth.accessToken,
    body: JSON.stringify({
      context: {
        selectedOutcome: 'productivity',
        mood: 'focused',
        energyLevel: 'medium',
        focusLevel: 'high',
        availableMinutes: 240,
        preferredDepth: 'balanced',
      },
    }),
  });
  assert(session.candidates.length > 0, 'Recommendation session had no candidates.');

  await request(`/recommendation-sessions/${session._id}/feedback`, {
    method: 'POST',
    token: readerAuth.accessToken,
    body: JSON.stringify({
      bookId: session.candidates[0].bookId,
      status: 'started',
      progressPercent: 35,
      note: 'Day 13 smoke feedback note',
    }),
  });

  const [profile, events, dnfs, sessions] = await Promise.all([
    request('/profiles/me', { token: readerAuth.accessToken }),
    request('/reading-events/me', { token: readerAuth.accessToken }),
    request('/dnf-records/me', { token: readerAuth.accessToken }),
    request('/recommendation-sessions/me', { token: readerAuth.accessToken }),
  ]);

  assert(profile.targetOutcomes.includes('productivity'), 'Profile history missing profile.');
  assert(events.length >= 2, 'Profile history missing reading/feedback events.');
  assert(dnfs.length === 1, 'Profile history missing DNF record.');
  assert(
    sessions.some((item) =>
      item.candidates.some(
        (candidate) =>
          candidate.feedback?.progressPercent === 35 &&
          candidate.feedback?.note === 'Day 13 smoke feedback note',
      ),
    ),
    'Recommendation history missing note/progress feedback.',
  );

  await request(`/books/${book._id}`, {
    method: 'DELETE',
    token: adminAuth.accessToken,
  });
  await request(`/authors/${author._id}`, {
    method: 'DELETE',
    token: adminAuth.accessToken,
  });

  console.log(
    [
      'Day 13 smoke passed:',
      '- /admin/authors backing author list/create/delete',
      '- imported draft and reviewed eligibility book queues',
      '- recommendation feedback note/progress capture',
      '- /profile/history backing profile, events, DNF, sessions reads',
    ].join('\n'),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
