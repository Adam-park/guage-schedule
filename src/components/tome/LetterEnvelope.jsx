// 편지 작성 봉투 — 닫힘 envelope-closed.png → 열림 envelope-open.png(속지·글씨, PixelLab 2026-10-07)
// '쓰는 만큼 써지는' 글씨 효과: 속지 색 덮개를 걷어냄
import { useEffect, useState } from 'react'
import PixelEnvelope from './PixelEnvelope.jsx'

export const SCALE = 3 // 96×112 → 288×336 (정수배)
// envelope-open.png 속지 글씨 줄 5개 (원본 좌표 실측)
const LINES = [
  { y0: 30, y1: 32 },
  { y0: 35, y1: 37 },
  { y0: 39, y1: 42 },
  { y0: 44, y1: 47 },
  { y0: 49, y1: 51 },
].map((l) => ({ ...l, x0: 28, x1: 67 }))
const PAPER = '#f7f7ee' // 속지 색 (실측 단일색)

export function useOpen(delay = 500) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return open
}

// 할 일 4글자 = 글씨 한 줄 (1~4줄), 시간 입력 = 마지막 줄
export function revealFor(title, time) {
  const n = [...title].length
  return LINES.map((_, i) => (i === LINES.length - 1 ? (time ? 1 : 0) : Math.max(0, Math.min(1, (n - i * 4) / 4))))
}

export default function LetterEnvelope({ open, reveal, sending }) {
  const fade = (on) => ({ width: '100%', height: '100%', imageRendering: 'pixelated', opacity: on ? 1 : 0, transition: 'opacity 240ms steps(3)' })
  return (
    <div
      className={`relative shrink-0 transition-all duration-700 ease-in ${sending ? '-translate-y-32 translate-x-12 rotate-12 scale-50 opacity-0' : ''}`}
      style={{ width: 96 * SCALE, height: 112 * SCALE }}
    >
      <div className="absolute inset-0" style={fade(!open)}>
        <PixelEnvelope scale={SCALE} />
      </div>
      <img src="/assets/pixelart/envelope-open.png" alt="" className="absolute inset-0" style={fade(open)} />
      {open &&
        LINES.map((l, i) => {
          const f = reveal[i] ?? 0
          const x = (l.x0 - 1 + (l.x1 - l.x0 + 3) * f) * SCALE
          const w = (l.x1 + 2) * SCALE - x
          return w > 0 ? (
            <div
              key={i}
              className="absolute"
              style={{ left: x, top: l.y0 * SCALE, width: w, height: (l.y1 - l.y0 + 1) * SCALE, background: PAPER, transition: 'left 180ms steps(4), width 180ms steps(4)' }}
            />
          ) : null
        })}
    </div>
  )
}
