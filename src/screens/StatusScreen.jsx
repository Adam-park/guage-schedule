// 배송 상태 목록 — Storybook 확정안 (2026-10-08). 맨 위 오늘 날짜 + 배송 중인 편지 3줄 + 왼쪽 아래 반송함.
// 각 줄 = 작은 봉투 + 할 일 + 도착 시각 + 게이지(보낸 시각 → 도착 시각 진행률) + 남은 시간. 마감 전후 앱 안 알림은 맨 위.
import { useEffect, useState } from 'react'
import PixelGauge from '../components/tome/PixelGauge.jsx'
import EnvelopeArt from '../components/tome/EnvelopeArt.jsx'
import MailboxButton from '../components/tome/MailboxButton.jsx'
import { hhmm, todayLabel, letterState, stateCells, stateText, noticesFor, nowMin, loadLetters, todayLetters, returnedLetters, markDone, DAILY_LIMIT } from '../lib/letters.js'

export function Header({ count }) {
  return (
    <div className="font-pixel flex flex-col gap-1">
      <span className="text-xs text-ink-dim">{todayLabel()}</span>
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-ink">배송 중인 편지</span>
        {/* 보낸 통수만 (하루 몫 "/2"는 미리 안 보여줌 — 1통 보낸 뒤 '하나 더'로 알게 함, 2026-11-02) */}
        <span className="text-xs text-ink-dim tabular-nums">{count}통</span>
      </div>
    </div>
  )
}

export const Frame = ({ children }) => <div className="mx-auto flex min-h-full max-w-[440px] flex-col gap-6 px-6 pt-10 pb-8">{children}</div>

// 앱 안 알림 (나중에 푸시 알림으로 같은 문구 사용 예정)
export function Notice({ children }) {
  return <div className="font-pixel w-full rounded-md border-2 border-ink bg-surface-sunken px-3 py-2.5 text-xs leading-relaxed text-ink">{children}</div>
}

// 목록만 (Storybook 흐름에서도 사용). 보낸 편지가 없으면 가운데에 안내 + '편지 쓰기' (나가기를 잘못 눌러 온 사람도 길을 잃지 않게)
// 하루 몫보다 적게 보냈으면 목록 아래에 '하나 더 보내기' (다 채우면 사라짐). 아직 0통이면 가운데 '편지 쓰기'. onWrite가 없으면(Storybook 시안) 버튼 없음
// onDone(i): 마감 시간이 된 편지 줄에 '배송 완료?' 버튼 (2026-11-02 편지 상세 화면 대신). onSelect: 예전 시안용(줄을 눌러 상세)
export function StatusList({ letters, now, doneIds, onSelect, onDone, onWrite, stateLabels }) {
  const notices = noticesFor(letters, now, doneIds)
  return (
    <Frame>
      {notices.map((t) => (
        <Notice key={t}>{t}</Notice>
      ))}
      <Header count={letters.length} />
      {letters.length === 0 && onWrite && (
        <div className="font-pixel flex flex-1 flex-col items-center justify-center gap-4 pb-24 text-center">
          <span className="text-sm text-ink-dim">아직 보낸 편지가 없어요</span>
          <button type="button" onClick={onWrite} className="w-full rounded-lg bg-ink py-3.5 text-sm text-white active:scale-[.98]">
            편지 쓰기
          </button>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {letters.map((l, i) => {
          const st = letterState(l, now, doneIds.includes(l.id))
          const tone = st === 'returned' ? 'text-state-returned' : st === 'done' ? 'text-state-delivered' : 'text-ink-faint'
          const Row = onSelect ? 'button' : 'div'
          return (
            <Row key={l.id} {...(onSelect ? { type: 'button', onClick: () => onSelect(i) } : {})} className={`-mx-2 flex items-center gap-4 rounded-md px-2 py-2 text-left ${onSelect ? 'active:scale-[.98] active:bg-surface-sunken' : ''}`}>
              {/* 봉투 왼쪽 위 편지 번호 — 알림 "N번 편지가…"의 N이 어느 편지인지 보이게 */}
              <div className="relative shrink-0">
                <EnvelopeArt />
                {/* 숫자만, 봉투 아이콘 왼쪽 위 바깥 (동그라미·테두리 없음) */}
                <span className="font-pixel absolute text-xs leading-none text-ink tabular-nums" style={{ right: '100%', bottom: '100%', marginRight: 1, marginBottom: 1 }}>
                  {i + 1}
                </span>
              </div>
              <div className="font-pixel flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm text-ink">{l.title}</span>
                  <span className="shrink-0 text-xs text-ink-dim tabular-nums">{hhmm(l.dueAt)}</span>
                </div>
                <PixelGauge cells={stateCells(l, now, st)} height={16} />
                {st === 'arrived' && onDone ? (
                  <button type="button" onClick={() => onDone(i)} className="self-start rounded-md bg-ink px-3 py-1.5 text-xs text-white active:scale-[.97]">
                    배송 완료?
                  </button>
                ) : (
                  <span className={`text-xs ${tone}`}>{stateText(l, now, st, stateLabels)}</span>
                )}
              </div>
            </Row>
          )
        })}
      </div>
      {letters.length > 0 && letters.length < DAILY_LIMIT && onWrite && (
        <button type="button" onClick={onWrite} className="font-pixel w-full rounded-lg bg-ink py-3.5 text-sm text-white active:scale-[.98]">
          하나 더 보내기
        </button>
      )}
    </Frame>
  )
}

// 목록 + 반송함 아이콘. 편지는 이 기기 저장소에서 읽고, 1분마다 다시 계산
export default function StatusScreen({ onOpenBin, onWrite }) {
  const [date, setDate] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setDate(new Date()), 60 * 1000)
    return () => clearInterval(t)
  }, [])
  const all = loadLetters()
  const letters = todayLetters(all, date)
  const doneIds = letters.filter((l) => l.done).map((l) => l.id)
  return (
    <div className="relative h-full">
      <StatusList
        letters={letters}
        now={nowMin(date)}
        doneIds={doneIds}
        onWrite={onWrite}
        onDone={(i) => {
          markDone(letters[i].id)
          setDate(new Date())
        }}
      />
      <MailboxButton count={returnedLetters(all, date).length} onClick={onOpenBin} />
    </div>
  )
}
