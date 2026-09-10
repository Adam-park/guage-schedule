import { useRef, useState } from 'react'
import ScheduleCard from './ScheduleCard.jsx'

// 오늘 카드 목록. resolve된 카드를 hearthRef 위치로 던지는 애니메이션까지 여기서 조율 (design.md 2장)
export default function ScheduleHand({ items, hearthRef, onBurn, reduceMotion = false }) {
  const [pending, setPending] = useState(items)
  const cardRefs = useRef({})

  function handleResolve(id, value) {
    const cardEl = cardRefs.current[id]
    const pitEl = hearthRef.current

    if (!cardEl || !pitEl || reduceMotion) {
      setPending((list) => list.filter((item) => item.id !== id))
      onBurn(value)
      return
    }

    const cardRect = cardEl.getBoundingClientRect()
    const pitRect = pitEl.getBoundingClientRect()
    const dx = pitRect.left + pitRect.width / 2 - (cardRect.left + cardRect.width / 2)
    const dy = pitRect.top + pitRect.height / 2 - (cardRect.top + cardRect.height / 2)
    const rot = (Math.random() > 0.5 ? 1 : -1) * (200 + Math.random() * 160)

    const anim = cardEl.animate(
      [
        { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1, offset: 0 },
        {
          transform: `translate(${dx * 0.45}px, ${dy * 0.55 - 46}px) rotate(${rot * 0.5}deg) scale(.85)`,
          opacity: 1,
          offset: 0.5,
        },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(.15)`, opacity: 0, offset: 1 },
      ],
      { duration: 620, easing: 'cubic-bezier(.3,.6,.25,1)' }
    )

    anim.onfinish = () => {
      setPending((list) => list.filter((item) => item.id !== id))
      onBurn(value)
    }
  }

  return (
    <div className="mt-3.5 flex min-h-[108px] flex-wrap justify-center gap-2.5 border-t border-border pt-3.5">
      {pending.map((item) => (
        <ScheduleCard
          key={item.id}
          ref={(el) => {
            cardRefs.current[item.id] = el
          }}
          time={item.time}
          title={item.title}
          value={item.value}
          reduceMotion={reduceMotion}
          onResolve={(value) => handleResolve(item.id, value)}
        />
      ))}

      {pending.length === 0 && (
        <div className="flex w-full items-center justify-center py-7 text-sm text-ink-faint">
          오늘 낼 카드가 없음 — 불씨는 서서히 사그라듦
        </div>
      )}
    </div>
  )
}
