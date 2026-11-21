import { useState } from 'react';
import { lessons } from '../content/curriculum';
import { Speak } from './shared';

const levels = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4'] as const;

export function LearningPath({ completed, complete }: {
  completed: readonly string[];
  complete: (id: string) => void;
}) {
  const [level, setLevel] = useState('all');
  const visibleLessons = lessons.filter(lesson => level === 'all' || lesson.level === level);

  return <>
    <div className="row">
      <div>
        <h1>📚 Lộ trình học HSK 1–4</h1>
        <p className="muted">{visibleLessons.length} bài · Mẫu câu và tình huống giao tiếp</p>
      </div>
      <label className="row">
        Cấp luyện
        <select value={level} onChange={event => setLevel(event.target.value)}>
          <option value="all">Tất cả</option>
          {levels.map(item => <option key={item}>{item}</option>)}
        </select>
      </label>
    </div>
    {visibleLessons.map((lesson, index) => {
      const done = completed.includes(lesson.id);
      return <article className="card lesson" key={lesson.id} id={`lesson-${lesson.id}`} tabIndex={-1}>
        <div className="row"><h3>{index + 1}. {lesson.title}</h3><span className="pill">{lesson.level}</span></div>
        {'example' in lesson ? <>
          <p><strong lang="zh-Hans">{lesson.example.hanzi}</strong><br />
            <span className="muted">{lesson.example.pinyin}</span><br />
            {lesson.example.meaning}
          </p>
          <Speak word={lesson.example} label="🔊 Nghe câu mẫu" />
        </> : <p>{lesson.text}</p>}
        <p className="muted">{lesson.note}</p>
        {'practice' in lesson && <p><strong>Tập nói</strong> · {lesson.practice}</p>}
        <button className={done ? 'btn secondary' : 'btn'} disabled={done} onClick={() => complete(lesson.id)}>
          {done ? '✓ Đã hoàn thành' : '✓ Đánh dấu hoàn thành (+20 XP)'}
        </button>
      </article>;
    })}
  </>;
}
