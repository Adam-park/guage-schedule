// 반송함 — 미룬 카드가 사라지지 않고 쌓이는 자리 (CONCEPT.md Emphasize②, Priority②)
import ParcelCard from './ParcelCard.jsx'

export default function ReturnBin({ items, onRedeliver }) {
  if (items.length === 0) return null

  return (
    <div className="rounded-lg border border-dashed border-border bg-surface-sunken px-4 py-3">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-ink-dim">
        <span>반송함</span>
        <span className="tabular-nums">{items.length}개</span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((p) => (
          <ParcelCard
            key={p.id}
            title={p.title}
            deadline={p.deadline}
            phase="returned"
            actionLabel="다시 보내기"
            onDeliver={() => onRedeliver(p.id)}
          />
        ))}
      </div>
    </div>
  )
}
