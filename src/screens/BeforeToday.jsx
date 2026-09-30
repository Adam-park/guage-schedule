// Before 대표 화면 — 기존 불꽃 모델 그대로 재사용 (App.jsx와 동일, 원본 보존)
import DayCell from '../components/DayCell.jsx'
import { todaySchedules, tomorrowSchedules } from '../data/mockSchedules.js'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function BeforeToday() {
  const today = new Date()
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

  return (
    <div className="mx-auto flex max-w-[440px] flex-col gap-4 px-4 py-10">
      <DayCell date={today.getDate()} dow={WEEKDAYS[today.getDay()]} items={todaySchedules} variant="today" />
      <DayCell date={tomorrow.getDate()} dow={WEEKDAYS[tomorrow.getDay()]} items={tomorrowSchedules} variant="tomorrow" />
    </div>
  )
}
