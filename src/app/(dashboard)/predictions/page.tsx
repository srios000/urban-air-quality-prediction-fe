'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PollutantForm from '@/components/(forms)/PollutantForm'
import PredictionResult from '@/components/(displays)/PredictionResult'
import CurrentConditionsForm from '@/components/(forms)/CurrentConditionsForm'
import CurrentConditionsResult from '@/components/(displays)/CurrentConditionsResult'
import { PredictionData, CurrentConditionsData } from '@/lib/types'

export default function AirQualityDisplay() {
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null)
  const [currentConditionsData, setCurrentConditionsData] = useState<CurrentConditionsData | null>(null)

  const handlePredictionResult = (data: PredictionData) => {
    setPredictionData(data)
  }

  const handleCurrentConditionsResult = (data: CurrentConditionsData) => {
    setCurrentConditionsData(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Air Quality Monitor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Real-time air quality monitoring and AI-powered predictions
          </p>
        </div>

        <Tabs defaultValue="prediction" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="prediction">Prediction</TabsTrigger>
            <TabsTrigger value="current">Current Conditions</TabsTrigger>
          </TabsList>

          <TabsContent value="prediction" className="space-y-6">
            <PollutantForm onPredictionResult={handlePredictionResult} />
            {predictionData && <PredictionResult data={predictionData} />}
          </TabsContent>

          <TabsContent value="current" className="space-y-6">
            <CurrentConditionsForm onCurrentConditionsResult={handleCurrentConditionsResult} />
            {currentConditionsData && <CurrentConditionsResult data={currentConditionsData} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}