// 3단계 Screen + 4단계 베리에이션 비교 — 375×667 모바일 틀
import IntroScreen from './legacy/IntroScreenBefore.jsx'
import { IntroAssembled, VariantA, VariantA1, VariantA2, VariantB, VariantC } from './tome/screens.jsx'

function Phone({ children }) {
  return (
    <div className="overflow-hidden rounded-lg bg-bg" style={{ width: 375, height: 667, outline: '1px solid var(--color-border)' }}>
      {children}
    </div>
  )
}

const NOTES = {
  Before: ['제목과 Start 버튼만 있음', '무슨 앱인지는 다음 화면(온보딩)에서 알게 됨', '가장 담백함', '처음 보는 사람은 "편지" 앱인지 모름'],
  A: ['닫힌 편지 봉투 그림', '그림 한 장으로 "편지" 앱임을 암시', '기존 PixelLab 봉투 재사용, 원본 배치 거의 그대로', '사용법(반송 등)까지는 안 알려줌'],
  B: ['제목 → 쓰기·보내기·도착·반송 4칸', '시작 전에 흐름 전체를 한 줄로 이해 (코칭: 사용법을 빠르게)', '온보딩 7단계를 미리 요약', '글자가 늘어 담백함이 줄어듦'],
  C: ['편지 겉면 같은 TO./FROM. 주소 칸', '앱 이름 "TO ME"가 주소 자체가 됨 (FROM 오늘의 나)', '컨셉이 가장 강하게 드러남', '제목이 쪼개져 "TO ME" 로고 느낌이 약해짐, 버튼이 맨 아래로 내려감'],
}
const LABELS = ['먼저 보이는 것', '컨셉 전달', '좋아지는 점', '아쉬운 점']

function Column({ label, notes, children }) {
  return (
    <div style={{ width: 375 }}>
      <div className="mb-2 text-sm font-semibold text-ink">{label}</div>
      <Phone>{children}</Phone>
      <dl className="mt-3 flex flex-col gap-1.5 text-xs text-ink-dim">
        {notes.map((n, i) => n && (
          <div key={i}>
            <dt className="inline font-semibold text-ink">{LABELS[i]} · </dt>
            <dd className="inline">{n}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default { title: '2 작업 기록/1 인트로 · 시안과 다듬기' }

const pad = (node) => <div className="p-6">{node}</div>
export const Original = { name: '3 원본 IntroScreen', render: () => pad(<Phone><IntroScreen onStart={() => {}} /></Phone>) }
export const Assembled = { name: '3 부품 조립본', render: () => pad(<Phone><IntroAssembled onStart={() => {}} /></Phone>) }
export const Compare = {
  name: '4 베리에이션 비교',
  render: () => (
    <div className="flex gap-8 p-6">
      <Column label="Before · 현재" notes={NOTES.Before}><IntroScreen onStart={() => {}} /></Column>
      <Column label="A · 봉투 한 장" notes={NOTES.A}><VariantA onStart={() => {}} /></Column>
      <Column label="B · 사용법 한 줄" notes={NOTES.B}><VariantB onStart={() => {}} /></Column>
      <Column label="C · 주소 라벨" notes={NOTES.C}><VariantC onStart={() => {}} /></Column>
    </div>
  ),
}

// 5단계 다듬기 — 선택안 A를 기준별로 하나씩
export const RefineSpacing = {
  name: '5 A 다듬기 ① 간격',
  render: () => (
    <div className="flex gap-8 p-6">
      <Column label="A · 다듬기 전" notes={['봉투 아래 보이는 간격 53px (코드 24 + 투명 여백 29)', '', '', '']}><VariantA onStart={() => {}} /></Column>
      <Column label="A · 간격 다듬은 후" notes={['봉투 아래 보이는 간격 24px', '', '', '']}><VariantA1 onStart={() => {}} /></Column>
    </div>
  ),
}

export const RefineEmphasis = {
  name: '5 A 다듬기 ② 강조',
  render: () => (
    <div className="flex gap-8 p-6">
      <Column label="① 간격 다듬은 후" notes={['보이는 봉투 폭 66px (제목 144px의 46%)']}><VariantA1 onStart={() => {}} /></Column>
      <Column label="② 강조 다듬은 후" notes={['보이는 봉투 폭 132px (제목 144px의 92%), 2배 정수 확대']}><VariantA2 onStart={() => {}} /></Column>
    </div>
  ),
}

// 제출용 — 3주차 과제 Before / After (docs: SUBMISSION-week3.md)
function Shot({ label, sub, children }) {
  return (
    <div style={{ width: 375 }}>
      <div className="mb-1 text-sm font-semibold text-ink">{label}</div>
      <div className="mb-2 text-xs text-ink-dim">{sub}</div>
      <Phone>{children}</Phone>
    </div>
  )
}

export const SubmitBeforeAfter = {
  name: '제출 · Before / After',
  render: () => (
    <div className="flex flex-col gap-6 bg-bg p-8" style={{ width: 920 }}>
      <div>
        <div className="text-base font-semibold text-ink">TO ME 인트로 화면 — Before / After</div>
        <div className="text-xs text-ink-dim">베리에이션 A(봉투 한 장) 선택 → 7가지 기준 중 간격·강조 적용</div>
      </div>
      <div className="flex gap-10">
        <Shot label="Before" sub="제목 + Start 버튼만. 무슨 앱인지 첫 화면에서 알 수 없음"><IntroScreen onStart={() => {}} /></Shot>
        <Shot label="After" sub="닫힌 편지 봉투 1장 추가 + 간격 정리"><VariantA1 onStart={() => {}} /></Shot>
      </div>
      <dl className="flex flex-col gap-2 text-xs text-ink-dim">
        <div><dt className="inline font-semibold text-ink">① 간격 · </dt><dd className="inline">봉투 그림 아래 투명 여백(29px) 때문에 봉투↔제목이 53px로 벌어져 있던 것을 보이는 기준 24px로. 봉투+제목이 한 덩어리, 버튼(40px)과는 구분.</dd></div>
        <div><dt className="inline font-semibold text-ink">② 강조 · </dt><dd className="inline">봉투를 키우지 않고 1배(보이는 폭 66px) 유지. 화면 유일한 색인 빨간 봉랍 + 주변 여백으로 시선을 먼저 끌고, 크기 위계는 "TO ME"가 주인공. (2배 132px도 시험 → 제목과 경쟁해서 제외)</dd></div>
      </dl>
    </div>
  ),
}

export const SubmitVariations = {
  name: '제출 · 베리에이션 A/B/C',
  render: () => (
    <div className="flex gap-8 bg-bg p-8">
      <Shot label="Before · 현재" sub="제목 + Start"><IntroScreen onStart={() => {}} /></Shot>
      <Shot label="A · 봉투 한 장 ✓ 선택" sub="그림 한 장으로 '편지' 앱임을 암시"><VariantA onStart={() => {}} /></Shot>
      <Shot label="B · 사용법 한 줄" sub="쓰기→보내기→도착→반송 흐름 요약"><VariantB onStart={() => {}} /></Shot>
      <Shot label="C · 주소 라벨" sub="편지 겉면처럼 FROM / TO"><VariantC onStart={() => {}} /></Shot>
    </div>
  ),
}

export const SubmitEmphasisTest = {
  name: '제출 · 강조 시험 (1배 vs 2배)',
  render: () => (
    <div className="flex gap-8 bg-bg p-8">
      <Shot label="1배 · 채택" sub="보이는 봉투 66px — 작지만 유일한 색으로 시선"><VariantA1 onStart={() => {}} /></Shot>
      <Shot label="2배 · 제외" sub="보이는 봉투 132px — 제목과 크기 경쟁"><VariantA2 onStart={() => {}} /></Shot>
    </div>
  ),
}
