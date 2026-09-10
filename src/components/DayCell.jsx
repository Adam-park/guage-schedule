import { useRef, useState } from 'react'
import Hearth from './Hearth.jsx'
import ScheduleHand from './ScheduleHand.jsx'

const FLOOR = 12 // 불씨 최저치 — 이 밑으로 절대 안 내려감 (design.md 2장)
const START_LEVEL = 30

// 하루 전체 패널. variant='today'면 인터랙션 가능, 'tomorrow'면 축소·흐리게 (design.md 2장)
export default function DayCell({ date, dow, items, variant = 'today' }) {
  const [level, setLevel] = useState(START_LEVEL)
  const [flaring, setFlaring] = useState(false)
  const pitRef = useRef(null)
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function handleBurn(value) {
    setLevel((v) => Math.max(FLOOR, Math.min(100, v + value)))
    setFlaring(true)
    setTimeout(() => setFlaring(false), 500)
  }

  if (variant === 'tomorrow') {
    return (
      <div className="rounded-lg border border-border bg-surface px-4 py-3 opacity-65">
        <div className="mb-2.5 text-xs font-semibold text-ink-dim">내일</div>
        <div className="flex gap-2">
          {items.map((item) => (
            <div key={item.id} className="h-11 w-[74px] rounded-md border border-border bg-surface-sunken" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative rounded-lg border border-border bg-surface px-[18px] pb-5 pt-[18px] shadow-[0_10px_24px_-18px_rgba(21,17,13,0.35)]">
      <span className="absolute left-3 top-2.5 text-[13px] font-semibold text-ink-faint">{date}</span>
      <span className="absolute right-3.5 top-[11px] text-[11px] uppercase tracking-wider text-ink-faint">
        {dow}
      </span>

      <Hearth ref={pitRef} level={level} floor={FLOOR} flaring={flaring} />

      <ScheduleHand items={items} hearthRef={pitRef} onBurn={handleBurn} reduceMotion={reduceMotion} />
    </div>
  )
}
