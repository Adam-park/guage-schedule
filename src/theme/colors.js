// design.md 1.1의 색 토큰과 반드시 같은 값을 유지할 것 — 진짜 원본은 src/index.css의 @theme 블록.
// 이 파일은 CSS 변수를 못 읽는 곳(Pyre.jsx의 Three.js)에서만 쓴다. 값 하나를 두 번 타이핑하지 않으려고
// 만든 단일 출처 — 색 바꿀 땐 여기랑 index.css 딱 두 곳만 고치면 됨.
export const EMBER = {
  soot: '#15110C', // --color-pit
  deep: '#E8380D', // --color-ember-1
  core: '#FF5A1F', // --color-ember-2
  gold: '#FFB800', // --color-ember-3
}
