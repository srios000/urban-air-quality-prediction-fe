import HistoryDisplay from "@/components/(displays)/HistoryDisplay";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6 py-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Historical Air Quality Data
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Explore past air quality data and trends.
          </p>
        </div>
        <HistoryDisplay />
      </div>
    </div>
  );
}