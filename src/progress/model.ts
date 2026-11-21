export const progressKey = 'chinese-quest-mvp-v1';
const intervals = [1, 3, 7, 14, 30];
const dayMs = 86_400_000;

// Keep the order of IDs from the original unversioned prototype.
const legacyWords = [
  'ni-hao', 'xie-xie', 'wo', 'ni', 'shi', 'xue-sheng', 'lao-shi', 'xi-huan', 'he', 'shui',
  'peng-you', 'xue-xi', 'yin-wei', 'suo-yi', 'yi-jing', 'jue-de', 'yi-qi', 'yun-dong',
];
const legacyLessons = ['greetings', 'interests', 'cause-effect'];

interface Review {
  step: number;
  next: number;
}

export interface Progress {
  version: 2;
  xp: number;
  learned: string[];
  reviews: Record<string, Review>;
  completed: string[];
  days: string[];
  quizCorrect: number;
  quizTotal: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function count(value: unknown): number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

export function readProgress(raw: unknown): Progress {
  if (!isRecord(raw) || (raw.version !== undefined && raw.version !== 2)) {
    throw new Error('Phiên bản tiến độ không hợp lệ.');
  }
  const legacy = raw.version === undefined;
  function resolveId(value: unknown, ids: string[]) {
    if (!legacy) return typeof value === 'string' && value ? value : undefined;
    return (typeof value === 'string' || typeof value === 'number') && /^(0|[1-9]\d*)$/.test(String(value))
      ? ids[Number(value)] : undefined;
  }
  function normalizeIds(values: unknown, ids: string[]) {
    if (!Array.isArray(values)) return [];
    return [...new Set(values.map(value => resolveId(value, ids)).filter((id): id is string => !!id))];
  }
  const reviews: Array<[string, Review]> = [];
  if (isRecord(raw.reviews)) {
    for (const [key, review] of Object.entries(raw.reviews)) {
      const id = resolveId(key, legacyWords);
      if (!id || !isRecord(review)) continue;
      const { step, next } = review;
      if (typeof step === 'number' && Number.isInteger(step) && step >= 0 && step <= intervals.length &&
          typeof next === 'number' && Number.isFinite(next)) {
        reviews.push([id, { step, next }]);
      }
    }
  }
  const quizTotal = count(raw.quizTotal);
  return {
    version: 2,
    xp: count(raw.xp),
    learned: normalizeIds(raw.learned, legacyWords),
    reviews: Object.fromEntries(reviews),
    completed: normalizeIds(raw.completed, legacyLessons),
    days: Array.isArray(raw.days) ? [...new Set(raw.days.filter(day => typeof day === 'string'))] : [],
    quizCorrect: Math.min(count(raw.quizCorrect), quizTotal),
    quizTotal,
  };
}

export function parseBackup(text: string) {
  const raw: unknown = JSON.parse(text);
  if (!isRecord(raw) || !Array.isArray(raw.learned) || !Array.isArray(raw.completed) ||
      typeof raw.xp !== 'number' || count(raw.xp) !== raw.xp) {
    throw new Error('Tệp tiến độ không hợp lệ.');
  }
  return readProgress(raw);
}

export function isDue(progress: Progress, id: string, now: number) {
  const review = progress.reviews[id];
  return !!review && review.next <= now;
}

function award(progress: Progress, points: number, now: number): Progress {
  const day = new Date(now).toLocaleDateString('en-CA');
  return {
    ...progress,
    xp: progress.xp + points,
    days: progress.days.includes(day) ? progress.days : [...progress.days, day],
  };
}

export function finishLesson(progress: Progress, id: string, now: number) {
  if (progress.completed.includes(id)) return progress;
  return award({ ...progress, completed: [...progress.completed, id] }, 20, now);
}

export function recordWord(
  progress: Progress, id: string, correct: boolean, source: 'flash' | 'quiz' | 'review', now: number,
) {
  if (source === 'review' && !isDue(progress, id, now)) return progress;
  const previousReview = progress.reviews[id];
  const step = correct ? Math.min((previousReview?.step ?? 0) + 1, intervals.length) : 0;
  const next = now + (correct ? intervals[step - 1] * dayMs : 0);
  const reviews = previousReview && previousReview.next > now
    ? progress.reviews
    : { ...progress.reviews, [id]: { step, next } };
  const points = correct ? (source === 'quiz' ? 15 : 10) : (source === 'review' ? 0 : 2);
  return award({
    ...progress,
    learned: correct && !progress.learned.includes(id) ? [...progress.learned, id] : progress.learned,
    reviews,
    quizTotal: progress.quizTotal + Number(source === 'quiz'),
    quizCorrect: progress.quizCorrect + Number(source === 'quiz' && correct),
  }, points, now);
}
