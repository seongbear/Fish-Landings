from pydantic import BaseModel
from typing import List, Optional, Any

# --- ML Input/Output ---
class FisheryInput(BaseModel):
    species: float
    state: float
    gear_type: float
    year: float
    month: float
    temperature: float
    pressure: float
    dew_point: float
    humidity: float
    wind_speed: float
    wind_chill: Optional[float] = None
    uv_index: float

class PredictionResponse(BaseModel):
    predicted_landings: float
    status: str

class ExplanationResponse(BaseModel):
    base_value: float
    top_3_drivers: List[Any]
    waterfall_plot: str  # Base64 encoded image
    force_plot: str     # Base64 encoded image
    status: str