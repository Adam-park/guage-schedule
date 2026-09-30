// 반송함 컨셉 카드 (CONCEPT.md Emphasize①/③, Visual behavior 참조)
// 감정적 캐릭터 반응 대신 상태 라벨(도장)만으로 표현 — 게임적 장식 없음 (CONCEPT.md Avoid)

const PHASE_LABEL = {
  scheduled: null,
  due: '배송 시도 중 → 나',
  returned: '반송됨',
}

const PHASE_LABEL_CLASS = {
  due: 'text-state-due',
  returned: 'text-state-returned',
}

export default function ParcelCard({ title, deadline, phase, onDeliver, actionLabel = '배송 완료 처리' }) {
  const timeLabel = deadline.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  const actionable = phase === 'due' || phase === 'returned'
  const label = PHASE_LABEL[phase]

  return (
    <div
      className={`rounded-lg border border-border bg-surface px-4 py-3 ${
        phase === 'scheduled' ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-center justify-between text-xs text-ink-faint tabular-nums">
        <span>{timeLabel}</span>
        {label && <span className={`font-semibold ${PHASE_LABEL_CLASS[phase]}`}>{label}</span>}
      </div>
      <div className="mt-1 text-sm font-semibold text-ink">{title}</div>
      {actionable && (
        <button
          type="button"
          onClick={onDeliver}
          className="mt-2 w-full rounded-md border border-border bg-surface-sunken py-2 text-xs font-semibold text-ink transition-transform active:scale-[.97]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
