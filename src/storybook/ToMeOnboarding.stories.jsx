// 온보딩 시안 비교 — 각 폰 화면을 직접 탭해서 넘겨볼 수 있음
import OnboardingScreen from './legacy/OnboardingScreenBefore.jsx'
import { OnboardingA, OnboardingA1, OnboardingB, OnboardingC, OnboardingFinish, OnboardingFinal, STEPS } from './tome/onboarding.jsx'

function Phone({ label, sub, children }) {
  return (
    <div style={{ width: 375 }}>
      <div className="text-sm font-semibold text-ink">{label}</div>
      <div className="mb-2 text-xs text-ink-dim">{sub}</div>
      <div className="overflow-hidden rounded-lg bg-bg" style={{ width: 375, height: 667, outline: '1px solid var(--color-border)' }}>
        {children}
      </div>
    </div>
  )
}

export default { title: '2 작업 기록/2 온보딩 시안' }

export const Compare = {
  name: '시안 비교 (탭해서 넘겨보기)',
  render: () => (
    <div className="flex gap-8 p-6">
      <Phone label="Before · 현재" sub="글자만, 아래 1 / 7 표시"><OnboardingScreen /></Phone>
      <Phone label="A · 배송 진행 게이지" sub="봉투 고정, 탭마다 한 칸"><OnboardingA /></Phone>
      <Phone label="B · 봉투가 게이지 위를 이동" sub="게이지 = 배송 길"><OnboardingB /></Phone>
      <Phone label="C · 게이지로 규칙 보여주기" sub="오늘의 편지 3칸이 문장대로 바뀜"><OnboardingC /></Phone>
    </div>
  ),
}

export const RefineAlign = {
  name: 'A 다듬기 ① 정렬 (탭해서 비교)',
  render: () => (
    <div className="flex gap-8 p-6">
      <Phone label="A · 다듬기 전" sub="문장 길이에 따라 봉투·게이지가 오르내림"><OnboardingA /></Phone>
      <Phone label="A · 정렬 다듬은 후" sub="봉투·게이지 제자리, 문장만 바뀜"><OnboardingA1 /></Phone>
    </div>
  ),
}

// 마지막 단계 효과 시안 — 6단계에서 시작, 한 번 탭하면 마지막(효과) 단계
export const FinishEffects = {
  name: 'A 마지막 단계 효과 시안 (한 번 탭)',
  render: () => (
    <div className="flex gap-8 p-6">
      <Phone label="효과 1 · 테두리 띠" sub="봉투 둘레에 초록 픽셀 띠"><OnboardingFinish effect="ring" start={5} /></Phone>
      <Phone label="효과 2 · 배송 완료 도장" sub="봉투 모서리에 도장이 쾅"><OnboardingFinish effect="stamp" start={5} /></Phone>
      <Phone label="효과 3 · 픽셀 반짝임" sub="봉투 주변 별이 깜빡"><OnboardingFinish effect="sparkle" start={5} /></Phone>
    </div>
  ),
}

// 세계관 반영 문장 비교 — 같은 화면(게이지·반짝임), 문장만 다름
export const Sentences = {
  name: '문장 비교 · 세계관 반영 (탭해서 넘기기)',
  render: () => (
    <div className="flex gap-8 p-6">
      <Phone label="지금 문장 · 16px" sub="최대 4줄, '완성'·'사진' 포함"><OnboardingFinal steps={STEPS} textSize="text-base" /></Phone>
      <Phone label="새 문장 · 14px" sub="세계관 반영, 모든 문장 두 줄"><OnboardingFinal /></Phone>
    </div>
  ),
}
