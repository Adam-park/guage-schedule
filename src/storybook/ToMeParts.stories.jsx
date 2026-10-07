// 2단계 Component 페이지 — 부품별 상태·긴 문구 확인
import { BrandTitle, PixelButton, PixelEnvelope } from './tome/parts.jsx'

const box = (Story) => (
  <div className="p-6">
    <div style={{ width: 343 }}>
      <Story />
    </div>
  </div>
)

export default {
  title: '2 작업 기록/1 인트로 · Component',
  decorators: [box],
}

export const Title = { name: 'BrandTitle · 기본', render: (a) => <BrandTitle {...a} />, args: { title: 'TO ME', tagline: '나를 완성하는 시간', showTagline: true } }
export const TitleNoTagline = { name: 'BrandTitle · 부제 숨김', render: (a) => <BrandTitle {...a} />, args: { showTagline: false } }
export const Button = { name: 'PixelButton · 기본', render: (a) => <PixelButton {...a} />, args: { label: 'Start' } }
export const ButtonLong = { name: 'PixelButton · 긴 문구', render: (a) => <PixelButton {...a} />, args: { label: '오늘 나에게 보낼 첫 번째 편지 쓰러 가기' } }
export const Envelope = { name: 'PixelEnvelope · 1배/2배', render: () => <div className="flex items-end gap-6"><PixelEnvelope scale={1} /><PixelEnvelope scale={2} /></div> }
