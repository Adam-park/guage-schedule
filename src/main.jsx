import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ComparePage from './ComparePage.jsx'
import IntroScreen from './screens/IntroScreen.jsx'
import OnboardingScreen from './screens/OnboardingScreen.jsx'
import PhotoSetupScreen from './screens/PhotoSetupScreen.jsx'
import MeBookScreen from './screens/MeBookScreen.jsx'
import LetterPreviewScreen from './screens/LetterPreviewScreen.jsx'
import LetterWriteScreen from './screens/LetterWriteScreen.jsx'
import BeforeRunner from './screens/BeforeRunner.jsx'
import AfterToday from './screens/AfterToday.jsx'

// ?compare=1 → 05 비교 페이지, ?screen=intro/onboarding → 새 화면 미리보기. 기본 주소(App)는 그대로 유지 (원본 보존)
const params = new URLSearchParams(window.location.search)
const isCompare = params.get('compare') === '1'
const screen = params.get('screen')

let content = <App />
if (isCompare) content = <ComparePage />
else if (screen === 'intro') content = <IntroScreen onStart={() => alert('Start 눌림 (다음 화면은 아직 없음)')} />
else if (screen === 'onboarding') content = <OnboardingScreen />
else if (screen === 'photo') content = <PhotoSetupScreen />
else if (screen === 'me') content = <MeBookScreen />
else if (screen === 'letter-preview') content = <LetterPreviewScreen />
else if (screen === 'letter-write') content = <LetterWriteScreen />
else if (screen === 'before-runner') content = <BeforeRunner />
else if (screen === 'after-today') content = <AfterToday />

createRoot(document.getElementById('root')).render(<StrictMode>{content}</StrictMode>)
