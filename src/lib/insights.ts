import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const insightsDirectory = path.join(process.cwd(), 'content/insights');

export type InsightData = {
  slug: string;
  title: string;
  date: string;
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
    summary: data.summary,
    tags: data.tags || [],
    project: data.project,
    content,
  };
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
        summary: data.summary,
        tags: data.tags,
        project: data.project,
      };
    })
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return insights;
}
