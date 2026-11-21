import { words, type Word } from '../content/curriculum';
import { Speak } from './shared';

export interface Question {
  word: Word;
  choices: Word[];
  selected: string | null;
}

function shuffle<T>(items: readonly T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

export function createQuestion(previousId?: string): Question | null {
  const candidates = words.length > 1 ? words.filter(word => word.id !== previousId) : words;
  const word = candidates[Math.floor(Math.random() * candidates.length)];
  if (!word) return null;
  const distractors = new Map<string, Word>();
  for (const candidate of shuffle(words)) {
    if (candidate.meaning !== word.meaning) distractors.set(candidate.meaning, candidate);
  }
  return {
    word,
    choices: shuffle([word, ...Array.from(distractors.values()).slice(0, 3)]),
    selected: null,
  };
}

export function Quiz({ question, answer, next }: {
  question: Question | null;
  answer: (id: string) => void;
  next: () => void;
}) {
  if (!question) return <h1>Chưa có câu hỏi</h1>;
  const { word, choices, selected } = question;
  return <>
    <h1>🎯 Thử thách từ vựng</h1>
    <p className="muted">Chọn nghĩa tiếng Việt đúng. Mỗi đáp án đúng nhận 15 XP.</p>
    <div className="card">
      <span className="pill">{word.level}</span><p className="muted">Từ này có nghĩa là gì?</p>
      <div className="hanzi quiz-hanzi" lang="zh-Hans">{word.hanzi}</div>
      <h3>{word.pinyin} <Speak word={word} label="🔊" /></h3>
      {choices.map(choice => {
        const result = selected === null ? '' : choice.id === word.id ? ' correct' : choice.id === selected ? ' wrong' : '';
        return <button className={`choice${result}`} key={choice.id} disabled={selected !== null}
          onClick={() => answer(choice.id)}>{choice.meaning}</button>;
      })}
      {selected !== null && <>
        <div className="feedback" role="status">
          <b>{selected === word.id ? '🎉 Chính xác! +15 XP' : '💡 Chưa đúng, thử ghi nhớ nhé!'}</b>
          <p><span lang="zh-Hans">{word.hanzi}</span> ({word.pinyin}) — {word.meaning}</p>
          <p><span lang="zh-Hans">{word.example.hanzi}</span> ({word.example.pinyin}) — {word.example.meaning}</p>
        </div>
        <button className="btn" onClick={next}>Câu tiếp theo →</button>
      </>}
    </div>
  </>;
}
