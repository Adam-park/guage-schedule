// 하루 편지 수 3통 → 2통 비교 (2026-11-02) — 왼쪽 = 3통일 때 스크린샷, 오른쪽 = 지금 실제 앱 코드(2통)
import LetterWriteScreen from '../screens/LetterWriteScreen.jsx'
import OnboardingScreen from '../screens/OnboardingScreen.jsx'
import { StatusList } from '../screens/StatusScreen.jsx'
import DayEnd from '../screens/DayEndScreen.jsx'
import { MOCK_LETTERS } from './tome/status.jsx'
import { MOCK_DAY } from './tome/dayend.jsx'
import { DAILY_LIMIT } from '../lib/letters.js'
import writeCounter from '../../docs/tome-evidence/before-limit/1-write-counter.png'
import writeDone from '../../docs/tome-evidence/before-limit/2-write-done.png'
import listOne from '../../docs/tome-evidence/before-limit/3-list-one.png'
import listFull from '../../docs/tome-evidence/before-limit/4-list-full.png'
import onbLast from '../../docs/tome-evidence/before-limit/5-onboarding-last.png'
import dayEnd from '../../docs/tome-evidence/before-limit/6-dayend.png'

const Box = ({ children }) => (
  <div className="overflow-hidden rounded-lg bg-bg" style={{ width: 375, height: 667, outline: '1px solid var(--color-border)' }}>
    {children}
  </div>
)
function Row({ title, src, children }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <div className="flex gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink-dim">3통일 때</span>
          <Box><img src={src} alt="" width={375} height={667} className="block" /></Box>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-state-due">2통 (지금)</span>
          <Box>{children}</Box>
        </div>
      </div>
    </section>
  )
}

export default { title: '2 작업 기록/12 하루 2통 비교' }

export const Compare = {
  name: '3통 / 2통',
  render: () => (
    <div className="flex flex-col gap-12 p-6">
      <Row title="① 편지 작성 — 몇 번째 편지인지" src={writeCounter}><LetterWriteScreen /></Row>
      <Row title="② 다 보낸 뒤 안내" src={writeDone}><LetterWriteScreen sentDues={Array.from({ length: DAILY_LIMIT }, () => 1439)} /></Row>
      <Row title="③ 배송 상태 목록 — 덜 보냈을 때 ('편지 쓰기' 버튼 보임)" src={listOne}><StatusList letters={MOCK_LETTERS.slice(0, 1)} now={540} doneIds={[]} onWrite={() => {}} /></Row>
      <Row title="④ 배송 상태 목록 — 다 보냈을 때" src={listFull}><StatusList letters={MOCK_LETTERS} now={540} doneIds={[]} onWrite={() => {}} /></Row>
      <Row title="⑤ 온보딩 마지막" src={onbLast}><OnboardingScreen initialStep={6} /></Row>
      <Row title="⑥ 하루 마무리" src={dayEnd}><DayEnd day={MOCK_DAY} /></Row>
    </div>
  ),
}
