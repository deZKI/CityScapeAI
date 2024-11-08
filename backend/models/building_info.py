from pydantic import BaseModel


class BuildingInfo(BaseModel):
    building_type: str  # 'residential' или 'commercial'
    levels: float       # Количество этажей
    population: int     # Население, связанное с зданием
