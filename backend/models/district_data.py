from typing import Optional, List

from pydantic import BaseModel

from models.people_distribution import PeopleDistribution


class DistrictData(BaseModel):
    district: str
    load_people: Optional[float]
    people_distribution: PeopleDistribution
    geometry: Optional[dict]

class BuildingTypeData(BaseModel):
    building_type: str
    building_count: int

# Модель данных для района
class DistrictBuildingData(BaseModel):
    district_name: str
    buildings: List[BuildingTypeData]