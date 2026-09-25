import { ImageResponse } from 'next/og';

// ---------------------------------------------------------------------------
// /og?title=…&eyebrow=…&subtitle=…
//
// Generates a unique 1200×630 social card per page so every URL in the SERP and
// on social has a distinct image instead of sharing one static file.
//
// The URL fully determines the output, so responses are immutable-cacheable.
// Inputs are length-capped: this endpoint renders at most a fixed-size card.
// ---------------------------------------------------------------------------

export const runtime = 'nodejs';

const MAX_TITLE = 120;
const MAX_EYEBROW = 40;
const MAX_SUBTITLE = 140;

/**
 * Satori only has a Latin font available by default, so normalise typography
 * that would otherwise render as missing-glyph boxes.
 */
function clean(input: string | null, max: number): string {
  if (!input) return '';
  return input
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/[\u00b7\u2022]/g, '/')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const title = clean(searchParams.get('title'), MAX_TITLE) || 'Rahul Singh Shekhawat';
  const eyebrow = clean(searchParams.get('eyebrow'), MAX_EYEBROW) || 'Full-Stack & Cloud Engineer';
  const subtitle = clean(searchParams.get('subtitle'), MAX_SUBTITLE);

  // Shrink long titles so they stay inside the card.
  const titleSize = title.length > 86 ? 54 : title.length > 60 ? 62 : 74;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '68px 72px',
          backgroundColor: '#05070d',
          backgroundImage:
            'radial-gradient(circle at 12% 0%, rgba(34,211,238,0.22), rgba(5,7,13,0) 55%), radial-gradient(circle at 92% 100%, rgba(167,139,250,0.20), rgba(5,7,13,0) 58%)',
          color: '#f4f6f8',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 3, backgroundColor: '#22d3ee', display: 'flex' }} />
          <div
            style={{
              fontSize: 24,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#22d3ee',
              fontWeight: 600,
            }}
          >
            {eyebrow}
          </div>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: -1.5,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div style={{ fontSize: 28, color: '#9aa3b2', maxWidth: 880, lineHeight: 1.35 }}>
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ width: 620, height: 1, backgroundColor: 'rgba(255,255,255,0.14)', display: 'flex' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 600, color: '#e2e8f0' }}>rahulshekhawat.dev</div>
            <div style={{ fontSize: 23, color: '#8b93a7' }}>
              Rahul Singh Shekhawat / AWS / Node.js / AI
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
  );
}
