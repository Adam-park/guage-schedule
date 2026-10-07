// 3단계 Screen(조립본) + 4단계 베리에이션 A/B/C — 전부 parts.jsx 부품으로만 조립
// 기준: 코칭(docs/coaching/2026-10-07-instructor-feedback.md) — 픽셀 방향 유지, '나를 완성' 문구는 브랜드 자리(인트로)에만, 사용법을 빠르게
import { BrandTitle, PixelButton, PixelEnvelope } from './parts.jsx'

// 3단계: IntroScreen.jsx와 같은 배치를 부품으로 재조립 (원본과 픽셀 비교로 검증)
export function IntroAssembled({ onStart }) {
  return (
    <div className="mx-auto flex min-h-full max-w-[440px] flex-col items-center justify-center px-4">
      <BrandTitle />
      <PixelButton onClick={onStart} className="mt-10" />
    </div>
  )
}

// A · 봉투 한 장: 원본 배치 유지 + 위에 닫힌 편지 봉투. "편지 앱"이라는 걸 그림 한 장으로.
export function VariantA({ onStart }) {
  return (
    <div className="mx-auto flex min-h-full max-w-[440px] flex-col items-center justify-center px-4">
      <PixelEnvelope scale={1} />
      <div className="mt-6">
        <BrandTitle />
      </div>
      <PixelButton onClick={onStart} className="mt-10" />
    </div>
  )
}

// A 다듬기 1 · 간격: 봉투 아래 투명 여백 29px 때문에 실제 간격이 53px → 보이는 간격 24px(space/6)로
export function VariantA1({ onStart }) {
  return (
    <div className="mx-auto flex min-h-full max-w-[440px] flex-col items-center justify-center px-4">
      <PixelEnvelope scale={1} trimBottom />
      <div className="mt-6">
        <BrandTitle />
      </div>
      <PixelButton onClick={onStart} className="mt-10" />
    </div>
  )
}

// A 다듬기 2 · 강조: 보이는 봉투 66px → 132px(2배, 정수배라 픽셀 유지). 간격 다듬기(①)는 유지.
export function VariantA2({ onStart }) {
  return (
    <div className="mx-auto flex min-h-full max-w-[440px] flex-col items-center justify-center px-4">
      <PixelEnvelope scale={2} trimBottom />
      <div className="mt-6">
        <BrandTitle />
      </div>
      <PixelButton onClick={onStart} className="mt-10" />
    </div>
  )
}

// B · 사용법 한 줄: 제목 아래 '쓰기 → 보내기 → 도착 → 반송' 4칸. 코칭 "핵심 사용법을 빠르게".
const FLOW = ['쓰기', '보내기', '도착', '반송']
export function VariantB({ onStart }) {
  return (
    <div className="mx-auto flex min-h-full max-w-[440px] flex-col items-center justify-center px-4">
      <BrandTitle />
      <ol className="font-pixel mt-8 flex w-full items-center justify-between text-xs text-ink-dim">
        {FLOW.map((s, i) => (
          <li key={s} className="flex items-center gap-1">
            <span className="rounded-md border border-border px-2 py-1">{s}</span>
            {i < FLOW.length - 1 && <span className="text-ink-faint">→</span>}
          </li>
        ))}
      </ol>
      <PixelButton onClick={onStart} className="mt-8" />
    </div>
  )
}

// C · 주소 라벨: 화면을 편지 겉면처럼. TO/FROM 주소 칸에 앱 이름이 들어감. 버튼은 아래 고정.
export function VariantC({ onStart }) {
  return (
    <div className="mx-auto flex min-h-full max-w-[440px] flex-col px-4 py-10">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="font-pixel w-full rounded-lg border border-border px-6 py-8">
          <div className="text-xs text-ink-faint">FROM. 오늘의 나</div>
          <div className="mt-8 text-right">
            <div className="text-xs text-ink-faint">TO.</div>
            <div className="text-4xl tracking-[0.15em] text-ink">ME</div>
          </div>
        </div>
        <p className="font-pixel mt-4 text-sm text-ink-dim">나를 완성하는 시간</p>
      </div>
      <PixelButton onClick={onStart} />
    </div>
  )
}
