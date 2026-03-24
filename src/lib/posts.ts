import { boardPosts, categoryOrder, type BoardCategory, type BoardPost } from "@/data/posts";

type FilterOptions = {
  category?: string;
  query?: string;
};

export function getAllPosts(): BoardPost[] {
  return [...boardPosts].sort((left, right) => {
    if (Boolean(left.pinned) !== Boolean(right.pinned)) {
      return left.pinned ? -1 : 1;
    }

    return right.publishedAt.localeCompare(left.publishedAt);
  });
}

export function getPostBySlug(slug: string): BoardPost | undefined {
  return boardPosts.find((post) => post.slug === slug);
}

export function getCategories(): string[] {
  const available = new Set(boardPosts.map((post) => post.category));
  return categoryOrder.filter((category) => category === "전체" || available.has(category as BoardCategory));
}

export function filterPosts({ category = "전체", query = "" }: FilterOptions): BoardPost[] {
  const normalizedCategory = getCategories().includes(category) ? category : "전체";
  const normalizedQuery = query.trim().toLowerCase();

  return getAllPosts().filter((post) => {
    const matchesCategory = normalizedCategory === "전체" || post.category === normalizedCategory;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      post.title.toLowerCase().includes(normalizedQuery) ||
      post.summary.toLowerCase().includes(normalizedQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    return matchesCategory && matchesQuery;
  });
}

export function getRelatedPosts(post: BoardPost, limit = 3): BoardPost[] {
  return getAllPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .sort((left, right) => {
      const leftScore = scoreRelatedness(post, left);
      const rightScore = scoreRelatedness(post, right);
      return rightScore - leftScore;
    })
    .slice(0, limit);
}

export function formatBoardDate(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export function getCategoryCount(category: string): number {
  if (category === "전체") {
    return boardPosts.length;
  }

  return boardPosts.filter((post) => post.category === category).length;
}

function scoreRelatedness(source: BoardPost, candidate: BoardPost): number {
  let score = 0;

  if (source.category === candidate.category) {
    score += 3;
  }

  for (const tag of candidate.tags) {
    if (source.tags.includes(tag)) {
      score += 2;
    }
  }

  return score;
}
