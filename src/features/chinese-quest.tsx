'use client';

import { useEffect, useRef, useState } from 'react';
import { words, type Level } from '../content/curriculum';
import { finishLesson, isDue, parseBackup, recordWord, type Progress } from '../progress/model';
import { useProgress } from '../progress/use-progress';
import { Dashboard } from './dashboard';
import { Flashcards } from './flashcards';
import { LearningPath } from './learning-path';
import { createQuestion, Quiz, type Question } from './quiz';
import { Reviews } from './reviews';
import { Vocabulary } from './vocabulary';

const navIcons = {
  home: <path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 21v-8h6v8"/>,
  lessons: <path d="M12 6v15m0-15C9 3 6 3 3 4v14c3-1 6-1 9 3 3-4 6-4 9-3V4c-3-1-6-1-9 2z"/>,
  words: <path d="M4 5h16v14H4zM8 9h8m-8 4h5"/>,
  flash: <><rect x="7" y="6" width="13" height="15" rx="2"/><path d="M4 17V5a2 2 0 0 1 2-2h12m-5 7v7m-3.5-3.5h7"/></>,
  quiz: <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
  review: <path d="M20 5v5h-5M4 19v-5h5m11-4a8 8 0 0 0-14-4m-2 8a8 8 0 0 0 14 4"/>,
};

const tabs = [
  ['home', 'Trang chủ'],
  ['lessons', 'Bài học'],
  ['words', 'Từ vựng'],
  ['flash', 'Flashcard'],
  ['quiz', 'Quiz'],
  ['review', 'Ôn tập'],
] as const;
type Tab = typeof tabs[number][0];

function filterStudyWords(level: Level | 'all', factoryOnly: boolean) {
  return words.filter(word => (level === 'all' || word.level === level) && (!factoryOnly || word.factory));
}

export function ChineseQuest({ background }: { background?: string }) {
  const { progress, setProgress, ready, storageError, restoreProgress } = useProgress();
  const [tab, setTab] = useState<Tab>('home');
  const [lessonTarget, setLessonTarget] = useState<string>();
  const [level, setLevel] = useState<Level | 'all'>('all');
  const [factoryOnly, setFactoryOnly] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const selectedQuestion = useRef<Question | null>(null);
  const [revealed, setRevealed] = useState<ReadonlySet<string>>(() => new Set());
  const backupRequest = useRef(0);
  const [pendingBackup, setPendingBackup] = useState<Progress | null>(null);
  const [message, setMessage] = useState('');
  const [now, setNow] = useState(0);
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    refresh();
    const timer = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!lessonTarget) return;
    const lesson = document.getElementById(`lesson-${lessonTarget}`);
    lesson?.focus({ preventScroll: true });
    lesson?.scrollIntoView({ block: 'start' });
  }, [lessonTarget]);
  const due = words.filter(word => isDue(progress, word.id, now));
  const learnedCount = words.filter(word => progress.learned.includes(word.id)).length;

  const studyWords = filterStudyWords(level, factoryOnly);

  function nextQuestion() {
    selectedQuestion.current = null;
    setQuestion(createQuestion(studyWords, question?.word.id));
  }

  function go(next: Tab, lessonId?: string) {
    setTab(next);
    setLessonTarget(lessonId);
    backupRequest.current += 1;
    setPendingBackup(null);
    setMessage('');
    setNow(Date.now());
    setRevealed(new Set());
    if (next === 'quiz' && !question) nextQuestion();
    window.scrollTo(0, 0);
  }

  function answer(id: string) {
    if (!ready || !question || question.selected !== null || selectedQuestion.current === question ||
        !question.choices.some(choice => choice.id === id)) return;
    selectedQuestion.current = question;
    setQuestion({ ...question, selected: id });
    const date = Date.now();
    setNow(date);
    setProgress(current => recordWord(current, question.word.id, id === question.word.id, 'quiz', date));
  }

  function changeStudyFilter(nextLevel: Level | 'all', nextFactoryOnly: boolean) {
    setLevel(nextLevel);
    setFactoryOnly(nextFactoryOnly);
    setCardIndex(0);
    setFlipped(false);
    selectedQuestion.current = null;
    setQuestion(tab === 'quiz' ? createQuestion(filterStudyWords(nextLevel, nextFactoryOnly)) : null);
  }

  function rateFlash(remembered: boolean) {
    const word = studyWords[cardIndex];
    if (!ready || !word || !flipped) return;
    const date = Date.now();
    setNow(date);
    setProgress(current => recordWord(current, word.id, remembered, 'flash', date));
    setCardIndex((cardIndex + 1) % studyWords.length);
    setFlipped(false);
  }

  function rateReview(id: string, remembered: boolean) {
    if (!ready || !revealed.has(id)) return;
    const date = Date.now();
    setNow(date);
    setRevealed(new Set([...revealed].filter(item => item !== id)));
    setProgress(current => recordWord(current, id, remembered, 'review', date));
  }

  function exportBackup() {
    const data = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chinese-quest-progress.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  async function importBackup(file: File) {
    const request = ++backupRequest.current;
    setPendingBackup(null);
    try {
      const imported = parseBackup(await file.text());
      if (request !== backupRequest.current) return;
      setMessage('');
      setPendingBackup(imported);
    } catch {
      if (request === backupRequest.current) setMessage('Tệp tiến độ không hợp lệ.');
    }
  }

  function confirmBackup() {
    if (!pendingBackup) return;
    restoreProgress(pendingBackup);
    setNow(Date.now());
    setRevealed(new Set());
    setPendingBackup(null);
    setMessage('Đã nhập tiến độ!');
  }

  const navigation = tabs.map(([id, label]) => <button key={id}
    className={tab === id ? 'active' : undefined} aria-current={tab === id ? 'page' : undefined}
    onClick={() => go(id)}>
    <span className="nav-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {navIcons[id]}
      </svg>
    </span>
    <span>{label}</span>
  </button>);

  return <>
    <div className="app">
      <aside className="sidebar"><div className="logo">
        <span className="logo-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8.5" />
            <path d="m15.7 8.3-2.1 5.3-5.3 2.1 2.1-5.3z" fill="currentColor" />
          </svg>
        </span>
        <span lang="en">Chinese Quest</span>
      </div>
        <nav className="nav" aria-label="Điều hướng chính">{navigation}</nav>
      </aside>
      <div className={background ? 'content content-with-background' : 'content'}
        style={background ? { backgroundImage: `linear-gradient(#f4f7fbad, #f4f7fbd9), url(${background})` } : undefined}>
        <main className="main">
          <header className="top"><strong>🇨🇳 Chinese Quest <span className="muted">· HSK 1–4</span></strong>
            <span className="tag">⭐ {progress.xp} XP</span>
          </header>
          {storageError && <p role="status" className="feedback">Trình duyệt không tải hoặc lưu được tiến độ. Bạn có thể dùng tệp JSON để sao lưu.</p>}
          {tab === 'home' && <Dashboard progress={progress} dueCount={due.length} go={go} />}
          {tab === 'lessons' && <LearningPath completed={progress.completed} complete={id => {
            if (!ready) return;
            const date = Date.now();
            setProgress(current => finishLesson(current, id, date));
          }} />}
          {(tab === 'words' || tab === 'flash' || tab === 'quiz') && <div className="study-filters card">
            <label>Cấp luyện
              <select value={level} onChange={event => changeStudyFilter(event.target.value as Level | 'all', factoryOnly)}>
                <option value="all">Tất cả</option>
                {(['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4'] as const).map(item => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label><input type="checkbox" checked={factoryOnly}
              onChange={event => changeStudyFilter(level, event.target.checked)} /> Chỉ từ dùng ở nhà máy</label>
          </div>}
          {tab === 'words' && <Vocabulary words={studyWords} learned={progress.learned} />}
          {tab === 'flash' && <Flashcards words={studyWords} index={cardIndex} flipped={flipped} flip={() => setFlipped(!flipped)} rate={rateFlash} />}
          {tab === 'quiz' && <Quiz question={question} answer={answer} next={nextQuestion} />}
          {tab === 'review' && <Reviews due={due} learnedCount={learnedCount} progress={progress} revealed={revealed}
            reveal={id => setRevealed(previous => new Set(previous).add(id))} rate={rateReview}
            exportBackup={exportBackup} importBackup={importBackup} message={message}
            pendingBackup={pendingBackup} confirmBackup={confirmBackup} cancelBackup={() => setPendingBackup(null)} />}
        </main>
      </div>
    </div>
    <nav className="footer-nav" aria-label="Điều hướng di động">{navigation}</nav>
  </>;
}
