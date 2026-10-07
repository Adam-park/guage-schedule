// 온보딩 시안 A/B/C — 인트로 봉투(envelope-closed.png, 1배·변형 없음) + 픽셀 게이지
// 문장은 원본 OnboardingScreen.jsx 그대로 (문장 수정은 아직 결정 전)
// 봉투 움직임은 위치 이동(translate)만 사용
import { useState } from 'react'
import { PixelButton, PixelEnvelope } from './parts.jsx'

export const STEPS = [
  '나에게 한 약속을 지킬 때마다, 나는 하나씩 완성됩니다.',
  '사실 그 편지에는 내 모습의 조각이 담겨 있습니다.\n편지가 도착할 때마다 조각이 맞춰지며, 사진이 선명해집니다.',
  '당신은 그 편지를 나에게 배달하는 배달부입니다.',
  '나를 위해 편지에 오늘 할 일을 적고 배송 버튼을 누르세요.',
  '이후에 일정을 마무리하고 배송 완료 버튼을 누르시면 끝입니다.',
  '일정을 지키지 못했다면 편지는 다시 반송됩니다.\n반송된 편지는 반송함에서 언제든 확인 가능합니다.',
  '반송함의 편지는 언제든 다시 보낼 수 있습니다.\n하지만 하루에 3개밖에 못 보낸다는 점을 기억하세요.',
]
const LAST = STEPS.length - 1

// 게이지는 앱 부품을 그대로 사용 (src/components/tome/PixelGauge.jsx)
import PixelGauge from '../../components/tome/PixelGauge.jsx'
export { PixelGauge }

const progressCells = (step) => STEPS.map((_, i) => (i <= step ? 'bg-state-due' : null))

function useSteps(start = 0) {
  const [step, setStep] = useState(start)
  const next = () => setStep((s) => Math.min(s + 1, LAST))
  return { step, next, reset: () => setStep(0) }
}

function Sentence({ text }) {
  return <p className="font-pixel min-h-[72px] whitespace-pre-line break-keep text-base leading-relaxed text-ink">{text}</p>
}

function Footer({ done, onStart }) {
  return done ? (
    <PixelButton label="첫 편지 쓰기" onClick={onStart} />
  ) : (
    <span className="font-pixel text-xs text-ink-faint">화면을 탭하면 다음</span>
  )
}

// A · 배송 진행 게이지: 봉투 고정, 탭마다 한 칸. 다 차면 버튼.
export function OnboardingA() {
  const { step, next, reset } = useSteps()
  return (
    <div onClick={step < LAST ? next : undefined} className="flex h-full cursor-pointer flex-col items-center justify-center gap-6 px-6 text-center">
      <PixelEnvelope trimBottom />
      <div className="w-full">
        <PixelGauge cells={progressCells(step)} />
      </div>
      <Sentence text={STEPS[step]} />
      <Footer done={step === LAST} onStart={reset} />
    </div>
  )
}

// B · 봉투가 게이지 위를 이동: 게이지 = 배송 길. 채워진 끝을 따라 봉투가 오른쪽으로.
export function OnboardingB() {
  const { step, next, reset } = useSteps()
  const ratio = (step + 1) / STEPS.length
  return (
    <div onClick={step < LAST ? next : undefined} className="flex h-full cursor-pointer flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="w-full">
        <div className="relative h-[83px]" style={{ containerType: 'inline-size' }}>
          <div
            className="absolute bottom-0 transition-transform duration-300"
            style={{ left: 0, transform: `translateX(clamp(0px, calc(${ratio} * (100cqw) - 48px), calc(100cqw - 96px)))` }}
          >
            <PixelEnvelope trimBottom />
          </div>
        </div>
        <div className="mt-2">
          <PixelGauge cells={progressCells(step)} />
        </div>
      </div>
      <Sentence text={STEPS[step]} />
      <Footer done={step === LAST} onStart={reset} />
    </div>
  )
}

// C · 게이지로 규칙 보여주기: 위 얇은 진행 게이지 + 가운데 '오늘의 편지 3칸' 게이지가 문장대로 바뀜
const SLOT = { sent: 'bg-state-due', done: 'bg-state-delivered', returned: 'bg-state-returned' }
const SLOT_LABEL = { sent: '배송 중', done: '배송 완료', returned: '반송' }
const DEMO = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
  ['sent', null, null],
  ['done', null, null],
  ['done', 'returned', null],
  ['done', 'sent', 'sent'],
]
export function OnboardingC() {
  const { step, next, reset } = useSteps()
  const slots = DEMO[step]
  const labels = slots.map((s) => (s ? SLOT_LABEL[s] : ''))
  return (
    <div onClick={step < LAST ? next : undefined} className="flex h-full cursor-pointer flex-col items-center px-6 pt-10 pb-10 text-center">
      <div className="w-full">
        <PixelGauge cells={progressCells(step)} height={14} />
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-5">
        <PixelEnvelope trimBottom />
        <div className="w-full">
          <div className="font-pixel mb-1 text-left text-xs text-ink-dim">오늘의 편지 {slots.filter(Boolean).length}/3</div>
          <PixelGauge cells={slots.map((s) => (s ? SLOT[s] : null))} height={28} />
          <div className="font-pixel mt-1 grid grid-cols-3 text-xs text-ink-faint">
            {labels.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
        </div>
        <Sentence text={STEPS[step]} />
      </div>
      <Footer done={step === LAST} onStart={reset} />
    </div>
  )
}

// A 다듬기 ① 정렬: 문장 줄 수·버튼 등장과 상관없이 봉투·게이지가 제자리에 있도록 칸 높이 고정
// 문장 칸 = 가장 긴 문장 4줄(26px × 4 = 104px), 아래 칸 = 버튼 높이(48px)
export function OnboardingA1() {
  const { step, next, reset } = useSteps()
  return (
    <div onClick={step < LAST ? next : undefined} className="flex h-full cursor-pointer flex-col items-center justify-center gap-6 px-6 text-center">
      <PixelEnvelope trimBottom />
      <div className="w-full">
        <PixelGauge cells={progressCells(step)} />
      </div>
      <div className="flex h-[104px] w-full items-start justify-center">
        <p className="font-pixel whitespace-pre-line break-keep text-base leading-relaxed text-ink">{STEPS[step]}</p>
      </div>
      <div className="flex h-12 w-full items-center justify-center">
        <Footer done={step === LAST} onStart={reset} />
      </div>
    </div>
  )
}

// ---- 마지막 단계 '배송 완료' 효과 시안 (A1 배치 기반) ----
// 봉투 그림은 그대로 두고, 그림 '바깥/위'에만 덧붙임. 봉투 실제 그림 영역: (14,26) 66×57 (96×112 이미지 기준)
const ART = { x: 14, y: 26, w: 66, h: 57 }

export const EFFECT_CSS = `
@keyframes tome-pop { 0% { transform: scale(1.6); opacity: 0 } 60% { transform: scale(0.94); opacity: 1 } 100% { transform: scale(1); opacity: 1 } }
@keyframes tome-ring { 0% { opacity: 0 } 100% { opacity: 1 } }
@keyframes tome-blink { 0% { opacity: 0 } 20% { opacity: 1 } 40% { opacity: 0 } 60%, 100% { opacity: 1 } }
@media (prefers-reduced-motion: reduce) { .tome-anim { animation: none !important; opacity: 1 !important } }
`

// 효과 1 · 테두리 띠: 봉투 둘레에 초록 픽셀 띠(2px, 4px 간격) — 계단식 모서리로 픽셀 느낌
function RingEffect() {
  const pad = 6
  return (
    <div
      className="tome-anim pointer-events-none absolute border-2 border-state-delivered"
      style={{ left: ART.x - pad, top: ART.y - pad, width: ART.w + pad * 2, height: ART.h + pad * 2, clipPath: 'polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)', animation: 'tome-ring 300ms steps(3) both' }}
    />
  )
}

// 효과 2 · 도장: '배송 완료' 픽셀 도장이 봉투 오른쪽 아래에 쾅 (CONCEPT.md: 상태 전이 순간에만 짧은 도장 연출)
function StampEffect() {
  return (
    <div
      className="tome-anim font-pixel pointer-events-none absolute rounded-[3px] border-2 border-state-delivered bg-bg px-1.5 py-0.5 text-xs whitespace-nowrap text-state-delivered"
      style={{ left: ART.x + ART.w - 34, top: ART.y + ART.h - 16, rotate: '-8deg', animation: 'tome-pop 350ms steps(5) both' }}
    >
      배송 완료
    </div>
  )
}

// 효과 3 · 반짝임: 봉투 위에 픽셀 십자 별 3개가 번갈아 깜빡임 (2번 깜빡이고 남음)
function Spark({ x, y, delay }) {
  const c = 'absolute bg-green-300' // 게이지 완료색과 동일
  return (
    <div className="tome-anim pointer-events-none absolute" style={{ left: x, top: y, width: 10, height: 10, animation: `tome-blink 900ms step-end ${delay}ms 1 both`, opacity: 1 }}>
      <div className={c} style={{ left: 4, top: 0, width: 2, height: 10 }} />
      <div className={c} style={{ left: 0, top: 4, width: 10, height: 2 }} />
    </div>
  )
}
function SparkleEffect() {
  return (
    <>
      <Spark x={ART.x - 20} y={ART.y - 16} delay={0} />
      <Spark x={ART.x + ART.w + 10} y={ART.y - 10} delay={150} />
      <Spark x={ART.x + ART.w + 16} y={ART.y + ART.h - 18} delay={300} />
    </>
  )
}

const EFFECTS = { ring: RingEffect, stamp: StampEffect, sparkle: SparkleEffect }

// 게이지가 다 차면 파랑(배송 중) → 초록(배송 완료)으로 바뀜 — 세 시안 공통
// 다 찬 게이지 색: 연한 초록 — Tailwind 기본 green-300, 사용자 요청 2026-10-07
const finishCells = (step) => (step === LAST ? STEPS.map(() => 'bg-green-300') : progressCells(step))

export function OnboardingFinish({ effect, start = 0 }) {
  const { step, next, reset } = useSteps(start)
  const Effect = EFFECTS[effect]
  const done = step === LAST
  return (
    <div onClick={step < LAST ? next : undefined} className="flex h-full cursor-pointer flex-col items-center justify-center gap-6 px-6 text-center">
      <style>{EFFECT_CSS}</style>
      <div className="relative" style={{ width: 96, height: 112 - 29 }}>
        <PixelEnvelope trimBottom />
        {done && <Effect key={step} />}
      </div>
      <div className="w-full">
        <PixelGauge cells={finishCells(step)} />
      </div>
      <div className="flex h-[104px] w-full items-start justify-center">
        <p className="font-pixel whitespace-pre-line break-keep text-base leading-relaxed text-ink">{STEPS[step]}</p>
      </div>
      <div className="flex h-12 w-full items-center justify-center">
        <Footer done={done} onStart={reset} />
      </div>
    </div>
  )
}

// ---- 세계관 반영 문장 (CONCEPT.md '세계관', 2026-10-07) — 한 문장 = 정확히 두 줄 (\n으로 줄 고정) ----
export const STEPS_V2 = [
  '오늘 하루, 시간대마다\n그 시간의 내가 있어요.',
  '아침의 나, 오후의 나, 저녁의 나.\n이 사실을 아는 건 현재의 나 바로 당신뿐이에요.',
  '현재의 나는 미래의 나를 위해\n오늘 해낼 일을 편지에 적어요.',
  '할 일과 해낼 시간을 적고\n배송을 누르면 약속이 시작돼요.',
  '시간 안에 해내고 배송 완료를 누르면\n편지가 미래의 나에게 도착해요.',
  '해내지 못한 편지는 반송함으로 돌아와요.\n다시 해내면 언제든 다시 보낼 수 있어요.',
  '하루에 보낼 수 있는 편지는 3통.\n미래의 나는 그만큼 더 나아가요.',
]

// 마지막 단계 반짝임(효과 3) + 두 줄 문장. textSize: 'text-sm'(14px) | 'text-base'(16px)
export function OnboardingFinal({ steps = STEPS_V2, textSize = 'text-sm', start = 0 }) {
  const [step, setStep] = useState(start)
  const last = steps.length - 1
  const done = step === last
  const cells = steps.map((_, i) => (done ? 'bg-green-300' : i <= step ? 'bg-state-due' : null))
  return (
    <div onClick={step < last ? () => setStep(step + 1) : undefined} className="flex h-full cursor-pointer flex-col items-center justify-center gap-6 px-6 text-center">
      <style>{EFFECT_CSS}</style>
      <div className="relative" style={{ width: 96, height: 112 - 29 }}>
        <PixelEnvelope trimBottom />
        {done && <SparkleEffect key={step} />}
      </div>
      <div className="w-full">
        <PixelGauge cells={cells} />
      </div>
      {/* 문장 칸 높이: 14px 두 줄 = 14 × 1.625(leading-relaxed) × 2 ≈ 46px / 비교용 16px 원문은 4줄 104px */}
      <div className="flex w-full items-start justify-center" style={{ height: textSize === 'text-sm' ? 46 : 104 }}>
        <p className={`font-pixel whitespace-pre-line break-keep leading-relaxed text-ink ${textSize}`}>{steps[step]}</p>
      </div>
      <div className="flex h-12 w-full items-center justify-center">
        {done ? <PixelButton label="첫 편지 쓰기" onClick={() => setStep(0)} /> : <span className="font-pixel text-xs text-ink-faint">화면을 탭하면 다음</span>}
      </div>
    </div>
  )
}
