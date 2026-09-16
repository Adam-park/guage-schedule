import { forwardRef } from 'react'
import Pyre from './Pyre.jsx'
import { EMBER } from '../theme/colors.js'

// 불꽃 게이지. 순수 표시 컴포넌트 — 로직 없음 (design.md 2장)
// level만큼 위에서부터 드러나고, 나머지는 카드색 마스크로 덮여 있음(불의 밑동이 제일 세게 타므로
// 레벨이 오를수록 아래(밑동)까지 드러나는 게 "불이 커진다"는 느낌을 줌).
const Hearth = forwardRef(function Hearth({ level, floor = 12, flaring = false }, ref) {
  const clamped = Math.max(floor, Math.min(100, level))
  const hiddenPercent = 100 - clamped

  return (
    <div
      ref={ref}
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={floor}
      aria-valuemax={100}
      aria-label="오늘 불꽃"
      className="relative h-40 w-full overflow-hidden rounded-lg border border-border bg-pit"
    >
      <Pyre
        soot={EMBER.soot}
        ember={EMBER.deep}
        flame={EMBER.core}
        spark={EMBER.gold}
        exposure={flaring ? 15 : 10}
        glow={{ color: EMBER.core, strength: flaring ? 10 : 6 }}
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* level 밑으로는 카드색으로 덮어서 아직 안 드러난 것처럼 */}
      <div
        className="absolute inset-x-0 bottom-0 bg-surface transition-[height] duration-700 ease-out"
        style={{ height: `${hiddenPercent}%` }}
      />

      <div className="absolute bottom-2 right-2.5 rounded-full bg-black/45 px-2 py-0.5 text-xs font-bold tabular-nums text-white backdrop-blur-sm">
        {clamped}%
      </div>
    </div>
  )
})

export default Hearth
