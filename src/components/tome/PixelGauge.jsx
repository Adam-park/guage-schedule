// 픽셀 게이지 — 강사님 레퍼런스(둥근 캡슐 틀 + 칸 채움 + 칸 위쪽 하이라이트). 그림 파일 없이 코드로.

// 둥근 끝은 매끈한 곡선 대신 2px 계단으로 깎아 픽셀 느낌 유지 (clip-path)
// 계단 들여쓰기는 반원(반지름 = 높이/2)을 따라 계산해 2px 단위로 맞춤 → 화살촉이 아니라 캡슐 모양
function pixelPill(height, unit = 2) {
  const r = height / 2
  const rows = Math.floor(r / unit)
  const ins = []
  for (let i = 0; i < rows; i++) {
    const dy = r - (i * unit + unit / 2) // 이 줄 가운데에서 원 중심까지 세로 거리
    const x = r - Math.sqrt(Math.max(r * r - dy * dy, 0))
    ins.push(Math.round(x / unit) * unit)
  }
  const p = []
  const add = (x, y, fromRight, fromBottom) =>
    p.push(`${fromRight ? `calc(100% - ${x}px)` : `${x}px`} ${fromBottom ? `calc(100% - ${y}px)` : `${y}px`}`)
  add(ins[0], 0, false, false)
  add(ins[0], 0, true, false)
  for (let i = 0; i < rows; i++) {
    add(ins[i], i * unit, true, false)
    add(ins[i], (i + 1) * unit, true, false)
  }
  for (let i = rows - 1; i >= 0; i--) {
    add(ins[i], (i + 1) * unit, true, true)
    add(ins[i], i * unit, true, true)
  }
  for (let i = 0; i < rows; i++) {
    add(ins[i], i * unit, false, true)
    add(ins[i], (i + 1) * unit, false, true)
  }
  for (let i = rows - 1; i >= 0; i--) {
    add(ins[i], (i + 1) * unit, false, false)
    add(ins[i], i * unit, false, false)
  }
  return `polygon(${p.join(', ')})`
}

// cells: 각 칸의 색 클래스 (null = 빈 칸). 채운 칸은 위쪽 밝은 줄 + 아래쪽 어두운 줄로 입체감
export default function PixelGauge({ cells, height = 20 }) {
  return (
    <div className="w-full bg-ink p-[2px]" style={{ height, clipPath: pixelPill(height) }}>
      <div className="flex h-full w-full gap-[2px] bg-bg p-[2px]" style={{ clipPath: pixelPill(height - 4) }}>
        {cells.map((c, i) => (
          <div
            key={i}
            className={`flex-1 transition-colors duration-200 ${c ?? 'bg-transparent'}`}
            style={c ? { boxShadow: 'inset 0 3px 0 rgb(255 255 255 / 0.45), inset 0 -2px 0 rgb(0 0 0 / 0.12)' } : undefined}
          />
        ))}
      </div>
    </div>
  )
}
