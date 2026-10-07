// 1단계 Foundation — TO ME 인트로 화면 기준 (원시 → 의미 토큰, 글자 스타일, 간격·모서리)
import { PRIMITIVES, SEMANTIC, TEXT_STYLES, SPACING, RADIUS } from './tomeIntroTokens.js'

const read = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim()

function Section({ title, note, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      {note && <p className="mb-3 text-xs text-ink-faint">{note}</p>}
      {children}
    </section>
  )
}

function Swatch({ cssVar }) {
  return <div className="h-8 w-8 shrink-0 rounded-md" style={{ background: `var(${cssVar})`, outline: '1px solid var(--color-border)' }} />
}

function Page() {
  return (
    <div className="p-6">
      <Section title="Color · Primitive (원시값)" note="코드의 CSS 변수를 그대로 읽어서 표시">
        <div className="flex flex-col gap-2">
          {Object.entries(PRIMITIVES).map(([name, t]) => (
            <div key={name} className="flex items-center gap-3 text-xs">
              <Swatch cssVar={t.cssVar} />
              <span className="w-32 font-semibold text-ink">{name}</span>
              <span className="w-40 text-ink-dim">{t.cssVar}</span>
              <span className="text-ink-faint tabular-nums">{read(t.cssVar)}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Color · Semantic (용도 → 원시값)" note="같은 색이라도 역할이 다르면 다른 이름 (예: 제목 글자 vs 버튼 배경)">
        <div className="flex flex-col gap-2">
          {Object.entries(SEMANTIC).map(([name, t]) => (
            <div key={name} className="flex items-center gap-3 text-xs">
              <Swatch cssVar={PRIMITIVES[t.alias].cssVar} />
              <span className="w-36 font-semibold text-ink">{name}</span>
              <span className="w-32 text-ink-dim">→ {t.alias}</span>
              <span className="text-ink-faint">{t.usedBy}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Text Style" note="갈무리11 Regular(400) 한 벌만 사용 — 굵기 대신 크기로 위계">
        <div className="flex flex-col gap-4">
          {Object.entries(TEXT_STYLES).map(([name, t]) => (
            <div key={name} className="flex items-center gap-6">
              <div className="w-56 shrink-0 text-xs text-ink-faint">
                <span className="font-semibold text-ink">{name}</span>
                <br />
                {t.size}px / {t.weight} / 행간 {t.lineHeight} / 자간 {t.letterSpacing}
                <br />
                사용처: {t.usedBy}
              </div>
              <div className={`${t.cls} text-ink`}>{name === 'pixel/display' ? 'TO ME' : '나를 완성하는 시간 · Start'}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spacing · Radius">
        <div className="flex flex-col gap-2">
          {Object.entries(SPACING).map(([name, t]) => (
            <div key={name} className="flex items-center gap-3 text-xs text-ink-faint">
              <span className="w-32 font-semibold text-ink">{name} · {t.px}px</span>
              <div className="h-3 bg-ink" style={{ width: t.px }} />
              <span>{t.usedBy}</span>
            </div>
          ))}
          {Object.entries(RADIUS).map(([name, t]) => (
            <div key={name} className="mt-2 flex items-center gap-3 text-xs text-ink-faint">
              <span className="w-32 font-semibold text-ink">{name} · {t.px}px</span>
              <div className="h-8 w-16 bg-ink" style={{ borderRadius: t.px }} />
              <span>{t.usedBy}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

export default {
  title: '2 작업 기록/1 인트로 · Foundation',
  component: Page,
}

export const Tokens = { name: '인트로 토큰' }
