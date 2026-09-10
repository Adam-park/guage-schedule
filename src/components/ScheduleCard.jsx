import { forwardRef, useState } from 'react'

const CRACK_MS = 380

// 일정 카드. 클릭하면 제목 위로 선이 그어지는 크랙 연출 후 onResolve(value) 호출.
// 불씨까지 날아가는 애니메이션은 좌표 계산이 필요해서 부모(ScheduleHand)가 처리 (design.md 2장)
const ScheduleCard = forwardRef(function ScheduleCard(
  { time, title, value, onResolve, reduceMotion = false },
  ref
) {
  const [cracking, setCracking] = useState(false)
  const [disabled, setDisabled] = useState(false)

  function handleClick() {
    if (disabled) return
    setDisabled(true)

    if (reduceMotion) {
      onResolve(value)
      return
    }

    setCracking(true)
    setTimeout(() => {
      setCracking(false)
      onResolve(value)
    }, CRACK_MS)
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="relative flex w-28 flex-col gap-3.5 rounded-lg border border-border bg-gradient-to-b from-surface to-surface-sunken p-2.5 text-left shadow-[0_3px_0_rgba(21,17,13,0.14)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-ink-dim tabular-nums">{time}</span>
        <span className="flex items-center gap-1 text-xs font-semibold text-ember-1 tabular-nums">
          <span className="h-1.5 w-1.5 rotate-45 rounded-[50%_50%_50%_0] bg-ember-1" />
          {value}
        </span>
      </div>

      <div className="relative">
        <div className="truncate text-sm font-semibold leading-snug text-ink">{title}</div>
        <svg
          className="pointer-events-none absolute inset-x-0 top-1/2 h-4 w-full -translate-y-1/2 overflow-visible"
          viewBox="0 0 100 16"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className={`strike-path ${cracking ? 'is-drawing' : ''}`}
            d="M3,9 Q50,2 97,10"
            pathLength="1"
          />
        </svg>
      </div>

      <div className="mt-auto text-[10px] tracking-wide text-ink-dim">탭해서 처리</div>
    </button>
  )
})

export default ScheduleCard
