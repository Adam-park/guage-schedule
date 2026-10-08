// 하루 마무리 화면 시안 A/B/C — 오늘의 마지막 편지까지 결과(배송 완료/반송)가 정해졌을 때
// 세계관: '하루 끝의 나'가 오늘 받은 편지를 확인하는 순간. 해낸 것을 크게, 반송은 작고 담담하게.
import PixelGauge from '../../components/tome/PixelGauge.jsx'
import DayEnd, { BigEnvelope, Title, CloseButton, Screen } from '../../screens/DayEndScreen.jsx'

export { shouldShowDayEnd, markDayEndShown, resetDayEnd } from '../../screens/DayEndScreen.jsx'

// 목데이터: 오늘 3통 — 2통 도착, 1통 반송
export const MOCK_DAY = [
  { id: 1, title: '회의 자료 공유하기', due: '15:00', result: 'done' },
  { id: 2, title: '운동 30분', due: '19:00', result: 'done' },
  { id: 3, title: '책 10쪽 읽기', due: '22:00', result: 'returned' },
]

// A · 확정안 → 앱으로 옮김 (src/screens/DayEndScreen.jsx). 여기선 목데이터로 보여줌
export const DayEndA = ({ day = MOCK_DAY, ...rest }) => <DayEnd day={day} {...rest} />

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

