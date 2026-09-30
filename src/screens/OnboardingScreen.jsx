// 온보딩 — 설명 1개씩 중앙 상단에 표시, 화면 탭하면 다음으로. 마지막 다음엔 처음으로 돌아감(다음 화면 생기기 전까지 임시)
import { useState } from 'react'

const STEPS = [
  '나에게 한 약속을 지킬 때마다, 나는 하나씩 완성됩니다.',
  '사실 그 편지에는 내 모습의 조각이 담겨 있습니다.\n편지가 도착할 때마다 조각이 맞춰지며, 사진이 선명해집니다.',
  '당신은 그 편지를 나에게 배달하는 배달부입니다.',
  '나를 위해 편지에 오늘 할 일을 적고 배송 버튼을 누르세요.',
  '이후에 일정을 마무리하고 배송 완료 버튼을 누르시면 끝입니다.',
  '일정을 지키지 못했다면 편지는 다시 반송됩니다.\n반송된 편지는 반송함에서 언제든 확인 가능합니다.',
  '반송함의 편지는 언제든 다시 보낼 수 있습니다.\n하지만 하루에 3개밖에 못 보낸다는 점을 기억하세요.',
]

export default function OnboardingScreen() {
  const [step, setStep] = useState(0)

  function next() {
    setStep((s) => (s + 1) % STEPS.length)
  }

  return (
    <button
      type="button"
      onClick={next}
      className="mx-auto flex min-h-full w-full max-w-[440px] flex-col items-center justify-center px-6 text-center"
    >
      <p className="font-pixel whitespace-pre-line break-keep text-base leading-relaxed text-ink">{STEPS[step]}</p>
      <span className="mt-6 text-[11px] text-ink-faint">{step + 1} / {STEPS.length} · 화면을 탭하면 다음</span>
    </button>
  )
}
