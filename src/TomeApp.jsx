// TO ME 앱 흐름 — 인트로 → 온보딩 → 편지 작성 ↔ 배송 상태 목록 ↔ 편지 상세 / 반송함. 화면 넘김을 한 곳에 모음
// 앱(main.jsx)과 Storybook(1 확정 화면 '앱 흐름')이 같은 코드를 씀. 편지는 이 기기 저장소(localStorage)
// 앱을 열 때: 처음 쓰는 사람 = 인트로 → 온보딩 → 편지 작성 / 이미 쓰는 사람의 그날 첫 실행 = 인트로 → 편지 작성(온보딩 건너뜀)
//   같은 날 다시 열면 인트로 없이 배송 상태 목록. 기록은 이 기기(localStorage)
// 배송 상태 목록을 이번에 처음 열 때 순서: ① 하루 마무리(마지막 일정 +30분 지남, 하루 1회) → ② 주간 리마인드(7일 지남, 최근 7일 도착 1통 이상) → 목록
import { useState } from 'react'
import IntroScreen from './screens/IntroScreen.jsx'
import OnboardingScreen from './screens/OnboardingScreen.jsx'
import LetterWriteScreen from './screens/LetterWriteScreen.jsx'
import StatusScreen from './screens/StatusScreen.jsx'
import LetterDetailScreen from './screens/LetterDetailScreen.jsx'
import ReturnBinScreen from './screens/ReturnBinScreen.jsx'
import DayEnd, { shouldShowDayEnd, markDayEndShown } from './screens/DayEndScreen.jsx'
import WeeklyReminder, { checkWeeklyReminder, markWeeklyShown } from './screens/WeeklyScreen.jsx'
import { addLetter, loadLetters, todayLetters, returnedLetters, nowMin, dateKey } from './lib/letters.js'

const KEY_ONBOARDED = 'tome.onboarded'
const KEY_INTRO = 'tome.introShownOn'
const read = (k) => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const write = (k, v) => {
  try {
    localStorage.setItem(k, v)
  } catch {
    // 저장소를 못 쓰는 환경: 기록 없이 진행
  }
}

// 최근 7일(오늘 포함) 배송 완료 통수
const weekArrived = (all, d = new Date()) => {
  const from = dateKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 6))
  return all.filter((l) => l.done && l.date >= from).length
}
// 주간 리마인드를 띄울지 (앱을 열 때마다 확인해야 '처음 쓴 날'이 기록됨)
const weeklyDue = () => checkWeeklyReminder() && weekArrived(loadLetters()) > 0
// 목록 대신 먼저 보여줄 화면
const openingScreen = () => (shouldShowDayEnd(todayLetters(loadLetters()), nowMin()) ? 'day-end' : weeklyDue() ? 'weekly' : 'status')

// start: 'auto' = 위 규칙대로, 그 외('intro' 등) = 그 화면부터 (확인용)
export default function TomeApp({ start = 'auto' }) {
  const first = start === 'auto' ? (read(KEY_INTRO) === dateKey() ? 'status' : 'intro') : start
  const [opened, setOpened] = useState(first === 'status') // 이번에 목록을 열면서 확인을 마쳤는지
  const [screen, setScreen] = useState(() => (first === 'status' ? openingScreen() : first))
  const [sel, setSel] = useState(0) // 상세로 연 편지 (오늘 몇 번째)
  const go = (next) => () => setScreen(next)
  const toStatus = () => {
    if (opened) return setScreen('status')
    setOpened(true)
    setScreen(openingScreen())
  }

  if (screen === 'day-end') {
    const day = todayLetters(loadLetters()).map((l) => ({ ...l, result: l.done ? 'done' : 'returned' }))
    const close = () => {
      markDayEndShown()
      setScreen(weeklyDue() ? 'weekly' : 'status')
    }
    return <DayEnd day={day} onClose={close} />
  }
  if (screen === 'weekly') {
    const all = loadLetters()
    const close = (next) => () => {
      markWeeklyShown()
      setScreen(next)
    }
    return <WeeklyReminder arrived={weekArrived(all)} waiting={returnedLetters(all).length} onOpenBin={close('bin')} onClose={close('status')} />
  }
  if (screen === 'onboarding') {
    const done = () => {
      write(KEY_ONBOARDED, '1')
      setScreen('letter-write')
    }
    return <OnboardingScreen onDone={done} />
  }
  if (screen === 'letter-write')
    return <LetterWriteScreen sentDues={todayLetters(loadLetters()).map((l) => l.dueAt)} onSend={addLetter} onExit={toStatus} />
  if (screen === 'bin') return <ReturnBinScreen onBack={go('status')} />
  if (screen === 'detail') return <LetterDetailScreen index={sel} onBack={go('status')} />
  if (screen === 'status')
    return (
      <StatusScreen
        onWrite={go('letter-write')}
        onOpenBin={go('bin')}
        onSelect={(i) => {
          setSel(i)
          setScreen('detail')
        }}
      />
    )
  const startDay = () => {
    write(KEY_INTRO, dateKey())
    if (read(KEY_ONBOARDED) !== '1') return setScreen('onboarding')
    // 오늘 3통을 이미 다 보냈으면 목록으로
    if (todayLetters(loadLetters()).length >= 3) return toStatus()
    setScreen('letter-write')
  }
  return <IntroScreen onStart={startDay} />
}
