// 표현 맞추기 시안 (2026-10-09) — 화면에 실제로 보이는 말을 '지금 / 바꾸면'으로 나란히. 앱 반영 전
// 기준: 편지 작성 화면의 말 = '오늘 할 일' · '할 시간' · '보내기' / 도착 = 해내고 배송 완료를 누른 것 (온보딩 5번째)
import OnboardingScreen from '../screens/OnboardingScreen.jsx'
import { StatusList } from '../screens/StatusScreen.jsx'
import { STATE_TEXT } from '../lib/letters.js'
import { MOCK_LETTERS } from './tome/status.jsx'

const NOW_STEPS = [
  '오늘 하루, 시간대마다\n그 시간의 내가 있어요.',
  '아침의 나, 오후의 나, 저녁의 나.\n이 사실을 아는 건 현재의 나 바로 당신뿐이에요.',
  '현재의 나는 미래의 나를 위해\n오늘 해낼 일을 편지에 적어요.',
  '할 일과 해낼 시간을 적고\n배송을 누르면 약속이 시작돼요.',
  '시간 안에 해내고 배송 완료를 누르면\n편지가 미래의 나에게 도착해요.',
  '해내지 못한 일정은 반송함으로 돌아와요.\n반송된 편지는 그 시간의 나에게 닿지 못해요.',
  '하루에 보낼 수 있는 편지는 3통.\n미래의 나는 그만큼 더 나아가요.',
]
const NEW_STEPS = [...NOW_STEPS]
NEW_STEPS[2] = '현재의 나는 미래의 나를 위해\n오늘 할 일을 편지에 적어요.'
NEW_STEPS[3] = '할 일과 할 시간을 적고\n보내기를 누르면 약속이 시작돼요.'
const NEW_STEPS_6 = [...NEW_STEPS]
NEW_STEPS_6[5] = '해내지 못한 편지는 반송함으로 돌아와요.\n반송된 편지는 그 시간의 나에게 닿지 못해요.'

function Phone({ children }) {
  return (
    <div className="overflow-hidden rounded-lg bg-bg" style={{ width: 375, height: 667, outline: '1px solid var(--color-border)' }}>
      {children}
    </div>
  )
}
// 한 줄 = 무엇을 바꾸는지 + 지금 / 바꾸면
function Row({ title, children }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <div className="flex gap-8">{children}</div>
    </section>
  )
}
function Col({ label, tone, children }) {
  return (
    <div className="flex flex-col gap-2">
      <span className={`text-sm font-semibold ${tone}`}>{label}</span>
      <Phone>{children}</Phone>
    </div>
  )
}

// 마감(15:00) 5분 뒤, 아직 배송 완료를 안 누른 편지1
const T = MOCK_LETTERS[0].dueAt + 5

export default { title: '2 작업 기록/7 표현 맞추기 시안' }

export const Compare = {
  name: '지금 / 바꾸면',
  render: () => (
    <div className="flex flex-col gap-12 p-6">
      <Row title="① 온보딩 3번째 — '해낼 일' → '할 일'">
        <Col label="지금" tone="text-ink-dim"><OnboardingScreen steps={NOW_STEPS} initialStep={2} /></Col>
        <Col label="바꾸면" tone="text-state-due"><OnboardingScreen steps={NEW_STEPS} initialStep={2} /></Col>
      </Row>
      <Row title="② 온보딩 4번째 — '해낼 시간' → '할 시간', '배송' → '보내기'">
        <Col label="지금" tone="text-ink-dim"><OnboardingScreen steps={NOW_STEPS} initialStep={3} /></Col>
        <Col label="바꾸면" tone="text-state-due"><OnboardingScreen steps={NEW_STEPS} initialStep={3} /></Col>
      </Row>
      <Row title="③ 온보딩 6번째 — '일정' 그대로 둘지 / '편지'로 바꿀지">
        <Col label="지금 (일정)" tone="text-ink-dim"><OnboardingScreen steps={NOW_STEPS} initialStep={5} /></Col>
        <Col label="바꾸면 (편지)" tone="text-state-due"><OnboardingScreen steps={NEW_STEPS_6} initialStep={5} /></Col>
      </Row>
      <Row title="④ 배송 상태 목록 — 마감 시간이 됐지만 아직 '배송 완료'를 안 누른 편지1">
        <Col label="지금 ('도착했어요' — 도착은 '해냈다'는 뜻으로도 씀)" tone="text-ink-dim"><StatusList letters={MOCK_LETTERS} now={T} doneIds={[]} /></Col>
        <Col label="바꾸면 (상세 버튼과 같은 '배송 완료?')" tone="text-state-due"><StatusList letters={MOCK_LETTERS} now={T} doneIds={[]} stateLabels={{ ...STATE_TEXT, arrived: '배송 완료?' }} /></Col>
      </Row>
    </div>
  ),
}
