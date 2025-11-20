import { useState, useEffect } from 'react'
import Hero from './components/Hero'
import Features from './components/Features'
import QuizCategories from './components/QuizCategories'
import Stats from './components/Stats'
import Footer from './components/Footer'

function App() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="relative">
        <Hero scrollY={scrollY} />
        <Stats />
        <Features />
        <QuizCategories />
        <Footer />
      </div>
    </div>
  )
}

export default App
