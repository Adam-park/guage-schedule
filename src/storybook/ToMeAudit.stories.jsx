// 검수 결과 (2026-10-09) — 실제 앱 화면 그대로 + 기준선/표시. 보기용
import { LetterDetail } from '../screens/LetterDetailScreen.jsx'
import DayEnd from '../screens/DayEndScreen.jsx'
import WeeklyReminder from '../screens/WeeklyScreen.jsx'
import { MOCK_LETTERS, StatusWithBin } from './tome/status.jsx'
import { MOCK_DAY } from './tome/dayend.jsx'
import { noticesFor } from '../lib/letters.js'

// 버튼 기준선: 위 440px, 아래 488px (다른 화면 버튼 = 높이 48px)
function Guides() {
  return (
    <>
      {[440, 488].map((y) => (
        <div key={y} className="pointer-events-none absolute inset-x-0 z-50" style={{ top: y, height: 0, borderTop: '1px dashed #ef4444' }}>
          <span className="absolute left-1 bg-white px-1 text-[10px]" style={{ top: -14, color: "#ef4444" }}>{y}px</span>
        </div>
      ))}
    </>
  )
}
function Phone({ label, sub, guides, children, mark }) {
  return (
    <div style={{ width: 375 }}>
      <div className="text-sm font-semibold text-ink">{label}</div>
      <div className="mb-2 text-xs text-ink-dim">{sub}</div>
      <div className="relative overflow-hidden rounded-lg bg-bg" style={{ width: 375, height: 667, outline: '1px solid var(--color-border)' }}>
        {children}
        {guides && <Guides />}
        {mark && <div className="pointer-events-none absolute z-50 rounded-full" style={{ ...mark, border: "2px solid #ef4444" }} />}
      </div>
    </div>
  )
}

const L1 = MOCK_LETTERS[0]

export default { title: '2 작업 기록/10 검수 결과' }

export const Audit = {
  name: '검수 결과 보기',
  render: () => (
    <div className="flex flex-col gap-10 p-6">
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">① 버튼 높이 — 빨간 점선 = 다른 화면 버튼의 위·아래 (440~488px)</h2>
        <div className="flex flex-wrap gap-8">
          <Phone label="편지 상세" sub="버튼 48px — 점선 안에 딱 맞음" guides>
            <LetterDetail letter={L1} number={1} now={L1.dueAt + 5} doneIds={[]} notices={[]} />
          </Phone>
          <Phone label="하루 마무리" sub="버튼 48px — 점선 안에 딱 맞음" guides>
            <DayEnd day={MOCK_DAY} />
          </Phone>
          <Phone label="주간 리마인드 ← 다름" sub="버튼 52px — 아래 점선보다 4px 더 내려감" guides>
            <WeeklyReminder arrived={5} waiting={2} />
          </Phone>
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">② 이미 알고 있던 것</h2>
        <div className="flex flex-wrap gap-8">
          <Phone label="배송 상태 목록 — 우편함 배지" sub="빨간 원: 숫자 배지가 깃발에 살짝 겹침" mark={{ left: 52, top: 548, width: 64, height: 56 }}>
            <StatusWithBin weekArrived={0} />
          </Phone>
          <Phone label="편지 상세 — 알림 칸" sub="빨간 원: 알림 칸과 봉투 사이 (겹치지 않음, 틈 약 8px)" mark={{ left: 70, top: 76, width: 236, height: 44 }}>
            <LetterDetail letter={L1} number={1} now={L1.dueAt - 15} doneIds={[]} notices={noticesFor(MOCK_LETTERS, L1.dueAt - 15, [])} />
          </Phone>
        </div>
      </section>
    </div>
  ),
}
