import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: '小中文 · Chinese Quest',
  description: 'Tự học tiếng Trung bằng tiếng Việt với bài học, flashcard, quiz và lịch ôn tập.',
};

export const viewport: Viewport = { viewportFit: 'cover' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="vi"><body>{children}</body></html>;
}
