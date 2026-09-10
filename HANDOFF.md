# 이어서 작업하기 (데스크탑 ↔ 노트북 핸드오프)

> 이 파일 = "다른 컴퓨터에서 이 프로젝트 이어받는 법". 설계·규칙은 [`CLAUDE.md`](./CLAUDE.md) 참조.
> 마지막 작업일: 2026-09-10 (컨셉 전면 재설계 + 컴포넌트 구현 시작)

---

## 0. 세션 기록

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
