'use client'

import { useEffect, useRef, useState } from 'react'
import { Trophy } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Stat {
  value: number
  suffix?: string
  label: string
  showIcon?: boolean
}

export default function ImpactStats() {
  const [stats, setStats] = useState<Stat[]>([
    { value: 15, label: "ans d'impact", showIcon: true },
    { value: 100, suffix: '+', label: 'actions réalisées' },
    { value: 500, suffix: '+', label: 'personnes touchées' },
  ])

  useEffect(() => {
    async function loadStats() {
      try {
        const supabase = createClient()
        const { data: config } = await supabase
          .from('site_config')
          .select('stat_1_value, stat_1_suffix, stat_1_label, stat_2_value, stat_2_suffix, stat_2_label, stat_3_value, stat_3_suffix, stat_3_label')
          .limit(1)
          .maybeSingle()

        if (config) {
          setStats([
            {
              value: config.stat_1_value ?? 15,
              suffix: config.stat_1_suffix || '',
              label: config.stat_1_label || "ans d'impact",
              showIcon: true
            },
            {
              value: config.stat_2_value ?? 100,
              suffix: config.stat_2_suffix || '+',
              label: config.stat_2_label || 'actions réalisées'
            },
            {
              value: config.stat_3_value ?? 500,
              suffix: config.stat_3_suffix || '+',
              label: config.stat_3_label || 'personnes touchées'
            }
          ])
        }
      } catch (e) {
        console.error('Erreur chargement statistiques:', e)
      }
    }

    loadStats()
  }, [])

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
