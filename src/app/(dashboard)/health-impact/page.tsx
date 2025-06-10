import HealthImpactCalculator from '@/components/(displays)/HealthImpactCalculator';

export default function HealthImpactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6 py-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Personal Health Impact Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Understand how air quality affects your health.
          </p>
        </div>
        <HealthImpactCalculator />
      </div>
    </div>
  );
}