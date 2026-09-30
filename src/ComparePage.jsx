// 비교 전용 페이지 — 05 결정카드 작업물. 실제 서비스 화면(App.jsx)에는 이 안내/탭이 없음.
// 접근: 로컬 개발 주소 뒤에 ?compare=1 (예: http://localhost:5173/?compare=1)
import { useState } from 'react'
import BeforeRunner from './screens/BeforeRunner.jsx'
import AfterToday from './screens/AfterToday.jsx'

const NOTES = [
  { rule: 'Priority① · Emphasize①', change: '마감 도달 카드에 "배송 시도 중 → 나" 상태 라벨이 최상단에 뜸' },
  { rule: 'Emphasize②', change: '반송함이 별도 영역으로 항상 보임(개수 표시), 사라지지 않음' },
  { rule: 'Priority②', change: '반송함 항목에 "다시 보내기" 액션 상시 노출 — 뒤늦은 완수 경로' },
  { rule: 'Priority③ · Visual behavior', change: '상태 라벨에 "→ 나"를 카드마다 절제된 빈도로만 표기' },
  { rule: 'De-emphasize①', change: '오늘 처리한 항목은 접힌 목록(details)으로 축소, 펼쳐야 보임' },
]

export default function ComparePage() {
  const [tab, setTab] = useState('after')

  return (
    <div className="min-h-full bg-surface-sunken">
      <div className="mx-auto max-w-[440px] px-4 pt-6">
        <div className="mb-1 text-sm font-bold text-ink">Before / After 비교 (04 결정카드 기준, 개발용 페이지)</div>
        <p className="mb-4 text-xs text-ink-dim">
          이 페이지는 비교 확인용입니다. 실제 서비스 화면(App.jsx, 기본 주소)에는 이 안내·탭이 없습니다.
        </p>
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setTab('before')}
            className={`flex-1 rounded-md border border-border py-2 text-xs font-semibold transition-colors ${
              tab === 'before' ? 'bg-ink text-white' : 'bg-surface text-ink-dim'
            }`}
          >
            Before (성화봉송 러너, 에셋만)
          </button>
          <button
            type="button"
            onClick={() => setTab('after')}
            className={`flex-1 rounded-md border border-border py-2 text-xs font-semibold transition-colors ${
              tab === 'after' ? 'bg-ink text-white' : 'bg-surface text-ink-dim'
            }`}
          >
            After (반송함, 04 확정안)
          </button>
        </div>
      </div>

      {tab === 'before' ? <BeforeRunner /> : <AfterToday />}

      <div className="mx-auto max-w-[440px] px-4 pb-10 pt-2">
        <div className="rounded-lg border border-border bg-surface p-3 text-xs text-ink-dim">
          <div className="mb-2 font-semibold text-ink">변경과 CONCEPT.md 기준 연결 (최대 5개)</div>
          <ul className="flex flex-col gap-1.5">
            {NOTES.map((n) => (
              <li key={n.rule}>
                <span className="font-semibold text-ink">{n.rule}</span> — {n.change}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
