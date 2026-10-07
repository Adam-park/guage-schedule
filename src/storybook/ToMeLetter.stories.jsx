// 편지 작성 화면 시안 비교 — 각 화면에서 직접 입력해 보기. 처음부터 다시 보려면 '다시 보기'
import { useState } from 'react'
import LetterWriteScreen from '../screens/LetterWriteScreen.jsx'
import { LetterA, LetterB, LetterC, LetterFinal } from './tome/letter.jsx'

function Phone({ label, sub, children }) {
  const [k, setK] = useState(0)
  return (
    <div style={{ width: 375 }}>
      <div className="flex items-baseline justify-between">
        <div className="text-sm font-semibold text-ink">{label}</div>
        <button type="button" onClick={() => setK(k + 1)} className="text-xs text-state-due underline">
          다시 보기
        </button>
      </div>
      <div className="mb-2 text-xs text-ink-dim">{sub}</div>
      <div key={k} className="overflow-hidden rounded-lg bg-bg" style={{ width: 375, height: 667, outline: '1px solid var(--color-border)' }}>
        {children}
      </div>
    </div>
  )
}

export default { title: '2 작업 기록/3 편지 작성 시안' }

export const Compare = {
  name: '시안 비교 (입력해 보기)',
  render: () => (
    <div className="flex gap-8 p-6">
      <Phone label="Before · 현재" sub="열린 봉투 그림 고정, 입력칸 아래"><LetterWriteScreen /></Phone>
      <Phone label="A · 칸 두 개" sub="이름표 붙은 픽셀 입력칸"><LetterA /></Phone>
      <Phone label="B · 편지 문장" sub="To. [시간]의 나에게 / [할 일]"><LetterB /></Phone>
      <Phone label="C · 시간 빠르게 고르기" sub="30분·1시간·3시간 뒤 / 직접"><LetterC /></Phone>
    </div>
  ),
}

export const Final = {
  name: 'A 확정 · 편지 번호 + 보내기 연출',
  render: () => (
    <div className="flex gap-8 p-6">
      <Phone label="A · 확정" sub="할 일·시간 입력 → 보내기 (3통까지), 왼쪽 위 나가기"><LetterFinal onExit={() => alert('나가기 (이동할 화면은 아직 없음)')} /></Phone>
    </div>
  ),
}

export const WindCompare = {
  name: '보내기 효과 방향 비교',
  render: () => (
    <div className="flex gap-8 p-6">
      <Phone label="1 · 왼쪽 → 오른쪽으로 흐름" sub="처음 버전"><LetterFinal wind="ltr" /></Phone>
      <Phone label="2 · 오른쪽 → 왼쪽으로 흐름" sub="지금 버전"><LetterFinal wind="rtl" /></Phone>
      <Phone label="3 · 꼬리선" sub="봉투 왼쪽 뒤에만 생겼다 사라짐"><LetterFinal wind="trail" /></Phone>
    </div>
  ),
}
