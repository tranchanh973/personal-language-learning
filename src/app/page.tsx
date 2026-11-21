import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ChineseQuest } from '../features/chinese-quest';

export default function HomePage() {
  const filename = ['content-background.jpg', 'content-background.webp']
    .find(file => existsSync(join(process.cwd(), 'public', file)));
  const background = filename ? `/${filename}` : undefined;
  return <ChineseQuest background={background} />;
}
