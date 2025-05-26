'use client'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, MapPin, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { PredictionData, PredictionInputData } from '@/lib/types'
import ServerMapPicker from '../(utility)/ServerMapPicker'

interface PollutantFormProps {
  onPredictionResult: (data: PredictionData) => void
}

const initialFormData = {
  date: new Date().toISOString().split('T')[0],
  country: '',
  loc: '',
  pm25: '',
  pm10: '',
  o3: '',
  no2: '',
  so2: '',
  co: ''
}

export default function PollutantForm({ onPredictionResult }: PollutantFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [autoFill, setAutoFill] = useState(true)
  const [formData, setFormData] = useState(initialFormData)
  const [showMapPicker, setShowMapPicker] = useState(false)
  const [mapKey, setMapKey] = useState(0)
  const [coordinates, setCoordinates] = useState({
    latitude: '',
    longitude: ''
  })

  useEffect(() => {
    setIsLoading(false)
  }, [])

  useEffect(() => {
    console.log('Loading state changed:', isLoading)
  }, [isLoading])


  const pollutants = [
    { id: 'pm25', label: 'PM2.5', placeholder: '25.4', unit: 'μg/m³' },
    { id: 'pm10', label: 'PM10', placeholder: '45.2', unit: 'μg/m³' },
    { id: 'o3', label: 'Ozone (O₃)', placeholder: '35.8', unit: 'ppb' },
    { id: 'no2', label: 'Nitrogen Dioxide (NO₂)', placeholder: '21.3', unit: 'ppb' },
    { id: 'so2', label: 'Sulfur Dioxide (SO₂)', placeholder: '5.1', unit: 'ppb' },
    { id: 'co', label: 'Carbon Monoxide (CO)', placeholder: '0.7', unit: 'ppm' }
  ]

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setCoordinates({ latitude: '', longitude: '' })
    setAutoFill(false)
    setIsLoading(false)
    setShowMapPicker(false)
  }, [])

  const reverseGeocodeCoordinates = useCallback(async (latitude: string, longitude: string) => {
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      toast.error('Google Maps Geocoder not available. Cannot fetch address.');
      console.error('Google Maps Geocoder not available.');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    const latLng = new window.google.maps.LatLng(parseFloat(latitude), parseFloat(longitude));
    let extractedCountry = '';
    let extractedLoc = '';
    let bestFormattedAddress = '';

    try {
      const response = await geocoder.geocode({ location: latLng });
      
      if (response.results && response.results.length > 0) {
        for (let i = 0; i < Math.min(response.results.length, 3); i++) {
          const result = response.results[i];
          let tempCountry = '';
          let tempLoc = '';

          for (const component of result.address_components) {
            if (component.types.includes('country')) {
              tempCountry = component.long_name;
            }
            if (component.types.includes('locality')) {
              tempLoc = component.long_name;
            } else if (!tempLoc && component.types.includes('postal_town')) {
              tempLoc = component.long_name;
            } else if (!tempLoc && component.types.includes('administrative_area_level_1')) {
              tempLoc = component.long_name;
            } else if (!tempLoc && component.types.includes('administrative_area_level_2')) {
                tempLoc = component.long_name;
            }
          }

          if (tempCountry && tempLoc) {
            extractedCountry = tempCountry;
            extractedLoc = tempLoc;
            bestFormattedAddress = result.formatted_address;
            break;
          } else if (tempCountry && !extractedCountry) {
            extractedCountry = tempCountry;
            bestFormattedAddress = result.formatted_address;
          }
        }

        if (extractedCountry && !extractedLoc && bestFormattedAddress) {
          const addressParts = bestFormattedAddress.split(',');
          if (addressParts.length > 1) {
            for (let j = 0; j < addressParts.length -1; j++) {
                const part = addressParts[j].trim();
                if (part.toLowerCase() !== extractedCountry.toLowerCase() &&
                    !/^\d{5,}$/.test(part) &&
                    !/^[A-Z0-9]{4}\+[A-Z0-9]{2,}$/i.test(part) &&
                    part.length > 2) {
                    extractedLoc = part;
                    break;
                }
            }
          }
        }
        if (!extractedCountry && bestFormattedAddress) {
            const addressParts = bestFormattedAddress.split(',');
            if (addressParts.length > 0) {
                const potentialCountry = addressParts[addressParts.length - 1].trim();
                if (isNaN(parseInt(potentialCountry)) && !/^[A-Z0-9]{4}\+[A-Z0-9]{2,}$/i.test(potentialCountry) && potentialCountry.length > 2) {
                    extractedCountry = potentialCountry;
                }
            }
        }


        if (extractedCountry || extractedLoc) {
          setFormData(prev => ({
            ...prev,
            country: extractedCountry || prev.country,
            loc: extractedLoc || prev.loc,
          }));
          const message = `Location auto-filled: ${extractedLoc ? extractedLoc + ", " : ""}${extractedCountry || ""}`;
          toast.success(message.replace(/, $/, ''));
        } else {
          toast.error('Could not extract detailed Country/Location. Please enter manually or try a different map point.');
        }

      } else {
        toast.error('No address found for the selected coordinates.');
        console.error('Geocoder failed due to: ZERO_RESULTS or no results array');
      }
    } catch (error: unknown) {
      let errorMessage = 'An unknown geocoding error occurred';
      if (typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string') {
          errorMessage = `Geocoder failed with status: ${error.code}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      toast.error(`Geocoding request failed: ${errorMessage}`);
      console.error('Geocoding error:', error);
    }
  }, []);


  const handleMapCoordinatesSelect = useCallback(async (latitude: string, longitude: string) => {
    setCoordinates({ latitude, longitude });
    setShowMapPicker(false);
    toast.info('Fetching address for selected map coordinates...');
    await reverseGeocodeCoordinates(latitude, longitude);
  }, [reverseGeocodeCoordinates]);


  const handleBackToForm = useCallback(() => {
    setShowMapPicker(false);
  }, []);

  const handleShowMapPicker = useCallback(() => {
    setMapKey(prev => prev + 1); 
    setShowMapPicker(true);
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLoading) {
      console.log('Form submission blocked - already loading')
      return
    }
    
    if (autoFill && (!formData.country.trim() || !formData.loc.trim())) {
      toast.warning('Please enter both Country and Location when using auto-fill, or pick from map.')
      return
    }

    if (!autoFill) {
      const hasAtLeastOnePollutant = pollutants.some(p => 
        formData[p.id as keyof typeof formData].trim() !== ''
      )
      
      if (!hasAtLeastOnePollutant) {
        toast.warning('Please enter at least one pollutant value or use auto-fill.')
        return
      }
    }

    console.log('Starting prediction request...')
    setIsLoading(true)
    
    try {
      const requestData: PredictionInputData = {
        date: formData.date,
        country: formData.country.trim(),
        loc: formData.loc.trim(),
        auto_fill_pollutants: autoFill
      }

      if (!autoFill) {
        if (formData.pm25.trim()) requestData.pm25 = parseFloat(formData.pm25)
        if (formData.pm10.trim()) requestData.pm10 = parseFloat(formData.pm10)
        if (formData.o3.trim()) requestData.o3 = parseFloat(formData.o3)
        if (formData.no2.trim()) requestData.no2 = parseFloat(formData.no2)
        if (formData.so2.trim()) requestData.so2 = parseFloat(formData.so2)
        if (formData.co.trim()) requestData.co = parseFloat(formData.co)
      }

      const response = await fetch('/api/be/v1/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Network response was not ok')
      }

      const data = await response.json()
      onPredictionResult(data)
      toast.success('Prediction completed successfully!')
    } catch (error: unknown) {
      console.error('Error:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      if (errorMessage.includes('unavailable for this location')) {
        toast.error('Air quality data unavailable for this location. Please try a different location.')
      } else if (errorMessage.includes('Location not found')) {
        toast.error('Location not found. Please check the country and location names.')
      } else {
        toast.error('Failed to get prediction: ' + errorMessage)
      }
    } finally {
      console.log('Prediction request completed, resetting loading state')
      setIsLoading(false)
    }
  }

  const isFormValid = autoFill 
    ? (formData.country.trim() && formData.loc.trim()) 
    : pollutants.some(p => formData[p.id as keyof typeof formData].trim() !== '')

  const buttonDisabled = isLoading || !isFormValid


  if (showMapPicker) {
    return (
      <div className="space-y-4 p-4 md:p-6 mx-auto">
        <Button
          type="button"
          variant="outline"
          onClick={handleBackToForm}
          className="mb-4 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Form
        </Button>
        <ServerMapPicker
          key={`map-picker-${mapKey}`}
          onCoordinatesSelect={handleMapCoordinatesSelect}
          initialCoordinates={coordinates.latitude && coordinates.longitude ? coordinates : undefined}
        />
      </div>
    )
  }

  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle>Air Quality Prediction</CardTitle>
        <CardDescription>
          Enter pollutant levels or pick a location to auto-fill data and predict air quality.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
                readOnly={true}
                className="bg-white dark:bg-slate-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="e.g. United States"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                required={autoFill}
                className="bg-white dark:bg-slate-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loc">Location (City/Region)</Label>
              <Input
                id="loc"
                placeholder="e.g. New York"
                value={formData.loc}
                onChange={(e) => handleInputChange('loc', e.target.value)}
                required={autoFill}
                className="bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleShowMapPicker}
              className="w-full flex items-center justify-center py-3"
            >
              <MapPin className="mr-2 h-5 w-5" /> Pick Location on Map
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="auto-fill"
              checked={autoFill}
              defaultChecked={true}
              onCheckedChange={(checked) => setAutoFill(checked as boolean)}
            />
            <Label htmlFor="auto-fill" className="text-sm font-medium">
              Auto-fill pollutant values from location data (Country and Location needs to be set)
            </Label>
          </div>

          <div className="space-y-1">
            <Label className="text-base font-semibold">Pollutant Levels (Optional if Auto-filling)</Label>
            <p className="text-sm text-muted-foreground">
              {autoFill ? "Pollutant values will be fetched automatically." : "Enter known values manually."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pollutants.map((pollutant) => (
              <div key={pollutant.id} className="space-y-2">
                <Label htmlFor={pollutant.id}>
                  {pollutant.label} ({pollutant.unit})
                </Label>
                <Input
                  id={pollutant.id}
                  type="number"
                  step="0.01"
                  placeholder={autoFill ? 'Auto-filled' : `e.g. ${pollutant.placeholder}`}
                  value={formData[pollutant.id as keyof typeof formData]}
                  onChange={(e) => handleInputChange(pollutant.id, e.target.value)}
                  disabled={autoFill || isLoading}
                  className={autoFill ? 'bg-slate-100 dark:bg-slate-700 cursor-not-allowed' : 'bg-white dark:bg-slate-800'}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={buttonDisabled} 
              className="flex-1 py-3 text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Predicting...
                </div>
              ) : (
                'Predict Air Quality'
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetForm}
              disabled={isLoading}
              className="flex-1 sm:flex-none py-3 text-base"
            >
              Reset Form
            </Button>
          </div>

          {/* Debug info - janlup dihapus */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded">
              <p>Debug Info:</p>
              <p>isLoading: {isLoading.toString()}, isFormValid: {isFormValid.toString()}, buttonDisabled: {buttonDisabled.toString()}</p>
              <p>Coordinates: Lat: {coordinates.latitude || 'N/A'}, Lng: {coordinates.longitude || 'N/A'}</p>
              <p>Form Data: {JSON.stringify(formData)}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
