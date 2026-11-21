# Chinese Quest · 小中文

Website tự học tiếng Trung bằng tiếng Việt. Bản Next.js giữ 18 từ vựng và 3 bài học mẫu HSK 1–2, cùng Dashboard, Flashcard, Quiz, lịch ôn và theo dõi tiến độ. Dữ liệu mẫu hiện tại chưa phải giáo trình đầy đủ theo chuẩn HSK 3.0.

## Chạy trên máy

Dùng [Node.js 26.x hoặc 24 LTS](https://nodejs.org/) với npm 11.x. Nếu máy đã có Node.js 26.13.1 và npm 11.20.0, dùng trực tiếp hai phiên bản đó. Cài [Git](https://git-scm.com/downloads) và VS Code. VS Code có sẵn hỗ trợ TypeScript.

Nếu đã clone repo, mở thư mục trong VS Code và chạy trong **Terminal → New Terminal**:

```bash
git pull --ff-only
npm ci
npm run dev
```

Mở [localhost:3000](http://localhost:3000). Nhấn Ctrl+C trong terminal để dừng. Nếu Git chưa được clone, chạy `git clone https://github.com/tranchanh973/personal-language-learning.git` rồi mở thư mục vừa tải về.

Kiểm tra TypeScript bằng `npm run check`, build bản production bằng `npm run build` và chạy bản build bằng `npm start`.

## Deploy Vercel

Trong Vercel chọn **Add New → Project**, kết nối GitHub và cấp quyền đọc repo private này. Import repo, giữ Framework Preset **Next.js**, Root Directory là thư mục gốc và Node.js **24.x**, rồi chọn **Deploy**. Ứng dụng dùng localStorage, nên không cần đặt biến môi trường hay kết nối cơ sở dữ liệu.

## Chuyển tiến độ từ bản HTML

Ở bản HTML, mở **Ôn tập → Xuất tiến độ JSON**. Trên bản Next.js, mở **Ôn tập → Nhập tiến độ** và chọn tệp vừa tải. LocalStorage được tách theo giao thức, tên miền và cổng. Bản Next.js đọc được cả tệp JSON từ mẫu đầu tiên và định dạng ID của bản HTML trên GitHub.

## Kiến trúc

- `src/app/` chứa App Router, bố cục và metadata.
- `src/content/` chứa từ vựng và bài học có ID cố định, chữ giản thể, pinyin và nghĩa tiếng Việt.
- `src/features/` chứa từng màn hình học và các thành phần dùng chung.
- `src/progress/` xử lý lưu, chuyển đổi tiến độ, XP và lịch ôn.
- `src/styles/` chứa CSS dùng chung cho desktop và mobile.

Giai đoạn tiếp theo là đối chiếu nội dung theo từng cấp của HSK 3.0, xây bài học theo chủ đề và dùng chung kho từ vựng giữa lộ trình, Flashcard, Quiz và Ôn tập.
