// 하루 마무리 화면 시안 비교 — 예시: 3통 중 2통 도착, 1통 반송
import { useState } from 'react'
import { DayEndA, DayEndB, DayEndC, MOCK_DAY, resetDayEnd } from './tome/dayend.jsx'
import { StatusWithBin, MOCK_LETTERS } from './tome/status.jsx'

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

export default { title: '2 작업 기록/5 하루 마무리 시안' }

export const Compare = {
  name: '시안 비교',
  render: () => (
    <div className="flex gap-8 p-6">
      <Phone label="A · 하루 끝의 나에게" sub="도착 통수 크게 + 도착한 일 목록"><DayEndA /></Phone>
      <Phone label="B · 오늘의 게이지" sub="3칸 게이지로 하루를 한 줄에"><DayEndB /></Phone>
      <Phone label="C · 받은 편지 한 장" sub="열린 봉투 + To/From 편지 형식"><DayEndC /></Phone>
    </div>
  ),
}

// A 확정: 2통 도착한 날 / 3통 모두 반송된 날
export const Final = {
  name: 'A 확정 · 두 경우',
  render: () => (
    <div className="flex gap-8 p-6">
      <Phone label="2통 도착 · 1통 반송" sub="보통의 날"><DayEndA /></Phone>
      <Phone label="3통 모두 반송" sub="설명만 다름, 반짝임 없음"><DayEndA day={MOCK_DAY.map((l) => ({ ...l, result: 'returned' }))} /></Phone>
    </div>
  ),
}

// 뜨는 시점 확인: 마지막 일정(22:00) + 30분 전후로 '앱을 열어' 보기
const LAST = Math.max(...MOCK_LETTERS.map((l) => l.dueAt))
const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
function DayEndLab() {
  const [now, setNow] = useState(LAST + 29)
  const [done, setDone] = useState([1, 2])
  const [k, setK] = useState(0)
  const reopen = (patch) => {
    if (patch.now !== undefined) setNow(patch.now)
    if (patch.done !== undefined) setDone(patch.done)
    setK((x) => x + 1)
  }
  const btn = (on) => `rounded-md border border-border px-3 py-2 text-left text-xs ${on ? 'bg-ink text-white' : 'bg-surface text-ink'}`
  return (
    <div className="flex gap-8 p-6">
      <div className="flex w-44 flex-col gap-2 pt-10 text-xs">
        <div className="text-ink-dim">지금 시각 (마지막 일정 {fmt(LAST)})</div>
        <button type="button" className={btn(now === LAST + 29)} onClick={() => reopen({ now: LAST + 29 })}>{fmt(LAST + 29)} 에 앱 열기</button>
        <button type="button" className={btn(now === LAST + 30)} onClick={() => reopen({ now: LAST + 30 })}>{fmt(LAST + 30)} 에 앱 열기</button>
        <div className="mt-3 text-ink-dim">오늘 결과</div>
        <button type="button" className={btn(done.length === 2)} onClick={() => reopen({ done: [1, 2] })}>2통 배송 완료</button>
        <button type="button" className={btn(done.length === 0)} onClick={() => reopen({ done: [] })}>모두 반송</button>
        <button type="button" className="mt-3 text-left text-state-due underline" onClick={() => { resetDayEnd(); setK((x) => x + 1) }}>
          오늘 본 기록 지우기
        </button>
      </div>
      <Phone label="앱을 열었을 때 첫 화면" sub="22:30부터 하루 마무리">
        <StatusWithBin key={k} now={now} initialDoneIds={done} weekArrived={0} />
      </Phone>
    </div>
  )
}
export const Timing = { name: '뜨는 시점 (앱 열어 보기)', render: () => <DayEndLab /> }
