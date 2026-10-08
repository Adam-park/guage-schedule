// 주간 리마인드 — Storybook 확정안 (2026-10-08). 요일과 상관없이: 마지막으로 보여준 뒤 7일이 지나고 '처음 앱을 연 순간' 한 번.
// 집계 = 그 순간부터 최근 7일. 처음 쓰는 사람은 사용 시작 7일 뒤 첫 접속부터. 최근 7일 도착 1통 이상일 때만. 기록은 이 기기(localStorage)
import PixelEnvelope from '../components/tome/PixelEnvelope.jsx'
import EnvelopeSparkle from '../components/tome/EnvelopeSparkle.jsx'

const DAY_MS = 24 * 60 * 60 * 1000
const KEY_FIRST = 'tome.firstUseAt'
const KEY_WEEKLY = 'tome.weeklyShownAt'
const getNum = (k) => {
  try {
    return Number(localStorage.getItem(k) || 0)
  } catch {
    return 0
  }
}
const setNum = (k, v) => {
  try {
    localStorage.setItem(k, String(v))
  } catch {
    // 저장소를 못 쓰는 환경: 기록 없이 진행
  }
}
// 앱을 열 때 한 번 호출 → 리마인드를 보여줄지
export function checkWeeklyReminder(nowMs = Date.now()) {
  const first = getNum(KEY_FIRST)
  if (!first) {
    setNum(KEY_FIRST, nowMs)
    return false
  }
  const since = getNum(KEY_WEEKLY) || first
  return nowMs - since >= 7 * DAY_MS
}
export const markWeeklyShown = (nowMs = Date.now()) => setNum(KEY_WEEKLY, nowMs)
// 확인용: '처음 쓴 지 8일 지남' 상태로 만들기 / 기록 지우기
export const simulateWeekPassed = () => {
  try {
    localStorage.setItem(KEY_FIRST, String(Date.now() - 8 * DAY_MS))
    localStorage.removeItem(KEY_WEEKLY)
  } catch {
    // 무시
  }
}

// arrived: 최근 7일 도착 통수(1통 이상일 때만 띄움), waiting: 반송함 통수
export default function WeeklyReminder({ arrived, waiting, onOpenBin, onClose }) {
  return (
    <div className="relative mx-auto flex min-h-full max-w-[440px] flex-col items-center px-6 pt-6">
      <span className="font-pixel absolute top-1 left-1/2 flex h-11 -translate-x-1/2 items-center text-sm text-ink">이번 주의 편지</span>
      <div className="relative shrink-0" style={{ width: 288, height: 336 }}>
        <PixelEnvelope scale={3} />
        {/* 반짝임: 1배 기준 위치를 봉투와 같은 3배로 확대 */}
        <div className="pointer-events-none absolute top-0 left-0" style={{ width: 96, height: 112, transform: 'scale(3)', transformOrigin: 'top left' }}>
          <EnvelopeSparkle />
        </div>
      </div>
      {/* 글 칸 높이를 두 줄(24+8+16)로 미리 잡아, 반송함이 비어도 버튼이 같은 위치에 오게 함 */}
      <div className="font-pixel mt-2 flex h-[48px] w-full flex-col items-center gap-2 text-center">
        <span className="text-base text-ink">7일 동안 {arrived}통이 도착했어요</span>
        {waiting > 0 && <span className="text-xs text-ink-dim">반송함에 {waiting}통이 기다리고 있어요</span>}
      </div>
      <div className="font-pixel mt-6 flex w-full gap-2">
        {waiting > 0 && (
          <button type="button" onClick={onOpenBin} className="flex-1 rounded-lg border-2 border-ink bg-bg py-3.5 text-sm text-ink active:scale-[.98]">
            반송함 보기
          </button>
        )}
        <button type="button" onClick={onClose} className="flex-1 rounded-lg bg-ink py-3.5 text-sm text-white active:scale-[.98]">
          확인
        </button>
      </div>
    </div>
  )
}

