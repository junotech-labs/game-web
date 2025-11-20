import { useState, useEffect, useRef } from 'react'

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const stats = [
    { value: 1000, label: '퀴즈 문제', suffix: '+', icon: '📝' },
    { value: 50, label: '카테고리', suffix: '+', icon: '🎨' },
    { value: 10000, label: '참여 유저', suffix: '+', icon: '👥' },
    { value: 95, label: '만족도', suffix: '%', icon: '⭐' },
  ]

  const [displayValues, setDisplayValues] = useState(stats.map(() => 0))

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setDisplayValues(
        stats.map((stat) => Math.floor(stat.value * progress))
      )

      if (currentStep >= steps) {
        clearInterval(timer)
        setDisplayValues(stats.map((stat) => stat.value))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [isVisible])

  return (
    <div ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/40 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <div className="text-5xl mb-4 animate-bounce-slow">{stat.icon}</div>
              <div className="text-4xl font-bold text-gradient from-purple-600 to-pink-600 mb-2">
                {displayValues[index].toLocaleString()}{stat.suffix}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Stats
