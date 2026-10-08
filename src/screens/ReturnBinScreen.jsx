// 반송함 — Storybook 확정안 (2026-10-08). 배송 상태 목록 왼쪽 아래 우편함을 누르면 열림
// 목록: 날짜별 묶음(날짜는 묶음 왼쪽 위에 한 번, 최근 날짜가 위, 길면 목록만 스크롤). 상세: 할 일 + 담담한 한 줄, 게이지 없음
// 편지의 dayOffset: 0 = 오늘, -1 = 어제 … (앱에서는 저장된 date로 계산)
import { useState } from 'react'
import PixelEnvelope from '../components/tome/PixelEnvelope.jsx'
import EnvelopeArt from '../components/tome/EnvelopeArt.jsx'
import { Frame } from './StatusScreen.jsx'
import { hhmm, loadLetters, returnedLetters } from '../lib/letters.js'

// 반송 편지 시각 표시: 오늘이면 '13:30', 다른 날이면 '10월 7일 11:00' (헷갈리지 않게 날짜를 붙임)
export function whenLabel(l, today = new Date()) {
  if (!l.dayOffset) return hhmm(l.dueAt)
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + l.dayOffset)
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${hhmm(l.dueAt)}`
}
// 반송 상세 문구: 담담한 사실 한 줄 (도착 기록은 주간 리마인드 화면으로 옮김, 2026-10-08)
export const returnMessage = (letter) => `${whenLabel(letter)}의 나에게는 닿지 못했어요.`
function BackButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} aria-label="뒤로" className="font-pixel absolute top-1 left-1 z-20 flex h-11 w-11 items-center justify-center text-sm text-ink-dim active:scale-[.97]">
      ←
    </button>
  )
}

const dayLabel = (offset, today = new Date()) => {
  if (!offset) return '오늘'
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset)
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}
function groupByDay(letters) {
  const map = new Map()
  letters.forEach((l, i) => {
    const day = l.dayOffset ?? 0
    if (!map.has(day)) map.set(day, [])
    map.get(day).push({ l, i })
  })
  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([day, items]) => ({ day, items: items.sort((a, b) => a.l.dueAt - b.l.dueAt) }))
}

export function ReturnBinList({ letters, onSelect = () => {}, onBack }) {
  return (
    // 목록이 길어지면 안쪽 영역만 세로 스크롤 (← 버튼은 바깥에 두어 제자리 고정)
    <div className="relative h-full">
      <BackButton onClick={onBack} />
      <div className="h-full overflow-y-auto">
      <Frame>
        <div className="font-pixel flex items-baseline justify-between pl-8">
          <span className="text-sm text-ink">반송함</span>
          <span className="text-xs text-ink-dim tabular-nums">{letters.length}통</span>
        </div>
        {/* 날짜별 묶음: 날짜는 묶음 왼쪽 위에 한 번만, 그 아래로 편지 쌓기. 최근 날짜가 위, 같은 날은 시간 순 */}
        {groupByDay(letters).map(({ day, items }) => (
          <section key={day} className="flex flex-col gap-1">
            <h3 className="font-pixel text-xs text-ink-dim">{dayLabel(day)}</h3>
            {items.map(({ l, i }) => (
              <button key={l.id} type="button" onClick={() => onSelect(i)} className="-mx-2 flex items-center gap-4 rounded-md px-2 py-2 text-left active:scale-[.98] active:bg-surface-sunken">
                <EnvelopeArt />
                <div className="font-pixel flex min-w-0 flex-1 items-baseline justify-between gap-2">
                  <span className="truncate text-sm text-ink">{l.title}</span>
                  <span className="shrink-0 text-xs text-ink-dim tabular-nums">{hhmm(l.dueAt)}</span>
                </div>
              </button>
            ))}
          </section>
        ))}
      </Frame>
      </div>
    </div>
  )
}

// 상세: 봉투 크기·위치 = 편지 작성/편지 상세와 동일. 할 일 + 담담한 한 줄
export function ReturnDetail({ letter, number, onBack }) {
  return (
    <div className="relative mx-auto flex min-h-full max-w-[440px] flex-col items-center px-6 pt-6">
      <BackButton onClick={onBack} />
      <span className="font-pixel absolute top-1 left-1/2 flex h-11 -translate-x-1/2 items-center text-sm text-ink">반송 편지{number}</span>
      <div className="relative shrink-0" style={{ width: 288, height: 336 }}>
        <PixelEnvelope scale={3} />
      </div>
      <div className="font-pixel mt-2 flex w-full flex-col items-center gap-3 text-center">
        <span className="text-base text-ink">{letter.title}</span>
        <p className="text-xs leading-relaxed text-ink-dim">{returnMessage(letter)}</p>
      </div>
    </div>
  )
}


// 저장된 date('2026-10-08') → 오늘 기준 며칠 전인지 (오늘 0, 어제 -1)
const offsetOf = (date, today = new Date()) => {
  const [y, m, d] = date.split('-').map(Number)
  return Math.round((new Date(y, m - 1, d) - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000)
}

// 반송함 목록 ↔ 상세. 편지는 이 기기 저장소에서 읽음
export default function ReturnBinScreen({ onBack }) {
  const [sel, setSel] = useState(null)
  // 목록에 보이는 순서(최근 날짜 위, 같은 날은 시간 순)로 정렬 — '반송 편지N' 번호가 보이는 순서와 맞게
  const letters = returnedLetters(loadLetters())
    .map((l) => ({ ...l, dayOffset: offsetOf(l.date) }))
    .sort((a, b) => b.dayOffset - a.dayOffset || a.dueAt - b.dueAt)
  if (sel !== null && letters[sel]) return <ReturnDetail letter={letters[sel]} number={sel + 1} onBack={() => setSel(null)} />
  return <ReturnBinList letters={letters} onSelect={setSel} onBack={onBack} />
}
