import { useState } from 'react'

const QuizCategories = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null)

  const categories = [
    {
      emoji: '🌍',
      title: '지리',
      description: '세계의 나라, 도시, 지형에 대한 지식을 테스트하세요',
      quizCount: 120,
      difficulty: '초급-고급',
      gradient: 'from-green-400 via-emerald-500 to-teal-600',
      bgPattern: 'bg-gradient-to-br from-green-50 to-emerald-50',
    },
    {
      emoji: '🔬',
      title: '과학',
      description: '물리, 화학, 생물학의 흥미로운 사실들을 알아보세요',
      quizCount: 150,
      difficulty: '중급-고급',
      gradient: 'from-blue-400 via-cyan-500 to-sky-600',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    },
    {
      emoji: '📚',
      title: '역사',
      description: '과거의 중요한 사건과 인물들을 되돌아보세요',
      quizCount: 180,
      difficulty: '초급-고급',
      gradient: 'from-amber-400 via-orange-500 to-red-600',
      bgPattern: 'bg-gradient-to-br from-amber-50 to-orange-50',
    },
    {
      emoji: '🎬',
      title: '영화 & TV',
      description: '대중문화와 엔터테인먼트에 대한 지식을 뽐내세요',
      quizCount: 200,
      difficulty: '초급-중급',
      gradient: 'from-purple-400 via-fuchsia-500 to-pink-600',
      bgPattern: 'bg-gradient-to-br from-purple-50 to-fuchsia-50',
    },
    {
      emoji: '⚽',
      title: '스포츠',
      description: '다양한 스포츠와 선수들에 대해 알아보세요',
      quizCount: 160,
      difficulty: '초급-고급',
      gradient: 'from-red-400 via-rose-500 to-pink-600',
      bgPattern: 'bg-gradient-to-br from-red-50 to-rose-50',
    },
    {
      emoji: '🎵',
      title: '음악',
      description: '클래식부터 K-POP까지, 음악의 모든 것',
      quizCount: 140,
      difficulty: '초급-중급',
      gradient: 'from-indigo-400 via-purple-500 to-violet-600',
      bgPattern: 'bg-gradient-to-br from-indigo-50 to-purple-50',
    },
  ]

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gradient from-indigo-600 to-purple-600 mb-4">
            다양한 카테고리
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            당신이 좋아하는 주제를 선택하고 지식을 겨뤄보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`relative group ${category.bgPattern} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden transform hover:scale-105`}
              onMouseEnter={() => setActiveCategory(index)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              {/* Animated gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500`}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon with animation */}
                <div
                  className={`text-7xl mb-4 transition-all duration-500 ${
                    activeCategory === index
                      ? 'transform scale-110 rotate-6'
                      : ''
                  }`}
                >
                  {category.emoji}
                </div>

                {/* Title */}
                <h3
                  className={`text-3xl font-bold mb-3 bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}
                >
                  {category.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {category.description}
                </p>

                {/* Meta info */}
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {category.quizCount}개 문제
                  </span>
                  <span className="text-sm px-3 py-1 bg-white/60 rounded-full text-gray-700">
                    {category.difficulty}
                  </span>
                </div>

                {/* Start button */}
                <button
                  className={`w-full py-3 px-6 bg-gradient-to-r ${category.gradient} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform ${
                    activeCategory === index ? 'scale-105' : ''
                  }`}
                >
                  시작하기
                  <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
              </div>

              {/* Decorative elements */}
              <div
                className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${category.gradient} rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
              />
              <div
                className={`absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br ${category.gradient} rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
              />

              {/* Hover glow effect */}
              {activeCategory === index && (
                <div className="absolute inset-0 rounded-3xl shadow-2xl animate-pulse pointer-events-none" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuizCategories
