// 할 시간 입력 — [오전 ▲▼] [시] : [분]. 오전/오후는 글자나 화살표를 누르면 바뀜 (처음 쓰는 사람도 보이는 대로)
// 브라우저 기본 시간 칸은 오전/오후를 숫자 키로 고르는 방식이라 직접 만듦. onChange('HH:MM' 24시간, 시 없으면 '')
// 처음 값 = 지금 시각의 오전/오후. 다시 빈칸으로 시작하려면 바깥에서 key를 바꿔 새로 그림
import { useState } from 'react'

const pad = (n) => String(n).padStart(2, '0')
const digits = (v, max) => {
  const d = v.replace(/\D/g, '').slice(-2)
  return d && Number(d) > max ? d.slice(-1) : d
}

export default function TimeField({ onChange, disabled }) {
  const [pm, setPm] = useState(() => new Date().getHours() >= 12)
  const [h, setH] = useState('')
  const [m, setM] = useState('')

  const emit = (nextPm, nextH, nextM) => {
    const hour = Number(nextH)
    if (!nextH || hour < 1) return onChange('')
    onChange(`${pad((hour % 12) + (nextPm ? 12 : 0))}:${pad(Number(nextM || 0))}`)
  }
  const toggle = () => {
    if (disabled) return
    setPm(!pm)
    emit(!pm, h, m)
  }
  const num = 'w-8 bg-transparent text-center text-sm text-ink outline-none placeholder:text-ink-faint tabular-nums'

  return (
    <div className="flex items-center gap-3 rounded-md border-2 border-ink bg-bg px-3 py-1">
      <div className="flex items-center gap-1.5">
        <button type="button" onClick={toggle} disabled={disabled} className="text-sm text-ink">
          {pm ? '오후' : '오전'}
        </button>
        <div className="flex flex-col">
          <button type="button" onClick={toggle} disabled={disabled} aria-label="오전/오후 바꾸기" className="flex h-[18px] w-7 items-center justify-center text-[10px] text-ink-dim active:text-ink">
            ▲
          </button>
          <button type="button" onClick={toggle} disabled={disabled} aria-label="오전/오후 바꾸기" className="flex h-[18px] w-7 items-center justify-center text-[10px] text-ink-dim active:text-ink">
            ▼
          </button>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <input
          value={h}
          onChange={(e) => {
            const v = digits(e.target.value, 12)
            setH(v)
            emit(pm, v, m)
          }}
          disabled={disabled}
          inputMode="numeric"
          placeholder="시"
          aria-label="시"
          className={num}
        />
        <span className="text-sm text-ink">:</span>
        <input
          value={m}
          onChange={(e) => {
            const v = digits(e.target.value, 59)
            setM(v)
            emit(pm, h, v)
          }}
          disabled={disabled}
          inputMode="numeric"
          placeholder="분"
          aria-label="분"
          className={num}
        />
      </div>
    </div>
  )
}
