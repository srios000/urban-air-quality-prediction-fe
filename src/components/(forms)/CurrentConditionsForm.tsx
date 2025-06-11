'use client'
import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Loader2, Map } from 'lucide-react'
import { toast } from 'sonner'
import { CurrentConditionsData } from '@/lib/types'
import MapPicker from '../(utility)/ServerMapPicker'

interface CurrentConditionsFormProps {
  onCurrentConditionsResult: (data: CurrentConditionsData) => void
}

const API_URL = 'https://uaqcp-lai25-rm094.up.railway.app';

export default function CurrentConditionsForm({ onCurrentConditionsResult }: CurrentConditionsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showMapPicker, setShowMapPicker] = useState(false)
  const [mapKey, setMapKey] = useState(0)
  const [coordinates, setCoordinates] = useState({
    latitude: '',
    longitude: ''
  })

  useEffect(() => {
    return () => {
      if (window.google) {
        console.log('Cleaning up Google Maps resources')
        window.google.maps.event.clearInstanceListeners(window.google.maps.event)
      }
    }
  }, [])

  const handleInputChange = (field: 'latitude' | 'longitude', value: string) => {
    setCoordinates(prev => ({ ...prev, [field]: value }))
  }

  const handleMapCoordinatesSelect = useCallback((latitude: string, longitude: string) => {
    setCoordinates({ latitude, longitude })
    setShowMapPicker(false)
    toast.success('Coordinates updated from map!')
  }, [])

  const handleBackToForm = useCallback(() => {
    setShowMapPicker(false)
  }, [])

  const handleShowMapPicker = useCallback(() => {
    setMapKey(prev => prev + 1)
    setShowMapPicker(true)
  }, [])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toString()
          const lng = position.coords.longitude.toString()
          
          setCoordinates({
            latitude: lat,
            longitude: lng
          })
          
          toast.success('Location updated successfully!')
        },
        (error) => {
          toast.error(`Error getting location: ${error.message}`)
        }
      )
    } else {
      toast.error('Geolocation is not supported by this browser.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!coordinates.latitude || !coordinates.longitude) {
      toast.error('Please enter both latitude and longitude or use your current location.')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/v1/current-conditions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          latitude: parseFloat(coordinates.latitude),
          longitude: parseFloat(coordinates.longitude),
          language_code: 'en'
        })
      })
      console.log('API_URL:', API_URL)

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      onCurrentConditionsResult(data)
      toast.success('Current conditions loaded successfully!')
    } catch (error: unknown) {
      console.error('Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      toast.error('Failed to get air quality data: ' + errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {showMapPicker ? (
        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBackToForm}
            className="mb-4"
          >
            ← Back to Form
          </Button>
          <MapPicker
            key={`map-picker-${mapKey}`}
            onCoordinatesSelect={handleMapCoordinatesSelect}
            initialCoordinates={coordinates.latitude && coordinates.longitude ? coordinates : undefined}
          />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Current Air Quality</CardTitle>
            <CardDescription>
              Get real-time air quality data for your location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g. 40.7128"
                    value={coordinates.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g. -74.0060"
                    value={coordinates.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  className="flex-1"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Use Current Location
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleShowMapPicker}
                  className="flex-1"
                >
                  <Map className="mr-2 h-4 w-4" />
                  Pick on Map
                </Button>
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                ) : (
                  'Get Current Conditions'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}