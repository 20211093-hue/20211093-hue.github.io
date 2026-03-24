import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllPosts, getPostBySlug, getRelatedPosts, formatBoardDate } from "@/lib/posts";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "글을 찾을 수 없습니다",
    };
  }

  return {
    title: `${post.title} | Hue Board`,
    description: post.summary,
  };
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post);

  return (
    <div className="detail-shell">
      <header className="panel detail-hero">
        <Link className="back-link" href="/">
          목록으로 돌아가기
        </Link>
        <div className="meta-row">
          <span className="pill">{post.category}</span>
          {post.pinned ? <span className="pill pill-strong">고정</span> : null}
          <span>{formatBoardDate(post.publishedAt)}</span>
        </div>
        <h1>{post.title}</h1>
        <p className="detail-summary">{post.summary}</p>
        <div className="detail-stats">
          <span>작성자 {post.author}</span>
          <span>조회 {post.views}</span>
        </div>
      </header>

      <section className="detail-layout">
        <article className="panel detail-article">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>

        <aside className="sidebar-column">
          <section className="panel side-card">
            <p className="eyebrow muted">Tags</p>
            <div className="tag-row">
              {post.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  #{tag}
                </span>
              ))}
            </div>
          </section>

          <section className="panel side-card">
            <p className="eyebrow muted">Related</p>
            <ul className="related-list">
              {relatedPosts.map((relatedPost) => (
                <li key={relatedPost.slug}>
                  <Link href={`/posts/${relatedPost.slug}`}>{relatedPost.title}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel side-card">
            <p className="eyebrow muted">Edit Guide</p>
            <p className="side-copy">
              글 본문은
              <code> src/data/posts.ts </code>
              에서 관리합니다. 배포형 개인 사이트나 프로젝트 아카이브용 게시판으로 쓰기
              좋은 구조입니다.
            </p>
          </section>
        </aside>
      </section>
    </div>
  );
}
