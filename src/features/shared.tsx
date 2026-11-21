import type { ReactNode } from 'react';
import type { Translation } from '../content/curriculum';

export function Metric({ label, children }: { label: string; children: ReactNode }) {
  return <div className="card"><div className="muted">{label}</div><div className="metric">{children}</div></div>;
}

export function Speak({ word, label = '🔊 Nghe' }: { word: Pick<Translation, 'hanzi'>; label?: string }) {
  function speak() {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt chưa hỗ trợ đọc văn bản.');
      return;
    }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word.hanzi);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  }

  return <button className="btn secondary" onClick={speak} aria-label={`Nghe phát âm ${word.hanzi}`}>{label}</button>;
}
