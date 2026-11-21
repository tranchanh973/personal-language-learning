import { lessons, words, type Word } from '../content/curriculum';
import type { Progress } from '../progress/model';
import { Metric } from './shared';

export function Reviews({ due, learnedCount, progress, revealed, reveal, rate, exportBackup, importBackup, message,
  pendingBackup, confirmBackup, cancelBackup }: {
  due: readonly Word[];
  learnedCount: number;
  progress: Progress;
  revealed: ReadonlySet<string>;
  reveal: (id: string) => void;
  rate: (id: string, correct: boolean) => void;
  exportBackup: () => void;
  importBackup: (file: File) => Promise<void>;
  message: string;
  pendingBackup: Progress | null;
  confirmBackup: () => void;
  cancelBackup: () => void;
}) {
  const accuracy = progress.quizTotal ? Math.round(100 * progress.quizCorrect / progress.quizTotal) : 0;
  return <>
    <h1>🔁 Ôn tập thông minh</h1>
    <p className="muted">Lịch lặp lại ngắt quãng theo các mốc 1, 3, 7, 14 và 30 ngày. Từ chưa nhớ có thể ôn lại ngay.</p>
    <div className="grid">
      <Metric label="Đến hạn ôn">{due.length}</Metric>
      <Metric label="Đã ghi nhớ">{learnedCount}</Metric>
      <Metric label="Quiz đúng">{accuracy}%</Metric>
    </div>
    {due.length ? <div className="wordgrid">{due.map(word => <article className="card" key={word.id}>
      <div className="hanzi" lang="zh-Hans">{word.hanzi}</div><b>{word.pinyin}</b>
      {revealed.has(word.id) ? <>
        <p>{word.meaning}</p>
        <div className="row">
          <button className="btn" onClick={() => rate(word.id, true)}>✓ Đã nhớ</button>
          <button className="btn secondary" onClick={() => rate(word.id, false)}>Ôn lại</button>
        </div>
      </> : <p><button className="btn secondary" onClick={() => reveal(word.id)}>Xem nghĩa</button></p>}
    </article>)}</div> : <div className="card">🎉 Hiện không có từ đến hạn! Học flashcard để tạo lịch ôn mới.</div>}
    <p className="row backup-actions">
      <button className="btn secondary" onClick={exportBackup}>⬇️ Xuất tiến độ JSON</button>
      <label className="btn secondary">⬆️ Nhập tiến độ
        <input className="sr-only" type="file" accept=".json,application/json" onChange={event => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = '';
          if (file) void importBackup(file);
        }} />
      </label>
    </p>
    {pendingBackup && <section className="card backup-preview" aria-labelledby="backup-preview-title">
      <h3 id="backup-preview-title">Xác nhận nhập tiến độ</h3>
      <p role="status">Bản sao có {pendingBackup.xp} XP, {words.filter(word => pendingBackup.learned.includes(word.id)).length} từ đã học
        và {lessons.filter(lesson => pendingBackup.completed.includes(lesson.id)).length} bài đã hoàn thành.
        Nếu tiếp tục, bản sao sẽ thay tiến độ hiện tại trên trình duyệt này.</p>
      <div className="row backup-actions">
        <button className="btn secondary" onClick={cancelBackup}>Hủy</button>
        <button className="btn" onClick={confirmBackup}>Thay tiến độ</button>
      </div>
    </section>}
    {message && <p role="status">{message}</p>}
    <p className="muted">Tiến độ lưu trong trình duyệt này. Xuất bản sao để chuyển tiến độ sang thiết bị hoặc địa chỉ web khác.</p>
  </>;
}
