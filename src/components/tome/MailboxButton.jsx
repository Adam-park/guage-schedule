// 반송함 아이콘 — 배송 상태 목록 왼쪽 아래 우편함(PixelLab, 사용자 선택 후 확정) + 오른쪽 위 개수 배지
export const MAILBOX_SRC = '/assets/pixelart/mailbox.png'

export default function MailboxButton({ count, onClick }) {
  return (
    <button type="button" onClick={onClick} aria-label={`반송함 ${count}통`} className="absolute bottom-4 left-4 active:scale-[.96]">
      <img src={MAILBOX_SRC} alt="" width={96} height={112} style={{ imageRendering: 'pixelated' }} />
      {count > 0 && (
        <span className="font-pixel absolute top-3 right-2 flex h-6 min-w-6 items-center justify-center rounded-[3px] border-2 border-ink bg-state-returned px-1 text-xs text-white tabular-nums">
          {count}
        </span>
      )}
    </button>
  )
}
