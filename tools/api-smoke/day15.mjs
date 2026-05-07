const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error(
    'Set ADMIN_EMAIL and ADMIN_PASSWORD for an existing admin before running Day 15 smoke.',
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

  const analytics = await request('/recommendation-sessions/admin/analytics', {
    token: adminAuth.accessToken,
  });
  assert(
    typeof analytics.catalogReview.total === 'number',
    'Admin analytics did not include catalog totals.',
  );
  assert(
    typeof analytics.candidateFeedback.totalRecorded === 'number',
    'Admin analytics did not include candidate feedback totals.',
  );

  const originalTuning = await request('/recommendation-sessions/admin/tuning', {
    token: adminAuth.accessToken,
  });
  assert(
    originalTuning.key === 'active' &&
      typeof originalTuning.personalFitWeight === 'number',
    'Admin tuning did not return the active config.',
  );
  const changedPersonalWeight =
    originalTuning.personalFitWeight === 1.1 ? 1 : 1.1;
  const changedTuning = await request('/recommendation-sessions/admin/tuning', {
    method: 'PATCH',
    token: adminAuth.accessToken,
    body: JSON.stringify({
      personalFitWeight: changedPersonalWeight,
      maxRecommendations: originalTuning.maxRecommendations,
    }),
  });
  assert(
    changedTuning.personalFitWeight === changedPersonalWeight,
    'Admin tuning update did not persist the changed weight.',
  );

  const author = await request('/authors', {
    method: 'POST',
    token: adminAuth.accessToken,
    body: JSON.stringify({
      name: `Day 15 Smoke Author ${stamp}`,
      knownForGenres: ['Productivity'],
      outcomeStrengths: ['productivity'],
    }),
  });

  const createdBooks = [];
  for (let index = 0; index < 22; index += 1) {
    const book = await request('/books', {
      method: 'POST',
      token: adminAuth.accessToken,
      body: JSON.stringify({
        title: `Day 15 Smoke Page Book ${stamp} ${String(index).padStart(2, '0')}`,
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
        riskTags: ['pagination-smoke'],
      }),
    });
    createdBooks.push(book);
  }

  const pageOne = await request(
    `/books?q=Day%2015%20Smoke%20Page%20Book%20${stamp}&enrichmentStatus=imported&recommendationEligible=false&limit=10&offset=0`,
  );
  const pageTwo = await request(
    `/books?q=Day%2015%20Smoke%20Page%20Book%20${stamp}&enrichmentStatus=imported&recommendationEligible=false&limit=10&offset=10`,
  );
  assert(pageOne.total >= 22, 'Paginated smoke records were not all queryable.');
  assert(pageOne.items.length === 10, 'First paginated book queue was not full.');
  assert(pageTwo.items.length === 10, 'Second paginated book queue was not full.');
  assert(
    !pageOne.items.some((item) =>
      pageTwo.items.some((nextItem) => nextItem._id === item._id),
    ),
    'Paginated book queue returned overlapping pages.',
  );

  for (const book of createdBooks) {
    await request(`/books/${book._id}`, {
      method: 'DELETE',
      token: adminAuth.accessToken,
    });
  }
  await request(`/authors/${author._id}`, {
    method: 'DELETE',
    token: adminAuth.accessToken,
  });
  await request('/recommendation-sessions/admin/tuning', {
    method: 'PATCH',
    token: adminAuth.accessToken,
    body: JSON.stringify({
      behaviorFitWeight: originalTuning.behaviorFitWeight,
      contextFitWeight: originalTuning.contextFitWeight,
      dnfRiskWeight: originalTuning.dnfRiskWeight,
      maxRecommendations: originalTuning.maxRecommendations,
      outcomeFitWeight: originalTuning.outcomeFitWeight,
      personalFitWeight: originalTuning.personalFitWeight,
      timeFitWeight: originalTuning.timeFitWeight,
    }),
  });

  console.log(
    [
      'Day 15 API smoke passed:',
      '- admin analytics endpoint returned catalog and feedback totals',
      '- admin tuning read/update/restore completed',
      '- paginated /admin/books backing queue returned non-overlapping pages',
    ].join('\n'),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
