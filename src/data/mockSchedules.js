// 목데이터 — Hearth/ScheduleCard 컴포넌트 프로토타입용.
// value(태우면 불씨에 더해질 양)는 임시 고정값. 계산 규칙은 design.md 4장 "아직 안 정한 것" 참조.

export const todaySchedules = [
  { id: 't1', time: '09:00', title: '아침 스트레칭', value: 18, done: false },
  { id: 't2', time: '15:00', title: '치과 예약', value: 15, done: false },
  { id: 't3', time: '20:00', title: '팀 회의 자료', value: 20, done: false },
]

export const tomorrowSchedules = [
  { id: 'm1', time: '11:00', title: '세탁물 찾기', value: 12, done: false },
  { id: 'm2', time: '19:00', title: '친구 생일 저녁', value: 16, done: false },
]
