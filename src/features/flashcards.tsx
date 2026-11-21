import { words } from '../content/curriculum';
import { Speak } from './shared';

export function Flashcards({ index, flipped, flip, rate }: {
  index: number;
  flipped: boolean;
  flip: () => void;
  rate: (remembered: boolean) => void;
}) {
  const word = words[index];
  if (!word) return <h1>Chưa có flashcard</h1>;
  return <>
    <div className="row"><h1>🃏 Flashcard</h1><span className="pill">{index + 1}/{words.length}</span></div>
    <p className="muted">Chạm vào thẻ để xem nghĩa. Chọn “Đã nhớ” để lên lịch ôn tập.</p>
    <button className="flash" onClick={flip} aria-pressed={flipped}>
      {flipped ? <>
        <span className="flash-title">{word.meaning}</span>
        <strong lang="zh-Hans">{word.example.hanzi}</strong>
        <span className="flash-detail">{word.example.pinyin}</span>
        <span className="flash-detail">{word.example.meaning}</span>
      </> : <>
        <span className="hanzi" lang="zh-Hans">{word.hanzi}</span>
        <span className="flash-title">{word.pinyin}</span>
      </>}
      <small className="muted">↻ Chạm để lật thẻ</small>
    </button>
    <div className="row">
      <Speak word={word} label="🔊 Phát âm" />
      <button className="btn orange" onClick={() => rate(false)}>🔁 Chưa nhớ</button>
      <button className="btn" onClick={() => rate(true)}>✓ Đã nhớ</button>
    </div>
  </>;
}
