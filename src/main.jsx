import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ComparePage from './ComparePage.jsx'
import TomeApp from './TomeApp.jsx'
import PhotoSetupScreen from './screens/PhotoSetupScreen.jsx'
import MeBookScreen from './screens/MeBookScreen.jsx'
import LetterPreviewScreen from './screens/LetterPreviewScreen.jsx'
import BeforeRunner from './screens/BeforeRunner.jsx'
import AfterToday from './screens/AfterToday.jsx'

// ?compare=1 → 05 비교 페이지, ?screen=... → 각 화면 미리보기 (옛 화면들도 디자인 과정 기록용으로 보존)
const params = new URLSearchParams(window.location.search)
const isCompare = params.get('compare') === '1'
const screen = params.get('screen')

// 기본 주소 = TO ME (2026-10-09). 옛 Day Battery 달력은 ?screen=day-battery — 디자인 진행 과정 기록용으로 보존
// TO ME 흐름 (기본 주소·?screen=tome = 실제처럼 규칙대로 시작, ?screen=intro/onboarding/letter-write/status = 그 화면부터): src/TomeApp.jsx
const TOME = ['intro', 'onboarding', 'letter-write', 'status']

let content = <TomeApp />
if (isCompare) content = <ComparePage />
else if (screen === 'day-battery') content = <App />
else if (TOME.includes(screen)) content = <TomeApp start={screen} />
else if (screen === 'photo') content = <PhotoSetupScreen />
else if (screen === 'me') content = <MeBookScreen />
else if (screen === 'letter-preview') content = <LetterPreviewScreen />
else if (screen === 'before-runner') content = <BeforeRunner />
else if (screen === 'after-today') content = <AfterToday />

createRoot(document.getElementById('root')).render(<StrictMode>{content}</StrictMode>)
