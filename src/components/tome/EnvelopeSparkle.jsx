// 봉투 '배송 완료' 반짝임 — 봉투 그림 바깥에 픽셀 십자 별 3개가 번갈아 깜빡인 뒤 남음
// 봉투(PixelEnvelope)를 감싼 relative 박스 안에 함께 넣어 사용. 색 = 게이지 완료색(green-300)
import { ENVELOPE_ART as ART } from './PixelEnvelope.jsx'

const CSS = `
@keyframes tome-blink { 0% { opacity: 0 } 20% { opacity: 1 } 40% { opacity: 0 } 60%, 100% { opacity: 1 } }
@media (prefers-reduced-motion: reduce) { .tome-spark { animation: none !important; opacity: 1 !important } }
`

function Spark({ x, y, delay }) {
  const bar = 'absolute bg-green-300'
  return (
    <div className="tome-spark pointer-events-none absolute" style={{ left: x, top: y, width: 10, height: 10, animation: `tome-blink 900ms step-end ${delay}ms 1 both` }}>
      <div className={bar} style={{ left: 4, top: 0, width: 2, height: 10 }} />
      <div className={bar} style={{ left: 0, top: 4, width: 10, height: 2 }} />
    </div>
  )
}

export default function EnvelopeSparkle() {
  return (
    <>
      <style>{CSS}</style>
      <Spark x={ART.x - 20} y={ART.y - 16} delay={0} />
      <Spark x={ART.x + ART.w + 10} y={ART.y - 10} delay={150} />
      <Spark x={ART.x + ART.w + 16} y={ART.y + ART.h - 18} delay={300} />
    </>
  )
}
