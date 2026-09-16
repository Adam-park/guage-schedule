# Day Battery — 디자인 스펙 (design.md)

> 이 문서는 컨셉 재설계([SESSION-RULES.md](./SESSION-RULES.md) "재기획 진행 중" + 메모리 `day-battery-concept-pivot`)를 화면·컴포넌트 레벨로 구체화한 것.
> 색·타입·컴포넌트 경계는 여기가 기준. 바꿀 땐 이 파일부터 고치고, 코드는 그다음.
> Artifact로 통째로 다시 그리는 건 그만 — 이 문서 기준으로 컴포넌트 단위로 고친다.
> **모바일 우선.** 이 앱은 폰에서 짧게 여러 번 열어보는 용도 — 데스크탑 너비는 "안 깨지면 됨" 수준, 실제 기준은 폰 화면. (2026-09-15 갱신)

---

## 0. 이 문서가 대체하는 것

- `src/App.jsx`의 "월간 달력 6주 그리드" 화면 → **폐기**. 메인 화면은 오늘 DayCell(전체 주인공) + 내일 DayCell(축소/ghost) 두 개.
- `src/lib/battery.js`의 "일정마다 배터리 % 계산" → **폐기**. 개별 일정은 더 이상 각자 배터리를 안 가짐.
- `src/theme/colors.js`의 3단계(calm/warn/urgent) + frozen 색 모델 → **폐기**. 단일 불꽃(Hearth) 하나로 통합.
- 대체하는 것: 불꽃 게이지(Hearth) + 일정 카드(ScheduleCard) + 카드를 태워서 불씨를 올리는 인터랙션.

---

## 1. 디자인 토큰

### 1.1 색 — 비비드 버전

라이트 배경 고정 (어두운 밤색·글로우 히어로 없음 — 확정됨). 액센트는 확실히 채도 높게 — **덱빌딩 게임 카드·불꽃이라는 비주얼 자체가 게임적이라, 여기서 채도를 낮추면 오히려 어중간해짐. 비비드 유지가 방침.**

| 토큰 | 값 | 용도 |
|---|---|---|
| `--bg` | `#FFFFFF` | 페이지 배경 |
| `--surface` | `#FFFFFF` | 카드/패널 배경 |
| `--surface-sunken` | `#F6F4EF` | 살짝 들어간 영역(ghost 카드 등) |
| `--border` | `#E7E2D5` | 헤어라인 |
| `--ink` | `#15120D` | 본문 텍스트 (완전 검정 아님) |
| `--ink-dim` | `#6E6656` | 보조 텍스트 |
| `--ink-faint` | `#A79F8C` | 캡션/타임스탬프 |
| `--ember-1` | `#E8380D` | 불꽃 딥(그라디언트 안쪽) |
| `--ember-2` | `#FF5A1F` | 불꽃 코어 — **메인 액센트** |
| `--ember-3` | `#FFB800` | 불꽃 골드(팁) |
| `--pit` | `#15110C` | 불씨 구덩이 내부 (글로우 대비용, 유일하게 진한 색) |
| `--pit-ring` | `#D9CDA9` | 불씨 구덩이 테두리 (연한 톤 — `--pit`과 구분돼야 원 모양이 보임) |
| `--rain` | `#0EA5E9` | 시련(날씨) 계열 — 추후용, semantic |
| `--buff` | `#FFD23F` | "그대로 하기" 버프 순간 강조 — semantic |

규칙: `--ember-*`는 불꽃/카드 값 표시에만. `--rain`/`--buff`는 상태 표시 전용이라 액센트로 안 씀(따로 구분).

### 1.2 타이포

- **시스템 폰트 스택만 사용** — 웹폰트 추가 로딩 없음 (실용 웹앱 우선 원칙, 전역 CLAUDE.md 8번).
  `-apple-system, BlinkMacSystemFont, "Segoe UI", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif`
- 위계는 폰트가 아니라 **굵기(500/600/700) + 크기**로만 표현.
- 숫자(레벨 %, 카드 값)는 `font-variant-numeric: tabular-nums`.

### 1.3 간격 / 반경

- radius: `8px` 고정 (달력칸 느낌 유지 — 앱 카드처럼 과하게 둥글지 않게)
- gap 스케일: `4 / 8 / 12 / 16 / 24px`

### 1.4 Tailwind 매핑

프로젝트가 이미 Tailwind v4라 위 토큰은 `tailwind.config`나 `@theme` 블록에 CSS 변수로 등록해서 `bg-[--ember-2]` 식으로 쓰거나, `@theme` 확장으로 `bg-ember-core` 같은 유틸을 만든다. 하드코딩 hex를 컴포넌트에 흩뿌리지 않기.

### 1.5 모바일 대응 (신규, 2026-09-15)

- **뷰포트**: `index.html`에 `viewport-fit=cover` 추가함(완료) — 아이폰 노치/홈 인디케이터 대응용 `env(safe-area-inset-*)`를 쓰려면 이게 먼저 있어야 함.
- **세이프 에어리어**: 페이지 최상단 컨테이너(`App.jsx`의 `.stage`)의 아래쪽 패딩에 `env(safe-area-inset-bottom)`을 더해준다. 나중에 화면 하단에 "일정 추가" 버튼 같은 고정 UI가 생기면 특히 중요.
- **터치 타깃 최소 44px**: `ScheduleCard`는 카드 전체가 버튼이라 이미 충분히 큼(문제없음). 앞으로 작은 아이콘 버튼을 추가할 땐 44px 미만으로 만들지 않기.
- **hover에 기능을 얹지 않는다**: 폰은 hover가 없음. `ScheduleCard`의 `hover:-translate-y-0.5`는 데스크탑 보너스일 뿐, **실제 피드백은 `active:scale-[.97]`(누르는 순간 살짝 눌리는 느낌)로 낸다** — 이게 메인, hover는 있으면 좋은 것.
- **기준 폭 375px**(아이폰 SE/미니급, 제일 좁은 흔한 폭). 여기서 안 깨지면 나머지는 다 됨. 데스크탑은 지금처럼 `max-w-[440px]`로 가운데 정렬해서 폰처럼 보이게 유지(태블릿/데스크탑용 별도 레이아웃 안 만듦).
- **오늘 카드 여러 장 → 가로 스크롤로 전환** (자세한 내용은 2장 `ScheduleHand` 참조). 375px 폭에서 카드 3장이 한 줄에 다 안 들어가서(카드 112px×3+간격 ≈ 356px > 가용폭 ~307px), `flex-wrap`으로 두 줄 되는 대신 가로로 스와이프하는 "카드 패"처럼 만드는 게 덱빌딩 컨셉에도 더 맞음.

---

## 2. 컴포넌트 인벤토리

```
src/components/
├── Hearth.jsx          # 불꽃 게이지 (순수 표시)
├── ScheduleCard.jsx     # 일정 카드 (크랙 + 던지기 트리거)
├── ScheduleHand.jsx     # 오늘 카드 목록 + resolve 조율
└── DayCell.jsx          # 하루 전체 패널 (Hearth + ScheduleHand 조합)
```

### `<Hearth level floor flaring />`
- **순수 표시 컴포넌트, 로직 없음.**
- 구조 (2026-09-10 원형 → 사각 패널로 변경, 문서 갱신 안 돼 있던 것 지금 반영): 칸 전체를 채우는 사각 패널(높이 `h-40`, 모바일에서도 폭 100%라 안전). 안에 `Pyre`(Three.js 절차적 불 셰이더) 렌더 + 그 위에 `level`만큼 아래에서부터 드러나는 마스크(나머지는 카드색으로 덮음, 밑동이 제일 세게 타므로 레벨 오를수록 아래까지 드러나는 게 "불이 커진다"는 느낌).
- ⚠️ **이 그래픽 자체가 최종이 아님** — "사각 프레임 경계가 너무 티 난다"는 피드백으로 PixelLab 픽셀아트 레벨별 이미지 스왑으로 교체 예정(PixelLab 크레딧 문제로 대기 중, HANDOFF.md 참조). 대체되면 이 항목도 다시 고칠 것.
- props
  - `level: number` (0~100)
  - `floor: number` (최저치, 기본 12 — 이 밑으로 절대 안 내려감은 부모가 보장, Hearth는 그냥 받은 값을 그림)
  - `flaring: boolean` — true인 순간 밝기 상승(현재 구현은 Pyre의 `exposure`/`glow.strength`를 순간적으로 올리는 방식)
- 접근성: 루트에 `role="meter"`, `aria-valuenow={level}`, `aria-valuemin={floor}`, `aria-valuemax={100}`.
- 모바일: 사각 패널이라 반응형으로 자연 대응됨(폭 100%). 별도 처리 불필요.

### `<ScheduleCard time title value state onResolve />`
- props
  - `time`, `title`, `value`(태우면 불씨에 더해질 양)
  - `state: 'idle' | 'cracking' | 'thrown'`
  - `onResolve(value)` — 크랙 연출(300ms) 끝난 시점에 호출. **던지는 애니메이션(불씨까지 날아가는 것)은 부모가 좌표를 알아야 하므로 ScheduleHand가 처리.**
- 클릭 시 내부적으로 `state='cracking'` → 300ms 후 `onResolve` 호출 → 부모가 `state='thrown'`으로 바꿔주면 그때 날아가는 애니메이션 재생.
- 모바일: 주 피드백은 `active:scale-[.97]`(누르는 순간 반응) — `hover:-translate-y-0.5`는 데스크탑 보너스일 뿐 기능적으로 의존하지 않는다.

### `<ScheduleHand items onCardResolved />`
- 오늘 카드 배열을 렌더.
- 각 카드의 `onResolve`를 받아서: 카드 DOM 좌표 → Hearth DOM 좌표(ref로 전달받음) 계산 → 던지기 애니메이션 실행 → 끝나면 카드 제거 + `onCardResolved(value)` 호출(부모가 level 갱신).
- Hearth와 같은 부모(DayCell)를 공유해야 좌표 계산이 되므로, Hearth ref는 DayCell에서 내려받는다.
- **레이아웃 = 가로 스크롤 카드 패(모바일 대응, 2026-09-15)**: 지금 구현(`flex-wrap`)은 375px 폭에서 카드 3장이 두 줄로 밀림. `overflow-x-auto` + `snap-x snap-mandatory`(각 카드 `snap-start`)로 바꿔서, 카드가 몇 장이든 한 줄로 유지하고 옆으로 스와이프해서 보게 한다. 덱빌딩 게임의 "손패"에 더 맞는 모양이기도 함. 데스크탑에서도 그대로 유지(한 줄이 안 넘치면 스크롤 자체가 안 보임).

### `<DayCell date items level floor variant />`
- `variant: 'today' | 'tomorrow'`
- `today`: Hearth + ScheduleHand 풀 렌더, 인터랙션 가능. level 상태를 여기서 소유(`useState`), ScheduleHand의 `onCardResolved`로 갱신.
- `tomorrow`: 축소, 흐리게(`opacity: .65` 수준), 카드는 뒷면만(제목 없음), 클릭 불가.

---

## 3. 인터랙션 스펙 (확정)

1. 카드 클릭 → **380ms 크랙**: 제목 텍스트 위로 선 하나가 그어짐(그리기 애니메이션, `stroke-dashoffset` 방식). 흔들림·색 변화·날아드는 효과 없음 — "이거 해결했다"는 신호는 선이 그어지는 것 하나로 충분. (2026-09-10 단순화 — 이전 버전의 shake+스트릭+색플래시는 "저렴해 보인다"는 피드백으로 폐기)
2. → **620ms 던지기**: 카드가 회전하며 Hearth 중심으로 날아가 축소·소멸.
3. → **Hearth flare**(0.5s 밝아짐) + level이 카드 value만큼 상승 + 카드가 hand에서 제거.
4. `prefers-reduced-motion`이면 1~2단계는 생략하고 즉시 opacity 페이드로 대체, 결과(레벨 상승)는 동일하게 적용.

---

## 4. 데이터 모델 (조정)

```js
// src/data/mockSchedules.js 예정 형태
{
  id: string,
  title: string,
  time: string,      // "HH:mm" 표시용 (deadline ISO는 유지, time은 파생 or 별도 저장 — 결정 필요)
  value: number,     // 태우면 Hearth에 더해질 양 — 계산 규칙 미정, 지금은 목데이터에 하드코딩
  done: boolean,
}
```

- `value` 산정 규칙(균등분배? 소요시간 기반?)은 **아직 미정** — 새 입력 칸을 만들지 않는다는 원칙(CLAUDE.md) 지키면서 자동 계산해야 함. 지금은 목데이터에서만 임의 지정.
- 전역 `level`/`floor` 저장 위치(localStorage 스키마)도 미정.

---

## 5. 아직 안 정한 것 (이 문서에 나중에 채울 항목)

- 오늘 목표치 산정 기준, 감쇠 속도/주기
- 마일스톤 주기 + 봉화 화면 (별도 컴포넌트/라우트 필요, 지금 범위 아님)
- `TrialBanner` 컴포넌트 — 날씨 API 붙이기 전까지 보류, `--rain` 토큰만 미리 정의해둠
- localStorage 스키마
- `value` 자동 계산 규칙

---

*코드로 옮길 때는 이 문서의 컴포넌트 경계·토큰을 그대로 따른다. 어긋나면 이 문서를 먼저 고친다.*
