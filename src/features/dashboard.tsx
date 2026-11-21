import { words, lessons } from '../content/curriculum';
import type { Progress } from '../progress/model';
import { Metric } from './shared';

type StartTab = 'lessons' | 'flash' | 'quiz';
const actions = [
  ['lessons', '📚 Học bài mới', 'Ngữ pháp có ví dụ dễ hiểu.', 'Học ngay'],
  ['flash', '🃏 Học flashcard', 'Ghi nhớ chữ Hán và Pinyin.', 'Lật thẻ'],
  ['quiz', '🎯 Làm quiz', 'Kiểm tra kiến thức, nhận XP.', 'Thử sức'],
] as const;

export function Dashboard({ progress, dueCount, go }: {
  progress: Progress;
  dueCount: number;
  go: (tab: StartTab) => void;
}) {
  const learned = words.filter(word => progress.learned.includes(word.id)).length;
  const completed = lessons.filter(lesson => progress.completed.includes(lesson.id)).length;
  const percent = words.length ? Math.round(100 * learned / words.length) : 0;
  return <>
    <section className="hero">
      <h1><span lang="zh-Hans">你好！</span> (nǐ hǎo) 👋</h1>
      <p>Chào mừng trở lại! Mỗi ngày một chút, tiếng Trung sẽ dễ hơn rất nhiều.</p>
      <button className="btn secondary" onClick={() => go('lessons')}>🚀 Bắt đầu học</button>
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
      <h2>✨ Nhiệm vụ hôm nay</h2>
      <div className="grid">
        {actions.map(([tab, title, description, label]) => <div className="card" key={tab}>
          <h3>{title}</h3><p className="muted">{description}</p>
          <button className={tab === 'quiz' ? 'btn orange' : 'btn'} onClick={() => go(tab)}>{label}</button>
        </div>)}
      </div>
    </section>
  </>;
}
