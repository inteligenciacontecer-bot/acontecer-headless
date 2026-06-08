import { ImageResponse } from 'next/og';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const BRAND_OG_SIZE = { width: 1200, height: 630 };

type BrandOgCard = {
  label: string;
  value: string;
};

type BrandOgOptions = {
  kicker: string;
  title: string;
  subtitle: string;
  accentColor: string;
  cards: BrandOgCard[];
  footer?: string;
  variant?: 'gobierno' | 'servicios' | 'feriados' | 'restriccion' | 'loteria' | 'asamblea' | 'matutino';
};

function assetDataUrl(path: string, mime: string): string {
  try {
    const data = readFileSync(join(process.cwd(), 'public', path), 'base64');
    return `data:${mime};base64,${data}`;
  } catch {
    return '';
  }
}

function fontData(path: string): ArrayBuffer {
  const font = readFileSync(join(process.cwd(), 'public', path));
  return font.buffer.slice(font.byteOffset, font.byteOffset + font.byteLength);
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function variantPattern(variant: BrandOgOptions['variant'], accentColor: string) {
  if (variant === 'gobierno') {
    return (
      <div style={{ position: 'absolute', right: 54, bottom: 94, width: 380, height: 250, display: 'flex', gap: 16 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 108,
              height: 180 + i * 22,
              alignSelf: 'flex-end',
              display: 'flex',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.22)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.06))',
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'restriccion') {
    return (
      <div style={{ position: 'absolute', right: 80, bottom: 74, width: 330, height: 120, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          {['1', '2', '3'].map((n) => (
            <div key={n} style={{ width: 82, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, background: '#ffffff', color: '#0000A2', fontSize: 31, fontWeight: 800 }}>
              {n}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', height: 8, borderRadius: 999, background: '#ffffff', width: 330 }} />
        <div style={{ display: 'flex', height: 8, borderRadius: 999, background: accentColor, width: 220 }} />
      </div>
    );
  }

  if (variant === 'feriados') {
    return (
      <div style={{ position: 'absolute', right: 88, bottom: 74, width: 300, height: 124, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 82,
              height: 50,
              display: 'flex',
              borderRadius: 12,
              background: i === 4 ? accentColor : 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'loteria') {
    return (
      <div style={{ position: 'absolute', right: 86, bottom: 74, width: 315, height: 126, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[['42', '13', '96'], ['025', '709', '548']].map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', gap: 12 }}>
            {row.map((num) => (
              <div key={num} style={{ width: 84, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, background: rowIndex === 0 ? '#ffffff' : 'rgba(255,255,255,0.16)', color: rowIndex === 0 ? '#0000A2' : '#ffffff', fontSize: 24, fontWeight: 800 }}>
                {num}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'servicios') {
    return (
      <div style={{ position: 'absolute', right: 72, bottom: 86, width: 340, height: 132, display: 'flex', gap: 16 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: 74,
              height: 74 + (i % 2) * 30,
              alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end',
              display: 'flex',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'asamblea') {
    return (
      <div style={{ position: 'absolute', right: 78, bottom: 60, width: 318, height: 132, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end' }}>
          {[42, 68, 98, 58].map((height, i) => (
            <div
              key={height}
              style={{
                width: 60,
                height,
                display: 'flex',
                borderRadius: 12,
                background: i === 2 ? '#ffffff' : 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.18)',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {['57', 'Votos', 'Leyes'].map((label, i) => (
            <div
              key={label}
              style={{
                height: 38,
                padding: '0 15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 999,
                background: i === 0 ? accentColor : 'rgba(255,255,255,0.14)',
                color: '#ffffff',
                fontSize: i === 0 ? 21 : 17,
                fontWeight: 800,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'matutino') {
    return (
      <div style={{ position: 'absolute', right: 82, bottom: 52, width: 326, height: 128, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            width: 108,
            height: 108,
            display: 'flex',
            borderRadius: '50%',
            background: 'linear-gradient(180deg, #ffd166 0%, #ff9f1c 100%)',
            boxShadow: '0 0 46px rgba(255,209,102,0.42)',
          }}
        />
        <div style={{ position: 'absolute', top: 70, width: 304, height: 8, display: 'flex', borderRadius: 999, background: 'rgba(255,255,255,0.82)' }} />
        <div style={{ position: 'absolute', top: 92, width: 244, height: 7, display: 'flex', borderRadius: 999, background: 'rgba(255,255,255,0.42)' }} />
        <div style={{ position: 'absolute', top: 110, width: 190, height: 7, display: 'flex', borderRadius: 999, background: accentColor }} />
        <div style={{ position: 'absolute', bottom: 0, display: 'flex', gap: 12 }}>
          {['6 AM', 'Audio', 'Resumen'].map((label, i) => (
            <div
              key={label}
              style={{
                height: 40,
                padding: '0 15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 999,
                background: i === 0 ? '#ffffff' : '#2527aa',
                color: i === 0 ? '#0000A2' : '#ffffff',
                fontSize: i === 0 ? 19 : 17,
                fontWeight: 800,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', right: 72, bottom: 100, width: 340, height: 240, display: 'flex', flexWrap: 'wrap', gap: 18 }}>
      {['BCCR', 'CLIMA', 'JPS', 'MOPT'].map((label, i) => (
        <div
          key={label}
          style={{
            width: i % 2 === 0 ? 145 : 165,
            height: 92,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 14,
            background: i === 0 ? '#ffffff' : 'rgba(255,255,255,0.14)',
            color: i === 0 ? '#0000A2' : '#ffffff',
            fontSize: 22,
            fontWeight: 800,
            border: '1px solid rgba(255,255,255,0.18)',
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

export function makeBrandOgImage(opts: BrandOgOptions): ImageResponse {
  const logo = assetDataUrl('logo.png', 'image/png');
  const titleLines = wrapText(opts.title, 18).slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: '#0000A2',
          color: '#ffffff',
          fontFamily: 'Metropolis',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background: 'linear-gradient(125deg, #0000A2 0%, #0000A2 54%, #07145f 54%, #07145f 100%)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', background: `radial-gradient(circle at 78% 22%, ${opts.accentColor}55 0%, rgba(255,255,255,0) 38%)` }} />
        <div style={{ position: 'absolute', left: -120, top: 80, width: 320, height: 320, display: 'flex', borderRadius: '50%', border: '44px solid rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', right: -90, top: -100, width: 290, height: 290, display: 'flex', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

        <div style={{ position: 'absolute', top: 46, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          {logo ? <img src={logo} alt="" style={{ width: 315, height: 51, objectFit: 'contain' }} /> : <div style={{ display: 'flex', fontSize: 34, fontWeight: 800 }}>acontecer.co.cr</div>}
        </div>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 680, height: '100%', padding: '94px 0 72px 72px' }}>
          <div style={{ display: 'flex', color: opts.accentColor, fontSize: 18, fontWeight: 800, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 22 }}>
            {opts.kicker}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 24 }}>
            {titleLines.map((line) => (
              <div key={line} style={{ display: 'flex', fontSize: titleLines.length > 2 ? 64 : 76, lineHeight: 0.96, fontWeight: 800, letterSpacing: 0 }}>
                {line}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', maxWidth: 565, fontSize: 27, lineHeight: 1.22, fontWeight: 600, color: 'rgba(255,255,255,0.78)' }}>
            {opts.subtitle}
          </div>
        </div>

        {variantPattern(opts.variant, opts.accentColor)}

        <div style={{ position: 'absolute', right: 64, top: 172, width: 356, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {opts.cards.slice(0, 3).map((card) => (
            <div key={card.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ display: 'flex', width: 10, height: 42, borderRadius: 999, background: opts.accentColor }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ display: 'flex', fontSize: 13, fontWeight: 800, letterSpacing: 2.2, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>{card.label}</div>
                <div style={{ display: 'flex', fontSize: 27, fontWeight: 800, lineHeight: 1.05 }}>{card.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 18, display: 'flex', background: '#d71920' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 18, height: 10, display: 'flex', background: '#ffffff', opacity: 0.94 }} />
        <div style={{ position: 'absolute', left: 72, bottom: 44, display: 'flex', fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
          {opts.footer || 'Acontecer.co.cr'}
        </div>
      </div>
    ),
    {
      ...BRAND_OG_SIZE,
      fonts: [
        {
          name: 'Metropolis',
          data: fontData('fonts/metropolis/metropolis-latin-600-normal.woff'),
          weight: 600,
          style: 'normal',
        },
        {
          name: 'Metropolis',
          data: fontData('fonts/metropolis/metropolis-latin-800-normal.woff'),
          weight: 800,
          style: 'normal',
        },
      ],
    },
  );
}
