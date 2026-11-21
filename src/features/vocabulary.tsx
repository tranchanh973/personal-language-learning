import { words } from '../content/curriculum';
import { Speak } from './shared';

const levels = [...new Set(words.map(word => word.level))];

export function Vocabulary({ level, changeLevel, learned }: {
  level: string;
  changeLevel: (level: string) => void;
  learned: readonly string[];
}) {
  return <>
    <div className="row">
      <div><h1>🀄 Kho từ vựng</h1><p className="muted">{words.length} từ mẫu · chữ Hán, Pinyin, nghĩa và ví dụ</p></div>
      <select aria-label="Cấp độ từ vựng" value={level} onChange={event => changeLevel(event.target.value)}>
        <option value="all">Tất cả</option>
        {levels.map(item => <option key={item}>{item}</option>)}
      </select>
    </div>
    <div className="wordgrid">
      {words.filter(word => level === 'all' || word.level === level).map(word => <article className="card" key={word.id}>
        <span className="pill">{word.level}</span>
        <div className="hanzi" lang="zh-Hans">{word.hanzi}</div>
        <b>{word.pinyin}</b><p>{word.meaning}</p>
        <p className="muted word-footer"><span lang="zh-Hans">{word.example.hanzi}</span><br />
          {word.example.pinyin}<br />{word.example.meaning}</p>
        <div className="row"><Speak word={word} />{learned.includes(word.id) && <span>✅ Đã học</span>}</div>
      </article>)}
    </div>
  </>;
}
