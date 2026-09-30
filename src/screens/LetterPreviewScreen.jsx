// 편지지 이미지 확대 미리보기 — 실제 화면에서 카드 크기로 키워졌을 때 느낌 확인용
export default function LetterPreviewScreen() {
  return (
    <div className="mx-auto flex min-h-full max-w-[440px] flex-col items-center px-6 pt-16">
      <img
        src="/assets/pixelart/envelope-letter-v2.png"
        alt="편지지 미리보기"
        className="w-full max-w-[320px]"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}
