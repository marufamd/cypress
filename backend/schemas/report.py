from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Base schema shared by both creation and response
class ReportBase(BaseModel):
    title: str
    description: str
    lat: float
    lng: float
    image_url: Optional[str] = None

# Schema used when a user submits a report
class ReportCreate(ReportBase):
    pass

# Schema used when the backend returns a report
class ReportOut(ReportBase):
    id: int
    user_id: int
    status: str
    time: datetime

    class Config:
        orm_mode = True
