// 확정 화면 — TO ME 흐름 순서대로 (2026-10-08 중간 정리)
// 인트로·온보딩 = 실제 앱 코드(src/screens), 편지 작성·배송 상태 = Storybook 확정안(src/storybook/tome, 앱 반영 전)
import IntroScreen from '../screens/IntroScreen.jsx'
import OnboardingScreen from '../screens/OnboardingScreen.jsx'
import { LetterFinal } from './tome/letter.jsx'
import { StatusFlow, StatusDetail } from './tome/status.jsx'

const phone = (Story) => (
  <div className="p-6">
    <div className="overflow-hidden rounded-lg bg-bg" style={{ width: 375, height: 667, outline: '1px solid var(--color-border)' }}>
      <Story />
    </div>
  </div>
)

export default { title: '1 확정 화면', decorators: [phone] }

export const Intro = { name: '1 인트로 (앱 반영됨)', render: () => <IntroScreen onStart={() => {}} /> }
export const Onboarding = { name: '2 온보딩 (앱 반영됨)', render: () => <OnboardingScreen onDone={() => {}} /> }
export const LetterWrite = { name: '3 편지 작성 (앱 반영 전)', render: () => <LetterFinal onExit={() => {}} /> }
export const StatusList = { name: '4 배송 상태 목록 (앱 반영 전)', render: () => <StatusFlow /> }
export const Detail = { name: '5 편지 상세 (앱 반영 전)', render: () => <StatusDetail /> }
