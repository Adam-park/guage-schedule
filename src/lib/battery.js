// 데이 배터리 핵심 계산 — 순수 함수만. 스타일/색 HEX는 여기 두지 않는다.
// 규칙 근거: 프로젝트 루트 CLAUDE.md "핵심 개념: 배터리(게이지)"

// 활주로: 데드라인 이만큼 전부터 배터리가 방전되기 시작한다.
// 이 시간보다 더 남은 일정은 배터리 꽉 참(잔잔한 색) 고정.
export const RUNWAY_HOURS = 168 // 7일

// 배터리 단계 경계 (남은 비율 기준)
export const STAGE_THRESHOLDS = {
  calm: 0.6, // 0.6 이상 = 편안한 색 (청록)
  warn: 0.25, // 0.25 ~ 0.6 = 노랑
  // 0.25 미만 = 빨강(urgent), 0 = empty(놓침)
}

const RUNWAY_MS = RUNWAY_HOURS * 60 * 60 * 1000

/** 지금부터 데드라인까지 남은 밀리초 (지났으면 음수) */
function remainingMs(schedule, now) {
  return new Date(schedule.deadline).getTime() - now.getTime()
}

/**
 * 배터리 잔량 (0 ~ 1). 데드라인 7일 전 = 1, 데드라인 = 0.
 */
export function batteryLevel(schedule, now = new Date()) {
  const remaining = remainingMs(schedule, now)
  if (remaining <= 0) return 0
  return Math.min(1, remaining / RUNWAY_MS)
}

/**
 * 배터리 단계. 컴포넌트가 이걸 색 클래스로 매핑한다.
 * @returns {'frozen'|'calm'|'warn'|'urgent'|'empty'}
 */
export function batteryStage(schedule, now = new Date()) {
  if (schedule.done) return 'frozen'
  if (remainingMs(schedule, now) <= 0) return 'empty' // 데드라인 지남 + 미완료 = 놓침
  const level = batteryLevel(schedule, now)
  if (level >= STAGE_THRESHOLDS.calm) return 'calm'
  if (level >= STAGE_THRESHOLDS.warn) return 'warn'
  return 'urgent'
}

/**
 * 한 날짜의 배터리 = 그날 "제일 급한(데드라인 가장 이른) 미완료 일정" 기준.
 * @param {Array} daySchedules - 그 날짜에 속한 일정들
 * @param {Date} now
 * @returns {{ level:number, stage:string, driver:object|null }|null}
 */
export function dayBattery(daySchedules, now = new Date()) {
  if (!daySchedules || daySchedules.length === 0) return null

  const driver = daySchedules
    .filter((s) => !s.done)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0]

  // 전부 완료된 날 — 배터리를 몰아가는 일정이 없음
  if (!driver) return { level: 0, stage: 'frozen', driver: null }

  return {
    level: batteryLevel(driver, now),
    stage: batteryStage(driver, now),
    driver,
  }
}

/** 로컬 날짜 키 'YYYY-MM-DD' */
export function dayKey(d) {
  const x = new Date(d)
  const y = x.getFullYear()
  const m = String(x.getMonth() + 1).padStart(2, '0')
  const day = String(x.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
