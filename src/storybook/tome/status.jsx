// 배송 상태 화면 시안 A/B/C — 보낸 편지(최대 3통)가 '얼마나 왔는지'를 한 화면에서
// 게이지 = 보낸 시각 → 도착 시각까지 지난 비율. 봉투 = 닫힌 봉투(빨간 씰, 배송 중).
import { useState } from 'react'
import PixelEnvelope from '../../components/tome/PixelEnvelope.jsx'
import PixelGauge from '../../components/tome/PixelGauge.jsx'

// ---- 목데이터 (Storybook 확인용, 고정 시각) — 오전 9시에 3통 보냄, 지금 오후 2시 ----
const at = (h, m = 0) => h * 60 + m
export const NOW = at(14)
export const MOCK_LETTERS = [
  { id: 1, title: '회의 자료 공유하기', sentAt: at(9), dueAt: at(15) },
  { id: 2, title: '운동 30분', sentAt: at(9), dueAt: at(19) },
  { id: 3, title: '책 10쪽 읽기', sentAt: at(9), dueAt: at(22) },
]

const hhmm = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`
const progress = (l, now) => Math.max(0, Math.min(1, (now - l.sentAt) / (l.dueAt - l.sentAt)))
const left = (l, now) => {
  const m = l.dueAt - now
  return m <= 0 ? '도착' : m >= 60 ? `${Math.floor(m / 60)}시간${m % 60 ? ` ${m % 60}분` : ''} 남음` : `${m}분 남음`
}
// 10칸 게이지: 지난 비율만큼 파랑
const cellsFor = (p, n = 10) => Array.from({ length: n }, (_, i) => (i < Math.round(p * n) ? 'bg-state-due' : null))

// 봉투의 '그림이 그려진 부분'만 보이게 잘라 보여주기 (원본 96×112 중 (14,26) 66×57). 그림 자체는 변형 없음.
function EnvelopeArt({ scale = 1 }) {
  return (
    <div className="shrink-0 overflow-hidden" style={{ width: 66 * scale, height: 57 * scale }}>
      <div style={{ marginLeft: -14 * scale, marginTop: -26 * scale }}>
        <PixelEnvelope scale={scale} />
      </div>
    </div>
  )
}

function Header({ count }) {
  return (
    <div className="font-pixel flex items-baseline justify-between">
      <span className="text-sm text-ink">배송 중인 편지</span>
      <span className="text-xs text-ink-dim tabular-nums">{count}/3</span>
    </div>
  )
}

const Frame = ({ children }) => <div className="mx-auto flex min-h-full max-w-[440px] flex-col gap-6 px-6 pt-10 pb-8">{children}</div>

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
const BLINK_CSS = `
@keyframes tome-cell-blink { 0%, 100% { opacity: 1 } 50% { opacity: 0.35 } }
.tome-cell-blink { animation: tome-cell-blink 1.4s steps(1, end) infinite }
@media (prefers-reduced-motion: reduce) { .tome-cell-blink { animation: none } }
`
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
