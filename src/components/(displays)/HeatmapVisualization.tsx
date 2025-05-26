'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { GoogleMap, useLoadScript, HeatmapLayer } from '@react-google-maps/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AllConditionsData, HeatmapDataPoint } from '@/lib/types'
import { Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeatmapVisualizationProps {
  apiKey: string;
}

const containerStyle = {
  width: '100%',
  height: '600px'
}

const defaultCenter = {
  lat: 20,
  lng: 0
}

const AQI_GRADIENT = [
  'rgba(0, 228, 0, 0)',
  'rgba(0, 228, 0, 1)',
  'rgba(255, 255, 0, 1)',
  'rgba(255, 126, 0, 1)',
  'rgba(255, 0, 0, 1)',
  'rgba(143, 63, 151, 1)',
  'rgba(126, 0, 35, 1)'
];

const libraries: ("visualization" | "marker" | "places")[] = ["visualization", "marker", "places"];

export default function HeatmapVisualization({ apiKey }: HeatmapVisualizationProps) {
  const [heatmapData, setHeatmapData] = useState<google.maps.visualization.WeightedLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxIntensity, setMaxIntensity] = useState<number>(300);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: libraries,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/be/v1/map-data/all');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Failed to fetch data: ${response.statusText}`);
        }
        const result: AllConditionsData = await response.json();

        if (!result.items || result.items.length === 0) {
          setHeatmapData([]);
          setError("No data available to display on the heatmap.");
          setMaxIntensity(50);
          return;
        }

        const points = result.items.map(item => ({
          location: new google.maps.LatLng(item.latitude, item.longitude),
          weight: item.aqi
        }));
        setHeatmapData(points);

        const maxAqiInData = result.items.reduce((max, item) => Math.max(max, item.aqi), 0);
        setMaxIntensity(Math.max(maxAqiInData, 50));

      } catch (err: any) {
        console.error("Error fetching heatmap data:", err);
        setError(err.message || "An unknown error occurred while fetching data.");
        setHeatmapData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded) {
        fetchData();
    }
  }, [isLoaded]);


  if (loadError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Map Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            <p>Error loading Google Maps. Please try refreshing the page.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded || isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Air Quality Heatmap</CardTitle>
          <CardDescription>Visualizing real-time air quality index across locations.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center" style={{ height: containerStyle.height }}>
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="ml-3 text-lg">Loading map and data...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            <p>{error}</p>
          </div>
           <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Air Quality Heatmap</CardTitle>
        <CardDescription>
          Interactive map showing air quality index (AQI) distribution.
          Colors range from Green (Good) to Maroon (Hazardous).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={3}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          }}
        >
          {heatmapData.length > 0 && (
            <HeatmapLayer
              data={heatmapData}
              options={{
                radius: 20,
                opacity: 0.8,
                gradient: AQI_GRADIENT,
                maxIntensity: maxIntensity,
                dissipating: true,
              }}
            />
          )}
        </GoogleMap>
        <div className="mt-4 p-2 bg-muted rounded-md text-sm">
          <p><strong>Legend (AQI):</strong></p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
            <span><span style={{color: 'green'}}>●</span> Good (0-50)</span>
            <span><span style={{color: 'yellow'}}>●</span> Moderate (51-100)</span>
            <span><span style={{color: 'orange'}}>●</span> Unhealthy for Sensitive (101-150)</span>
            <span><span style={{color: 'red'}}>●</span> Unhealthy (151-200)</span>
            <span><span style={{color: 'purple'}}>●</span> Very Unhealthy (201-300)</span>
            <span><span style={{color: 'maroon'}}>●</span> Hazardous (301+)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}