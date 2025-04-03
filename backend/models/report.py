from sqlalchemy import Column, Integer, String, Float, ForeignKey, datetime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)      # Primary key
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)       # Link report to user
    title = Column(String, nullable=False)                                  # Title of issue
    description = Column(String, nullable=True)                             # Description of issue
    image_url = Column(String, nullable=True)                               # Optional image

    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)                                     # Coordinate location of report

    status = Column(String, default="Pending")
    time = Column(DateTime, default=datetime.utc)                           # Time of report

    user = relationship("User", backref="reports")

