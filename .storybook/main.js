

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  // TO ME 작업만 목록에 표시. AfterToday(src/storybook/*.stories.jsx 중 ToMe 외)·설치 예제(src/stories)는 파일만 보존
  "stories": [
    "../src/storybook/ToMe*.stories.@(js|jsx)"
  ],
  "addons": [
    "@storybook/addon-docs"
  ],
  "framework": "@storybook/react-vite",
  // 앱과 같은 public/ (갈무리 폰트·PixelLab 봉투 이미지) 사용
  "staticDirs": ["../public"]
};
export default config;