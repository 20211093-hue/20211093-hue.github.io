# Hue Board

GitHub에서 버전 관리하고 Vercel에 바로 배포할 수 있는 Next.js 게시판형 홈페이지입니다.

## 현재 구조

- Next.js App Router 기반
- 파일 기반 게시글 데이터 관리: `src/data/posts.ts`
- 홈 목록 페이지 + 상세 페이지
- 카테고리 필터와 검색
- Vercel 즉시 배포 가능

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다.

## 글 추가 방법

게시글은 `src/data/posts.ts`에 들어 있습니다. 새 글 객체를 하나 추가하면 홈 목록과 상세 페이지가 함께 생성됩니다.

필드 설명:

- `slug`: URL 경로
- `title`: 글 제목
- `category`: `공지`, `프로젝트`, `질문`, `자유`
- `summary`: 목록 요약
- `content`: 본문 문단 배열
- `tags`: 태그 목록
- `publishedAt`: 날짜 문자열

## GitHub -> Vercel 배포

1. 현재 폴더를 GitHub 저장소에 push합니다.
2. Vercel에서 `New Project`를 선택합니다.
3. GitHub 저장소를 Import 합니다.
4. 프레임워크가 Next.js로 잡히는지 확인합니다.
5. `Deploy`를 누릅니다.

현재 버전은 데이터베이스 없이 동작하므로 필수 환경변수는 없습니다.

## 다음 확장 단계

방문자 글쓰기, 댓글, 로그인까지 필요한 진짜 게시판으로 확장하려면 다음을 추가하면 됩니다.

- 인증: GitHub 또는 이메일 로그인
- 데이터베이스: Postgres
- 관리자 글쓰기 화면
- 댓글 / 좋아요 / 조회수 실시간화

이 구조는 MVP로 빠르게 시작한 뒤 DB형 게시판으로 넘어가기 좋게 잡아 둔 상태입니다.
