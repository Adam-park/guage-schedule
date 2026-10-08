// 보관본: 2026-10-08 Storybook 확정안(편지 작성 A) 반영 전 LetterWriteScreen (commit c139c87). Storybook Before 비교 전용 — 앱에서 쓰지 않음
// 편지 작성 화면 — 편지지 이미지(지렁이 글씨 포함)는 장식, 실제 입력칸(제목/시간)은 아래.
// 배송 누르면 입력 사라지고 편지지 이미지가 회전하며 날아가듯 사라졌다가 다시 나타남.
import { useState } from 'react'

export default function LetterWriteScreen() {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [sending, setSending] = useState(false)

  function handleSend() {
    if (!title.trim() || sending) return
    setSending(true)
    setTitle('')
    setTime('')
    setTimeout(() => setSending(false), 700)
  }

  return (
    <div className="mx-auto flex min-h-full max-w-[440px] flex-col items-center px-6 pt-16">
      <img
        src="/assets/pixelart/envelope-letter-v3.png"
        alt=""
        className={`w-full max-w-[320px] transition-all duration-700 ease-in ${
          sending
            ? '-translate-y-32 translate-x-12 rotate-12 scale-50 opacity-0'
            : 'translate-y-0 translate-x-0 rotate-0 scale-100 opacity-100'
        }`}
        style={{ imageRendering: 'pixelated' }}
      />

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="오늘 할 일"
        disabled={sending}
        className="mt-6 w-full max-w-[320px] rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint"
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        disabled={sending}
        className="mt-2 w-full max-w-[320px] rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none"
      />

      <button
        type="button"
        onClick={handleSend}
        disabled={sending}
        className="font-pixel mt-4 w-full max-w-[320px] rounded-lg bg-ink py-3 text-sm text-white transition-transform active:scale-[.98] disabled:opacity-50"
      >
        배송
      </button>
    </div>
  )
}
