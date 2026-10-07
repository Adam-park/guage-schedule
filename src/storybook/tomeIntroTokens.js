// TO ME 인트로(IntroScreen.jsx) 화면이 쓰는 토큰만 — 1단계 Foundation 확정 목록
// 원시값은 src/index.css @theme(및 Tailwind 기본 white)의 CSS 변수를 그대로 참조, 의미 토큰은 원시값을 가리킴.
// 기록: docs/tome-intro-state.json

export const PRIMITIVES = {
  'color/white': { cssVar: '--color-white', expect: '#ffffff', source: 'Tailwind 기본 테마 (text-white)' },
  'color/ink/900': { cssVar: '--color-ink', expect: '#15120d', source: 'index.css @theme' },
  'color/ink/600': { cssVar: '--color-ink-dim', expect: '#6e6656', source: 'index.css @theme' },
}

export const SEMANTIC = {
  'bg/page': { alias: 'color/white', usedBy: '화면 배경 (body background = --color-bg, 값 동일하지만 역할 토큰은 bg)', cssVar: '--color-bg' },
  'text/primary': { alias: 'color/ink/900', usedBy: '"TO ME" 제목', cssVar: '--color-ink' },
  'text/secondary': { alias: 'color/ink/600', usedBy: '"나를 완성하는 시간" 부제', cssVar: '--color-ink-dim' },
  'bg/action-primary': { alias: 'color/ink/900', usedBy: 'Start 버튼 배경 (bg-ink)', cssVar: '--color-ink' },
  'text/on-action': { alias: 'color/white', usedBy: 'Start 버튼 글자 (text-white)', cssVar: '--color-white' },
}

// 갈무리11은 Regular(400) 한 벌만 로드됨 (index.css @font-face)
export const TEXT_STYLES = {
  'pixel/display': { cls: 'font-pixel text-4xl tracking-[0.15em]', size: 36, weight: 400, lineHeight: '40px', letterSpacing: '0.15em (=5.4px)', usedBy: '"TO ME"' },
  'pixel/body': { cls: 'font-pixel text-sm', size: 14, weight: 400, lineHeight: '20px', letterSpacing: '0', usedBy: '부제, Start 버튼' },
}

export const SPACING = {
  'space/2': { px: 8, usedBy: '제목↔부제 (mt-2)' },
  'space/3-5': { px: 14, usedBy: '버튼 위아래 안쪽 여백 (py-3.5)', extension: true },
  'space/4': { px: 16, usedBy: '화면 좌우 여백 (px-4)' },
  'space/10': { px: 40, usedBy: '부제↔버튼 (mt-10)', extension: true },
}

// 베리에이션 B·C에서 새로 쓰는 값 — 전부 index.css @theme / Tailwind 기본 스케일에 이미 있는 값 (새로 지어낸 값 없음)
export const VARIATION_EXTENSIONS = {
  'border/default': '--color-border #e7e2d5 — B 단계칸 테두리, C 주소칸 테두리',
  'text/tertiary': '--color-ink-faint #a79f8c — B 화살표, C FROM/TO 라벨',
  'pixel/caption': 'font-pixel text-xs 12px/16px — B 단계칸, C 라벨',
  'radius/md': '6px — B 단계칸',
  'space': '4(gap-1·py-1) · 8(px-2) · 24(px-6·mt-6) · 32(mt-8·py-8) — B·C 배치',
}

export const RADIUS = {
  'radius/lg': { px: 8, usedBy: 'Start 버튼 (rounded-lg)' },
}
