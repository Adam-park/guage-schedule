// Before 대표 화면 — 성화봉송 러너 컨셉 (design.md 6~7장, 코드 반영 0%였던 상태)
// 사용자가 제공한 레퍼런스 목업 이미지(03.png 왼쪽 절반)를 그대로 사용 — 정적 이미지이며 실제 인터랙션은 없음.
export default function BeforeRunner() {
  return (
    <div className="mx-auto flex max-w-[440px] flex-col gap-4 px-4 py-10">
      <img
        src="/assets/pixelart/before-runner-screen.png"
        alt="성화봉송 러너 컨셉 목업 (레퍼런스, 정적 이미지)"
        className="w-full rounded-xl"
      />
      <p className="text-[11px] leading-relaxed text-ink-faint">
        ※ 이 화면은 레퍼런스 목업 이미지입니다. 실제로 동작하는 코드(km·장애물·디버프, 카드 탭 처리 등)는
        구현된 적이 없습니다.
      </p>
    </div>
  )
}
