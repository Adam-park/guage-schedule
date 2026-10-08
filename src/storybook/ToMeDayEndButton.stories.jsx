// 하루 마무리 '확인' 버튼 위치 시안 (2026-10-09) — 편지 상세 버튼 위치(위에서 464px)에 맞추는 방법. 앱 반영 전
// 문제: 하루 마무리는 글(제목 + 도착한 일 목록 + 반송 안내)이 392~502px라, 버튼만 464px로 올리면 목록을 덮음
import DayEnd, { BigEnvelope, Title, CloseButton, Screen } from '../screens/DayEndScreen.jsx'
import { MOCK_DAY } from './tome/dayend.jsx'

function Phone({ label, sub, children }) {
  return (
    <div style={{ width: 375 }}>
      <div className="text-sm font-semibold text-ink">{label}</div>
      <div className="mb-2 text-xs text-ink-dim">{sub}</div>
      <div className="overflow-hidden rounded-lg bg-bg" style={{ width: 375, height: 667, outline: '1px solid var(--color-border)' }}>
        {children}
      </div>
    </div>
  )
}

const ALL_RETURNED = MOCK_DAY.map((l) => ({ ...l, result: 'returned' }))
function Headline({ done }) {
  return (
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
  )
}

// A · 버튼을 제목 바로 아래(464px)로, 도착한 일 목록·반송 안내는 버튼 아래로
function DayEndA({ day }) {
  const done = day.filter((l) => l.result === 'done')
  const returned = day.filter((l) => l.result === 'returned')
  return (
    <Screen>
      <Title />
      <BigEnvelope sparkle={done.length > 0} />
      {/* 제목 칸 높이 = 464 - 392 = 72px (두 줄 제목 52px도 들어감) */}
      <div className="font-pixel mt-2 flex w-full flex-col items-center text-center" style={{ height: 72 }}>
        <Headline done={done} />
      </div>
      <div className="w-full">
        <CloseButton />
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

// B · 버튼 464px, 도착한 일 목록은 빼고 통수 + 반송 안내만
function DayEndB({ day }) {
  const done = day.filter((l) => l.result === 'done')
  const returned = day.filter((l) => l.result === 'returned')
  return (
    <Screen>
      <Title />
      <BigEnvelope sparkle={done.length > 0} />
      <div className="font-pixel mt-2 flex w-full flex-col items-center gap-3 text-center" style={{ height: 72 }}>
        <Headline done={done} />
        {done.length > 0 && returned.length > 0 && <span className="text-xs text-ink-faint">{returned.length}통은 반송함에 있어요</span>}
      </div>
      <div className="w-full">
        <CloseButton />
      </div>
    </Screen>
  )
}

export default { title: '2 작업 기록/9 하루 마무리 버튼 위치 시안' }

export const Compare = {
  name: '시안 비교',
  render: () => (
    <div className="flex flex-col gap-10 p-6">
      <div className="flex flex-wrap gap-8">
        <Phone label="지금" sub="버튼이 편지 상세보다 62px 아래">
          <DayEnd day={MOCK_DAY} />
        </Phone>
        <Phone label="A · 버튼을 위로, 목록은 버튼 아래" sub="버튼 = 편지 상세와 같은 위치">
          <DayEndA day={MOCK_DAY} />
        </Phone>
        <Phone label="B · 버튼을 위로, 목록 빼기" sub="버튼 = 편지 상세와 같은 위치, 통수 + 반송 안내만">
          <DayEndB day={MOCK_DAY} />
        </Phone>
      </div>
      <div className="flex flex-wrap gap-8">
        <Phone label="지금 · 모두 반송된 날" sub="">
          <DayEnd day={ALL_RETURNED} />
        </Phone>
        <Phone label="A · 모두 반송된 날" sub="">
          <DayEndA day={ALL_RETURNED} />
        </Phone>
        <Phone label="B · 모두 반송된 날" sub="">
          <DayEndB day={ALL_RETURNED} />
        </Phone>
      </div>
    </div>
  ),
}
