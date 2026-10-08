// 표현 위치 한눈에 (2026-10-09) — '배송 / 보내기 / 도착' 이 실제 화면 어디에 나오는지. 실제 앱 화면 그대로 + 단어에 형광펜
import { useEffect, useRef } from 'react'
import OnboardingScreen from '../screens/OnboardingScreen.jsx'
import LetterWriteScreen from '../screens/LetterWriteScreen.jsx'
import { StatusList } from '../screens/StatusScreen.jsx'
import { LetterDetail } from '../screens/LetterDetailScreen.jsx'
import DayEnd from '../screens/DayEndScreen.jsx'
import WeeklyReminder from '../screens/WeeklyScreen.jsx'
import { MOCK_LETTERS } from './tome/status.jsx'
import { MOCK_DAY } from './tome/dayend.jsx'

const WORDS = [
  ['배송', '#fde68a'],
  ['보내', '#bfdbfe'],
  ['도착', '#bbf7d0'],
]
const RE = new RegExp(`(${WORDS.map((w) => w[0]).join('|')})`, 'g')

// 화면이 그려진 뒤 글자 속 '배송·보내·도착'에 형광펜 (보기용, 화면 동작엔 영향 없음)
function Marked({ children }) {
  const ref = useRef(null)
  useEffect(() => {
    const mark = () => {
      const walker = document.createTreeWalker(ref.current, NodeFilter.SHOW_TEXT)
      const nodes = []
      while (walker.nextNode()) if (RE.test(walker.currentNode.nodeValue) && walker.currentNode.parentElement.tagName !== 'MARK') nodes.push(walker.currentNode)
      nodes.forEach((n) => {
        const frag = document.createDocumentFragment()
        n.nodeValue.split(RE).forEach((part) => {
          const w = WORDS.find((x) => x[0] === part)
          if (!w) return part && frag.appendChild(document.createTextNode(part))
          const m = document.createElement('mark')
          m.textContent = part
          m.style.background = w[1]
          m.style.color = '#15120d' // 흰 글자 버튼 위에서도 읽히게
          frag.appendChild(m)
        })
        n.replaceWith(frag)
      })
    }
    const t = setTimeout(mark, 600)
    return () => clearTimeout(t)
  }, [])
  return (
    <div ref={ref} className="overflow-hidden rounded-lg bg-bg" style={{ width: 375, height: 667, outline: '1px solid var(--color-border)' }}>
      {children}
    </div>
  )
}
function Item({ n, where, children }) {
  return (
    <div className="flex flex-col gap-2" style={{ width: 375 }}>
      <span className="text-sm font-semibold text-ink">
        {n}. {where}
      </span>
      <Marked>{children}</Marked>
    </div>
  )
}

const L1 = MOCK_LETTERS[0] // 편지1 마감 15:00
const NOW_STEPS_ONB = undefined // 온보딩은 지금 코드 문장 그대로

export default { title: '2 작업 기록/8 표현 위치 한눈에' }

export const WordMap = {
  name: '배송 · 보내기 · 도착 위치',
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex gap-4 text-sm">
        {WORDS.map(([w, c]) => (
          <span key={w}>
            <mark style={{ background: c }}>{w}</mark>
          </span>
        ))}
        <span className="text-ink-dim">— 실제 앱 화면 그대로, 단어만 형광펜</span>
      </div>
      <div className="flex flex-wrap gap-8">
        <Item n={1} where="온보딩 4번째">
          <OnboardingScreen steps={NOW_STEPS_ONB} initialStep={3} />
        </Item>
        <Item n={2} where="온보딩 5번째">
          <OnboardingScreen steps={NOW_STEPS_ONB} initialStep={4} />
        </Item>
        <Item n={3} where="편지 작성 — 버튼">
          <LetterWriteScreen />
        </Item>
        <Item n={4} where="편지 작성 — 3통 다 보낸 뒤 안내">
          <LetterWriteScreen sentDues={[1439, 1439, 1439]} />
        </Item>
        <Item n={5} where="배송 상태 목록 — 마감 20분 전 알림">
          <StatusList letters={MOCK_LETTERS} now={L1.dueAt - 15} doneIds={[]} />
        </Item>
        <Item n={6} where="배송 상태 목록 — 마감 시간 지남(안 누름) + 10분 뒤 알림">
          <StatusList letters={MOCK_LETTERS} now={L1.dueAt + 12} doneIds={[]} />
        </Item>
        <Item n={7} where="편지 상세 — 마감 시간 지남">
          <LetterDetail letter={L1} number={1} now={L1.dueAt + 5} doneIds={[]} notices={[]} />
        </Item>
        <Item n={8} where="편지 상세 — 누른 뒤">
          <LetterDetail letter={L1} number={1} now={L1.dueAt + 5} doneIds={[L1.id]} notices={[]} />
        </Item>
        <Item n={9} where="하루 마무리">
          <DayEnd day={MOCK_DAY} />
        </Item>
        <Item n={10} where="주간 리마인드">
          <WeeklyReminder arrived={5} waiting={2} />
        </Item>
      </div>
    </div>
  ),
}
