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

// ?compare=1 → 05 비교 페이지, ?screen=intro/onboarding → 새 화면 미리보기. 기본 주소(App)는 그대로 유지 (원본 보존)
const params = new URLSearchParams(window.location.search)
const isCompare = params.get('compare') === '1'
const screen = params.get('screen')

// TO ME 흐름 (?screen=tome = 실제처럼 규칙대로 시작, ?screen=intro/onboarding/letter-write/status = 그 화면부터): src/TomeApp.jsx
const TOME = ['intro', 'onboarding', 'letter-write', 'status']

let content = <App />
if (isCompare) content = <ComparePage />
else if (screen === 'tome') content = <TomeApp />
else if (TOME.includes(screen)) content = <TomeApp start={screen} />
else if (screen === 'photo') content = <PhotoSetupScreen />
else if (screen === 'me') content = <MeBookScreen />
else if (screen === 'letter-preview') content = <LetterPreviewScreen />
else if (screen === 'before-runner') content = <BeforeRunner />
else if (screen === 'after-today') content = <AfterToday />

createRoot(document.getElementById('root')).render(<StrictMode>{content}</StrictMode>)
