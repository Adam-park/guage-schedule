// TO ME 앱 흐름 — 인트로 → 온보딩 → 편지 작성 ↔ 배송 상태 목록(여기서 바로 배송 완료) / 반송함. 화면 넘김을 한 곳에 모음
// 2026-11-02 기능 줄이기: 편지 상세·반송 상세·주간 리마인드·마감 10분 뒤 알림 뺌 (화면 파일은 디자인 기록용으로 남김)
// 앱(main.jsx)과 Storybook(1 확정 화면 '앱 흐름')이 같은 코드를 씀. 편지는 이 기기 저장소(localStorage)
// 앱을 열 때: 처음 쓰는 사람 = 인트로 → 온보딩 → 편지 작성 / 이미 쓰는 사람의 그날 첫 실행 = 인트로 → 편지 작성(온보딩 건너뜀)
//   같은 날 다시 열면 인트로 없이 배송 상태 목록. 기록은 이 기기(localStorage)
// 배송 상태 목록을 이번에 처음 열 때: 하루 마무리(마지막 일정 +30분 지남, 하루 1회) → 목록
import { useState } from 'react'
import IntroScreen from './screens/IntroScreen.jsx'
import OnboardingScreen from './screens/OnboardingScreen.jsx'
import LetterWriteScreen from './screens/LetterWriteScreen.jsx'
import StatusScreen from './screens/StatusScreen.jsx'
import ReturnBinScreen from './screens/ReturnBinScreen.jsx'
import DayEnd, { shouldShowDayEnd, markDayEndShown } from './screens/DayEndScreen.jsx'
import { addLetter, loadLetters, todayLetters, nowMin, dateKey, DAILY_LIMIT } from './lib/letters.js'

const KEY_ONBOARDED = 'tome.onboarded'
const KEY_INTRO = 'tome.introShownOn'
const KEY_EXTRA = 'tome.extraOfferShown' // '하나 더 보낼 수 있어요' 안내를 본 적 있는지
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

// 목록 대신 먼저 보여줄 화면
const openingScreen = () => (shouldShowDayEnd(todayLetters(loadLetters()), nowMin()) ? 'day-end' : 'status')

// start: 'auto' = 위 규칙대로, 그 외('intro' 등) = 그 화면부터 (확인용)
export default function TomeApp({ start = 'auto' }) {
  const first = start === 'auto' ? (read(KEY_INTRO) === dateKey() ? 'status' : 'intro') : start
  const [opened, setOpened] = useState(first === 'status') // 이번에 목록을 열면서 확인을 마쳤는지
  const [writeNow, setWriteNow] = useState(false) // 목록의 '하나 더 보내기'로 편지 작성에 들어왔는지
  const [screen, setScreen] = useState(() => (first === 'status' ? openingScreen() : first))
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
      setScreen('status')
    }
    return <DayEnd day={day} onClose={close} />
  }
  if (screen === 'onboarding') {
    const done = () => {
      write(KEY_ONBOARDED, '1')
      setScreen('letter-write')
    }
    return <OnboardingScreen onDone={done} />
  }
  if (screen === 'letter-write') {
    // 하나 더 보내기 (2026-11-02): 기본 1통. 처음 1통 보낸 날만 "하나 더 보낼 수 있어요" 안내, 그 뒤로는 작은 '하나 더 보내기'만
    const extraOffer = read(KEY_EXTRA) ? 'later' : 'first'
    const send = (letter) => {
      addLetter(letter)
      if (extraOffer === 'first') write(KEY_EXTRA, '1') // 안내는 이번 한 번만
    }
    return <LetterWriteScreen sentDues={todayLetters(loadLetters()).map((l) => l.dueAt)} extraOffer={extraOffer} writeNow={writeNow} onSend={send} onExit={() => { setWriteNow(false); toStatus() }} />
  }
  if (screen === 'bin') return <ReturnBinScreen onBack={go('status')} />
  if (screen === 'status')
    return (
      <StatusScreen
        onWrite={() => {
          setWriteNow(true)
          setScreen('letter-write')
        }}
        onOpenBin={go('bin')}
      />
    )
  const startDay = () => {
    write(KEY_INTRO, dateKey())
    if (read(KEY_ONBOARDED) !== '1') return setScreen('onboarding')
    // 오늘 몫을 이미 다 보냈으면 목록으로
    if (todayLetters(loadLetters()).length >= DAILY_LIMIT) return toStatus()
    setScreen('letter-write')
  }
  return <IntroScreen onStart={startDay} />
}
