import type { Word } from '../content/curriculum';
import { Speak } from './shared';

export function Vocabulary({ words, learned }: { words: readonly Word[]; learned: readonly string[] }) {
  return <>
    <h1>Kho từ vựng</h1>
    <p className="muted">{words.length} từ · Chữ Hán, pinyin, nghĩa và ví dụ</p>
    <div className="wordgrid">
      {words.map(word => <article className="card" key={word.id}>
        <span className="pill">{word.level}</span>{word.factory && <span className="word-context">Nhà máy</span>}
        <div className="hanzi" lang="zh-Hans">{word.hanzi}</div>
        <b>{word.pinyin}</b><p>{word.meaning}</p>
        <p className="muted word-footer"><span lang="zh-Hans">{word.example.hanzi}</span><br />
          {word.example.pinyin}<br />{word.example.meaning}</p>
        <div className="row"><Speak word={word} />{learned.includes(word.id) && <span>✅ Đã học</span>}</div>
      </article>)}
    </div>
  </>;
}
