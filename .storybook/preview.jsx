// 앱과 같은 Tailwind 토큰(@theme)·글꼴을 Storybook에도 적용
import '../src/index.css'

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    layout: 'fullscreen',
    // 왼쪽 목록 순서: 확정 화면(흐름 순) → 작업 기록(화면 순)
    options: {
      storySort: {
        order: [
          '1 확정 화면',
          '2 작업 기록',
          ['0 앱 화면 (현재 코드)', '1 인트로 · Foundation', '1 인트로 · Component', '1 인트로 · 시안과 다듬기', '2 온보딩 시안', '3 편지 작성 시안', '4 배송 상태 시안', '5 하루 마무리 시안'],
        ],
      },
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;
