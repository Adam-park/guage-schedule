// 배송 상태 화면 시안 비교 — 예시: 오전 9시에 3통 보냄, 지금 오후 2시
import { StatusA, StatusB, StatusC, StatusFlow, StatusDetail } from './tome/status.jsx'
import { LetterFinal } from './tome/letter.jsx'

function Phone({ label, sub, children }) {
  return (
    <div style={{ width: 375 }}>
      <div className="text-sm font-semibold text-ink">{label}</div>
      <div className="mb-2 text-xs text-ink-dim">{sub}</div>
      <div className="overflow-hidden rounded-lg bg-bg" style={{ width: 375, height: 667, outline: '1px solid var(--color-border)' }}>
        {children}
      </div>
    </div>
  )
}

export default { title: '2 작업 기록/4 배송 상태 시안' }

export const Compare = {
  name: '시안 비교',
  render: () => (
    <div className="flex gap-8 p-6">
      <Phone label="A · 3줄 목록" sub="작은 봉투 + 할 일 + 게이지를 한 줄씩"><StatusA /></Phone>
      <Phone label="B · 가장 급한 하나를 크게" sub="곧 도착할 편지 크게, 나머지 작게"><StatusB /></Phone>
      <Phone label="C · 한 장씩 넘기기" sub="옆으로 밀어서 다음 편지 (점 3개)"><StatusC /></Phone>
    </div>
  ),
}

export const Flow = {
  name: 'A 확정 · 목록 → 상세 (편지를 눌러 보기)',
  render: () => (
    <div className="flex gap-8 p-6">
      <Phone label="목록 → 상세" sub="편지를 누르면 상세, 왼쪽 위 ←로 돌아가기"><StatusFlow /></Phone>
      <Phone label="상세 · 편지1" sub="봉투 크기·위치 = 편지 작성 화면"><StatusDetail /></Phone>
      <Phone label="(비교) 편지 작성 화면" sub="봉투 위치 대조용"><LetterFinal /></Phone>
    </div>
  ),
}
