# Day Battery — 디자인 스펙 (design.md)

> 이 문서는 컨셉 재설계([SESSION-RULES.md](./SESSION-RULES.md) "재기획 진행 중" + 메모리 `day-battery-concept-pivot`)를 화면·컴포넌트 레벨로 구체화한 것.
> 색·타입·컴포넌트 경계는 여기가 기준. 바꿀 땐 이 파일부터 고치고, 코드는 그다음.
> Artifact로 통째로 다시 그리는 건 그만 — 이 문서 기준으로 컴포넌트 단위로 고친다.

---

## 0. 이 문서가 대체하는 것

- `src/App.jsx`의 "월간 달력 6주 그리드" 화면 → **폐기**. 메인 화면은 오늘 DayCell(전체 주인공) + 내일 DayCell(축소/ghost) 두 개.
- `src/lib/battery.js`의 "일정마다 배터리 % 계산" → **폐기**. 개별 일정은 더 이상 각자 배터리를 안 가짐.
- `src/theme/colors.js`의 3단계(calm/warn/urgent) + frozen 색 모델 → **폐기**. 단일 불꽃(Hearth) 하나로 통합.
- 대체하는 것: 불꽃 게이지(Hearth) + 일정 카드(ScheduleCard) + 카드를 태워서 불씨를 올리는 인터랙션.

---

## 1. 디자인 토큰

### 1.1 색 — 비비드 버전

라이트 배경 고정 (어두운 밤색·글로우 히어로 없음 — 확정됨). 액센트는 확실히 채도 높게.

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
- 구조: 원형 링(레벨만큼 채워지는 `conic-gradient`) → 안쪽 `--pit` 원 → 그 안에 glow 레이어(레벨에 비례해 scale/opacity).
- props
  - `level: number` (0~100)
  - `floor: number` (최저치, 기본 12 — 이 밑으로 절대 안 내려감은 부모가 보장, Hearth는 그냥 받은 값을 그림)
  - `flaring: boolean` — true인 순간 0.5초 밝아지는 pulse 재생
- 접근성: 루트에 `role="meter"`, `aria-valuenow={level}`, `aria-valuemin={floor}`, `aria-valuemax={100}`.

### `<ScheduleCard time title value state onResolve />`
- props
  - `time`, `title`, `value`(태우면 불씨에 더해질 양)
  - `state: 'idle' | 'cracking' | 'thrown'`
  - `onResolve(value)` — 크랙 연출(300ms) 끝난 시점에 호출. **던지는 애니메이션(불씨까지 날아가는 것)은 부모가 좌표를 알아야 하므로 ScheduleHand가 처리.**
- 클릭 시 내부적으로 `state='cracking'` → 300ms 후 `onResolve` 호출 → 부모가 `state='thrown'`으로 바꿔주면 그때 날아가는 애니메이션 재생.

### `<ScheduleHand items onCardResolved />`
- 오늘 카드 배열을 렌더.
- 각 카드의 `onResolve`를 받아서: 카드 DOM 좌표 → Hearth DOM 좌표(ref로 전달받음) 계산 → 던지기 애니메이션 실행 → 끝나면 카드 제거 + `onCardResolved(value)` 호출(부모가 level 갱신).
- Hearth와 같은 부모(DayCell)를 공유해야 좌표 계산이 되므로, Hearth ref는 DayCell에서 내려받는다.

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
