import { MapPickerClient } from './MapPicker'

export default function ServerMapPicker({ 
  onCoordinatesSelect, 
  initialCoordinates 
}: {
  onCoordinatesSelect: (latitude: string, longitude: string) => void
  initialCoordinates?: { latitude: string; longitude: string }
}) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  
  // console.log('Environment check:', {
  //   hasApiKey: !!apiKey,
  //   nodeEnv: process.env.NODE_ENV,
  //   keyLength: apiKey?.length || 0
  // })
  
  if (!apiKey) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-red-800">
          <h3 className="font-semibold">Map configuration error</h3>
          <p>API key not configured</p>
          <p className="text-sm">Check your .env.local file</p>
        </div>
      </div>
    )
  }

  return (
    <MapPickerClient
      apiKey={apiKey}
      onCoordinatesSelect={onCoordinatesSelect}
      initialCoordinates={initialCoordinates}
    />
  )
}