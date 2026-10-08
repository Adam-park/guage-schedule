// 온보딩 — 봉투 아래 7칸 게이지가 탭마다 한 칸씩 차고, 두 줄 설명이 바뀜. 다 차면 초록 + 봉투 반짝임 + 버튼.
// 세계관: CONCEPT.md '세계관' (현재의 나가 미래의 나를 위해 해낼 일을 편지에 적는다)
// 봉투·게이지는 단계와 상관없이 제자리 고정 (문장 칸 = 두 줄 높이, 아래 칸 = 버튼 높이로 미리 잡아둠)
import { useState } from 'react'
import PixelEnvelope from '../components/tome/PixelEnvelope.jsx'
import PixelGauge from '../components/tome/PixelGauge.jsx'
import EnvelopeSparkle from '../components/tome/EnvelopeSparkle.jsx'

const STEPS = [
  '오늘 하루, 시간대마다\n그 시간의 내가 있어요.',
  '아침의 나, 오후의 나, 저녁의 나.\n이 사실을 아는 건 현재의 나 바로 당신뿐이에요.',
  '현재의 나는 미래의 나를 위해\n오늘 할 일을 편지에 적어요.',
  '할 일과 시간을 적고\n배송을 누르면 약속이 시작돼요.',
  '시간 안에 해내고 배송 완료를 누르면\n편지가 미래의 나에게 도착해요.',
  '해내지 못한 일정은 반송함으로 돌아와요.\n반송된 편지는 그 시간의 나에게 닿지 못해요.',
  '하루에 보낼 수 있는 편지는 3통.\n미래의 나는 그만큼 더 나아가요.',
]

// steps·initialStep: Storybook 문구 비교용 (앱에선 기본값)
export default function OnboardingScreen({ onDone, steps = STEPS, initialStep = 0 }) {
  const [step, setStep] = useState(initialStep)
  const LAST = steps.length - 1
  const done = step === LAST
  // 진행 중 = 배송 중 파랑, 다 차면 = 배송 완료 연한 초록(green-300)
  const cells = steps.map((_, i) => (done ? 'bg-green-300' : i <= step ? 'bg-state-due' : null))

  return (
    <div
      onClick={done ? undefined : () => setStep(step + 1)}
      className={`mx-auto flex min-h-full max-w-[440px] flex-col items-center justify-center gap-6 px-6 text-center ${done ? '' : 'cursor-pointer'}`}
    >
      <div className="relative" style={{ width: 96, height: 112 - 29 }}>
        <PixelEnvelope trimBottom />
        {done && <EnvelopeSparkle />}
      </div>

      <div className="w-full">
        <PixelGauge cells={cells} />
      </div>

      {/* 14px 두 줄 = 14 × 1.625(leading-relaxed) × 2 ≈ 46px */}
      <div className="flex h-[46px] w-full items-start justify-center">
        <p className="font-pixel whitespace-pre-line break-keep text-sm leading-relaxed text-ink">{steps[step]}</p>
      </div>

      <div className="flex h-12 w-full items-center justify-center">
        {done ? (
          <button
            type="button"
            onClick={onDone}
            className="font-pixel w-full rounded-lg bg-ink py-3.5 text-sm text-white transition-transform active:scale-[.98]"
          >
            첫 편지 쓰기
          </button>
        ) : (
          <span className="font-pixel text-xs text-ink-faint">화면을 탭하면 다음</span>
        )}
      </div>
    </div>
  )
}
