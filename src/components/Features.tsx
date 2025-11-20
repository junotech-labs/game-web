import { useState } from 'react'

const Features = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const features = [
    {
      icon: '🎯',
      title: '다양한 난이도',
      description: '초급부터 고급까지, 당신의 실력에 맞는 문제를 선택하세요.',
      color: 'from-purple-400 to-pink-400',
      bgColor: 'bg-purple-50',
    },
    {
      icon: '⚡',
      title: '실시간 경쟁',
      description: '친구들과 실시간으로 대결하며 순위를 겨뤄보세요.',
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'bg-blue-50',
    },
    {
      icon: '🏆',
      title: '도전 과제',
      description: '다양한 업적을 달성하고 특별한 보상을 받으세요.',
      color: 'from-yellow-400 to-orange-400',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: '📊',
      title: '상세한 통계',
      description: '당신의 실력 향상을 한눈에 확인할 수 있습니다.',
      color: 'from-green-400 to-emerald-400',
      bgColor: 'bg-green-50',
    },
    {
      icon: '🎨',
      title: '맞춤형 학습',
      description: 'AI가 분석한 당신의 약점을 보완하는 문제를 추천합니다.',
      color: 'from-pink-400 to-rose-400',
      bgColor: 'bg-pink-50',
    },
    {
      icon: '🌍',
      title: '글로벌 랭킹',
      description: '전 세계 유저들과 경쟁하고 최고의 자리에 도전하세요.',
      color: 'from-indigo-400 to-purple-400',
      bgColor: 'bg-indigo-50',
    },
  ]

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gradient from-purple-600 to-pink-600 mb-4">
            왜 우리 게임인가요?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            최고의 퀴즈 경험을 위한 모든 기능이 준비되어 있습니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative group ${feature.bgColor} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Gradient border effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
              />

              <div className="relative z-10">
                <div
                  className={`text-6xl mb-4 transform transition-all duration-300 ${
                    hoveredIndex === index ? 'scale-110 rotate-12' : ''
                  }`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover indicator */}
                <div
                  className={`mt-4 flex items-center text-transparent bg-gradient-to-r ${feature.color} bg-clip-text font-semibold transition-all duration-300 ${
                    hoveredIndex === index ? 'translate-x-2' : ''
                  }`}
                >
                  자세히 보기
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>

              {/* Decorative corner element */}
              <div
                className={`absolute top-4 right-4 w-20 h-20 bg-gradient-to-br ${feature.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Features
