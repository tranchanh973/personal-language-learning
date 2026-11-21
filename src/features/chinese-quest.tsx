'use client';

import { useEffect, useRef, useState } from 'react';
import { words } from '../content/curriculum';
import { finishLesson, isDue, parseBackup, recordWord } from '../progress/model';
import { useProgress } from '../progress/use-progress';
import { Dashboard } from './dashboard';
import { Flashcards } from './flashcards';
import { LearningPath } from './learning-path';
import { createQuestion, Quiz, type Question } from './quiz';
import { Reviews } from './reviews';
import { Vocabulary } from './vocabulary';

const tabs = [
  ['home', '🏠', 'Trang chủ'],
  ['lessons', '📚', 'Bài học'],
  ['words', '🀄', 'Từ vựng'],
  ['flash', '🃏', 'Flashcard'],
  ['quiz', '🎯', 'Quiz'],
  ['review', '🔁', 'Ôn tập'],
] as const;
type Tab = typeof tabs[number][0];

export function ChineseQuest() {
  const { progress, setProgress, ready, storageError, restoreProgress } = useProgress();
  const [tab, setTab] = useState<Tab>('home');
  const [level, setLevel] = useState('all');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const selectedQuestion = useRef<Question | null>(null);
  const [revealed, setRevealed] = useState<ReadonlySet<string>>(() => new Set());
  const [message, setMessage] = useState('');
  const [now, setNow] = useState(0);
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    refresh();
    const timer = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  const due = words.filter(word => isDue(progress, word.id, now));
  const learnedCount = words.filter(word => progress.learned.includes(word.id)).length;

  function nextQuestion() {
    selectedQuestion.current = null;
    setQuestion(createQuestion(question?.word.id));
  }

  function go(next: Tab) {
    setTab(next);
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

  function rateFlash(remembered: boolean) {
    const word = words[cardIndex];
    if (!ready || !word) return;
    const date = Date.now();
    setNow(date);
    setProgress(current => recordWord(current, word.id, remembered, 'flash', date));
    setCardIndex((cardIndex + 1) % words.length);
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
    try {
      const imported = parseBackup(await file.text());
      restoreProgress(imported);
      setNow(Date.now());
      setRevealed(new Set());
      setMessage('Đã nhập tiến độ!');
    } catch {
      setMessage('Tệp tiến độ không hợp lệ.');
    }
  }

  const navigation = tabs.map(([id, icon, label]) => <button key={id}
    className={tab === id ? 'active' : undefined} aria-current={tab === id ? 'page' : undefined}
    onClick={() => go(id)}>{icon} {label}</button>);

  return <>
    <div className="app">
      <aside className="sidebar"><div className="logo">🐼 <span lang="zh-Hans">小中文</span></div>
        <nav className="nav" aria-label="Điều hướng chính">{navigation}</nav>
      </aside>
      <main className="main">
        <header className="top"><strong>🇨🇳 Chinese Quest <span className="muted">· HSK 1–2</span></strong>
          <span className="tag">⭐ {progress.xp} XP</span>
        </header>
        {storageError && <p role="status" className="feedback">Trình duyệt không tải hoặc lưu được tiến độ. Bạn có thể dùng tệp JSON để sao lưu.</p>}
        {tab === 'home' && <Dashboard progress={progress} dueCount={due.length} go={go} />}
        {tab === 'lessons' && <LearningPath completed={progress.completed} complete={id => {
          if (!ready) return;
          const date = Date.now();
          setProgress(current => finishLesson(current, id, date));
        }} />}
        {tab === 'words' && <Vocabulary level={level} changeLevel={setLevel} learned={progress.learned} />}
        {tab === 'flash' && <Flashcards index={cardIndex} flipped={flipped} flip={() => setFlipped(!flipped)} rate={rateFlash} />}
        {tab === 'quiz' && <Quiz question={question} answer={answer} next={nextQuestion} />}
        {tab === 'review' && <Reviews due={due} learnedCount={learnedCount} progress={progress} revealed={revealed}
          reveal={id => setRevealed(previous => new Set(previous).add(id))} rate={rateReview}
          exportBackup={exportBackup} importBackup={importBackup} message={message} />}
      </main>
    </div>
    <nav className="footer-nav" aria-label="Điều hướng di động">{navigation}</nav>
  </>;
}
