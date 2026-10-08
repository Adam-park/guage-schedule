// 편지 상세 — Storybook 확정안 (2026-10-08). 봉투 크기·위치 = 편지 작성 화면과 동일(288×336, 닫힌 봉투 3배)
// 마감 전: 할 일 + 게이지(마지막 찬 칸만 깜빡임) + 남은 시간 / 마감 20분 전: 위에 앱 안 알림
// 마감~+30분: '배송 완료?' 버튼 → 누르면 '배송 완료!'(게이지 green-300) / +30분 미완료: 흐린 상세 위 '반송되었습니다'
import { useEffect, useState } from 'react'
import PixelEnvelope from '../components/tome/PixelEnvelope.jsx'
import PixelGauge from '../components/tome/PixelGauge.jsx'
import { Notice } from './StatusScreen.jsx'
import { letterState, stateCells, stateText, noticesFor, nowMin, loadLetters, todayLetters, markDone } from '../lib/letters.js'

// 진행 표시: 게이지의 마지막으로 찬 칸만 천천히 깜빡임 (투명도만 바꾸는 가벼운 효과, 상세 화면에만)
export const BLINK_CSS = `
@keyframes tome-cell-blink { 0%, 100% { opacity: 1 } 50% { opacity: 0.35 } }
.tome-cell-blink { animation: tome-cell-blink 1.4s steps(1, end) infinite }
@media (prefers-reduced-motion: reduce) { .tome-cell-blink { animation: none } }
`

export function LetterDetail({ letter, number, now, doneIds, notices, onBack, onDone }) {
  const st = letterState(letter, now, doneIds.includes(letter.id))
  const returned = st === 'returned'
  const body = (
    <div className="relative mx-auto flex min-h-full max-w-[440px] flex-col items-center px-6 pt-6">
      <style>{BLINK_CSS}</style>
      <span className="font-pixel absolute top-1 left-1/2 flex h-11 -translate-x-1/2 items-center text-sm text-ink">편지{number}</span>
      <div className="relative shrink-0" style={{ width: 288, height: 336 }}>
        <PixelEnvelope scale={3} />
      </div>
      <div className="font-pixel mt-2 flex w-full flex-col items-center gap-3 text-center">
        <span className="text-base text-ink">{letter.title}</span>
        <PixelGauge cells={stateCells(letter, now, st, true)} />
        {st === 'arrived' || st === 'done' ? (
          <button
            type="button"
            onClick={onDone}
            disabled={st === 'done'}
            className="font-pixel mt-1 w-full rounded-lg bg-ink py-3.5 text-sm text-white transition-transform active:scale-[.98]"
          >
            {st === 'done' ? '배송 완료!' : '배송 완료?'}
          </button>
        ) : (
          <span className="text-xs text-ink-dim">{stateText(letter, now, st)}</span>
        )}
      </div>
      {notices.length > 0 && !returned && (
        <div className="absolute inset-x-6 top-12 flex flex-col gap-2">
          {notices.map((t) => (
            <Notice key={t}>{t}</Notice>
          ))}
        </div>
      )}
    </div>
  )
  return (
    <div className="relative h-full">
      {returned ? <div className="pointer-events-none h-full opacity-70 blur-[3px]">{body}</div> : body}
      {returned && (
        <div className="absolute inset-0 flex items-center justify-center px-10">
          <div className="font-pixel w-full rounded-lg border-2 border-ink bg-bg px-5 py-6 text-center text-sm text-ink">반송되었습니다</div>
        </div>
      )}
      <button type="button" onClick={onBack} aria-label="목록으로" className="font-pixel absolute top-1 left-1 z-20 flex h-11 w-11 items-center justify-center text-sm text-ink-dim active:scale-[.97]">
        ←
      </button>
    </div>
  )
}

// 오늘 편지 중 index번째. 편지는 이 기기 저장소에서 읽고 1분마다 다시 계산
export default function LetterDetailScreen({ index, onBack }) {
  const [date, setDate] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setDate(new Date()), 60 * 1000)
    return () => clearInterval(t)
  }, [])
  const letters = todayLetters(loadLetters(), date)
  const letter = letters[index]
  if (!letter) return null
  const now = nowMin(date)
  const doneIds = letters.filter((l) => l.done).map((l) => l.id)
  const done = () => {
    markDone(letter.id)
    setDate(new Date())
  }
  return <LetterDetail letter={letter} number={index + 1} now={now} doneIds={doneIds} notices={noticesFor(letters, now, doneIds)} onBack={onBack} onDone={done} />
}
