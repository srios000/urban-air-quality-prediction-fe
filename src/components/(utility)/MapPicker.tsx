'use client'
import { useCallback, useState, useRef } from 'react'
import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Navigation, Search } from 'lucide-react'
import { toast } from 'sonner'

interface MapPickerClientProps {
  apiKey: string
  onCoordinatesSelect: (latitude: string, longitude: string) => void
  initialCoordinates?: {
    latitude: string
    longitude: string
  }
}

const containerStyle = {
  width: '100%',
  height: '384px'
}

const defaultCenter = {
  lat: -2.5489,
  lng: 118.0149
}

const libraries: ("marker" | "places")[] = ["marker", "places"]

const Loader = () => (
  <div className="h-96 w-full rounded-lg shadow-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
    <div className="text-center text-slate-500 dark:text-slate-400">
      <MapPin className="h-8 w-8 mx-auto mb-2 animate-pulse" />
      <p className="text-sm">Loading interactive map...</p>
      <p className="text-xs">Please wait while the map loads</p>
    </div>
  </div>
)

export function MapPickerClient({ apiKey, onCoordinatesSelect, initialCoordinates }: MapPickerClientProps) {
  const mapRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | google.maps.marker.AdvancedMarkerElement | null>(null)
  const geocoderRef = useRef<google.maps.Geocoder | null>(null)
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: libraries,
  })
  
  const [coordinates, setCoordinates] = useState({
    latitude: initialCoordinates?.latitude || '',
    longitude: initialCoordinates?.longitude || ''
  })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(() => {
    if (initialCoordinates?.latitude && initialCoordinates?.longitude) {
      const lat = parseFloat(initialCoordinates.latitude)
      const lng = parseFloat(initialCoordinates.longitude)
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng }
      }
    }
    return null
  })
  
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(() => {
    if (initialCoordinates?.latitude && initialCoordinates?.longitude) {
      const lat = parseFloat(initialCoordinates.latitude)
      const lng = parseFloat(initialCoordinates.longitude)
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng }
      }
    }
    return defaultCenter
  })

  const updateCoordinates = useCallback((lat: number, lng: number) => {
    const latStr = lat.toFixed(6)
    const lngStr = lng.toFixed(6)
    setCoordinates({
      latitude: latStr,
      longitude: lngStr
    })
    setMarkerPosition({ lat, lng })
  }, [])

  const createOrUpdateMarker = useCallback((position: google.maps.LatLngLiteral) => {
    if (!mapRef.current) return

    if (markerRef.current) {
      if ('setMap' in markerRef.current) {
        markerRef.current.setMap(null)
      } else if ('map' in markerRef.current) {
        markerRef.current.map = null
      }
      markerRef.current = null
    }

    try {
      if (window.google?.maps?.marker?.AdvancedMarkerElement) {
        markerRef.current = new google.maps.marker.AdvancedMarkerElement({
          map: mapRef.current,
          position: position,
          gmpDraggable: true,
        })

        markerRef.current.addListener('dragend', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const lat = event.latLng.lat()
            const lng = event.latLng.lng()
            updateCoordinates(lat, lng)
            setMapCenter({ lat, lng })
          }
        })
      } else {
        markerRef.current = new google.maps.Marker({
          map: mapRef.current,
          position: position,
          draggable: true,
          title: 'Selected location'
        })

        markerRef.current.addListener('dragend', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const lat = event.latLng.lat()
            const lng = event.latLng.lng()
            updateCoordinates(lat, lng)
            setMapCenter({ lat, lng })
          }
        })
      }
    } catch (error) {
      console.error('Error creating marker:', error)
      markerRef.current = new google.maps.Marker({
        map: mapRef.current,
        position: position,
        draggable: true,
        title: 'Selected location'
      })

      markerRef.current.addListener('dragend', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const lat = event.latLng.lat()
          const lng = event.latLng.lng()
          updateCoordinates(lat, lng)
          setMapCenter({ lat, lng })
        }
      })
    }
  }, [updateCoordinates])

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      const position = { lat, lng }
      
      updateCoordinates(lat, lng)
      setMapCenter(position)
      createOrUpdateMarker(position)
    }
  }, [updateCoordinates, createOrUpdateMarker])

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
    geocoderRef.current = new google.maps.Geocoder()
    
    setTimeout(() => {
      if (markerPosition) {
        createOrUpdateMarker(markerPosition)
      }
    }, 100)
  }, [markerPosition, createOrUpdateMarker])

  const onUnmount = useCallback(() => {
    if (markerRef.current) {
      if ('setMap' in markerRef.current) {
        markerRef.current.setMap(null)
      } else if ('map' in markerRef.current) {
        markerRef.current.map = null
      }
      markerRef.current = null
    }
    mapRef.current = null
    geocoderRef.current = null
  }, [])

  const getGeocodingErrorMessage = (status: string) => {
    switch (status) {
      case 'ZERO_RESULTS':
        return 'No location found. Please try a different search term or be more specific.'
      case 'OVER_QUERY_LIMIT':
        return 'Too many requests. Please wait a moment and try again.'
      case 'REQUEST_DENIED':
        return 'Search request was denied. Please check your API key permissions.'
      case 'INVALID_REQUEST':
        return 'Invalid search request. Please enter a valid location.'
      case 'UNKNOWN_ERROR':
        return 'An unknown error occurred. Please try again.'
      default:
        return 'Location search failed. Please try again with a different search term.'
    }
  }

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a location to search')
      return
    }

    if (!geocoderRef.current) {
      toast.error('Map is not ready yet. Please wait a moment and try again.')
      return
    }

    setIsSearching(true)
    
    try {
      const { results, status } = await new Promise<{ results: google.maps.GeocoderResult[] | null, status: string }>((resolve, reject) => {
        geocoderRef.current!.geocode(
          { address: searchQuery },
          (results, status) => {
            if (status === 'OK') {
              resolve({ results: results || [], status })
            } else {
              reject(new Error('Geocoding failed: ' + status))
            }
          }
        )
      })

      if (status === 'OK' && results && results.length > 0) {
        const location = results[0].geometry.location
        const lat = location.lat()
        const lng = location.lng()
        
        updateCoordinates(lat, lng)
        setMapCenter({ lat, lng })
        createOrUpdateMarker({ lat, lng })
        
        if (mapRef.current) {
          mapRef.current.setCenter({ lat, lng })
          mapRef.current.setZoom(14)
        }
        
        toast.success(`Location found: ${results[0].formatted_address}`, {
          className: "bg-green-600 text-white",
        });
      } else {
        const userFriendlyMessage = getGeocodingErrorMessage(status)
        toast.error(userFriendlyMessage, {
          className: "bg-red-600 text-white",
        });
      }
      
    } catch (error) {
      console.error('Geocoding error:', error)
      
      const errorMessage = error instanceof Error ? error.message : String(error)
      const statusMatch = errorMessage.match(/Geocoding failed: (.+)/)
      const status = statusMatch ? statusMatch[1] : 'UNKNOWN_ERROR'
      
      const userFriendlyMessage = getGeocodingErrorMessage(status)
      toast.error(userFriendlyMessage, {
        className: "bg-red-600 text-white",
      });
      
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery, updateCoordinates, createOrUpdateMarker])

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.')
      return
    }

    toast.info('Getting your location...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        
        updateCoordinates(lat, lng)
        setMapCenter({ lat, lng })
        createOrUpdateMarker({ lat, lng })
        
        if (mapRef.current) {
          mapRef.current.setCenter({ lat, lng })
          mapRef.current.setZoom(14)
        }
        
        toast.success('Location updated successfully!')
      },
      (error) => {
        let errorMessage = 'Failed to get your location. '
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access and try again.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage += 'Location request timed out. Please try again.'
            break
          default:
            errorMessage += 'An unknown error occurred.'
            break
        }
        
        toast.error(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  const handleUseCoordinates = () => {
    if (!coordinates.latitude || !coordinates.longitude) {
      toast.error('Please select a location first.')
      return
    }

    const lat = parseFloat(coordinates.latitude)
    const lng = parseFloat(coordinates.longitude)

    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Invalid coordinates. Please select a valid location.')
      return
    }

    if (lat < -90 || lat > 90) {
      toast.error('Latitude must be between -90 and 90 degrees.')
      return
    }

    if (lng < -180 || lng > 180) {
      toast.error('Longitude must be between -180 and 180 degrees.')
      return
    }

    onCoordinatesSelect(coordinates.latitude, coordinates.longitude)
    toast.success('Coordinates selected successfully!')
  }

  const handleCoordinateChange = (field: 'latitude' | 'longitude', value: string) => {
    setCoordinates(prev => ({ ...prev, [field]: value }))
    
    const lat = field === 'latitude' ? parseFloat(value) : parseFloat(coordinates.latitude)
    const lng = field === 'longitude' ? parseFloat(value) : parseFloat(coordinates.longitude)
    
    if (!isNaN(lat) && !isNaN(lng)) {
      const position = { lat, lng }
      setMarkerPosition(position)
      setMapCenter(position)
      createOrUpdateMarker(position)
      
      if (mapRef.current) {
        mapRef.current.setCenter(position)
      }
    }
  }

  if (loadError) {
    console.error('Google Maps failed to load:', loadError)
    toast.error('Failed to load Google Maps. Please refresh the page and try again.')
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <MapPin className="h-8 w-8 mx-auto mb-2" />
            <p>Failed to load Google Maps</p>
            <p className="text-sm">Please check your internet connection and try again.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isLoaded) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <Loader />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-slate-800 dark:text-slate-200">
          Air Quality Location Picker
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Click anywhere on the map to select a location, search for a place, or use the &quot;Get My Location&quot; button.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>How to use:</strong> Click anywhere on the map to select a location, search for a place, or use the &quot;Get My Location&quot; button. The latitude and longitude will be displayed below.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search for a location (e.g., New York, London, etc.)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pl-10 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
              />
            </div>
            <Button
              type="button"
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        <div className="relative rounded-lg overflow-hidden shadow-lg">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={markerPosition ? 14 : 5}
            onClick={onMapClick}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              mapId: "DEMO_MAP_ID",
              mapTypeControl: true,
              fullscreenControl: true,
              streetViewControl: false,
              styles: [
                {
                  featureType: 'all',
                  elementType: 'geometry.fill',
                  stylers: [{ color: '#f5f7fa' }]
                }
              ]
            }}
          />
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Selected Location
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label 
                htmlFor="map-latitude" 
                className="text-slate-700 dark:text-slate-300"
              >
                Latitude
              </Label>
              <Input
                id="map-latitude"
                type="number"
                step="any"
                value={coordinates.latitude}
                onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
                className="text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                placeholder="Click on map to set latitude"
              />
            </div>
            <div className="space-y-2">
              <Label 
                htmlFor="map-longitude" 
                className="text-slate-700 dark:text-slate-300"
              >
                Longitude
              </Label>
              <Input
                id="map-longitude"
                type="number"
                step="any"
                value={coordinates.longitude}
                onChange={(e) => handleCoordinateChange('longitude', e.target.value)}
                className="text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                placeholder="Click on map to set longitude"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={getCurrentLocation}
              className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Navigation className="mr-2 h-4 w-4" />
              Get My Location
            </Button>
            <Button
              type="button"
              onClick={handleUseCoordinates}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Use These Coordinates
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}