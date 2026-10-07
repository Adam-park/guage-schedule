// 편지 작성 화면 시안 — 확정 그림: envelope-closed.png(닫힘) → envelope-open.png(열림·속지·글씨, PixelLab 2026-10-07)
// 공통: 열림 연출 + '쓰는 만큼 써지는' 글씨 효과(속지 색 덮개를 걷어냄). 시안 A/B/C는 '할 일·시간 입력' 모양만 다름.
import { useEffect, useState } from 'react'
import PixelEnvelope from '../../components/tome/PixelEnvelope.jsx'

const SCALE = 3 // 96×112 → 288×336 (정수배)
// envelope-open.png 속지 글씨 줄 5개 (원본 좌표 실측)
const LINES = [
  { y0: 30, y1: 32 },
  { y0: 35, y1: 37 },
  { y0: 39, y1: 42 },
  { y0: 44, y1: 47 },
  { y0: 49, y1: 51 },
].map((l) => ({ ...l, x0: 28, x1: 67 }))
const PAPER = '#f7f7ee' // 속지 색 (실측 단일색)

function useOpen(delay = 500) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return open
}

// 할 일 4글자 = 글씨 한 줄 (1~4줄), 시간 입력 = 마지막 줄
function revealFor(title, time) {
  const n = [...title].length
  return LINES.map((_, i) => (i === LINES.length - 1 ? (time ? 1 : 0) : Math.max(0, Math.min(1, (n - i * 4) / 4))))
}

function Letter({ open, reveal, sending }) {
  const fade = (on) => ({ width: '100%', height: '100%', imageRendering: 'pixelated', opacity: on ? 1 : 0, transition: 'opacity 240ms steps(3)' })
  return (
    <div
      className={`relative shrink-0 transition-all duration-700 ease-in ${sending ? '-translate-y-32 translate-x-12 rotate-12 scale-50 opacity-0' : ''}`}
      style={{ width: 96 * SCALE, height: 112 * SCALE }}
    >
      <div className="absolute inset-0" style={fade(!open)}>
        <PixelEnvelope scale={SCALE} />
      </div>
      <img src="/assets/pixelart/envelope-open.png" alt="" className="absolute inset-0" style={fade(open)} />
      {open &&
        LINES.map((l, i) => {
          const f = reveal[i] ?? 0
          const x = (l.x0 - 1 + (l.x1 - l.x0 + 3) * f) * SCALE
          const w = (l.x1 + 2) * SCALE - x
          return w > 0 ? (
            <div
              key={i}
              className="absolute"
              style={{ left: x, top: l.y0 * SCALE, width: w, height: (l.y1 - l.y0 + 1) * SCALE, background: PAPER, transition: 'left 180ms steps(4), width 180ms steps(4)' }}
            />
          ) : null
        })}
    </div>
  )
}

function useForm() {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [sending, setSending] = useState(false)
  const ready = title.trim() && time
  const send = () => {
    if (!ready || sending) return
    setSending(true)
    setTimeout(() => {
      setTitle('')
      setTime('')
      setSending(false)
    }, 700)
  }
  return { title, setTitle, time, setTime, sending, send, ready }
}

function SendButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="font-pixel w-full rounded-lg bg-ink py-3.5 text-sm text-white transition-transform active:scale-[.98]"
    >
      보내기
    </button>
  )
}

const Frame = ({ children }) => <div className="mx-auto flex min-h-full max-w-[440px] flex-col items-center px-6 pt-6">{children}</div>

// A · 칸 두 개: 이름표가 붙은 픽셀 입력칸 (오늘 할 일 / 할 시간)
export function LetterA() {
  const open = useOpen()
  const f = useForm()
  return (
    <Frame>
      <Letter open={open} reveal={revealFor(f.title, f.time)} sending={f.sending} />
      <div className="font-pixel mt-2 flex w-full flex-col gap-3">
        <label className="flex flex-col gap-1 text-xs text-ink-dim">
          오늘 할 일
          <input value={f.title} onChange={(e) => f.setTitle(e.target.value)} disabled={f.sending} placeholder="예) 기획서 초안 끝내기" className="rounded-md border-2 border-ink bg-bg px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint" />
        </label>
        <label className="flex flex-col gap-1 text-xs text-ink-dim">
          할 시간
          <input type="time" value={f.time} onChange={(e) => f.setTime(e.target.value)} disabled={f.sending} className="rounded-md border-2 border-ink bg-bg px-3 py-2.5 text-sm text-ink outline-none" />
        </label>
        <SendButton onClick={f.send} disabled={!f.ready || f.sending} />
      </div>
    </Frame>
  )
}

// B · 편지 문장: "To. [시간]의 나에게 / [할 일]" — 입력칸이 편지 문장 속 빈칸
export function LetterB() {
  const open = useOpen()
  const f = useForm()
  return (
    <Frame>
      <Letter open={open} reveal={revealFor(f.title, f.time)} sending={f.sending} />
      <div className="font-pixel mt-2 flex w-full flex-col gap-4 text-sm text-ink">
        <div className="flex items-center gap-1.5">
          <span>To.</span>
          <input type="time" value={f.time} onChange={(e) => f.setTime(e.target.value)} disabled={f.sending} className="w-[120px] border-0 border-b-2 border-dashed border-ink bg-transparent px-1 py-1 text-sm text-ink outline-none" />
          <span>의 나에게</span>
        </div>
        <input value={f.title} onChange={(e) => f.setTitle(e.target.value)} disabled={f.sending} placeholder="오늘 해낼 일을 적어 주세요" className="w-full border-0 border-b-2 border-dashed border-ink bg-transparent px-1 py-1.5 text-sm text-ink outline-none placeholder:text-ink-faint" />
        <SendButton onClick={f.send} disabled={!f.ready || f.sending} />
      </div>
    </Frame>
  )
}

// C · 시간 빠르게 고르기: 할 일 입력 + 시간은 버튼으로 (30분 뒤 / 1시간 뒤 / 3시간 뒤 / 직접)
const QUICK = [
  ['30분 뒤', 30],
  ['1시간 뒤', 60],
  ['3시간 뒤', 180],
]
const later = (min) => {
  const d = new Date(Date.now() + min * 60000)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
export function LetterC() {
  const open = useOpen()
  const f = useForm()
  const [pick, setPick] = useState(null)
  const choose = (label, min) => {
    setPick(label)
    f.setTime(later(min))
  }
  return (
    <Frame>
      <Letter open={open} reveal={revealFor(f.title, f.time)} sending={f.sending} />
      <div className="font-pixel mt-2 flex w-full flex-col gap-3">
        <input value={f.title} onChange={(e) => f.setTitle(e.target.value)} disabled={f.sending} placeholder="오늘 해낼 일" className="rounded-md border-2 border-ink bg-bg px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint" />
        <div className="grid grid-cols-4 gap-1.5">
          {QUICK.map(([label, min]) => (
            <button key={label} type="button" onClick={() => choose(label, min)} className={`rounded-md border-2 border-ink py-2 text-xs ${pick === label ? 'bg-ink text-white' : 'bg-bg text-ink'}`}>
              {label}
            </button>
          ))}
          <label className={`relative flex items-center justify-center rounded-md border-2 border-ink py-2 text-xs ${pick === 'custom' ? 'bg-ink text-white' : 'bg-bg text-ink'}`}>
            {pick === 'custom' && f.time ? f.time : '직접'}
            <input type="time" value={pick === 'custom' ? f.time : ''} onChange={(e) => { setPick('custom'); f.setTime(e.target.value) }} className="absolute inset-0 opacity-0" />
          </label>
        </div>
        {f.time && <div className="text-center text-xs text-ink-dim">{f.time}의 나에게 보내요</div>}
        <SendButton onClick={f.send} disabled={!f.ready || f.sending} />
      </div>
    </Frame>
  )
}

// ---- 확정안 A + 편지 번호 + 보내기 연출 ----
// 보내기: ① 열린 봉투 → 닫힌 봉투(빨간 씰)로 다시 접힘 ② 봉투는 가운데 그대로, 바람 줄기만 왼→오로 지나감
// ③ 다음 편지가 빈 속지로 다시 열림 (번호 +1). 3통 다 보내면 닫힌 봉투 + 안내 문구.
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
// mode: 'ltr' 왼→오로 흐름 / 'rtl' 오→왼으로 흐름 / 'trail' 봉투 왼쪽 뒤 꼬리선 (봉투 왼쪽 끝 = 화면 가운데 - 99px)
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

// wind: 보내기 효과 — 확정 'trail'(봉투 왼쪽 뒤 꼬리선, 2026-10-07). onExit: 왼쪽 위 '나가기' (1~2통만 쓰고 그만둘 때)
export function LetterFinal({ wind = 'trail', onExit }) {
  const [count, setCount] = useState(0) // 보낸 편지 수
  const [phase, setPhase] = useState('closed') // closed → open → folding → flying → (다음) open / done
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
    setCount(n)
    setTitle('')
    setTime('')
    setPhase(n >= MAX_LETTERS ? 'done' : 'closed')
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const open = phase === 'open'
  const busy = phase !== 'open'
  const send = () => ready && open && setPhase('folding')

  return (
    <div className="relative mx-auto flex min-h-full max-w-[440px] flex-col items-center px-6 pt-6">
      {/* 나가기: 왼쪽 위 모서리, 터치 영역 44px 이상 (design.md 1.5) */}
      <button type="button" onClick={onExit} className="font-pixel absolute top-1 left-1 z-10 flex h-11 items-center gap-1 px-3 text-xs text-ink-dim active:scale-[.97]">
        <span aria-hidden>←</span> 나가기
      </button>
      {phase === 'flying' && <Wind mode={wind} />}
      <Letter open={open} reveal={revealFor(title, time)} />
      {phase === 'done' ? (
        <p className="font-pixel mt-2 text-center text-sm leading-relaxed text-ink">
          오늘 편지 3통을 모두 보냈어요.
          <br />
          <span className="text-ink-dim">이제 그 시간의 나를 만나러 가요.</span>
        </p>
      ) : (
        <div className="font-pixel mt-2 flex w-full flex-col gap-3">
          <label className="flex flex-col gap-1 text-xs text-ink-dim">
            <span className="flex justify-between">
              오늘 할 일<span className="tabular-nums text-ink">{Math.min(count + 1, MAX_LETTERS)}/{MAX_LETTERS}</span>
            </span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} disabled={busy} placeholder="예) 기획서 초안 끝내기" className="rounded-md border-2 border-ink bg-bg px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-ink-dim">
            할 시간
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} disabled={busy} className="rounded-md border-2 border-ink bg-bg px-3 py-2.5 text-sm text-ink outline-none" />
          </label>
          <SendButton onClick={send} disabled={!ready || busy} />
        </div>
      )}
    </div>
  )
}
