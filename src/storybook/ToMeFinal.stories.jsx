// 확정 화면 — TO ME 하루 흐름 순서대로 (2026-10-08 정리)
// 인트로·온보딩 = 실제 앱 코드(src/screens), 나머지 = Storybook 확정안(src/storybook/tome, 앱 반영 전)
import IntroScreen from '../screens/IntroScreen.jsx'
import OnboardingScreen from '../screens/OnboardingScreen.jsx'
import { LetterFinal } from './tome/letter.jsx'
import { StatusWithBin, StatusFlowV2, ReturnBinList, ReturnDetail, WeeklyReminder, MOCK_LETTERS, MOCK_RETURNED } from './tome/status.jsx'
import { DayEndA, MOCK_DAY } from './tome/dayend.jsx'

const phone = (Story) => (
  <div className="p-6">
    <div className="overflow-hidden rounded-lg bg-bg" style={{ width: 375, height: 667, outline: '1px solid var(--color-border)' }}>
      <Story />
    </div>
  </div>
)

export default { title: '1 확정 화면', decorators: [phone] }

const T = MOCK_LETTERS[0].dueAt // 편지1 마감 15:00

export const Intro = { name: '01 인트로 (앱 반영됨)', render: () => <IntroScreen onStart={() => {}} /> }
export const Onboarding = { name: '02 온보딩 (앱 반영됨)', render: () => <OnboardingScreen onDone={() => {}} /> }
export const LetterWrite = { name: '03 편지 작성 · 보내기', render: () => <LetterFinal onExit={() => {}} /> }
export const Status = { name: '04 배송 상태 목록 + 반송함 아이콘', render: () => <StatusWithBin weekArrived={0} /> }
export const SoonAlert = { name: '05 마감 20분 전 알림 (편지를 눌러 상세)', render: () => <StatusFlowV2 now={T - 20} /> }
export const Arrived = { name: '06 도착 · 배송 완료? (편지1을 눌러 상세)', render: () => <StatusFlowV2 now={T} /> }
export const Returned = { name: '07 반송 (편지1을 눌러 상세)', render: () => <StatusFlowV2 now={T + 30} /> }
export const Bin = { name: '08 반송함', render: () => <ReturnBinList letters={MOCK_RETURNED} /> }
export const BinDetail = { name: '09 반송 편지 상세', render: () => <ReturnDetail letter={MOCK_RETURNED[0]} number={1} /> }
export const Weekly = { name: '10 주간 리마인드', render: () => <WeeklyReminder arrived={5} waiting={2} /> }
export const DayEnd = { name: '11 하루 마무리', render: () => <DayEndA /> }
export const DayEndAllReturned = { name: '11-2 하루 마무리 (모두 반송된 날)', render: () => <DayEndA day={MOCK_DAY.map((l) => ({ ...l, result: 'returned' }))} /> }
