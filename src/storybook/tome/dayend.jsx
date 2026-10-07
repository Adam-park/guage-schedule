// 하루 마무리 화면 시안 A/B/C — 오늘의 마지막 편지까지 결과(배송 완료/반송)가 정해졌을 때
// 세계관: '하루 끝의 나'가 오늘 받은 편지를 확인하는 순간. 해낸 것을 크게, 반송은 작고 담담하게.
import PixelEnvelope from '../../components/tome/PixelEnvelope.jsx'
import PixelGauge from '../../components/tome/PixelGauge.jsx'
import EnvelopeSparkle from '../../components/tome/EnvelopeSparkle.jsx'

// 목데이터: 오늘 3통 — 2통 도착, 1통 반송
export const MOCK_DAY = [
  { id: 1, title: '회의 자료 공유하기', due: '15:00', result: 'done' },
  { id: 2, title: '운동 30분', due: '19:00', result: 'done' },
  { id: 3, title: '책 10쪽 읽기', due: '22:00', result: 'returned' },
]
const todayLabel = (d = new Date()) => `${d.getMonth() + 1}월 ${d.getDate()}일 ${'일월화수목금토'[d.getDay()]}요일`

// 봉투: 다른 화면과 같은 크기·위치(288×336, 위 24px) + 반짝임(3배)
function BigEnvelope({ sparkle }) {
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
function Title() {
  return <span className="font-pixel absolute top-1 left-1/2 flex h-11 -translate-x-1/2 items-center text-sm text-ink">{todayLabel()}</span>
}
function CloseButton({ onClose }) {
  return (
    <button type="button" onClick={onClose} className="font-pixel w-full rounded-lg bg-ink py-3.5 text-sm text-white active:scale-[.98]">
      확인
    </button>
  )
}
const Screen = ({ children }) => <div className="relative mx-auto flex min-h-full max-w-[440px] flex-col items-center px-6 pt-6">{children}</div>

// A · 하루 끝의 나에게: 봉투 + 도착 통수 크게, 도착한 일 목록, 반송은 맨 아래 한 줄
export function DayEndA({ day = MOCK_DAY, onClose }) {
  const done = day.filter((l) => l.result === 'done')
  const returned = day.filter((l) => l.result === 'returned')
  return (
    <Screen>
      <Title />
      <BigEnvelope sparkle={done.length > 0} />
      <div className="font-pixel mt-2 flex w-full flex-col items-center gap-3 text-center">
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
        <ul className="flex flex-col gap-1 text-sm text-ink-dim">
          {done.map((l) => (
            <li key={l.id}>{l.title}</li>
          ))}
        </ul>
        {returned.length > 0 && <span className="text-xs text-ink-faint">{returned.length}통은 반송함에 있어요</span>}
      </div>
      <div className="mt-6 w-full">
        <CloseButton onClose={onClose} />
      </div>
    </Screen>
  )
}

// B · 오늘의 게이지: 3칸 게이지(도착 = 연초록, 반송 = 반송색)로 하루를 한 줄에. 아래에 칸별 할 일
export function DayEndB({ day = MOCK_DAY, onClose }) {
  const done = day.filter((l) => l.result === 'done')
  return (
    <Screen>
      <Title />
      <BigEnvelope sparkle={done.length > 0} />
      <div className="font-pixel mt-2 flex w-full flex-col items-center gap-3 text-center">
        <span className="text-base text-ink">
          오늘의 편지 {done.length}/{day.length}통 도착
        </span>
        <PixelGauge cells={day.map((l) => (l.result === 'done' ? 'bg-green-300' : 'bg-state-returned'))} height={28} />
        <div className="grid w-full text-xs" style={{ gridTemplateColumns: `repeat(${day.length}, 1fr)` }}>
          {day.map((l) => (
            <span key={l.id} className={`truncate px-1 ${l.result === 'done' ? 'text-ink' : 'text-ink-faint'}`}>
              {l.title}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6 w-full">
        <CloseButton onClose={onClose} />
      </div>
    </Screen>
  )
}

// C · 받은 편지 한 장: 열린 봉투(속지) — 하루 끝의 나가 오늘 받은 편지를 펼쳐 봄. 속지 아래에 받은 일만
export function DayEndC({ day = MOCK_DAY, onClose }) {
  const done = day.filter((l) => l.result === 'done')
  const returned = day.filter((l) => l.result === 'returned')
  return (
    <Screen>
      <Title />
      <div className="relative shrink-0" style={{ width: 288, height: 336 }}>
        <img src="/assets/pixelart/envelope-open.png" alt="" width={288} height={336} style={{ imageRendering: 'pixelated' }} />
      </div>
      <div className="font-pixel mt-2 flex w-full flex-col gap-2 text-left">
        <span className="text-xs text-ink-dim">To. 하루 끝의 나</span>
        {done.map((l) => (
          <span key={l.id} className="text-sm text-ink">
            {l.due} · {l.title}
          </span>
        ))}
        <span className="mt-1 text-xs text-ink-dim">From. 오늘의 나 · {done.length}통 도착{returned.length > 0 ? ` · 반송 ${returned.length}통` : ''}</span>
      </div>
      <div className="mt-6 w-full">
        <CloseButton onClose={onClose} />
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
