export interface LandingData {
    species: string;
    month: number;
    state: string;
    gear_type: string;
    landings: number;
    year: number;
    humidity: number;
    temperature: number;
    pressure: number;
    dew_point: number;
    wind_speed: number;
    wind_chill: number;
    uv_index: number;
    date: string;
}

export interface ForecastPayload {
    species: number;
    state: number;
    gear_type: number;
    year: number;
    month: number;
    temperature: number;
    pressure: number;
    dew_point: number;
    humidity: number;
    wind_speed: number;
    uv_index: number;
}

export interface PlotAnalysisData {
    feature: string;
    model_input_value: number;
    shap_impact: number;
    direction: string;
}