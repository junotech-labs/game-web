import { QuizResponse, AnswerResponse } from '../types/quiz';

export interface DefaultQuiz extends QuizResponse {
  correct_answer: number;
  explanation: string;
}

// API 호출 실패 시 사용할 기본 문제셋
export const DEFAULT_QUIZZES: DefaultQuiz[] = [
  {
    id: 137,
    question: "'대부' 시리즈의 감독은 누구인가요?",
    options: ["마틴 스코세이지", "프란시스 포드 코폴라", "스티븐 스필버그", "조지 루카스"],
    category: "영화/드라마",
    correct_answer: 1,
    explanation: "'대부' 시리즈는 프란시스 포드 코폴라 감독의 대표작입니다.",
  },
  {
    id: 170,
    question: "한국의 대통령 임기는 몇 년인가요?",
    options: ["4년", "5년", "6년", "7년"],
    category: "일반상식",
    correct_answer: 1,
    explanation: "대한민국 대통령의 임기는 5년 단임제입니다.",
  },
  {
    id: 133,
    question: "'죄와 벌'의 저자는 누구인가요?",
    options: ["톨스토이", "도스토예프스키", "체호프", "고골"],
    category: "문학",
    correct_answer: 1,
    explanation: "'죄와 벌'은 표도르 도스토예프스키의 대표작입니다.",
  },
  {
    id: 164,
    question: "지구의 자전 방향은 어느 쪽인가요?",
    options: ["동에서 서로", "서에서 동으로", "북에서 남으로", "남에서 북으로"],
    category: "일반상식",
    correct_answer: 1,
    explanation: "지구는 서에서 동으로 자전합니다.",
  },
  {
    id: 59,
    question: "세계에서 가장 큰 사막은 무엇인가요?",
    options: ["사하라 사막", "고비 사막", "아타카마 사막", "남극 사막"],
    category: "지리",
    correct_answer: 3,
    explanation: "남극 사막이 세계에서 가장 큰 사막입니다. 사하라는 온대 사막 중 가장 큽니다.",
  },
  {
    id: 177,
    question: "초밥에 사용되는 밥은 어떤 맛이 나나요?",
    options: ["짠맛", "신맛", "단맛", "매운맛"],
    category: "음식/요리",
    correct_answer: 1,
    explanation: "초밥의 밥(샤리)은 식초를 넣어 만들어 신맛이 납니다.",
  },
  {
    id: 71,
    question: "농구 골대의 높이는 몇 미터인가요?",
    options: ["2.5m", "3.05m", "3.5m", "4m"],
    category: "스포츠",
    correct_answer: 1,
    explanation: "농구 골대의 높이는 3.05m(10피트)입니다.",
  },
  {
    id: 99,
    question: "훈민정음이 반포된 해는 언제인가요?",
    options: ["1443년", "1446년", "1450년", "1460년"],
    category: "역사",
    correct_answer: 1,
    explanation: "훈민정음은 1446년(세종 28년)에 반포되었습니다. 창제는 1443년입니다.",
  },
  {
    id: 163,
    question: "한글 자음은 모두 몇 개인가요?",
    options: ["14개", "19개", "21개", "24개"],
    category: "일반상식",
    correct_answer: 1,
    explanation: "한글 자음은 기본 자음 14개와 쌍자음 5개를 합쳐 19개입니다.",
  },
  {
    id: 76,
    question: "음악에서 '포르테(Forte)'는 무엇을 의미하나요?",
    options: ["빠르게", "느리게", "크게", "작게"],
    category: "음악/예술",
    correct_answer: 2,
    explanation: "포르테(f)는 이탈리아어로 '강하게, 크게'라는 뜻입니다.",
  },
  {
    id: 61,
    question: "세계에서 가장 인구가 많은 나라는 어디인가요? (2024년 기준)",
    options: ["중국", "인도", "미국", "인도네시아"],
    category: "지리",
    correct_answer: 1,
    explanation: "2024년 현재 인도가 중국을 제치고 세계에서 가장 인구가 많은 나라가 되었습니다.",
  },
  {
    id: 81,
    question: "세계에서 가장 작은 나라는 어디인가요?",
    options: ["모나코", "바티칸", "산마리노", "리히텐슈타인"],
    category: "지리",
    correct_answer: 1,
    explanation: "바티칸 시국은 면적 약 0.44km²로 세계에서 가장 작은 독립국가입니다.",
  },
  {
    id: 155,
    question: "Windows 운영체제를 만든 회사는?",
    options: ["애플", "구글", "마이크로소프트", "IBM"],
    category: "기술/IT",
    correct_answer: 2,
    explanation: "Windows는 마이크로소프트에서 개발한 운영체제입니다.",
  },
  {
    id: 195,
    question: "신용카드의 '신용'은 무엇을 의미하나요?",
    options: ["현금", "나중에 갚겠다는 약속", "할인", "포인트"],
    category: "경제/금융",
    correct_answer: 1,
    explanation: "신용카드는 나중에 대금을 갚겠다는 신용을 바탕으로 사용하는 카드입니다.",
  },
  {
    id: 92,
    question: "전기를 발견한 과학자는 누구인가요?",
    options: ["에디슨", "테슬라", "프랭클린", "패러데이"],
    category: "과학",
    correct_answer: 2,
    explanation: "벤저민 프랭클린은 연을 이용한 실험으로 번개가 전기임을 증명했습니다.",
  },
  {
    id: 69,
    question: "정사각형의 대각선은 몇 개인가요?",
    options: ["1개", "2개", "3개", "4개"],
    category: "수학",
    correct_answer: 1,
    explanation: "정사각형은 2개의 대각선을 가지고 있으며, 두 대각선은 서로 수직으로 만납니다.",
  },
  {
    id: 171,
    question: "SOS 신호는 무엇을 의미하나요?",
    options: ["Save Our Ship", "Save Our Souls", "특별한 의미 없음", "Stop Other Ships"],
    category: "일반상식",
    correct_answer: 2,
    explanation: "SOS는 모스 부호로 보내기 쉬운 조난 신호로, 특별한 의미는 없습니다.",
  },
  {
    id: 108,
    question: "1킬로미터는 몇 미터인가요?",
    options: ["100m", "500m", "1000m", "10000m"],
    category: "수학",
    correct_answer: 2,
    explanation: "1킬로미터는 1000미터입니다.",
  },
  {
    id: 100,
    question: "베를린 장벽이 무너진 해는 언제인가요?",
    options: ["1987년", "1989년", "1991년", "1993년"],
    category: "역사",
    correct_answer: 1,
    explanation: "베를린 장벽은 1989년 11월 9일에 무너졌습니다.",
  },
  {
    id: 165,
    question: "대한민국의 국기 이름은 무엇인가요?",
    options: ["태극기", "무궁화기", "삼일기", "태백기"],
    category: "일반상식",
    correct_answer: 0,
    explanation: "대한민국의 국기는 태극기입니다.",
  },
];

// 기본 문제셋에서 랜덤하게 퀴즈 가져오기
export function getRandomDefaultQuiz(): DefaultQuiz {
  const randomIndex = Math.floor(Math.random() * DEFAULT_QUIZZES.length);
  return DEFAULT_QUIZZES[randomIndex];
}

// 기본 문제셋에서 여러 개의 랜덤 퀴즈 가져오기 (중복 없이)
export function getRandomDefaultQuizzes(count: number): DefaultQuiz[] {
  const shuffled = [...DEFAULT_QUIZZES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, DEFAULT_QUIZZES.length));
}

// 기본 문제셋에서 답변 체크하기
export function checkDefaultAnswer(quizId: number, userAnswer: number): AnswerResponse | null {
  const quiz = DEFAULT_QUIZZES.find((q) => q.id === quizId);
  if (!quiz) return null;

  return {
    is_correct: quiz.correct_answer === userAnswer,
    correct_answer: quiz.correct_answer,
    explanation: quiz.explanation,
    user_answer: userAnswer,
  };
}
