// TO ME 화면 3종 — 앱 코드 그대로, 375×667 모바일 틀 안에서
import IntroScreen from '../screens/IntroScreen.jsx'
import OnboardingScreen from '../screens/OnboardingScreen.jsx'
import LetterWriteScreen from '../screens/LetterWriteScreen.jsx'

const phone = (Story) => (
  <div className="p-6">
    {/* 테두리 대신 outline — 안쪽 폭을 정확히 375로 유지 */}
    <div className="overflow-hidden rounded-lg bg-bg" style={{ width: 375, height: 667, outline: '1px solid var(--color-border)' }}>
      <Story />
    </div>
  </div>
)

export default {
  title: '2 작업 기록/0 앱 화면 (현재 코드)',
  decorators: [phone],
}

export const Intro = { name: '1 인트로', render: () => <IntroScreen onStart={() => {}} /> }
export const Onboarding = { name: '2 온보딩 (탭해서 넘김)', render: () => <OnboardingScreen /> }
export const LetterWrite = { name: '3 편지 작성', render: () => <LetterWriteScreen /> }
