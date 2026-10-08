// 하루 마무리 — Storybook 확정 A안 (2026-10-08). '하루 끝의 나'가 오늘 받은 편지를 확인하는 순간.
// 해낸 것을 크게, 반송은 작고 담담하게. 모두 반송된 날은 설명만 다르게(반짝임 없음)
import PixelEnvelope from '../components/tome/PixelEnvelope.jsx'
import EnvelopeSparkle from '../components/tome/EnvelopeSparkle.jsx'
import { todayLabel } from '../lib/letters.js'

// 봉투: 다른 화면과 같은 크기·위치(288×336, 위 24px) + 반짝임(3배)
export function BigEnvelope({ sparkle }) {
  return (
    <div className="relative shrink-0" style={{ width: 288, height: 336 }}>
      <PixelEnvelope scale={3} />
      {sparkle && (
        <div className="pointer-events-none absolute top-0 left-0" style={{ width: 96, height: 112, transform: 'scale(3)', transformOrigin: 'top left' }}>
          <EnvelopeSparkle />
        </div>
      )}
    </div>
  )
}
export function Title() {
  return <span className="font-pixel absolute top-1 left-1/2 flex h-11 -translate-x-1/2 items-center text-sm text-ink">{todayLabel()}</span>
}
export function CloseButton({ onClose }) {
  return (
    <button type="button" onClick={onClose} className="font-pixel w-full rounded-lg bg-ink py-3.5 text-sm text-white active:scale-[.98]">
      확인
    </button>
  )
}
export const Screen = ({ children }) => <div className="relative mx-auto flex min-h-full max-w-[440px] flex-col items-center px-6 pt-6">{children}</div>

// 봉투 + 도착 통수 크게, 도착한 일 목록, 반송은 맨 아래 한 줄. day: [{ id, title, result: 'done' | 'returned' }]
export default function DayEnd({ day, onClose }) {
  const done = day.filter((l) => l.result === 'done')
  const returned = day.filter((l) => l.result === 'returned')
  return (
    <Screen>
      <Title />
      <BigEnvelope sparkle={done.length > 0} />
      {/* 확인 버튼 = 편지 상세 '배송 완료?' 버튼과 같은 위치: 제목 칸 높이 72px 고정(두 줄 제목 52px도 들어감), 목록은 버튼 아래 */}
      <div className="font-pixel mt-2 flex w-full flex-col items-center text-center" style={{ height: 72 }}>
        {/* 3통 모두 반송된 날: 같은 화면, 설명만 다르게 (반짝임 없음) */}
        <span className="text-base leading-relaxed text-ink">
          {done.length > 0 ? (
            `오늘 ${done.length}통이 하루 끝의 나에게 도착했어요`
          ) : (
            <>
              오늘 편지는
              <br />
              하루 끝의 나에게 닿지 못했어요.
            </>
          )}
        </span>
      </div>
      <div className="w-full">
        <CloseButton onClose={onClose} />
      </div>
      <div className="font-pixel mt-4 flex w-full flex-col items-center gap-3 text-center">
        <ul className="flex flex-col gap-1 text-sm text-ink-dim">
          {done.map((l) => (
            <li key={l.id}>{l.title}</li>
          ))}
        </ul>
        {returned.length > 0 && <span className="text-xs text-ink-faint">{returned.length}통은 반송함에 있어요</span>}
      </div>
    </Screen>
  )
}

// ---- 확정: A안 + 뜨는 시점 (2026-10-08) ----
// 오늘 가장 마지막 일정 시각 + 30분이 지난 뒤 앱을 열면 첫 화면으로 한 번(하루 1회). 기록은 이 기기(localStorage)에.
export const DAY_END_AFTER = 30
const KEY_DAYEND = 'tome.dayEndShownOn'
const dayKey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
// letters: [{ dueAt(분) }], nowMin: 지금(자정부터 분)
export function shouldShowDayEnd(letters, nowMin, today = new Date()) {
  if (!letters.length) return false
  const last = Math.max(...letters.map((l) => l.dueAt))
  if (nowMin < last + DAY_END_AFTER) return false
  try {
    return localStorage.getItem(KEY_DAYEND) !== dayKey(today)
  } catch {
    return true
  }
}
export const markDayEndShown = (today = new Date()) => {
  try {
    localStorage.setItem(KEY_DAYEND, dayKey(today))
  } catch {
    // 저장소를 못 쓰는 환경: 기록 없이 진행
  }
}
export const resetDayEnd = () => {
  try {
    localStorage.removeItem(KEY_DAYEND)
  } catch {
    // 무시
  }
}
