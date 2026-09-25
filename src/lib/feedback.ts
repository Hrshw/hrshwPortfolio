import { store } from '@/lib/store';

// ---------------------------------------------------------------------------
// Testimonial storage helpers (server-only).
//
// Shared by the public API route and by the /testimonials page, which now
// renders approved testimonials on the server so the quotes are present in the
// HTML. They previously arrived via a client-side fetch, which meant search
// engines saw an empty grid.
// ---------------------------------------------------------------------------

export const FEEDBACKS_KEY = 'feedbacks';

/** Internal record as persisted (includes private fields). */
export interface Feedback {
  id: string;
  name: string;
  role: string;
  rating: number;
  message: string;
  approved: boolean;
  createdAt: string;
  ipHash: string;
  linkedinUrl?: string;
  project?: string;
}

/** Public shape — private fields never leave the server. */
export interface PublicFeedback {
  id: string;
  name: string;
  role: string;
  rating: number;
  message: string;
  createdAt: string;
  linkedinUrl?: string;
  project?: string;
}

/**
 * Approved testimonials, newest first, in the public shape.
 *
 * Never throws: if the store is unreachable (or no Redis is configured and the
 * in-memory fallback is empty) the page renders with no testimonials instead of
 * failing the build or the request.
 */
export async function getApprovedFeedback(): Promise<PublicFeedback[]> {
  try {
    const raw = await store.listGetAll<Feedback>(FEEDBACKS_KEY);

    return raw
      .filter((f) => f && f.approved)
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map((f) => ({
        id: f.id,
        name: f.name,
        role: f.role,
        rating: f.rating,
        message: f.message,
        createdAt: f.createdAt,
        ...(f.linkedinUrl ? { linkedinUrl: f.linkedinUrl } : {}),
        ...(f.project ? { project: f.project } : {}),
      }));
  } catch (err) {
    console.error('[feedback:getApprovedFeedback]', err);
    return [];
  }
}
