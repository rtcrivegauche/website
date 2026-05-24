'use client'

import { useEffect, useRef, useState } from 'react'
import { Trophy } from 'lucide-react'

interface Stat {
  value: number
  suffix?: string
  label: string
  showIcon?: boolean
}

export default function ImpactStats() {
  const stats: Stat[] = [
    { value: 15, label: "ans d'impact", showIcon: true },
    { value: 100, suffix: '+', label: 'actions réalisées' },
    { value: 500, suffix: '+', label: 'personnes touchées' },
  ]

  return (
    <section className="bg-gray-100 py-12 md:py-16">
      <div className="max-w-[1320px] mx-auto px-4 md:px-6 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCard({ value, suffix = '', label, showIcon }: Stat) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const increment = value / steps
    const stepDuration = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [isVisible, value])

  return (
    <div ref={ref} className="p-8">
      <div className="flex justify-center items-baseline gap-2 mb-2">
        <span className="text-6xl md:text-7xl font-bold text-[#014F43]">
          {count}{suffix}
        </span>
        {showIcon && <Trophy className="text-[#E11A60]" size={40} strokeWidth={2.5} />}
      </div>
      <p className="text-xl text-gray-600">{label}</p>
    </div>
  )
}
