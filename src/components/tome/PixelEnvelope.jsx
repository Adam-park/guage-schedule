// 닫힌 편지 봉투 — 원본 자산 public/assets/pixelart/envelope-closed.png (96×112, PixelLab). 형태 변형 금지.
// 정수배로만 확대해 픽셀 유지. 실측: 그림이 그려진 영역은 (14,26)부터 66×57 → 아래쪽 투명 여백 29px
export const ENVELOPE_ART = { x: 14, y: 26, w: 66, h: 57 }
const BOTTOM_PAD = 112 - ENVELOPE_ART.y - ENVELOPE_ART.h

export default function PixelEnvelope({ scale = 1, trimBottom = false }) {
  return (
    <img
      src="/assets/pixelart/envelope-closed.png"
      alt=""
      width={96 * scale}
      height={112 * scale}
      // trimBottom: 투명 여백만큼 당겨서, 바깥 간격이 '눈에 보이는 봉투' 기준이 되게 함
      style={{ imageRendering: 'pixelated', marginBottom: trimBottom ? -BOTTOM_PAD * scale : undefined }}
    />
  )
}
