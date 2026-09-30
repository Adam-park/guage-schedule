// After 대표 화면 — 반송함 컨셉 (04 결정카드 기준)
import { useEffect, useState } from 'react'
import { createMockParcels } from '../data/mockParcels.js'
import { getParcelPhase } from '../lib/parcelState.js'
import ParcelCard from '../components/ParcelCard.jsx'
import ReturnBin from '../components/ReturnBin.jsx'

export default function AfterToday() {
  const [parcels, setParcels] = useState(() => createMockParcels())
  const [now, setNow] = useState(() => Date.now())

  // 실제로 due → returned 전이가 일어나는지 확인하기 위한 재계산 (화면 상태만이 아니라 실동작)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15000)
    return () => clearInterval(id)
  }, [])

  function deliver(id, wasReturned) {
    setParcels((list) => list.map((p) => (p.id === id ? { ...p, deliveredAt: new Date(), wasReturned } : p)))
  }

  const withPhase = parcels.map((p) => ({ ...p, phase: getParcelPhase(p, now) }))
  const due = withPhase.filter((p) => p.phase === 'due')
  const scheduled = withPhase.filter((p) => p.phase === 'scheduled')
  const returned = withPhase.filter((p) => p.phase === 'returned')
  const done = withPhase.filter((p) => p.phase === 'delivered' || p.phase === 'redelivered')

  return (
    <div className="mx-auto flex max-w-[440px] flex-col gap-4 px-4 py-10">
      <div className="text-xs font-semibold text-ink-faint">오늘</div>

      <div className="flex flex-col gap-2">
        {due.map((p) => (
          <ParcelCard
            key={p.id}
            title={p.title}
            deadline={p.deadline}
            phase="due"
            onDeliver={() => deliver(p.id, false)}
          />
        ))}
        {scheduled.map((p) => (
          <ParcelCard key={p.id} title={p.title} deadline={p.deadline} phase="scheduled" />
        ))}
      </div>

      <ReturnBin items={returned} onRedeliver={(id) => deliver(id, true)} />

      {done.length > 0 && (
        <details className="text-xs text-ink-faint">
          <summary className="cursor-pointer select-none">오늘 처리한 것 {done.length}개</summary>
          <div className="mt-2 flex flex-col gap-1.5">
            {done.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-md bg-surface-sunken px-3 py-1.5">
                <span className="truncate">{p.title}</span>
                <span className="font-semibold text-state-delivered">
                  {p.phase === 'redelivered' ? '재배송 성공' : '배송 완료'}
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
