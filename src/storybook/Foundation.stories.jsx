// 1단계 Foundation — AfterToday 화면이 쓰는 토큰만 (docs/figma-import-state.json 과 같은 목록)
// 값은 src/index.css @theme 에서 실제로 읽어와서 표시 — 하드코딩 사본 없음

const COLORS = [
  ['bg/page', '--color-bg'],
  ['bg/surface', '--color-surface'],
  ['bg/sunken', '--color-surface-sunken'],
  ['border/default', '--color-border'],
  ['text/primary', '--color-ink'],
  ['text/secondary', '--color-ink-dim'],
  ['text/tertiary', '--color-ink-faint'],
  ['text/state/due', '--color-state-due'],
  ['text/state/returned', '--color-state-returned'],
  ['text/state/delivered', '--color-state-delivered'],
]

const TYPE = [
  ['caption/regular', 'text-xs', '12px / 400 / 16px', '오늘 처리한 것 1개'],
  ['caption/strong', 'text-xs font-semibold', '12px / 600 / 16px', '배송 시도 중 → 나'],
  ['caption/numeric', 'text-xs tabular-nums', '12px / 400 / 16px · 고정폭 숫자', '오후 06:37'],
  ['caption/numeric-strong', 'text-xs font-semibold tabular-nums', '12px / 600 / 16px · 고정폭 숫자', '1개'],
  ['title/card', 'text-sm font-semibold', '14px / 600 / 20px', '팀 회의 자료 공유'],
]

const SPACE = [
  ['space/1', 4, 'mt-1'],
  ['space/2', 8, 'gap-2 · mt-2 · py-2'],
  ['space/3', 12, 'py-3 · px-3'],
  ['space/4', 16, 'px-4 · gap-4'],
  ['space/10', 40, 'py-10'],
]

const RADIUS = [
  ['radius/md', 'rounded-md', '6px — 버튼'],
  ['radius/lg', 'rounded-lg', '8px — 카드·반송함'],
]

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function Section({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-semibold text-ink">{title}</h2>
      {children}
    </section>
  )
}

function FoundationPage() {
  return (
    <div className="p-6">
      <Section title="Color (Semantic → 코드 변수)">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {COLORS.map(([name, v]) => (
            <div key={name} className="rounded-lg border border-border p-2">
              <div className="h-10 rounded-md border border-border" style={{ background: `var(${v})` }} />
              <div className="mt-2 text-xs font-semibold text-ink">{name}</div>
              <div className="text-xs text-ink-faint">{v}</div>
              <div className="text-xs text-ink-faint tabular-nums">{cssVar(v)}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="flex flex-col gap-3">
          {TYPE.map(([name, cls, spec, sample]) => (
            <div key={name} className="flex items-baseline gap-4">
              <div className="w-48 shrink-0 text-xs text-ink-faint">
                {name}
                <br />
                {spec}
              </div>
              <div className={`${cls} text-ink`}>{sample}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spacing">
        <div className="flex flex-col gap-2">
          {SPACE.map(([name, px, use]) => (
            <div key={name} className="flex items-center gap-4 text-xs text-ink-faint">
              <div className="w-48 shrink-0">
                {name} · {px}px
              </div>
              <div className="h-3 bg-ink" style={{ width: px }} />
              <div>{use}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radius · Border · Opacity">
        <div className="flex flex-wrap gap-4">
          {RADIUS.map(([name, cls, desc]) => (
            <div key={name} className={`${cls} flex h-16 w-40 items-center justify-center border border-border bg-surface-sunken text-xs text-ink-dim`}>
              {name} {desc}
            </div>
          ))}
          <div className="flex h-16 w-40 items-center justify-center rounded-lg border border-dashed border-border text-xs text-ink-dim">
            border 1px dashed (반송함)
          </div>
          <div className="flex h-16 w-40 items-center justify-center rounded-lg border border-border bg-surface text-xs text-ink opacity-60">
            opacity 60% (예정 카드)
          </div>
        </div>
      </Section>
    </div>
  )
}

export default {
  title: '1 Foundation/AfterToday 토큰',
  component: FoundationPage,
}

export const Tokens = {}
