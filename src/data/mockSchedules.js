// 목데이터. 백엔드 붙으면 이 파일만 교체.
// 데드라인은 "지금" 기준 상대 시각으로 생성 → 언제 열어도 달력에 배터리 단계가 골고루 보이게.

const now = new Date()
const h = (n) => new Date(now.getTime() + n * 60 * 60 * 1000).toISOString()
const d = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000).toISOString()

export const mockSchedules = [
  { id: 'm1', title: '치과 예약', deadline: h(3), done: false }, // 오늘, 빨강
  { id: 'm2', title: '팀 회의', deadline: h(28), done: false }, // 내일, 빨강~노랑
  { id: 'm3', title: '월세 이체', deadline: d(3), done: false }, // 3일 뒤, 노랑
  { id: 'm4', title: '친구 생일 저녁', deadline: d(6), done: false }, // 6일 뒤, 노랑~편안
  { id: 'm5', title: '건강검진', deadline: d(12), done: false }, // 12일 뒤, 편안(7일 밖)
  { id: 'm6', title: '부모님 방문', deadline: d(20), done: false }, // 20일 뒤, 편안
  { id: 'm7', title: '장보기', deadline: h(-20), done: false }, // 지남 + 미완료 = 놓침
  { id: 'm8', title: '운동', deadline: h(-4), done: true }, // 완료 = 회색
]
