// 반송함 컨셉 — 카드 하나의 배송 상태를 순수하게 계산 (CONCEPT.md Interaction principles 참조)
// 값(유예 시간)은 데모용 임시값 — design.md 5.1 "디버프 임계치" 계열 미정 항목과 같은 성격, 확정 아님.

export const GRACE_MS = 20 * 60 * 1000 // 마감 후 20분 유예 — 이 안에 처리하면 정시 배송

export function getParcelPhase(parcel, now = Date.now()) {
  if (parcel.deliveredAt) {
    return parcel.wasReturned ? 'redelivered' : 'delivered'
  }
  const deadline = parcel.deadline.getTime()
  if (now < deadline) return 'scheduled'
  if (now < deadline + GRACE_MS) return 'due'
  return 'returned'
}
