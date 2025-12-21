from pydantic import BaseModel, Field
from typing import List, Optional, Any

# --- ML Input/Output ---
class FisheryInput(BaseModel):
    species: float = Field(..., ge=1, le=15, description="Species (1-15)")
    state: float = Field(..., ge=1, le=14, description="State (1-14)")
    gear_type: float = Field(..., ge=1, le=14, description="Gear type (1-14)")
    year: float = Field(..., ge=2011, le=2030, description="Year (2000-2025)")
    month: float = Field(..., ge=1, le=12, description="Month of the year (1-12)")
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