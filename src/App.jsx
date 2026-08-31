import { useEffect, useMemo, useState } from 'react'
import { mockSchedules } from './data/mockSchedules'
import { dayBattery, dayKey } from './lib/battery'
import { STAGE_COLORS } from './theme/colors'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
const WEEKS_SHOWN = 6 // 달력 그리드에 표시할 주 수
const MAX_LABELS = 2 // 한 칸에 보여줄 일정 제목 최대 개수 (나머지는 +N)
const TICK_MS = 60 * 1000 // 배터리 갱신 주기

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

// 그 달을 담는 그리드(WEEKS_SHOWN주 x 7일). 일요일 시작.
function buildGrid(monthStart) {
  const first = new Date(monthStart)
  first.setDate(1 - first.getDay())
  return Array.from({ length: WEEKS_SHOWN * 7 }, (_, i) => {
    const d = new Date(first)
    d.setDate(first.getDate() + i)
    return d
  })
}

function DayCell({ date, inMonth, isToday, schedules, now }) {
  const bat = dayBattery(schedules, now)
  const c = bat ? STAGE_COLORS[bat.stage] : null
  const level = bat ? bat.level : 0
  const showFill = bat && bat.stage !== 'frozen' // 배터리 색을 칠하는 날인지

  return (
    <div
      className={`relative flex min-h-[84px] flex-col overflow-hidden border-b border-r border-black/5 p-1.5 dark:border-white/10 ${
        inMonth ? '' : 'opacity-35'
      }`}
      style={{ background: c ? c.track : 'transparent' }}
    >
      {/* 배터리: 아래 고정, 남은 비율만큼 채워짐. 시간 지날수록 색이 아래로 내려감 */}
      {showFill && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 transition-[height] duration-700"
          style={{ height: `${level * 100}%`, background: c.fill, opacity: 0.9 }}
        />
      )}

      <div className="relative flex items-center justify-between">
        <span
          className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-sm font-semibold ${
            isToday
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'text-gray-700 dark:text-gray-200'
          }`}
          style={
            !isToday && showFill
              ? { background: 'rgba(255,255,255,0.85)', color: '#1f2937' }
              : undefined
          }
        >
          {date.getDate()}
        </span>
      </div>

      <div className="relative mt-1 flex flex-col gap-0.5">
        {schedules.slice(0, MAX_LABELS).map((s) => (
          <span
            key={s.id}
            className="truncate rounded bg-white/85 px-1 text-[11px] leading-4 text-gray-800"
            style={{ textDecoration: s.done ? 'line-through' : 'none' }}
          >
            {s.title}
          </span>
        ))}
        {schedules.length > MAX_LABELS && (
          <span className="px-1 text-[11px] leading-4 text-gray-600">
            +{schedules.length - MAX_LABELS}
          </span>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [now, setNow] = useState(() => new Date())
  const [month, setMonth] = useState(() => startOfMonth(new Date()))

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), TICK_MS)
    return () => clearInterval(id)
  }, [])

  const byDay = useMemo(() => {
    const map = {}
    for (const s of mockSchedules) {
      const k = dayKey(s.deadline)
      ;(map[k] ||= []).push(s)
    }
    return map
  }, [])

  const grid = useMemo(() => buildGrid(month), [month])
  const todayKey = dayKey(now)

  const shiftMonth = (delta) =>
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1))

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Day Battery
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="rounded px-2 py-1 text-gray-500 hover:bg-black/5 dark:hover:bg-white/10"
          >
            ‹
          </button>
          <span className="min-w-[7rem] text-center text-base font-semibold text-gray-800 dark:text-gray-100">
            {month.getFullYear()}년 {month.getMonth() + 1}월
          </span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="rounded px-2 py-1 text-gray-500 hover:bg-black/5 dark:hover:bg-white/10"
          >
            ›
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 border-l border-t border-black/5 dark:border-white/10">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="border-b border-r border-black/5 py-1.5 text-center text-xs font-medium text-gray-400 dark:border-white/10"
          >
            {w}
          </div>
        ))}
        {grid.map((date) => {
          const k = dayKey(date)
          return (
            <DayCell
              key={k}
              date={date}
              inMonth={date.getMonth() === month.getMonth()}
              isToday={k === todayKey}
              schedules={byDay[k] || []}
              now={now}
            />
          )
        })}
      </div>

      <p className="mt-3 text-xs text-gray-400">
        날짜 칸 색 = 그날 제일 급한 일정의 배터리. 데드라인 7일 전부터 색이
        아래로 빠지며 빨개짐.
      </p>
    </div>
  )
}
