import { lessons } from '../content/curriculum';

export function LearningPath({ completed, complete }: {
  completed: readonly string[];
  complete: (id: string) => void;
}) {
  return <>
    <h1>📚 Lộ trình học HSK 1–2</h1>
    <p className="muted">Học theo chủ đề, từ dễ đến khó.</p>
    {lessons.map((lesson, index) => {
      const done = completed.includes(lesson.id);
      return <article className="card lesson" key={lesson.id} id={`lesson-${lesson.id}`} tabIndex={-1}>
        <div className="row"><h3>{index + 1}. {lesson.title}</h3><span className="pill">{lesson.level}</span></div>
        <p>{lesson.text}</p><p className="muted">{lesson.note}</p>
        <button className={done ? 'btn secondary' : 'btn'} disabled={done} onClick={() => complete(lesson.id)}>
          {done ? '✓ Đã hoàn thành' : '✓ Đánh dấu hoàn thành (+20 XP)'}
        </button>
      </article>;
    })}
  </>;
}
