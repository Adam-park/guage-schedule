// 편지 작성 화면 — Storybook 확정안 A (2026-10-07). 할 일·할 시간 입력 → 보내기, 하루 3통까지.
// 보내기: ① 열린 봉투 → 닫힌 봉투(빨간 씰)로 다시 접힘 ② 봉투 왼쪽 뒤 꼬리선 ③ 다음 편지가 빈 속지로 다시 열림 (번호 +1)
// 3통 다 보내면 닫힌 봉투 + 안내 문구. onSend({ title, time }): 보낸 편지 1통 / onExit: 왼쪽 위 '나가기'
// sentDues: 오늘 이미 보낸 편지들의 도착 시각(분) — 다시 들어와도 하루 3통을 넘지 않게 + 완료 안내의 '첫 편지' 시각
import { useEffect, useState } from 'react'
import LetterEnvelope, { revealFor } from '../components/tome/LetterEnvelope.jsx'
import TimeField from '../components/tome/TimeField.jsx'
import { hhmm, toMin, nowMin } from '../lib/letters.js'

const MAX_LETTERS = 3
const WIND_CSS = `
@keyframes tome-wind-ltr { from { transform: translateX(-140px) } to { transform: translateX(520px) } }
@keyframes tome-wind-rtl { from { transform: translateX(520px) } to { transform: translateX(-140px) } }
@keyframes tome-trail { 0% { transform: scaleX(0); opacity: 1 } 60% { transform: scaleX(1); opacity: 1 } 100% { transform: scaleX(1); opacity: 0 } }
@media (prefers-reduced-motion: reduce) { .tome-wind { animation: none !important; display: none } }
`
// 바람 줄기: 봉투 높이 범위 안의 가로 픽셀 막대들 (위치·길이·지연을 조금씩 다르게)
const WIND = [
  { top: 120, w: 64, delay: 0 },
  { top: 150, w: 40, delay: 120 },
  { top: 175, w: 88, delay: 60 },
  { top: 205, w: 48, delay: 220 },
  { top: 230, w: 72, delay: 160 },
]
// mode: 'trail' 봉투 왼쪽 뒤 꼬리선(확정, 봉투 왼쪽 끝 = 화면 가운데 - 99px) / 'ltr'·'rtl' 이전 시안 (Storybook 비교용)
function Wind({ mode }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden" style={{ height: 336 }}>
      <style>{WIND_CSS}</style>
      {WIND.map((l, i) =>
        mode === 'trail' ? (
          <div
            key={i}
            className="tome-wind absolute bg-border"
            style={{ top: l.top, right: 'calc(50% + 107px)', width: l.w + 24, height: 6, transformOrigin: 'right', animation: `tome-trail 500ms steps(6) ${l.delay}ms 2 both` }}
          />
        ) : (
          <div
            key={i}
            className="tome-wind absolute left-0 bg-border"
            style={{ top: l.top, width: l.w, height: 6, animation: `tome-wind-${mode} 700ms steps(10) ${l.delay}ms 2 both` }}
          />
        ),
      )}
    </div>
  )
}

export default function LetterWriteScreen({ wind = 'trail', sentDues = [], onSend, onExit }) {
  const [dues, setDues] = useState(sentDues) // 보낸 편지들의 도착 시각
  const count = dues.length
  const [phase, setPhase] = useState(sentDues.length >= MAX_LETTERS ? 'done' : 'closed') // closed → open → folding → flying → (다음) open / done
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const ready = title.trim() && time

  useEffect(() => {
    const next = { closed: ['open', 500], folding: ['flying', 350], flying: ['sent', 1500] }[phase]
    if (!next) return
    const t = setTimeout(() => setPhase(next[0]), next[1])
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'sent') return
    const n = count + 1
    onSend?.({ title: title.trim(), time })
    setDues([...dues, toMin(time)])
    setTitle('')
    setTime('')
    setPhase(n >= MAX_LETTERS ? 'done' : 'closed')
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const open = phase === 'open'
  const busy = phase !== 'open'
  const send = () => ready && open && setPhase('folding')
  // 완료 안내: 아직 도착 전인 편지 중 가장 먼저 도착하는 시각 (없으면 안내 한 줄만)
  const upcoming = dues.filter((d) => d > nowMin())
  const firstDue = upcoming.length ? Math.min(...upcoming) : null

  return (
    <div className="relative mx-auto flex min-h-full max-w-[440px] flex-col items-center px-6 pt-6">
      {/* 나가기: 왼쪽 위 모서리, 터치 영역 44px 이상 (design.md 1.5) */}
      <button type="button" onClick={onExit} className="font-pixel absolute top-1 left-1 z-10 flex h-11 items-center gap-1 px-3 text-xs text-ink-dim active:scale-[.97]">
        <span aria-hidden>←</span> 나가기
      </button>
      {phase === 'flying' && <Wind mode={wind} />}
      <LetterEnvelope open={open} reveal={revealFor(title, time)} />
      {phase === 'done' ? (
        <p className="font-pixel mt-2 text-center text-sm leading-relaxed text-ink">
          오늘 편지 3통을 모두 보냈어요.
          {firstDue !== null && (
            <>
              <br />
              <span className="text-ink-dim">첫 편지는 {hhmm(firstDue)}에 도착해요.</span>
            </>
          )}
        </p>
      ) : (
        <div className="font-pixel mt-2 flex w-full flex-col gap-3">
          <label className="flex flex-col gap-1 text-xs text-ink-dim">
            <span className="flex justify-between">
              오늘 할 일<span className="tabular-nums text-ink">{Math.min(count + 1, MAX_LETTERS)}/{MAX_LETTERS}</span>
            </span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} disabled={busy} placeholder="예) 기획서 초안 끝내기" className="rounded-md border-2 border-ink bg-bg px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint" />
          </label>
          {/* label이 아닌 div: 안에 버튼이 있어 '할 시간' 글자를 누르면 오전/오후가 바뀌는 것 방지 */}
          <div className="flex flex-col gap-1 text-xs text-ink-dim">
            할 시간
            <TimeField key={count} onChange={setTime} disabled={busy} />
          </div>
          <button
            type="button"
            onClick={send}
            disabled={!ready || busy}
            className="font-pixel w-full rounded-lg bg-ink py-3.5 text-sm text-white transition-transform active:scale-[.98]"
          >
            보내기
          </button>
        </div>
      )}
    </div>
  )
}
