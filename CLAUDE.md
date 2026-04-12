# game-web — 상식 퀴즈 미니앱 (WebView)

## 스택

- React 18 + TypeScript + Vite + Tailwind CSS
- SDK: `@apps-in-toss/web-framework` ^2.4.5

## 명령어

```bash
pnpm dev          # 개발 서버 (vite --host)
pnpm build        # 프로덕션 빌드 (ait build → common-sense.ait)
npx ait deploy    # 앱인토스 배포 (pnpm deploy는 workspace 전용이라 불가)
pnpm test         # vitest 실행
```

## 아키텍처

```
App.tsx (라우팅: menu | playing | result)
├── MenuScreen    — 게임 시작, 플레이 횟수, 광고 보상
├── PlayScreen    — 문제 출제, 타이머, 답변
│   ├── QuestionView  — 문제 + 선택지
│   └── FeedbackView  — 정답/오답 + 해설
└── ResultScreen  — 점수, 랭크, 공유

hooks/useQuizGame.ts  — 전체 게임 상태 머신
api/quizApi.ts        — API 호출 + 로컬 채점 + 오프라인 폴백
utils/tossRewards.ts  — 보상형 광고 (loadFullScreenAd/showFullScreenAd)
```

### 핵심 원칙

- **로컬 채점**: `FullQuizResponse`에 `correct_answer` + `explanation` 포함. 서버 없이 즉시 채점.
- **Fire-and-forget 트래킹**: 세션/답변 데이터를 서버에 비동기 전송. 실패해도 게임 플로우 무관.
- **오프라인 지원**: API 실패 시 `defaultQuizzes.ts` 기본 퀴즈셋으로 플레이.

### SDK API 사용 현황

| 기능 | API | 비고 |
|------|-----|------|
| 보상형 광고 | `loadFullScreenAd` / `showFullScreenAd` | 인앱 광고 2.0 ver2. `userEarnedReward`에서만 리워드 지급 |
| 공유 | `getTossShareLink` + `share` | 순수 공유만. 리워드 필요 시 `contactsViral` + 콘솔 moduleId |
| 유저 식별 | `getAnonymousKey` | 플레이 횟수 관리용 |
| 리더보드 | `submitGameCenterLeaderBoardScore` | 게임 완료 시 fire-and-forget |
| 분석 | `Analytics.impression` / `Analytics.click` | 이벤트: game_started, answer_correct/wrong, game_complete 등 |

## 테스트

- `pnpm test` — vitest 42개 테스트 (API, 유틸, 데이터 무결성, 리워드 플로우)
- 테스트 setup: `src/__tests__/setup.ts`에서 SDK 전체 mock
- 실기기 테스트: 콘솔 QR 코드 또는 `intoss://common-sense` 딥링크

## 환경변수 (.env)

| 변수 | 용도 |
|------|------|
| `VITE_API_URL` | 퀴즈 API 서버 URL |
| `VITE_REWARD_AD_GROUP_ID` | 보상형 광고 그룹 ID |
