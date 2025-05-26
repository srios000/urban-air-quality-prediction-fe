'use client'

import React, { useMemo, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MapPin, Activity } from 'lucide-react'
import {
  AQIIndex,
  HealthRecommendations,
  PredictionResult,
  PollutantData as TransformedPollutantData,
} from '@/lib/types'

interface ApiLocationData {
  latitude: number
  longitude: number
  formatted_address: string | null
  display_name: string | null
  place_id: string | null
  source: string | null
  country: string
  city: string
}

interface ApiPollutantConcentration {
  value: number
  units: string
}

interface ApiPollutantEntry {
  code: string
  display_name: string
  full_name: string
  concentration: ApiPollutantConcentration
  additional_info?: {
    sources: string
    effects: string
  }
}

interface ApiExternalAqData {
  indexes: AQIIndex[]
  pollutants: ApiPollutantEntry[]
  health_recommendations: HealthRecommendations
}

interface ReceivedDataProps {
  location: ApiLocationData
  external_aq_data?: ApiExternalAqData
  prediction?: PredictionResult
  current_pollutants_summary?: Record<string, unknown>
  timestamp?: string
}

interface CurrentConditionsResultProps {
  data: ReceivedDataProps
}

const categoryColors = {
  GOOD: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  MODERATE:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  UNHEALTHY_FOR_SENSITIVE_GROUPS:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  UNHEALTHY: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  VERY_UNHEALTHY:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  HAZARDOUS:
    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
}

const predictionCategoryColors = {
  Good: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  Moderate:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  'Unhealthy for Sensitive Groups':
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  Unhealthy: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  'Very Unhealthy':
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  Hazardous:
    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
}

function getPollutantName(code: string): string {
  const names: Record<string, string> = {
    pm25: 'PM2.5',
    pm10: 'PM10',
    o3: 'Ozone (O₃)',
    no2: 'Nitrogen Dioxide (NO₂)',
    so2: 'Sulfur Dioxide (SO₂)',
    co: 'Carbon Monoxide (CO)',
  }
  return names[code] || code.toUpperCase()
}

function getPollutantUnit(code: string): string {
  const units: Record<string, string> = {
    pm25: 'μg/m³',
    pm10: 'μg/m³',
    o3: 'ppb',
    no2: 'ppb',
    so2: 'ppb',
    co: 'ppb',
  }
  return units[code] || ''
}

function formatAQICategory(category: string): string {
  const format: Record<string, string> = {
    GOOD: 'Good',
    MODERATE: 'Moderate',
    UNHEALTHY_FOR_SENSITIVE_GROUPS: 'Unhealthy for Sensitive Groups',
    UNHEALTHY: 'Unhealthy',
    VERY_UNHEALTHY: 'Very Unhealthy',
    HAZARDOUS: 'Hazardous',
  }
  return format[category] || category
}

function formatRecommendationKey(key: string): string {
  const format: Record<string, string> = {
    generalPopulation: 'General Population',
    children: 'Children',
    elderly: 'Elderly',
    heartDiseasePopulation: 'Heart Disease Population',
    lungDiseasePopulation: 'Lung Disease Population',
    pregnantWomen: 'Pregnant Women',
    sportsPopulation: 'Sports Population',
    athletes: 'Athletes',
  }
  return format[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
}

export default function CurrentConditionsResult({
  data,
}: CurrentConditionsResultProps) {
  const {
    location: apiLocation,
    external_aq_data,
    prediction: apiPrediction,
  } = data

  const [finalLocationName, setFinalLocationName] = useState<string>('Loading location...');

  useEffect(() => {
    const { location: currentApiLocation } = data;


    const constructDisplayName = (cityArea: string | null, countryCode: string | null): string => {
      const parts = [];
      if (cityArea && cityArea !== 'Unknown' && cityArea !== 'Location data unavailable') {
        parts.push(cityArea);
      }
      if (countryCode) {
        parts.push(countryCode.toUpperCase());
      }
      if (parts.length > 0) {
        return parts.join(', ');
      }
      if (currentApiLocation.latitude && currentApiLocation.longitude) {
        return `${currentApiLocation.latitude.toFixed(4)}, ${currentApiLocation.longitude.toFixed(4)}`;
      }
      return 'Location details unavailable';
    };

    const initialCityArea =
      currentApiLocation.city && currentApiLocation.city !== 'Unknown'
        ? currentApiLocation.city
        : currentApiLocation.display_name ||
          currentApiLocation.formatted_address ||
          null;

    const initialFullName = constructDisplayName(initialCityArea, currentApiLocation.country);

    const needsReverseGeocoding =
      (!currentApiLocation.city || currentApiLocation.city === 'Unknown') &&
      !currentApiLocation.display_name &&
      !currentApiLocation.formatted_address;

    if (
      needsReverseGeocoding &&
      currentApiLocation.latitude &&
      currentApiLocation.longitude
    ) {
      setFinalLocationName(`Resolving location for ${currentApiLocation.latitude.toFixed(2)}, ${currentApiLocation.longitude.toFixed(2)}...`);
      
      if (window.google && window.google.maps && window.google.maps.Geocoder) {
        const geocoder = new window.google.maps.Geocoder();
        const latLng = new window.google.maps.LatLng(currentApiLocation.latitude, currentApiLocation.longitude);

        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            const bestResult = results[0];
            const city = bestResult.address_components.find(c => c.types.includes('locality'))?.long_name;
            const adminArea = bestResult.address_components.find(c => c.types.includes('administrative_area_level_1'))?.long_name;
            const geocodedCountry = bestResult.address_components.find(c => c.types.includes('country'))?.short_name;

            let geocodedCityArea = city || adminArea || null;
            if (!geocodedCityArea && bestResult.formatted_address) {
                const addressParts = bestResult.formatted_address.split(', ');
                if (addressParts.length > 1) {
                    if (addressParts.length > 1 && geocodedCountry && addressParts[addressParts.length-1].toUpperCase() === geocodedCountry.toUpperCase()){
                        geocodedCityArea = addressParts.slice(0, -1).join(', ');
                    } else {
                        geocodedCityArea = addressParts[0]; 
                    }
                } else {
                    geocodedCityArea = bestResult.formatted_address;
                }
            }
            
            setFinalLocationName(constructDisplayName(geocodedCityArea, geocodedCountry || currentApiLocation.country));
          } else {
            console.warn('Reverse geocoding failed or no results:', status);
            setFinalLocationName(initialFullName);
          }
        });
      } else {
        console.warn('Google Maps Geocoder not available for reverse geocoding. Using API provided location.');
        setFinalLocationName(initialFullName);
      }
    } else {
      setFinalLocationName(initialFullName);
    }
  }, [data]);


  const pollutantsForDisplay = useMemo(() => {
    const pData: TransformedPollutantData = {
      pm25: NaN,
      pm10: NaN,
      o3: NaN,
      no2: NaN,
      so2: NaN,
      co: NaN,
    };
    if (external_aq_data?.pollutants) {
      external_aq_data.pollutants.forEach((p) => {
        if (p.code in pData) {
          pData[p.code as keyof TransformedPollutantData] = p.concentration.value;
        }
      });
    }
    return pData;
  }, [external_aq_data?.pollutants]);


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="font-medium">
              {finalLocationName}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {apiLocation.latitude?.toFixed(6)}, {apiLocation.longitude?.toFixed(6)}
            </div>
          </div>
        </CardContent>
      </Card>

      {external_aq_data?.indexes && external_aq_data.indexes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Air Quality Index
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {external_aq_data.indexes.map((index, i) => {
              const colorClass =
                categoryColors[index.category as keyof typeof categoryColors] ||
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' 

              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {index.displayName}
                    </span>
                    <Badge className={colorClass}>{index.aqi}</Badge>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className={`${colorClass.split(' ')[0]} h-2.5 rounded-full transition-all duration-300`}
                      style={{
                        width: `${Math.min((index.aqi / 500) * 100, 100)}%`, 
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatAQICategory(index.category)}: {index.categoryDescription || 'No description available.'}
                  </p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {Object.keys(pollutantsForDisplay).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pollutant Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(pollutantsForDisplay).map(([key, value]) => (
                <div
                  key={key}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow"
                >
                  <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {getPollutantName(key)}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof value === 'number' ? value.toFixed(2) : 'N/A'}{' '}
                    {getPollutantUnit(key)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {external_aq_data?.health_recommendations &&
        Object.keys(external_aq_data.health_recommendations).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Health Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(external_aq_data.health_recommendations).map(
                ([key, value]) => {
                  if (!value) return null 

                  return (
                    <div key={key}>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {formatRecommendationKey(key)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {value}
                      </p>
                    </div>
                  )
                },
              )}
            </CardContent>
          </Card>
        )}

      {apiPrediction && (
        <Card>
          <CardHeader>
            <CardTitle>AI Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            {apiPrediction.error ? (
              <Alert variant="destructive">
                <AlertDescription>{apiPrediction.error}</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      predictionCategoryColors[
                        apiPrediction.predicted_category as keyof typeof predictionCategoryColors
                      ] || 'bg-gray-200 text-gray-800'
                    }
                  >
                    {apiPrediction.predicted_category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {apiPrediction.summary}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
