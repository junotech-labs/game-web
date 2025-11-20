# 🎮 Quiz Game Web

FastAPI 기반 인터랙티브 퀴즈 게임 웹 애플리케이션입니다.

## ✨ 주요 기능

- 🎲 **랜덤 퀴즈**: 무작위로 선택된 10문제를 풀어보세요
- ⏱️ **제한 시간**: 각 문제당 10초의 제한 시간
- 💡 **즉각적인 피드백**: 정답 확인 및 상세한 해설 제공
- 🏆 **결과 분석**: 문제별 풀이 내역 및 점수 기반 등급 시스템
- 🏷️ **다양한 카테고리**: 지리, 과학, 역사, 수학, 일반상식
- 🎨 **현대적인 UI/UX**: Tailwind CSS 기반의 아름다운 디자인
- ⚡ **빠른 성능**: 게임 시작 시 모든 문제를 미리 로드하여 끊김 없는 플레이

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript
- **빌드 도구**: Vite
- **스타일링**: Tailwind CSS
- **Backend API**: FastAPI (포트 12233)
- **배포**: Granite

## 🚀 시작하기

### 사전 요구사항

1. **Node.js 18+** 및 **pnpm** 설치
2. **Quiz API 서버** 실행 (포트 12233)
   - API 서버가 `http://localhost:12233`에서 실행 중이어야 합니다

### 설치

```bash
# 의존성 설치
pnpm install
```

### 개발 서버 실행

```bash
# 개발 서버 시작 (포트 5173)
pnpm dev
```

브라우저에서 [http://localhost:5173](http://localhost:5173)을 열어 확인하세요.

### 빌드

```bash
# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

### 배포

```bash
# Granite을 사용한 배포
pnpm deploy
```

## 📁 프로젝트 구조

```
quiz-game-web/
├── src/
│   ├── api/
│   │   └── quizApi.ts        # API 클라이언트
│   ├── types/
│   │   └── quiz.ts           # TypeScript 타입 정의
│   ├── components/
│   │   ├── Confetti.tsx      # 정답 시 Confetti 효과
│   │   ├── Timer.tsx         # 퀴즈 타이머
│   │   └── icons/            # SVG 아이콘 컴포넌트
│   ├── App.tsx               # 메인 게임 컴포넌트
│   ├── main.tsx              # 엔트리 포인트
│   └── index.css             # 글로벌 스타일 및 커스텀 애니메이션
├── public/                   # 정적 파일
├── .env.development          # 개발 환경 변수
├── .env.production           # 프로덕션 환경 변수
├── vite.config.ts            # Vite 설정 (프록시 포함)
├── tailwind.config.js        # Tailwind CSS 설정
├── granite.config.ts         # Granite 배포 설정
└── package.json              # 프로젝트 설정
```

## 🔌 API 연동

### 엔드포인트

- `GET /quizzes/random` - 랜덤 퀴즈 조회
- `POST /quizzes/answer` - 답변 제출 및 채점

### 환경 변수

`.env.development` 또는 `.env.production` 파일에서 API URL을 설정할 수 있습니다:

```env
VITE_API_URL=http://localhost:12233
```

### 프록시 설정

개발 환경에서는 Vite 프록시를 통해 CORS 문제를 해결합니다. (`vite.config.ts` 참조)

## 🎮 게임 플레이

### 1. 메인 메뉴
- **랜덤 퀴즈 시작**: 게임 시작 시 10개의 문제가 미리 생성됩니다
- 다양한 카테고리의 퀴즈가 랜덤으로 제공됩니다

### 2. 퀴즈 풀이
- 각 문제당 10초의 제한 시간
- 4개의 선택지 중 정답 선택
- 시간 초과 시 자동으로 오답 처리
- 즉각적인 정답/오답 피드백
- 상세한 해설 제공
- 정답 시 자동으로 다음 문제로 이동

### 3. 결과 화면
- 전체 정답률 및 점수 확인
- 문제별 풀이 내역 시각화
- 점수 기반 11단계 등급 시스템
  - 10점: 완벽한 천재
  - 9점: 지식 박사
  - 8점: 똑똑이
  - 7점: 합격선 통과
  - 6점: 노력파
  - 5점: 반반 성공
  - 4점: 분발 필요
  - 3점: 초보자
  - 2점: 용기만 100점
  - 1점: 운빨 성공
  - 0점: 역대급 도전

## 🎯 주요 기능 구현

### 성능 최적화
- 게임 시작 시 `Promise.all`을 사용하여 10개의 퀴즈를 병렬로 로드
- 퀴즈 큐 시스템으로 네트워크 지연 없이 부드러운 게임 플레이

### UI/UX
- Confetti 애니메이션으로 정답 시 축하 효과
- 진행 표시 타이머
- 카테고리별 색상 구분
- Kahoot 스타일의 컬러풀한 답변 버튼
- 커스텀 SVG 아이콘으로 전문적인 디자인

### 게임 로직
- 자동 전환: 정답 후 2.5초, 오답 후 3초 뒤 자동으로 다음 문제로 이동
- 디바운싱: 중복 클릭 방지 시스템
- 타이머 관리: 답변 제출 시 타이머 자동 정지

## 🌐 배포

이 프로젝트는 Granite을 사용하여 배포됩니다.

```bash
pnpm deploy
```

배포 전에 `granite.config.ts`에서 배포 설정을 확인하세요.

## 📝 라이선스

MIT License

## 👥 기여

기여는 언제나 환영합니다! PR을 보내주세요.

---

Made with ❤️ by Quiz Team
