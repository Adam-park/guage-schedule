// 배송 상태 화면 시안 A/B/C — 보낸 편지(최대 3통)가 '얼마나 왔는지'를 한 화면에서
// 게이지 = 보낸 시각 → 도착 시각까지 지난 비율. 봉투 = 닫힌 봉투(빨간 씰, 배송 중).
import { useState } from 'react'
import PixelEnvelope from '../../components/tome/PixelEnvelope.jsx'
import PixelGauge from '../../components/tome/PixelGauge.jsx'
import EnvelopeArt from '../../components/tome/EnvelopeArt.jsx'
import MailboxButton from '../../components/tome/MailboxButton.jsx'
import { StatusList as ListV2, Header, Frame, Notice } from '../../screens/StatusScreen.jsx'
import { hhmm, progress, left, noticesFor } from '../../lib/letters.js'
import { LetterDetail as DetailV2, BLINK_CSS } from '../../screens/LetterDetailScreen.jsx'
import { ReturnBinList, ReturnDetail } from '../../screens/ReturnBinScreen.jsx'
import WeeklyReminder, { checkWeeklyReminder, markWeeklyShown, simulateWeekPassed } from '../../screens/WeeklyScreen.jsx'
import { DayEndA, shouldShowDayEnd, markDayEndShown } from './dayend.jsx'

export { ReturnBinList, ReturnDetail, WeeklyReminder, simulateWeekPassed }

// ---- 목데이터 (Storybook 확인용, 고정 시각) — 오전 9시에 3통 보냄, 지금 오후 2시 ----
const at = (h, m = 0) => h * 60 + m
export const NOW = at(14)
export const MOCK_LETTERS = [
  { id: 1, title: '회의 자료 공유하기', sentAt: at(9), dueAt: at(15) },
  { id: 2, title: '운동 30분', sentAt: at(9), dueAt: at(19) },
  { id: 3, title: '책 10쪽 읽기', sentAt: at(9), dueAt: at(22) },
]

// 10칸 게이지: 지난 비율만큼 파랑
const cellsFor = (p, n = 10) => Array.from({ length: n }, (_, i) => (i < Math.round(p * n) ? 'bg-state-due' : null))

// A · 3줄 목록
export function StatusA({ letters = MOCK_LETTERS, now = NOW }) {
  return (
    <Frame>
      <Header count={letters.length} />
      <div className="flex flex-col gap-6">
        {letters.map((l) => (
          <div key={l.id} className="flex items-center gap-4">
            <EnvelopeArt />
            <div className="font-pixel flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm text-ink">{l.title}</span>
                <span className="shrink-0 text-xs text-ink-dim tabular-nums">{hhmm(l.dueAt)}</span>
              </div>
              <PixelGauge cells={cellsFor(progress(l, now))} height={16} />
              <span className="text-xs text-ink-faint">{left(l, now)}</span>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  )
}

// B · 가장 급한 하나를 크게 + 나머지 작게
export function StatusB({ letters = MOCK_LETTERS, now = NOW }) {
  const [first, ...rest] = [...letters].sort((a, b) => a.dueAt - b.dueAt)
  return (
    <Frame>
      <Header count={letters.length} />
      <div className="font-pixel flex flex-col items-center gap-3 text-center">
        <EnvelopeArt scale={2} />
        <span className="text-xs text-ink-dim">가장 먼저 도착하는 편지</span>
        <span className="text-base text-ink">{first.title}</span>
        <div className="w-full">
          <PixelGauge cells={cellsFor(progress(first, now))} />
        </div>
        <span className="text-xs text-ink-dim tabular-nums">
          {hhmm(first.dueAt)} 도착 · {left(first, now)}
        </span>
      </div>
      <div className="flex flex-col gap-3 border-t border-border pt-5">
        {rest.map((l) => (
          <div key={l.id} className="font-pixel flex items-center gap-3">
            <span className="w-28 truncate text-xs text-ink">{l.title}</span>
            <div className="flex-1">
              <PixelGauge cells={cellsFor(progress(l, now))} height={12} />
            </div>
            <span className="text-xs text-ink-dim tabular-nums">{hhmm(l.dueAt)}</span>
          </div>
        ))}
      </div>
    </Frame>
  )
}

// C · 한 장씩 넘기기 (가로 스와이프 + 점 표시)
export function StatusC({ letters = MOCK_LETTERS, now = NOW }) {
  const [idx, setIdx] = useState(0)
  const onScroll = (e) => setIdx(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))
  return (
    <Frame>
      <Header count={letters.length} />
      <div onScroll={onScroll} className="-mx-6 flex snap-x snap-mandatory overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {letters.map((l) => (
          <div key={l.id} className="font-pixel flex w-full shrink-0 snap-center flex-col items-center gap-3 px-6 text-center">
            <EnvelopeArt scale={3} />
            <span className="mt-2 text-base text-ink">{l.title}</span>
            <div className="w-full">
              <PixelGauge cells={cellsFor(progress(l, now))} />
            </div>
            <span className="text-xs text-ink-dim tabular-nums">
              {hhmm(l.dueAt)} 도착 · {left(l, now)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {letters.map((l, i) => (
          <span key={l.id} className={`h-2 w-2 ${i === idx ? 'bg-ink' : 'bg-border'}`} />
        ))}
      </div>
    </Frame>
  )
}

// ---- 확정: A 목록 → 편지 누르면 상세 ----
// 목록(A)과 같은 모양, 각 줄이 버튼
export function StatusList({ letters = MOCK_LETTERS, now = NOW, onSelect }) {
  return (
    <Frame>
      <Header count={letters.length} />
      <div className="flex flex-col gap-2">
        {letters.map((l, i) => (
          <button key={l.id} type="button" onClick={() => onSelect?.(i)} className="-mx-2 flex items-center gap-4 rounded-md px-2 py-2 text-left active:scale-[.98] active:bg-surface-sunken">
            <EnvelopeArt />
            <div className="font-pixel flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm text-ink">{l.title}</span>
                <span className="shrink-0 text-xs text-ink-dim tabular-nums">{hhmm(l.dueAt)}</span>
              </div>
              <PixelGauge cells={cellsFor(progress(l, now))} height={16} />
              <span className="text-xs text-ink-faint">{left(l, now)}</span>
            </div>
          </button>
        ))}
      </div>
    </Frame>
  )
}

// 상세: 봉투 크기·위치 = 편지 작성 화면(LetterFinal)과 동일 — 바깥 px-6 pt-6, 288×336 상자 가운데, 닫힌 봉투 3배
// 위 머리줄(돌아가기 / 편지N)은 absolute라 봉투 위치에 영향 없음. 아래는 할 일 · 게이지 · 남은 시간만.
// 진행 표시: 게이지의 마지막으로 찬 칸만 천천히 깜빡임 (투명도만 바꾸는 가벼운 효과, 상세 화면에만)
const blinkingCells = (p, n = 10) => {
  const filled = Math.round(p * n)
  return Array.from({ length: n }, (_, i) => (i < filled ? `bg-state-due${i === filled - 1 && p < 1 ? ' tome-cell-blink' : ''}` : null))
}

export function StatusDetail({ letter = MOCK_LETTERS[0], number = 1, now = NOW, onBack }) {
  return (
    <div className="relative mx-auto flex min-h-full max-w-[440px] flex-col items-center px-6 pt-6">
      <style>{BLINK_CSS}</style>
      <button type="button" onClick={onBack} aria-label="목록으로" className="font-pixel absolute top-1 left-1 z-10 flex h-11 w-11 items-center justify-center text-sm text-ink-dim active:scale-[.97]">
        ←
      </button>
      <span className="font-pixel absolute top-1 left-1/2 flex h-11 -translate-x-1/2 items-center text-sm text-ink">편지{number}</span>
      <div className="relative shrink-0" style={{ width: 288, height: 336 }}>
        <PixelEnvelope scale={3} />
      </div>
      <div className="font-pixel mt-2 flex w-full flex-col items-center gap-3 text-center">
        <span className="text-base text-ink">{letter.title}</span>
        <PixelGauge cells={blinkingCells(progress(letter, now))} />
        <span className="text-xs text-ink-dim">{left(letter, now)}</span>
      </div>
    </div>
  )
}

// 목록 ↔ 상세 흐름
export function StatusFlow({ letters = MOCK_LETTERS, now = NOW }) {
  const [sel, setSel] = useState(null)
  return sel === null ? (
    <StatusList letters={letters} now={now} onSelect={setSel} />
  ) : (
    <StatusDetail letter={letters[sel]} number={sel + 1} now={now} onBack={() => setSel(null)} />
  )
}

// ---- 도착 전후 상태 (2026-10-08) — 규칙·계산은 src/lib/letters.js, 목록은 src/screens/StatusScreen.jsx (앱으로 옮김) ----
// 마감 20분 전~마감: 앱 안 알림 "N번 편지가 배송되기 N분 전입니다"
// 마감~+30분: 게이지 꽉 참 → 상세 '배송 완료?' 버튼 → 누르면 '배송 완료!'
// 마감 +10분~+30분(미완료): 앱 안 알림 "N번 편지가 아직 배송 완료되지 않았어요" (문구 임시)
// 마감 +30분(미완료): 반송 — 상세를 열면 흐린 상세 위에 '반송되었습니다'

// 목록 ↔ 상세 + 배송 완료 기록. now는 바깥(시간 바꾸기 버튼)에서 받음
export function StatusFlowV2({ letters = MOCK_LETTERS, now = NOW }) {
  const [sel, setSel] = useState(null)
  const [doneIds, setDoneIds] = useState([])
  return sel === null ? (
    <ListV2 letters={letters} now={now} doneIds={doneIds} onSelect={setSel} />
  ) : (
    <DetailV2
      letter={letters[sel]}
      number={sel + 1}
      now={now}
      doneIds={doneIds}
      notices={noticesFor(letters, now, doneIds)}
      onBack={() => setSel(null)}
      onDone={() => setDoneIds((d) => [...d, letters[sel].id])}
    />
  )
}

// ---- 반송함 (2026-10-08) — 화면은 src/screens/ReturnBinScreen.jsx (앱으로 옮김) ----
// 목록 화면 왼쪽 아래 메일박스 아이콘(PixelLab) + 오른쪽 위 개수. 누르면 반송된 편지 목록(게이지 없음) → 상세(짧은 응원 문구)
// dayOffset: 0 = 오늘, -1 = 어제 … (목데이터)
export const MOCK_RETURNED = [
  { id: 'r1', title: '보고서 초안 쓰기', dueAt: at(11), dayOffset: -1 },
  { id: 'r2', title: '빨래 개기', dueAt: at(13, 30), dayOffset: 0 },
]
// 9통 예시 (여러 날 쌓인 경우 확인용)
export const MOCK_RETURNED_MANY = [
  { id: 'm1', title: '빨래 개기', dueAt: at(13, 30), dayOffset: 0 },
  { id: 'm2', title: '보고서 초안 쓰기', dueAt: at(11), dayOffset: -1 },
  { id: 'm3', title: '장보기', dueAt: at(18), dayOffset: -1 },
  { id: 'm4', title: '엄마한테 전화하기', dueAt: at(20), dayOffset: -1 },
  { id: 'm5', title: '운동 30분', dueAt: at(7), dayOffset: -2 },
  { id: 'm6', title: '책 10쪽 읽기', dueAt: at(22), dayOffset: -2 },
  { id: 'm7', title: '이메일 답장', dueAt: at(10), dayOffset: -4 },
  { id: 'm8', title: '방 청소', dueAt: at(15), dayOffset: -4 },
  { id: 'm9', title: '영수증 정리', dueAt: at(17), dayOffset: -5 },
]

// ---- 주간 리마인드 화면 (2026-10-08) — src/screens/WeeklyScreen.jsx (앱으로 옮김) ----

// 요일과 상관없이: 마지막으로 보여준 뒤 7일이 지나고 '처음 앱을 연 순간' 한 번. 집계 = 그 순간부터 최근 7일.
// 처음 쓰는 사람은 사용 시작 7일 뒤 첫 접속부터. 기록은 이 기기(localStorage)에 저장.
// 배송 상태(목록·상세) + 반송함(목록·상세) 전체 흐름
// 예시 기록 (목데이터): 최근 7일 도착 5통
export const MOCK_WEEK_ARRIVED = 5
export function StatusWithBin({ letters = MOCK_LETTERS, returned = MOCK_RETURNED, now = NOW, weekArrived = MOCK_WEEK_ARRIVED, initialDoneIds = [] }) {
  // 앱을 열 때 순서: ① 하루 마무리(마지막 일정 +30분 지남, 하루 1회) → ② 주간 리마인드(7일 지남, 최근 7일 도착 1통 이상) → 평소 화면
  // 최근 7일 도착이 0통이면 리마인드를 띄우지 않음 (쓰는 사람을 위한 돌아보기, 안 쓴 사람을 부르는 용도 아님)
  const weeklyDue = () => weekArrived > 0 && checkWeeklyReminder()
  const [view, setView] = useState(() => (shouldShowDayEnd(letters, now) ? { name: 'dayEnd' } : weeklyDue() ? { name: 'weekly' } : { name: 'list' }))
  const [doneIds, setDoneIds] = useState(initialDoneIds)
  const go = (v) => () => setView(v)
  if (view.name === 'dayEnd') {
    const day = letters.map((l) => ({ ...l, result: doneIds.includes(l.id) ? 'done' : 'returned' }))
    const close = () => {
      markDayEndShown()
      setView(weeklyDue() ? { name: 'weekly' } : { name: 'list' })
    }
    return <DayEndA day={day} onClose={close} />
  }
  if (view.name === 'bin') return <ReturnBinList letters={returned} onBack={go({ name: 'list' })} onSelect={(i) => setView({ name: 'binDetail', i })} />
  if (view.name === 'weekly') {
    const close = (next) => () => {
      markWeeklyShown()
      setView(next)
    }
    return <WeeklyReminder arrived={weekArrived} waiting={returned.length} onOpenBin={close({ name: 'bin' })} onClose={close({ name: 'list' })} />
  }
  if (view.name === 'binDetail') return <ReturnDetail letter={returned[view.i]} number={view.i + 1} onBack={go({ name: 'bin' })} />
  if (view.name === 'detail')
    return (
      <DetailV2
        letter={letters[view.i]}
        number={view.i + 1}
        now={now}
        doneIds={doneIds}
        notices={noticesFor(letters, now, doneIds)}
        onBack={go({ name: 'list' })}
        onDone={() => setDoneIds((d) => [...d, letters[view.i].id])}
      />
    )
  return (
    <div className="relative h-full">
      <ListV2 letters={letters} now={now} doneIds={doneIds} onSelect={(i) => setView({ name: 'detail', i })} />
      <MailboxButton count={returned.length} onClick={go({ name: 'bin' })} />
    </div>
  )
}
