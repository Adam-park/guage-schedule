// 기능 줄이기 비교 (2026-11-02) — 왼쪽 '지금(줄이기 전)' = 바꾸기 직전 스크린샷, 오른쪽 '줄인 뒤' = 실제 앱 코드
// 기준: 한 화면에는 지금 해야 할 일 하나만 (선택이 어려운 사람이 '머리 아프다'며 닫지 않게)
import { useState } from 'react'
import { StatusList } from '../screens/StatusScreen.jsx'
import { ReturnBinList } from '../screens/ReturnBinScreen.jsx'
import DayEnd from '../screens/DayEndScreen.jsx'
import { MOCK_LETTERS, MOCK_RETURNED } from './tome/status.jsx'
import { MOCK_DAY } from './tome/dayend.jsx'
import listArrived from '../../docs/tome-evidence/before-trim/1-list-arrived.png'
import detailArrived from '../../docs/tome-evidence/before-trim/2-detail-arrived.png'
import listRemind from '../../docs/tome-evidence/before-trim/3-list-remind10.png'
import bin from '../../docs/tome-evidence/before-trim/4-bin.png'
import binDetail from '../../docs/tome-evidence/before-trim/5-bin-detail.png'
import weekly from '../../docs/tome-evidence/before-trim/6-weekly.png'

const T = MOCK_LETTERS[0].dueAt
function Box({ children }) {
  return (
    <div className="overflow-hidden rounded-lg bg-bg" style={{ width: 375, height: 667, outline: '1px solid var(--color-border)' }}>
      {children}
    </div>
  )
}
const Shot = ({ src }) => <img src={src} alt="" width={375} height={667} className="block" />
function Row({ title, before, after }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <div className="flex gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink-dim">지금 (줄이기 전)</span>
          <div className="flex gap-3">{before}</div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-state-due">줄인 뒤</span>
          <Box>{after}</Box>
        </div>
      </div>
    </section>
  )
}
function ListWithDone({ now }) {
  const [doneIds, setDoneIds] = useState([])
  return <StatusList letters={MOCK_LETTERS} now={now} doneIds={doneIds} onDone={(i) => setDoneIds((d) => [...d, MOCK_LETTERS[i].id])} />
}

export default { title: '2 작업 기록/11 기능 줄이기 비교' }

export const Compare = {
  name: '지금 / 줄인 뒤',
  render: () => (
    <div className="flex flex-col gap-12 p-6">
      <Row
        title="① 편지 상세 빼기 — 목록 → 눌러서 상세 → 버튼 (두 번) ▶ 목록에서 바로 '배송 완료?' (한 번)"
        before={<><Box><Shot src={listArrived} /></Box><Box><Shot src={detailArrived} /></Box></>}
        after={<ListWithDone now={T} />}
      />
      <Row
        title="② 마감 10분 뒤 '아직 배송 완료되지 않았어요' 알림 빼기"
        before={<Box><Shot src={listRemind} /></Box>}
        after={<ListWithDone now={T + 12} />}
      />
      <Row
        title="③ 반송함 — 목록만 (반송 편지 상세 빼기)"
        before={<><Box><Shot src={bin} /></Box><Box><Shot src={binDetail} /></Box></>}
        after={<ReturnBinList letters={MOCK_RETURNED} />}
      />
      <Row
        title="④ 주간 리마인드 빼기 — 하루 마무리만 남김"
        before={<><Box><Shot src={weekly} /></Box></>}
        after={<DayEnd day={MOCK_DAY} />}
      />
      <p className="text-sm text-ink-dim">⑤ 배송 완료함은 만들지 않음 (하루 마무리가 해낸 편지를 보여줌)</p>
    </div>
  ),
}
