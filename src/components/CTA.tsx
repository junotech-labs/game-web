import { useState } from 'react'

const CTA = () => {
  const [email, setEmail] = useState('')
  const [isHovered, setIsHovered] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    // 실제로는 여기서 이메일을 처리합니다
    alert('곧 출시 소식을 알려드리겠습니다! 🎉')
    setEmail('')
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div
          className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)]" />
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 100 + 50 + 'px',
                  height: Math.random() * 100 + 50 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                  animation: `float ${Math.random() * 3 + 3}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 px-8 sm:px-12 lg:px-16 py-16 text-center">
            <div
              className={`text-6xl mb-6 transform transition-all duration-500 ${
                isHovered ? 'scale-110 rotate-12' : ''
              }`}
            >
              🎮
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              지금 바로 시작하세요!
            </h2>

            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              무료로 가입하고 수백 개의 흥미로운 퀴즈에 도전해보세요.
              매일 새로운 문제가 업데이트됩니다.
            </p>

            {/* Email form */}
            <form
              onSubmit={handleSubmit}
              className="max-w-md mx-auto mb-6"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  className="flex-1 px-6 py-4 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-purple-600 font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  시작하기 →
                </button>
              </div>
            </form>

            <p className="text-white/70 text-sm">
              이미 계정이 있으신가요?{' '}
              <a
                href="#"
                className="underline hover:text-white transition-colors"
              >
                로그인
              </a>
            </p>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>무료 가입</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>광고 없음</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>언제든 취소</span>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
      </div>
    </div>
  )
}

export default CTA
