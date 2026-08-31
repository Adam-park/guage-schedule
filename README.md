# 데이 배터리 (Day Battery)

계획 안 세우고 일정만 툭툭 넣고 사는 사람을 위한 스케줄러.
각 일정이 배터리처럼 색이 빠진다 — 편안한 색으로 꽉 차 있다가 데드라인이 다가올수록 위→아래로 줄며 빨개진다.

> 설계·규칙은 [`CLAUDE.md`](./CLAUDE.md) 참조.

## 실행

```bash
npm install
npm run dev
```

→ 터미널에 뜨는 주소(보통 http://localhost:5173) 를 브라우저에서 연다.

## 스택

React 19 · Vite · Tailwind CSS v4 · 저장은 localStorage (백엔드 없음)

## 폴더

```
src/
├── App.jsx              # 월간 달력 화면 (각 날짜 칸이 배터리)
├── data/mockSchedules.js   # 목데이터 (백엔드 붙으면 교체)
├── lib/battery.js          # 배터리 % / 단계 / 날짜별 배터리 계산 (순수 함수)
└── theme/colors.js         # 배터리 단계별 색 (HEX 임시값 — 튜닝 예정)
```
