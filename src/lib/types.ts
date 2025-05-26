export interface PredictionData {
  prediction_id: string
  predicted_category: string
  probabilities: Record<string, number>
  summary: string
  date: string
  timestamp: string
}

export interface LocationData {
  latitude: number;
  longitude: number;
  formatted_address: string | null;
  display_name: string | null;
  place_id: string | null;
  source: string | null;
  city: string;
  country: string;
  location?: string;
}

export interface PollutantData {
  pm25: number
  pm10: number
  o3: number
  no2: number
  so2: number
  co: number
}

export interface AQIIndex {
  aqi: number
  category: string
  categoryDescription?: string
  displayName: string
}

export interface HealthRecommendations {
  generalPopulation?: string
  children?: string
  elderly?: string
  heartDiseasePopulation?: string
  lungDiseasePopulation?: string
  pregnantWomen?: string
  sportsPopulation?: string
  athletes?: string
}

export interface GoogleAirQualityData {
  indexes: AQIIndex[]
  health_recommendations: HealthRecommendations
}

export interface PredictionResult {
  predicted_category?: string
  summary?: string
  error?: string
}

export interface CurrentConditionsData {
  location: LocationData
  pollutants: PollutantData
  google_data?: GoogleAirQualityData
  prediction?: PredictionResult
}

export interface PredictionInputData {
  date: string
  country: string
  loc: string
  pm25?: number
  pm10?: number
  o3?: number
  no2?: number
  so2?: number
  co?: number
  auto_fill_pollutants?: boolean
}

export interface PredictionHistoryItem {
  prediction_id: string
  predicted_category: string
  summary: string
  date: string
  timestamp: string
  input_data: PredictionInputData
}

export interface HistoryData {
  predictions: PredictionHistoryItem[]
  total_count?: number
}

export interface PredictionEntry {
  prediction_id: string
  predicted_category: string
  summary: string
  date: string
  timestamp: string
  input_data: PredictionInputData
}

export interface PredictionFormData {
  date: string
  country: string
  loc: string
  auto_fill_pollutants: boolean
  pm25?: number
  pm10?: number
  o3?: number
  no2?: number
  so2?: number
  co?: number
}

export interface CurrentConditionsFormData {
  latitude: number
  longitude: number
  language_code: string
}

export interface TabsProps {
  tabs: {
    label: string
    value: string
  }[]
  defaultValue: string
  activeTab: string
  setActiveTab: (value: string) => void
  onValueChange: (value: string) => void
}

export interface HeatmapDataPoint {
  latitude: number;
  longitude: number;
  aqi: number;
}

export interface AllConditionsData {
  items: HeatmapDataPoint[];
  total_count?: number;
}

export interface AQIIndexFromCollection {
  name: string;
  aqi_value: number;
  category: string;
  dominant_pollutant?: string;
  code?: string;
  displayName?: string;
  aqi?: number;
  aqiDisplay?: string;
  color?: {
    red?: number;
    green?: number;
    blue?: number;
  };
}


export interface ConditionLocation {
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  formatted_address?: string | null;
  place_id?: string | null;
}

export interface ConditionPollutant {
  code: string;
  display_name: string;
  full_name: string;
  concentration: {
    value: number;
    units: string;
  };
}

export interface ExternalDataDetails {
  fetch_timestamp: string;
  location: ConditionLocation;
  pollutants: ConditionPollutant[];
  aqi_indexes: AQIIndexFromCollection[];
  health_recommendations?: HealthRecommendations;
  raw_data?: any;
}


export interface CurrentConditionMapItem {
  _id: { $oid: string };
  location: ConditionLocation;
  external_data_details?: ExternalDataDetails;
  pollutants: ConditionPollutant[];
  aqi_indexes: AQIIndexFromCollection[];
  google_data?: GoogleAirQualityData;
  prediction?: PredictionResult;
  date?: string;
  timestamp?: string;
  raw_data?: any;
}

export interface AllCurrentConditionsForMapResponse {
  data: CurrentConditionMapItem[];
}
