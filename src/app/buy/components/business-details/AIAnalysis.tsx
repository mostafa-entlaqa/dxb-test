"use client"

import { useState, useEffect } from "react"
import { Business } from "../../type"

export default function AIAnalysis({ isUnlocked, business }: { isUnlocked: boolean, business: Business }) {
  const [score, setScore] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setScore((prevScore) => {
        if (prevScore < 85) {
          return prevScore + 1
        }
        clearInterval(timer)
        return prevScore
      })
    }, 20)

    return () => clearInterval(timer)
  }, [])

  const getColor = (score: number) => {
    if (score < 33) return "text-red-500"
    if (score < 66) return "text-orange-500"
    return "text-green-500"
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-blue-800">AI Analysis</h2>
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200 stroke-current"
              strokeWidth="10"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
            ></circle>
            <circle
              className={`${getColor(score)} stroke-current`}
              strokeWidth="10"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              strokeDasharray={`${score * 2.51} 251.2`}
              transform="rotate(-90 50 50)"
            ></circle>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-4xl font-bold ${getColor(score)}`}>{score}%</span>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-gray-700">
          Based on our AI analysis, this opportunity scores <span className="font-semibold">{score}%</span> on our
          investment potential scale. The business shows strong financial performance with consistent revenue growth
          over the past five years. The profit margins are healthy, indicating good operational efficiency. The market
          position and growth potential in the e-commerce sector further enhance the attractiveness of this opportunity.
        </p>
        <p className="mt-4 text-gray-700">
          However, potential investors should conduct thorough due diligence, particularly focusing on:
        </p>
        <ul className="list-disc list-inside mt-2 text-gray-700">
          <li>Sustainability of the current growth rate</li>
          <li>Potential market risks and competition</li>
          <li>Scalability of the business model</li>
        </ul>
      </div>
    </div>
  )
}

