import { words, lessons } from '../content/curriculum';
import type { Progress } from '../progress/model';
import { Metric } from './shared';

type StartTab = 'lessons' | 'flash' | 'quiz' | 'review';
const actions = [
  ['flash', '🃏 Học flashcard', 'Ghi nhớ chữ Hán và Pinyin.', 'Lật thẻ'],
  ['quiz', '🎯 Làm quiz', 'Kiểm tra kiến thức, nhận XP.', 'Thử sức'],
] as const;

export function Dashboard({ progress, dueCount, go }: {
  progress: Progress;
  dueCount: number;
  go: (tab: StartTab, lessonId?: string) => void;
}) {
  const learned = words.filter(word => progress.learned.includes(word.id)).length;
  const completed = lessons.filter(lesson => progress.completed.includes(lesson.id)).length;
  const nextLesson = lessons.find(lesson => !progress.completed.includes(lesson.id));
  const percent = words.length ? Math.round(100 * learned / words.length) : 0;
  return <>
    <section className="hero">
      <h1><span lang="zh-Hans">你好！</span> (nǐ hǎo) 👋</h1>
      <div className="hero-action">
        <p>{dueCount ? 'Đến lúc ôn lại những từ bạn đã học.' : nextLesson?.title ?? 'Bạn đã hoàn thành tất cả bài học mẫu.'}</p>
        <button className="btn secondary" onClick={() => dueCount ? go('review') : go('lessons', nextLesson?.id)}>
          {dueCount ? `Ôn ${dueCount} từ` : nextLesson ? 'Tiếp tục học' : 'Xem lại bài học'}
        </button>
      </div>
    </section>
    <div className="grid">
      <Metric label="⚡ Tổng XP">{progress.xp}</Metric>
      <Metric label="🧠 Từ đã học">{learned}/{words.length}</Metric>
      <Metric label="🔥 Ngày đã học">{progress.days.length}</Metric>
    </div>
    <div className="card">
      <div className="row"><h3>🎯 Tiến độ từ vựng</h3><b>{percent}%</b></div>
      <div className="bar" role="progressbar" aria-label="Tiến độ từ vựng" aria-valuenow={percent}>
        <div className="fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="muted">{dueCount} từ đến hạn ôn · {completed}/{lessons.length} bài học hoàn thành</p>
    </div>
    <section className="section">
      <h2>Luyện thêm</h2>
      <div className="grid practice-grid">
        {actions.map(([tab, title, description, label]) => <div className="card" key={tab}>
          <h3>{title}</h3><p className="muted">{description}</p>
          <button className="btn secondary" onClick={() => go(tab)}>{label}</button>
        </div>)}
      </div>
    </section>
  </>;
}
