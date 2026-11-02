// '하나 더 보내기' 시안 (2026-11-02) — 기본 하루 1통, 보낸 뒤 1통 더. 실제 편지 작성 화면 코드(extraOffer)로 직접 눌러 보기. 앱 반영 전
import { useState } from 'react'
import LetterWriteScreen from '../screens/LetterWriteScreen.jsx'
import OnboardingScreen from '../screens/OnboardingScreen.jsx'

function Phone({ label, sub, children }) {
  const [k, setK] = useState(0)
  return (
    <div style={{ width: 375 }}>
      <div className="flex items-baseline justify-between">
        <div className="text-sm font-semibold text-ink">{label}</div>
        <button type="button" onClick={() => setK(k + 1)} className="text-xs underline" style={{ color: '#2563eb' }}>
          다시 보기
        </button>
      </div>
      <div className="mb-2 text-xs text-ink-dim">{sub}</div>
      <div className="overflow-hidden rounded-lg bg-bg" style={{ width: 375, height: 667, outline: '1px solid var(--color-border)' }}>
        <div key={k} className="h-full">
          {children}
        </div>
      </div>
    </div>
  )
}

// 온보딩 마지막 문장 후보 (지금: "하루에 보낼 수 있는 편지는 2통." — 2통이 미리 보이면 '하나 더'의 놀라움이 사라짐)
const steps = (last) => {
  const s = [
    '오늘 하루, 시간대마다\n그 시간의 내가 있어요.',
    '아침의 나, 오후의 나, 저녁의 나.\n이 사실을 아는 건 현재의 나 바로 당신뿐이에요.',
    '현재의 나는 미래의 나를 위해\n오늘 할 일을 편지에 적어요.',
    '할 일과 시간을 적고\n배송을 누르면 약속이 시작돼요.',
    '시간 안에 해내고 배송 완료를 누르면\n편지가 미래의 나에게 도착해요.',
    '해내지 못한 일정은 반송함으로 돌아와요.\n반송된 편지는 그 시간의 나에게 닿지 못해요.',
  ]
  return [...s, last]
}
const ONB = [
  ['후보 1', '하루에 보내는 편지는 1통.\n미래의 나는 그만큼 더 나아가요.'],
  ['후보 2', '편지는 하루 1통이면 충분해요.\n미래의 나는 그만큼 더 나아가요.'],
  ['후보 3', '오늘 할 일 하나를 편지에 담아요.\n미래의 나는 그만큼 더 나아가요.'],
]

export default { title: '2 작업 기록/13 하나 더 보내기 시안' }

export const Flow = {
  name: '처음 쓰는 날 / 다음 날부터',
  render: () => (
    <div className="flex flex-col gap-10 p-6">
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">편지 1통을 써서 보내 보세요 (할 일 + 시간 입력 → 보내기)</h2>
        <div className="flex flex-wrap gap-8">
          <Phone label="처음 쓰는 날" sub="1통 보낸 뒤 안내 + [오늘은 여기까지] [하나 더 쓰기] — 처음 한 번만">
            <LetterWriteScreen extraOffer="first" />
          </Phone>
          <Phone label="다음 날부터" sub="1통 보낸 뒤 질문 없이 작은 '하나 더 보내기 →'만">
            <LetterWriteScreen extraOffer="later" />
          </Phone>
          <Phone label="(참고) 지금" sub="처음부터 2칸, 카운터 1/2">
            <LetterWriteScreen />
          </Phone>
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">온보딩 마지막 문장 후보 — 지금 "하루에 보낼 수 있는 편지는 2통."</h2>
        <div className="flex flex-wrap gap-8">
          {ONB.map(([label, text]) => (
            <Phone key={label} label={label} sub={text.replace('\n', ' ')}>
              <OnboardingScreen steps={steps(text)} initialStep={6} />
            </Phone>
          ))}
        </div>
      </section>
    </div>
  ),
}
