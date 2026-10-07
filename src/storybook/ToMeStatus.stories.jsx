// 배송 상태 화면 시안 비교 — 예시: 오전 9시에 3통 보냄, 지금 오후 2시
import { useState } from 'react'
import { StatusA, StatusB, StatusC, StatusFlow, StatusDetail, StatusFlowV2, StatusWithBin, ReturnDetail, ReturnBinList, WeeklyReminder, simulateWeekPassed, MOCK_LETTERS, MOCK_RETURNED, MOCK_RETURNED_MANY } from './tome/status.jsx'
import { LetterFinal } from './tome/letter.jsx'

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

export default { title: '2 작업 기록/4 배송 상태 시안' }

export const Compare = {
  name: '시안 비교',
  render: () => (
    <div className="flex gap-8 p-6">
      <Phone label="A · 3줄 목록" sub="작은 봉투 + 할 일 + 게이지를 한 줄씩"><StatusA /></Phone>
      <Phone label="B · 가장 급한 하나를 크게" sub="곧 도착할 편지 크게, 나머지 작게"><StatusB /></Phone>
      <Phone label="C · 한 장씩 넘기기" sub="옆으로 밀어서 다음 편지 (점 3개)"><StatusC /></Phone>
    </div>
  ),
}

export const Flow = {
  name: 'A 확정 · 목록 → 상세 (편지를 눌러 보기)',
  render: () => (
    <div className="flex gap-8 p-6">
      <Phone label="목록 → 상세" sub="편지를 누르면 상세, 왼쪽 위 ←로 돌아가기"><StatusFlow /></Phone>
      <Phone label="상세 · 편지1" sub="봉투 크기·위치 = 편지 작성 화면"><StatusDetail /></Phone>
      <Phone label="(비교) 편지 작성 화면" sub="봉투 위치 대조용"><LetterFinal /></Phone>
    </div>
  ),
}

// 도착 전후 — 편지1(마감 15:00) 기준으로 시간을 바꿔 보기
const T = MOCK_LETTERS[0].dueAt
const TIMES = [
  ['마감 30분 전', T - 30],
  ['20분 전', T - 20],
  ['마감', T],
  ['+10분', T + 10],
  ['+30분 (반송)', T + 30],
]
function TimeLab() {
  const [now, setNow] = useState(T - 30)
  const [k, setK] = useState(0)
  return (
    <div className="flex gap-8 p-6">
      <div className="flex w-40 flex-col gap-2 pt-10">
        <div className="text-xs text-ink-dim">지금 시각 바꾸기 (편지1 마감 15:00)</div>
        {TIMES.map(([label, t]) => (
          <button key={label} type="button" onClick={() => setNow(t)} className={`rounded-md border border-border px-3 py-2 text-left text-xs ${now === t ? 'bg-ink text-white' : 'bg-surface text-ink'}`}>
            {label}
          </button>
        ))}
        <button type="button" onClick={() => setK(k + 1)} className="mt-2 text-left text-xs text-state-due underline">
          배송 완료 기록 지우기
        </button>
      </div>
      <Phone label="배송 상태 · 도착 전후" sub="편지를 눌러 상세 확인">
        <StatusFlowV2 key={k} now={now} />
      </Phone>
    </div>
  )
}
export const Arrival = { name: '도착 전후 (시간 바꿔 보기)', render: () => <TimeLab /> }

// 주간 리마인드 확인: '사용 8일째' 상태로 만들고 화면을 새로 시작 → 앱을 연 것처럼 리마인드부터 뜸
function BinWithWeekly() {
  const [k, setK] = useState(0)
  return (
    <div className="relative h-full">
      <StatusWithBin key={k} />
      <button type="button" onClick={() => { simulateWeekPassed(); setK(k + 1) }} className="absolute right-2 bottom-2 rounded border border-border bg-surface px-2 py-1 text-[10px] text-ink-dim">
        (확인용) 7일 지난 뒤 앱 열기
      </button>
    </div>
  )
}

export const Bin = {
  name: '반송함 + 주간 리마인드 (전체 흐름)',
  render: () => (
    <div className="flex gap-8 p-6">
      <Phone label="배송 상태 + 반송함" sub="오른쪽 아래 확인용 버튼 → 리마인드부터 시작"><BinWithWeekly /></Phone>
    </div>
  ),
}

// 주간 리마인드 (최근 7일 도착 1통 이상일 때만)
export const Weekly = {
  name: '주간 리마인드',
  render: () => (
    <div className="flex gap-8 p-6">
      <Phone label="① 도착 5 · 반송 2" sub="보통의 주"><WeeklyReminder arrived={5} waiting={2} /></Phone>
      <Phone label="② 도착 5 · 반송 0" sub="반송함 비어 있음"><WeeklyReminder arrived={5} waiting={0} /></Phone>
    </div>
  ),
}

// 반송 편지 상세 (담담한 한 줄)
export const ReturnDetailStory = {
  name: '반송 편지 상세',
  render: () => (
    <div className="flex gap-8 p-6">
      <Phone label="어제 편지" sub="날짜 붙음"><ReturnDetail letter={MOCK_RETURNED[0]} number={1} /></Phone>
      <Phone label="오늘 편지" sub="시간만"><ReturnDetail letter={MOCK_RETURNED[1]} number={2} /></Phone>
    </div>
  ),
}

export const BinMany = {
  name: '반송함 날짜별 묶음 (2통 / 9통)',
  render: () => (
    <div className="flex gap-8 p-6">
      <Phone label="2통" sub="오늘 1 · 어제 1"><ReturnBinList letters={MOCK_RETURNED} /></Phone>
      <Phone label="9통" sub="여러 날 쌓인 경우"><ReturnBinList letters={MOCK_RETURNED_MANY} /></Phone>
    </div>
  ),
}
