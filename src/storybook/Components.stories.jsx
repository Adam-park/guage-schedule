// 2단계 Component — 앱이 실제로 쓰는 부품 코드를 그대로 불러와서 상태별로 보여줌
import ParcelCard from '../components/ParcelCard.jsx'
import ReturnBin from '../components/ReturnBin.jsx'

const at = (h, m) => {
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d
}

// 375px 화면에서 카드가 차지하는 실제 폭(좌우 16px 여백 제외) = 343px
const width343 = (Story) => (
  <div className="p-6">
    <div style={{ width: 343 }}>
      <Story />
    </div>
  </div>
)

export default {
  title: '2 Component/ParcelCard',
  component: ParcelCard,
  decorators: [width343],
  args: { onDeliver: () => {} },
}

export const Due = {
  name: '배송 시도 중 (due)',
  args: { title: '팀 회의 자료 공유', deadline: at(18, 37), phase: 'due' },
}

export const Scheduled = {
  name: '예정 (scheduled)',
  args: { title: '치과 예약', deadline: at(20, 10), phase: 'scheduled' },
}

export const Returned = {
  name: '반송됨 (returned)',
  args: { title: '어제 미룬 보고서 초안', deadline: at(13, 40), phase: 'returned', actionLabel: '다시 보내기' },
}

export const LongTitle = {
  name: '긴 제목 확인',
  args: { title: '다음 주 발표 자료 최종본 정리해서 팀 채널에 공유하고 피드백 요청하기', deadline: at(18, 37), phase: 'due' },
}

export const ReturnBinBox = {
  name: '반송함 상자 (ReturnBin)',
  render: () => (
    <ReturnBin
      items={[{ id: 'p3', title: '어제 미룬 보고서 초안', deadline: at(13, 40) }]}
      onRedeliver={() => {}}
    />
  ),
}
