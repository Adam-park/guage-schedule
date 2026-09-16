# 이어서 작업하기 (데스크탑 ↔ 노트북 핸드오프)

> 이 파일 = "다른 컴퓨터에서 이 프로젝트 이어받는 법". 설계·규칙은 [`CLAUDE.md`](./CLAUDE.md) 참조.
> 마지막 작업일: 2026-09-16 (불꽃 비주얼 시행착오 + 카드 인터랙션·아침 의식 컨셉 확장)

---

## 0. 세션 기록

### 2026-09-16 — 불꽃 비주얼 재시도 + 디자인트랙 과제 확인 + 카드 인터랙션/아침 의식 컨셉 (미완, 다음 세션 이어서)

**과제 배경 (참고용)**: 사용자가 "ASC 디자인트랙" 1주차 과제 중 — AI 티 나는 디자인을 design.md로 개선하고 전후 비교하는 과제. PDF 26페이지가 "카탈로그에 안 맞으면 AI한테 design.md 추천받아도 된다"고 명시 — 우리가 만든 [design.md](./design.md)(기성 카탈로그에 안 맞아서 AI 추천으로 새로 만든 것)가 이 경로에 정확히 해당함. 34페이지 "하드코딩 금지" 규칙 반영해서 `src/theme/colors.js`를 색 토큰 단일 출처로 정리함(전엔 `Hearth.jsx`에 hex를 중복 타이핑하고 있었음).

**design.md 갱신**: 모바일 우선 섹션(1.5) 추가 — 세이프에어리어, 터치타깃 44px, hover 대신 active 상태 위주, 375px 기준폭, 카드 여러 장일 때 가로 스크롤(아직 코드 미반영). `index.html`에 `viewport-fit=cover` 추가함(완료).

**PixelLab 재시도 — 불꽃 그림체, 아직 확정 안 됨**:
- 1차(지난 세션): 밤 숲 배경 모닥불 → "너무 어둡고 30년 전 레트로 게임 같다" 반려.
- 2차(이번 세션): 배경 투명 + "highly detailed/detailed shading, no retro 8-bit" 프롬프트로 재생성 (`job_id: d91028df-4d28-4ef2-879c-abca2e0972f2`) → **결과를 아직 확인 안 함** (사용자가 레퍼런스 이미지 주겠다며 대화를 카드 인터랙션 쪽으로 돌림). 다음 세션에서 이 결과물부터 `get_image`로 확인할 것.

**카드 인터랙션 재설계 — 덱빌딩 게임(Shroom and Gloom) 레퍼런스 반영**:
- 가져올 것: 카드가 평소엔 아래쪽 반쯤 가려져 있다가 **선택하면 튀어나와 커지는 구도**만. 그 게임 자체의 그로테스크한 미학은 참고 아님.
- 핵심 원칙: 게임은 "오래 붙잡는 게 목적"이라 템포를 늦추지만 이 앱은 "빨리 열고 닫는 게 목적" → **구도(연출)는 가져오되 템포(강제 대기)는 안 가져온다.** 애니메이션 딜레이·타이머로 못 누르게 막는 거 없음.
- 평범한 카드는 지금처럼 탭 1번 즉시 처리. **시련 걸린 카드만** 선택 시 확대되며 기존 4개 대응 동작(다시걸기/넘기기/쪼개기/그대로하기)이 뜸 — 결과가 이미 정해진 카드엔 애초에 고민거리가 없어서 시련 카드에만 이 연출을 씀.
- 아직 코드 미반영 — `ScheduleHand`(peek 레이아웃)·`ScheduleCard`(selected 상태 추가) 둘 다 손봐야 함.

**"아침 의식 + 주요 카드 3장" 아이디어 (새로 나온 것, 코드 없음, 컨셉만)**:
- 심층 문제 해결: "고민 시간 = 나쁨(게임처럼 오래 붙잡음) vs 고민 시간 = 진지해짐(오늘 목표 달성에 필요)"의 모순을, **하루 1번(아침)에만 깊게 고민하고 나머지 수십 번(낱장 카드 처리)은 빠르게**로 분리해서 해결.
- 아침에 주요 카드 3장 선정 → 제목 속 **키워드를 자동 인식**(입력 칸 안 늘림)해서 카드별 특수 효과 부여(예: 체력계 키워드 ↔ 날씨 시련, 관계계 키워드 ↔ 급한 일정 추가 시련).
- **자잘한 카드 = 불쏘시개**: 주요 카드(굵은 장작, 아침에만)와 달리 하루 중 즉흥 추가, 전략 효과 없이 불 안 꺼지게 하는 유지보수용 소량 연료. 처리 시 가끔 "발견" 문구 띄우는 것도 검토 중(인력/차폐/발견 개념과 연결).
- 자세한 내용은 메모리 `day-battery-concept-pivot` 참조. 아직 미정: 키워드 인식 규칙, 아침 의식 UI, 발견 문구.

**정리한 것**: 스크린샷 캡쳐용으로 임시로 늘려뒀던 `ScheduleCard.jsx`의 크랙 지속시간(3000ms)을 원래 값(380ms)으로 되돌림 — 커밋 전에 발견해서 고침.

**다음 세션 시작하면**: (1) PixelLab 불꽃 결과 확인(`get_image` job_id 위 참조), (2) "아침 의식+주요카드3" 컨셉 계속 발전시키기(사용자가 이어서 하고 싶어함), (3) 카드 인터랙션(peek 구도) 코드 반영은 컨셉이 좀 더 정리된 후.

### 2026-09-10 — 컨셉 전면 재설계 + 컴포넌트 구현 시작 (미완, 다음 세션 이어서)

**컨셉이 바뀜.** 압박형 배터리("놓치면 빨개짐") → 생존게임/모닥불 모델로 전면 재설계. 자세한 배경·근거는 메모리 `day-battery-concept-pivot`, 확정된 시각/컴포넌트 스펙은 **[`design.md`](./design.md)** 참조 — 이제부터 이 프로젝트의 화면 작업은 design.md가 기준 문서.

**핵심 요약**: 일정마다 배터리 ×  → **불꽃 하나**(Hearth)만 있고, 오늘 일정은 "카드"로 보여줌. 카드를 탭하면 제목에 금 가는 선이 그어지고(해결 신호) → 불씨 쪽으로 날아가 소멸 → 불꽃이 그만큼 밝아짐. 불씨는 최저치 밑으로 절대 안 꺼짐. (마일스톤/봉화, 시련 시스템은 설계만 되고 아직 코드 없음 — design.md 5장 "아직 안 정한 것" 참조)

**코드 상태 (커밋 안 됨 — 다음 세션 시작하면 `git status`로 먼저 확인할 것)**
- `design.md` 신규 — 디자인 토큰(비비드 팔레트) + 컴포넌트 경계(Hearth/ScheduleCard/ScheduleHand/DayCell) + 인터랙션 스펙 확정.
- `src/components/Hearth.jsx`, `ScheduleCard.jsx`, `ScheduleHand.jsx`, `DayCell.jsx` 신규 — design.md 그대로 구현.
- `src/App.jsx` — 기존 월간 달력 폐기, DayCell(오늘) + DayCell(내일, ghost)로 교체.
- `src/data/mockSchedules.js` — 데이터 모델 변경 `{id, time, title, value, done}`.
- `src/index.css` — Tailwind v4 `@theme`로 비비드 색 토큰 + 카드 크랙(선 긋기) 애니메이션.
- **`src/lib/battery.js`, `src/theme/colors.js`는 이제 안 씀 — 삭제 확인 아직 안 받음.**

**⚠️ Hearth 불꽃 표현 — 지금 상태가 최종 아님, 다음 세션에서 바로 이어서 할 것**
1. 1차: CSS 그라디언트+블러로 흉내 → "저게 뭔지 모르겠다" 반려.
2. 2차: 사용자가 가져온 실제 Three.js 셰이더(Originkit "Wind Pyre", FBM 노이즈 절차적 불) TS→JS 포팅해서 붙임(`src/components/Pyre.jsx`, `three` 패키지 추가됨). 레벨만큼 칸 아래쪽 마스크가 걷히는 방식으로 구현 → **"사각형 프레임 경계가 너무 티 난다"고 반려.**
3. 합의된 다음 방향: **PixelLab으로 모닥불 픽셀아트 1/2/3단계(레벨 구간별 완성된 그림 통째로 교체) 생성** — 프레임 경계 문제 자체가 안 생기고, three.js도 걷어낼 수 있어서(번들 196KB→727KB로 커졌던 거 원복됨) 더 나은 방향으로 합의함.
4. **막힘**: PixelLab 크레딧 $0 (트라이얼 소진, `get_balance` 확인함). 사용자가 pixellab.ai에서 결제/구독해야 진행 가능 — Claude가 대신 못 함.

**다음 세션 시작하면 (순서대로)**
1. 사용자한테 PixelLab 크레딧 충전했는지 물어보기.
2. 충전됐으면: `create_image_pixflux`로 모닥불 레벨2(중간) 먼저 생성 → 그걸 base로 img2img(`init_image_url` + `init_image_strength`)로 레벨1(작은 불씨)·레벨3(큰 불) 파생 → `Hearth.jsx`에서 레벨 구간별로 이미지 스왑, `Pyre.jsx`/`three` 의존성 제거.
3. 안 됐으면: CSS만으로 사각형 티 안 나게 하는 임시 방편(SVG 불꽃 실루엣 마스크) 시도 여부 다시 물어보기.
4. `npm run dev`로 로컬 확인 습관 유지 — 렌더 결과는 Claude가 못 보니 스크린샷/직접 확인 필요.
5. `lib/battery.js`, `theme/colors.js` 삭제해도 되는지 확인 후 정리.

### 2026-09-04 — 노트북 첫 세팅 (코드 변경 없음, 환경만)

- 노트북에서 처음으로 이 프로젝트 clone. 아래 항목 전부 확인 완료:

| 항목 | 상태 |
|---|---|
| Node / npm | ✅ v24.19.0 / 11.17.0 |
| git 사용자 설정 | ✅ 전역으로 `Adam-park` / `zmdkdkt@gmail.com` 세팅 |
| clone 위치 | 바탕화면 `Desktop/guage-schedule` |
| npm install | ✅ 41개 패키지, 취약점 0 |
| npm run dev | ✅ `http://localhost:5173` 정상 응답(200) 확인 |
| git 상태 | `main`, origin과 동일, 클린 (커밋 변경 없음) |

- **코드/기획 변경 없음** — 아래 "지금까지 된 것"·"다음 할 일"은 8/31 데스크탑 작업 내용 그대로 유효.
- 데스크탑으로 다시 돌아갈 때: 노트북에서 커밋한 게 없으므로 데스크탑은 그냥 `git pull` 한 번이면 최신 상태(사실상 변경 없음).

---

## 1. 노트북에서 셋업 (처음 한 번)

```bash
git clone https://github.com/Adam-park/guage-schedule.git
cd guage-schedule
npm install
npm run dev
```

→ 터미널에 뜨는 주소(보통 http://localhost:5173) 브라우저에서 열기.
서버 켜는 터미널 창은 닫지 말 것 (닫으면 "페이지 로드 못 함").

- Node 18+ 필요 (개발은 Node 24 / npm 11에서 함)
- git 사용자: `Adam-park` / `zmdkdkt@gmail.com`

---

## 2. 지금까지 된 것 (2026-08-31 기준)

| 항목 | 상태 |
|---|---|
| 기획 확정 | ✅ 무계획자용 달력 + 배터리 게이지, 7일 활주로. 이름 "Day Battery" |
| 스택 | ✅ React 19 + Vite + Tailwind v4, 저장은 localStorage 예정 (백엔드 없음) |
| 화면 | ✅ 월간 달력 1개. 각 날짜 칸이 그날 제일 급한 일정의 배터리로 채워짐 (아래→위, 편안한 색→빨강) |
| 배터리 계산 | ✅ `src/lib/battery.js` 순수 함수 (잔량 %, 단계, 날짜별 배터리) |
| 목데이터 | ✅ `src/data/mockSchedules.js` — "지금" 기준 상대 시각으로 8개 |
| 1분마다 갱신 | ✅ App.jsx `setInterval` |
| GitHub | ✅ `github.com/Adam-park/guage-schedule` (Private, `main`) |
| Vercel 배포 | ✅ https://guage-schedule.vercel.app (공개). `git push` → 자동 재배포 |

배포별 URL(`...-<해시>-awe-park.vercel.app`)은 Vercel 팀 로그인 필요 — 정상. 공유는 `guage-schedule.vercel.app`.

---

## 3. 파일 구조

```
src/
├── App.jsx                 # 월간 달력 화면 (지금은 여기 다 있음)
├── main.jsx
├── index.css               # Tailwind import
├── data/mockSchedules.js   # 목데이터 (백엔드/localStorage 붙으면 교체)
├── lib/battery.js          # 배터리 % / 단계 / 날짜별 배터리 계산 (순수 함수)
└── theme/colors.js         # 배터리 단계별 색 (HEX 임시값 — 튜닝 예정)
```

일정 데이터 모델: `{ id, title, deadline(ISO), done }`. 파생값(배터리 %·색·놓침 여부)은 저장 안 하고 렌더 시 계산.

---

## 4. 다음 할 일 (MVP 순서)

1. **색·칸 모양 다듬기** — 스크린샷 보면서 값 하나씩. `theme/colors.js` HEX 3단계 확정, 칸 안 배터리 표시 방식 최종.
2. **날짜 칸 클릭 → 일정 추가/보기 패널** — 입력은 제목 + 날짜/시간, 그게 전부. (우선순위·태그 칸 만들지 말 것)
3. **localStorage 저장** — `src/lib/storage.js` 새로 만들어서 `mockSchedules` → 실제 저장소로 교체.
4. **완료 체크 / 삭제 / "놓침" 처리** — 완료 = 배터리 회색 얼림, 데드라인 지남+미완료 = 텅 빈 빨강.
5. (이후) 브라우저 푸시 알림, Google Calendar 읽기 가져오기, 주간 뷰.

백엔드(Supabase 등)는 "기기 간 동기화 / 데이터 영구 보존 / 푸시 알림"이 필요해질 때. 그 전엔 localStorage로 충분.

---

## 5. 배포/커밋

```bash
git add -A
git commit -m "메시지"
git push          # → Vercel 자동 재배포
```

- `.vercel/` 는 `.gitignore` 처리됨 (커밋 안 됨)
- Vercel 인증 토큰은 데스크톱에만 있음. 노트북에서 `npx vercel` 쓰려면 `npx vercel login` 한 번 필요 (하지만 자동 배포는 GitHub 연동이라 노트북에서 따로 로그인 안 해도 됨)
