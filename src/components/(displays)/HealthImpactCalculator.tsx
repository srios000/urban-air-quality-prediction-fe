'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface HealthImpactFormData {
  age: string;
  healthConditions: string[];
  exposureTime: string;
  aqiLevel: string;
  locationName: string;
  countryName: string;
}

interface HealthImpactRecommendation {
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  suggestion: string;
}

interface BackendPredictionResponse {
  prediction_id: string;
  date: string;
  predicted_category: string;
  probabilities: Record<string, number>;
  summary: string;
  timestamp: string;
  location_info?: {
    latitude?: number;
    longitude?: number;
    formatted_address?: string;
    display_name?: string;
    place_id?: string;
    source?: string;
    country?: string | null;
    city?: string | null;
  };
  used_measurements?: {
    source: string;
    timestamp: string;
    pollutants: {
      co?: number;
      no2?: number;
      o3?: number;
      pm10?: number;
      pm25?: number;
      so2?: number;
    };
  };
  input_data: any;
}


const initialFormData: HealthImpactFormData = {
  age: '',
  healthConditions: [],
  exposureTime: '',
  aqiLevel: '',
  locationName: '',
  countryName: '',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';


export default function HealthImpactCalculator() {
  const [formData, setFormData] = useState<HealthImpactFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingAQI, setIsFetchingAQI] = useState(false);
  const [recommendations, setRecommendations] = useState<HealthImpactRecommendation[] | null>(null);
  const [aqiData, setAqiData] = useState<BackendPredictionResponse | null>(null);

  const availableHealthConditions = [
    { id: 'asthma', label: 'Asthma' },
    { id: 'heart_disease', label: 'Heart Disease' },
    { id: 'copd', label: 'COPD (Chronic Obstructive Pulmonary Disease)' },
    { id: 'allergies', label: 'Respiratory Allergies' },
    { id: 'pregnancy', label: 'Pregnancy' },
  ];

  const handleInputChange = (field: keyof HealthImpactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (conditionId: string, checked: boolean) => {
    setFormData(prev => {
      const newHealthConditions = checked
        ? [...prev.healthConditions, conditionId]
        : prev.healthConditions.filter(id => id !== conditionId);
      return { ...prev, healthConditions: newHealthConditions };
    });
  };

  const fetchCurrentAQI = async () => {
    if (!formData.locationName) {
      toast.error("Please enter a location name (e.g., city or regency) to fetch AQI.");
      return;
    }

    if (isFetchingAQI) return;

    setIsFetchingAQI(true);
    toast.info("Fetching current AQI data...");

    const today = new Date().toISOString().split('T')[0];

    const payload = {
      date: today,
      country: formData.countryName || null,
      loc: formData.locationName,
      auto_fill_pollutants: true,
    };

    try {
      const response = await fetch(`${API_URL}/api/v1/predictions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error occurred" }));
        throw new Error(errorData.detail || errorData.message || `Failed to fetch AQI data: ${response.statusText}`);
      }

      const data: BackendPredictionResponse = await response.json();
      setAqiData(data);

      if (data.predicted_category) {
        const categoryToAqi: Record<string, number> = {
            "Good": 25,
            "Moderate": 75,
            "Unhealthy for Sensitive Groups": 125,
            "Unhealthy": 175,
            "Very Unhealthy": 250,
            "Hazardous": 350,
        };
        const estimatedAqi = categoryToAqi[data.predicted_category];

        if (typeof estimatedAqi === 'number') {
            setFormData(prev => ({ ...prev, aqiLevel: estimatedAqi.toString() }));
            toast.success(`AQI level set to ${estimatedAqi} based on predicted category: "${data.predicted_category}"`);
        } else {
            if (data.used_measurements && data.used_measurements.pollutants && typeof data.used_measurements.pollutants.pm25 === 'number') {
                const pm25Value = Math.round(data.used_measurements.pollutants.pm25);
                setFormData(prev => ({ ...prev, aqiLevel: pm25Value.toString() }));
                toast.warning(`Predicted category "${data.predicted_category}" not mapped. Using PM2.5 value: ${pm25Value} as AQI input.`);
            } else {
                toast.error(`Could not determine AQI from category "${data.predicted_category}" and PM2.5 data not available. Please enter AQI manually.`);
            }
        }
      } else if (data.used_measurements && data.used_measurements.pollutants && typeof data.used_measurements.pollutants.pm25 === 'number') {
        const pm25Value = Math.round(data.used_measurements.pollutants.pm25);
        setFormData(prev => ({ ...prev, aqiLevel: pm25Value.toString() }));
        toast.success(`AQI (PM2.5) level updated to: ${pm25Value} (predicted category not available).`);
      } else {
        toast.error("Could not automatically determine AQI level from API response. Please enter manually.");
      }

    } catch (error: any) {
      console.error("Error fetching AQI:", error);
      toast.error(error.message || "Could not fetch AQI data. Please try again or enter manually.");
    } finally {
      setIsFetchingAQI(false);
    }
  };

  const handleAqiInputFocus = () => {
    if (formData.locationName && !isFetchingAQI) {
      fetchCurrentAQI();
    } else if (!formData.locationName && !formData.aqiLevel) {
      toast.info("Enter a location to auto-fetch AQI, or enter AQI manually.");
    }
  };

  const getAqiCategoryInfo = (aqiValue: number): { range: string; name: string } => {
    if (aqiValue <= 50) return { range: "0-50", name: "Good" };
    if (aqiValue <= 100) return { range: "51-100", name: "Moderate" };
    if (aqiValue <= 150) return { range: "101-150", name: "Unhealthy for Sensitive Groups" };
    if (aqiValue <= 200) return { range: "151-200", name: "Unhealthy" };
    if (aqiValue <= 300) return { range: "201-300", name: "Very Unhealthy" };
    return { range: "301-500+", name: "Hazardous" };
  };

  const calculateImpact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRecommendations(null);

    if (!formData.age || !formData.exposureTime || !formData.aqiLevel) {
      toast.error("Please fill in Age, Exposure Time, and AQI Level.");
      setIsLoading(false);
      return;
    }
    const age = parseInt(formData.age);
    const exposure = parseFloat(formData.exposureTime);
    const aqi = parseInt(formData.aqiLevel);

    if (isNaN(age) || age <= 0 || age > 120) {
        toast.error("Please enter a valid age (1-120).");
        setIsLoading(false);
        return;
    }
    if (isNaN(exposure) || exposure < 0) {
        toast.error("Please enter a valid exposure time (>= 0).");
        setIsLoading(false);
        return;
    }
    if (isNaN(aqi) || aqi < 0 || aqi > 500) {
        toast.error("Please enter a valid AQI level (0-500).");
        setIsLoading(false);
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const newRecommendations: HealthImpactRecommendation[] = [];
    const aqiInfo = getAqiCategoryInfo(aqi);

    if (aqi > 300) {
        newRecommendations.push({
            severity: 'critical',
            message: `Hazardous AQI (${aqiInfo.range}). Health warning of emergency conditions.`,
            suggestion: 'Everyone should avoid all outdoor exertion. Remain indoors and keep activity levels low.'
        });
    } else if (aqi > 200) {
        newRecommendations.push({
            severity: 'critical', 
            message: `Very Unhealthy AQI (${aqiInfo.range}). Health alert: everyone may experience more serious health effects.`,
            suggestion: 'Everyone should avoid prolonged or heavy exertion. Consider remaining indoors and rescheduling outdoor activities.'
        });
    } else if (aqi > 150) {
      newRecommendations.push({
        severity: 'high',
        message: `Unhealthy AQI (${aqiInfo.range}). Everyone may begin to experience health effects.`,
        suggestion: 'Reduce prolonged or heavy exertion. Take more breaks during outdoor activities.'
      });
    } else if (aqi > 100) {
      newRecommendations.push({
        severity: 'medium',
        message: `AQI (${aqiInfo.range}) is Unhealthy for Sensitive Groups.`,
        suggestion: 'People with heart or lung disease, older adults, children, and teens should reduce prolonged or heavy exertion.'
      });
    } else if (aqi > 50) {
      newRecommendations.push({
        severity: 'low', 
        message: `Moderate AQI (${aqiInfo.range}). Air quality is acceptable.`,
        suggestion: 'Unusually sensitive individuals should consider reducing prolonged or heavy exertion.'
      });
    } else {
      newRecommendations.push({
        severity: 'low',
        message: `Good AQI level (${aqiInfo.range}). Air quality is considered satisfactory.`,
        suggestion: 'Enjoy your outdoor activities!'
      });
    }

    if (age > 65 && aqi > 50) { 
      newRecommendations.push({
        severity: aqi > 100 ? 'high' : 'medium',
        message: `Older adults may be more sensitive to air quality in the ${aqiInfo.name} range (AQI ${aqiInfo.range}).`,
        suggestion: 'Pay close attention to any symptoms and reduce exposure if necessary. Consult a doctor if symptoms worsen.'
      });
    }
     if (age < 6 && aqi > 50) { 
      newRecommendations.push({
        severity: aqi > 100 ? 'high' : 'medium',
        message: `Young children may be more sensitive to air quality in the ${aqiInfo.name} range (AQI ${aqiInfo.range}).`,
        suggestion: 'Limit prolonged outdoor exertion, especially in areas with higher pollution.'
      });
    }


    formData.healthConditions.forEach(condition => {
        if (condition === 'asthma' && aqi > 50) {
            newRecommendations.push({
                severity: aqi > 100 ? 'high' : 'medium',
                message: `Individuals with asthma should be particularly cautious with ${aqiInfo.name} air quality (AQI ${aqiInfo.range}).`,
                suggestion: 'Keep your reliever inhaler handy. Avoid areas with known pollution sources. Follow your asthma action plan.'
            });
        }
        if (condition === 'heart_disease' && aqi > 50) {
            newRecommendations.push({
                severity: aqi > 100 ? 'high' : 'medium',
                message: `Individuals with heart disease face increased risks with ${aqiInfo.name} air quality (AQI ${aqiInfo.range}).`,
                suggestion: 'Avoid strenuous activities. Monitor for symptoms like chest pain or shortness of breath. Consult your doctor.'
            });
        }
        if (condition === 'copd' && aqi > 50) {
           newRecommendations.push({
                severity: aqi > 100 ? 'high' : 'medium',
                message: `Individuals with COPD are at higher risk with ${aqiInfo.name} air quality (AQI ${aqiInfo.range}).`,
                suggestion: 'Limit outdoor exposure. Use prescribed medications and watch for worsening symptoms.'
            });
        }
         if (condition === 'pregnancy' && aqi > 50) {
           newRecommendations.push({
                severity: aqi > 100 ? 'high' : 'medium',
                message: `Pregnant individuals should be cautious with ${aqiInfo.name} air quality (AQI ${aqiInfo.range}).`,
                suggestion: 'Reduce exposure to pollutants, especially during high AQI days. Discuss concerns with your healthcare provider.'
            });
        }
    });


    if (exposure > 4 && aqi > 50) { 
      newRecommendations.push({
        severity: aqi > 100 ? 'high' : 'medium',
        message: `Prolonged exposure (${exposure} hours) at ${aqiInfo.name} AQI levels (${aqiInfo.range}) may increase health risks.`,
        suggestion: 'Consider taking more frequent breaks indoors or reducing overall outdoor exposure time.'
      });
    }
   
    const uniqueMessages = new Set();
    const finalRecommendations = newRecommendations.filter(rec => {
        const messageKey = `${rec.severity}-${rec.message.substring(0, 50)}`;
        if (uniqueMessages.has(messageKey)) {
            return false;
        }
        uniqueMessages.add(messageKey);
        return true;
    });


    setRecommendations(finalRecommendations);
    if (finalRecommendations.length > 0) {
        toast.success("Health impact calculated!");
    } else {
        toast.info("No specific additional recommendations based on the provided details, general AQI advice applies.");
    }
    setIsLoading(false);
  };

  return (
    <Card className="mx-auto w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Health Impact Calculator</CardTitle>
        <CardDescription>
          Enter your details and location to assess potential air quality health impacts and receive personalized recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={calculateImpact} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age (Years)</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g., 35"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                required
                min="1"
                max="120"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exposureTime">Typical Outdoor Exposure (Hours/Day)</Label>
              <Input
                id="exposureTime"
                type="number"
                step="0.5"
                placeholder="e.g., 2"
                value={formData.exposureTime}
                onChange={(e) => handleInputChange('exposureTime', e.target.value)}
                required
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationName">Location (City/Regency)</Label>
            <Input
              id="locationName"
              type="text"
              placeholder="e.g., Bojonegoro Regency or New York"
              value={formData.locationName}
              onChange={(e) => handleInputChange('locationName', e.target.value)}
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="countryName">Country</Label>
            <Input
              id="countryName"
              type="text"
              placeholder="e.g., Indonesia or USA"
              value={formData.countryName}
              onChange={(e) => handleInputChange('countryName', e.target.value)}
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="aqiLevel">Current or Predicted AQI Level</Label>
            <div className="flex items-center gap-2">
                <Input
                  id="aqiLevel"
                  type="number"
                  placeholder="e.g., 85 (focus to fetch)"
                  value={formData.aqiLevel}
                  onChange={(e) => handleInputChange('aqiLevel', e.target.value)}
                  onFocus={handleAqiInputFocus}
                  required
                  min="0"
                  max="500"
                  className="flex-grow"
                />
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={fetchCurrentAQI} 
                    disabled={isFetchingAQI || !formData.locationName}
                    className="shrink-0"
                >
                    {isFetchingAQI ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Fetch AQI
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">
                AQI level derived from overall predicted category or PM2.5. Used for health recommendations. Focus input to try auto-fetch.
            </p>
          </div>


          <div className="space-y-3">
            <Label>Pre-existing Health Conditions (Select all that apply)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {availableHealthConditions.map(condition => (
                <div key={condition.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`condition-${condition.id}`}
                    checked={formData.healthConditions.includes(condition.id)}
                    onCheckedChange={(checked) => handleCheckboxChange(condition.id, checked as boolean)}
                  />
                  <Label htmlFor={`condition-${condition.id}`} className="font-normal cursor-pointer">
                    {condition.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full py-3 text-base font-semibold">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Calculating...
              </div>
            ) : (
              'Calculate Health Impact'
            )}
          </Button>
        </form>

        {recommendations && recommendations.length > 0 && (
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-semibold text-center md:text-2xl">Health Recommendations</h3>
            {recommendations.map((rec, index) => (
              <Card key={index} className={`border-l-4 ${
                rec.severity === 'critical' ? 'border-purple-700 bg-purple-50 dark:bg-purple-900/30' : 
                rec.severity === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/30' :
                rec.severity === 'medium' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30' :
                'border-green-500 bg-green-50 dark:bg-green-900/30'
              }`}>
                <CardHeader>
                  <CardTitle className={`text-lg font-semibold ${
                    rec.severity === 'critical' ? 'text-purple-700 dark:text-purple-300' :
                    rec.severity === 'high' ? 'text-red-600 dark:text-red-400' :
                    rec.severity === 'medium' ? 'text-orange-600 dark:text-orange-400' :
                    'text-green-700 dark:text-green-400'
                  }`}>
                    {rec.severity.charAt(0).toUpperCase() + rec.severity.slice(1)} Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 pb-4">
                  <p className="font-medium text-sm md:text-base">{rec.message}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{rec.suggestion}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
         {recommendations && recommendations.length === 0 && !isLoading && (
            <div className="mt-8 text-center text-muted-foreground">
                <p>Based on the provided information, no specific additional recommendations beyond general AQI guidelines. Ensure the AQI level is current.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}