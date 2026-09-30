// "나" 기록 화면 — 배송 완료한 편지 제목이 고치지 않고 그대로 쌓이는 것. AI가 쓴 문장 없음.
import { useState } from 'react'

const INITIAL_ENTRIES = ['아침 스트레칭', '치과 예약']

export default function MeBookScreen() {
  const [entries, setEntries] = useState(INITIAL_ENTRIES)
  const [draft, setDraft] = useState('')

  function addEntry() {
    const title = draft.trim()
    if (!title) return
    setEntries((list) => [title, ...list])
    setDraft('')
  }

  return (
    <div className="mx-auto flex min-h-full max-w-[440px] flex-col items-center px-6 pt-16 text-center">
      <h1 className="font-pixel text-3xl text-ink">나</h1>
      <p className="mt-2 text-xs text-ink-dim">내가 지킨 약속들의 기록</p>

      <div className="mt-8 flex w-full flex-col gap-2">
        {entries.map((title, i) => (
          <div key={`${title}-${i}`} className="rounded-md border border-border bg-surface px-4 py-3 text-left text-sm text-ink">
            {title}
          </div>
        ))}
        {entries.length === 0 && <p className="text-xs text-ink-faint">아직 지킨 약속이 없습니다.</p>}
      </div>

      <div className="mt-8 flex w-full gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="편지 제목 (데모)"
          className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink"
        />
        <button
          type="button"
          onClick={addEntry}
          className="rounded-md border border-border bg-surface-sunken px-3 py-2 text-xs font-semibold text-ink active:scale-[.97]"
        >
          배송 완료 (데모)
        </button>
      </div>
    </div>
  )
}
