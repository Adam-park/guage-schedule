// 첫 화면 — 제목 "나를 완성하는 시간" + "TO ME", 중앙 상단 배치, 아래에 Start 버튼
export default function IntroScreen({ onStart }) {
  return (
    <div className="mx-auto flex min-h-full max-w-[440px] flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center text-center">
        <h1 className="font-pixel text-4xl tracking-[0.15em] text-ink" style={{ imageRendering: 'pixelated' }}>
          TO ME
        </h1>
        <p className="font-pixel mt-2 text-sm text-ink-dim">나를 완성하는 시간</p>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="font-pixel mt-10 w-full rounded-lg bg-ink py-3.5 text-sm text-white transition-transform active:scale-[.98]"
      >
        Start
      </button>
    </div>
  )
}
