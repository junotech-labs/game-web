import { useQuizGame } from './hooks/useQuizGame';
import { getRankInfo } from './utils/quiz';
import { MenuScreen, PlayScreen, ResultScreen } from './components/screens';

function App() {
  const {
    gameMode,
    currentQuiz,
    answerResult,
    userAnswer,
    quizHistory,
    loading,
    error,
    showConfetti,
    timerKey,
    correctCount,
    totalCount,
    accuracy,
    startGame,
    onAnswer,
    handleNextQuestion,
    showResults,
    backToMenu,
  } = useQuizGame();

  // 메인 메뉴 화면
  if (gameMode === 'menu') {
    return <MenuScreen loading={loading} error={error} onStartGame={startGame} />;
  }

  // 결과 화면
  if (gameMode === 'result') {
    const rankInfo = getRankInfo(correctCount);

    return (
      <ResultScreen
        quizHistory={quizHistory}
        correctCount={correctCount}
        totalCount={totalCount}
        accuracy={accuracy}
        rankInfo={rankInfo}
        showConfetti={showConfetti}
        loading={loading}
        onBackToMenu={backToMenu}
        onRetry={startGame}
      />
    );
  }

  // 게임 플레이 화면 - 퀴즈 로딩 중
  if (!currentQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  // 게임 플레이 화면
  return (
    <PlayScreen
      currentQuiz={currentQuiz}
      answerResult={answerResult}
      userAnswer={userAnswer}
      quizHistory={quizHistory}
      loading={loading}
      error={error}
      showConfetti={showConfetti}
      timerKey={timerKey}
      onAnswer={onAnswer}
      onNextQuestion={handleNextQuestion}
      onShowResults={showResults}
    />
  );
}

export default App;
