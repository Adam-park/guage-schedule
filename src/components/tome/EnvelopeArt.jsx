// 봉투의 '그림이 그려진 부분'만 보이게 잘라 보여주기 (원본 96×112 중 (14,26) 66×57). 그림 자체는 변형 없음.
import PixelEnvelope from './PixelEnvelope.jsx'

export default function EnvelopeArt({ scale = 1 }) {
  return (
    <div className="shrink-0 overflow-hidden" style={{ width: 66 * scale, height: 57 * scale }}>
      <div style={{ marginLeft: -14 * scale, marginTop: -26 * scale }}>
        <PixelEnvelope scale={scale} />
      </div>
    </div>
  )
}
