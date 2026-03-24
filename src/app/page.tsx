import Link from "next/link";

import { getAllPosts, getCategories, getCategoryCount, filterPosts, formatBoardDate } from "@/lib/posts";

type HomePageProps = {
  searchParams: Promise<{
    category?: string | string[];
    q?: string | string[];
  }>;
};

function pickSingleValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const activeCategory = pickSingleValue(params.category) || "전체";
  const query = pickSingleValue(params.q).trim();

  const allPosts = getAllPosts();
  const categories = getCategories();
  const posts = filterPosts({ category: activeCategory, query });
  const featuredPost = allPosts.find((post) => post.featured) ?? allPosts[0];

  return (
    <div className="app-shell">
      <header className="hero-grid">
        <section className="panel hero-panel accent-panel">
          <p className="eyebrow">GitHub + Vercel Board</p>
          <h1>
            게시판형 홈페이지를
            <br />
            바로 시작하는 템플릿
          </h1>
          <p className="hero-copy">
            GitHub 저장소로 코드를 관리하고, Vercel에서 자동 배포되는 Next.js 게시판
            홈페이지입니다. 지금 버전은 파일 기반 콘텐츠 구조라서 빠르게 시작하기 좋고,
            이후에는 DB형 게시판으로 확장할 수 있게 설계했습니다.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="https://github.com/20211093-hue/20211093-hue.github.io" target="_blank" rel="noreferrer">
              GitHub 저장소 보기
            </a>
            <a className="button-secondary" href="https://vercel.com/new" target="_blank" rel="noreferrer">
              Vercel에서 Import
            </a>
          </div>
        </section>

        <aside className="panel hero-panel stat-panel">
          <div className="panel-stack">
            <div>
              <p className="eyebrow muted">Featured</p>
              <h2 className="featured-title">{featuredPost.title}</h2>
              <p className="featured-summary">{featuredPost.summary}</p>
            </div>

            <div className="metric-grid">
              <article className="metric-card">
                <strong>{allPosts.length}</strong>
                <span>전체 글</span>
              </article>
              <article className="metric-card">
                <strong>{categories.length - 1}</strong>
                <span>카테고리</span>
              </article>
              <article className="metric-card">
                <strong>{featuredPost.views}</strong>
                <span>최다 조회</span>
              </article>
            </div>

            <Link className="feature-link" href={`/posts/${featuredPost.slug}`}>
              대표 글 열기
            </Link>
          </div>
        </aside>
      </header>

      <section className="dashboard-grid">
        <main className="content-column">
          <form className="panel filter-panel" action="/" method="get">
            <div className="filter-fields">
              <label className="field">
                <span>검색어</span>
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="제목, 요약, 태그로 검색"
                />
              </label>

              <label className="field field-select">
                <span>카테고리</span>
                <select name="category" defaultValue={categories.includes(activeCategory) ? activeCategory : "전체"}>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="filter-actions">
              <button className="button-primary" type="submit">
                필터 적용
              </button>
              <Link className="button-ghost" href="/">
                초기화
              </Link>
            </div>
          </form>

          <div className="section-head">
            <div>
              <p className="eyebrow muted">Board Feed</p>
              <h2>최신 게시글</h2>
            </div>
            <p className="section-meta">
              {posts.length}개의 글이 표시되고 있습니다.
            </p>
          </div>

          <div className="board-grid">
            {posts.map((post, index) => (
              <article
                key={post.slug}
                className={`panel board-card ${post.pinned ? "board-card-pinned" : ""}`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="meta-row">
                  <span className="pill">{post.category}</span>
                  {post.pinned ? <span className="pill pill-strong">고정</span> : null}
                  <span>{formatBoardDate(post.publishedAt)}</span>
                </div>
                <h3>
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h3>
                <p>{post.summary}</p>
                <div className="tag-row">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag-chip">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="card-footer">
                  <span>{post.author}</span>
                  <span>조회 {post.views}</span>
                </div>
              </article>
            ))}
          </div>

          {posts.length === 0 ? (
            <section className="panel empty-state">
              <h3>조건에 맞는 글이 없습니다</h3>
              <p>
                검색어를 줄이거나 카테고리를 전체로 바꿔 보세요. 글 데이터는
                <code> src/data/posts.ts </code>
                에서 직접 추가할 수 있습니다.
              </p>
            </section>
          ) : null}
        </main>

        <aside className="sidebar-column">
          <section className="panel side-card">
            <p className="eyebrow muted">Categories</p>
            <ul className="stat-list">
              {categories.map((category) => (
                <li key={category}>
                  <span>{category}</span>
                  <strong>{getCategoryCount(category)}</strong>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel side-card">
            <p className="eyebrow muted">Deploy Flow</p>
            <ol className="step-list">
              <li>GitHub 저장소에 현재 코드를 push합니다.</li>
              <li>Vercel에서 New Project로 저장소를 Import 합니다.</li>
              <li>Next.js 감지 후 바로 Deploy 합니다.</li>
              <li>main 브랜치 push마다 자동 재배포됩니다.</li>
            </ol>
          </section>

          <section className="panel side-card">
            <p className="eyebrow muted">How to Write</p>
            <p className="side-copy">
              지금 버전은 DB 없이 동작하는 게시판 MVP입니다. 글을 추가하려면
              <code> src/data/posts.ts </code>
              파일에 새 객체를 넣으면 됩니다. 방문자 글쓰기나 댓글이 필요해지면 그때
              Postgres와 인증을 붙이면 됩니다.
            </p>
          </section>
        </aside>
      </section>
    </div>
  );
}
