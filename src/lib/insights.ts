import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const insightsDirectory = path.join(process.cwd(), 'content/insights');

export type InsightData = {
  slug: string;
  title: string;
  /** Original publication date, `YYYY-MM-DD` from frontmatter. */
  date: string;
  /**
   * Optional `updated` frontmatter field for posts that have been revised.
   * Used for `dateModified` and the sitemap's `lastModified` — never faked with
   * the build timestamp.
   */
  updated?: string;
  summary: string;
  tags: string[];
  project?: string;
  content: string;
};

export function getInsightSlugs() {
  if (!fs.existsSync(insightsDirectory)) {
    return [];
  }
  return fs.readdirSync(insightsDirectory);
}

export function getInsightBySlug(slug: string): InsightData {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(insightsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title,
    date: data.date,
    updated: data.updated,
    summary: data.summary,
    tags: data.tags || [],
    project: data.project,
    content,
  };
}

/**
 * Null-safe lookup. `getInsightBySlug` throws when the file is missing, which
 * turns an unknown /insights/<slug> URL into a 500. Callers that render pages
 * use this instead so they can return a real 404.
 */
export function getInsightBySlugOrNull(slug: string): InsightData | null {
  try {
    return getInsightBySlug(slug);
  } catch {
    return null;
  }
}

export interface InsightCard {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  summary: string;
  tags: string[];
  project?: string;
}

/**
 * Resolve a specific, ordered list of insight slugs into list-view cards.
 * Used to build the topic clusters on the technical focus-area pages.
 * Unknown slugs are skipped rather than throwing, so removing a post can never
 * break a page build.
 */
export function getInsightCards(slugs: string[]): InsightCard[] {
  return slugs.flatMap((slug) => {
    const insight = getInsightBySlugOrNull(slug);
    if (!insight) return [];
    // Built explicitly rather than by destructuring `content` off, so the
    // unused-variable lint rule stays quiet.
    return [
      {
        slug: insight.slug,
        title: insight.title,
        date: insight.date,
        updated: insight.updated,
        summary: insight.summary,
        tags: insight.tags,
        project: insight.project,
      },
    ];
  });
}

export function getAllInsights(): Omit<InsightData, 'content'>[] {
  const slugs = getInsightSlugs();
  const insights = slugs
    .map((slug) => {
      const data = getInsightBySlug(slug);
      // Omit content for lists
      return {
        slug: data.slug,
        title: data.title,
        date: data.date,
        updated: data.updated,
        summary: data.summary,
        tags: data.tags,
        project: data.project,
      };
    })
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return insights;
}
