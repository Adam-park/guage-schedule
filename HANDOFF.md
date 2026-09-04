# 이어서 작업하기 (데스크탑 ↔ 노트북 핸드오프)

> 이 파일 = "다른 컴퓨터에서 이 프로젝트 이어받는 법". 설계·규칙은 [`CLAUDE.md`](./CLAUDE.md) 참조.
> 마지막 작업일: 2026-09-04 (노트북 세팅)

---

## 0. 세션 기록

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
