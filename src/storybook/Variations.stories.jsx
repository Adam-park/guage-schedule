// 베리에이션 A/B/C — AfterToday와 같은 목데이터·같은 토큰·같은 375px. 원본(AfterToday.jsx)은 건드리지 않음.
// 기준: CONCEPT.md Priority ① 마감 순간 상태 최우선 ② 재배송 경로 항상 보임 ③ 완료는 접어서
import { useState } from 'react'
import AfterToday from '../screens/AfterToday.jsx'
import ParcelCard from '../components/ParcelCard.jsx'
import { createMockParcels } from '../data/mockParcels.js'
import { getParcelPhase } from '../lib/parcelState.js'

// ---- 공통: 같은 목데이터 + 실제 상태 계산 (버튼 누르면 실제로 상태가 바뀜) ----
function useParcels() {
  const [parcels, setParcels] = useState(() => createMockParcels())
  const deliver = (id, wasReturned) =>
    setParcels((list) => list.map((p) => (p.id === id ? { ...p, deliveredAt: new Date(), wasReturned } : p)))
  const now = Date.now()
  const all = parcels.map((p) => ({ ...p, phase: getParcelPhase(p, now) })).sort((a, b) => a.deadline - b.deadline)
  return {
    all,
    due: all.filter((p) => p.phase === 'due'),
    scheduled: all.filter((p) => p.phase === 'scheduled'),
    returned: all.filter((p) => p.phase === 'returned'),
    done: all.filter((p) => p.phase === 'delivered' || p.phase === 'redelivered'),
    deliver,
  }
}

const hhmm = (d) => d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })

function DoneSummary({ done }) {
  if (done.length === 0) return null
  return (
    <details className="text-xs text-ink-faint">
      <summary className="cursor-pointer select-none">오늘 처리한 것 {done.length}개</summary>
      <div className="mt-2 flex flex-col gap-1.5">
        {done.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-md bg-surface-sunken px-3 py-1.5">
            <span className="truncate">{p.title}</span>
            <span className="font-semibold text-state-delivered">{p.phase === 'redelivered' ? '재배송 성공' : '배송 완료'}</span>
          </div>
        ))}
      </div>
    </details>
  )
}

// ---- A · 지금 하나에 집중 ----
// 처리할 카드만 카드로 크게, 나머지는 한 줄 목록으로 낮춤. 반송함은 상자 대신 목록 한 구역.
function VariantA() {
  const { due, scheduled, returned, done, deliver } = useParcels()
  return (
    <div className="flex flex-col gap-10 px-4 py-10">
      <section className="flex flex-col gap-2">
        <div className="text-xs font-semibold text-ink-faint">지금</div>
        {due.length === 0 && <div className="text-sm text-ink-dim">지금 처리할 소포가 없어요</div>}
        {due.map((p) => (
          <ParcelCard key={p.id} title={p.title} deadline={p.deadline} phase="due" onDeliver={() => deliver(p.id, false)} />
        ))}
      </section>

      {returned.length > 0 && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-dim">
            <span>반송함</span>
            <span className="tabular-nums">{returned.length}개</span>
          </div>
          {returned.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 border-b border-border py-2">
              <div className="min-w-0">
                <div className="text-xs text-ink-faint tabular-nums">{hhmm(p.deadline)}</div>
                <div className="truncate text-sm font-semibold text-ink">{p.title}</div>
              </div>
              <button
                type="button"
                onClick={() => deliver(p.id, true)}
                className="shrink-0 rounded-md border border-border bg-surface-sunken px-3 py-2 text-xs font-semibold text-ink active:scale-[.97]"
              >
                다시 보내기
              </button>
            </div>
          ))}
        </section>
      )}

      <section className="flex flex-col gap-2">
        <div className="text-xs font-semibold text-ink-faint">이후</div>
        {scheduled.map((p) => (
          <div key={p.id} className="flex items-center gap-3 text-sm text-ink-dim">
            <span className="text-xs text-ink-faint tabular-nums">{hhmm(p.deadline)}</span>
            <span className="truncate">{p.title}</span>
          </div>
        ))}
        <DoneSummary done={done} />
      </section>
    </div>
  )
}

// ---- B · 오늘 현황 먼저 ----
// 맨 위에 지금/반송함/예정 개수로 하루 상태를 한눈에. 반송 카드는 상자 안이 아니라 같은 높이로 나란히.
function VariantB() {
  const { due, scheduled, returned, done, deliver } = useParcels()
  const counts = [
    ['지금', due.length, 'text-state-due'],
    ['반송함', returned.length, 'text-state-returned'],
    ['예정', scheduled.length, 'text-ink-dim'],
  ]
  return (
    <div className="flex flex-col gap-4 px-4 py-10">
      <div className="grid grid-cols-3 rounded-lg border border-border">
        {counts.map(([label, n, color], i) => (
          <div key={label} className={`flex flex-col items-center gap-1 py-3 ${i > 0 ? 'border-l border-border' : ''}`}>
            <span className="text-xs text-ink-faint">{label}</span>
            <span className={`text-sm font-semibold tabular-nums ${color}`}>{n}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {due.map((p) => (
          <ParcelCard key={p.id} title={p.title} deadline={p.deadline} phase="due" onDeliver={() => deliver(p.id, false)} />
        ))}
        {returned.map((p) => (
          <ParcelCard
            key={p.id}
            title={p.title}
            deadline={p.deadline}
            phase="returned"
            actionLabel="다시 보내기"
            onDeliver={() => deliver(p.id, true)}
          />
        ))}
        {scheduled.map((p) => (
          <ParcelCard key={p.id} title={p.title} deadline={p.deadline} phase="scheduled" />
        ))}
      </div>

      <DoneSummary done={done} />
    </div>
  )
}

// ---- C · 시간순 한 줄 ----
// 하루를 시간 순서대로 한 목록에. 각 줄 오른쪽에 상태 도장. 처리할 줄만 펼쳐서 버튼을 붙임.
const STAMP = {
  due: ['배송 시도 중 → 나', 'text-state-due'],
  returned: ['반송됨', 'text-state-returned'],
  scheduled: ['예정', 'text-ink-faint'],
  delivered: ['배송 완료', 'text-state-delivered'],
  redelivered: ['재배송 성공', 'text-state-delivered'],
}

function VariantC() {
  const { all, deliver } = useParcels()
  return (
    <div className="flex flex-col gap-4 px-4 py-10">
      <div className="text-xs font-semibold text-ink-faint">오늘</div>
      <div className="flex flex-col">
        {all.map((p) => {
          const [stamp, color] = STAMP[p.phase]
          const actionable = p.phase === 'due' || p.phase === 'returned'
          const finished = p.phase === 'delivered' || p.phase === 'redelivered'
          return (
            <div
              key={p.id}
              className={`flex flex-col gap-2 border-b border-border py-3 ${p.phase === 'due' ? 'rounded-lg border border-border bg-surface px-4' : ''} ${finished ? 'opacity-60' : ''}`}
            >
              <div className="flex items-baseline gap-3">
                <span className="w-14 shrink-0 text-xs text-ink-faint tabular-nums">{hhmm(p.deadline)}</span>
                <span className={`min-w-0 flex-1 truncate text-sm ${actionable ? 'font-semibold text-ink' : 'text-ink-dim'}`}>
                  {p.title}
                </span>
                <span className={`shrink-0 text-xs font-semibold ${color}`}>{stamp}</span>
              </div>
              {actionable && (
                <button
                  type="button"
                  onClick={() => deliver(p.id, p.phase === 'returned')}
                  className="w-full rounded-md border border-border bg-surface-sunken py-2 text-xs font-semibold text-ink active:scale-[.97]"
                >
                  {p.phase === 'returned' ? '다시 보내기' : '배송 완료 처리'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---- 표시 틀: 375px 폰 프레임 + 옆 설명(서비스 화면 밖) ----
function Phone({ children }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-bg" style={{ width: 375, minHeight: 667 }}>
      {children}
    </div>
  )
}

const NOTES = {
  Before: {
    first: '"오늘" 아래 카드 3장이 거의 같은 무게로 나란히 보임',
    redeliver: '점선 상자 안의 카드 안에 있는 버튼 (상자 > 카드 > 버튼, 3겹)',
    plus: '지금 쓰는 화면이라 익숙함',
    minus: '처리할 카드와 예정 카드의 차이가 색 라벨·흐림 정도뿐',
  },
  A: {
    first: '"지금" 구역의 처리할 카드 한 장',
    redeliver: '반송함 구역의 각 줄 오른쪽 "다시 보내기" 버튼 (1겹)',
    plus: '열자마자 무엇을 처리할지 바로 보임. 예정 일정은 한 줄로 작아져 시선을 덜 뺏음',
    minus: '예정 일정이 카드가 아니라서 정보(시간)가 덜 눈에 띔',
  },
  B: {
    first: '맨 위 현황 숫자 (지금 1 · 반송함 1 · 예정 1)',
    redeliver: '반송 카드가 상자 없이 처리할 카드 바로 아래에 같은 크기로',
    plus: '하루 상태를 숫자로 한눈에. 반송 카드가 상자에 갇히지 않아 덜 숨겨짐',
    minus: '숫자 칸이 장식처럼 보일 수 있고, 카드 3장이 여전히 같은 크기',
  },
  C: {
    first: '시간 순서로 정리된 하루 전체 목록',
    redeliver: '반송된 줄 바로 아래 펼쳐진 "다시 보내기" 버튼',
    plus: '오늘 무슨 일이 언제 있었는지 흐름이 보임. 끝난 일도 제자리에 흐리게 남음',
    minus: '처리할 일이 목록 중간에 끼면 맨 위에 오지 않음 (Priority ① 약해질 수 있음)',
  },
}

function Notes({ n }) {
  return (
    <dl className="mt-3 flex flex-col gap-1.5 text-xs text-ink-dim" style={{ width: 375 }}>
      <div><dt className="inline font-semibold text-ink">먼저 보이는 것 · </dt><dd className="inline">{n.first}</dd></div>
      <div><dt className="inline font-semibold text-ink">다시 보내기 경로 · </dt><dd className="inline">{n.redeliver}</dd></div>
      <div><dt className="inline font-semibold text-ink">쉬워지는 점 · </dt><dd className="inline">{n.plus}</dd></div>
      <div><dt className="inline font-semibold text-ink">불편해질 점 · </dt><dd className="inline">{n.minus}</dd></div>
    </dl>
  )
}

function Column({ label, n, children }) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-ink">{label}</div>
      <Phone>{children}</Phone>
      <Notes n={n} />
    </div>
  )
}

function Compare() {
  return (
    <div className="flex gap-8 p-6">
      <Column label="Before · 현재" n={NOTES.Before}><AfterToday /></Column>
      <Column label="A · 지금 하나에 집중" n={NOTES.A}><VariantA /></Column>
      <Column label="B · 오늘 현황 먼저" n={NOTES.B}><VariantB /></Column>
      <Column label="C · 시간순 한 줄" n={NOTES.C}><VariantC /></Column>
    </div>
  )
}

export default {
  title: '4 Variation/AfterToday',
  component: Compare,
}

export const 비교 = { render: () => <Compare /> }
export const A_지금하나에집중 = { name: 'A · 지금 하나에 집중', render: () => <Column label="A · 지금 하나에 집중" n={NOTES.A}><VariantA /></Column> }
export const B_오늘현황먼저 = { name: 'B · 오늘 현황 먼저', render: () => <Column label="B · 오늘 현황 먼저" n={NOTES.B}><VariantB /></Column> }
export const C_시간순한줄 = { name: 'C · 시간순 한 줄', render: () => <Column label="C · 시간순 한 줄" n={NOTES.C}><VariantC /></Column> }
