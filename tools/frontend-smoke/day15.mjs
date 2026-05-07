import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function includesAll(source, expectations) {
  for (const expectation of expectations) {
    assert(source.includes(expectation), `Missing frontend contract: ${expectation}`);
  }
}

const appSource = await readFile(resolve(root, 'apps/web/src/App.tsx'), 'utf8');
const apiSource = await readFile(resolve(root, 'apps/web/src/lib/api.ts'), 'utf8');
const querySource = await readFile(
  resolve(root, 'apps/web/src/lib/queries.ts'),
  'utf8',
);

includesAll(appSource, [
  'Progress %',
  'Feedback note',
  'candidate.feedback?.progressPercent',
  'candidate.feedback?.note',
  'const bookPageSize = 20',
  'setBookOffset((current) => current + bookPageSize)',
  'Math.max(0, current - bookPageSize)',
  'path="/admin/tuning"',
  'type="range"',
  'Save tuning',
]);

includesAll(apiSource, [
  'RecommendationTuning',
  '/recommendation-sessions/admin/tuning',
  'updateRecommendationTuning',
]);

includesAll(querySource, [
  "['admin', 'recommendation-tuning']",
  'useRecommendationTuning',
  'useUpdateRecommendationTuning',
]);

console.log(
  [
    'Day 15 frontend smoke passed:',
    '- recommendation feedback note/progress controls are present',
    '- admin book review pagination controls update offset by page size',
    '- admin tuning route, API client, and React Query hooks are wired',
  ].join('\n'),
);
