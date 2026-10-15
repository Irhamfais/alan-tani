// Server-only: reads content/articles/*.md at build time. Do not import from client components;
// pass the result down as props instead (see app/page.tsx).
import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import type { Article } from './types';
import { formatDateId } from './utils/format';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

/** Minimal frontmatter parser for flat `key: "value"` pairs. */
function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('Article is missing frontmatter');
  const meta: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*"?(.*?)"?\s*$/);
    if (kv) meta[kv[1]] = kv[2];
  }
  return { meta, body: match[2] };
}

function renderBody(markdown: string): string {
  return (marked.parse(markdown, { async: false }) as string)
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"')
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, '</table></div>')
    .replace(/(<h2>Sumber<\/h2>\s*)<ul>/, '$1<ul class="sources">');
}

function readArticle(file: string): Article {
  const { meta, body } = parseFrontmatter(fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8'));
  const required = ['id', 'slug', 'title', 'excerpt', 'category', 'featuredImage', 'publishedDate', 'readingTime'];
  const missing = required.filter((k) => !meta[k]);
  if (missing.length) throw new Error(`${file}: missing frontmatter ${missing.join(', ')}`);

  return {
    id: meta.id,
    slug: meta.slug,
    title: meta.title,
    excerpt: meta.excerpt,
    category: meta.category,
    image: meta.featuredImage,
    publishedDate: meta.publishedDate,
    dateLabel: formatDateId(meta.publishedDate),
    readingTime: meta.readingTime,
    html: renderBody(body),
  };
}

let cache: Article[] | null = null;

/** All articles, newest first. */
export function getArticles(): Article[] {
  cache ??= fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(readArticle)
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
  return cache;
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug);
}
