// 편지 작성 화면 시안 — 확정 그림: envelope-closed.png(닫힘) → envelope-open.png(열림·속지·글씨, PixelLab 2026-10-07)
// 공통: 열림 연출 + '쓰는 만큼 써지는' 글씨 효과(components/tome/LetterEnvelope). 시안 A/B/C는 '할 일·시간 입력' 모양만 다름.
// 확정안(A + 편지 번호 + 보내기 연출)은 앱으로 옮김 → src/screens/LetterWriteScreen.jsx (2026-10-08)
import { useState } from 'react'
import Letter, { useOpen, revealFor } from '../../components/tome/LetterEnvelope.jsx'

export { default as LetterFinal } from '../../screens/LetterWriteScreen.jsx'

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

