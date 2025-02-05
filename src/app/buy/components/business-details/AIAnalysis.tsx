"use client"

import { useState } from "react"
import { Business } from "../../type"

interface AIAnalysisProps {
  isUnlocked: boolean
  aiData: {
    strength: number
    deepAnalysis: {
      'Business overview': string
      'Deal assessment': string
      'Financial analysis': string
      'Market overview': string
      'Standard AI disclaimer': string
    }
  }
}

export default function AIAnalysis({ isUnlocked, aiData }: AIAnalysisProps) {
  const getColor = (score: number) => {
    if (score < 33) return "text-red-500"
    if (score < 66) return "text-orange-500"
    return "text-green-500"
  }

  if (!isUnlocked) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600">Unlock this listing to view AI Analysis</p>
      </div>
    )
  }

  const analysis = aiData.deepAnalysis

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
              className={`${getColor(aiData.strength)} stroke-current`}
              strokeWidth="10"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              strokeDasharray={`${aiData.strength * 2.51} 251.2`}
              transform="rotate(-90 50 50)"
            ></circle>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-4xl font-bold ${getColor(aiData.strength)}`}>{aiData.strength}%</span>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="text-gray-700">
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Business Overview</h3>
            <p>{analysis['Business overview']}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Deal Assessment</h3>
            <p>{analysis['Deal assessment']}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Financial Analysis</h3>
            <p>{analysis['Financial analysis']}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Market Overview</h3>
            <p>{analysis['Market overview']}</p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 italic">
              {analysis['Standard AI disclaimer']}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

