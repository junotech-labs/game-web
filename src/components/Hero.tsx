import { useState, useEffect } from 'react'

interface HeroProps {
  scrollY: number
}

const Hero = ({ scrollY }: HeroProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [typedText, setTypedText] = useState('')
  const fullText = '당신의 상식을 테스트하세요!'

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 100)
    return () => clearInterval(timer)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{
            left: '10%',
            top: '20%',
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px)`,
          }}
        />
        <div
          className="absolute w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{
            right: '10%',
            top: '30%',
            animationDelay: '1s',
            transform: `translate(-${scrollY * 0.1}px, ${scrollY * 0.1}px)`,
          }}
        />
        <div
          className="absolute w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{
            left: '50%',
            bottom: '20%',
            animationDelay: '2s',
            transform: `translate(-50%, ${scrollY * 0.2}px)`,
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div
          className="inline-block mb-6 px-6 py-2 bg-white/30 backdrop-blur-md rounded-full border border-white/40 shadow-lg"
          style={{
            transform: `translateY(${Math.sin(scrollY * 0.01) * 10}px)`,
          }}
        >
          <span className="text-purple-700 font-semibold text-sm sm:text-base">
            🎮 지금 바로 시작하세요!
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
          <span className="text-gradient from-purple-600 via-pink-600 to-indigo-600 inline-block">
            상식 퀴즈 게임
          </span>
        </h1>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 h-12 sm:h-14">
          {typedText}
          <span className="animate-pulse">|</span>
        </h2>

        <p className="text-lg sm:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
          재미있는 퀴즈로 당신의 지식을 테스트하고, 친구들과 경쟁하며, 새로운 것을 배워보세요.
          다양한 카테고리의 수백 가지 문제가 당신을 기다립니다!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            }}
          >
            <span className="relative z-10">🚀 게임 시작하기</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <button
            className="px-8 py-4 bg-white/70 backdrop-blur-sm text-purple-700 font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 border-2 border-purple-200 hover:border-purple-400"
          >
            📚 더 알아보기
          </button>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-bounce-slow hidden lg:block">
          <div className="text-6xl opacity-20 hover:opacity-100 transition-opacity cursor-pointer">
            🎯
          </div>
        </div>
        <div className="absolute top-40 right-20 animate-float hidden lg:block">
          <div className="text-6xl opacity-20 hover:opacity-100 transition-opacity cursor-pointer">
            💡
          </div>
        </div>
        <div className="absolute bottom-20 left-20 animate-pulse-slow hidden lg:block">
          <div className="text-6xl opacity-20 hover:opacity-100 transition-opacity cursor-pointer">
            🏆
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default Hero
