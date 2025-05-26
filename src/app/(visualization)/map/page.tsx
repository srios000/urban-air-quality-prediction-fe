import HeatmapVisualization from '@/components/(displays)/HeatmapVisualization'
import { ThemeToggle } from '@/components/(utility)/themeToggle';

export default function MapVisualizationPage() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto space-y-6 text-center py-10">
          <h1 className="text-4xl font-bold text-red-700 dark:text-red-400">Configuration Error</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Google Maps API key is not configured. Please set the Maps_API_KEY environment variable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="mt-4 mr-3 flex justify-end">
        <ThemeToggle />
      </div>
      <div className="max-w-7xl mx-auto space-y-6 py-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Global Air Quality Visualization
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Real-time AQI data represented on an interactive heatmap.
          </p>
        </div>
        <HeatmapVisualization apiKey={apiKey} />
      </div>
    </div>
  )
}