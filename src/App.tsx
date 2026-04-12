import { Component, ReactNode } from 'react';
import { useQuizGame } from './hooks/useQuizGame';
import { getRankInfo } from './utils/quiz';
import { MenuScreen, PlayScreen, ResultScreen } from './components/screens';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
            <span className="text-6xl block mb-4">😵</span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">문제가 발생했습니다</h2>
            <p className="text-gray-600 mb-6">잠시 후 다시 시도해주세요.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all"
            >
              다시 시도
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    playStatus,
    canPlay,
    startGame,
    onAnswer,
    handleNextQuestion,
    showResults,
    backToMenu,
    rewardPlay,
  } = useQuizGame();

  // 메인 메뉴 화면
  if (gameMode === 'menu') {
    return <MenuScreen loading={loading} error={error} playStatus={playStatus} canPlay={canPlay} onStartGame={startGame} onRewardPlay={rewardPlay} />;
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
        canPlay={canPlay}
        onBackToMenu={backToMenu}
        onRetry={startGame}
        onRewardPlay={rewardPlay}
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

function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default AppWithErrorBoundary;
