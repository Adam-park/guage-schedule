// 3단계 Screen — 실제 AfterToday 화면을 375px 모바일 폭으로 (과제 Before)
import AfterToday from '../screens/AfterToday.jsx'

const mobile375 =(Story) => (
  <div className="p-6">
    <div className="overflow-hidden rounded-lg border border-border bg-bg" style={{ width: 375, minHeight: 667 }}>
      <Story />
    </div>
  </div>
)

export default {
  title: '3 Screen/AfterToday',
  component: AfterToday,
  decorators: [mobile375],
}

export const Before = { name: '현재 화면 (Before)' }
