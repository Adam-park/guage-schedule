// 반송함 아이콘 — 배송 상태 목록 왼쪽 아래 우편함(PixelLab, 사용자 선택 후 확정) + 개수 배지
// 배지: 동그라미, 우편함 뒤쪽 오른쪽 위(빨간 깃발 뒤)에 숨듯이 — 우편함 그림보다 뒤에 그림 (2026-10-09)
// mailbox.png 실측(96×112): 몸통 x19~73·y23~65, 깃발 x50~60·y21~ → 배지 가운데 (76, 20), 지름 24
export const MAILBOX_SRC = '/assets/pixelart/mailbox.png'

export default function MailboxButton({ count, onClick }) {
  return (
    <button type="button" onClick={onClick} aria-label={`반송함 ${count}통`} className="absolute bottom-4 left-4 active:scale-[.96]">
      {count > 0 && (
        <span
          className="font-pixel absolute flex items-center justify-center rounded-full border-2 border-ink bg-state-returned text-xs text-white tabular-nums"
          style={{ left: 64, top: 8, width: 24, height: 24, zIndex: 0 }}
        >
          {count}
        </span>
      )}
      <img src={MAILBOX_SRC} alt="" width={96} height={112} className="relative" style={{ imageRendering: 'pixelated', zIndex: 1 }} />
    </button>
  )
}
