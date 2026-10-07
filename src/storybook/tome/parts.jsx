// 2단계 Component — TO ME 인트로 부품. IntroScreen.jsx의 클래스를 그대로 옮김(값 = 1단계 토큰).
// 앱 코드(IntroScreen.jsx)는 건드리지 않음 — Storybook 조립·베리에이션 전용.

// 토큰: text/primary, pixel/display, text/secondary, pixel/body, space/2
export function BrandTitle({ title = 'TO ME', tagline = '나를 완성하는 시간', showTagline = true }) {
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="font-pixel text-4xl tracking-[0.15em] text-ink" style={{ imageRendering: 'pixelated' }}>
        {title}
      </h1>
      {showTagline && <p className="font-pixel mt-2 text-sm text-ink-dim">{tagline}</p>}
    </div>
  )
}

// 토큰: bg/action-primary, text/on-action, pixel/body, space/3-5, radius/lg
export function PixelButton({ label = 'Start', onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-pixel w-full rounded-lg bg-ink py-3.5 text-sm text-white transition-transform active:scale-[.98] ${className}`}
    >
      {label}
    </button>
  )
}

// 봉투 그림은 앱 부품을 그대로 사용 (src/components/tome/PixelEnvelope.jsx)
export { default as PixelEnvelope } from '../../components/tome/PixelEnvelope.jsx'
