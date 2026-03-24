import Link from "next/link";

export default function NotFound() {
  return (
    <div className="detail-shell">
      <section className="panel empty-state">
        <p className="eyebrow muted">404</p>
        <h1>글을 찾을 수 없습니다</h1>
        <p>삭제되었거나 잘못된 주소일 수 있습니다. 목록으로 돌아가서 다시 확인하세요.</p>
        <Link className="button-primary" href="/">
          게시판 홈으로
        </Link>
      </section>
    </div>
  );
}
