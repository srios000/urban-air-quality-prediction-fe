'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PredictionData } from '@/lib/types'

interface PredictionResultProps {
  data: PredictionData
}

const categoryColors = {
  'Good': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  'Moderate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  'Unhealthy for Sensitive Groups': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  'Unhealthy': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  'Very Unhealthy': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  'Hazardous': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
}

export default function PredictionResult({ data }: PredictionResultProps) {
  const colorClass = categoryColors[data.predicted_category as keyof typeof categoryColors] ||
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction Result</CardTitle>
        <CardDescription>AI-powered air quality prediction</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge className={colorClass}>
              {data.predicted_category}
            </Badge>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {data.summary}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Prediction ID</div>
            <div className="font-mono text-xs">{data.prediction_id}</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            Category Probabilities
          </h3>
          <div className="space-y-3">
            {Object.entries(data.probabilities).map(([category, probability]) => {
              const width = Math.round(probability * 100)
              const barColorClass = categoryColors[category as keyof typeof categoryColors] ||
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
              const barColor = barColorClass.split(' ')[0]

              return (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {(probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`${barColor} h-2.5 rounded-full transition-all duration-300`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Date</div>
              <div>{data.date}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Timestamp</div>
              <div>{new Date(data.timestamp).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}