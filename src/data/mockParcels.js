// 반송함 컨셉용 목데이터 — "지금" 기준 상대 시각으로 구성해서, 열 때마다 due/returned 장면이 바로 보이게 함.
// 실제 데이터 모델(상태 필드 포함)은 아직 확정 아님 — design.md 4장 "데이터 모델" 갱신 대상 (04 결정카드 참조)

export function createMockParcels() {
  const now = Date.now()
  const MIN = 60 * 1000
  const HOUR = 60 * MIN

  return [
    {
      id: 'p1',
      title: '팀 회의 자료 공유',
      deadline: new Date(now - 3 * MIN), // 방금 지남 → 배송 시도 중
      deliveredAt: null,
      wasReturned: false,
    },
    {
      id: 'p2',
      title: '치과 예약',
      deadline: new Date(now + 90 * MIN), // 아직 안 옴 → 예정
      deliveredAt: null,
      wasReturned: false,
    },
    {
      id: 'p3',
      title: '어제 미룬 보고서 초안',
      deadline: new Date(now - 5 * HOUR), // 유예(20분) 한참 지남 → 반송함
      deliveredAt: null,
      wasReturned: false,
    },
    {
      id: 'p4',
      title: '아침 스트레칭',
      deadline: new Date(now - 3 * HOUR),
      deliveredAt: new Date(now - 3 * HOUR + 10 * MIN), // 마감 10분 뒤 정시 처리
      wasReturned: false,
    },
  ]
}
