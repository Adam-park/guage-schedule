// TO ME 편지 — 시간 계산(순수 함수) + 이 기기 저장(localStorage)
// 시각은 '그날 자정부터 몇 분'(예: 15:00 = 900)으로 다룸. 편지 하나: { id, title, date, sentAt, dueAt, done }

export const hhmm = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`
export const toMin = (time) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}
export const nowMin = (d = new Date()) => d.getHours() * 60 + d.getMinutes()
// 오늘 날짜: '10월 8일 수요일'
export const todayLabel = (d = new Date()) => `${d.getMonth() + 1}월 ${d.getDate()}일 ${'일월화수목금토'[d.getDay()]}요일`

export const progress = (l, now) => Math.max(0, Math.min(1, (now - l.sentAt) / (l.dueAt - l.sentAt)))
export const left = (l, now) => {
  const m = l.dueAt - now
  return m <= 0 ? '도착' : m >= 60 ? `${Math.floor(m / 60)}시간${m % 60 ? ` ${m % 60}분` : ''} 남음` : `${m}분 남음`
}

// ---- 도착 전후 상태 (2026-10-08 확정) ----
// 마감 20분 전~마감: 앱 안 알림 "N번 편지가 배송되기 N분 전입니다"
// 마감~+30분: 게이지 꽉 참 → 상세 '배송 완료?' 버튼 → 누르면 '배송 완료!'
// 마감 +10분~+30분(미완료): 앱 안 알림 "N번 편지가 아직 배송 완료되지 않았어요" (문구 임시)
// 마감 +30분(미완료): 반송
export const PRE_ALERT = 20
export const REMIND_AFTER = 10
export const RETURN_AFTER = 30

export function letterState(l, now, done) {
  if (done) return 'done'
  if (now >= l.dueAt + RETURN_AFTER) return 'returned'
  if (now >= l.dueAt) return 'arrived'
  if (now >= l.dueAt - PRE_ALERT) return 'soon'
  return 'transit'
}

const GAUGE_COLOR = { transit: 'bg-state-due', soon: 'bg-state-due', arrived: 'bg-state-due', done: 'bg-green-300', returned: 'bg-state-returned' }
const moving = (st) => st === 'transit' || st === 'soon'
// 10칸 게이지: 움직이는 중이면 지난 비율만큼, 아니면 꽉 참. blink = 마지막 찬 칸 깜빡임(상세 화면)
export const stateCells = (l, now, st, blink = false, n = 10) => {
  const filled = Math.round((moving(st) ? progress(l, now) : 1) * n)
  return Array.from({ length: n }, (_, i) =>
    i < filled ? `${GAUGE_COLOR[st]}${blink && moving(st) && i === filled - 1 ? ' tome-cell-blink' : ''}` : null,
  )
}
const STATE_TEXT = { arrived: '도착했어요', done: '배송 완료!', returned: '반송됨' }
export const stateText = (l, now, st) => (moving(st) ? left(l, now) : STATE_TEXT[st])

export function noticesFor(letters, now, doneIds) {
  return letters.flatMap((l, i) => {
    const st = letterState(l, now, doneIds.includes(l.id))
    if (st === 'soon') return [`${i + 1}번 편지가 배송되기 ${l.dueAt - now}분 전입니다`]
    if (st === 'arrived' && now >= l.dueAt + REMIND_AFTER) return [`${i + 1}번 편지가 아직 배송 완료되지 않았어요`]
    return []
  })
}

// ---- 이 기기 저장 ----
const KEY = 'tome.letters'
export const dateKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function loadLetters() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}
function saveLetters(letters) {
  try {
    localStorage.setItem(KEY, JSON.stringify(letters))
  } catch {
    // 저장소를 못 쓰는 환경: 기록 없이 진행
  }
}
// 편지 작성 화면에서 '보내기' 1통
export function addLetter({ title, time }, d = new Date()) {
  const letter = { id: `${Date.now()}`, title, date: dateKey(d), sentAt: nowMin(d), dueAt: toMin(time), done: false }
  saveLetters([...loadLetters(), letter])
  return letter
}
// 상세 화면 '배송 완료?' → 완료 기록
export const markDone = (id) => saveLetters(loadLetters().map((l) => (l.id === id ? { ...l, done: true } : l)))
export const todayLetters = (all, d = new Date()) => all.filter((l) => l.date === dateKey(d))
// 반송함: 지난 날의 미완료 편지 + 오늘 반송된 편지
export const returnedLetters = (all, d = new Date()) =>
  all.filter((l) => !l.done && (l.date < dateKey(d) || (l.date === dateKey(d) && letterState(l, nowMin(d), false) === 'returned')))
