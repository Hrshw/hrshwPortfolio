import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Heading anchors and table of contents.
//
// Heading ids are derived in two places — once while scanning the raw markdown
// for the table of contents, and once while rendering each heading — so both
// must run the exact same normalisation. Everything goes through the helpers
// in this module to keep those two paths in lockstep (no rehype-slug needed).
// ---------------------------------------------------------------------------

/** Remove inline markdown syntax so `\`code\`` and `**bold**` slug consistently. */
export function stripInlineMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/\*([^*]*)\*/g, '$1')
    .replace(/~~([^~]*)~~/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export function slugifyHeading(text: string): string {
  return stripInlineMarkdown(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export interface TocEntry {
  /** Heading depth — 2 for `##`, 3 for `###`. */
  depth: 2 | 3;
  text: string;
  id: string;
}

/**
 * Collect the `##` and `###` headings from raw markdown, skipping anything
 * inside fenced code blocks (the posts contain plenty of ``` blocks).
 */
export function extractHeadings(markdown: string): TocEntry[] {
  const headings: TocEntry[] = [];
  let inFence = false;

  for (const line of markdown.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const text = stripInlineMarkdown(match[2]);
    if (!text) continue;

    headings.push({
      depth: match[1].length as 2 | 3,
      text,
      id: slugifyHeading(text),
    });
  }

  return headings;
}

/** Extract plain text from rendered React children (for deriving heading ids). */
export function nodeToText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join('');
  if (typeof node === 'object' && 'props' in node) {
    return nodeToText(
      (node as { props?: { children?: ReactNode } }).props?.children
    );
  }
  return '';
}

/** Rough reading time in whole minutes for a markdown document. */
export function readingTimeMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function wordCount(markdown: string): number {
  return markdown.trim().split(/\s+/).filter(Boolean).length;
}
