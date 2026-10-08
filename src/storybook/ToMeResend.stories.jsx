// 반송함 '다시 보내기' 시안 (2026-10-09) — 앱 반영 전. 각 화면에서 직접 눌러 보기, 처음부터 보려면 '다시 보기'
// 온보딩 안내: "해내지 못한 편지는 반송함으로 돌아와요. 다시 해내면 언제든 다시 보낼 수 있어요."
import { useState } from 'react'
import PixelEnvelope from '../components/tome/PixelEnvelope.jsx'
import EnvelopeArt from '../components/tome/EnvelopeArt.jsx'
import LetterWriteScreen from '../screens/LetterWriteScreen.jsx'
import { ReturnBinList, returnMessage } from '../screens/ReturnBinScreen.jsx'
import { Frame } from '../screens/StatusScreen.jsx'
import { hhmm } from '../lib/letters.js'
import { MOCK_RETURNED } from './tome/status.jsx'

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
      <div className="overflow-hidden rounded-lg bg-bg" style={{ width: 375, height: 667, outline: '1px solid var(--color-border)' }}>
        <div key={k} className="h-full">
          {children}
        </div>
      </div>
    </div>
  )
}

const LETTER = MOCK_RETURNED[0] // 어제 11:00 '보고서 초안 쓰기'

// 반송 상세 + 아래 버튼 (봉투 크기·위치 = 확정 상세와 동일, 버튼 = '배송 완료?'와 같은 모양)
function DetailWithButton({ label, onClick, disabled, note }) {
  return (
    <div className="relative mx-auto flex min-h-full max-w-[440px] flex-col items-center px-6 pt-6">
      <span className="font-pixel absolute top-1 left-1/2 flex h-11 -translate-x-1/2 items-center text-sm text-ink">반송 편지1</span>
      <span className="font-pixel absolute top-1 left-1 flex h-11 w-11 items-center justify-center text-sm text-ink-dim">←</span>
      <div className="relative shrink-0" style={{ width: 288, height: 336 }}>
        <PixelEnvelope scale={3} />
      </div>
      <div className="font-pixel mt-2 flex w-full flex-col items-center gap-3 text-center">
        <span className="text-base text-ink">{LETTER.title}</span>
        <p className="text-xs leading-relaxed text-ink-dim">{returnMessage(LETTER)}</p>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={`mt-1 w-full rounded-lg py-3.5 text-sm text-white transition-transform active:scale-[.98] ${disabled ? 'bg-ink-faint' : 'bg-ink'}`}
        >
          {label}
        </button>
        {note && <span className="text-xs text-ink-faint">{note}</span>}
      </div>
    </div>
  )
}

// A · 새 시간으로 다시 보내기: 상세 '다시 보내기' → 편지 작성(할 일 미리 채움, 시간만 새로)
function ResendA() {
  const [writing, setWriting] = useState(false)
  return writing ? <LetterWriteScreen initialTitle={LETTER.title} onExit={() => setWriting(false)} /> : <DetailWithButton label="다시 보내기" onClick={() => setWriting(true)} />
}

// B · 해냈다고 표시: 상세 '해냈어요' → '배송 완료!' (시간 다시 안 정함)
function ResendB() {
  const [done, setDone] = useState(false)
  return <DetailWithButton label={done ? '배송 완료!' : '해냈어요'} onClick={() => setDone(true)} disabled={done} />
}

// A + 하루 3통에 포함할 때, 오늘 이미 3통을 보낸 날
function ResendAFull() {
  return <DetailWithButton label="다시 보내기" disabled note="오늘 편지 3통을 모두 보냈어요." />
}

// C · 반송함 목록 각 줄 오른쪽에 '다시' 버튼
function ResendC() {
  const [writing, setWriting] = useState(null)
  if (writing) return <LetterWriteScreen initialTitle={writing} onExit={() => setWriting(null)} />
  const groups = [
    { label: '오늘', items: MOCK_RETURNED.filter((l) => !l.dayOffset) },
    { label: ((d) => `${d.getMonth() + 1}월 ${d.getDate()}일`)(new Date(Date.now() - 86400000)), items: MOCK_RETURNED.filter((l) => l.dayOffset) }, // 실제 반송함과 같은 날짜 표기
  ]
  return (
    <div className="relative h-full">
      <span className="font-pixel absolute top-1 left-1 z-20 flex h-11 w-11 items-center justify-center text-sm text-ink-dim">←</span>
      <Frame>
        <div className="font-pixel flex items-baseline justify-between pl-8">
          <span className="text-sm text-ink">반송함</span>
          <span className="text-xs text-ink-dim tabular-nums">{MOCK_RETURNED.length}통</span>
        </div>
        {groups.map((g) => (
          <section key={g.label} className="flex flex-col gap-1">
            <h3 className="font-pixel text-xs text-ink-dim">{g.label}</h3>
            {g.items.map((l) => (
              <div key={l.id} className="-mx-2 flex items-center gap-4 px-2 py-2">
                <EnvelopeArt />
                <div className="font-pixel flex min-w-0 flex-1 items-baseline justify-between gap-2">
                  <span className="truncate text-sm text-ink">{l.title}</span>
                  <span className="shrink-0 text-xs text-ink-dim tabular-nums">{hhmm(l.dueAt)}</span>
                </div>
                <button type="button" onClick={() => setWriting(l.title)} className="font-pixel shrink-0 rounded-md border-2 border-ink px-2.5 py-1.5 text-xs text-ink active:scale-[.97]">
                  다시
                </button>
              </div>
            ))}
          </section>
        ))}
      </Frame>
    </div>
  )
}

export default { title: '2 작업 기록/6 다시 보내기 시안' }

export const Compare = {
  name: '시안 비교',
  render: () => (
    <div className="flex flex-wrap gap-8 p-6">
      <Phone label="지금 · 반송함 목록" sub="편지를 누르면 상세 (버튼 없음)">
        <ReturnBinList letters={MOCK_RETURNED} />
      </Phone>
      <Phone label="A · 새 시간으로 다시 보내기" sub="상세 아래 버튼 → 편지 작성(할 일 채워짐, 시간만 새로)">
        <ResendA />
      </Phone>
      <Phone label="A · 오늘 3통 다 보낸 날" sub="3통에 포함할 때: 버튼 흐리게 + 안내">
        <ResendAFull />
      </Phone>
      <Phone label="B · 해냈다고 표시" sub="상세 아래 버튼 → 바로 '배송 완료!'">
        <ResendB />
      </Phone>
      <Phone label="C · 목록에서 바로" sub="줄마다 '다시' 버튼 → 편지 작성">
        <ResendC />
      </Phone>
    </div>
  ),
}

// ---- A안 확정 후 버튼 모양 비교 (2026-10-09) — 누르면 모두 편지 작성(할 일 채워짐)으로 ----
// 1 테두리 버튼(주간 리마인드 '반송함 보기'와 같은 모양) / 2 오른쪽 위 작은 글자 / 3 문구 아래 밑줄 글자 / 4 검은 버튼 + 글자만 바꿈
function StyleDetail({ variant, onResend }) {
  return (
    <div className="relative mx-auto flex min-h-full max-w-[440px] flex-col items-center px-6 pt-6">
      <span className="font-pixel absolute top-1 left-1/2 flex h-11 -translate-x-1/2 items-center text-sm text-ink">반송 편지1</span>
      <span className="font-pixel absolute top-1 left-1 flex h-11 w-11 items-center justify-center text-sm text-ink-dim">←</span>
      {variant === 2 && (
        <button type="button" onClick={onResend} className="font-pixel absolute top-1 right-1 z-10 flex h-11 items-center gap-1 px-3 text-xs text-ink-dim active:scale-[.97]">
          다시 보내기 <span aria-hidden>→</span>
        </button>
      )}
      <div className="relative shrink-0" style={{ width: 288, height: 336 }}>
        <PixelEnvelope scale={3} />
      </div>
      <div className="font-pixel mt-2 flex w-full flex-col items-center gap-3 text-center">
        <span className="text-base text-ink">{LETTER.title}</span>
        <p className="text-xs leading-relaxed text-ink-dim">{returnMessage(LETTER)}</p>
        {variant === 1 && (
          <button type="button" onClick={onResend} className="mt-1 w-full rounded-lg bg-ink-faint py-3.5 text-sm text-white active:scale-[.98]">
            다시 보내기
          </button>
        )}
        {variant === 3 && (
          <button type="button" onClick={onResend} className="flex h-11 items-center px-3 text-xs text-ink underline underline-offset-4 active:scale-[.97]">
            다시 보내기
          </button>
        )}
        {variant === 4 && (
          <button type="button" onClick={onResend} className="mt-1 w-full rounded-lg bg-ink py-3.5 text-sm text-white active:scale-[.98]">
            다른 시간에 다시 보내기
          </button>
        )}
      </div>
    </div>
  )
}
function StyleFlow({ variant }) {
  const [writing, setWriting] = useState(false)
  return writing ? <LetterWriteScreen initialTitle={LETTER.title} onExit={() => setWriting(false)} /> : <StyleDetail variant={variant} onResend={() => setWriting(true)} />
}

export const ButtonStyles = {
  name: '버튼 모양 비교 (A안)',
  render: () => (
    <div className="flex flex-wrap gap-8 p-6">
      <Phone label="1 · 회색 버튼" sub="회색(ink-faint, 시안 비교 A안 회색 버튼과 같은 색) 바탕 + 흰 글자, 테두리 없음">
        <StyleFlow variant={1} />
      </Phone>
      <Phone label="2 · 오른쪽 위 작은 글자" sub="왼쪽 위 ← 와 대칭 자리">
        <StyleFlow variant={2} />
      </Phone>
      <Phone label="3 · 밑줄 글자" sub="반송 문구 바로 아래, 버튼 없이">
        <StyleFlow variant={3} />
      </Phone>
      <Phone label="4 · 글자만 바꾸기" sub="검은 버튼 그대로, '다른 시간에 다시 보내기'">
        <StyleFlow variant={4} />
      </Phone>
    </div>
  ),
}
