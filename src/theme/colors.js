// 배터리 단계별 색 토큰. HEX 최종값은 미결(스크린샷 보고 튜닝) — 지금은 임시값.
// batteryStage() 가 돌려주는 문자열 -> { fill: 채워진 부분, track: 빈 부분 }

const RED = { fill: '#ef4444', track: '#fee2e2' }

export const STAGE_COLORS = {
  calm: { fill: '#2dd4bf', track: '#ccfbf1' }, // 청록 (여유)
  warn: { fill: '#facc15', track: '#fef9c3' }, // 노랑 (다가옴)
  urgent: RED, // 빨강 (임박)
  empty: RED, // 텅 빔 / 놓침 — urgent와 동일
  frozen: { fill: '#9ca3af', track: '#f3f4f6' }, // 회색 (완료)
}
